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

  importSms(formData: any): Observable<any>{
    return this.http.post(this.sms, formData);
  }

}
