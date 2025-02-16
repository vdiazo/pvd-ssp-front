import { Component, OnInit, Input } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ModalRegistrarResponsableComponent } from './modal-registrar-responsable/modal-registrar-responsable.component';
import { FacadeService } from '../../patterns/facade.service';
import { Funciones } from '../../../appSettings/funciones';


@Component({
  selector: 'set-responsables-expediente-tecnico',
  templateUrl: './responsables-expediente-tecnico.component.html',
  styleUrls: ['./responsables-expediente-tecnico.component.css']
})
export class ResponsablesExpedienteTecnicoComponent implements OnInit {

  bsModalRef: BsModalRef;
  lstResponsables: any = [];
  totalRegistrosResponsables: number;
  numPaginasMostrar: number = 5;

  numero_Pagina: number = 0;
  num_filas: number = 10;

  @Input() idSeguimientoMonitoreoObra;
  idSeguimientoObra: number;
  @Input() bEstado: boolean;

  constructor(private modalService: BsModalService, private fs: FacadeService,public funciones: Funciones) { }

  ngOnInit() {
    this.SetearIdSeguimientoMonitoreo();
    this.listarResponsables(this.num_filas, this.numero_Pagina);
  }

  SetearIdSeguimientoMonitoreo(): any {
    if (this.idSeguimientoMonitoreoObra == 0) {
      if (sessionStorage.getItem("idSeguimiento") == null) {
        this.idSeguimientoObra = 0;
      } else {
        this.idSeguimientoObra = parseInt(sessionStorage.getItem("idSeguimiento"));
      }
    } else {
      this.idSeguimientoObra = parseInt(this.idSeguimientoMonitoreoObra);
      sessionStorage.setItem("idSeguimiento", this.idSeguimientoObra.toString());
    }
  }

  opnModNuevoResponsableExpediente(){
    this.SetearIdSeguimientoMonitoreo();
    let config = {
      ignoreBackdropClick: true,
      keyboard: false,
      initialState: {
        idSeguimientoEXpediente: this.idSeguimientoObra
      }
    };
   

    this.bsModalRef = this.modalService.show(ModalRegistrarResponsableComponent, config);
    this.bsModalRef.content.retornoValores.subscribe(
      data => {
        this.listarResponsables(this.num_filas,this.numero_Pagina);
        
      }
    );

  }
  listarResponsables(pNumFilas, pNumPagina) {
    this.fs.responsableElaboracionExpedienteService.listarResponsableSeguimientoExpediente(this.idSeguimientoObra,pNumFilas,pNumPagina,).subscribe(
      (data: any) => {
        if(data==""){
          this.lstResponsables=[];
        }else{
          this.lstResponsables = data;
        }
        
        /*if(data.cantidad_registro>0){
          this.ValidarInfoAdicionalExp.setResponsables(true);
        }
        else{
          this.ValidarInfoAdicionalExp.setResponsables(false);
        }*/
      }
    )
  }

  editarResponsableExpediente(responsable){

  }

  anularResponsableExpediente(idResponsable){
    this.funciones.alertaRetorno("question", "¿Está seguro de eliminar el registro?", "", true, (respuesta) => {
      if (respuesta.value) {
        let param={"id_responsable_seguimiento_expediente":idResponsable,"usuario_eliminacion":sessionStorage.getItem("Usuario")}
        this.fs.responsableElaboracionExpedienteService.anularResponsableSeguimientoExpediente(param).subscribe(
          respuestaEliminacion => {
            this.listarResponsables(this.num_filas,this.numero_Pagina);
          }
        );
      }
    });
  }

  cambiarPagina(event){

  }

}
