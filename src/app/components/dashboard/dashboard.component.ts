import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DebtCollectionManagementService } from '../../debt-collection-management.service';
import { AddRecordComponent } from './add-record/add-record.component';
import { CallManagementService } from '../../call-management.service';
import { SharedService } from '../../../shared.service';
import { NgxPaginationModule } from 'ngx-pagination';
import Swal from 'sweetalert2';
import { CurrencyFormatPipe } from '../../currency-format.pipe';
import * as ExcelJS from 'exceljs';

declare var $: any;

@Component({
  selector: 'app-dashboard',
  imports: [ReactiveFormsModule, CommonModule, FormsModule, AddRecordComponent, NgxPaginationModule, CurrencyFormatPipe],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {

  detail = false;
  upload = false;
  importUpdate = false;
  fileName: string = 'Ningún archivo seleccionado';
  selectedFile: File | null = null;
  codcamp: number | null = null; // Asegurar que puede ser null
  customers: any[] = []; 
  customerSelected: any;
  calls: any[] = [];
  filteredCustomers: any[] = []; 
  searchNIC: string = ''; 
  page: number = 1; 
  pageSize: number = 7;  
  showAll: boolean = false;
  maxPhonesToShow: number = 3;
  isLoading: boolean = false;

  // Variables de error
  fileError: boolean = false;
  codcampError: boolean = false;

  reportData: any[] =[];
  
  constructor(
    private sharedService: SharedService, 
    private customerService: DebtCollectionManagementService, 
    private apiService: CallManagementService
  ) {}

  private getVariables() {
    this.isLoading = true;
    this.customerService.getCustomers().subscribe(resdata => {
      this.customers = resdata.data;
      this.filteredCustomers = this.customers;
      this.isLoading = false;
    });
  }

  toggleShowAll() {
    this.showAll = !this.showAll;
  }

  filterCustomers() {
    this.filteredCustomers = this.customers.filter(customer =>
      customer.nic.toLowerCase().includes(this.searchNIC.toLowerCase())
    );
    this.page = 1; // Resetear la página al filtrar
  }

  abrirModal() {
    $('#miModal').modal('show');
  }

  onUpload(){
    this.upload = true;
    this.importUpdate = false;
    this.detail = false;
  }

  onImportUpload(){
    this.upload = false;
    this.importUpdate = true;
    this.detail = false;
  }

  onView(customer: any){
    this.detail = true;
    this.importUpdate = false;
    this.upload = false;
    this.customerSelected = customer;  
    this.apiService.getCallManagement(customer.nic).subscribe( resdata => {
      this.calls = resdata.data;
    })  
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

  uploadFile() {
    this.fileError = !this.selectedFile;
    this.codcampError = !this.codcamp;
  
    if (this.fileError || this.codcampError) {
      return; // No continuar si hay errores
    }
  
    this.isLoading = true;
  
    const formData = new FormData();
    formData.append('file', this.selectedFile as File);
    formData.append('codcamp', this.codcamp!.toString());
  
    this.customerService.postCustomers(formData).subscribe(
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
  
        this.resetForm();
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

  uploadImportFile() {
    this.fileError = !this.selectedFile;
  
    if (this.fileError) {
      return; // No continuar si hay errores
    }
  
    this.isLoading = true;
  
    const formData = new FormData();
    formData.append('file', this.selectedFile as File);
  
    this.customerService.postUpdate(formData).subscribe(
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
  
        this.resetForm();
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

  reportAire() {  
    this.isLoading = true;
  
    // Llamada al servicio para obtener los datos de la API
    this.apiService.getReportData().subscribe(data => {
      this.reportData = data.data;
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Reporte Aire');
  
      // Definir las columnas
      worksheet.columns = [
        { header: 'Codcamp', key: 'codcamp' },
        { header: 'NIC', key: 'nic' },
        { header: 'Fecha de Gestión', key: 'management_date' },
        { header: 'Hora de Gestión', key: 'management_time' },
        { header: 'Gestión', key: 'management' },
        { header: 'Resultado', key: 'result' },
        { header: 'Anomalía', key: 'anomaly' },
        { header: 'Entidad de Cobro', key: 'collection_entity' },
        { header: 'Fecha Compromiso', key: 'commitment_date' },
        { header: 'Fecha Pago', key: 'payment_date' },
        { header: 'Valor de Pago', key: 'payment_value' },
        { header: 'Nombre de Contacto', key: 'contact_name' },
        { header: 'ID de Contacto', key: 'contact_id' },
        { header: 'Correo de Contacto', key: 'contact_email' },
        { header: 'Teléfono de Contacto', key: 'contact_phone' },
        { header: 'Observación', key: 'observation' },
        { header: 'Usuario Agente', key: 'user_manager' }
      ];
  
      // Agregar filas con los datos del JSON
      worksheet.addRows(this.reportData);
  
      // Crear un buffer con el archivo Excel y descargarlo
      workbook.xlsx.writeBuffer().then(buffer => {
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'reporte_aire.xlsx';
        link.click();
  
        // ✅ Desactivar el loading después de que termine la descarga
        this.isLoading = false;
      }).catch(err => {
        console.error('Error al generar el archivo Excel', err);
        this.isLoading = false; // Asegurar que se desactive el loading en caso de error
      });
    }, error => {
      console.error('Error en la API', error);
      this.isLoading = false; // Asegurar que se desactive el loading si la API falla
    });
  }
  

  resetForm() {
    this.selectedFile = null;
    this.fileName = 'Ningún archivo seleccionado';
    this.codcamp = null;
    this.fileError = false;
    this.codcampError = false;
  }

  onBack(): void {
    this.detail = false;
    this.upload = false;
    this.importUpdate = false;
    this.customerSelected = '';
    this.getVariables();
  }

  ngOnInit(): void {
    this.sharedService.refresh$.subscribe(() => {
      this.apiService.getCallManagement(this.customerSelected.nic).subscribe( resdata => {
        this.calls = resdata.data;
      })
    });

    this.getVariables();
  }
}