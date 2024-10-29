import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

interface ModalState {
  isVisible: boolean;
  message: string;
}

@Injectable({
  providedIn: 'root'
})

export class FilterService {
  // Начальное состояние модального окна
  private modalState = new BehaviorSubject<ModalState>({ isVisible: false, message: '' });
  modalState$ = this.modalState.asObservable();

  // Открыть модальное окно с сообщением
  open(message: string) {
    document.body.style.overflow = 'hidden'
    this.modalState.next({ isVisible: true, message });
  }

  // Закрыть модальное окно
  close() {
    document.body.style.overflow = ''
    this.modalState.next({ isVisible: false, message: '' });
  }
}
