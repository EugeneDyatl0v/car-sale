import {Component} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpClient, HttpClientModule, HttpHeaders, HttpParams} from "@angular/common/http";
import {NgForOf} from "@angular/common";
import {Router} from "@angular/router";
import {MatInput} from "@angular/material/input";
import {FilterSidebarComponent} from "../filter-sidebar/filter-sidebar.component";


interface QueryParams {
    page: number;        // Обязательный параметр
    per_page: number;    // Обязательный параметр
    brand?: string|null;       // Опциональный параметр
    model?: string|null;     // Опциональный параметр
    drive?: string|null;
    bodyType?: string|null;
    fuelType?: string|null;
    transmission?: string|null;
    mileageFrom?: number|null;
    mileageTo?:  number|null;
    volumeFrom?: number|null;
    volumeTo?: number|null;
    powerFrom?: number|null;
    powerTo?:  number|null;
    yearFrom?: number|null;
    yearTo?:  number|null;
    priceFrom?: number|null;
    priceTo?:  number|null;
    currency?: string|null;
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
  ads_per_page: number = 9;
  current_page: number = 1;
  pages_count: number = 1;
  ads: ApiResponse | null = null;
  imagePaths: { [key: string]: string } = {};

  constructor(private http: HttpClient, private router: Router, private fb: FormBuilder) {
    this.imagePaths = {};
    const query:QueryParams = {
      page: this.current_page,
      per_page: this.ads_per_page
    };
    this.get_ads(this.current_page, query);
  }

  ngOnInit(){
    this.fetchBrandsData();
  }

