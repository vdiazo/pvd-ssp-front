import { Component, OnInit } from '@angular/core';
import { FacadeService } from 'projects/sspssi/src/patterns/facade.service';
import { Functions, formatoMonedaPipe, formatoFechaPipe } from 'projects/sspssi/src/appSettings';
import { Proyecto } from 'projects/sspssi/src/models/request/proyecto-request';

import { Workbook } from 'exceljs';
import * as fs from 'file-saver';

@Component({
  selector: 'ssi-reporte-financiero',
  templateUrl: './reporte-financiero.component.html',
  styleUrls: ['./reporte-financiero.component.css']
})
export class ReporteFinancieroComponent implements OnInit {

  model: Proyecto;
  listUnidadEjecutora = [];
  listRegion = [];
  listEstado = [];
  totalRegistros: number = 0;
  paginaActiva: number = 0;
  numPaginasMostrar: number = 10;
  listProyecto = [];
  listReporte = [];
  head1;
  head2;
  bodyTotal;
  head_merge1;
  head_merge2;
  bodyTotal_merge;
  total_metas_fisicas: number = 0;
  total_costo: number = 0;
  total_ejecutado: number = 0;
  total_pim: number = 0;
  total_monto_transferencia: number = 0;

  dataSource = {
    reporte: [],
    cantidad_registro: 0,
    totales: []
  };

  constructor(private fs: FacadeService, public funciones: Functions) { }

  ngOnInit() {
    this.model = new Proyecto();
    this.listarRegion();
    this.listarEstado();
    this.listarMunicipalidad();
    this.buscarDataSource(this.model);
  }

  listarRegion() {
    this.fs.maestraService.listarDepartamentos().subscribe(
      respuesta => {
        this.listRegion = respuesta as any;
      }
    )
  }

  listarEstado() {
    this.fs.maestraService.listarEstadoProyecto().subscribe(
      respuesta => {
        this.listEstado = respuesta as any;
      }
    )
  }

  listarMunicipalidad() {
    this.fs.maestraService.listarMunicipalidad().subscribe(
      respuesta => {
        this.listUnidadEjecutora = respuesta as any;
      }
    )
  }

  cambiarPagina(pagina) {
    this.paginaActiva = ((pagina.page - 1) * this.numPaginasMostrar);
    this.model.intTake = this.paginaActiva;
    this.model.intSkip = 10;
    this.buscarDataSource(this.model);
  }

  buscarDataSource(model) {
    model.id_municipalidad == null ? model.id_municipalidad = 0 : model.id_municipalidad = model.id_municipalidad;
    model.cod_snip == null || model.cod_snip == "" ? model.cod_snip = 0 : model.cod_snip = model.cod_snip;
    model.coddepa == null ? model.coddepa = "" : model.coddepa = model.coddepa;
    model.codigo_estado == null ? model.codigo_estado = "" : model.codigo_estado = model.codigo_estado;

    this.model.intTake = this.paginaActiva;
    this.model.intSkip = 10;

    this.fs.maestraService.listarReporteAltaDireccionEjeDir(model.cod_snip, model.codigo_estado, model.id_municipalidad,
      model.coddepa, model.intSkip, model.intTake).subscribe(
        (respuesta: any) => {
          if (respuesta.reporte != null) {
            /* this.dataSource.reporte = respuesta.reporte;
            this.dataSource.cantidad_registro = respuesta.cantidad_registro;
            this.dataSource.totales = respuesta.totales; */

            this.listProyecto = respuesta.reporte;
            this.totalRegistros = respuesta.cantidad_registro;
            this.total_metas_fisicas = respuesta.totales[0].total_meta_fisica;
            this.total_costo = respuesta.totales[0].total_costo_total_actual;
            this.total_ejecutado = respuesta.totales[0].total_ejecutado;
            this.total_pim = respuesta.totales[0].total_pim;

            // this.buscarProyecto_v2(this.model);
          }
          else {
            this.totalRegistros = 0;
            this.listProyecto = [];
          }
        }
      );

    this.model.id_municipalidad == 0 ? model.id_municipalidad = null : model.id_municipalidad;
    this.model.cod_snip == 0 ? model.cod_snip = null : model.cod_snip;
    this.model.coddepa == "" ? model.coddepa = null : model.coddepa;
    this.model.codigo_estado == "" ? model.codigo_estado = null : model.codigo_estado;
  }



