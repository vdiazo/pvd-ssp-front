import { Component, OnInit, Input } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Functions } from '../../../appSettings/functions';
import { FacadeService } from '../../../patterns/facade.service';
import { ModalCreateComponent } from 'src/app/componentes/ejecucion-estado/acciones-seguimiento-monitoreo/modal-create/modal-create.component';
import { ModalUpdateComponent } from './modal-update/modal-update.component';
import { ActivatedRoute } from '@angular/router';
import { MaestraService } from '../../../services/maestra.service';
import { AuthService } from '../../auth/auth.service';
import { AplicarTipoControl } from 'src/app/appSettings';
import * as fs from 'file-saver';

@Component({
  selector: 'app-acciones-seguimiento-monitoreo',
  templateUrl: './acciones-seguimiento-monitoreo.component.html',
  styleUrls: ['./acciones-seguimiento-monitoreo.component.css']
})
export class AccionesSeguimientoMonitoreoComponent implements OnInit {
  UltimaActualizacion: string = "";
  @Input() idSeguimientoMonitoreoObra: number;
  @Input() tipoPerfil: string;
  @Input() idFase: number;
  bsModalRef: BsModalRef;
  totalRegistros;
  numero_Pagina: number = 0;
  numPaginasMostrar: number = 5;
  lista = [];
  @Input() bEstado: boolean;

  constructor(private modalService: BsModalService,
    public funciones: Functions,
    private fs: FacadeService,
    private route: ActivatedRoute,
    private sMant: MaestraService,
    private securityService: AuthService) { }

  obtenerDatosAuditoria() {
    //Obtener Datos Auditoria
    let dAuditoria: any = null;
    dAuditoria = JSON.parse(sessionStorage.getItem("DatosAuditoria"));
    if (dAuditoria != "") {
      let infoAuditoria = dAuditoria.find(c => c.opcion == "AccionesSeguimientoMonitoreo");
      if (infoAuditoria != undefined) {
        this.UltimaActualizacion = (infoAuditoria.nombre_usuario == null ? "" : infoAuditoria.nombre_usuario) + " - " + (infoAuditoria.fecha == null ? "" : this.funciones.formatFullDate(infoAuditoria.fecha));
      } else {
        this.UltimaActualizacion = "";
      }
    } else {
      this.UltimaActualizacion = "";
    }
    //Fin
  }


  monitoreo_tabSeg_regAccionesSegMonitoreo_nuevo: boolean
  monitoreo_tabSeg_accionesSegMonitoreo_lista: boolean
  monitoreo_tabSeg_regAccionesSegMonitoreo_eli: boolean
  monitoreo_tabSeg_regAccionesSegMonitoreo_mod: boolean

  ngOnInit() {
    this.obtenerDatosAuditoria();
    if(sessionStorage.getItem("esSuspension")=="false"){  
      this.listarAccionSeguimientoMonitoreo(this.idFase, this.idSeguimientoMonitoreoObra, this.numero_Pagina, this.numPaginasMostrar);
    }
    

    this.monitoreo_tabSeg_regAccionesSegMonitoreo_nuevo = this.esVisible("monitoreo_tabSeg_regAccionesSegMonitoreo_nuevo");
    this.monitoreo_tabSeg_accionesSegMonitoreo_lista = this.esVisible("monitoreo_tabSeg_accionesSegMonitoreo_lista");
    this.monitoreo_tabSeg_regAccionesSegMonitoreo_eli = this.esVisible("monitoreo_tabSeg_regAccionesSegMonitoreo_eli");
    this.monitoreo_tabSeg_regAccionesSegMonitoreo_mod = this.esVisible("monitoreo_tabSeg_regAccionesSegMonitoreo_mod");
  }

  listarAccionSeguimientoMonitoreo(idFase: number, idSegMonitoreo, numero_Pagina: number, numPaginasMostrar: number): any {
    this.fs.accionSeguimientoMonitoreoService.listar(idFase, this.tipoPerfil, idSegMonitoreo, numPaginasMostrar, numero_Pagina).subscribe(
      (data: any) => {
        if (data != "") {
          this.totalRegistros = data[0].cantidad;
          if (this.totalRegistros != 0) {
            this.lista = data[0].acciones_monitoreo as any[];
          }
          else {
            this.lista = [];
          }
        }
      });
  }


