import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { enviroment } from '../properties/env';

@Injectable({
  providedIn: 'root'
})
export class InteractionService {

  constructor(private http: HttpClient) { }

  listManagement = enviroment.apiUrl + "gestion-cobranzas/public/api/management";
  listResult =  enviroment.apiUrl + "gestion-cobranzas/public/api/result/";
  listAnomaly =  enviroment.apiUrl + "gestion-cobranzas/public/api/anomaly/";

  getManagement(): Observable<any>{
    return this.http.get<any>(this.listManagement);
  }

  getResult(id: number): Observable<any>{
    return this.http.get<any>(this.listResult + id);
  } 

  getAnomaly(id: number): Observable<any>{
    return this.http.get<any>(this.listAnomaly + id);
  } 
}
