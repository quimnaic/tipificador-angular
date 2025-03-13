import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { enviroment } from '../properties/env';

@Injectable({
  providedIn: 'root'
})
export class DebtCollectionManagementService {

  constructor(private http: HttpClient) { }

  listRecords = enviroment.apiUrl + "gestion-cobranzas/public/api/customers";
  postCustomerImport = enviroment.apiUrl + "gestion-cobranzas/public/api/import";
  postCustomerUpdateImport = enviroment.apiUrl + "gestion-cobranzas/public/api/importUpdate";

  getCustomers(): Observable<any>{
    return this.http.get<any>(this.listRecords);
  }

  postCustomers(formData: any): Observable<any>{
    return this.http.post<any>(this.postCustomerImport, formData)
  }

  postUpdate(formData: any): Observable<any>{
    return this.http.post<any>(this.postCustomerUpdateImport, formData)
  }
}
