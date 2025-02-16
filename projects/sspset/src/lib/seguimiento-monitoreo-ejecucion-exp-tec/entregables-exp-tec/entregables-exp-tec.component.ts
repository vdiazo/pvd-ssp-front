import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';

import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

import { Funciones } from '../../../appSettings/funciones';
import { FacadeService } from '../../patterns/facade.service';
import { MaestraService } from '../../services/maestra.service';

import { Entregable } from '../../../models/response/entregable';
import { ModalEntregableComponent } from '../entregables-exp-tec/modal-entregable/modal-entregable.component';
import { ModalUpdateEntregableComponent } from '../entregables-exp-tec/modal-update-entregable/modal-update-entregable.component';

@Component({
  selector: 'set-entregables-exp-tec',
  templateUrl: './entregables-exp-tec.component.html',
  styleUrls: ['./entregables-exp-tec.component.css']
})
export class EntregablesExpTecComponent implements OnInit {

  UltimaActualizacion: string = "";
  @Input() idSeguimientoMonitoreoObra: number
  @Input() guid: string
  @Input() fecha_inicio_contractual: Date;
  listaEntregablesBD:Entregable[];
  listado:any[];
  codigoEditar: number = 0;
  bsModalRef: BsModalRef;
  @Input() bEstado: boolean;
  editarFila:boolean=false;

  totalRegistros;
  paginaActiva: number = 0;
  numero_Pagina: number = 0;
  numPaginasMostrar: number = 5;

  @Output() EventEliminar: EventEmitter<any> = new EventEmitter();

  

  constructor(
    public funciones: Funciones,
    private fs: FacadeService,
    private modalService: BsModalService,
    private sMant: MaestraService
  ) { }

  ngOnInit() {
    this.listarEntregables(this.numero_Pagina, this.numPaginasMostrar);
  }

  
  nuevoRegistroEntregable() {
    const initialState = {
      lista: this.listaEntregablesBD,
      idSeguimientoMonitoreoObra: this.idSeguimientoMonitoreoObra,
      fecha_inicio_contractual: this.fecha_inicio_contractual
    };

    let config = {
      ignoreBackdropClick: true,
      keyboard: false,
      class: 'modal-entregable',
      initialState: initialState
    };

    this.bsModalRef = this.modalService.show(ModalEntregableComponent, config);
    this.bsModalRef.content.retornoValores.subscribe(
      () => {
        this.listarEntregables(this.numero_Pagina, this.numPaginasMostrar);
        //this.consultaAuditoria();
      }
    )
  }

  listarEntregables(numeroPagina: number, nroFilas: number) {
    this.fs.entregableExpTecService.listarEntregableExpediente(this.idSeguimientoMonitoreoObra, numeroPagina, nroFilas)
      .subscribe(
        data => {
          let lista = data[0] as any;
          let cantidad = lista.cantidad;
          this.totalRegistros = cantidad;

          if (cantidad == 0) {
            this.listaEntregablesBD = [];
          }
          else {
            this.listaEntregablesBD = lista.entregable as Entregable[]
          }
        });
  }

  entrega:Entregable;
  editarFilaEntregable(entregable: Entregable) {
    let entregableCopy= Object.assign({}, entregable);
    let idEntregable=entregable.id_entregable_expediente;
    this.fs.entregableExpTecService.obtenerEntregableExpediente(idEntregable).subscribe(
      data=>{
        this.entrega=data[0];

        const initialState = {
          tipoEntregable:entregable.tipo_entregable,
          Entregable: this.entrega,
          fecha_inicio_contractual: this.fecha_inicio_contractual,
          idSeguimientoMonitoreoObra: this.idSeguimientoMonitoreoObra
        };
    
        let config = {
          ignoreBackdropClick: true,
          keyboard: false,
          class: 'modal-entregable',
          initialState: initialState
        };
    
        this.bsModalRef = this.modalService.show(ModalUpdateEntregableComponent, config);
        this.bsModalRef.content.retornoValores.subscribe(
          (data) => {
            this.listarEntregables(this.numero_Pagina, this.numPaginasMostrar);
            this.EventEliminar.emit(1);
          }
        )

      }
    )


    
  }

  eliminarFilaEntregable(entregable: Entregable) {
    entregable.usuario_eliminacion = sessionStorage.getItem("Usuario");

    this.funciones.alertaRetorno("question", "<strong>¿Está seguro de eliminar el entregable?</strong>", "<div style='color:#E53935;font-weight:400;'>¡Importante!<br>Se eliminarán los avances de elaboración del expediente técnico relacionadas a este entregable", true, (respuesta) => {
      if (respuesta.value) {
        let param={
          id_entregable_expediente:entregable.id_entregable_expediente,
          usuario_eliminacion:sessionStorage.getItem("Usuario")
        }
        this.fs.entregableExpTecService.anularEntregableExpediente(param).subscribe(
          () => {
            this.listarEntregables(this.numero_Pagina, this.numPaginasMostrar);
            this.EventEliminar.emit(1);
            //this.consultaAuditoria();
          }
        )
      }
    });
  }
  
  entregaDetalle:any[];
  numEntregables:number=0;
  verDetalleEntregable(codigo: number) {
    if (codigo == this.codigoEditar) {
      this.codigoEditar = 0;
    } else {
      this.codigoEditar = codigo;
    }
    this.fs.entregableExpTecService.obtenerEntregableExpediente(codigo).subscribe(
      data=>{
        this.entregaDetalle=data as any;
        this.numEntregables=data[0].detalle_entregable.length;
      }
    )
  } 

  cambiarPagina(pagina) {
    this.paginaActiva = ((pagina.page - 1) * this.numPaginasMostrar);
    this.numero_Pagina = this.paginaActiva;

    this.listarEntregables(this.numero_Pagina, this.numPaginasMostrar);
  }


}
