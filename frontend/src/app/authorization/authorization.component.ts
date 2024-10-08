import { Component } from '@angular/core';
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {HttpClientModule, HttpClient, HttpHeaders} from "@angular/common/http";
import {Router} from "@angular/router";

@Component({
  selector: 'app-authorization',
  standalone: true,
  imports: [
    CommonModule, FormsModule, HttpClientModule
  ],
  templateUrl: './authorization.component.html',
  styleUrl: './authorization.component.css'
})


export class AuthorizationComponent {
  email: string = '';
  password: string = '';

  constructor(private http: HttpClient, private router: Router) {
  }

  showAlert: boolean = false;  // Переменная для управления видимостью уведомления
  alertMessage: string = '';   // Сообщение для уведомления

  onSubmit(event: Event) {
    event.preventDefault();

    if (!this.email || !this.password) {
      this.alertMessage = 'Пожалуйста, заполните все поля.';
      this.showAlert = true;

      setTimeout(() => {
        this.showAlert = false;
      }, 3000);
      return;
    }

    const data = {
      email: this.email,
      password: this.password,
    };

    const headers = new HttpHeaders(
      {
        'Content-Type': 'application/json',
      }
    );

    this.http.post('http://localhost:8002/auth/login/', data, {headers: headers})
      .subscribe({
        next: (response: any) => {
          const authToken = response.auth_token; // получаем auth токен из ответа
          const refreshToken = response.refresh_token; // получаем refresh токен (при необходимости)
          localStorage.setItem('authToken', authToken); // сохраняем auth токен в localStorage
          localStorage.setItem('refreshToken', refreshToken); // сохраняем refresh токен в localStorage (если нужно)

          // Перенаправление на другую страницу после успешного логина
          this.router.navigate(['/']);
          this.showAlert = false;
        },
        error: (e) => {
          console.error(e);
          if (e.status === 400 && e.error && e.error.message === "Wrong credentials") {
            this.alertMessage = 'Почта или пароль некоректны.';
            this.showAlert = true;

            // Убираем уведомление через 3 секунды
            setTimeout(() => {
              this.showAlert = false;
            }, 3000);
          }
          if (e.status === 403 && e.error && e.error.message === "Account not verified") {
            this.alertMessage = 'Вы ещё не подтвердили свою почту.';
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
