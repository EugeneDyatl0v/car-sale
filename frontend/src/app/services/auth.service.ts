import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isLoggedInSubject = new BehaviorSubject<boolean>(this.checkAuthStatus());
  public isLoggedIn$ = this.isLoggedInSubject.asObservable();

  constructor() {}

  // Проверка статуса авторизации
  private checkAuthStatus(): boolean {
    if (typeof window !== 'undefined' && localStorage) {
      const authToken = localStorage.getItem('authToken');
      return !!authToken;
    }
    return false;  // Возвращаем false, если `localStorage` недоступен
  }

  // Обновить статус авторизации
  updateAuthStatus(isLoggedIn: boolean): void {
    this.isLoggedInSubject.next(isLoggedIn);
  }

  // Вызвать при логине
  login(token: string): void {
    if (typeof window !== 'undefined' && localStorage) {
      localStorage.setItem('authToken', token);
      this.updateAuthStatus(true);
    }
  }

  // Вызвать при выходе из системы
  logout(): void {
    if (typeof window !== 'undefined' && localStorage) {
      localStorage.removeItem('authToken');
      this.updateAuthStatus(false);
    }
  }
}
