import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { enviroment } from '../properties/env';
import { report } from 'node:process';

@Injectable({
  providedIn: 'root'
})
export class CallManagementService {

  constructor(private http: HttpClient) { }

  listCall = enviroment.apiUrl + "gestion-cobranzas/public/api/call";
  reportAire = enviroment.apiUrl + "gestion-cobranzas/public/api/reportAire";

  getCallManagement(id: any): Observable<any>{
    return this.http.get<any>(this.listCall + '/' + id);
  }

  postCallManagement(body: any): Observable<any>{
    return this.http.post(this.listCall, body);
  }

  getReportData(): Observable<any>{
    return this.http.get<any>(this.reportAire);
  }
}
