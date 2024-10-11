import { Component } from '@angular/core';
import {NgOptimizedImage} from "@angular/common";

@Component({
  selector: 'app-personal-account',
  standalone: true,
  imports: [
    NgOptimizedImage
  ],
  templateUrl: './personal-account.component.html',
  styleUrl: './personal-account.component.css'
})

export class PersonalAccountComponent {
  imagePath: string = '../images/audi.jpg';
}
