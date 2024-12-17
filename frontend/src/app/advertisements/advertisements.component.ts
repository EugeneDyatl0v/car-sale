import {Component, OnInit, Query} from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpClientModule,
  HttpParams
} from "@angular/common/http";
import {ActivatedRoute, Router} from "@angular/router";
import {NgForOf, NgIf} from "@angular/common";

interface QueryParams {
    page: number;        // Обязательный параметр
    per_page: number;
}

interface QueryParamsOwn {
    page: number;        // Обязательный параметр
    per_page: number;    // Обязательный параметр
    own: boolean;
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
  isEmpty: boolean = true;
  booleanList: boolean[] = [];
  ads_per_page: number = 9;
  current_page: number = 1;
  pages_count: number = 1;

  constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router) {
  }

   ngOnInit(){
    this.route.paramMap.subscribe(async params => {
      this.pageType = params.get('path');
      console.log('1')
      console.log(this.isEmpty)
      if (this.pageType == 'liked') {
                   const queryParams:QueryParams = {
      page: this.current_page,
      per_page: this.ads_per_page
    };
         this.get_liked_ads(queryParams);
      } else if (this.pageType == 'personal') {
                   const queryParams:QueryParamsOwn = {
      page: this.current_page,
      per_page: this.ads_per_page,
             own: true
    };
                   this.get_personal_ads(queryParams);
      }
      this.isEmpty = this.ads.length === 0;
      //document.getElementById('content').style.display = 'block';
    });
  }

   get_liked_ads(queryParams:QueryParams){
    console.log('21')
    console.log(this.isEmpty)
    const authToken = localStorage.getItem('authToken');
    if (!authToken)
    {
      this.router.navigate(['/authorization'])
    }

    const headers = new HttpHeaders(
      {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      }
    );


    let params = new HttpParams()
      .set('page', queryParams.page.toString())
      .set('per_page', queryParams.per_page.toString());

    this.http.get<ApiResponse>(
      `http://localhost:8008/ad/liked/`,
      {
        headers: headers,
        params: params
      }
    ).subscribe(
      (response:ApiResponse) => {
        if (response.success) {
          console.log('31')
          console.log(this.isEmpty)
          this.ads = response.data.list;
           this.pages_count = response.pagination.total_pages;
          console.log(this.pages_count)
          this.ads!.forEach(ad => {
            this.loadImage(ad.id);
          });
          this.isEmpty = this.ads.length === 0;
          console.log('41')
          console.log(this.isEmpty)
          console.log(this.ads)
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
      this.router.navigate(['/authorization'])
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
              console.log("1")
              console.log(response.data.report.report_type)
              if (response.data.report.report_type != 'LIKE'){
                console.log("2")
                this.ads = this.ads
                  .filter(car => car.id !== id)

              }
              console.log("выход")
            } else {
              console.log(3)
              this.ads = this.ads
                  .filter(car => car.id !== id)
              console.log("выход")
            }
          },
          (error) => {
            console.error('Ошибка HTTP-запроса:', error);
          }
        );
  }

  get_personal_ads(queryParams:QueryParamsOwn) {
    console.log('22')
    console.log(this.isEmpty)
    const authToken = localStorage.getItem('authToken');
    if (!authToken)
    {
      this.router.navigate(['/authorization'])
    }

    const headers = new HttpHeaders(
      {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      }
    );




    let params = new HttpParams()
      .set('page', queryParams.page.toString())
      .set('per_page', queryParams.per_page.toString())
      .set('own', queryParams.own.toString());

    this.http.get<ApiResponse>(
      `http://localhost:8008/ad/`,
      {
        headers: headers,
        params: params
      }
    ).subscribe(
      (response) => {
        if (response.success) {
          console.log('32')
          console.log(this.isEmpty)
          this.ads = response.data.list;
 this.pages_count = response.pagination.total_pages;
          console.log(this.pages_count)
          this.ads!.forEach(ad => {
            this.loadImage(ad.id);
          });
          this.isEmpty = this.ads.length === 0;
          console.log('42')
          console.log(this.isEmpty)
          console.log(this.ads)
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
    if (!authToken)
    {
      this.router.navigate(['/authorization'])
    }
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

  setPage(page: number) {
    this.current_page = page;

     if (this.pageType == 'liked') {
       const queryParams:QueryParams = {
      page: page,
      per_page: this.ads_per_page
    };
       this.get_liked_ads(queryParams);
      } else if (this.pageType == 'personal') {
           const queryParams:QueryParamsOwn = {
      page: page,
      per_page: this.ads_per_page,
             own: true
    };
       this.get_personal_ads(queryParams);
      }
    //this.get_ads(this.current_page, queryParams);
  }
}
