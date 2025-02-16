import { Component, OnInit, Input } from '@angular/core';
import { FacadeService } from 'src/app/patterns/facade.service';

@Component({
  selector: 'app-manual-capacitacion',
  templateUrl: './manual-capacitacion.component.html',
  styleUrls: ['./manual-capacitacion.component.css']
})
export class ManualCapacitacionComponent implements OnInit {
  listaManualesBD;
  listaManualesDetalleBD;

  paginaActiva: number = 10;
  numPaginasMostrar: number = 0;
  tipoCapacitacion : number=1;

  totalCapacitaciones:number=0;
  paginaActual:number =1;

  @Input() bEstado:boolean;

  constructor(
    private fs: FacadeService,
  ) { }

  ngOnInit() {
    this.listaCapacitacion(this.tipoCapacitacion,this.paginaActiva,this.numPaginasMostrar);
  }

  listaCapacitacion(id,pNumPagina,pNumFilas){
    this.fs.autoCapacitacionService.listarCapacitacion(id,pNumPagina,pNumFilas).subscribe(
      data=>{
        this.listaManualesBD=data;
        this.listaManualesDetalleBD=data[0].capacitacion;
        this.totalCapacitaciones=data[0].cantidad;
      }
    )
  }

  AbirirPopUpDetalleObservacion(detalle: string) {
    let altura: number = 200;
    let anchura: number = 400;
    let y = Number((window.screen.height / 2) - (altura / 2));
    let x = Number((window.screen.width / 2) - (anchura / 2));
    let frog = window.open('', 'wildebeast', 'width=' + anchura + ',height=' + altura + ',top=' + y + ',left=' + x + ',toolbar=no,location=no,status=no,menubar=no,scrollbars=no,directories=no,resizable=no')
    let html = "<!doctype html><html lang='es'><head><title>Observaciones</title></head><body><div style='white-space: pre-wrap;'>" + detalle + "</div></body></html>"

    frog.document.open()
    frog.document.write(html)
    frog.document.close()
  }

  cambiarPagina(pagina){
    this.paginaActual = pagina.page;
    let skip = 10;
    let take = (pagina.page * 10) - 10;
    this.listaCapacitacion(this.tipoCapacitacion,skip,take);
  }

}
