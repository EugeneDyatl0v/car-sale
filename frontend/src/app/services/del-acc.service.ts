import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

interface ModalState {
  isVisible: boolean;
  message: string;
}

@Injectable({
  providedIn: 'root'
})

export class DelAccService {
  // Начальное состояние модального окна
  private modalState = new BehaviorSubject<ModalState>({ isVisible: false, message: '' });
  modalState$ = this.modalState.asObservable();

  // Открыть модальное окно с сообщением
  open(message: string) {
    this.modalState.next({ isVisible: true, message });
  }

  // Закрыть модальное окно
  close() {
    this.modalState.next({ isVisible: false, message: '' });
  }
}
