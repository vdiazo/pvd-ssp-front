import { Component, OnInit } from '@angular/core';
import { ProcesoSeleccionService } from 'src/app/services/proceso-seleccion.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-modal-crono-osce',
  templateUrl: './modal-crono-osce.component.html',
  styleUrls: ['./modal-crono-osce.component.css']
})
export class ModalCronoOsceComponent implements OnInit {
  ListadoOsce=[];
  Cronograma=[];
  codigoconvocatoria:number=null;
  version_cronograma:number=null;
  constructor(
    private servicio:ProcesoSeleccionService,
    public BsModalRef:BsModalRef
  ) { }

  ngOnInit() {
    this.Cargarcombo().then((rpta)=>{
      if(rpta){
        this.version_cronograma=this.Cronograma[0].version_cronograma;
        this.CargarListado(this.version_cronograma);
      }
      else{
      }
    });
  }
  Cargarcombo():Promise<any>{
    let promise=new Promise((resolve,reject)=>{
      this.servicio.listarVersionCronograma(this.codigoconvocatoria).subscribe((data:any)=>{
        if(data.length>0){
          this.Cronograma=data;
          resolve(true);
        }else{
          resolve(false);
        }
      },()=>{resolve(false)});
    });
    return promise;
  }
  VCronograma(e:any){
    if(e==undefined){
      this.ListadoOsce=[];
    }
    else{
      this.CargarListado(e.version_cronograma);
    }
  }
  CargarListado(versionCrono){
    this.servicio.listarCronograma(this.codigoconvocatoria,versionCrono).subscribe((data:any)=>{
      this.ListadoOsce=data;
    });
  }
}
