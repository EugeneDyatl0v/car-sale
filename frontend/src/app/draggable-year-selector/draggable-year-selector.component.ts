import { Component, HostListener, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-draggable-year-selector',
  templateUrl: './draggable-year-selector.component.html',
  standalone: true,
  styleUrls: ['./draggable-year-selector.component.css']
})
export class DraggableYearSelectorComponent {
  @Output() dataEmitter: EventEmitter<number> = new EventEmitter<number>();
  maxYear: number = new Date().getFullYear();
  minYear: number = 1940;
  currentYear: number = 2000;
  prevYear: number | null = 1999;
  nextYear: number | null = 2001;
  tempYear: number = this.currentYear; // Временное значение года
  swapping: boolean = false; // Флаг для отслеживания состояния перетаскивания

  @HostListener('mousedown', ['$event'])
  onMouseDown(event: MouseEvent) {
    event.preventDefault();
    this.swapping = true;
    this.tempYear = this.currentYear; // Инициализируем временный год

    document.addEventListener('mousemove', this.onMouseMove.bind(this));
    document.addEventListener('mouseup', this.onMouseUp.bind(this));
  }

  onMouseMove(event: MouseEvent) {
    if (!this.swapping) return;

    // Определяем направление свайпа
    const direction = event.movementY < 0 ? 'up' : 'down';
    this.tempYear = direction === 'up' ? this.tempYear + 0.1 : this.tempYear - 0.1;
    console.log(this.tempYear);
    //if (Number.isInteger(this.tempYear)) {
    //  this.currentYear = this.tempYear; // Обновляем текущий год
    //}
    //this.tempYear = Math.round(this.tempYear);
    //console.log(this.tempYear);
    if (Math.floor(this.tempYear) > this.minYear && Math.floor(this.tempYear) < this.maxYear){
      this.currentYear = Math.floor(this.tempYear);
      this.prevYear = this.currentYear - 1;
      this.nextYear = this.currentYear + 1;
    } else if (Math.floor(this.tempYear) == this.minYear){
      this.currentYear = Math.floor(this.tempYear);
      this.prevYear = null;
      this.nextYear = this.currentYear + 1;
    } else if (Math.floor(this.tempYear) == this.maxYear){
      this.currentYear = Math.floor(this.tempYear);
      this.prevYear = this.currentYear - 1;
      this.nextYear = null;
    }
  }

  onMouseUp() {
    this.swapping = false;
    this.dataEmitter.emit(this.currentYear);
    document.removeEventListener('mousemove', this.onMouseMove.bind(this));
    document.removeEventListener('mouseup', this.onMouseUp.bind(this));
  }

  downYear(){
    if (this.currentYear - 1 > this.minYear ) {
      this.currentYear = this.currentYear - 1;
      this.prevYear = this.currentYear - 1;
      this.nextYear = this.currentYear + 1;
      this.dataEmitter.emit(this.currentYear);
    } else {
      this.currentYear = this.currentYear - 1;
      this.nextYear = this.currentYear + 1;
      this.prevYear = null;
      this.dataEmitter.emit(this.currentYear);
    }
  }

  upYear(){
    if (this.currentYear + 1 != this.maxYear) {
      this.currentYear = this.currentYear + 1;
      this.prevYear = this.currentYear - 1;
      this.nextYear = this.currentYear + 1;
      this.dataEmitter.emit(this.currentYear);
    } else {
      this.currentYear = this.currentYear + 1;
      this.prevYear = this.currentYear - 1;
      this.nextYear = null;
      this.dataEmitter.emit(this.currentYear);
    }
  }
}
