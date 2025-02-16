import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[hasClaim]'
})
export class HasClaimDirective {

  @Input() set hasClaim(claimType: any) {
    let auth:any;
    auth = JSON.parse(sessionStorage.getItem("Componentes")).componente;
    // if (auth != null) {
    //     let infoClaim = auth.filter(c => c.nombre_componente.toLowerCase() == claimType.toLowerCase());
    //     if(infoClaim.length==1){
    //       this.viewContainer.createEmbeddedView(this.templateRef);
    //     }
    //     else{
    //       this.viewContainer.clear();
    //     }
    // }
    if (auth.length>0) {
      let infoClaim = auth.filter(c => c.nombre_componente.toLowerCase() == claimType.toLowerCase());
      if(infoClaim.length==1){
        this.viewContainer.createEmbeddedView(this.templateRef);
      }
      else{
        this.viewContainer.clear();
      }
    }else{
      this.viewContainer.clear();
    }
  }
  
  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef) { }
}
