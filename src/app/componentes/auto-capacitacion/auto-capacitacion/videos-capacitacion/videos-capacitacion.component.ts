import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { FacadeService } from '../../../../patterns/facade.service';
import { Subject } from 'rxjs';
import { LinkNubeService } from 'src/app/services/link-nube.service';

@Component({
  selector: 'app-videos-capacitacion',
  templateUrl: './videos-capacitacion.component.html',
  styleUrls: ['./videos-capacitacion.component.css']
})
export class VideosCapacitacionComponent implements OnInit {
  bsModalRef: BsModalRef;
    
  listaCapacitacionVideos;
  listaDetalleCapacitacion:any[]=[];

  listTipoCapacitacion

  paginaActiva: number = 10;
  numPaginasMostrar: number = 0;
  tipoCapacitacion : number=2;

  cargado:boolean=false;
  private imagenes$=new Subject();
  private lstImagenes:any[]=[];


  constructor(
    private modalService: BsModalService,
    private fs:FacadeService,
    private LinkNubeService:LinkNubeService
  ) { }

  ngOnInit() {
    this.listaCapacitacion(this.tipoCapacitacion,this.paginaActiva,this.numPaginasMostrar);
    this.imagenes$.subscribe((data:any) => {
      this.lstImagenes.push(data)
      if(this.lstImagenes.length == this.listaDetalleCapacitacion.length){
        this.cargado=true;
      }
    });
  }

  rutaArchivo
  AbrirModalVerVideo(template,link):void{
    this.rutaArchivo=link;
    let config = {
      ignoreBackdropClick: false,
      class: "modal-video",
      keyboard: false,
      initialState: { 
        rutaArchivo:link,
      } 
    };

    this.bsModalRef = this.modalService.show(template, config);
  }

  listaCapacitacion(id,pNumPagina,pNumFilas){
    this.fs.autoCapacitacionService.listarCapacitacion(id,pNumPagina,pNumFilas).subscribe(
      data=>{
        this.listaCapacitacionVideos=data;
        this.listaDetalleCapacitacion=data[0].capacitacion;

        this.listaDetalleCapacitacion.forEach((ele:any)=>{
          this.LinkNubeService.VisualizarArchivo(ele.detalle_capacitacion[0].nombre_archivo,ele.detalle_capacitacion[0].ruta_archivo).subscribe((data_url:any)=>{
            ele.detalle_capacitacion[0].ruta_real=data_url;
            this.imagenes$.next(1);
          });
        });
      }
    )
  }



}
