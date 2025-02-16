import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { Router } from '@angular/router';
import { Sesion } from '../../componentes/auth/sesion';
import { AuthService } from '../../componentes/auth/auth.service';
import { AccesoService } from '../../services/acceso.service';
import { UsuarioService } from '../../services/usuario.service';
import { ModalGatewayComponent } from 'src/app/modales/modal-gateway/modal-gateway.component';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { take } from 'rxjs/internal/operators/take';
import * as  saveAs from 'file-saver';
import * as ExcelJS from 'exceljs';
import { Functions } from 'src/app/appSettings';
import { ReporteService } from 'src/app/services/reporte.service';

@Component({
  selector: 'app-home-layout',
  templateUrl: './home-layout.component.html',
  styleUrls: ['./home-layout.component.css']
})
export class HomeLayoutComponent implements OnInit {

  private misesion: Sesion;
  private authService: AuthService;
  public txtUsuario: string;
  public esLogin: boolean;
  public perfiles: any;
  public bsModalsistemasRef: BsModalRef;
  public MostarOpcionCambiarPerfil: boolean = false;
  menu: any = [];

  constructor(private router: Router, private AccesoService: AccesoService, private as: UsuarioService, private modalService: BsModalService,
    private helper: Functions, private ReporteService: ReporteService) {
    var cuerpo = document.getElementsByTagName('body')[0];
    cuerpo.classList.remove("page-login");
    cuerpo.classList.add("page-dashboard");
  }

  ngOnInit() {
    // this.txtUsuario = (sessionStorage.getItem("Municipalidad") == '') ? sessionStorage.getItem("Nombre_Usuario") : sessionStorage.getItem("Municipalidad");
    this.txtUsuario = sessionStorage.getItem("Nombre_Usuario");
    let IdUsuario = sessionStorage.getItem("IdUsuario");
    let Id_Perfil = sessionStorage.getItem("Id_Perfil");

    if (sessionStorage.getItem("Componentes") != null) {
      let info = JSON.parse(sessionStorage.getItem("Componentes"));
      this.menu = this.getJSONmenu(info.menu);
      if (sessionStorage.getItem("Id_Detalle_Usuario") == null) {
        sessionStorage.setItem("Id_Detalle_Usuario", info.id_detalle_usuario);
      }
    }

    this.esLogin = (sessionStorage.getItem("Tipo") == "Login") ? true : false;


    $(document).ready(function () {

      $('#sidebarCollapse').on('click', function () {
        $('#sidebar').toggleClass('active');
        $('#black-panel').toggleClass('active');
        $('.collapse.in').toggleClass('in');
        $('a[aria-expanded=true]').attr('aria-expanded', 'false');
      });
      $('#black-panel').on('click', function () {
        if ($('#sidebar').hasClass('active')) {
          $('#sidebar').removeClass('active');
        }
        if ($('#black-panel').hasClass('active')) {
          $('#black-panel').removeClass('active');
        }
      });
      // $(window).scroll(function () {
      //   var $height = $(window).scrollTop();
      //   if ($height > 95) {
      //     $('body').addClass('activeScroll');
      //   } else {
      //     $('body').removeClass('activeScroll');
      //   }
      // });
    });
    this.ValidarOpcionPerfiles();
  }
  cerrarSesion() {
    let Tipo: string = sessionStorage.getItem("Tipo");
    if (Tipo == "Login") {
      sessionStorage.clear();
      location.reload();
      var cuerpo = document.getElementsByTagName('body')[0];
      cuerpo.classList.remove("page-dashboard");
      cuerpo.classList.add("page-login");
    }
    else {
      sessionStorage.setItem("Logout", "Salio");
    }
  }
  getPerfil(pmensaje) {
    this.perfiles = pmensaje;
  }
  getJSONmenu(data: any): any {

    let menu: any;
    let i: number = 0;

    let item: any;
    let rpta: any = [];
    for (i = 0; i < data.length; i++) {
      item = data[i];

      if (item["nivel"] == 0) {
        item.hijos = this.cargarMenu(item, data, item["id_menu"], (item["nivel"] + 1));
        rpta.push({ "trama": item });
      }
    }
    return rpta;
  }



