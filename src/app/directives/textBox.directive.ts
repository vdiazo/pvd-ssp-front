import { Directive,ElementRef,Renderer } from '@angular/core';

@Directive({
    selector: '[dTextBox]'
})
export class StyleTextBoxsDirective {
    constructor(el: ElementRef, renderer: Renderer){
        // renderer.setElementStyle(el.nativeElement, 'borderRadius','0.25rem');
        // renderer.setElementStyle(el.nativeElement, 'border','1px solid rgba(0, 0, 0, 0.15)');
        // renderer.setElementStyle(el.nativeElement, 'lineHeight','1.25');
        // renderer.setElementStyle(el.nativeElement, 'fontSize','13px');
        // renderer.setElementStyle(el.nativeElement, 'fontFamily','Helvetica Neue, Segoe UI, Helvetica, Verdana, sans-serif');
        // renderer.setElementStyle(el.nativeElement, 'height','calc(2.25rem + 2px)');
        
        // if(el.nativeElement.id == "codSnip")
        // {
        //     renderer.setElementClass(el.nativeElement,'estiloCajaTexto',true);
        //     //renderer.setElementAttribute(el.nativeElement, 'maxLength','5');
        // }else{
        //     renderer.setElementClass(el.nativeElement,'estiloCajaTexto',false);
        //     //renderer.setElementAttribute(el.nativeElement, 'maxLength','10');
        // }
        
        
    }
}
