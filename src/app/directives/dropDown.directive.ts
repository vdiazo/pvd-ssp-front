import { Directive,ElementRef,Renderer } from '@angular/core';

@Directive({
    selector: '[ddropDown]'
})
export class StyleDropDownsDirective {
    constructor(el: ElementRef, renderer: Renderer){
        // renderer.setElementStyle(el.nativeElement, 'border','1px solid rgba(0, 0, 0, 0.15)');
        // renderer.setElementStyle(el.nativeElement, 'borderRadius','0.25rem');
        // renderer.setElementStyle(el.nativeElement, 'fontSize','14px');
        // renderer.setElementStyle(el.nativeElement, 'lineHeight','1.25');
        // renderer.setElementStyle(el.nativeElement, 'padding','7px 9px');
        // renderer.setElementStyle(el.nativeElement, 'fontFamily','Helvetica Neue, Segoe UI, Helvetica, Verdana, sans-serif');
    
    }
}
