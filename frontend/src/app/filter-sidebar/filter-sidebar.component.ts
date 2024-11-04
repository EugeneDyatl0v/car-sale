import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule} from "@angular/forms";
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
    NgForOf
  ],
  templateUrl: './filter-sidebar.component.html',
  styleUrls: ['./filter-sidebar.component.css']
})
export class FilterSidebarComponent implements OnInit {
  filterForm: FormGroup;

  bodyTypes: string[] = ["Седан", "Хэтчбек", "Универсал"];
  transmissions: string[] = ["Автомат", "Механика", "Робот"];
  drives: string[] = ["Передний привод", "Задний привод", "Полный привод"];

  constructor(private fb: FormBuilder) {
    this.filterForm = this.fb.group({
      brand: [''],
      model: [''],
      generation: [''],
      bodyType: [''],
      transmission: [''],
      drive: [''],
      engine: [''],
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

  ngOnInit(): void {}

  onSubmit(): void {
    console.log(this.filterForm.value); // Output form data
  }
}
