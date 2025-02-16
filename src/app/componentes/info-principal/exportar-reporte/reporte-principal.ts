import { Injectable } from '@angular/core';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
import * as logoFile from '../../../../assets/img/mtc-logo.js';
import { DatePipe } from '../../../../../node_modules/@angular/common';
import { Functions } from 'src/app/appSettings/functions';

@Injectable({
    providedIn: 'root'
})
export class ExcelService {

    constructor(private datePipe: DatePipe,  public funciones: Functions) {

    }

    generateExcel(dataTransferencia, ptitle, arrCabeceraPrimeraFila,arrCabeceraSegundaFila,arrCabeceraTerceraFila, arrDatosCabecera,arrColsRowsPanPrimeraFila,arrColsRowsPanSegundaFila,arrColsRowsPanTerceraFila) {

        //Excel Title, Header, Data
        const title = ptitle;
        const headerPrimeraFila = arrCabeceraPrimeraFila;
        const headerSegundaFila = arrCabeceraSegundaFila;
        const headerTerceraFila = arrCabeceraTerceraFila;
        const datosCabecera = arrDatosCabecera;
        const data = dataTransferencia;

        //Create workbook and worksheet
        let workbook = new Workbook();
        let worksheet = workbook.addWorksheet('Formato N° 02');

        //Add Image
        let logo = workbook.addImage({
            base64: logoFile.logoBase64,
            extension: 'png',
        });
        worksheet.addImage(logo, 'A1:A2');
        //Add Row and formatting
        let titleRow = worksheet.addRow([title]);
        titleRow.font = { name: 'Segoe UI', family: 4, size: 16, bold: true }
        titleRow.alignment = { horizontal: 'center', vertical: 'middle' }
        worksheet.getCell("A1").value = "";
        worksheet.getCell("B1").value = title;
       
        worksheet.addRow([]);
        worksheet.mergeCells('B1:K2');
        //Blank Row 
        let subTitulo = worksheet.addRow(["(*) Formato elaborado a partir del Formato N° 3 de la Directiva para la Ejecución de Inversiones Públicas en el marco del Sistema Nacional de Programación Multianual y Gestión de Inversiones."]);
        worksheet.mergeCells('A3:K3');
        subTitulo.eachCell((cell, number) => {
            cell.font = { name: 'Segoe UI', size: 9, bold: true }
        });

        worksheet.addRow([]);
        //Add Datos Cabecera Row
        datosCabecera.forEach(d => {
            let row : any;
            if(d[0] == "NÚMERO DE CONVENIO:"){
                let cont = 0;
                d[1].forEach(f => { 
                    if(cont > 0){
                        row = worksheet.addRow(["",f.siglas]);
                    }else{
                        row = worksheet.addRow([d[0],f.siglas]);
                    } 
                    cont++;
                    row.eachCell((cell, number) => {
                        this.alinearDatosCabecera(number, cell,worksheet); 
                    });
                }); 
            }else{
                row = worksheet.addRow(d);
                row.eachCell((cell, number) => {
                    this.alinearDatosCabecera(number, cell,worksheet); 
                });
            }
        });
        //Fecha y Hora de Descarga
        worksheet.getCell("I7").value = "fecha de descarga:";
        worksheet.getCell("I7").font = { name: 'Segoe UI', bold: true ,size: 8 };
        worksheet.getCell("I7").alignment = { horizontal: "right" };
        worksheet.getCell("J7").value = this.funciones.ObtenerFechaDescarga();
        worksheet.getCell("J7").font = { name: 'Segoe UI',size: 9 };
        //Título Cabecera
        let rowTituloCabecera = worksheet.addRow(["1) COMPONENTES (PRODUCTOS) Y COSTOS DE INVERSIÓN (EETT Y EJECUCIÓN DE OBRA):"]);
        rowTituloCabecera.eachCell((cell, number) => {
            worksheet.mergeCells(cell.address + ":" + this.ConvertToLetter(cell.col + 9) + (cell.row + 0).toString());
            cell.font = { name: 'Segoe UI', size: 9, bold: true }
        });
        
        //Add Header Row
        let headerRowPrimeraFila = worksheet.addRow(headerPrimeraFila);
        let headerRowSegundaFila = worksheet.addRow(headerSegundaFila);
        let headerRowTerceraFila = worksheet.addRow(headerTerceraFila);

        headerRowPrimeraFila.eachCell((cell, number) => {
            this.asignarRowsColsPan(number, cell,worksheet,arrColsRowsPanPrimeraFila);
            cell.font = { name: 'Segoe UI', color: { argb: 'FFFFFFFF' } , bold: true ,size: 9 }
            cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true }
            cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }

        });

       
        headerRowSegundaFila.eachCell((cell, number) => {
            this.asignarRowsColsPan(number, cell,worksheet,arrColsRowsPanSegundaFila);
            cell.font = { name: 'Segoe UI', color: { argb: 'FFFFFFFF' } , bold: true ,size: 9 }
            cell.alignment = { horizontal: 'center', vertical: 'middle' }
            cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
        });

        headerRowTerceraFila.eachCell((cell, number) => {
            this.asignarRowsColsPan(number, cell,worksheet,arrColsRowsPanTerceraFila);
            cell.font = { name: 'Segoe UI', color: { argb: 'FFFFFFFF' } , bold: true ,size: 9 }
            cell.alignment = { horizontal: 'center', vertical: 'middle',wrapText: true }
            cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
        });

        // Add Data and Conditional Formatting

        let dataDetalle = worksheet.addRow(data);
        let numColumns: any;
        numColumns = dataDetalle.values;
        dataDetalle.eachCell((cell, number) => {
            this.alinearDetalle(number, cell, numColumns);
        });
        
        
        
        worksheet.getColumn(1).width = 40;
        worksheet.getColumn(2).width = 40;
        worksheet.getColumn(3).width = 20;
        for(let i=0; i< worksheet.columns.length; i++){
            if(i + 1 > 3){
                worksheet.getColumn(i + 1).width = 20;
            }
            if(i== worksheet.columns.length - 4){
                //worksheet.getCell(worksheet.columns[worksheet.columns.length - 4].letter + worksheet.columns[worksheet.columns.length - 4].values[worksheet.columns[worksheet.columns.length - 4].values.length - 1]).alignment = { horizontal: 'left', vertical: 'middle', wrapText: true }
                //worksheet.getColumn(i + 1).alignment = { horizontal: 'left', vertical: 'middle', wrapText: true }
            }else if(i== worksheet.columns.length - 3){
                //worksheet.getColumn(i + 1).alignment =  { horizontal: 'left', vertical: 'middle', wrapText: true }
            }else if(i== worksheet.columns.length - 2){
                //worksheet.getColumn(i + 1).alignment =  { horizontal: 'left', vertical: 'middle', wrapText: true }
            }else if(i== worksheet.columns.length - 1){
                //worksheet.getColumn(i + 1).alignment =  { horizontal: 'left', vertical: 'middle', wrapText: true }
                worksheet.getColumn(i + 1).width = 50;
            }
        }
        worksheet.addRow([]);

        //Footer Row
        let footerRow = worksheet.addRow(['MINISTERIO DE TRANSPORTES - OFICINA GENERAL DE TECNOLOGÍA DE LA INFORMACIÓN - SISTEMA DE SEGUIMIENTO DE PROYECTOS']);
        footerRow.font = { name: 'Segoe UI', family: 4, size: 8, bold: true }
        footerRow.alignment = { horizontal: "center" }
        //Merge Cells
        worksheet.mergeCells(`A${footerRow.number}:L${footerRow.number}`);

        //Generate Excel File with given name
        workbook.xlsx.writeBuffer().then((data) => {
            let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            fs.saveAs(blob, 'Formato_Nro_02_' + this.funciones.obtenerFechaDescargaGuardarArchivo() + '.xlsx');
        })

    }
    generateExcelGeneral(dataTransferencia, ptitle, arrCabeceraPrimeraFila,arrCabeceraSegundaFila,arrCabeceraTerceraFila,arrColsRowsPanPrimeraFila,arrColsRowsPanSegundaFila,arrColsRowsPanTerceraFila) {

        //Excel Title, Header, Data
        const title = ptitle;
        const headerPrimeraFila = arrCabeceraPrimeraFila;
        const headerSegundaFila = arrCabeceraSegundaFila;
        const headerTerceraFila = arrCabeceraTerceraFila;
        const data = dataTransferencia;

        //Create workbook and worksheet
        let workbook = new Workbook();
        let worksheet = workbook.addWorksheet('Formato N° 02');

        //Add Image
        let logo = workbook.addImage({
            base64: logoFile.logoBase64,
            extension: 'png',
        });
        worksheet.addImage(logo, 'A1:B2');
        //Add Row and formatting
        let titleRow = worksheet.addRow([title]);
        titleRow.font = { name: 'Segoe UI', family: 4, size: 16, bold: true }
        titleRow.alignment = { horizontal: 'center', vertical: 'middle' }
        worksheet.getCell("A1").value = "";
        worksheet.getCell("B1").value = title;
       
        worksheet.addRow([]);
        worksheet.mergeCells('B1:K2');
        //Blank Row 
        let subTitulo = worksheet.addRow(["(*) Formato elaborado a partir del Formato N° 3 de la Directiva para la Ejecución de Inversiones Públicas en el marco del Sistema Nacional de Programación Multianual y Gestión de Inversiones."]);
        worksheet.mergeCells('A3:K3');
        subTitulo.eachCell((cell, number) => {
            cell.font = { name: 'Segoe UI', size: 9, bold: true }
        });

        //Fecha y Hora de Descarga
        worksheet.getCell("I7").value = "fecha de descarga:";
        worksheet.getCell("I7").font = { name: 'Segoe UI', bold: true ,size: 8 };
        worksheet.getCell("I7").alignment = { horizontal: "right" };
        worksheet.getCell("J7").value = this.funciones.ObtenerFechaDescarga();
        worksheet.getCell("J7").font = { name: 'Segoe UI',size: 9 };
        //Título Cabecera
        let rowTituloCabecera = worksheet.addRow(["1) COMPONENTES (PRODUCTOS) Y COSTOS DE INVERSIÓN (EETT Y EJECUCIÓN DE OBRA):"]);
        rowTituloCabecera.eachCell((cell, number) => {
            worksheet.mergeCells(cell.address + ":" + this.ConvertToLetter(cell.col + 9) + (cell.row + 0).toString());
            cell.font = { name: 'Segoe UI', size: 9, bold: true }
        });
        
        //Add Header Row
        let headerRowPrimeraFila = worksheet.addRow(headerPrimeraFila);
        let headerRowSegundaFila = worksheet.addRow(headerSegundaFila);
        let headerRowTerceraFila = worksheet.addRow(headerTerceraFila);

        headerRowPrimeraFila.eachCell((cell, number) => {
            this.asignarRowsColsPan(number, cell,worksheet,arrColsRowsPanPrimeraFila);
            cell.font = { name: 'Segoe UI', color: { argb: 'FFFFFFFF' } , bold: true ,size: 9 }
            cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true }
            cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }

        });

       
        headerRowSegundaFila.eachCell((cell, number) => {
            this.asignarRowsColsPan(number, cell,worksheet,arrColsRowsPanSegundaFila);
            cell.font = { name: 'Segoe UI', color: { argb: 'FFFFFFFF' } , bold: true ,size: 9 }
            cell.alignment = { horizontal: 'center', vertical: 'middle' }
            cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
        });

        headerRowTerceraFila.eachCell((cell, number) => {
            this.asignarRowsColsPan(number, cell,worksheet,arrColsRowsPanTerceraFila);
            cell.font = { name: 'Segoe UI', color: { argb: 'FFFFFFFF' } , bold: true ,size: 9 }
            cell.alignment = { horizontal: 'center', vertical: 'middle',wrapText: true }
            cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
        });

        // Add Data and Conditional Formatting
        data.forEach(element => {
            let dataDetalle = worksheet.addRow(element);
            let numColumns: any;
            numColumns = dataDetalle.values;
            dataDetalle.eachCell((cell, number) => {
                this.alinearDetalleGeneral(number, cell, numColumns);
            });
        });
        
        worksheet.getColumn(1).width = 20;
        worksheet.getColumn(2).width = 20;
        worksheet.getColumn(3).width = 20;
        worksheet.getColumn(4).width = 60;
        worksheet.getColumn(5).width = 30;
        worksheet.getColumn(6).width = 20;
        for(let i=0; i< worksheet.columns.length; i++){
            if(i + 1 > 6 && i + 1 < 16){
                worksheet.getColumn(i + 1).width = 20;
            }
            if(i > 16 && i <= worksheet.columns.length - 11){
                worksheet.getColumn(i).width = 15;
            }
          
            if(i > worksheet.columns.length - 11 && i < worksheet.columns.length - 3){
                worksheet.getColumn(i + 1).width = 30;
                if(i== worksheet.columns.length - 8){
                    worksheet.getColumn(i + 1).alignment = { horizontal: 'center', vertical: 'middle', wrapText: true }
                }
                if(i== worksheet.columns.length - 7){
                    worksheet.getColumn(i + 1).alignment = { horizontal: 'center', vertical: 'middle', wrapText: true }
                }
            }else if(i== worksheet.columns.length - 3){
                worksheet.getColumn(i + 1).width = 40;
            }else if(i== worksheet.columns.length - 2){
                worksheet.getColumn(i + 1).width = 50;
            }else if(i== worksheet.columns.length - 1){
                worksheet.getColumn(i + 1).width = 20;
            }
        }
        worksheet.addRow([]);

        //Footer Row
        let footerRow = worksheet.addRow(['MINISTERIO DE TRANSPORTES - OFICINA GENERAL DE TECNOLOGÍA DE LA INFORMACIÓN - SISTEMA DE SEGUIMIENTO DE PROYECTOS']);
        footerRow.font = { name: 'Segoe UI', family: 4, size: 8, bold: true }
        footerRow.alignment = { horizontal: "center" }
        //Merge Cells
        worksheet.mergeCells(`A${footerRow.number}:L${footerRow.number}`);

        //Generate Excel File with given name
        workbook.xlsx.writeBuffer().then((data) => {
            let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            fs.saveAs(blob, 'Formato_Nro_02_' + this.funciones.obtenerFechaDescargaGuardarArchivo() + '.xlsx');
        })

    }
    asignarRowsColsPan(indice, celda: any,worksheet: any, header: any){
        let colspan = 0;
        let rowspan = 0;
        let color = "";
        header.forEach(element => {
            if (element.columna == indice) {
                colspan = element.colspan;
                rowspan = element.rowspan;
                color = (element.color != null ? element.color : "");
                //if(celda.address != this.ConvertToLetter(celda.col + colspan) + (celda.row + rowspan).toString()){
                    worksheet.mergeCells(celda.address + ":" + this.ConvertToLetter(celda.col + colspan) + (celda.row + rowspan).toString());
                //}
                
                if(color != ""){ 
                    celda.fill = {
                            type: 'pattern',
                            pattern: 'solid',
                            fgColor: { argb: 'FF' + color }
                            ,
                            bgColor: { argb: 'FFFF9980' }
                    }
                }else{
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

    alinearDetalle(indice, celda: any, numColumns) {
        if(indice > 2){
            if(indice == numColumns.length - 1){
                celda.alignment = { horizontal: 'left', vertical: 'middle', wrapText: "pre" }
            }else if(indice == numColumns.length - 2){
                celda.alignment = { horizontal: 'left', vertical: 'middle', wrapText: "pre" }
            }else if(indice == numColumns.length - 3){
                celda.alignment = { horizontal: 'left', vertical: 'middle', wrapText: "pre" }
            }else if(indice == numColumns.length - 4){
                celda.alignment = { horizontal: 'left', vertical: 'middle', wrapText: "pre" }
            }else{
                celda.alignment = { horizontal: 'center', vertical: 'middle', wrapText: "pre" } 
            }
        }else{
            celda.alignment = { horizontal: 'left', vertical: 'middle', wrapText: "pre" }
        }
        
    }
    alinearDetalleGeneral(indice, celda: any, numColumns) {
        if(indice > 5){
            if(indice == numColumns.length - 1){
                celda.alignment = { horizontal: 'center', vertical: 'middle', wrapText: "pre" }
            }else if(indice == numColumns.length - 2){
                celda.alignment = { horizontal: 'left', vertical: 'middle', wrapText: "pre" }
            }else if(indice == numColumns.length - 3){
                celda.alignment = { horizontal: 'left', vertical: 'middle', wrapText: "pre" }
            }else if(indice == numColumns.length - 4){
                celda.alignment = { horizontal: 'left', vertical: 'middle', wrapText: "pre" }
            }else if(indice == numColumns.length - 5){
                celda.alignment = { horizontal: 'left', vertical: 'middle', wrapText: "pre" }
            }else{
                celda.alignment = { horizontal: 'center', vertical: 'middle', wrapText: "pre" } 
            }
        }else{
            if(indice > 2){
                celda.alignment = { horizontal: 'left', vertical: 'middle', wrapText: "pre" }
            }else{
                celda.alignment = { horizontal: 'center', vertical: 'middle', wrapText: "pre" }
            }
        }
    }

    alinearDatosCabecera(indice,celda: any,worksheet: any) {
        let bold : boolean = false;
        if(indice % 2 > 0){
            bold = true;
            celda.font = { name: 'Segoe UI', size: 9, bold: bold }
        }else{
            worksheet.mergeCells(celda.address + ":" + this.ConvertToLetter(celda.col + 4) + celda.row.toString());
            celda.font = { name: 'Segoe UI', size: 10, bold: bold }
        }
        celda.alignment = { horizontal: 'left', vertical: 'middle',wrapText: "pre" }
        
    }

    ConvertToLetter(columnNumber){
        var dividend = columnNumber;
        var columnName = "";
        var modulo;
    
        while (dividend > 0)
        {
            modulo = (dividend - 1) % 26;
            columnName = String.fromCharCode(65 + modulo).toString() + columnName;
            dividend = parseInt(((dividend - modulo) / 26).toString());
        } 
        return  columnName;
    }
}
