import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ModalAsociacionExpInteresComponent } from './modal-asociacion-exp-interes/modal-asociacion-exp-interes.component';
//import { FaseIdentificadorComponent } from './fase-identificador/fase-identificador.component';
import { ContratacionObraComponent } from './contratacion-obra/contratacion-obra.component';
import { ContratacionBienesServiciosComponent } from './contratacion-bienes-servicios/contratacion-bienes-servicios.component';
import { ContratacionConsultoriaComponent } from './contratacion-consultoria/contratacion-consultoria.component';

@Component({
  selector: 'app-proceso-seleccion',
  templateUrl: './proceso-seleccion.component.html',
  styleUrls: ['./proceso-seleccion.component.css']
})
export class ProcesoSeleccionComponent implements OnInit {
  snip: number;
  separator = "";
  bsModalAsociacionExpInteres: BsModalRef;
  idFase:string="0";

  NombreMunicipalidad:string=sessionStorage.getItem("UnidadEjecutora");
  IdTramo:number=0;
  IdProyecto:number=0;
  @ViewChild('Obra') Obra: ContratacionObraComponent;
  @ViewChild('BienesServicios') BienesServicios: ContratacionBienesServiciosComponent;
  @ViewChild('Consultoria') Consultoria: ContratacionConsultoriaComponent;
  
  constructor( private route: ActivatedRoute, private modalService: BsModalService) { }

  ngOnInit() {
    this.snip = this.route.snapshot.params.snip;
    this.idFase=this.route.snapshot.params.idFase;
    this.IdTramo=this.route.snapshot.params.idTramo;
    this.IdProyecto=this.route.snapshot.params.idProyecto;

  }
  AbrirModalJuancito(){
    const initialState = {
      intIdFase:Number(this.idFase)
    };
    this.bsModalAsociacionExpInteres = this.modalService.show(ModalAsociacionExpInteresComponent, {initialState});

    //this.bsModalAsociacionExpInteres.content.
    this.bsModalAsociacionExpInteres.content.EventInsertar.subscribe(
      (data:any)=>{
        if(data==1){
          this.Obra.busqueda(1);
        }
        if(data==2){
          this.BienesServicios.busqueda(1);
        }
        if(data==3){
          this.Consultoria.busqueda(1);
        }
      }
    );
  }
    //this.bsModalAsociacionExpInteres.content.closeBtnName = 'Close';  }
}
