import {Component} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpClient, HttpClientModule, HttpHeaders} from "@angular/common/http";
import {NgForOf} from "@angular/common";
import {Router} from "@angular/router";
/*import {FilterSidebarComponent} from "../filter-sidebar/filter-sidebar.component";*/
import {MatInput} from "@angular/material/input";
import {FilterSidebarComponent} from "../filter-sidebar/filter-sidebar.component";


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

enum FuelType {
    PETROL = "Бензин",
    DIESEL = "Дизель",
    ELECTRIC = "Электричество",
    HYBRID = "Гибрид",
    GAS = "Газ"
}

enum Transmission {
    MANUAL = "Ручная",
    AUTOMATIC = "Автоматическая",
    CVT = "Робот"
}

enum BodyType {
    SEDAN = "Седан",
    SUV = "Внедорожник",
    HATCHBACK = "Хетчбэк",
    WAGON = "Универсал",
    COUPE = "Купе",
    MINIVAN = "Минивэн"
}

enum DriveType {
    FWD = "Передний",
    RWD = "Задний",
    AWD = "Полный"
}

interface BrandsApiResponse {
  success: boolean;
  message: string;
  data: {
    brands: string[];
  };
}

interface ModelsApiResponse {
  success: boolean;
  message: string;
  data: {
    models: string[];
  };
}


@Component({
  selector: 'app-advertisement-list',
  standalone: true,
  imports: [
    FormsModule,
    HttpClientModule,
    NgForOf,
    /*FilterSidebarComponent,*/
    MatInput,
    ReactiveFormsModule,
    FilterSidebarComponent
  ],
  templateUrl: './advertisement-list.component.html',
  styleUrl: './advertisement-list.component.css'
})
export class AdvertisementListComponent {
  searchQuery: string = '';
  ads_per_page: number = 9;
  current_page: number = 1;
  pages_count: number = 1;
  ads: ApiResponse | null = null;
  imagePaths: { [key: string]: string } = {};
  filterForm: FormGroup;

  constructor(private http: HttpClient, private router: Router, private fb: FormBuilder) {
    this.imagePaths = {};
    this.get_ads(1);
    this.filterForm = this.fb.group({
      brand: [''],
      model: [''],
      generation: [''],
      bodyType: [''],
      transmission: [''],
      drive: [''],
      fuelType: [''],
      engineFrom: [''],
      engineTo: [''],
      yearFrom: [''],
      yearTo: [''],
      mileageFrom: [''],
      mileageTo: [''],
      volumeFrom: [''],
      volumeTo: [''],
      priceFrom: [''],
      priceTo: [''],
      credit: [false],
      noMileageInRF: [false]
    });
  }

  ngOnInit(){
    this.fetchBrandsData();

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

  fetchBrandsData(){
    const headers = new HttpHeaders(
      {
        'Content-Type': 'application/json',
      }
    );

    this.http.get<BrandsApiResponse>(`http://localhost:8008/cars/brands/`, {headers: headers}).subscribe(
      (response) => {
        if (response.success) {
          console.log(response);
          this.brands = response.data.brands;

        } else {
          console.error('Ошибка при получении данных пользователя');
        }
      },
      (error) => {
        console.error('Ошибка HTTP-запроса:', error);
      }
    );
  }


  fetchModelsData(){
    const headers = new HttpHeaders(
      {
        'Content-Type': 'application/json',
      }
    );

    this.http.get<ModelsApiResponse>(`http://localhost:8008/cars/${this.selectedBrand}/models/`, {headers: headers}).subscribe(
      (response) => {
        if (response.success) {
          this.models = response.data.models;

        } else {
          console.error('Ошибка при получении данных пользователя');
        }
      },
      (error) => {
        console.error('Ошибка HTTP-запроса:', error);
      }
    );
  }

  setPage(page: number) {
    this.current_page = page;
    this.get_ads(this.current_page);
  }

  open_ad(id: string) {
    this.router.navigate([`/advertisement/${id}`]);
  }


  brands: string[] = [];
  models: string[] = [];
  bodyTypes: string[] = ["Седан", "Внедорожник", "Хетчбэк", "Универсал", "Купе", "Минивэн", "ГГрузовик"];
  transmissions: string[] = ["Автомат", "Механика", "Робот"];
  drives: string[] = ["Передний привод", "Задний привод", "Полный привод"];
  fuelTypes: string[] = ["Бензин", "Дизель", "Электричество", "Гибрид", "Газ"];
  selectedBrand: string = '';
  selectedModel: string = '';

  onBrandChange() {
    this.fetchModelsData()
    console.log(this.models)
  }

  onSubmit(): void {
    console.log(this.selectedBrand); // Output form data
    console.log(this.selectedModel);
  }
}
