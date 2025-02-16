import { Directive,ElementRef,Renderer } from '@angular/core';

@Directive({
    selector: '[dlabels]'
})
export class StyleLabelsDirective {
    constructor(el: ElementRef, renderer: Renderer){
        // renderer.setElementStyle(el.nativeElement, 'color','#575557');
        // renderer.setElementStyle(el.nativeElement, 'fontWeight','600');
        // renderer.setElementStyle(el.nativeElement, 'fontSize','12px');
      
        // renderer.setElementStyle(el.nativeElement, 'marginBottom','0');
        // renderer.setElementStyle(el.nativeElement, 'display','unset');
        // renderer.setElementStyle(el.nativeElement, 'fontFamily','Montserrat');
       
        //renderer.setElementStyle(el.nativeElement, 'paddingLeft','50px');
    }
}
