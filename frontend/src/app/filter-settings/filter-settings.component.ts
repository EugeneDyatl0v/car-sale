import { Component } from '@angular/core';
import {FilterService} from "../services/filter.service";
import {FormsModule} from "@angular/forms";
import {NgForOf, NgIf, NgSwitchCase} from "@angular/common";

@Component({
  selector: 'app-filter-settings',
  standalone: true,
  imports: [
    FormsModule,
    NgIf,
    NgSwitchCase,
    NgForOf
  ],
  templateUrl: './filter-settings.component.html',
  styleUrl: './filter-settings.component.css'
})
export class FilterSettingsComponent {
  isVisible:boolean = false;
  message:string = 'Это важное уведомление!';
  selectedMark: string = '';
  selectedModel: string = '';
  marks: string[] = ['Audi', 'BMW', 'Chery', 'Chevrolet', 'Citroen', 'Daewoo', 'Ford','ГАЗ', 'Geely', 'Haval',
    'Honda', 'Hyundai', 'Kia', 'Land Rover', 'Lexus', 'Mazda', 'Mercedes-Benz', 'Mitsubishi', 'Nissan', 'Opel',
    'Peugeot', 'Porsche', 'Renault', 'Skoda', 'Subaru', 'Suzuki', 'Toyota', 'Lada (ВАЗ)', 'Volkswagen', 'Volvo'];
  models: string[] = [];
  modelsContainerVisibility: boolean = false;


  constructor(private filterService: FilterService) {
    // Подписываемся на изменения состояния модального окна

    this.filterService.modalState$.subscribe(state => {
      this.isVisible = state.isVisible;
      this.message = state.message;
    });
  }

  closeModal() {
    this.filterService.close();
  }

  confirm() {

    this.filterService.close();
    alert('Подтверждено!');
  }


  onRadioChangeMarks(value: string) {
    this.selectedMark = value;
    this.modelsContainerVisibility = true;
    // выбрать модели
    this.models = ['100', 'Front', 'RS 2', 'SQ2', '200', 'NSU RO 80', 'RS 3', 'SQ5', '50', 'Q2', 'RS 4',
      'SQ5 Sportback', '80', 'Q3', 'RS 5', 'SQ7', '90', 'Q3 Sportback', 'RS 6', 'SQ8', '920', 'Q4 Sportback e-tron',
      'RS 7', 'SQ8 Sportback e-tron'
];
    console.log('Selected option:', this.selectedMark);
  }

  onRadioChangeModels(value: string) {
    this.selectedModel = value;
    // выбрать модели

    console.log('Selected option:', this.selectedModel);
  }
  minPrice: number = 0;
  maxPrice: number = 100000;
  selectedMinPrice: number = 500; // Начальное значение слайдера
  selectedMaxPrice: number = 500;
  selectedCurrency: string = 'USD';

  onMinPriceChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const value = Number(target.value);

    // Обновляем значение слайдера, если оно в пределах допустимого диапазона
    if (value >= this.minPrice && value <= this.maxPrice && value <= this.selectedMaxPrice) {
      this.selectedMinPrice = value;
    }
  }

  onMaxPriceChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const value = Number(target.value);

    // Обновляем значение слайдера, если оно в пределах допустимого диапазона
    if (value >= this.minPrice && value <= this.maxPrice && value >= this.selectedMinPrice) {
      this.selectedMaxPrice = value;
    }
  }

  minYear: number = 1886;
  maxYear: number = 2024;
  selectedMinYear: number = 2000; // Начальное значение слайдера
  selectedMaxYear: number = 2000;

  onMinYearChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const value = Number(target.value);

    // Обновляем значение слайдера, если оно в пределах допустимого диапазона
    if (value >= this.minYear && value <= this.maxYear && value <= this.selectedMaxYear) {
      this.selectedMinYear = value;
    }
  }

  onMaxYearChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const value = Number(target.value);

    // Обновляем значение слайдера, если оно в пределах допустимого диапазона
    if (value >= this.minYear && value <= this.maxYear && value >= this.selectedMinYear) {
      this.selectedMaxYear = value;
    }
  }

  minPower:number = 0;
  maxPower:number = 2000;
  selectedPower: number = 100;

  onPowerChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const value = Number(target.value);

    // Обновляем значение слайдера, если оно в пределах допустимого диапазона
    if (value >= this.minPower && value <= this.maxPower && value >= this.selectedPower) {
      this.selectedPower = value;
    }
  }
}