  get_ads(page: number, query:QueryParams) {
    const headers = new HttpHeaders(
      {
        'Content-Type': 'application/json',
      }
    );

    let params = new HttpParams()
      .set('page', query.page.toString())
      .set('per_page', query.per_page.toString());

    // Функция для добавления параметров
    const addParam = (key: string, value: any) => {
      if (value !== null && value !== undefined) {
        params = params.set(key, value.toString());
      }
    };

    // Добавляем опциональные параметры
        if (query.brand) addParam('brand', query.brand);
    if (query.model) addParam('model', query.model);
    if (query.drive) addParam('drive', query.drive);
    if (query.bodyType) addParam('bodyType', query.bodyType);
    if (query.fuelType) addParam('fuelType', query.fuelType);
    if (query.transmission) addParam('transmission', query.transmission);
    if (query.mileageFrom !== null) addParam('mileageFrom', query.mileageFrom);
    if (query.mileageTo !== null) addParam('mileageTo', query.mileageTo);
    if (query.volumeFrom !== null) addParam('volumeFrom', query.volumeFrom);
    if (query.volumeTo !== null) addParam('volumeTo', query.volumeTo);
    if (query.powerFrom !== null) addParam('powerFrom', query.powerFrom);
    if (query.powerTo !== null) addParam('powerTo', query.powerTo);
    if (query.yearFrom !== null) addParam('yearFrom', query.yearFrom);
    if (query.yearTo !== null) addParam('yearTo', query.yearTo);
    if (query.priceFrom !== null) addParam('priceFrom', query.priceFrom);
    if (query.priceTo !== null) addParam('priceTo', query.priceTo);
    if (query.currency) addParam('currency', query.currency);
    console.log(params)
    this.http.get<ApiResponse>(
      `http://localhost:8008/ad/`,
      {
        headers: headers,
        params: params
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
    const queryParams = {
      page: page,
      per_page: this.ads_per_page
    };
    this.get_ads(this.current_page, queryParams);
  }

  open_ad(id: string) {
    this.router.navigate([`/advertisement/${id}`]);
  }


  brands: string[] = [];
  models: string[] = [];
  bodyTypes: string[] = Object.values(BodyType);
  transmissions: string[] = Object.values(Transmission);
  drives: string[] = Object.values(DriveType);
  fuelTypes: string[] = Object.values(FuelType);
  selectedBrand: string|null = null;
  selectedModel: string|null = null;
  selectedDriveType: string|null = null;
  selectedBodyType: string|null = null;
  selectedTransmission: string|null = null;
  selectedFuelType: string|null = null;
  mileageFrom: number|null = null;
  mileageTo:  number|null = null;
  volumeFrom: number|null = null;
  volumeTo: number|null = null;
  powerFrom: number|null = null;
  powerTo:  number|null = null;
  maxYear: number = new Date().getFullYear();
  minYear: number = 1940;
  yearFrom: number|null = null;
  yearTo:  number|null = null;
  priceFrom: number|null = null;
  priceTo:  number|null = null;
  selectedCurrency: string|null = null;

  onBrandChange() {
    if (typeof this.selectedBrand === "string") {
      this.selectedBrand = this.selectedBrand.charAt(0).toUpperCase() + this.selectedBrand.slice(1)
    }
    this.fetchModelsData()
    this.selectedModel = '';
    console.log(this.models)
  }

  onKeyDownBrand(event: KeyboardEvent) {
    // Проверка, является ли нажатая клавиша символом Backspace или Delete
    if (event.key === 'Backspace' || event.key === 'Delete') {
      return; // Разрешаем удаление
    }

    if (typeof this.selectedBrand === "string") {
      // Получаем текущее значение поля ввода
      const currentInputValue: string = this.selectedBrand;

      // Проверяем, допустимо ли текущее значение
      if (!this.brands.some(brand => brand.startsWith(currentInputValue.charAt(0).toUpperCase() + currentInputValue.slice(1)))) {
        //event.preventDefault(); // Запрещаем ввод, если значение не соответствует
        this.selectedBrand = currentInputValue.slice(0, -1);
      }
    }
  }

  onKeyDownModel(event: KeyboardEvent) {
    // Проверка, является ли нажатая клавиша символом Backspace или Delete
    if (event.key === 'Backspace' || event.key === 'Delete') {
      return; // Разрешаем удаление
    }

    if (typeof this.selectedModel === "string") {
      // Получаем текущее значение поля ввода
      const currentInputValue: string = this.selectedModel;

      // Проверяем, допустимо ли текущее значение
      if (!this.models.some(model => model.startsWith(currentInputValue.charAt(0).toUpperCase() + currentInputValue.slice(1)))) {
        //event.preventDefault(); // Запрещаем ввод, если значение не соответствует
        this.selectedModel = currentInputValue.slice(0, -1);
      }
    }
  }



  onSubmit(): void {
    if (this.selectedBrand === ''){
      this.selectedBrand = null;
    }
    if (this.selectedModel === ''){
      this.selectedModel = null;
    }
    if (this.selectedModel !== null && this.selectedBrand === null){
      this.selectedModel = null;
    }

    const query:QueryParams = {
      page: 1,
      per_page: this.ads_per_page,
      brand: this.selectedBrand,       // Опциональный параметр
      model: this.selectedModel,     // Опциональный параметр
      drive: this.selectedDriveType,
      bodyType: this.selectedBodyType,
      fuelType: this.selectedFuelType,
      transmission: this.selectedTransmission,
      mileageFrom: this.mileageFrom,
      mileageTo:  this.mileageTo,
      volumeFrom: this.volumeFrom,
      volumeTo: this.volumeTo,
      powerFrom: this.powerFrom,
      powerTo:  this.powerTo,
      yearFrom: this.yearFrom,
      yearTo:  this.yearTo,
      priceFrom: this.priceFrom,
      priceTo:  this.priceTo,
      currency: this.selectedCurrency
    };

    this.get_ads(1, query);

    console.log(this.selectedBrand); // Output form data
    console.log(this.selectedModel);
    console.log(this.selectedDriveType);
    console.log(this.selectedBodyType);
    console.log(this.selectedTransmission);
    console.log(this.selectedFuelType);
    console.log(this.mileageFrom);
    console.log(this.mileageTo);
    console.log(this.volumeFrom)
    console.log(this.volumeTo);
    console.log(this.powerFrom);
    console.log(this.powerTo);
    console.log(this.yearFrom);
    console.log(this.yearTo);

    console.log(this.priceFrom);
    console.log(this.priceTo);

    console.log(this.selectedCurrency);


  }

  protected readonly Object = Object;
}
