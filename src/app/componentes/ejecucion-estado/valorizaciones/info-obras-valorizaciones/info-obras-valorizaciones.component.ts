import { Component, OnInit,Output,EventEmitter } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { FacadeService } from 'src/app/patterns/facade.service';

@Component({
  selector: 'app-info-obras-valorizaciones',
  templateUrl: './info-obras-valorizaciones.component.html',
  styleUrls: ['./info-obras-valorizaciones.component.css']
})
export class InfoObrasValorizacionesComponent implements OnInit {
  ListaIbfoObras:any;
  detalleObra;
  snip:number;

  @Output() retornoValores = new EventEmitter();

  constructor(
    private fs: FacadeService,
    public modalRef: BsModalRef) { }

  ngOnInit() {
    this.listarInfObras();

  }
  listarInfObras(){
    this.fs.valorizacionService.listarInfObras(this.snip).subscribe(
      data=>{
        let ObraReturn;
        ObraReturn = data as any;
        if(ObraReturn != null){
          this.ListaIbfoObras=ObraReturn;
          if(ObraReturn.DetalleInfObras != null){
            this.detalleObra=ObraReturn.DetalleInfObras;
          }
        }
      }
    ) 
  }

  cerrarModal() {
    this.modalRef.hide();
  }

}
