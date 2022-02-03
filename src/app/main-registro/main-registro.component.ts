import { Component, OnInit } from '@angular/core';
import { FormBuilder , FormControl, FormGroup, Validators} from '@angular/forms';
import { Observable } from 'rxjs';
import { FirebaseDataService, Salida, Vehiculo } from '../Services/firebase-data.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-main-registro',
  templateUrl: './main-registro.component.html',
  styleUrls: ['./main-registro.component.css']
})
export class MainRegistroComponent implements OnInit {
  horaEntrada= new FormControl('00:00:00 AM');
  
  horaSalida= new FormControl('');
  fechaFiltro = new FormControl('');
  horaFiltro = new FormControl('');
  placas = new FormControl('');
  tipoVehiculo = new FormControl('');
  total= new FormControl(0);
  today = '';
  horaEntradaCalculo = '';
  totalFinal = 0;
  


  lista:string[] = ["Oficial", "Residente", "No residente"];
  public tipoCarro: string;
  public hora:string;
  public minuto:string;
  public observableVehiculo: Observable<Vehiculo[]>;
  public observableSalida: Observable<Salida[]>;
  public modalEntrada:any[];


  constructor(
    
    public modal: NgbModal,
    public formBuilder: FormBuilder,
    public firebaseService: FirebaseDataService,
  ) { 
    var someDate = moment().format("YYYY-MM-DD");
    
    
    this.tipoCarro = '';
    this.observableVehiculo= this.firebaseService.GetVehiculo();
    this.observableSalida= this.firebaseService.GetSalida();
    this.hora = '';
    this.minuto = '';
    this.modalEntrada = [];
    this.total.setValue(0);
    
    
  }

  ngOnInit(): void {
    
    
  }
  calcularTotal(hora:any)
  {
    var spl = hora.split(":");
    return parseInt(spl[0])*60/parseInt(spl[1]);
  }
  onChange(event:string) :void
  {
    this.tipoVehiculo.setValue(event);

    //console.log(this.tipoVehiculo)
    
  }
  onFilterChange(event:string):void{
    this.fechaFiltro.setValue(event);
    this.observableSalida= this.firebaseService.GetSalidaByFecha(event);
  }
  onHourChange(event:string):void{
    this.horaFiltro.setValue(event);
    this.observableSalida = this.firebaseService.GetSalidaByHora(event);
  }
  public downloadAsPDF()
  {
    const DATA = document.getElementById('htmlData') as HTMLElement;
    const doc = new jsPDF('p', 'pt', 'a4');
    const options = {
      background: 'white',
      scale: 3
    };
    html2canvas(DATA, options).then((canvas) => {

      const img = canvas.toDataURL('image/PNG');

      // Add image Canvas to PDF
      const bufferX = 15;
      const bufferY = 15;
      const imgProps = (doc as any).getImageProperties(img);
      const pdfWidth = doc.internal.pageSize.getWidth() - 2 * bufferX;
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      doc.addImage(img, 'PNG', bufferX, bufferY, pdfWidth, pdfHeight, undefined, 'FAST');
      return doc;
    }).then((docResult) => {
      docResult.save(`ReporteEstacionamiento.pdf`);
    });
  }
  
  

  borrarAutomovil(item:any)
  {
    if(this.horaSalida.value=='00:00:00 AM' || this.horaSalida.value == '')
    {
      Swal.fire(
        'Error!',
        'Ingresa la hora de salida',
        'error'
      )
    }
    else{
      var a:any = new Date("February 12, 2014 "+ this.horaSalida.value);
      var b:any = new Date("February 12, 2014 "+item.horaEntrada);
      var c = ((a-b)/1000/60)
      if(item.tipoVehiculo == 'Oficial')
      {
        this.totalFinal = 0;
      }
      else 
      if(item.tipoVehiculo == 'Residente')
      {
        this.totalFinal = c*1;
      }
      else
      {
        this.totalFinal = c *3;
      }
    try{
    
      const tempSalida: Salida = {
        horaEntrada: item.horaEntrada,
        diaEntrada: item.diaEntrada,
        placas: item.placas,
        tipoVehiculo: item.tipoVehiculo,
        horaSalida: this.horaSalida.value,
        diaSalida:moment().format("YYYY-MM-DD"),
        total:this.totalFinal,
        
      }
      

      //console.log(c)
      this.firebaseService.AddSalida(tempSalida);
      console.log("Salida Registrada del vehiculo con placas: ", item.placas)
      this.firebaseService.DeleteVehiculo(item);
      
    }
    catch(err)
    {
      console.log(err)
    }
    }

    
    

  }
 

  async submitVehiculo()
  {
    if(this.horaEntrada.value == '00:00:00 AM' || this.placas.value == '' || this.tipoVehiculo.value == '')
    {
      Swal.fire(
        'Error!',
        'Asegurate de ingresas los datos correctamente',
        'error'
      )
    }
    else{
      try{
        const tempVehiculo: Vehiculo = {
          horaEntrada: this.horaEntrada.value,
          diaEntrada:moment().format("YYYY-MM-DD"),
          placas: this.placas.value,
          tipoVehiculo: this.tipoVehiculo.value,
          
        }
        await this.firebaseService.AddVehiculo(tempVehiculo);
        console.log('Guardado');
      }
      catch(err)
      {
        console.log(err);
      }
    }
    
    
  }


}
