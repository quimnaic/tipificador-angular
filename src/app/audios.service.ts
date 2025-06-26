import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { enviroment } from '../properties/env';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AudiosService {

  constructor(private http: HttpClient) { }

  listAnio = enviroment.apiUrl + "gestion-cobranzas/public/api/files";

  getAllFiles(): Observable<any> {
    return this.http.get(this.listAnio);
  }

  getMonthFiles(anio: any): Observable<any> {
    return this.http.get(this.listAnio + '/' + anio);
  }

  getDayFiles(anio: any, month: any): Observable<any> {
    return this.http.get(this.listAnio + '/' + anio + '/' + month);
  }

  getAudioFiles(anio: any, month: any, day: any): Observable<any> {
    return this.http.get(this.listAnio + '/' + anio + '/' + month + '/' + day);
  }

  getPlayAudio(anio: any, month: any, day: any, filename: any): Observable<any>{
    return this.http.get(this.listAnio + '/' + anio + '/' + month + '/' + day + '/' + filename , { responseType: 'blob' })
  }

}
