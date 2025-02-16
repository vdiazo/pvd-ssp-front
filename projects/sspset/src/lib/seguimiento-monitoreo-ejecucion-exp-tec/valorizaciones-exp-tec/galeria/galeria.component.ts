import { Component, OnInit } from '@angular/core';
import { FacadeService } from '../../../patterns/facade.service';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

@Component({
  selector: 'set-galeria',
  templateUrl: './galeria.component.html',
  styleUrls: ['./galeria.component.css']
})
export class GaleriaComponent implements OnInit {

  listaImagenes = [];
  isChecked : boolean
  index : number = 0

  ngOnInit() {
  }

  constructor(private fs: FacadeService, public modalRef: BsModalRef) { 
  }

  log(indice) {
    let link: HTMLAnchorElement = document.getElementById("lnkArchivo") as HTMLAnchorElement;
    link.href = this.listaImagenes[indice].ruta_archivo;
    this.isChecked = this.listaImagenes[indice].selecciona_foto;
    this.index = indice;
  }

  checkValue(value){

    let item = this.listaImagenes[this.index];
    item.selecciona_foto = value;

    let id_accion_seguimiento_monitoreo_obra_archivo = item.id_valorizacion_ejecucion_expediente_archivo;
    this.fs.valorizacionesService.actualizarIncluirEnAyudaMemoria(id_accion_seguimiento_monitoreo_obra_archivo, value, sessionStorage.getItem("Usuario"))
      .subscribe(
        data => {
        }
      )
  }

  closeModal(){
    this.modalRef.hide();
  }

}
