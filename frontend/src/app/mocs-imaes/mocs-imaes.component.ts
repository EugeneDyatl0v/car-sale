import { Component } from '@angular/core';
import {FormsModule} from "@angular/forms";
import {v4 as uuidv4} from "uuid";
import {HttpClient, HttpClientModule} from "@angular/common/http";

interface FileData {
  filename: string;
  content: string;
  extension: string;
}


@Component({
  selector: 'app-mocs-imaes',
  standalone: true,
  imports: [
    FormsModule,
    HttpClientModule
  ],
  templateUrl: './mocs-imaes.component.html',
  styleUrl: './mocs-imaes.component.css'
})
export class MocsImaesComponent {
  id: string = '';
   selectedPhotos: string[] = [];
  files: FileData[] = [];
  constructor(
    private http: HttpClient){}


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

  on_Submit(){
    this.uploadFiles(this.id)
  }
}
