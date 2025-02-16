import { Directive, Input, HostListener, ElementRef, Renderer } from '@angular/core';
import { LinkNubeService } from '../services/link-nube.service';

@Directive({
    selector: '[LinkNube]'
})
export class LinkNubeDirective {
    //   @Input()
    //   hoverClass: string ='estilo';
    @Input() LinkNube: string = '';
    @Input('Ruta') Ruta:string=''; 
    ruta_real:string='';

    constructor(public el: ElementRef, private servicio: LinkNubeService) {
        el.nativeElement.setAttribute("href", "javascript:void(0);");
    }

    @HostListener('click', ['$event']) onClick(e: MouseEvent) {
        e.preventDefault();
        if(this.ruta_real==''){
            this.servicio.VisualizarArchivo(this.LinkNube, this.Ruta).subscribe((ruta: any) => {
                this.ruta_real=ruta;
                window.open(this.ruta_real, '_blank');
            });            
        }
        else{
            window.open(this.ruta_real, '_blank');
        }

    }
}
