import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InteractionService } from '../../../interaction.service';
import { CallManagementService } from '../../../call-management.service';
import { SharedService } from '../../../../shared.service';

declare var $: any;

@Component({
  selector: 'app-add-record',
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './add-record.component.html',
  styleUrl: './add-record.component.css'
})
export class AddRecordComponent implements OnInit{
  @Input() callData!: { nic: number, codcamp: number };
  callForm: FormGroup;

  managements: any[] = [];
  results: any[] = [];
  anomalies: any[] = [];
  isLoading: boolean = false;

  constructor(private sharedService: SharedService, private fb: FormBuilder, private interaction: InteractionService, private apiService: CallManagementService){
    this.callForm = this.fb.group({
      management_date: [''],
      management_time: [''],
      management_type: [''],
      result: [''],
      anomaly: [''],
      collection_entity: [''],
      commitment_date: [''],
      payment_date: [''],
      payment_value: [''],
      contact_name: [''],
      contact_id: [''],
      contact_email: [''],
      contact_phone: [''],
      observation: [''],
      call_duration: [''],
      user_manager: ['']
    })
  }

  ngOnInit(): void {
    this.getVariables();
  }

  getVariables(): void{
    this.interaction.getManagement().subscribe( resdata => {
      this.managements = resdata.data;
    })
  }

  onResult(event: Event){
    this.interaction.getResult(Number((event.target as HTMLSelectElement).value)).subscribe( resdata => {
      this.results = resdata.data;
    })
  }

  onAnomaly(event: Event){
    this.interaction.getAnomaly(Number((event.target as HTMLSelectElement).value)).subscribe( resdata => {
      this.anomalies = resdata.data;
    })
  }

  resetForm() {
    this.callForm.reset({
      management_type: '', // Mantiene el placeholder "--Seleccione--"
      result: '',
      anomaly: '',
      collection_entity: '',
      commitment_date: null,
      payment_date: null,
      payment_value: '',
      contact_name: '',
      contact_id: '',
      contact_email: '',
      contact_phone: '',
      observation: '',
      call_duration: '',
    });
  }  

  onSubmit(){
    this.isLoading = true;
    if(this.callForm.valid){
      const formData = {
        nic: this.callData.nic,
        management_type: this.callForm.value.management_type,
        result: this.callForm.value.result,
        anomaly: this.callForm.value.anomaly,
        collection_entity: this.callForm.value.collection_entity,
        commitment_date: this.callForm.value.commitment_date,
        payment_date: this.callForm.value.payment_date,
        payment_value: this.callForm.value.payment_value,
        contact_name: this.callForm.value.contact_name,
        contact_id: this.callForm.value.contact_id,
        contact_email: this.callForm.value.contact_email,
        contact_phone: this.callForm.value.contact_phone,
        observation: this.callForm.value.observation,
        call_duration: this.callForm.value.call_duration,
        user_manager: localStorage.getItem('document'),
        codcamp: this.callData.codcamp ?? null
      };
      
      this.apiService.postCallManagement(formData).subscribe(() => {
        this.sharedService.triggerRefresh(); 
        $('#miModal').modal('hide');
        this.callForm.reset({
          management_type: '', // Mantiene el placeholder "--Seleccione--"
          result: '',
          anomaly: '',
          collection_entity: '',
          commitment_date: null,
          payment_date: null,
          payment_value: '',
          contact_name: '',
          contact_id: '',
          contact_email: '',
          contact_phone: '',
          observation: '',
          call_duration: '',
        });
        this.isLoading = false;
      })
    }
  }
}
