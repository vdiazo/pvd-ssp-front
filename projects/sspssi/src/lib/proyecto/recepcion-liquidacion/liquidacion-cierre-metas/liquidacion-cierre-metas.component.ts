import { Component, OnInit, Input } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { CierreProyectoService } from '../../../../servicios/recepcion-liquidacion/cierre-proyecto.service';
import { FacadeService } from '../../../../patterns/facade.service';

@Component({
  selector: 'ssi-liquidacion-cierre-metas',
  templateUrl: './liquidacion-cierre-metas.component.html',
  styleUrls: ['./liquidacion-cierre-metas.component.css']
})
export class LiquidacionCierreMetasComponent implements OnInit {

  UltimaActualizacion: string = "";
  totalRegistros: number;
  paginaActiva: number = 0;
  numero_Pagina: number = 0;
  num_filas: number = 5;
  numPaginasMostrar: number = 5;

  idSeguimientoMonitoreo: number;
  respuesta;

  estado: boolean = false;

  @Input() idSeguimientoMonitoreoObra;
  @Input() bEstado: boolean;

  constructor(private fs: FacadeService) { }

  ngOnInit() {
    this.SetearIdSeguimientoMonitoreo();
    //this.comprobarEstadoLiquidacion();
  }

  SetearIdSeguimientoMonitoreo(): any {
    if (this.idSeguimientoMonitoreoObra == 0) {
      if (sessionStorage.getItem("idSeguimiento") == null) {
        this.idSeguimientoMonitoreo = 0;
      } else {
        this.idSeguimientoMonitoreo = parseInt(sessionStorage.getItem("idSeguimiento"));
      }
    } else {
      this.idSeguimientoMonitoreo = parseInt(this.idSeguimientoMonitoreoObra);
      sessionStorage.setItem("idSeguimiento", this.idSeguimientoMonitoreo.toString());
    }
  }

  /* comprobarEstadoLiquidacion() {
    this.fs.procesoLiquidacionService.ListarLiquidacionPaginado(this.idSeguimientoMonitoreo, this.num_filas, this.numero_Pagina).subscribe(
      data => {
        this.respuesta = data as any;
        this.estado = this.respuesta.aprobado;
      }
    );
  } */
}