import { Component, OnInit, Input } from '@angular/core';
import { FacadeService } from 'src/app/patterns/facade.service';
import { VerResultadosComponent } from '../ver-resultados/ver-resultados.component';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-fase-identificador',
  templateUrl: './fase-identificador.component.html',
  styleUrls: ['./fase-identificador.component.css']
})
export class FaseIdentificadorComponent implements OnInit {

  @Input() IdFase:number;
  @Input() IdObjecto:number;
  @Input() IdProyecto:number;
  @Input() IdTramo:number;
  @Input() NombreMunicipalidad:string="";
  DataListado:any={
    resultado:[],
    cantidad:0
  };
  BsModalResultado:BsModalRef;
  constructor(private fs:FacadeService, private modalService:BsModalService) { }

  ngOnInit() {
    this.CargarListado(0);
  }
  CargarListado(skip:number=0){
    // this.fs.procesoSeleccionService.listarFaseIdentificador(this.IdFase,this.IdObjecto,10,0).subscribe((data:any)=>{
    //   this.DataListado=data;
    // });
  }
  openModalVerResultados(model) {



    model.accion="EE";
    model.comentario=model.descripcion_item;
    model.correspondeproyecto= true;
    model.descripcion=model.descripcion_item;
    model.estado_proceso=model.estado_item;
    model.tipo=this.IdObjecto;
    model.id_fase=this.IdFase;
    model.id_proceso_seleccion_obra=0;
    model.mostrar_control= "L";
    model.fecha_modificacion=null;
    model.snip=model.codigo_snip;
    model.id_tipo_fase= "4"

    model.nombre_municipalidad=this.NombreMunicipalidad;
    model.idTramo= this.IdTramo;
    model.id_proyecto= this.IdProyecto;


    let config = {
      ignoreBackdropClick: true,
      keyboard: false,
      initialState: {
        modelVerResultados: model,nom_muni: model.nombre_municipalidad
      }
    };
    this.BsModalResultado = this.modalService.show(VerResultadosComponent, config);
  }
  Anular(id_fase_identificador:number){
    let param=
      {"id_fase_identificador":id_fase_identificador, "usuario_eliminacion":"dochoa"}
    
    this.fs.procesoSeleccionService.anularFaseIdentificador(param).subscribe(
      (data:any)=>{
        this.CargarListado(0);
      }
    );
  }
  Refrescar(IdObjetoContratacion:number=1){
    this.IdObjecto=IdObjetoContratacion;
    this.CargarListado(0);
  }
}
