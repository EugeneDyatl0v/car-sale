import { Component } from '@angular/core';
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';
import {ActivatedRoute, Router} from '@angular/router';
import {FormsModule} from "@angular/forms";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-password-recovery-email-verification',
  standalone: true,
  imports: [
    FormsModule,
    NgIf,
    HttpClientModule
  ],
  templateUrl: './password-recovery-email-verification.component.html',
  styleUrl: './password-recovery-email-verification.component.css'
})
export class PasswordRecoveryEmailVerificationComponent {
  verificationCode: string = '';
  password: string = '';
  repeatPassword: string = '';
  showAlert: boolean = false;
  alertMessage: string = '';

  constructor(private http: HttpClient, private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.verificationCode = this.route.snapshot.queryParamMap.get('verificationCode') || '';

    // Если verificationCode отсутствует
    if (!this.verificationCode) {
      this.alertMessage = 'Некорректный запрос. Отсутствует код подтверждения.';
      this.showAlert = true;
    }
  }

  onSubmit(event: Event) {
    event.preventDefault();

    if (!this.password || !this.repeatPassword) {
      this.alertMessage = 'Пожалуйста, заполните все поля.';
      this.showAlert = true;

      setTimeout(() => {
        this.showAlert = false;
      }, 3000);
      return;
    }

    if (this.password !== this.repeatPassword) {
      this.alertMessage = 'Пароли не совпадают. Пожалуйста, проверьте введенные данные.';
      this.showAlert = true;

      // Убираем уведомление через 3 секунды
      setTimeout(() => {
        this.showAlert = false;
      }, 3000);
      return;
    }

    const data = {
      password: this.password,
      repeat_password: this.repeatPassword
    };

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http.patch(`http://localhost:8002/password-recovery/${this.verificationCode}`, data, { headers })
      .subscribe({
        next: (v) => {
          this.showAlert = false;
          this.router.navigate(['/authorization']);
        },
        error: (e) => {
          console.error(e);
          // Показ сообщения об ошибке
          if (e.status === 400) {
            this.alertMessage = 'Неверный код подтверждения.';
            this.showAlert = true;
          } else {
            this.alertMessage = 'Произошла ошибка. Попробуйте еще раз.';
            this.showAlert = true;
          }
        }
      });
  }
}
