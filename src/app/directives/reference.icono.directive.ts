import { Directive,ElementRef,Renderer,HostListener } from '@angular/core';

@Directive({
    selector: '[dReferenceIcono]'
})
export class StyleReferenceIconoDirective {
    constructor(public el: ElementRef, private renderer: Renderer){
        // renderer.setElementStyle(el.nativeElement, 'color','#575557');
    }
   
    @HostListener('mouseover') mouseover() {
        // this.renderer.setElementStyle(this.el.nativeElement, 'cursor', 'pointer');
    }
}
