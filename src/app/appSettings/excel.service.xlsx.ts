import { Injectable } from '@angular/core';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
import * as logoFile from '../../assets/img/mtc-logo.js';
import { DatePipe } from '../../../node_modules/@angular/common';
import { Functions } from 'src/app/appSettings/functions';
@Injectable({
    providedIn: 'root'
})
export class ExcelService {


    constructor(private datePipe: DatePipe,  public funciones: Functions) {

    }

    generateExcel(dataTransferencia, ptitle, arrCabecera, arrDatosCabecera) {

        //Excel Title, Header, Data
        const title = ptitle;
        const header = arrCabecera;
        const datosCabecera = arrDatosCabecera;
        const data = dataTransferencia;

        //Create workbook and worksheet
        let workbook = new Workbook();
        let worksheet = workbook.addWorksheet('Datos Transferencia');


        //Add Row and formatting
        let titleRow = worksheet.addRow([title]);
        titleRow.font = { name: 'Segoe UI', family: 4, size: 16, bold: true }
        titleRow.alignment = { horizontal: 'center', vertical: 'middle' }
        worksheet.addRow([]);
        //let subTitleRow = worksheet.addRow(['Date : ' + this.datePipe.transform(new Date(), 'medium')])


        //Add Image
        let logo = workbook.addImage({
            base64: logoFile.logoBase64,
            extension: 'png',
        });

        worksheet.addImage(logo, 'H1:H2');
        worksheet.mergeCells('A1:G2');

        //Blank Row 
        worksheet.addRow([]);

        //Add Datos Cabecera Row
        let datosCabeceraRow = worksheet.addRow(datosCabecera);
        
        let ctituloFechaDatosCabecera = datosCabeceraRow.getCell(7);
        ctituloFechaDatosCabecera.value = "fecha descarga:";
       
        let cFechaDatosCabecera = datosCabeceraRow.getCell(8);
        cFechaDatosCabecera.value = this.funciones.ObtenerFechaDescarga();

        datosCabeceraRow.eachCell((cell, number) => {
            this.alinearDatosCabecera(number, cell);          
        });

        //Add Header Row
        let headerRow = worksheet.addRow(header);

        // Cell Style : Fill and Border
        headerRow.eachCell((cell, number) => {
            cell.font = { name: 'Segoe UI', color: { argb: 'FFFFFFFF' } , bold: true ,size: 9 }
            cell.alignment = { horizontal: 'center', vertical: 'middle' },
                cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'FF0178BA' }
                    ,
                    bgColor: { argb: 'FFFF9980' }
                }
            cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
        });
        // worksheet.addRows(data);

        // Add Data and Conditional Formatting
        data.forEach(d => {
            let row = worksheet.addRow(d);
            row.eachCell((cell, number) => {
                this.alinearDetalle(number, cell);
            });

            //let qty = row.getCell(5); //celda: 
            //let color = 'FF9999';
            // if (+qty.value < 500) {
            //     color = 'FF9999'
            // }

            // qty.fill = {
            //     type: 'pattern',
            //     pattern: 'solid',
            //     fgColor: { argb: color }
            // }
        });

        // datosCabecera.forEach(d => {
        //     let row = worksheet.addRow(d);
        // });

        worksheet.getColumn(1).width = 25;
        worksheet.getColumn(2).width = 25;
        worksheet.getColumn(3).width = 70;
        worksheet.getColumn(4).width = 25;
        worksheet.getColumn(5).width = 50;
        worksheet.getColumn(6).width = 25;
        worksheet.getColumn(7).width = 25;
        worksheet.getColumn(8).width = 30;
        worksheet.addRow([]);

        //Footer Row
        let footerRow = worksheet.addRow(['MINISTERIO DE TRANSPORTES - OFICINA GENERAL DE TECNOLOGÍA DE LA INFORMACIÓN - SISTEMA DE SEGUIMIENTO DE PROYECTOS']);
        footerRow.font = { name: 'Segoe UI', family: 4, size: 8, bold: true }
        footerRow.alignment = { horizontal: "center" }
        //Merge Cells
        worksheet.mergeCells(`A${footerRow.number}:H${footerRow.number}`);

        //Generate Excel File with given name
        workbook.xlsx.writeBuffer().then((data) => {
            let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            fs.saveAs(blob, 'transferencia.xlsx');
        })

    }
    alinearDetalle(indice, celda: any) {
        if (indice == 1) {
            celda.alignment = { horizontal: 'center', vertical: 'middle' }
        } else if (indice == 2) {
            celda.alignment = { horizontal: 'center', vertical: 'middle' }
        } else if (indice == 3) {
            celda.alignment = { horizontal: 'left', vertical: 'middle', wrapText: "pre" }
        } else if (indice == 4) {
            celda.alignment = { horizontal: 'center', vertical: 'middle', wrapText: "pre" }
        } else if (indice == 5) {
            celda.alignment = { horizontal: 'left', vertical: 'middle', wrapText: "pre" }
        } else if (indice == 6) {
            celda.alignment = { horizontal: 'right', vertical: 'middle' }
        } else if (indice == 7) {
            celda.alignment = { horizontal: 'center', vertical: 'middle', wrapText: "pre" }
        } else {
            celda.alignment = { horizontal: 'right', vertical: 'middle' }
        }

    }
    alinearDatosCabecera(indice,celda: any) {
        if (indice == 1) {
            celda.alignment = { horizontal: 'right', vertical: 'middle' }
            celda.font = { name: 'Segoe UI', bold: true,size: 9 }
        } else if (indice == 2) {
            celda.alignment = { horizontal: 'left', vertical: 'middle',wrapText: "pre" }
            celda.font = { name: 'Segoe UI', size: 9 }
        } else if (indice == 3) {
            celda.alignment = { horizontal: 'right', vertical: 'middle'}
            celda.font = { name: 'Segoe UI', bold: true,size: 9 }
        } else if(indice == 4) {
            celda.alignment = { horizontal: 'center', vertical: 'middle' }
            celda.font = { name: 'Segoe UI', size: 9 }
        } else if(indice == 7){
            celda.font = { name: 'Segoe UI', bold: true ,size: 7 };
            celda.alignment = { horizontal: "right" };
        }else if(indice == 7){
            celda.alignment = { horizontal: "left" };
            celda.font = { name: 'Segoe UI', bold: true ,size: 9 };
        }
    }
}
