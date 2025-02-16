import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { FacadeService } from 'projects/sspssi/src/patterns/facade.service';

@Component({
  selector: 'ssi-modal-valorizaciones-infobras',
  templateUrl: './modal-valorizaciones-infobras.component.html',
  styleUrls: ['./modal-valorizaciones-infobras.component.css']
})
export class ModalValorizacionesInfobrasComponent implements OnInit {

  ListaIbfoObras: any = [];
  detalleObra: any = [];
  snip: number;
  constructor(public modalRef: BsModalRef, private fs: FacadeService) { }

  ngOnInit() {
    this.listarValorizacionesInfObras(this.snip);
  }

  cerrarModal() {
    this.modalRef.hide();
  }

  listarValorizacionesInfObras(snip: number) {
    this.fs.valorizacionService.listarInfObras(snip).subscribe(
      (data: any) => {
        let rptaInfoObras = data;
        if (rptaInfoObras != null) {
          this.ListaIbfoObras = rptaInfoObras;
          if (rptaInfoObras.DetalleInfObras != null) {
            this.detalleObra = rptaInfoObras.DetalleInfObras;
          }
        }
      }
    );
  }

}
