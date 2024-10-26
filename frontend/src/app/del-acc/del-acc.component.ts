import { Component } from '@angular/core';
import { DelAccService } from '../services/del-acc.service';
import {NgIf, NgSwitch, NgSwitchCase} from "@angular/common";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-del-acc',
  standalone: true,
  imports: [
    NgIf,
    FormsModule,
    NgSwitch,
    NgSwitchCase
  ],
  templateUrl: './del-acc.component.html',
  styleUrl: './del-acc.component.css'
})
export class DelAccComponent {
  isVisible = false;
  message = 'Это важное уведомление!';
  password: string = ''; // Переменная для хранения пароля
  isPasswordVisible: boolean = false;
  image_url = '../../assets/eye.svg';


  constructor(private delAccService: DelAccService) {
    // Подписываемся на изменения состояния модального окна
    this.delAccService.modalState$.subscribe(state => {
      this.isVisible = state.isVisible;
      this.message = state.message;
    });
  }

  closeModal() {
    this.delAccService.close();
  }

  confirm() {

    this.delAccService.close();
    alert('Подтверждено!');
  }

  showPassword() {
    if (this.isPasswordVisible) {
      this.isPasswordVisible = !this.isPasswordVisible;
      this.image_url = '../../assets/eye.svg'
    }else {
      this.isPasswordVisible = !this.isPasswordVisible;
      this.image_url = '../../assets/eye-slash.svg'
    }
  }
}