  buscarProyecto_v2(model) {
    model.id_municipalidad == null ? model.id_municipalidad = 0 : model.id_municipalidad = model.id_municipalidad;
    model.cod_snip == null || model.cod_snip == "" ? model.cod_snip = 0 : model.cod_snip = model.cod_snip;
    model.coddepa == null ? model.coddepa = "" : model.coddepa = model.coddepa;
    model.codigo_estado == null ? model.codigo_estado = "" : model.codigo_estado = model.codigo_estado;

    let respuesta = {
      reporte: [],
      cantidad_registro: 0,
      totales: []
    };

    respuesta.reporte = this.dataSource.reporte.slice(model.intTake, model.intTake + model.intSkip);
    respuesta.cantidad_registro = this.dataSource.cantidad_registro;
    respuesta.totales = this.dataSource.totales;


    if (respuesta.reporte != null) {
      this.listProyecto = respuesta.reporte;
      this.totalRegistros = respuesta.cantidad_registro;
      this.total_metas_fisicas = respuesta.totales[0].total_meta_fisica;
      this.total_costo = respuesta.totales[0].total_costo_total_actual;
      this.total_ejecutado = respuesta.totales[0].total_ejecutado;
      this.total_pim = respuesta.totales[0].total_pim;
      //this.total_monto_transferencia = respuesta.totales[0].total_transferencia;
      this.listProyecto.forEach(element => {
        /* // lista de codigo de ruta
        let ruta = '';
        if (element.codigo_ruta != null) {
          element.codigo_ruta.forEach(element => {
            element.ruta.trim() != '' ? ruta = ruta + element.ruta + ', ' : '';
          });
        }
        element['ruta'] = ruta.slice(0, -2);
        //lista de dispositivos
        let duds = '';
        if (element.du_ds != null) {
          element.du_ds.forEach(element => {
            duds = duds + element.du_ds + ', ';
          });
        }
        element['duds'] = duds.slice(0, -2); */

        //lista de observaciones
        let observaciones = '';
        if (element.observacion != null) {
          element.observacion.forEach(element => {
            observaciones = observaciones + element.titulo + '\n\n' + element.descripcion + '\n\n';
          });
        }
        element['observaciones'] = observaciones.slice(0, -2);
      });
    }
    else {
      this.totalRegistros = 0;
      this.listProyecto = [];
    }

    this.model.id_municipalidad == 0 ? model.id_municipalidad = null : model.id_municipalidad;
    this.model.cod_snip == 0 ? model.cod_snip = null : model.cod_snip;
    this.model.coddepa == "" ? model.coddepa = null : model.coddepa;
    this.model.codigo_estado == "" ? model.codigo_estado = null : model.codigo_estado;
  }

