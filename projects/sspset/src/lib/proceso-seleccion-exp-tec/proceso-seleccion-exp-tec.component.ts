import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalAsociacionExpInteresComponent } from './modal-asociacion-exp-interes/modal-asociacion-exp-interes.component';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ContratacionBienesServiciosComponent } from './contratacion-bienes-servicios/contratacion-bienes-servicios.component';
import { ContratacionConsultoriaComponent } from './contratacion-consultoria/contratacion-consultoria.component';

@Component({
  selector: 'set-proceso-seleccion-exp-tec',
  templateUrl: './proceso-seleccion-exp-tec.component.html',
  styleUrls: ['./proceso-seleccion-exp-tec.component.css']
})
export class ProcesoSeleccionExpTecComponent implements OnInit {
  snip: number;
  separator = "";
  idTipoFase:string="0";
  bsModalAsociacionExpInteres:BsModalRef;
  idFase_:string="0";
  @ViewChild('BienesServicios') BienesServicios: ContratacionBienesServiciosComponent;
  @ViewChild('Consultoria') Consultoria: ContratacionConsultoriaComponent;

  constructor( private route: ActivatedRoute,
    private modalService:BsModalService
    ) { }

  ngOnInit() {
    let params:any=JSON.parse(sessionStorage.getItem("datosProyectoExpTec"));
    this.snip = params.snip;
    this.idTipoFase=params.idTipoFase;
    this.idFase_=params.idFase;
  }
  AbrirModalJenri(){
  //   let config = {
  //     ignoreBackdropClick: true,
  //     keyboard: false,
  //     class: 'modal-lg',
  //     initialState: {      
  //       intIdFase:Number(this.idFase)
  //     }
  // };
  
    const initialState = {
      intIdFase:Number(this.idTipoFase),
      idFase:Number(this.idFase_)
    };
    this.bsModalAsociacionExpInteres = this.modalService.show(ModalAsociacionExpInteresComponent, {initialState});
    // this.bsModalAsociacionExpInteres.content.EventInsertar.subscribe(
    //   (data:any)=>{
    //     // if(data==1){
    //     //   this.Obra.busqueda(1);
    //     // }
    //     if(data==2){
    //       this.BienesServicios.busqueda(1);
    //     }
    //     if(data==3){
    //       this.Consultoria.busqueda(1);
    //     }
    //   }
    // );
  }
}
