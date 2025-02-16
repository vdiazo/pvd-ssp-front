import { Component, OnInit, Input } from '@angular/core';
import { ProcesoLiquidacionService } from '../../services/proceso-liquidacion.service';
import { Requisito } from '../../../models/response/requisitos';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ModalLoadingDownloadComponent } from './modal-loading-download/modal-loading-download.component';

@Component({
  selector: 'set-form-expediente',
  templateUrl: './form-expediente.component.html',
  styleUrls: ['./form-expediente.component.css']
})
export class FormExpedienteComponent implements OnInit {
    idFase: number;


  @Input() idSeguimientoMonitoreoObra;
  @Input() bEstado: boolean;

  bsModalLoadingDowload: BsModalRef;

  requisitos;
  requisitosBD;//: Requisito[];
  mostrarRutaDescarga;
  rutaDocumento;

  constructor(
    private fs:ProcesoLiquidacionService,
    private modalService: BsModalService) { }

  ngOnInit() {
    this.idFase=parseInt(JSON.parse(sessionStorage.getItem("datosProyectoExpTec")).idFase);
    this.listarExpediente(this.idFase);
    //this.listarExpediente();
    
  }

  Registrar(){

  }

  getJSONmenu(data: any): any {
    let menu: any;
    let i: number = 0;

    let item: any;
    let rpta: any = [];
    for (i = 0; i < data.length; i++) {
      item = data[i];

      if (item["nivel"] == 0) {
        //item.revisado_evaluador = (item.es_corregido || item.es_observado) ? true : false;
        item.llenado=(
          (item.cantidad_archivos>0 && item.flag_archivo) ||
          (item.flag_archivo && item.no_corresponde!=null) || 
          (item.frag_formulario && item.no_corresponde!=null)
          )?true:false;
        
        item.hijos = this.cargarMenu(item, data, item["id_contenido_exptec"], (item["nivel"] + 1));
        rpta.push(item);
      }
    }
    return rpta;
  }
  cargarMenu(itempadre, _data, _id_menu, _nivel) {
    let i: number = 0;
    let item: any;
    let submenu = [];

    for (i = 0; i < _data.length; i++) {
      item = _data[i];
      if (item["id_padre"] == _id_menu && item["nivel"] == _nivel) {
        //item.revisado_evaluador = (item.es_corregido || item.es_observado) ? true : false;
        item.llenado=(
          (item.cantidad_archivos>0 && item.flag_archivo) ||
          (item.flag_archivo && item.no_corresponde!=null) || 
          (item.frag_formulario && item.no_corresponde!=null)
          )?true:false;
        
        item.hijos = this.cargarMenu(item, _data, item["id_contenido_exptec"], (item["nivel"] + 1));
        submenu.push(item);
      }
    }

    return submenu;
  }

  listarExpediente(idFase){
    this.fs.listarRegistroExpediente(idFase).subscribe(
      data=>{
        this.requisitosBD=data;
        this.requisitos = this.getJSONmenu(this.requisitosBD);
      }
    )
  }

  descargarComponente(){
   
    this.openModalLoadingDowload();
   
    let param={
      "id_fase":this.idFase
    }
    this.fs.descargaComponentes(param).subscribe(
      (data:any)=>{
        if(data){
          this.closeModalLoadingDowload();
          this.mostrarRutaDescarga = true;
          let arrayDeCadenas = data.split('|');
          this.rutaDocumento = arrayDeCadenas[2];
        }
      }
    )
  }
  openModalLoadingDowload(): void {
    const config = {
      ignoreBackdropClick: true,
      keyboard: false,
      // class: 'registro-listado-proyectos',
      backdrop: true
    };

    this.bsModalLoadingDowload = this.modalService.show(ModalLoadingDownloadComponent, config);
  }

  closeModalLoadingDowload(): void {
    this.bsModalLoadingDowload.hide();
  }

}
