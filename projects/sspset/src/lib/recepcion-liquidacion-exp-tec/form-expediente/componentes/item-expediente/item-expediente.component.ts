import { Component, OnInit, Input } from '@angular/core';
import { ProcesoLiquidacionService } from '../../../../services/proceso-liquidacion.service';
import { tipoArchivo } from '../../../../../appSettings/enumeraciones';

import { Funciones } from '../../../../../appSettings/funciones';

@Component({
  selector: 'set-item-expediente',
  templateUrl: './item-expediente.component.html',
  styleUrls: ['./item-expediente.component.css']
})
export class ItemExpedienteComponent implements OnInit {
  idFase: number;

  nombreArchivo: string = null;
  IdTipoArchivo: number =tipoArchivo.expedienteTecnico;
  IdComponente: string;

  listArchivosSeleccionados = [];
  listArchivosSeleccionadosTemporal = [];

  listaExpediente;
  @Input() requisitos;
  @Input() requisitosBD;
  @Input() item;
  @Input() orden: string = '';

  ESTADO: string = "";

  ShowBtnSubirArchivo: boolean = false;
  ShowBtnNoCorresponde: boolean = false;

  constructor(private fs:ProcesoLiquidacionService, private funciones:Funciones) { }

  ngOnInit() {
    this.idFase=parseInt(JSON.parse(sessionStorage.getItem("datosProyectoExpTec")).idFase);
  }

  

  ObtenerNodos(id_proyecto_detalle) {
    let response = {
      IndicesTree: [],
      NivelActual: 0,
      IdsPadres: [],
      ElementoActual: null,
      ElementosPadres: null
    }
    let padres = [];
    let nivelActual: number = 0;
    let idspadres = [];
    let elementoactual = {};
    let elementospadres = [];

    let i:number;
    let j:number;
    let k:number;
    let l:number;
    let m:number;
    let elementoI:any;
    let elementoJ:any;
    let elementoK:any;
    let elementoL:any;
    let elementoM:any;

    for (i = 0; i < this.requisitos.length; i++) {
      elementoI = this.requisitos[i];

      if (elementoI.id_proyecto_detalle == id_proyecto_detalle) {
        padres.push(i, null, null, null, null);
        nivelActual = 1;
        idspadres.push(elementoI.id_proyecto_detalle);
        elementoactual = this.requisitos[i];
        elementospadres.push(this.requisitos[i]);
      }

      for (j = 0; j < elementoI.hijos.length; j++) {
        elementoJ = elementoI.hijos[j];
        if (elementoJ.id_proyecto_detalle == id_proyecto_detalle) {
          padres.push(i, j, null, null, null);
          nivelActual = 2;
          idspadres.push(elementoI.id_proyecto_detalle, elementoJ.id_proyecto_detalle);
          elementoactual = this.requisitos[i].hijos[j];
          elementospadres.push(this.requisitos[i], this.requisitos[i].hijos[j]);
        }

        for (k = 0; k < elementoJ.hijos.length; k++) {
          elementoK = elementoJ.hijos[k];
          if (elementoK.id_proyecto_detalle == id_proyecto_detalle) {
            padres.push(i, j, k, null, null);
            nivelActual = 3;
            idspadres.push(elementoI.id_proyecto_detalle, elementoJ.id_proyecto_detalle, elementoK.id_proyecto_detalle);
            elementoactual = this.requisitos[i].hijos[j].hijos[k];
            elementospadres.push(this.requisitos[i], this.requisitos[i].hijos[j], this.requisitos[i].hijos[j].hijos[k]);
          }

          for (l = 0; l < elementoK.hijos.length; l++) {
            elementoL = elementoK.hijos[l];
            if (elementoL.id_proyecto_detalle == id_proyecto_detalle) {
              padres.push(i, j, k, l, null);
              nivelActual = 4;
              idspadres.push(elementoI.id_proyecto_detalle, elementoJ.id_proyecto_detalle, elementoK.id_proyecto_detalle, elementoL.id_proyecto_detalle);
              elementoactual = this.requisitos[i].hijos[j].hijos[k].hijos[l];
              elementospadres.push(this.requisitos[i], this.requisitos[i].hijos[j], this.requisitos[i].hijos[j].hijos[k], this.requisitos[i].hijos[j].hijos[k].hijos[l]);
            }
            for (m = 0; m < elementoL.hijos.length; m++) {
              elementoM = elementoL.hijos[m];
              if (elementoM.id_proyecto_detalle == id_proyecto_detalle) {
                padres.push(i, j, k, l, m);
                nivelActual = 5;
                idspadres.push(elementoI.id_proyecto_detalle, elementoJ.id_proyecto_detalle, elementoK.id_proyecto_detalle, elementoL.id_proyecto_detalle, elementoM.id_proyecto_detalle);
                elementoactual = this.requisitos[i].hijos[j].hijos[k].hijos[l].hijos[m];
                elementospadres.push(this.requisitos[i], this.requisitos[i].hijos[j], this.requisitos[i].hijos[j].hijos[k], this.requisitos[i].hijos[j].hijos[k].hijos[l], this.requisitos[i].hijos[j].hijos[k].hijos[l].hijos[m]);
              }
            }
          }
        }
      }
    }

    response.IndicesTree = padres;
    response.NivelActual = nivelActual;
    response.IdsPadres = idspadres;
    response.ElementoActual = elementoactual;
    response.ElementosPadres = elementospadres;
    return response;
  }

