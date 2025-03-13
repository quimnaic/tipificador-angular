import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'app-add-user',
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './add-user.component.html',
  styleUrl: './add-user.component.css'
})
export class AddUserComponent {
  userForm: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService){
    this.userForm = this.fb.group({
      document: [''],
      name: [''],
      password: [''],
      //password_confirm: ['']
    })
  }

  onSubmit(){
    const formData = {
      name: this.userForm.value.name,
      document: this.userForm.value.document,
      password: this.userForm.value.password,
      password_confirmation: this.userForm.value.password
    }

    this.authService.register(formData).subscribe();
  }
}
