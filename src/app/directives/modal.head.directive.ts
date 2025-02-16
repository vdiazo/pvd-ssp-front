import { Directive,ElementRef,Renderer } from '@angular/core';

@Directive({
    selector: '[dModalHead]'
})
export class StyleModalHeadDirective {
    constructor(public el: ElementRef, private renderer: Renderer){

        // renderer.setElementStyle(el.nativeElement, 'backgroundColor','#e53935');
        // renderer.setElementStyle(el.nativeElement, 'color','#ffffff');
        // renderer.setElementStyle(el.nativeElement, 'textAlign','center');
        // renderer.setElementStyle(el.nativeElement, 'paddingTop','15px');
        // renderer.setElementStyle(el.nativeElement, 'paddingBottom','15px');
       
    }
}
