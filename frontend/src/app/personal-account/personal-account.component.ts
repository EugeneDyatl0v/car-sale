import { Component, OnInit } from '@angular/core';
import {NgForOf, NgIf, NgOptimizedImage, NgSwitch, NgSwitchCase} from "@angular/common";
import {HttpClient, HttpHeaders, HttpClientModule} from "@angular/common/http";
import {Router} from "@angular/router";
import {AuthService} from "../services/auth.service";
import {FormsModule} from "@angular/forms";
import { DelAccService } from '../services/del-acc.service';
import {DelAccComponent} from "../del-acc/del-acc.component";

interface CarListing {
    id: string;
    title: string;
    description: string;
    price: number;
    currency: string;
    brand: string;
    model: string;
    year: number;
    mileage: number;
    fuel_type: 'DIESEL' | 'PETROL' | 'ELECTRIC' | 'HYBRID'; // добавьте другие возможные значения
    transmission: 'MANUAL' | 'AUTOMATIC' | 'ROBOT';
    body_type: 'SUV' | 'SEDAN' | 'HATCHBACK' | 'WAGON' | 'MINIVAN'; // добавьте другие типы кузова
    engine_capacity: number;
    horse_power: number;
    drive_type: 'RWD' | 'FWD' | 'AWD';
    color: string;
    vin_number: string;
    seller_name: string;
    seller_phone: string;
    seller_email: string;
    location: string;
    posted_at: string;
    images: string[];
}

interface Pagination {
    total_items: number;
    page: number;
    items_per_page: number;
    next_page: number | null;
    prev_page: number | null;
    total_pages: number;
}

interface ResponseData {
    list: CarListing[];
}

interface AdApiResponse {
    success: boolean;
    message: string;
    data: ResponseData;
    pagination: Pagination;
}

interface ImageOutSchema {
  content: string
  extension: string
}


interface imageAPIResponse {
  success: boolean;
  message: string;
  data: ImageOutSchema[];
}


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

interface RecentlyViewedApiResponse {
  success: boolean;
  message: string;
  data: CarListing[];
}

@Component({
  selector: 'app-personal-account',
  standalone: true,
  imports: [
    NgOptimizedImage,
    HttpClientModule,
    NgIf,
    NgSwitch,
    NgSwitchCase,
    FormsModule,
    DelAccComponent,
    NgForOf
  ],
  templateUrl: './personal-account.component.html',
  styleUrl: './personal-account.component.css'
})

export class PersonalAccountComponent implements OnInit{
  userName: string = 'Nikita';
  userLastName: string = 'Psshin';
  email: string = 'neverdoit@mail.com';
  phoneNumber: string = '+375206776093';
  address: string = 'Минск'
  edit:boolean = false;
  ads: AdApiResponse | null = null;
  recently_viewed_ads: RecentlyViewedApiResponse | null = null;
  imagePaths: { [key: string]: string } = {};

  constructor(private http: HttpClient,  private router: Router, private authService: AuthService, private delAccService: DelAccService) {}

  openModal() {
    this.delAccService.open('Это важное уведомление!');
  }

  login(){
    this.authService.login('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c')
  }

  ngOnInit() {
    this.fetchUserData();
    this.get_recently_viewed_ads();
  }

  save(){
    this.edit = false;
    console.log(this.phoneNumber);
  }

  on_edit(){
    this.edit = true;
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


  get_ads(page: number) {
    const headers = new HttpHeaders(
      {
        'Content-Type': 'application/json',
      }
    );

    const queryParams = {
      page: page,
      per_page: 5
    };

    this.http.get<AdApiResponse>(
      `http://localhost:8008/ad/`,
      {
        headers: headers,
        params: queryParams
      }
    ).subscribe(
      (response) => {
        if (response.success) {
          this.ads = response;
          this.ads!.data.list.forEach(ad => {
            this.loadImage(ad.id);
          });
        } else {
          console.error('Ошибка при получении изображений');
        }
      },
      (error) => {
        console.error('Ошибка HTTP-запроса:', error);
      }
    );
  }

  get_recently_viewed_ads() {
    const authToken = localStorage.getItem('authToken');

    const headers = new HttpHeaders(
      {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      }
    );


    this.http.get<RecentlyViewedApiResponse>(
      `http://localhost:8008/users/recently-viewed/`,
      {
        headers: headers,
      }
    ).subscribe(
      (response) => {
        if (response.success) {
          this.recently_viewed_ads = response;
          this.recently_viewed_ads!.data.forEach(ad => {
            this.loadImage(ad.id);
          });
        } else {
          console.error('Ошибка при получении изображений');
        }
      },
      (error) => {
        console.error('Ошибка HTTP-запроса:', error);
      }
    );
  }

  loadImage(id: string) {
    const headers = new HttpHeaders(
      {
        'Content-Type': 'application/json',
      }
    );
    let imageUrl: string = '';
    this.http.get<imageAPIResponse>(`http://localhost:8008/image/${id}/`, {headers: headers}).subscribe(
      (response) => {
        if (response.success) {
          const image = response.data[0];
          imageUrl = image.extension + ',' + image.content;
          this.imagePaths[id] = imageUrl;
        } else {
          console.error('Ошибка при получении изображений');
        }
      },
      (error) => {
        console.error('Ошибка HTTP-запроса:', error);
      }
    );

  }

  open_ad(id: string) {
    this.router.navigate([`/advertisement/${id}`]);
  }

}
