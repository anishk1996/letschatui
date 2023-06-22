import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { HttpBackend, HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  private httpClient: HttpClient;
  constructor(private httpBackend: HttpBackend) {
    this.httpClient = new HttpClient(this.httpBackend);
   }

  uploadFile(file: File, resource_type: String): Observable<any> {
    let url = `https://api.cloudinary.com/v1_1/${environment.cloudName}/${resource_type}/upload`;
    const formData: FormData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', environment.uploadPreset);
    formData.append('cloud_name', environment.cloudName)
    return this.httpClient.post(url, formData);
  }
}
