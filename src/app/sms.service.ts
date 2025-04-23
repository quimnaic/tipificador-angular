import { Injectable } from '@angular/core';
import { enviroment } from '../properties/env';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SmsService {

  constructor(private http: HttpClient) { }
  sms = enviroment.apiUrl + 'gestion-cobranzas/public/api/sms';
  pdf = enviroment.apiUrl + 'gestion-cobranzas/public/api/sms/pdf';
  upload = enviroment.apiUrl + 'gestion-cobranzas/public/api/sms/upload';

  importSms(formData: any): Observable<any>{
    return this.http.post(this.upload, formData);
  }

  pdfSms(formData: any): Observable<Blob>{
    return this.http.post(this.pdf, formData, { responseType: 'blob'  });
  }

  getSms(): Observable<any> {
    return this.http.get(this.sms);
  }

}