  ArchivoCargado(event, id_proyecto_detalle){

    this.fs.listarRegistroExpediente(this.idFase).subscribe(
      data=>{
        let listado=[];
        listado=data.find(x=>x.id_contenido_exptec_fase==event).archivos;

        for(let i=0;i<this.item.length;i++){
          if(this.item[i].id_contenido_exptec_fase==event){
            this.item[i].archivos=listado;
            break
          }
        }

        
      }
    )
  }

  ActualizarListado_(event, id_proyecto_detalle) {
    /*let param = {
      id_proyecto_detalle: id_proyecto_detalle
    }
    this.fs.proyectoService.listarDocumentos(param).subscribe(
      (data: any) => {

        let nods = this.ObtenerNodos(id_proyecto_detalle);
        if (data != null) {
          nods.ElementoActual.cantidad_archivos = data.length;
          this.Llenado_(true,nods);
        }
        else {
          this.Llenado_(false,nods);
        }
        nods.ElementoActual.documentos = data;
        this.InfoItemCompartido.ValidarCompletado(nods);
      }
    );*/
  }

  Anular_File(evento, id_proyecto_detalle, id_proyecto_detalle_doc) {
    let parametros={
      "id_contenido_exptec_fase_archivo":id_proyecto_detalle_doc,
      "usuario_eliminacion":sessionStorage.getItem("Usuario")
    }
    this.funciones.alertaRetorno("question", "¿Está seguro de eliminar el registro?", "", true, (respuesta) => {
      if (respuesta.value) {
        this.fs.anularContenidoExpedienteArchivo(parametros).subscribe(
          data=>{
            this.fs.listarRegistroExpediente(this.idFase).subscribe(
              data=>{
                let listado=[];
                listado=data.find(x=>x.id_contenido_exptec_fase==id_proyecto_detalle).archivos;
                for(let i=0;i<this.item.length;i++){
                  if(this.item[i].id_contenido_exptec_fase==id_proyecto_detalle){
                    this.item[i].archivos=listado;
                    break
                  }
                }
              }
            )
          }
        )
      }
    });
  }


  validarEdicion(fila,boton:string) {
        if(fila!=null){
          if (fila.es_corregido) {
            return false;
          }else{
            return this[boton]
          }          
        }
        else{
          return this[boton]
        }
  }

  NoCorreonde(e: any, id_proyecto_detalle?) {
    if (e.NoCorresponde == true) {
          this.item.find(x => x.id_contenido_exptec_fase == e.id_contenido_exptec_fase).no_corresponde = true;
    }
    if (e.NoCorresponde == false) {
          this.item.find(x => x.id_contenido_exptec_fase == e.id_contenido_exptec_fase).no_corresponde = false;
    }
  }

  /*fileChangeEvent(evento: any) {
    if (evento.sizeOK == true) {
      if (this.listArchivosSeleccionadosTemporal != null && this.listArchivosSeleccionadosTemporal != undefined && evento.uploaded!= null) {
        if (this.listArchivosSeleccionadosTemporal.indexOf(evento.uploaded._body) == -1) {
          let InputSalida: HTMLInputElement = document.getElementsByName("fileCapacitacionmodal")[0] as HTMLInputElement;
          this.listArchivosSeleccionados.push({"id_detalle_capacitacion":0,"nombre_archivo": evento.uploaded._body,"activo":true,"ruta_archivo": ""});
          this.listArchivosSeleccionadosTemporal.push(evento.uploaded._body);
          InputSalida.value = "";
          evento.target.value = '';
        }else{

        }
      }
    }
    if (evento.uploaded != null) {
      this.nombreArchivo = evento.uploaded._body;
    }
  }*/



}
