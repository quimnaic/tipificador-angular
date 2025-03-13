import { Component } from '@angular/core';
import { AddUserComponent } from './add-user/add-user.component';

declare var $: any;

@Component({
  selector: 'app-users',
  imports: [AddUserComponent],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent {

  openModal(): void {
    $('#miModal').modal('show');
  }

}