  exportarFormatoExcel(model) {
    model.id_municipalidad == null ? model.id_municipalidad = 0 : model.id_municipalidad = model.id_municipalidad;
    model.cod_snip == null || model.cod_snip == "" ? model.cod_snip = 0 : model.cod_snip = model.cod_snip;
    model.coddepa == null ? model.coddepa = "" : model.coddepa = model.coddepa;
    model.codigo_estado == null ? model.codigo_estado = "" : model.codigo_estado = model.codigo_estado;
    
    model.intSkip = this.totalRegistros;
    model.intTake = 0;

    this.fs.maestraService.listarReporteAltaDireccionEjeDir(model.cod_snip, model.codigo_estado, model.id_municipalidad, model.coddepa, model.intSkip, model.intTake).subscribe(
      (respuesta: any) => {
        if (respuesta.reporte != null) {
          this.listReporte = respuesta.reporte;
          this.total_metas_fisicas = respuesta.totales[0].total_meta_fisica;
          this.total_costo = respuesta.totales[0].total_costo_total_actual;
          this.total_ejecutado = respuesta.totales[0].total_ejecutado;
          this.total_pim = respuesta.totales[0].total_pim;
          //this.total_monto_transferencia = respuesta.totales[0].total_transferencia;
          this.listReporte.forEach(element => {
            if (element.proyeto != element.tramo) {
              element.proyeto = element.proyeto + " / " + element.tramo;
            }
            delete element.tramo;
            /* // lista de codigo de ruta
            let ruta = '';
            if (element.codigo_ruta != null) {
              element.codigo_ruta.forEach(element => {
                element.ruta.trim() != '' ? ruta = ruta + element.ruta + ', ' : '';
              });
            }
            element['codigo_ruta'] = ruta.slice(0, -2);
            //lista de dispositivos
            let duds = '';
            if (element.du_ds != null) {
              element.du_ds.forEach(element => {
                duds = duds + element.du_ds + ', ';
              });
            }
            element['du_ds'] = duds.slice(0, -2); */
            //lista de observaciones
            let observaciones = '';
            if (element.observacion != null) {
              element.observacion.forEach(element => {
                observaciones = observaciones + element.titulo + '\n\n' + element.descripcion + '\n\n';
              });
            }
            element['observacion'] = observaciones.slice(0, -2);
            //set formato (S/.)
            element.costo_total_actual = new formatoMonedaPipe(this.funciones).transform(this.funciones.fixed(element.costo_total_actual, 2));
            element.valor_adjudicado = new formatoMonedaPipe(this.funciones).transform(this.funciones.fixed(element.valor_adjudicado, 2));
            element.dev_eje_anterior = new formatoMonedaPipe(this.funciones).transform(this.funciones.fixed(element.dev_eje_anterior, 2));
            element.dev_acu_actual = new formatoMonedaPipe(this.funciones).transform(this.funciones.fixed(element.dev_acu_actual, 2));
            element.pim_actual = new formatoMonedaPipe(this.funciones).transform(this.funciones.fixed(element.pim_actual, 2));
            //element.mon_transferencia = new formatoMonedaPipe(this.funciones).transform(this.funciones.fixed(element.mon_transferencia, 2));

            //set formato fecha
            element.inicio_ejecucion = new formatoFechaPipe(this.funciones).transform(element.inicio_ejecucion);
            element.fin_ejecucion = new formatoFechaPipe(this.funciones).transform(element.fin_ejecucion);
            element.fecha_inscripcion = new formatoFechaPipe(this.funciones).transform(element.fecha_inscripcion);
          });

          let workbook = new Workbook();
          let worksheet = workbook.addWorksheet('Reporte_financiero');


          this.head1 = ["NOMBRE DEL PROYECTO", "GL / GR", "SNIP", "CÓDIGO UNIFICADO", "ESTADO", "% AVANCE FISICO", "% AVANCE FINANCIERO", "CONTRATO DE OBRA",
            "", "", "META GLOBAL", "", "", "", "", "EJECUTADO AÑO ANTERIOR", "",
            "EJECUTADO ACUMULADO ACTUAL", "", "", "PROGRAMADO", "", "OBSERVACIONES"];

          this.head_merge1 =
            [
              { "columna": 1, "colspan": 0, "rowspan": 1 },
              { "columna": 2, "colspan": 0, "rowspan": 1 },
              { "columna": 3, "colspan": 0, "rowspan": 1 },
              { "columna": 4, "colspan": 0, "rowspan": 1 },
              { "columna": 5, "colspan": 0, "rowspan": 1 },
              { "columna": 6, "colspan": 0, "rowspan": 1 },
              { "columna": 7, "colspan": 0, "rowspan": 1 },
              { "columna": 8, "colspan": 2, "rowspan": 0 },
              { "columna": 11, "colspan": 4, "rowspan": 0 },
              { "columna": 16, "colspan": 1, "rowspan": 0 },
              { "columna": 18, "colspan": 2, "rowspan": 0 },
              { "columna": 21, "colspan": 1, "rowspan": 0 },
              { "columna": 23, "colspan": 0, "rowspan": 1 }];

          this.head2 = ["", "", "", "", "", "", "",
            "N° CONTRATO", "FECHA DE SUSCRIPCIÓN",
            "VALOR ADJUDICADO",
            "INICIO EJECUCIÓN",
            "FIN EJECUCIÓN",
            "METAS FÍSICAS",
            "UNID",
            "COSTO TOTAL ACTUAL (%)",
            "%",
            "DEVENGADO AÑO PASADO",
            "%",
            "DEVENGADO ACUMULADO A LA FECHA",
            "AÑO-MES DEL ÚLTIMO DEVENGADO",
            "%",
            "PIM AÑO ACTUAL"];

          this.head_merge2 =
            [
              { "columna": 8, "colspan": 0, "rowspan": 0 },
              { "columna": 9, "colspan": 0, "rowspan": 0 },
              { "columna": 10, "colspan": 0, "rowspan": 0 },
              { "columna": 11, "colspan": 0, "rowspan": 0 },
              { "columna": 12, "colspan": 0, "rowspan": 0 },
              { "columna": 13, "colspan": 0, "rowspan": 0 },
              { "columna": 14, "colspan": 0, "rowspan": 0 },
              { "columna": 15, "colspan": 0, "rowspan": 0 },
              { "columna": 16, "colspan": 0, "rowspan": 0 },
              { "columna": 17, "colspan": 0, "rowspan": 0 },
              { "columna": 18, "colspan": 0, "rowspan": 0 },
              { "columna": 19, "colspan": 0, "rowspan": 0 },
              { "columna": 20, "colspan": 0, "rowspan": 0 },
              { "columna": 21, "colspan": 0, "rowspan": 0 },
              { "columna": 22, "colspan": 0, "rowspan": 0 }
            ];

          const headerPrimeraFila = this.head1;
          const headerSegundaFila = this.head2;

          let headerRowPrimeraFila = worksheet.addRow(headerPrimeraFila);
          let headerRowSegundaFila = worksheet.addRow(headerSegundaFila);

          headerRowPrimeraFila.eachCell((cell, number) => {
            this.asignarRowsColsPan(number, cell, worksheet, this.head_merge1);
            cell.font = { name: 'Segoe UI', color: { argb: 'FFFFFFFF' }, bold: true, size: 9 }
            cell.alignment = { horizontal: 'center', vertical: 'distributed', wrapText: true }
            cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
          });

          headerRowSegundaFila.eachCell((cell, number) => {
            this.asignarRowsColsPan(number, cell, worksheet, this.head_merge2);
            cell.font = { name: 'Segoe UI', color: { argb: 'FFFFFFFF' }, bold: true, size: 9 }
            cell.alignment = { horizontal: 'center', vertical: 'distributed', wrapText: true }
            cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
          });

          let schema = {
            "proyecto": "",
            "gobierno_local": "",
            "snip": "",
            "codigo_unificado": "",
            "estado": "",
            "avance_fisico": "",
            "avance_financiero": "",
            "nro_contrato": "",
            "fecha_inscripcion": "",
            "valor_adjudicado": "",
            "inicio_ejecucion": "",
            "fin_ejecucion": "",
            "meta_fisica": "",
            "unidad": "",
            "costo_total_actual": "",
            "por_eje_anterior": "",
            "dev_eje_anterior": "",
            "por_eje_actual": "",
            "dev_acu_actual": "",
            "anio_mes_devengado": "",
            "por_programado": "",
            "pim_actual": "",
            "observacion": ""
          }

          this.listReporte.forEach(element => {
            var result = Object.keys(schema).map(function (key) {
              return element[key] == null ? '' : element[key];
            });
            let row = worksheet.addRow(result);
            row.eachCell((cell, number) => {
              cell.font = { name: 'Segoe UI', color: { argb: '00000000' }, bold: true, size: 9 }
              cell.alignment = { horizontal: 'centerContinuous', vertical: 'middle', wrapText: true }
              cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
            });
          });

          worksheet.getColumn(1).width = 36;
          worksheet.getColumn(2).width = 18;
          worksheet.getColumn(3).width = 18;
          worksheet.getColumn(4).width = 18;
          worksheet.getColumn(5).width = 18;
          worksheet.getColumn(6).width = 18;
          worksheet.getColumn(7).width = 18;
          worksheet.getColumn(8).width = 18;
          worksheet.getColumn(9).width = 21;
          worksheet.getColumn(10).width = 18;
          worksheet.getColumn(11).width = 18;
          worksheet.getColumn(12).width = 18;
          worksheet.getColumn(13).width = 18;
          worksheet.getColumn(14).width = 18;
          worksheet.getColumn(15).width = 18;
          worksheet.getColumn(16).width = 18;
          worksheet.getColumn(17).width = 18;
          worksheet.getColumn(18).width = 18;
          worksheet.getColumn(19).width = 18;
          worksheet.getColumn(20).width = 40;

          workbook.xlsx.writeBuffer().then((data: any) => {
            let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            fs.saveAs(blob, 'ReporteFinanciero_' + this.funciones.obtenerFechaDescargaGuardarArchivo() + '.xlsx');
          })
        }
      }
    );

    this.model.id_municipalidad == 0 ? model.id_municipalidad = null : model.id_municipalidad;
    this.model.cod_snip == 0 ? model.cod_snip = null : model.cod_snip;
    this.model.coddepa == "" ? model.coddepa = null : model.coddepa;
    this.model.codigo_estado == "" ? model.codigo_estado = null : model.codigo_estado;
  }

