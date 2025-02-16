import { Component, OnInit } from '@angular/core';
import { FacadeService } from '../../patterns/facade.service';
import { IUnidadEjecutora } from '../../Interfaces';
import { IDepartamento } from '../../Interfaces/IDepartamento';
import { IDetalleUsuario } from '../../Interfaces';
import { Functions } from '../../appSettings';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';

@Component({
  selector: 'app-unidades-ejecutoras',
  templateUrl: './unidades-ejecutoras.component.html',
  styleUrls: ['./unidades-ejecutoras.component.css']
})
export class UnidadesEjecutorasComponent implements OnInit {
  selectedValueMunicipalidad
  selectedValueDepartamento
  UnidadesEjecutoras: IUnidadEjecutora[] = []
  Departamentos: IDepartamento[] = []
  detalleUsuario: IDetalleUsuario[] = []
  filtros: string = "TODOS"
  nroRegistros: number = 0

  // Criterios de Busqueda
  strNombreApellidos: string = ""
  strMunicipalidadSeleccionada: string = ""
  strRegionSelecionada: string = ""

  numero_Pagina: number = 0;
  num_filas: number = 10;
  totalRegistros: number = 0

  //variables de reporte
  rpteUsuario;
  head;
  head_merge;

  constructor(private fs: FacadeService, private funciones: Functions) { }

  ngOnInit() {
    let ms = this.fs.maestraService;

    ms.listarMunicipalidad().subscribe(data => { this.UnidadesEjecutoras = data; })

    ms.listarDepartamentos().subscribe(data => { this.Departamentos = data; })

    ms.listarReporteUnidadEjecutoras().subscribe(data => {

      if (data) {
        this.detalleUsuario = data.detalle_usuario
        this.nroRegistros = this.totalRegistros = data.cantidad;
      } else {
        this.detalleUsuario = [];
        this.nroRegistros = 0;
      }

    })

    document.getElementById("btnBuscar").addEventListener("click", () => {
      this.strNombreApellidos = (document.getElementById("txtNA") as HTMLInputElement).value;
      this.strMunicipalidadSeleccionada = (!this.selectedValueMunicipalidad ? "" : this.selectedValueMunicipalidad);
      this.strRegionSelecionada = (!this.selectedValueDepartamento ? "" : this.selectedValueDepartamento);
      this.filtros = "NO SE INGRESO NINGUN CRITERIO DE BUSQUEDA";

      if (this.strMunicipalidadSeleccionada === "" && this.strRegionSelecionada === "" && this.strNombreApellidos === "") {
        this.funciones.mensaje("warning", "Debe de ingresar al menos un filtro de busqueda");
        return;
      }

      this.busquedaConCriterios()

    });

    document.getElementById("btnLimpiar").addEventListener("click", () => {
      this.selectedValueMunicipalidad = "";
      this.selectedValueDepartamento = "";
      this.filtros = "TODOS";
      (document.getElementById("txtNA") as HTMLInputElement).value = "";

      ms.listarReporteUnidadEjecutoras().subscribe(data => {
        this.detalleUsuario = data.detalle_usuario;
        this.nroRegistros = this.totalRegistros = data.cantidad;
      })
    });
  }

  private busquedaConCriterios() {
    let idMunicipalidad: number = 0; let strRegion: string = ""
    this.filtros = "";
    this.detalleUsuario = [];

    if (this.strMunicipalidadSeleccionada != "") {
      let indexMunicipalidad = this.UnidadesEjecutoras.findIndex(x => x.nombre_municipalidad === this.strMunicipalidadSeleccionada);

      if (indexMunicipalidad > -1) {
        this.filtros += " Unidad Ejecutora: " + this.strMunicipalidadSeleccionada
        idMunicipalidad = this.UnidadesEjecutoras[indexMunicipalidad].id_municipalidad;
      }
      else {
        this.selectedValueMunicipalidad = ""
      }
    }

    if (this.strRegionSelecionada != "") {
      let indexRegion = this.Departamentos.findIndex(x => x.departamento === this.strRegionSelecionada);

      if (indexRegion > -1) {
        this.filtros += " | Región: " + this.strRegionSelecionada
        strRegion = this.Departamentos[indexRegion].coddepa;
      }
      else {
        this.selectedValueDepartamento = ""
      }
    }

    if (this.strNombreApellidos != "") {
      this.filtros += " | Nombres y Apellidos: " + this.strNombreApellidos
    }

    this.fs.maestraService.listarReporteUnidadEjecutoras(idMunicipalidad, strRegion, this.strNombreApellidos, this.num_filas, this.numero_Pagina).subscribe(data => {
      if (data.detalle_usuario.length == undefined) {
        this.detalleUsuario = [];
        this.nroRegistros = 0;
      }
      else {
        this.detalleUsuario = data.detalle_usuario;
        this.nroRegistros = this.totalRegistros = data.cantidad;
      }
    });
  }

