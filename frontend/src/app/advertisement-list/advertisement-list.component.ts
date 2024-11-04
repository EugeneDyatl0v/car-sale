import {Component} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {FilterSettingsComponent} from "../filter-settings/filter-settings.component";
import {FilterService} from "../services/filter.service";
import {HttpClient, HttpClientModule, HttpHeaders} from "@angular/common/http";
import {NgForOf} from "@angular/common";
import {Router} from "@angular/router";


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
    transmission: 'MANUAL' | 'AUTOMATIC';
    body_type: 'SUV' | 'SEDAN' | 'HATCHBACK' | 'WAGON'; // добавьте другие типы кузова
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


@Component({
  selector: 'app-advertisement-list',
  standalone: true,
  imports: [
    FormsModule,
    FilterSettingsComponent,
    HttpClientModule,
    NgForOf
  ],
  templateUrl: './advertisement-list.component.html',
  styleUrl: './advertisement-list.component.css'
})
export class AdvertisementListComponent {
  searchQuery: string = '';
  ads_per_page: number = 2;
  current_page: number = 1;
  pages_count: number = 1;
  ads: ApiResponse | null = null;
  imagePaths: { [key: string]: string } = {};

  constructor(private filterService: FilterService, private http: HttpClient, private router: Router) {
    this.imagePaths = {};
    this.get_ads(1);
  }


  get_ads(page: number) {
    const headers = new HttpHeaders(
      {
        'Content-Type': 'application/json',
      }
    );

    const queryParams = {
      page: page,
      per_page: this.ads_per_page
    };

    this.http.get<ApiResponse>(
      `http://localhost:8008/ad/`,
      {
        headers: headers,
        params: queryParams
      }
    ).subscribe(
      (response) => {
        if (response.success) {
          this.ads = response;
          this.pages_count = response.pagination.total_pages;
          this.ads!.data.list.forEach(ad => {
            this.loadImage(ad.id);
          });
          console.log(this.imagePaths)
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

  openModal() {

    this.filterService.open('Это важное уведомление!');
  }

  onSearch() {
    console.log('Значение input:', this.searchQuery); // Здесь можно выполнить действие с значением
    // Логика, связанная с отправкой значения
  }

  setPage(page: number) {
    this.current_page = page;
    this.get_ads(this.current_page);
  }

  open_ad(id: string) {
    this.router.navigate([`/advertisement/${id}`]);
  }

}
