import { Directive,ElementRef,Renderer } from '@angular/core';

@Directive({
    selector: '[dTitles]'
})
export class StyleTitlesDirective {
    constructor(el: ElementRef, renderer: Renderer){
        // renderer.setElementStyle(el.nativeElement, 'fontSize','30px');
        // renderer.setElementStyle(el.nativeElement, 'lineHeight','35.88px');
        // renderer.setElementStyle(el.nativeElement, 'fontWeight','500');
        // renderer.setElementStyle(el.nativeElement, 'padding','30px 0');
        // renderer.setElementStyle(el.nativeElement, 'marginBottom','0');
        // renderer.setElementStyle(el.nativeElement, 'color','#ffffff');
        // renderer.setElementStyle(el.nativeElement, 'fontFamily','Montserrat, cursive');
        

    }
}
