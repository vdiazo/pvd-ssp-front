import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Functions } from '../../../../appSettings';
import { FacadeService } from '../../../../patterns/facade.service';
import { MaestraSsiService } from '../../../../servicios/maestra-ssi.service';
import { DxChartComponent } from 'devextreme-angular';

@Component({
  selector: 'ssi-comparativo-avance',
  templateUrl: './comparativo-avance.component.html',
  styleUrls: ['./comparativo-avance.component.css']
})

export class ComparativoAvanceComponent implements OnInit {

  @Input() idSeguimientoMonitoreoObra
  @Input() bEstado: boolean
  @Input() guid: string
  @Input() actualiza: boolean;

  @ViewChild(DxChartComponent) grafica: DxChartComponent

  seguimientoMonitoreo;
  totalRegistros;
  paginaActiva: number = 0;
  numero_Pagina: number = 0;
  num_filas: number = 5;
  numPaginasMostrar: number = 5;
  lstProgramadoEjecutado = Array();
  totalRegistro;
  cambios: boolean = true;

  constructor(public funciones: Functions,
    private fs: FacadeService) { }

  ngOnInit() {
    this.listarCronogramas();
  }

  listarCronogramas() {
    this.fs.valorizacionService.listarValorizacionesGrafico(this.idSeguimientoMonitoreoObra).subscribe(
      respuesta => {
        let lista = respuesta as any;
        let cantidad = lista.cantidad_registro;
        this.totalRegistro = cantidad;
        if (cantidad == 0) {
          this.lstProgramadoEjecutado = [];
        } else {
          this.lstProgramadoEjecutado = lista.data;
        }
      }
    );
  }

  cambiarPagina(pagina) {
    this.paginaActiva = ((pagina.page - 1) * this.numPaginasMostrar);
    this.numero_Pagina = this.paginaActiva;

    this.listarCronogramas();
  }

  actualizarTamano() {
    this.fs.valorizacionService.listarValorizacionesGrafico(this.idSeguimientoMonitoreoObra).subscribe(
      respuesta => {
        let lista = respuesta as any;
        let cantidad = lista.cantidad_registro;
        this.totalRegistro = cantidad;
        if (cantidad == 0) {
          this.lstProgramadoEjecutado = [];
        } /* else {
          let temp = lista.data.slice().reverse();
          this.lstProgramadoEjecutado = temp;
          let acum = 0;
          this.lstProgramadoEjecutado.forEach(element => {
            acum += element.avance_fisico_real;
            element.acumulado = acum;
          });
          this.grafica.instance.refresh();
        } */
        else {
          //let temp = lista.data.slice().reverse();
          this.lstProgramadoEjecutado = lista.data;
          this.grafica.instance.refresh();
        }
      }
    );
  }

}
