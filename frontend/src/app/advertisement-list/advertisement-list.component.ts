import {Component} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {FilterSettingsComponent} from "../filter-settings/filter-settings.component";
import {FilterService} from "../services/filter.service";


@Component({
  selector: 'app-advertisement-list',
  standalone: true,
  imports: [
    FormsModule,
    FilterSettingsComponent
  ],
  templateUrl: './advertisement-list.component.html',
  styleUrl: './advertisement-list.component.css'
})
export class AdvertisementListComponent {
  searchQuery: string = '';

  constructor(private filterService: FilterService) {}

  openModal() {

    this.filterService.open('Это важное уведомление!');
  }

  onSearch() {
    console.log('Значение input:', this.searchQuery); // Здесь можно выполнить действие с значением
    // Логика, связанная с отправкой значения
  }


}
