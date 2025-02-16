import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FileDataRow } from '../../../models/response/FileDataRow';
import { FacadeService } from '../../patterns/facade.service';
import { CommonService } from '../../services/common.service';
import { FileUploader , FileItem } from 'ng2-file-upload';
import { Settings } from '../../../appSettings/settings';
import { tipoArchivo } from '../../../appSettings/enumeraciones';
import { Funciones } from '../../../appSettings/funciones';
import { DxFileUploaderComponent } from 'devextreme-angular';

@Component({
  selector: 'set-input-req',
  templateUrl: './input-req.component.html',
  styleUrls: ['./input-req.component.css']
})
export class InputReqComponent implements OnInit {
  value: any[] = [];
  mostrar:boolean=false;
  @ViewChild("fileUploader") fileUploader: DxFileUploaderComponent;

  idFase: number;
  idSeguimiento: number;

  /**/
  @Input() idComp: string="fileRecepcionObra";
  @Input() Value: string;
  @Input() MensajeMaxSize: string;
  @Input() Extensiones: string;
  @Input() Solo: string;
  @Output() onChange = new EventEmitter();
  /** */

  nombreArchivo: string = null;
  IdTipoArchivo: number =tipoArchivo.expedienteTecnico;

  listArchivosSeleccionados = [];
  listArchivosSeleccionadosTemporal = [];



  title = 'angular6-app';
  status = 'ONLINE';
  isConnected = true;
  DatRowFileSend: FileDataRow[] = [];
  itemStringsLeft: any[] = [
    'Windstorm',
    'Bombasto',
    'Magneta',
    'Tornado'
  ];
  ShowFormUploader:boolean=true;
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
  rutaServicio=Settings.API_ENDPOINT_SET+"api/SubirArchivo?tipoArchivo=32";

  constructor(
    private route:ActivatedRoute,
    private fs:FacadeService,
    private comun:CommonService,
    private funciones:Funciones
  ) {
   }

  ngOnInit() {
    this.idFase=parseInt(JSON.parse(sessionStorage.getItem("datosProyectoExpTec")).idFase);
    this.idSeguimiento=parseInt(JSON.parse(sessionStorage.getItem("datosProyectoExpTec")).idSeguimientoMonitoreo);
  }

  /*inicio*/
  validarExtensionArchivo(FileEntrada: any): boolean {

    if (!this.Extensiones) return true;

    let extension = FileEntrada.name.substring(FileEntrada.name.lastIndexOf(".")).toLowerCase();
    let extensionesPermitidas = this.Extensiones.split(',');

    let existe = extensionesPermitidas.find(x => x == extension);

    return !!existe;
  }

  validarTamanioArchivo(FileEntrada: any): boolean {
    return FileEntrada.size <= Settings.MAX_SIZE_UPLOAD;
  }
  pdfSrc: any;
  arrBytes: any;


