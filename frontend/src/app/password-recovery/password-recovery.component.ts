import { Component } from '@angular/core';
import {FormsModule} from "@angular/forms";
import {NgIf} from "@angular/common";
import {HttpClient, HttpHeaders, HttpClientModule} from "@angular/common/http";
import {Router} from "@angular/router";

@Component({
  selector: 'app-password-recovery',
  standalone: true,
  imports: [
    FormsModule,
    NgIf,
    HttpClientModule
  ],
  templateUrl: './password-recovery.component.html',
  styleUrl: './password-recovery.component.css'
})
export class PasswordRecoveryComponent {
  email: string = '';
  showAlert: boolean = false;
  alertMessage: string = '';

  constructor(private http: HttpClient,  private router: Router) {
  }

  onSubmit(event: Event) {
    event.preventDefault();
    if (!this.email) {
      this.alertMessage = 'Пожалуйста, введите ваш Email.';
      this.showAlert = true;
    } else {
      const data = {
        email: this.email,
      };

      const headers = new HttpHeaders(
        {
          'Content-Type': 'application/json',
        }
      );

      this.http.post('http://localhost:8002/password-recovery/request', data, {headers: headers})
        .subscribe({
          next: (v) => {
            console.log(v);
            this.showAlert = false;
          },
          error: (e) => {
            console.error(e);
            if (e.status === 400 && e.error && e.error.message === "Invalid credentials") {
              this.alertMessage = 'Пользователь с такой почтой ещё зарегистрирован.';
              this.showAlert = true;

              // Убираем уведомление через 3 секунды
              setTimeout(() => {
                this.showAlert = false;
              }, 3000);
            }
          },
          complete: () => console.info('complete')
        })
    }
  }
}
