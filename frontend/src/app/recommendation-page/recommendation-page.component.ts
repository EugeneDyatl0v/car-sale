import {Component, OnInit} from '@angular/core';
import {NgForOf, NgIf, NgSwitch, NgSwitchCase} from "@angular/common";
import {DraggableYearSelectorComponent} from "../draggable-year-selector/draggable-year-selector.component";
import {HttpClient, HttpHeaders, HttpClientModule} from "@angular/common/http";
import {Router} from "@angular/router";

enum FuelType {
    PETROL = "Бензин",
    DIESEL = "Дизель",
    ELECTRIC = "Электричество",
    HYBRID = "Гибрид"
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
    COUPE = "Купе"
}

enum DriveType {
    FWD = "Передний",
    RWD = "Задний",
    AWD = "Полный"
}

interface RecommendationList {
  brand: string[];
  year_from: number;
  year_to: number;
  fuel_type: string[];
  transmission: string[];
  body_type: string[];
  drive_type: string[];
}

interface RecommendationListGet {
  brand: string[];
  year_from: number;
  year_to: number;
  fuel_type: string[];
  transmission: string[];
  body_type: string[];
  drive_type: string[];
  id: string;
}

interface BrandsApiResponse {
  success: boolean;
  message: string;
  data: {
    brands: string[];
  };
}

interface RecommendationCreateResponse {
  success: boolean;
  message: string;
  data: {
    recommendation: {};
  };
}

interface RecommendationResponse {
  success: boolean;
  message: string;
  data: {
    recommendation: RecommendationListGet;
  };
}



@Component({
  selector: 'app-recommendation-page',
  standalone: true,
  imports: [
    NgSwitch,
    NgSwitchCase,
    NgIf,
    NgForOf,
    DraggableYearSelectorComponent,
    HttpClientModule
  ],
  templateUrl: './recommendation-page.component.html',
  styleUrl: './recommendation-page.component.css'
})
export class RecommendationPageComponent implements OnInit{
  pages = ['page1', 'page2', 'page3', 'page4'];
  currentPageIndex = 0;
  selectedBrands: string[] = [];
  selectedYearFrom: number = 0;
  selectedYearTo: number = 0;
  selectedFuelType: string[] = [];
  selectedTransmisson: string[] = [];
  selectedBodyType: string[] = [];
  selectedDriveType: string[] = [];
  brands: string[] = [];
  bodyTypes: string[] = Object.values(BodyType);
  transmissions: string[] = Object.values(Transmission);
  drives: string[] = Object.values(DriveType);
  fuelTypes: string[] = Object.values(FuelType);
  error: boolean = false;
  recom: RecommendationListGet = {
    brand: [],
    year_from: 0,
    year_to: 0,
    fuel_type: [],
    transmission: [],
    body_type: [],
    drive_type: [],
    id: ''
  };

  authToken: string | null = '';

  constructor(private http: HttpClient, private router: Router) {
  }

  ngOnInit(){
    console.log(this.transmissions)
    this.authToken = localStorage.getItem('authToken');

    if (!this.authToken)
    {
      this.router.navigate(['/authorization'])
    }

    this.fetchBrandsData();
    this.getRecommendation();
  }

  getRecommendation(){
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

    this.http.get<RecommendationResponse>(`http://localhost:8008/recommendation/`, {headers: headers}).subscribe(
      (response) => {
        if (response.success) {
          this.recom = response.data.recommendation;
          this.selections();
        } else {
          console.error('Ошибка при получении данных пользователя');
        }
      },
      (error) => {
        console.error('Ошибка HTTP-запроса:', error);
      }
    );
  }