  openModalNuevo() {
    const initialState = {
      idSeguimientoMonitoreoObra: this.idSeguimientoMonitoreoObra,
      idFase: this.idFase,
      perfil: this.tipoPerfil
    };

    let config = {
      ignoreBackdropClick: true,
      keyboard: false,
      class: 'modal-accion-monitoreo',
      initialState: initialState
    };

    this.bsModalRef = this.modalService.show(ModalCreateComponent, config);
    this.bsModalRef.content.retornoValores.subscribe(
      () => {
        this.listarAccionSeguimientoMonitoreo(this.idFase, this.idSeguimientoMonitoreoObra, this.numero_Pagina, this.numPaginasMostrar);
        this.consultaAuditoria();
      }
    )
  }

  editarFila(row) {
    const initialState = {
      idSeguimientoMonitoreoObra: this.idSeguimientoMonitoreoObra,
      editRow: row,
      perfil: this.tipoPerfil
    };

    let config = {
      ignoreBackdropClick: true,
      keyboard: false,
      class: 'modal-accion-monitoreo',
      initialState: initialState
    };

    this.bsModalRef = this.modalService.show(ModalUpdateComponent, config);
    this.bsModalRef.content.retornoValores.subscribe(
      () => {
        this.listarAccionSeguimientoMonitoreo(this.idFase, this.idSeguimientoMonitoreoObra, this.numero_Pagina, this.numPaginasMostrar);
        this.consultaAuditoria();
      }
    )
  }

  eliminarFila(row) {
    row.usuario_eliminacion = sessionStorage.getItem("Usuario");

    this.funciones.alertaRetorno("question", "¿Está seguro de eliminar la acción de seguimiento y monitoreo?", "", true, (respuesta) => {
      if (respuesta.value) {
        this.fs.accionSeguimientoMonitoreoService.eliminar(row).subscribe(
          respuesta => {
            if (respuesta) {
              this.funciones.mensaje("success", this.funciones.mostrarMensaje("actualizar", ""));
              this.consultaAuditoria();
              this.listarAccionSeguimientoMonitoreo(this.idFase, this.idSeguimientoMonitoreoObra, this.numero_Pagina, this.numPaginasMostrar);
            } else {
              this.funciones.mensaje("warning", this.funciones.mostrarMensaje("error", ""));
            }
          }
        )
      }
    });
  }

  paginaActiva: number = 0;
  cambiarPagina(pagina) {
    this.paginaActiva = ((pagina.page - 1) * this.numPaginasMostrar);
    this.numero_Pagina = this.paginaActiva;

    this.listarAccionSeguimientoMonitoreo(this.idFase, this.idSeguimientoMonitoreoObra, this.numero_Pagina, this.numPaginasMostrar);
  }

  consultaAuditoria() {
    this.sMant.consultDatosAuditoria(sessionStorage.getItem("idFase")).subscribe(
      respuesta => {
        sessionStorage.setItem("DatosAuditoria", JSON.stringify(respuesta));
        this.obtenerDatosAuditoria();
      }
    );
  }

  esVisible(hasClaimType) {
    hasClaimType = hasClaimType + "_" + this.tipoPerfil;
    let value = this.securityService.hasClaim(hasClaimType) == AplicarTipoControl.Visible;
    return value;
  }

  descargarFormatoActaVisitaPDF(){
    let idTramo = this.route.snapshot.params.idTramo;
    let idProyecto = this.route.snapshot.params.idProyecto;

    this.fs.accionSeguimientoMonitoreoService.descargarFormatoActaVisitaPDF(idProyecto, idTramo)
      .subscribe((data: any) => {
        let blob = new Blob([data.body], { type: 'application/pdf' });
            fs.saveAs(blob, 'ActaVisitaMonitoreo.pdf');
      })
  }
}