import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { AuthService } from 'src/app/componentes/auth/auth.service';
import { AplicarTipoControl } from '../../appSettings/enumeraciones';

@Directive({
  selector: '[hasClaim]'
})
export class HasClaimDirective {
  @Input() set hasClaim(claimType: any) {
    if (this.securityService.hasClaim(claimType) == AplicarTipoControl.Visible) {
      // Add template to DOM
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else if (this.securityService.hasClaim(claimType) == AplicarTipoControl.Ocultar){
      // Remove template from DOM
      this.viewContainer.clear();
    } else if (this.securityService.hasClaim(claimType) == AplicarTipoControl.Deshabilitar){
      // remover eventos
      this.viewContainer.createEmbeddedView(this.templateRef);
    }
  }
  
  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private securityService: AuthService) { }
  
}
