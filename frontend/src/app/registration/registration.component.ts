import { Component } from '@angular/core';
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {HttpClientModule, HttpClient, HttpHeaders} from "@angular/common/http";
import {Router} from "@angular/router";

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.css'
})
export class RegistrationComponent {
  email: string = '';
  password: string = '';
  repeatPassword: string = '';
  userName: string = '';
  userLastName: string = '';
  mobilePhone: string = '';
  address: string = '';

  constructor(private http: HttpClient,  private router: Router) {
  }

  showAlert: boolean = false;  // Переменная для управления видимостью уведомления
  alertMessage: string = '';   // Сообщение для уведомления

  onSubmit(event: Event) {
    event.preventDefault();

    if (!this.email || !this.password || !this.repeatPassword) {
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

    const user_create_data = {
      user_name: this.userName,
      user_last_name: this.userLastName,
      email: this.email,
      phone_number: this.mobilePhone,
      address: this.address
    }

    const data = {
      email: this.email,
      password: this.password,
      repeat_password: this.repeatPassword
    };

    const headers = new HttpHeaders(
      {
        'Content-Type': 'application/json',
      }
    );

    this.http.post('http://localhost:8002/registration/?app=auto-shop', data, {headers: headers})
      .subscribe({
        next: (v) => {
          console.log(v);
          this.showAlert = false;

          this.http.post('http://localhost:8008/users/', user_create_data, {headers: headers}).subscribe(
            {
              next: (v) => {
                console.log(v);
              },
              error: (e) => {
                console.log(e);
              },
            }
          )

          this.router.navigate(['/registration/email-verification'], { queryParams: { email: this.email } });
        },
        error: (e) => {
          console.error(e);
          if (e.status === 400 && e.error && e.error.message === "User already exists") {
            this.alertMessage = 'Пользователь с такой почтой уже зарегистрирован.';
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
