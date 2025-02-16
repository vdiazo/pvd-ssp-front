import { AfterViewInit, Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { Subject } from 'rxjs';
import { FacadeService } from 'src/app/patterns/facade.service';
import { LinkNubeService } from 'src/app/services/link-nube.service';

@Component({
  selector: 'app-galeria',
  templateUrl: './galeria.component.html',
  styleUrls: ['./galeria.component.css']
})
export class GaleriaComponent implements OnInit, AfterViewInit {

  listaImagenes = [];
  isChecked : boolean
  index : number = 0

  cargado:boolean=false;
  private imagenes$=new Subject();
  private lstImagenes:any[]=[];
  ngOnInit() {
    this.imagenes$.subscribe((data:any) => {
      this.lstImagenes.push(data)
      if(this.lstImagenes.length == this.listaImagenes.length){
        this.cargado=true;
      }
    });
  }

  constructor(private fs: FacadeService, public modalRef: BsModalRef, private LinkNubeService:LinkNubeService) { 
  }

  //lstImagenes:any[]=[];
  ngAfterViewInit(): void {
    this.listaImagenes.forEach((ele:any)=>{

      this.LinkNubeService.VisualizarArchivo(ele.nombre_archivo,ele.ruta).subscribe((data:any)=>{
        ele.ruta_real=data;
        this.imagenes$.next(1);
      });

      // this.clientes.push(cliente);
      // this.clientes$.next(this.clientes);
    });
  }

  log(indice) {
    let link: HTMLAnchorElement = document.getElementById("lnkArchivo") as HTMLAnchorElement;
    link.href = this.listaImagenes[indice].ruta_real;
    this.isChecked = this.listaImagenes[indice].selecciona_foto;
    this.index = indice;
  }

  checkValue(value){

    let item = this.listaImagenes[this.index];
    item.selecciona_foto = value;

    let id_accion_seguimiento_monitoreo_obra_archivo = item.id_accion_seguimiento_monitoreo_obra_archivo;
    this.fs.valorizacionService.actualizarIncluirEnAyudaMemoria(id_accion_seguimiento_monitoreo_obra_archivo, value, sessionStorage.getItem("Usuario"))
      .subscribe(
        data => {
            // 1: success
            // 0: fail
        }
      )
  }

  closeModal(){
    this.modalRef.hide();
  }
}
