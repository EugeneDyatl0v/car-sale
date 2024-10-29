import {Component, OnInit} from '@angular/core';
import {
  FormBuilder,
  FormGroup, FormsModule,
  ReactiveFormsModule,
  Validators
} from "@angular/forms";
import {NgForOf} from "@angular/common";
import {HttpClient, HttpClientModule, HttpHeaders} from "@angular/common/http";
import {ActivatedRoute, Router} from "@angular/router";
import { v4 as uuidv4 } from 'uuid';


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

interface AdCreateResponse {
  success: boolean;
  message: string;
  data: {
    ad_id: string;
  };
}

interface BrandsApiResponse {
  success: boolean;
  message: string;
  data: {
    brands: string[];
  };
}

interface ModelsApiResponse {
  success: boolean;
  message: string;
  data: {
    models: string[];
  };
}

interface UserApiResponse {
  success: boolean;
  message: string;
  data: {
    user: {
      user_name: string;
      user_last_name: string;
      email: string;
      phone_number: string;
      address: string;
    }
  }
}

interface APIResponse {
  title: string
  description: string
  price: number
  currency: string
  brand: string
  model: string
  year: number
  mileage: number
  fuel_type: string
  transmission: string
  body_type: string
  engine_capacity: number
  horse_power: number
  drive_type: string
  color: string
  vin_number: string
  seller_name: string
  seller_phone: string
  seller_email: string
  location: string
  images: string[]
}

interface FileData {
  filename: string;
  content: string;
  extension: string;
}


@Component({
  selector: 'app-advertisement-create',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgForOf,
    FormsModule,
    HttpClientModule
  ],
  templateUrl: './advertisement-create.component.html',
  styleUrl: './advertisement-create.component.css'
})
export class AdvertisementCreateComponent implements OnInit{
  adForm: FormGroup;
  selectedPhotos: string[] = [];
  brands: string[] = [];
  models: string[] = [];
  files: FileData[] = [];

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder
  ) {
      this.adForm = this.fb.group({
        title: ['', Validators.required],
        price: ['', Validators.required],
        currency: ['USD', Validators.required],
        body_type: ['', Validators.required],
        brand: ['', Validators.required],
        model: [{ value: '', disabled: true }, Validators.required],
        color: ['', Validators.required],
        year: ['', [Validators.required, Validators.min(1886), Validators.max(new Date().getFullYear())]],
        mileage: ['', Validators.required],
        horse_power: ['', Validators.required],
        engine_capacity: ['', Validators.required],
        transmission: ['', Validators.required],
        drive_type: ['', Validators.required],
        fuel_type: ['', Validators.required],
        vin_number: ['', Validators.required],
        location: ['', Validators.required],
        description: ['', Validators.required],
        seller_name: ['', Validators.required],
        phone: ['', [Validators.required, Validators.pattern(/^\+?\d{10,15}$/)]],
        email: ['', [Validators.required, Validators.email]]
      });
  }

  ngOnInit(){
    this.fetchBrandsData();
    this.fetchUserData()
  }

  fetchUserData() {
    const authToken = localStorage.getItem('authToken');

    if (!authToken)
    {
      this.router.navigate(['/'])
    }


    const headers = new HttpHeaders(
      {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      }
    );

    this.http.get<UserApiResponse>('http://localhost:8008/users/', {headers: headers}).subscribe(
      (response) => {
        if (response.success) {
          const userData = response.data.user;
          this.adForm.get('seller_name')?.setValue(userData.user_name);
          this.adForm.get('phone')?.setValue(userData.phone_number);
          this.adForm.get('email')?.setValue(userData.email);
        } else {
          console.error('Ошибка при получении данных пользователя');
        }
      },
      (error) => {
        console.error('Ошибка HTTP-запроса:', error);
      }
    );
  }

  fetchBrandsData(){
    const headers = new HttpHeaders(
      {
        'Content-Type': 'application/json',
      }
    );

    this.http.get<BrandsApiResponse>(`http://localhost:8008/cars/brands/`, {headers: headers}).subscribe(
      (response) => {
        if (response.success) {
          this.brands = response.data.brands;

        } else {
          console.error('Ошибка при получении данных пользователя');
        }
      },
      (error) => {
        console.error('Ошибка HTTP-запроса:', error);
      }
    );
  }


  fetchModelsData(){
    const headers = new HttpHeaders(
      {
        'Content-Type': 'application/json',
      }
    );

    this.http.get<ModelsApiResponse>(`http://localhost:8008/cars/${this.adForm.get('brand')?.value}/models/`, {headers: headers}).subscribe(
      (response) => {
        if (response.success) {
          this.models = response.data.models;

        } else {
          console.error('Ошибка при получении данных пользователя');
        }
      },
      (error) => {
        console.error('Ошибка HTTP-запроса:', error);
      }
    );
  }

  onSubmit() {
      if (this.adForm.invalid) {
        console.error('Форма не валидна');
        return;
      }

      const formValue = this.adForm.value;

      console.log(formValue);

      const requestBody: APIResponse = {
        title: formValue.title,
        description: formValue.description,
        price: formValue.price,
        currency: formValue.currency,
        brand: formValue.brand,
        model: formValue.model,
        year: formValue.year,
        mileage: formValue.mileage,
        fuel_type: Object.keys(FuelType)[Object.values(FuelType).indexOf(formValue.fuel_type)],
        transmission: Object.keys(Transmission)[Object.values(Transmission).indexOf(formValue.transmission)],
        body_type: Object.keys(BodyType)[Object.values(BodyType).indexOf(formValue.body_type)],
        engine_capacity: formValue.engine_capacity,
        horse_power: formValue.horse_power,
        drive_type: Object.keys(DriveType)[Object.values(DriveType).indexOf(formValue.drive_type)],
        color: formValue.color,
        vin_number: formValue.vin_number,
        seller_name: formValue.seller_name,
        seller_phone: formValue.phone,
        seller_email: formValue.email,
        location: formValue.location,
        images: this.selectedPhotos
      };
      console.log(requestBody);
      const authToken = localStorage.getItem('authToken');

      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      });

       this.http.post<AdCreateResponse>('http://localhost:8008/ad/create', requestBody, { headers: headers }).subscribe(
          (response) => {
            const adData = response.data.ad_id
            console.log('Объявление успешно создано:', response);
            this.uploadFiles(adData);
            this.router.navigate([`/advertisement/${adData}`]); // Перенаправление после успешного создания
          },
          (error) => {
            console.error('Ошибка при создании объявления:', error);
          }
        );
  }

  fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
      reader.readAsDataURL(file);
    });
  }

  uploadFiles(ad_id: string) {
    this.http.post(`http://localhost:8008/image/upload/${ad_id}/`, { files: this.files })
      .subscribe(
        response => console.log('Upload successful', response),
        error => console.error('Upload failed', error)
      );
  }

  async onFileSelect($event: any) {

    const fileList: FileList = $event.target.files;

    this.files = [];

    // Конвертируем каждый файл в base64
    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      const base64String = await this.fileToBase64(file);
      const fileExtension = file.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExtension}`;
      this.files.push({
        filename: fileName,
        content: base64String.split(',')[1],
        extension: base64String.split(',')[0]
      });
      this.selectedPhotos.push(fileName);
    }
  }

  onBrandChange() {
    if (this.adForm.get('brand')) {
      this.fetchModelsData();
      this.adForm.get('model')?.enable();
    } else {
      this.adForm.get('model')?.setValue('');
      this.models = [];
      this.adForm.get('model')?.disable();
    }
  }
}
