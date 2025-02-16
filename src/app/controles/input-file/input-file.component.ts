import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Settings } from '../../appSettings/settings';
import { Functions } from '../../appSettings/functions';
import { FacadeService } from '../../patterns/facade.service';
import { IfStmt } from '@angular/compiler';

@Component({
  selector: 'app-input-file',
  templateUrl: './input-file.component.html',
  styleUrls: ['./input-file.component.css']
})
export class InputFileComponent implements OnInit {
  @Input() idComp: string;
  @Input() Value: string;
  @Input() MensajeMaxSize: string;
  @Input() Extensiones: string;
  @Input() Solo: string;
  @Input() IdTipoArchivo: number;
  @Output() onChange = new EventEmitter();

  constructor(private fs: FacadeService, private funciones: Functions) {
  }

  ngOnInit() {
    if (null == this.IdTipoArchivo) throw new Error("El Atributo 'IdTipoArchivo' es requerido.");
  }

  validarExtensionArchivo(FileEntrada: any): boolean {

    if (!this.Extensiones) return true;

    let extension = FileEntrada.name.substring(FileEntrada.name.lastIndexOf(".")).toLowerCase();
    let extensionesPermitidas = this.Extensiones.split(',');

    let existe = extensionesPermitidas.find(x => x == extension);

    return !!existe;
  }

  validarTamanioArchivo(FileEntrada: any): boolean {
    //fileName.substring(fileName.lastIndexOf('.')+1)
    let extension:string="";
    extension=FileEntrada.name.substring(FileEntrada.name.lastIndexOf('.')+1);
    let valor:number=0;
    if(extension=="mp4" || extension=="avi" || extension=="flv" || extension=="mpeg" || extension=="wmv" ){
        valor=Settings.MAX_SIZE_UPLOAD_VIDEO;
    }else{
      valor=Settings.MAX_SIZE_UPLOAD;
    }
    return FileEntrada.size <= valor;
  }

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
          response => {
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
}