  cambiarPagina(pagina) {
    this.numero_Pagina = ((pagina.page - 1) * this.num_filas);
    this.busquedaConCriterios()
  }

  exportarFormatoExcel() {
    let idMunicipalidad: number = 0;
    let strRegion: string = "";

    if (this.strMunicipalidadSeleccionada != "") {
      let indexMunicipalidad = this.UnidadesEjecutoras.findIndex(x => x.nombre_municipalidad === this.strMunicipalidadSeleccionada);
      if (indexMunicipalidad > -1) {
        idMunicipalidad = this.UnidadesEjecutoras[indexMunicipalidad].id_municipalidad;
      }
      else {
        this.selectedValueMunicipalidad = "";
      }
    }

    if (this.strRegionSelecionada != "") {
      let indexRegion = this.Departamentos.findIndex(x => x.departamento === this.strRegionSelecionada);
      if (indexRegion > -1) {
        strRegion = this.Departamentos[indexRegion].coddepa;
      }
      else {
        this.selectedValueDepartamento = "";
      }
    }

    this.fs.maestraService.listarReporteUnidadEjecutoras(idMunicipalidad, strRegion, this.strNombreApellidos, this.nroRegistros, 0).subscribe(data => {
      if (data.detalle_usuario.length != undefined) {
        this.rpteUsuario = data.detalle_usuario;

        let workbook = new Workbook();
        let worksheet = workbook.addWorksheet('Reporte_unidad_ejecutora');

        this.head = ["NOMBRES Y APELLIDOS", "CORREO", "CELULAR", "GERENCIA U OFICINA RESPONSABLE", "UNIDAD EJECUTORA", "REGIÓN"];

        this.head_merge =
          [{ "columna": 1, "colspan": 0, "rowspan": 0 },
          { "columna": 2, "colspan": 0, "rowspan": 0 },
          { "columna": 3, "colspan": 0, "rowspan": 0 },
          { "columna": 4, "colspan": 0, "rowspan": 0 },
          { "columna": 5, "colspan": 0, "rowspan": 0 },
          { "columna": 6, "colspan": 0, "rowspan": 0 }];

        const headerPrimeraFila = this.head;
        let headerRowPrimeraFila = worksheet.addRow(headerPrimeraFila);

        headerRowPrimeraFila.eachCell((cell, number) => {
          this.asignarRowsColsPan(number, cell, worksheet, this.head_merge);
          cell.font = { name: 'Segoe UI', color: { argb: 'FFFFFFFF' }, bold: true, size: 9 }
          cell.alignment = { horizontal: 'center', vertical: 'distributed', wrapText: true }
          cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
        });

        this.rpteUsuario.forEach(element => {
          var result = Object.keys(element).map(function (key) {
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
        worksheet.getColumn(2).width = 36;
        worksheet.getColumn(3).width = 18;
        worksheet.getColumn(4).width = 36;
        worksheet.getColumn(5).width = 36;
        worksheet.getColumn(6).width = 18;

        workbook.xlsx.writeBuffer().then((data) => {
          let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
          fs.saveAs(blob, 'ReporteUnidadEjecutora_' + this.funciones.obtenerFechaDescargaGuardarArchivo() + '.xlsx');
        })
      }
    });
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