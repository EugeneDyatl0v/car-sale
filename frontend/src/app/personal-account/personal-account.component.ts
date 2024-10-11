import { Component, OnInit } from '@angular/core';
import {NgOptimizedImage} from "@angular/common";
import {HttpClient, HttpHeaders, HttpClientModule} from "@angular/common/http";
import {Router} from "@angular/router";
import {AuthService} from "../services/auth.service";

interface ApiResponse {
  success: boolean;
  message: string;
  data: {
    user: {
      user_name: string;
      user_last_name: string;
      email: string;
      phone_number: string;
      address: string;
    }
  }
}

@Component({
  selector: 'app-personal-account',
  standalone: true,
  imports: [
    NgOptimizedImage,
    HttpClientModule
  ],
  templateUrl: './personal-account.component.html',
  styleUrl: './personal-account.component.css'
})

export class PersonalAccountComponent implements OnInit{
  imagePath: string = '../images/audi.jpg';
  userName: string = '';
  userLastName: string = '';
  email: string = '';
  phoneNumber: string = '';
  address: string = ''

  constructor(private http: HttpClient,  private router: Router, private authService: AuthService) {
  }


  ngOnInit() {
    this.fetchUserData();
  }

  on_click() {
    this.authService.logout();

    this.router.navigate(['/'])
  }

  fetchUserData() {
    const authToken = localStorage.getItem('authToken');

    if (!authToken)
    {
      this.router.navigate(['/'])
    }


    const headers = new HttpHeaders(
      {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      }
    );

    this.http.get<ApiResponse>('http://localhost:8008/users/', {headers: headers}).subscribe(
      (response) => {
        if (response.success) {
          const userData = response.data.user;
          this.userName = userData.user_name;
          this.userLastName = userData.user_last_name;
          this.email = userData.email;
          this.phoneNumber = userData.phone_number;
          this.address = userData.address;
        } else {
          console.error('Ошибка при получении данных пользователя');
        }
      },
      (error) => {
        console.error('Ошибка HTTP-запроса:', error);
      }
    );
  }

}
