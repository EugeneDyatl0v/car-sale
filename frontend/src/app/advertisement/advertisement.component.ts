import {Component, OnInit} from '@angular/core';
import {NgForOf, NgIf, NgOptimizedImage} from "@angular/common";
import {HttpClient, HttpHeaders, HttpClientModule} from "@angular/common/http";
import {ActivatedRoute, Router} from "@angular/router";
import {combineLatestAll} from "rxjs";

interface ApiResponse {
  success: boolean;
  message: string;
  data: {
    ad: {
      title: string;
      description: string;
      price: number;
      currency: 'USD' | 'EUR' | 'RUB'; // Ограничение значений для валюты
      brand: string;
      model: string;
      year: number;
      mileage: number;
      fuel_type: 'PETROL' | 'DIESEL' | 'ELECTRIC' | 'HYBRID'; // Ограничение значений для типа топлива
      transmission: 'MANUAL' | 'AUTOMATIC' | 'CVT'; // Ограничение значений для трансмиссии
      body_type: 'SEDAN' | 'SUV' | 'HATCHBACK' | 'WAGON' | 'COUPE'; // Ограничение значений для типа кузова
      engine_capacity: number;
      horse_power: number;
      drive_type: 'FWD' | 'RWD' | 'AWD'; // Ограничение значений для типа привода
      color: string;
      vin_number: string;
      seller_name: string;
      seller_phone: string;
      seller_email: string;
      location: string;
      posted_at:string;
      images:string[];
    };
  };
}


@Component({
  selector: 'app-advertisement',
  standalone: true,
  imports: [
    NgOptimizedImage,
    NgIf,
    HttpClientModule,
    NgForOf
  ],
  templateUrl: './advertisement.component.html',
  styleUrl: './advertisement.component.css'
})
export class AdvertisementComponent implements OnInit{
  adId: string | null = null;
  myAdData: Partial<ApiResponse['data']['ad']> = {};
  info: string | undefined = '';
  clicked: boolean = false;

  constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router) {
  }

  ngOnInit(){
    this.route.paramMap.subscribe(params => {
      this.adId = params.get('id');
      if (this.adId){
        this.fetchAdData(this.adId);
      } else {
        this.router.navigate(['/']);
      }
    });
  }

  fetchAdData(id: string) {

    const headers = new HttpHeaders(
      {
        'Content-Type': 'application/json',
      }
    );

    this.http.get<ApiResponse>(`http://localhost:8008/ad/${id}`, {headers: headers}).subscribe(
      (response) => {
        if (response.success) {
          this.myAdData = response.data.ad;
          console.log(response.data.ad)
          console.log(this.myAdData)
        } else {
          console.error('Ошибка при получении данных пользователя');
        }
      },
      (error) => {
        console.error('Ошибка HTTP-запроса:', error);
      }
    );
  }

  on_click_phone() {
    this.info = this.myAdData.seller_phone;
    this.clicked = true;
  }


  on_click_email() {
    this.info = this.myAdData.seller_email;
    this.clicked = true;
  }
}