  cargarMenu(itempadre, _data, _id_menu, _nivel) {
    let i: number = 0;
    let item: any;
    let submenu = [];
    //let items=[];

    for (i = 0; i < _data.length; i++) {
      item = _data[i];
      if (item["id_menu_padre"] == _id_menu && item["nivel"] == _nivel) {
        item.hijos = this.cargarMenu(item, _data, item["id_menu"], (item["nivel"] + 1));
        submenu.push({ "trama": item });
        //submenu.push({"trama":item,"hijos":this.cargarMenu(item,_data,item["id_menu"],(item["nivel"]+1))});
      }
    }

    return submenu;
  }
  AccederComo(): void {
    let ListadoSistemas = [];
    this.AccesoService.ListarModuloPerfilUsuario(Number(sessionStorage.getItem('IdUsuario')))
      .pipe(take(1))
      .subscribe((data: any) => {
        ListadoSistemas = data;
        ListadoSistemas.map((item) => {
          if (item.codigo_modulo === "ssi") {
            item.bg_color = "#db4437";
            item.color = "#ffffff";
          }
          if (item.codigo_modulo === "ssp") {
            item.bg_color = "#db4437";
            item.color = "#ffffff";
          }
        });
        let AccesoDirecto: boolean = (ListadoSistemas.length === 1 && ListadoSistemas[0].perfiles.length === 1) ? true : false;

        if (AccesoDirecto) {
        }
        else {
          let config = {
            ignoreBackdropClick: false,
            class: "modal-sm",
            keyboard: false,
            initialState: {
              ListadoSistemas: ListadoSistemas
            }
          };
          this.bsModalsistemasRef = this.modalService.show(ModalGatewayComponent, config);
        }

      });
  }

  ValidarOpcionPerfiles(): void {
    let ListadoSistemas = [];
    this.AccesoService.ListarModuloPerfilUsuario(Number(sessionStorage.getItem('IdUsuario')))
      .pipe(take(1))
      .subscribe((data: any) => {
        ListadoSistemas = data;
        this.MostarOpcionCambiarPerfil = (ListadoSistemas.length == 1 && ListadoSistemas[0].perfiles.length == 1) ? false : true;
      });
  }
  GenerarReporteGenetral() {
    this.ReporteService.ListarReporteGeneral().subscribe((data: any) => {
      this.ExportarExcel(data);
    });
  }

