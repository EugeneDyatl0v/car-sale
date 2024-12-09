import {Component, OnInit} from '@angular/core';
import {NgClass, NgForOf, NgIf, NgOptimizedImage} from "@angular/common";
import {HttpClient, HttpHeaders, HttpClientModule} from "@angular/common/http";
import {ActivatedRoute, Router} from "@angular/router";

//TODO: add back for like dislike delete
interface ApiResponse {
  success: boolean;
  message: string;
  data: {
    ad: {
      id: string;
      title: string;
      description: string;
      price: number;
      currency: 'USD' | 'EUR' | 'RUB' | 'BYN'; // Ограничение значений для валюты
      brand: string;
      model: string;
      year: number;
      mileage: number;
      fuel_type: 'PETROL' | 'DIESEL' | 'ELECTRIC' | 'HYBRID' | 'GAS'; // Ограничение значений для типа топлива
      transmission: 'MANUAL' | 'AUTOMATIC' | 'CVT'; // Ограничение значений для трансмиссии
      body_type: 'SEDAN' | 'SUV' | 'HATCHBACK' | 'WAGON' | 'COUPE'; // Ограничение значений для типа кузова
      engine_capacity: number;
      horse_power: number;
      drive_type: 'FWD' | 'RWD' | 'AWD'; // Ограничение значений для типа привода
      color: string;
      vin_number: string;
      seller_name: string;
      seller_phone: string;
      seller_email: string;
      location: string;
      posted_at:string;
      images:string[];
    };
  };
}


interface ImageOutSchema {
  content: string
  extension: string
}


interface imageAPIResponse {
  success: boolean;
  message: string;
  data: ImageOutSchema[];
}

interface response200 {
  success: boolean;
  message: string;
}

enum FuelType {
    PETROL = "Бензин",
    DIESEL = "Дизель",
    ELECTRIC = "Электричество",
    HYBRID = "Гибрид",
    GAS = "Газ"
}

enum Transmission {
    MANUAL = "Ручная",
    AUTOMATIC = "Автоматическая",
    CVT = "Робот"
}

enum BodyType {
    SEDAN = "Седан",
    SUV = "Внедорожник",
    HATCHBACK = "Хетчбэк",
    WAGON = "Универсал",
    COUPE = "Купе"
}

enum DriveType {
    FWD = "Передний",
    RWD = "Задний",
    AWD = "Полный"
}


@Component({
  selector: 'app-advertisement',
  standalone: true,
  imports: [
    NgOptimizedImage,
    NgIf,
    HttpClientModule,
    NgForOf,
    NgClass
  ],
  templateUrl: './advertisement.component.html',
  styleUrl: './advertisement.component.css'
})
export class AdvertisementComponent implements OnInit{
  adId: string | null = null;
  myAdData: Partial<ApiResponse['data']['ad']> = {};
  info: string | undefined = '';
  clicked: boolean = false;
  selectedImage: string = '';
  heightList: number[] = [];
  heightSelectedImage: number = 0;
  raw_images: ImageOutSchema[] = [];
  images: string[] = [];
  body_type: string = '';
  fuel_type: string = '';
  drive_type: string = '';
  transmission: string = '';


  constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router) {
  }

  ngOnInit(){
    this.route.paramMap.subscribe(params => {
      this.adId = params.get('id');
      if (this.adId) {
        this.fetchAdData(this.adId);
        this.add_ad_to_recently_viewed();
      }
    });
  }

  add_ad_to_recently_viewed(){
    const authToken = localStorage.getItem('authToken');

    console.log(authToken);

    if (!authToken)
    {
      this.router.navigate(['/authorize'])
    }


    const headers = new HttpHeaders(
      {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + authToken
      }
    );

    this.http.post<response200>(
      `http://localhost:8008/users/recently-viewed/?ad_id=${this.adId}`,
      {},
      {
        headers: headers
      }
    ).subscribe(
      (response) => {
        if (response.success) {
          console.info('Ad added to recently viewed')
        } else {
          console.error('Error while adding ad to recently viewed');
        }
      },
      (error) => {
        console.error('Ошибка HTTP-запроса:', error);
      }
    );
  }

  fetchAdData(id: string) {

    const headers = new HttpHeaders(
      {
        'Content-Type': 'application/json',
      }
    );

    this.http.get<ApiResponse>(`http://localhost:8008/ad/${id}`, {headers: headers}).subscribe(
      (response) => {
        if (response.success) {
          this.myAdData = response.data.ad;
          const setEnumValue = (enumType: any, value: any) => {
            return value !== undefined && enumType[value] !== undefined ? enumType[value] : null;
          };

          // Устанавливаем значения для всех полей через вспомогательную функцию
          this.drive_type = setEnumValue(DriveType, this.myAdData.drive_type);
          this.body_type = setEnumValue(BodyType, this.myAdData.body_type);
          this.fuel_type = setEnumValue(FuelType, this.myAdData.fuel_type);
          this.transmission = setEnumValue(Transmission, this.myAdData.transmission);
          console.log(response.data.ad)
          console.log(this.myAdData)
        } else {
          console.error('Ошибка при получении данных пользователя');
        }
      },
      (error) => {
        console.error('Ошибка HTTP-запроса:', error);
      }
    );

    this.http.get<imageAPIResponse>(`http://localhost:8008/image/${id}/`, {headers: headers}).subscribe(
      (response) => {
        if (response.success) {
          this.raw_images = response.data;
          this.loadImages();
        } else {
          console.error('Ошибка при получении изображений');
        }
      },
      (error) => {
        console.error('Ошибка HTTP-запроса:', error);
      }
    );

  }

  loadImages() {
    try {
      // Сначала получаем список всех изображений
      // Для каждого изображения делаем запрос, чтобы получить его содержимое
      for (const imageInfo of this.raw_images) {

        // Создаем URL из base64
        const imageUrl = imageInfo.extension + ',' + imageInfo.content;
        this.images.push(imageUrl);

        // Вычисляем высоту изображения
        this.getImageSize(imageUrl);
      }
      this.selectedImage = this.images![0];
    } catch (error) {
      console.error('Error loading images:', error);
    }
  }

  getImageSize(imageUrl: string) {
    const img = new Image(); // Создаем объект Image
    img.src = imageUrl; // Указываем путь к изображению
    let imageWidth: number | undefined;
    let imageHeight: number | undefined;

    // Ждем загрузки изображения
    img.onload = () => {
      imageWidth = img.naturalWidth; // Получаем ширину
      imageHeight = img.naturalHeight; // Получаем высоту
      console.log((imageHeight/imageWidth)*240)
      this.heightList.push((imageHeight/imageWidth)*240)
    };

    // Обработка ошибки загрузки
    img.onerror = (error) => {
      console.error('Ошибка загрузки изображения', error);
    };
  }

  changeMainImage(newImage: string, index: number) {
    this.selectedImage = newImage;
    this.heightSelectedImage = 3*this.heightList[index];
  }

  on_click_phone() {
    this.info = this.myAdData.seller_phone;
    this.clicked = true;
  }


  on_click_email() {
    this.info = this.myAdData.seller_email;
    this.clicked = true;
  }

  protected readonly BodyType = BodyType;
  protected readonly Transmission = Transmission;
  protected readonly DriveType = DriveType;
  protected readonly FuelType = FuelType;

    isActive: boolean = false;

  on_click(){
    this.isActive = !this.isActive;
  }

  decodeJWT(token: string): any {
    try {
        const [headerB64, payloadB64] = token.split('.');

        const header = JSON.parse(atob(headerB64));
        const payload = JSON.parse(atob(payloadB64));

        return {
            payload
        };
    } catch (error) {
        throw new Error('Invalid JWT token');
    }
  }

}
