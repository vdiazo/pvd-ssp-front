import { Directive,ElementRef,Renderer } from '@angular/core';

const TABLA_CABECERA_DETALLE_CLASS = 'estiloCabeceraTablaDetalle';
@Directive({
    selector: '[dTableDetalle]'
})
export class StyleTableDetalleDirective {
    constructor(public el: ElementRef, private renderer: Renderer){
        renderer.setElementClass(el.nativeElement, TABLA_CABECERA_DETALLE_CLASS,true);
    }
   
}
