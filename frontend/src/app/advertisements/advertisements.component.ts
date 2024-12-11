import { Component, OnInit } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpClientModule,
  HttpParams
} from "@angular/common/http";
import {ActivatedRoute, Router} from "@angular/router";
import {NgForOf, NgIf} from "@angular/common";
import * as uuid from "uuid";


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
    body_type: 'SUV' | 'SEDAN' | 'HATCHBACK' | 'WAGON' | 'COUPE'; // добавьте другие типы кузова
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

interface ApiResponse {
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

interface ReportResponse {
  success: boolean;
  message: string;
  data: {
    report: {
      report_type: string
    }
  };
}

@Component({
  selector: 'app-advertisements',
  standalone: true,
  imports: [
    HttpClientModule,
    NgForOf,
    NgIf
  ],
  templateUrl: './advertisements.component.html',
  styleUrl: './advertisements.component.css'
})
export class AdvertisementsComponent {
  pageType:string|null = null;
  ads: CarListing[] = [];
  imagePaths: { [key: string]: string } = {};
  isEmpty: boolean|null = null;
  booleanList: boolean[] = [];

  constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router) {
  }

  ngOnInit(){
    this.route.paramMap.subscribe(params => {
      this.pageType = params.get('path');
      if (this.pageType == 'liked'){
        this.get_liked_ads();
      } else if (this.pageType == 'personal'){
        this.get_personal_ads();
      }
    });
  }

  get_liked_ads() {
    const headers = new HttpHeaders(
      {
        'Content-Type': 'application/json',
      }
    );


    this.http.get<ApiResponse>(
      `http://localhost:8008/ad/`,
      {
        headers: headers
      }
    ).subscribe(
      (response) => {
        if (response.success) {
          this.ads = response.data.list;
          const targetEmail = this.get_email()

          this.ads = this.ads
    .filter(car => car.seller_email !== targetEmail)

          this.ads.forEach(ad =>{
            this.check_like_status(ad.id)
          })
          this.isEmpty = this.ads.length === 0;
          this.ads.forEach(ad => {
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

  check_like_status(id:string){
    const authToken = localStorage.getItem('authToken');

        if (!authToken)
        {
          this.router.navigate(['/authorize'])
        }


        const headers = new HttpHeaders(
          {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + authToken
          }
        );

        this.http.get<ReportResponse>(
          `http://localhost:8008/reports/?ad_id=${id}`,
          {
            headers: headers
          }
        ).subscribe(
          (response) => {
            if (response.success) {
              if (response.data.report.report_type != 'LIKE'){
                this.ads = this.ads
                  .filter(car => car.id !== id)
              }
            } else this.ads = this.ads
                  .filter(car => car.id !== id)
          },
          (error) => {
            console.error('Ошибка HTTP-запроса:', error);
          }
        );
  }

  get_personal_ads() {
    const headers = new HttpHeaders(
      {
        'Content-Type': 'application/json',
      }
    );


    this.http.get<ApiResponse>(
      `http://localhost:8008/ad/`,
      {
        headers: headers
      }
    ).subscribe(
      (response) => {
        if (response.success) {
          this.ads = response.data.list;
          this.isEmpty = this.ads.length === 0;
          const targetEmail = this.get_email()
          this.ads = this.ads
    .filter(car => car.seller_email === targetEmail)
          this.ads.forEach(ad => {
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

  get_email(){
    const authToken = localStorage.getItem('authToken');
      let payload = this.decodeJWT(authToken!);
      return payload.payload.user_info.email;
  }

  decodeJWT(token: string): any {
    try {
        const [headerB64, payloadB64] = token.split('.');
        const payload = JSON.parse(atob(payloadB64));
        return {
            payload
        };
        }
        catch (error) {
        throw new Error('Invalid JWT token');
    }
  }

  formatPrice(price: number): string {
    // Преобразуем число в строку и разбиваем на тройки с конца
    return price.toString().replace(/\B(?=(\d{3})+(?!))/g, ' ');
  }
}