  asignarRowsColsPan(indice, celda: any, worksheet: any, header: any) {
    let colspan = 0;
    let rowspan = 0;
    let color = "";
    header.forEach(element => {
      if (element.columna == indice) {
        colspan = element.colspan;
        rowspan = element.rowspan;
        color = (element.color != null ? element.color : "");
        worksheet.mergeCells(celda.address + ":" + this.ConvertToLetter(celda.col + colspan) + (celda.row + rowspan).toString());

        if (color != "") {
          celda.font = { name: 'Segoe UI', color: { argb: 'FFFFFFFF' }, bold: true, size: 9 }
          celda.alignment = { horizontal: 'center', vertical: 'middle' },
            celda.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: 'FF' + color }
              ,
              bgColor: { argb: 'FFFF9980' }
            }
        } else {
          celda.font = { name: 'Segoe UI', color: { argb: 'FFFFFFFF' }, bold: true, size: 9 }
          celda.alignment = { horizontal: 'center', vertical: 'middle' },
            celda.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: 'FF009DDB' }
              ,
              bgColor: { argb: 'FFFF9980' }
            }
        }
      }
    });
  }

  ConvertToLetter(columnNumber) {
    var dividend = columnNumber;
    var columnName = "";
    var modulo;

    while (dividend > 0) {
      modulo = (dividend - 1) % 26;
      columnName = String.fromCharCode(65 + modulo).toString() + columnName;
      dividend = parseInt(((dividend - modulo) / 26).toString());
    }
    return columnName;
  }
}
