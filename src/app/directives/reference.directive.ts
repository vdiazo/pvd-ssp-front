import { Directive,ElementRef,Renderer,HostListener } from '@angular/core';

@Directive({
    selector: '[dReference]'
})
export class StyleReferenceDirective {
    constructor(public el: ElementRef, private renderer: Renderer){
        renderer.setElementStyle(el.nativeElement, 'color','#575557');
        renderer.setElementStyle(el.nativeElement, 'textDecoration','underline');
    }
    @HostListener('mouseover') mouseover() {
        // this.renderer.setElementStyle(this.el.nativeElement, 'cursor', 'pointer');
        // this.renderer.setElementStyle(this.el.nativeElement, 'fontWeight', 'bold');
        // this.renderer.setElementStyle(this.el.nativeElement, 'fontSize', '16px');
    
    }

    @HostListener('mouseout') mouseout() {
        //  this.renderer.setElementStyle(this.el.nativeElement, 'fontWeight', 'normal');
        //  this.renderer.setElementStyle(this.el.nativeElement, 'fontSize', '14px');
    
    }
}
