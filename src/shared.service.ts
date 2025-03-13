import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private refreshNeeded = new Subject<void>();

  get refresh$() {
    return this.refreshNeeded.asObservable();
  }

  triggerRefresh() {
    this.refreshNeeded.next();
  }
}
