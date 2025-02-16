import { Pipe, PipeTransform } from '@angular/core'
import { Functions } from 'src/app/appSettings/functions';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({ name: "formatoFecha" })
export class formatoFechaPipe implements PipeTransform {
    constructor(private funciones: Functions) {

    }

    transform(fecha: any, ...args: any[]) {
        if (fecha) {
            return this.funciones.formatDate(fecha);
        } else {
            return "";
        }
    }
}

@Pipe({ name: "formatoMoneda" })
export class formatoMonedaPipe implements PipeTransform {
    constructor(private funciones: Functions) {

    }

    transform(monto: any, ...args: any[]) {
        if (monto == 0) {
            return "S/0.00";
        }

        if (monto.toString().length == 1 || monto.toString().length == 2) {
            return "S/" + monto + ".00";
        }

        return "S/" + this.funciones.format(this.funciones.setearValorDecimal(monto.toString()));
    }

}

@Pipe({ name: 'safe' })
export class SafePipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) { }
  transform(url) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}