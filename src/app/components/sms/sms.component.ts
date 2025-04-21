import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { SmsService } from '../../sms.service';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { subscribe } from 'node:diagnostics_channel';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-sms',
  imports: [CommonModule, NgxPaginationModule],
  templateUrl: './sms.component.html',
  styleUrl: './sms.component.css'
})
export class SmsComponent implements OnInit{

  importSms: boolean = false;
  index: boolean = true;
  isLoading: boolean = false;
  fileName: string = 'Ningún archivo seleccionado';
  selectedFile: File | null = null;
  fileError: boolean = false;
  sms: any[] =[];
  page: number = 1; 
  filteredSms: any[] = [];
  searchCelular: string = ''; 
  pageSize: number = 7; 

  constructor(private apiService: SmsService) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.apiService.getSms().subscribe(resdata => {
      this.sms = resdata
      this.isLoading = false;
      this.filteredSms = this.sms;
    })
  }

  filterCustomers() {
    this.filteredSms = this.sms.filter(sms =>
      sms.celular.toLowerCase().includes(this.searchCelular.toLowerCase())
    );
    this.page = 1; // Resetear la página al filtrar
  }

  onPdf(){
    this.apiService.pdfSms().subscribe((response: Blob) => {
      const blob = new Blob([response], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      window.open(url);
    });
  }

  onImportUpload(){
    this.importSms = true;
    this.index = false;
  }

  onBack(){

  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.fileName = file.name;
      this.fileError = false; // Limpiar error si ya seleccionó archivo
    } else {
      this.fileName = 'Ningún archivo seleccionado';
      this.selectedFile = null;
    }
  }

  uploadImportSmsFile() {
    this.fileError = !this.selectedFile;
  
    if (this.fileError) {
      return; // No continuar si hay errores
    }
  
    this.isLoading = true;
  
    const formData = new FormData();
    formData.append('file', this.selectedFile as File);
  
    this.apiService.importSms(formData).subscribe(
      response => {
        console.log('Archivo subido con éxito', response);
        this.isLoading = false;
  
        // ✅ Mostrar el Toast en la parte superior
        Swal.fire({
          toast: true,
          position: 'top-end',  // 🔥 Se muestra arriba a la derecha
          icon: 'success',
          title: 'Archivo subido correctamente',
          showConfirmButton: false,
          timer: 3000  // ⏳ Se cierra automáticamente en 3 segundos
        });
      },
      error => {
        console.error('Error al subir el archivo', error);
        this.isLoading = false;
  
        // ❌ Mostrar error con Toast
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'error',
          title: 'Error al subir el archivo',
          showConfirmButton: false,
          timer: 3000
        });
      }
    );
  } 

}