  selections(){
    console.log(this.recom)
    this.selectedBrands = this.recom["brand"]
    this.selectedTransmisson = this.recom["transmission"].map(key => Transmission[key as keyof typeof Transmission]);
    this.selectedYearTo = this.recom["year_to"]
    this.checkMax = this.selectedYearTo !== 0;
    this.selectedYearFrom = this.recom["year_from"]
    this.checkMin = this.selectedYearFrom !== 0;
    this.selectedFuelType = this.recom["fuel_type"].map(key => FuelType[key as keyof typeof FuelType]);
    this.selectedBodyType = this.recom["body_type"].map(key => BodyType[key as keyof typeof BodyType]);
    this.selectedDriveType = this.recom["drive_type"].map(key => DriveType[key as keyof typeof DriveType]);
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
  // Получение текущей страницы
  get currentPage() {
    return this.pages[this.currentPageIndex];
  }

  // Переход на предыдущую страницу
  prevPage() {
    if (this.currentPageIndex > 0) {
      this.currentPageIndex--;
    }
  }

  // Переход на следующую страницу
  nextPage() {
    if (this.currentPageIndex < this.pages.length - 1) {
      this.currentPageIndex++;
    }
  }

  save(){
    if (this.selectedYearFrom > this.selectedYearTo && this.checkMax && this.checkMin){
      this.error = true;
    } else {
      console.log('1')
      this.error = false

      console.log('2')
      this.updateFilters();
      console.log('ok');
      this.router.navigate(['/'])
    }
  }

  // Выбранные значения

  // Объект фильтров
  data: RecommendationList = {
    brand: this.selectedBrands,
    year_from: this.selectedYearFrom,
    year_to: this.selectedYearTo,
    fuel_type: this.selectedFuelType,
    transmission: this.selectedTransmisson,
    body_type: this.selectedBodyType,
    drive_type: this.selectedDriveType
  };

  change_data(value:string, enumType: { [key: string]: string }){
    const entity = Object.entries(enumType).find(([key, val]) => val === value)!;
    return  entity[0]
  }

  // Метод для обновления объекта фильтров
  updateFilters() {
    //TODO: add back save recommendation
    //const entity = Object.entries(Transmission).find(([key, val]) => val === query.transmission);
    //  addParam('transmission', entity ? entity[0] : undefined);
    console.log("21")
    console.log(this.selectedBrands)
    console.log(this.selectedYearFrom)
    console.log(this.selectedYearTo)
    console.log(this.selectedFuelType)
    console.log(this.selectedTransmisson)
    console.log(this.selectedBodyType)
    console.log(this.selectedDriveType)
    if (!this.checkMax){
      this.selectedYearTo = 0
    }

    if (!this.checkMin){
      this.selectedYearFrom = 0
    }
     this.data = {
      brand: this.selectedBrands,
      year_from: this.selectedYearFrom,
      year_to: this.selectedYearTo,
      fuel_type: this.selectedFuelType.map(el => this.change_data(el, FuelType)),
      transmission: this.selectedTransmisson.map(el => this.change_data(el, Transmission)),
      body_type: this.selectedBodyType.map(el => this.change_data(el, BodyType)),
      drive_type: this.selectedDriveType.map(el => this.change_data(el, DriveType))
    };
    console.log("22")
    const headers = new HttpHeaders(
      {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.authToken}`
      }
    );

    this.http.post<RecommendationCreateResponse>(`http://localhost:8008/recommendation/`, this.data, {headers: headers}).subscribe(
      (response) => {
        if (response.success) {
          console.info('Рекомендации успешно сохранены')

        } else {
          console.error('Ошибка при получении данных пользователя');
        }
      },
      (error) => {
        console.error('Ошибка HTTP-запроса:', error);
      }
    );
  }

  onBrandChange(car: string) {
    let index = this.selectedBrands.findIndex(selectedCar => selectedCar === car);
    if (index === -1) {
      this.selectedBrands.push(car);
    } else {
      this.selectedBrands.splice(index, 1);
    }
  }

  onFuelTypeChange(car: string) {
    let index = this.selectedFuelType.findIndex(selectedCar => selectedCar === car);
    if (index === -1) {
      this.selectedFuelType.push(car);
    } else {
      this.selectedFuelType.splice(index, 1);
    }
  }

  onTransmissionChange(car: string) {
    console.log(car)
    let index = this.selectedTransmisson.findIndex(selectedCar => selectedCar === car);
    if (index === -1) {
      this.selectedTransmisson.push(car);
      console.log('add')
      console.log(this.selectedTransmisson)
    } else {
      this.selectedTransmisson.splice(index, 1);
      console.log('delete')
    }
  }

  onBodyTypeChange(car: string) {
    let index = this.selectedBodyType.findIndex(selectedCar => selectedCar === car);
    if (index === -1) {
      this.selectedBodyType.push(car);
    } else {
      this.selectedBodyType.splice(index, 1);
    }
  }

  onDriveTypeChange(car: string) {
    let index = this.selectedDriveType.findIndex(selectedCar => selectedCar === car);
    if (index === -1) {
      this.selectedDriveType.push(car);
    } else {
      this.selectedDriveType.splice(index, 1);
    }
  }


  handleMinimalYear(data: number) {
    //if (!this.checkMin) {
      this.selectedYearFrom = data;
    //} else {
    //  this.checkMin = !this.checkMin
    //}// Сохраняем данные из первого компонента
    console.log(`Первый компонент отправил: ${data}`); // Логируем данные
  }

  handleMaximumYear(data: number) {
    this.selectedYearTo = data; // Сохраняем данные из второго компонента
    console.log(`Второй компонент отправил: ${data}`); // Логируем данные
  }

  checkMin: boolean = false;
  checkMax: boolean = false;

  on_click_delete_min(){
      this.checkMin = false;
      this.selectedYearFrom = 0;
  }

  on_click_add_min(){
    this.checkMin = true;
    this.selectedYearFrom = 2000;
  }

  on_click_delete_max(){
    this.checkMax = false;
    this.selectedYearTo = 0;
  }

  on_click_add_max(){
    this.checkMax = true;
    this.selectedYearTo = 2000;
  }
}