  GenerarReporteAcceso() {
    this.ReporteService.ListarReporteAcceso().subscribe((data: any) => {
      this.ExportarExcelAcceso(data);
    });
  }
  ExportarExcel(data: any) {
    let keys_header: any = [
      "N° CUI",
      "PLIEGO",
      "DENOMINACIÓN DE INVERSIÓN",
      "REGIÓN",
      "TRAMO/ COMPONENTE",
      "FASE",
      "APELL. Y NOM. ESPECIALISTAS GMS",
      "APELL. Y NOM. ESPECIALISTAS UZ",
      "N° DE CONVENIO 2014",
      "N° DE CONVENIO 2015",
      "N° DE CONVENIO 2016",
      "N° DE CONVENIO 2017",
      "N° DE CONVENIO 2018",
      "N° DE CONVENIO 2019",
      "N° DE CONVENIO 2020",
      "N° DE CONVENIO 2021",
      "N° DE CONVENIO 2022",
      "N° DE CONVENIO 2023",
      "GRUPO DEL DISPOSITIVO",
      "CODIGO DE RUTA",
      "LONGITUD DEL PROYECTO",
      "UNIDAD DE MEDIDA",
      "BENEFICIARIOS",
      "MONTO DE INVERSIÓN ACTUALIZADO (S/.)",
      "COSTO TOTAL DEL PI",
      "DEVENGADO TOTAL AL PRESENTE AÑO",
      "DEVENGADO TOTAL AÑO ANTERIOR",
      "PIA DEL AÑO",
      "PIM DEL AÑO",
      "CERTIFICACIÓN ANUAL",
      "COMPROMISO ANUAL",
      "DEVENGADO ANUAL",
      "ENERO",
      "FEBRERO",
      "MARZO",
      "ABRIL",
      "MAYO",
      "JUNIO",
      "JULIO",
      "AGOSTO",
      "SETIEMBRE",
      "OCTUBRE",
      "NOVIEMBRE",
      "DICIEMBRE",
    ];

    const title = "REPORTE GENERAL";

    let workbook = new ExcelJS.Workbook();
    let worksheet = workbook.addWorksheet('Report');

    const myBase64Image = "data:image/png;base64," + this.helper.LogoBase64();
    
    const image = workbook.addImage({
      base64: myBase64Image,
      extension: 'png',
    });
    let letras = [
      "A", "B", "C", "D", "E", "F", "G", "H", "I", "J",
      "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T",
      "U", "V", "W", "X", "Y", "Z"
    ];
    let letras_pre = ['', 'A', 'B', 'C', 'D'];
    let array = [];

    letras_pre.forEach((ele_pre: any) => {
      letras.forEach((ele: any, index: number) => {
          array.push(ele_pre+ele);
      });
    });
   
    worksheet.addImage(image, 'A1:B2');
    
    //Add Row and formatting
    let titleRow = worksheet.addRow([title]);
    titleRow.font = { name: 'Segoe UI', family: 4, size: 16, bold: true }
    titleRow.alignment = { horizontal: 'center', vertical: 'middle' }
    worksheet.getCell("A1").value = "";
    worksheet.getCell("C1").value = title;

    worksheet.addRow([]);
    worksheet.mergeCells('C1:J1');
    worksheet.addRow([]);


    //Fecha y Hora de Descarga
    worksheet.getCell("I2").value = "Fecha de Descarga:";
    worksheet.getCell("I2").font = { name: 'Segoe UI', bold: true, size: 10 };
    worksheet.getCell("I2").alignment = { horizontal: "right" };
    worksheet.getCell("J2").value = this.helper.ObtenerFechaDescarga();
    worksheet.getCell("J2").font = { name: 'Segoe UI', size: 9 };

    this.RowHeaderTable(worksheet.getCell("A5"));
    keys_header.forEach((element: any, indice: number) => {
      worksheet.getCell(array[indice + 1] + String(5)).value = element;
      this.RowHeaderTable(worksheet.getCell(array[indice + 1] + String(5)));
    });
    for(let i=1;i<46;i++){
      worksheet.getColumn(i).width = 20;
    }
    

    const regex = /;/g;
    data.forEach((ele: any, index: number) => {


      this.RowTable(worksheet,"A" + String(6 + index), index + 1,index + 1);
      this.RowTable(worksheet,"B" + String(6 + index),ele.codigo_unico, index + 1);
      this.RowTable(worksheet,"C" + String(6 + index),ele.nombre_municipalidad, index + 1);
      this.RowTable(worksheet,"D" + String(6 + index),ele.nombre_proyecto, index + 1);
      this.RowTable(worksheet,"E" + String(6 + index),ele.departamento, index + 1);
      this.RowTable(worksheet,"F" + String(6 + index),ele.nombre_tramo, index + 1);
      this.RowTable(worksheet,"G" + String(6 + index),ele.nombre_tipo_fase, index + 1);

      let  listaEspecialistas=ele.especialista_gms.replace(regex, '\n');
      let  listaEspecialistasUZ=ele.especialista_uz.replace(regex, '\n');
      this.RowTable(worksheet,"H" + String(6 + index),listaEspecialistas, index + 1,true);
      this.RowTable(worksheet,"I" + String(6 + index),listaEspecialistasUZ, index + 1,true);
      this.RowTable(worksheet,"J" + String(6 + index),"2014"   , index + 1);
      this.RowTable(worksheet,"K" + String(6 + index),"2015", index + 1);
      this.RowTable(worksheet,"L" + String(6 + index),  "2016" , index + 1);
      this.RowTable(worksheet,"M" + String(6 + index),  "2017" , index + 1);
      this.RowTable(worksheet,"N" + String(6 + index),  "2018" , index + 1);
      this.RowTable(worksheet,"O" + String(6 + index),  "2019" , index + 1);
      this.RowTable(worksheet,"P" + String(6 + index),   "2020", index + 1);
      this.RowTable(worksheet,"Q" + String(6 + index),   "2021", index + 1);
      this.RowTable(worksheet,"R" + String(6 + index),   "2022", index + 1);
      this.RowTable(worksheet,"S" + String(6 + index),   "2023", index + 1);
      this.RowTable(worksheet,"T" + String(6 + index),ele.dispositivo, index + 1);
      this.RowTable(worksheet,"U" + String(6 + index),"", index + 1);
      this.RowTable(worksheet,"V" + String(6 + index),"", index + 1);
      this.RowTable(worksheet,"W" + String(6 + index),ele.beneficiario, index + 1);
      this.RowTable(worksheet,"X" + String(6 + index),ele.costo_actualizado, index + 1);
      this.RowTable(worksheet,"Y" + String(6 + index),ele.costo_total, index + 1);
      this.RowTable(worksheet,"Z" + String(6 + index),ele.devengadoacumulado, index + 1);

      this.RowTable(worksheet,"AA" + String(6 + index),ele.devengadoanioanterior , index + 1);
      this.RowTable(worksheet,"AB" + String(6 + index), ele.piaanioactual, index + 1);
      this.RowTable(worksheet,"AC" + String(6 + index),ele.pimanioactual , index + 1);
      this.RowTable(worksheet,"AD" + String(6 + index),ele.certificado_ano_actual , index + 1);
      this.RowTable(worksheet,"AE" + String(6 + index), ele.comprometido_ano_actual, index + 1);
      this.RowTable(worksheet,"AF" + String(6 + index), ele.devengadoanioactual, index + 1);
      this.RowTable(worksheet,"AG" + String(6 + index),ele.devene , index + 1);
      this.RowTable(worksheet,"AH" + String(6 + index),ele.devfeb  , index + 1);
      this.RowTable(worksheet,"AI" + String(6 + index), ele.devmar , index + 1);
      this.RowTable(worksheet,"AJ" + String(6 + index), ele.devabr , index + 1);
      this.RowTable(worksheet,"AK" + String(6 + index), ele.devmay , index + 1);
      this.RowTable(worksheet,"AL" + String(6 + index), ele.devjun , index + 1);
      this.RowTable(worksheet,"AM" + String(6 + index), ele.devjul , index + 1);
      this.RowTable(worksheet,"AN" + String(6 + index), ele.devago , index + 1);
      this.RowTable(worksheet,"AO" + String(6 + index), ele.devset , index + 1);
      this.RowTable(worksheet,"AP" + String(6 + index), ele.devoct , index + 1);
      this.RowTable(worksheet,"AQ" + String(6 + index), ele.devnov , index + 1);
      this.RowTable(worksheet,"AR" + String(6 + index), ele.devdic , index + 1);
    });

    workbook.xlsx.writeBuffer().then((data__: any) => {
      let blob = new Blob([data__], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs.saveAs(blob, 'Reporte.xlsx');
    });
  }

  ExportarExcelAcceso(data: any) {
    let keys_header: any = [
      "FECHA CREACIÓN",
      "USUARIO",
      "NOMBRE DE USUARIO",
      "ESTADO",
      "CORREO ELECTRÓNICO",
      "CELULAR",
      "DNI",
      "PERFIL",
      "GERENCIA",
      "UNIDAD EJECUTORA",
      "REGIÓN",      
    ];

    const title = "REPORTE DE ACCESO";

    let workbook = new ExcelJS.Workbook();
    let worksheet = workbook.addWorksheet('Report');

    const myBase64Image = "data:image/png;base64," + this.helper.LogoBase64();
    
    const image = workbook.addImage({
      base64: myBase64Image,
      extension: 'png',
    });
    let letras = [
      "A", "B", "C", "D", "E", "F", "G", "H", "I", "J",
      "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T",
      "U", "V", "W", "X", "Y", "Z"
    ];
    let letras_pre = ['', 'A', 'B', 'C', 'D'];
    let array = [];

    letras_pre.forEach((ele_pre: any) => {
      letras.forEach((ele: any, index: number) => {
          array.push(ele_pre+ele);
      });
    });
   
    worksheet.addImage(image, 'A1:B2');
    
    //Add Row and formatting
    let titleRow = worksheet.addRow([title]);
    titleRow.font = { name: 'Segoe UI', family: 4, size: 16, bold: true }
    titleRow.alignment = { horizontal: 'center', vertical: 'middle' }
    worksheet.getCell("A1").value = "";
    worksheet.getCell("C1").value = title;

    worksheet.addRow([]);
    worksheet.mergeCells('C1:J1');
    worksheet.addRow([]);


    //Fecha y Hora de Descarga
    worksheet.getCell("I2").value = "Fecha de Descarga:";
    worksheet.getCell("I2").font = { name: 'Segoe UI', bold: true, size: 10 };
    worksheet.getCell("I2").alignment = { horizontal: "right" };
    worksheet.getCell("J2").value = this.helper.ObtenerFechaDescarga();
    worksheet.getCell("J2").font = { name: 'Segoe UI', size: 9 };

    this.RowHeaderTable(worksheet.getCell("A5"));
    keys_header.forEach((element: any, indice: number) => {
      worksheet.getCell(array[indice + 1] + String(5)).value = element;
      this.RowHeaderTable(worksheet.getCell(array[indice + 1] + String(5)));
    });
    for(let i=1;i<15;i++){
      worksheet.getColumn(i).width = 20;
    }
    worksheet.getColumn(6).width = 35;

    const regex = /;/g;
    data.forEach((ele: any, index: number) => {
      this.RowTable(worksheet,"A" + String(6 + index), index + 1,index + 1);
      this.RowTable(worksheet,"B" + String(6 + index),ele.fecha_creacion, index + 1);
      this.RowTable(worksheet,"C" + String(6 + index),ele.usuario_acceso, index + 1);
      this.RowTable(worksheet,"D" + String(6 + index),ele.nombre_usuario, index + 1);
      this.RowTable(worksheet,"E" + String(6 + index),ele.estado_acceso, index + 1);
      this.RowTable(worksheet,"F" + String(6 + index),ele.correo_electronico, index + 1);
      this.RowTable(worksheet,"G" + String(6 + index),ele.celular, index + 1);
      this.RowTable(worksheet,"H" + String(6 + index),ele.dni, index + 1,true);
      this.RowTable(worksheet,"I" + String(6 + index),ele.perfil, index + 1,true);
      this.RowTable(worksheet,"J" + String(6 + index),ele.gerencia  , index + 1);
      this.RowTable(worksheet,"K" + String(6 + index),ele.unidad_ejecutora, index + 1);
      this.RowTable(worksheet,"L" + String(6 + index),ele.region , index + 1);    
    });

    workbook.xlsx.writeBuffer().then((data__: any) => {
      let blob = new Blob([data__], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs.saveAs(blob, 'Reporte_acceso.xlsx');
    });
  }

  RowTable(worksheet:any,celda: any = null,valor:any=null, posicion: number=2,wrapText:boolean=false) {

    worksheet.getCell(celda).value = valor;

    let obj=worksheet.getCell(celda);
    obj.alignment = { wrapText: true ,vertical: 'middle'};
    obj.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    }
    obj.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: (((posicion) % 2) == 0) ? 'F2F2F2' : 'ffffff' }
    }
  }
  RowHeaderTable(obj: any = null) {     
    obj.border = { 
      top: { style: 'thin' }, 
      left: { style: 'thin' }, 
      bottom: { style: 'thin' }, 
      right: { style: 'thin' } 
    }
    obj.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '039BE5' },
      bgColor: { argb: '039BE5' }
    }
    obj.alignment = { 
      horizontal: 'center', 
      vertical: 'middle', 
      wrapText: true }
    obj.font = {
      bold: true,
      color: { argb: "FFFFFF" }
    };
  }
}
