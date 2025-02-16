import { Directive,ElementRef,Renderer } from '@angular/core';

@Directive({
    selector: '[dlabelsRead]'
})
export class StyleLabelsReadDirective {
    constructor(el: ElementRef, renderer: Renderer){
    //    renderer.setElementStyle(el.nativeElement, 'fontSize','15px');
    //    renderer.setElementStyle(el.nativeElement, 'fontFamily','Helvetica Neue, Segoe UI, Helvetica, Verdana, sans-serif');
    //    renderer.setElementStyle(el.nativeElement, 'fontWeight','430');
    //    renderer.setElementStyle(el.nativeElement, 'display','unset');
    
    }
}