  lanzarOnChange(event) {
    event.sizeOK = true;
    event.extensionOK = true;
    let FileEntrada = event.target.files[0];
    if (FileEntrada) {
      let esArchivoValido = this.validarExtensionArchivo(FileEntrada);

      if (!esArchivoValido) {
        event.extensionOK = false;
        event.uploaded = null;
        event.target.value = '';
        this.funciones.mensaje("warning", "Por favor verifique el tipo de archivo");
        this.onChange.emit(event);
        return;
      }

      esArchivoValido = this.validarTamanioArchivo(FileEntrada);

      if (!esArchivoValido) {
        event.sizeOK = false;
        event.uploaded = null;
        event.target.value = '';
        this.funciones.mensaje("warning", "Por favor verifique el tamaño de su archivo");
        this.onChange.emit(event);
        return;
      }

      let InputSalida: HTMLInputElement = document.getElementsByName(this.idComp)[0] as HTMLInputElement;
      InputSalida.value = FileEntrada.name;
      if(this.Solo == undefined){
        this.fs.maestraService.registrarArchivoData(FileEntrada, this.IdTipoArchivo).subscribe(
          (response:any) => {
            let parametros={
              "id_contenido_exptec_fase":this.IdComponente,
              "nombre_archivo":response._body,
              "nombre_archivo_original":FileEntrada.name,
              "tamanio":FileEntrada.size,
              "usuario_creacion":sessionStorage.getItem("Usuario")
            }
            this.fs.procesoLiquidacionService.insertarContenidoExpedienteArchivo(parametros).subscribe(
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
            event.uploaded = response;
            this.onChange.emit(event);
          },
          () => {
            this.funciones.mensaje("warning", "Problemas con el servidor, por favor intente subir su archivo más tarde.");
            event.uploaded = null;
            this.onChange.emit(event);
          });
      }else{
        this.onChange.emit(event);
      }      
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

  /**fin */


  /**nuevo componente */
  nombreFile;
  onUploaded () {  
  } 
  mostrarTabla: boolean=false;
  tablafinalMostrar: boolean=true;;
  onUploadStarted(e) {
    this.mostrarTabla=true;
    this.tablafinalMostrar=false;
    this.listaCargada.push({"nombre":e.file.name,"tamanio":e.file.size});
    this.onChange.emit(event);
  }
  cancelar(e){
    this.funciones.mensaje("alert","se cancelo el registro del archivo");
  }
  elimina(e){
    this.funciones.mensaje("alert","se elimino el registro del archivo");
  }

  error(e){
    this.funciones.mensaje("alert","error al subir el archivo");
  }


  listaCargada=[];
  Registro(e){
		let parametros={
      "id_contenido_exptec_fase":this.IdComponente,
      "nombre_archivo":e.request.responseText,
      "nombre_archivo_original":e.file.name,
      "tamanio":e.file.size,
      "usuario_creacion":sessionStorage.getItem("Usuario")
    }
    this.fs.procesoLiquidacionService.insertarContenidoExpedienteArchivo(parametros).subscribe(
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

    //this.fileUploader.instance.dispose();
    this.mostrarTabla=false;
    this.tablafinalMostrar=true;
    this.listaCargada=[];

  }
  
  valor:number=0;
	onUploadProgress(e) {
    let percentDone = Math.round(100 * e.bytesLoaded / e.bytesTotal);
    this.valor=percentDone;
  }
  
  getChunkPanel() {
		return document.querySelector('.chunk-panel');
  }
  getValueInKb(value) {
		return (value / 1024).toFixed(0) + "kb";
  }

  /*fin nuevo componente*/

  public uploader: FileUploader = new FileUploader({ url: Settings.hostNode+'upload',autoUpload: true});
  

  public hasBaseDropZoneOver = false;
  public hasAnotherDropZoneOver = false;

  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  public fileOverAnother(e: any): void {
    this.hasAnotherDropZoneOver = e;
  }
  subir(item:FileItem, IdProyectoDetalle:any, EsObligatorio:any){
    let item2 =item as FileItemMTC;
    item2.EsObligatorio=EsObligatorio;

    item2.upload();
  }

  checkEvent(event){
    this.checkEventCall(event.target);
    this.comun.EjecAnyEvent();
  }

  checkEventCall(check){
    //let inp:HTMLInputElement= event.target; 
    let inp:HTMLInputElement=check;
    let parametros = {
      "id_proyecto_detalle": this.IdProyectoDetalle,
      "usuario_modificacion": sessionStorage.getItem("Usuario"),
      "es_obligatorio": false,
      "detalle_documentos": null
    };

    if(inp.checked){
      parametros.es_obligatorio=false;
      /*this.fs.proyectoService.insertarDocumentoProyecto(parametros).subscribe(
        data=>{
          this.checkEventEmitter.emit({NoCorresponde:true, id_proyecto_detalle:this.IdProyectoDetalle});
        }
      );*/
    }else{
      parametros.es_obligatorio=true;
      /*this.fs.proyectoService.insertarDocumentoProyecto(parametros).subscribe(
        data=>{
          this.checkEventEmitter.emit({NoCorresponde:false, id_proyecto_detalle:this.IdProyectoDetalle});
        }
      );*/
    }
  }

}

export class FileItemMTC extends FileItem {
  IdProyectoDetalle:number;
  EsObligatorio:string;
}
