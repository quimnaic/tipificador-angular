import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AudiosService } from '../../audios.service';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-audios',
  imports: [CommonModule, ReactiveFormsModule, FormsModule, NgxPaginationModule],
  templateUrl: './audios.component.html',
  styleUrl: './audios.component.css'
})
export class AudiosComponent implements OnInit{

  isLoading: boolean = false;
  anio: any[] = [];
  month: any[] = [];
  day: any[] = [];
  selectAnio: any;
  selectMonth: any;
  selectDay: any;
  audiosForm: FormGroup;
  audios: any[] = [];
  search: boolean = true;
  detail: boolean = true;
  audioSrc: any;
  currentAudioFilename: any;
  filteredAudios: any;
  page: number = 1; 
  pageSize: number = 10;  
  searches: any;

  constructor(private apiService: AudiosService, private fb: FormBuilder) {
    this.audiosForm = this.fb.group({
      anio: [''],
      month: [''],
      day: ['']
    })
  }

  ngOnInit(): void {
    this.search = true;
    this.detail = false;
    this.apiService.getAllFiles().subscribe( resdata => {
      this.anio = resdata;
    })
  }

  onBack(){

  }

  onAnio(event: Event): void{
    this.selectAnio = (event.target as HTMLSelectElement).value;
    this.apiService.getMonthFiles(this.selectAnio).subscribe( resdata => {
      this.month = resdata;
    })
  }

  onMonth(event: Event): void{
    this.selectMonth = (event.target as HTMLSelectElement).value;
    this.apiService.getDayFiles(this.selectAnio, this.selectMonth).subscribe( resdata => {
      this.day = resdata;
    })
  }

  onSubmit(){
    this.selectDay = this.audiosForm.value.day
    this.apiService.getAudioFiles(this.selectAnio, this.selectMonth, this.selectDay).subscribe( resdata => {
        this.audios = resdata;
        this.filteredAudios = this.audios;
        this.search = false;
        this.detail = true;
      }
    )
  }

  onPlay(filename: any): void {
    this.apiService.getPlayAudio(this.selectAnio, this.selectMonth, this.selectDay, filename)
    .subscribe(blob => {
      const audioBlobUrl = URL.createObjectURL(blob);

      Swal.fire({
        title: 'Reproduciendo audio',
        html: `
          <audio controls autoplay style="width: 100%;">
            <source src="${audioBlobUrl}" type="audio/wav">
            Tu navegador no soporta el audio.
          </audio>
        `,
        showCloseButton: true,
        showConfirmButton: false,
        width: 600,
        customClass: {
          popup: 'rounded',
        }
      });

    }, error => {
      Swal.fire('Error', 'No se pudo cargar el audio', 'error');
    });
  }
  filterAudios() {
    this.filteredAudios = this.audios.filter(audio =>
      audio.phone.toLowerCase().includes(this.searches.toLowerCase())
    );
    this.page = 1; // Resetear la página al filtrar
  }

  onDownload(filename: any): void {
    this.apiService.getPlayAudio(this.selectAnio, this.selectMonth, this.selectDay, filename)
    .subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
    }, error => {
      console.error('Error al descargar el archivo:', error);
    });
  }
}
