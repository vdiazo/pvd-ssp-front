import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { Funciones } from '../../../appSettings/funciones';
import { Settings } from '../../../appSettings/settings';
import { FacadeService } from '../../patterns/facade.service';

@Component({
  selector: 'set-input-file-uploader',
  templateUrl: './input-file-uploader.component.html',
  styleUrls: ['./input-file-uploader.component.css']
})
export class InputFileUploaderComponent implements OnInit {

  ShowFormUploader:boolean=true;
  idFase: number;
  @Input() IdComponente: string;
  @Input() IdProyectoDetalle: number;
  @Input() EsObligatorio: boolean;
  @Input() CantidadArchivos: number;
  @Input() NoCorresponde:boolean;
  @Input() HabilitarBtnInputReq:boolean;

  @Input() ShowBtnSubirArchivo:boolean=true;
  @Input() ShowBtnNoCorresponde:boolean=true;

  @Output() propagarEventEmitter = new EventEmitter<string>();
  @Output() checkEventEmitter = new EventEmitter();
  @Output() showListaEventEmitter = new EventEmitter();
  @Output() loadValueCheck = new EventEmitter();

  @Input() documentosExpediente =[];

  constructor(private funciones: Funciones,private fs: FacadeService) {
    let valor=this;
    this.uploader.onBeforeUploadItem=function(){

    }
    let este=this;
    this.uploader.onCompleteItem = function (item: any, response: any, status: any, headers: any) {
      let respuesta:any;
      if(status==200){
        try{
          let parametros={
            "id_contenido_exptec_fase":valor.IdComponente,
            "nombre_archivo":response,
            "nombre_archivo_original":item.file.name,
            "tamanio":item.file.size,
            "usuario_creacion":sessionStorage.getItem("Usuario")
          }

          if(response=='-1' || response==-1){
            valor.funciones.alertaSimple("warning","Información","No fue posible adjuntar el documento <b>" +item.file.name+"</b>, por favor inténtelong más tarde.",true);
            item.isReady=false;
            item.isUploading=false;
            item.isSuccess=false;
            item.isError=true;
            item.progress=0;
          }
          else{
            valor.fs.procesoLiquidacionService.insertarContenidoExpedienteArchivo(parametros).subscribe(
              data=>{
                item.remove();
                este.propagarEventEmitter.emit(valor.IdComponente);
                
              }
            )            
          }


        }
        catch(e){
  
        }
      }else{
        valor.funciones.alertaSimple("warning","Información","En este momento no se puede adjuntar archivos, por favor intenteló más tarde.",true);
      }
      
    };





    this.uploader.onCancelItem = function(item: any, response: any, status: any, headers: any) {
    };

    this.uploader.onErrorItem = function (item: any, response: any, status: any, headers: any) {
    };
    this.uploader.onAfterAddingFile=(item)=>{
      item.withCredentials=false;
      //item.
    }

   }

  ngOnInit() {
    this.idFase=parseInt(JSON.parse(sessionStorage.getItem("datosProyectoExpTec")).idFase);
  }

  public uploader: FileUploader = new FileUploader({ url: Settings.API_ENDPOINT_SET+'api/SubirArchivo?tipoArchivo=32',autoUpload: true, authToken:'Bearer ' +sessionStorage.getItem("token")});

  public hasBaseDropZoneOver = false;
  public hasAnotherDropZoneOver = false;

  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  public fileOverAnother(e: any): void {
    this.hasAnotherDropZoneOver = e;
  }

  checkEvent(event){
    this.checkEventCall(event.target);
    //this.comun.EjecAnyEvent();
  }
  checkEventCall(check){
    let inp:HTMLInputElement=check;
    let parametros = {
      "id_contenido_exptec_fase":parseInt(this.IdComponente),
      "no_corresponde":true,
      "es_obligatorio":false,
      "usuario_modificacion": sessionStorage.getItem("Usuario"),
    };

    if(inp.checked){
      parametros.es_obligatorio=false;
      this.fs.procesoLiquidacionService.modificarContenidoExpediente(parametros).subscribe(
        data=>{
          this.checkEventEmitter.emit({NoCorresponde:true, id_contenido_exptec_fase:parseInt(this.IdComponente),es_obligatorio:false});
        }
      );
    }else{
      parametros.es_obligatorio=true;
      parametros.no_corresponde=false;
      this.fs.procesoLiquidacionService.modificarContenidoExpediente(parametros).subscribe(
        data=>{
          this.checkEventEmitter.emit({NoCorresponde:false, id_contenido_exptec_fase:parseInt(this.IdComponente),es_obligatorio:true});
        }
      );
    }
  }

  anularFile(idFile){
    let parametros={
      "id_contenido_exptec_fase_archivo":idFile,
      "usuario_eliminacion":sessionStorage.getItem("Usuario")
    }
    this.funciones.alertaRetorno("question", "¿Está seguro de eliminar el registro?", "", true, (respuesta) => {
      if (respuesta.value) {
        this.fs.procesoLiquidacionService.anularContenidoExpedienteArchivo(parametros).subscribe(
          data=>{
            this.fs.procesoLiquidacionService.listarRegistroExpediente(this.idFase).subscribe(
              data=>{
                let listado=data;
                listado.forEach(element => {
                  if(element.id_contenido_exptec_fase == this.IdComponente){
                    this.documentosExpediente=element.archivos
                  }
                });
              }
            )
          }
        )
      }
    });
    
  }



}
