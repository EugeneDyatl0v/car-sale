import { Component } from '@angular/core';
import {NgForOf} from "@angular/common";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-recommendation',
  standalone: true,
  imports: [
    NgForOf,
    FormsModule
  ],
  templateUrl: './recommendation.component.html',
  styleUrl: './recommendation.component.css'
})
export class RecommendationComponent {
  carCount: number = 0;
  marks: string[] = ['Audi', 'BMW', 'Chery', 'Chevrolet', 'Citroen', 'Daewoo', 'Ford','ГАЗ', 'Geely', 'Haval',
    'Honda', 'Hyundai', 'Kia', 'Land Rover', 'Lexus', 'Mazda', 'Mercedes-Benz', 'Mitsubishi', 'Nissan', 'Opel',
    'Peugeot', 'Porsche', 'Renault', 'Skoda', 'Subaru', 'Suzuki', 'Toyota', 'Lada (ВАЗ)', 'Volkswagen', 'Volvo'];
  selectedMark: string[] = [];
  models: Record<string, string[]> = {
    'Audi': ['aa', 'av', 'asd'],
    'Ford': ['fa', 'fv', 'fsd'],
    'Daewoo': ['da', 'dv', 'dsd'],
  };
  selectedModel: string[] = [];


  onMarkChange(index: number, selectedMark: string) {
    // Здесь вы можете обновить выбранную модель для данной марки
    if (this.models[selectedMark]) {
      this.selectedModel[index] = this.models[selectedMark][0]; // Установите первую модель
    } else {
      this.selectedModel[index] = ''; // Если марки нет, сбросьте модель
    }
  }

  onAddCar(){
    this.carCount = this.carCount + 1;
    console.log(this.selectedMark[this.carCount-2])
    console.log(this.models['Daewoo'])
    console.log(this.models[this.selectedMark[this.carCount-1]])
    console.log(this.carCount);
    console.log(this.selectedMark);
    console.log(this.selectedModel);
  }

  onDelCar(index:number){
        this.carCount = this.carCount - 1;
    this.selectedMark.splice(index, 1);
    this.selectedModel.splice(index, 1);
    console.log(this.carCount);
    console.log(this.selectedMark);
    console.log(this.selectedModel);
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

  countries: string[] = ['Китай', 'США', 'Япония', 'Германия', 'Южная Корея', 'Франция', 'Россия', 'Швеция', 'Чехия', 'Великобритания', 'Италия'];
  selectedCountries: string[] = [];

  // Обработчик изменения состояния чекбоксов
  onCountryChange(event: Event) {
    const checkbox = event.target as HTMLInputElement;
    const country = checkbox.value;

    if (checkbox.checked) {
      // Добавить страну в массив, если она выбрана
      this.selectedCountries.push(country);
    } else {
      // Удалить страну из массива, если она была снята с выбора
      this.selectedCountries = this.selectedCountries.filter(c => c !== country);
    }
    console.log(this.selectedCountries)
  }

  types: string[] = ["Седан", "Внедорожник", "Хетчбэк", "Универсал", "Купе", "Минивэн"];
  selectedTypes: string[] = [];

  // Обработчик изменения состояния чекбоксов
  onTypeChange(event: Event) {
    const checkbox = event.target as HTMLInputElement;
    const type = checkbox.value;

    if (checkbox.checked) {
      // Добавить страну в массив, если она выбрана
      this.selectedTypes.push(type);
    } else {
      // Удалить страну из массива, если она была снята с выбора
      this.selectedTypes = this.selectedTypes.filter(c => c !== type);
    }
    console.log(this.selectedTypes)
  }

  fuels: string[] = ["Бензин",
    "Дизель",
    "Электричество",
    "Гибрид", "Газ"];
  selectedFuels: string[] = [];

  // Обработчик изменения состояния чекбоксов
  onFuelChange(event: Event) {
    const checkbox = event.target as HTMLInputElement;
    const fuel = checkbox.value;

    if (checkbox.checked) {
      // Добавить страну в массив, если она выбрана
      this.selectedFuels.push(fuel);
    } else {
      // Удалить страну из массива, если она была снята с выбора
      this.selectedFuels = this.selectedFuels.filter(c => c !== fuel);
    }
    console.log(this.selectedFuels)
  }

  transmissions: string[] = ["Ручная", "Автоматическая", "Робот"];
  selectedTransmissions: string[] = [];

  // Обработчик изменения состояния чекбоксов
  onTransmissionChange(event: Event) {
    const checkbox = event.target as HTMLInputElement;
    const transmission = checkbox.value;

    if (checkbox.checked) {
      // Добавить страну в массив, если она выбрана
      this.selectedTransmissions.push(transmission);
    } else {
      // Удалить страну из массива, если она была снята с выбора
      this.selectedTransmissions = this.selectedTransmissions.filter(c => c !== transmission);
    }
    console.log(this.selectedFuels)
  }

  driveTypes: string[] = ["Передний", "Задний", "Полный"];
  selectedDriveTypes: string[] = [];

  // Обработчик изменения состояния чекбоксов
  onDriveTypeChange(event: Event) {
    const checkbox = event.target as HTMLInputElement;
    const driveType = checkbox.value;

    if (checkbox.checked) {
      // Добавить страну в массив, если она выбрана
      this.selectedDriveTypes.push(driveType);
    } else {
      // Удалить страну из массива, если она была снята с выбора
      this.selectedDriveTypes = this.selectedDriveTypes.filter(c => c !== driveType);
    }
    console.log(this.selectedTypes)
  }

  saveAll():void{
    console.log(this.selectedCountries);
    console.log(this.selectedModel);
    console.log(this.selectedModel);
    console.log(this.selectedMinYear);
    console.log(this.selectedMaxYear);
    console.log(this.selectedMinPrice);
    console.log(this.selectedMaxPrice);
    console.log(this.selectedTypes);
    console.log(this.selectedFuels);
    console.log(this.selectedTransmissions);
    console.log(this.selectedDriveTypes);
  }
}
