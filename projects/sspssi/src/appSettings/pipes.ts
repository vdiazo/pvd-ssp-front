import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Functions } from './functions';

@Pipe({ name: "formatoFecha" })
export class formatoFechaPipe implements PipeTransform {
  constructor(public funciones: Functions) {

  }

  transform(fecha: any, ...args: any[]) {
    if (fecha) {
      // return Observable.apply(this.funciones.formatDate(fecha));
      return this.funciones.formatDate(fecha);
    } else {
      return "";
    }
  }
}

@Pipe({ name: "formatoMoneda" })
export class formatoMonedaPipe implements PipeTransform {
  constructor(public funciones: Functions) {
  }

  transform(monto: any, ...args: any[]) {
    if (monto == 0) {
      // return Observable.apply("S/0.00");
      return 'S/ 0.00';
    }

    if (monto.toString().length == 1 || monto.toString().length == 2) {
      // return Observable.apply("S/" + monto + ".00");
      return `S/ ${monto}.00`;
    }

    // return Observable.apply("S/" + this.funciones.format(this.funciones.setearValorDecimal(monto.toString())));
    return `S/ ${this.funciones.format(this.funciones.setearValorDecimal(monto.toString()))}`;
  }
}

@Pipe({ name: 'safe' })
export class SafePipe implements PipeTransform {
  constructor(public sanitizer: DomSanitizer) { }
  transform(url: any): any {
    // return Observable.apply(this.sanitizer.bypassSecurityTrustResourceUrl(url));
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}

@Pipe({ name: 'formatoNumeroDecimal' })
export class formatoNumeroDecimalPipe implements PipeTransform {
  constructor(public funciones: Functions) {
  }

  transform(monto: any, ...args: any[]) {
    if (monto == 0) {
      return '-';
    }

    if (monto.toString().length == 1 || monto.toString().length == 2) {
      return `${monto}.00`;
    }
    return this.funciones.format(this.funciones.setearValorDecimal(monto.toString()));
  }
}

/* @Pipe({ name: 'merge' })
export class MergePipe {
  constructor(public funciones: Functions) {
  }

  transform(arr1, arr2) {
    var arr = [];
    arr1.forEach((elt, i) => {
      arr.push({ state: elt, name: arr2[i] });
    });
  }
} */
