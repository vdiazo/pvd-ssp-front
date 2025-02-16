import { Directive, Input, HostListener, ElementRef, Renderer } from '@angular/core';

@Directive({
    selector: '[dbutton]'
})
export class StyleButtonsDirective {
    //   @Input()
    //   hoverClass: string ='estilo';
    constructor(public el: ElementRef, private renderer: Renderer) {

        //renderer.setElementStyle(el.nativeElement, 'borderRadius', '0');
        //renderer.setElementStyle(el.nativeElement, 'fontFamily', 'Helvetica Neue, Segoe UI, Helvetica, Verdana, sans-serif');
         renderer.setElementStyle(el.nativeElement, 'fontSize', '80px');
        // renderer.setElementStyle(el.nativeElement, 'boxShadow', '0 1px 3px transparent');
        // renderer.setElementStyle(el.nativeElement, 'borderStyle', 'solid');
        // renderer.setElementStyle(el.nativeElement, 'display', 'inline-block');
        // renderer.setElementStyle(el.nativeElement, 'text-align', 'center');
        // renderer.setElementStyle(el.nativeElement, 'verticalAlign', 'middle');
        // renderer.setElementStyle(el.nativeElement, 'padding', '4px 15px 5px');
        // renderer.setElementStyle(el.nativeElement, 'fontWeight', 'normal');

        if(el.nativeElement.dataset.opcion=="botonguardar" && el.nativeElement.dataset.form=="convenios" ){
            el.nativeElement.parentNode.removeChild(el.nativeElement);
        }


        if (el.nativeElement.id == "btnExtraerInformacion") {
        } else if (el.nativeElement.id == "btnGuardar") {
            renderer.setElementClass(el.nativeElement,"btn-danger",true);
            const i = renderer.createElement(el.nativeElement, "i");
            renderer.setElementAttribute(i, 'class', 'fa fa-save');
        } else if (el.nativeElement.id == "btnRetornar") {
        } else if (el.nativeElement.id == "btnNuevoRegistro") {
            renderer.setElementClass(el.nativeElement,"btn-danger",true);
            const i = renderer.createElement(el.nativeElement, "i");
            renderer.setElementAttribute(i, 'class', 'fa fa-plus');
        } else if (el.nativeElement.id == "btnVerDetalle") {
            renderer.setElementClass(el.nativeElement,"btn-primary",true);
            const i = renderer.createElement(el.nativeElement, "i");
            renderer.setElementAttribute(i, 'class', 'fa fa-search');
        } else if (el.nativeElement.id == "btnBuscar") {
            renderer.setElementClass(el.nativeElement,"btn-primary",true);
            const i = renderer.createElement(el.nativeElement, "i");
            renderer.setElementAttribute(i, 'class', 'fa fa-search');
        } else {
            // renderer.setElementStyle(el.nativeElement, 'backgroundColor', '#ffffff');
            // renderer.setElementStyle(el.nativeElement, 'borderColor', 'none');
            // renderer.setElementStyle(el.nativeElement, 'color', '#575557');
            // const i = renderer.createElement(el.nativeElement,"i");
            
            renderer.setElementClass(el.nativeElement,"btn-secondary",true);
            // renderer.setElementAttribute(i,'class','fa fa-ban');
        }
    }
    
    @HostListener('mouseover') mouseover() {
        this.renderer.setElementStyle(this.el.nativeElement, 'cursor', 'pointer');
        //this.renderer.setElementClass(this.el.nativeElement, this.hoverClass, true);
    }

    // @HostListener('mouseout') mouseout() {
    //     this.renderer.setElementClass(this.elementRef.nativeElement, this.hoverClass, false);
    //   }
}
