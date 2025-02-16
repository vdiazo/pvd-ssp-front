import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Settings } from '../../../appSettings/settings';
import { Functions } from '../../../appSettings/functions';
import { FacadeService } from '../../../patterns/facade.service';


@Component({
  selector: 'app-input-file-listado',
  templateUrl: './input-file-listado.component.html',
  styleUrls: ['./input-file-listado.component.css']
})
export class InputFileListadoComponent implements OnInit {
  @Input() idComp: string;
  @Input() Value: string;
  @Input() MensajeMaxSize: string;
  @Input() Extensiones: string;
  @Output() onChange = new EventEmitter();

  constructor(private fs: FacadeService, private funciones: Functions) { }

  ngOnInit() {
  }
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
      
      // let $img: any = document.querySelector('#' + this.idComp);

      // if (typeof (FileReader) !== 'undefined') {
      //   let reader = new FileReader();
      //   var arByte = [];
      //   reader.onload = (e: any) => {
      //     this.pdfSrc = e.target.result;
      //     var array = new Uint8Array(this.pdfSrc);
      //     for (var i = 0; i < array.length; i++) {
      //         arByte.push(array[i]);
      //     }
          
      //   };
      //   reader.readAsArrayBuffer($img.files[0]);
         event.nombre = FileEntrada.name;
         event.file = FileEntrada;
      //   event.uploaded = arByte;
        this.onChange.emit(event);
      //}
    }
  }
}
