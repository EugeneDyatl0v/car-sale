import { Component } from '@angular/core';
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import {FormsModule} from "@angular/forms";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-registration-email-confirmation',
  standalone: true,
  imports: [
    FormsModule,
    NgIf,
    HttpClientModule
  ],
  templateUrl: './registration-email-confirmation.component.html',
  styleUrl: './registration-email-confirmation.component.css'
})
export class RegistrationEmailConfirmationComponent {
  verificationCode: string = '';
  email: string = ''; // Здесь можно передать email через query параметр
  showAlert: boolean = false;
  alertMessage: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  onSubmit(event: Event) {
    event.preventDefault();

    // Проверка, введен ли код подтверждения
    if (!this.verificationCode) {
      this.alertMessage = 'Пожалуйста, введите код подтверждения.';
      this.showAlert = true;
      return;
    }

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    // Отправка POST-запроса на сервер для проверки кода
    this.http.patch(`http://localhost:8002/registration/${this.verificationCode}`, { headers })
      .subscribe({
        next: (v) => {
          // Успешное подтверждение
          this.showAlert = false;
          // Перенаправление на страницу авторизации
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
