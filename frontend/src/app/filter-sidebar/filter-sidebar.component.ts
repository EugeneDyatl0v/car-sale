import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatSelectModule } from "@angular/material/select";
import {NgForOf} from "@angular/common";

@Component({
  selector: 'app-filter-sidebar',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatSelectModule,
    ReactiveFormsModule,
    NgForOf,
    FormsModule
  ],
  templateUrl: './filter-sidebar.component.html',
  styleUrls: ['./filter-sidebar.component.css']
})
export class FilterSidebarComponent implements OnInit {
  filterForm: FormGroup;

  brands: string[] = ['Audi', 'BMW', 'Chery', 'Chevrolet', 'Citroen', 'Daewoo', 'Ford','ГАЗ', 'Geely', 'Haval',
    'Honda', 'Hyundai', 'Kia', 'Land Rover', 'Lexus', 'Mazda', 'Mercedes-Benz', 'Mitsubishi', 'Nissan', 'Opel',
    'Peugeot', 'Porsche', 'Renault', 'Skoda', 'Subaru', 'Suzuki', 'Toyota', 'Lada (ВАЗ)', 'Volkswagen', 'Volvo'];
  models: Record<string, string[]> = {
    'Audi': ['aa', 'av', 'asd'],
    'Ford': ['fa', 'fv', 'fsd'],
    'Daewoo': ['da', 'dv', 'dsd'],
  };
  bodyTypes: string[] = ['Седан', 'Внедорожник', 'Хетчбэк', 'Универсал', 'Купе', 'Минивэн', 'Грузовик'];
  transmissions: string[] = ['Автомат', 'Механика', 'Робот'];
  drives: string[] = ['Передний привод', 'Задний привод', 'Полный привод'];
  fuelTypes: string[] = ['Бензин', 'Дизель', 'Электричество', 'Гибрид', 'Газ'];
  selectedBrand = '';

  constructor(private fb: FormBuilder) {
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

  ngOnInit(): void {
    for(let value of this.brands) {
      console.log(value)
    }
  }

  onSubmit(): void {
    console.log(this.filterForm.value); // Output form data
  }

  /*filterForm: FormGroup = {} as FormGroup;

  brands: string[] = ['Audi', 'BMW', 'Mercedes', 'Toyota', 'Honda'];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    // Инициализируем форму в ngOnInit
  this.initializeForm()
  }

  initializeForm(){
    this.filterForm = new FormGroup({
      brand: new FormControl("", [Validators.required]),
    })
}

  onSubmit(): void {
    const selectedBrand = this.filterForm.get('brand')?.value;
    console.log('Выбранная марка:', selectedBrand);
  }*/

}
