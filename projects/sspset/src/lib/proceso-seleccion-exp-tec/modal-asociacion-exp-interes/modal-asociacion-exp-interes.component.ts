import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { FacadeService } from 'projects/sspset/src/lib/patterns/facade.service';
import { FiltroExpresionInteres } from 'projects/sspset/src/models/expresion-interes-filtro'; //'src/app/models/response/expresion-interes-filtro';
import { Funciones } from '../../../appSettings/funciones';
import { RegistrarExpresionInteres, PaqueteExpresionInteres } from 'projects/sspset/src/models/registrar-expresion-interes'; //'src/app/models/response/registrar-expresion-interes';
import { FormControl } from '@angular/forms';
import { elementAt } from 'rxjs/operators';
@Component({
  selector: 'app-modal-asociacion-exp-interes',
  templateUrl: './modal-asociacion-exp-interes.component.html',
  styleUrls: ['./modal-asociacion-exp-interes.component.css']
})
export class ModalAsociacionExpInteresComponent implements OnInit {

  ListaGeneral: any= [];
  IdsSeleccionados = [];
  ListaSeleccionados = [];
  itemsPerPage: number = 10;
  paginaActual: number = 1;
  numPaginasMostrar: number = 10;

  unidadesEjecutoras = [];
  lstConvocatorias = [];
  buscarMunicipalidad: FormControl = new FormControl();
  buscarConvocatoria: FormControl = new FormControl();
  nombreConvocatoria: string = "";
  nombreEntidad: string = null;
  lstConvocatoriasSeleccionadas = [];

  lstExpresionInteresAsociacion = [];
  lstExpresionInteresAsociacionTotal = [];
  totalRegistroExpresiones: number = 0;
  lstExpresionesSeleccionados = [];
  idPaquete: number;

  beRegistrarExpresionInteres: RegistrarExpresionInteres;
  nomUsuario: string = sessionStorage.getItem("usuario");
  @Output() retornoValores = new EventEmitter();
  FiltroExpresionInteres: FiltroExpresionInteres;

  numero_Pagina: number = 0;
  num_filas: number = 10;
  intIdFase: number = 0;
  idFase:number=0;
  ObjetosContratacion=[{IdObjeto:1,NombreObjeto:"Obra" },{IdObjeto:3,NombreObjeto:"Consultoría" },{IdObjeto:2,NombreObjeto:"Bienes y Servicios" }];
  ItemObjetoContratacion:number=1;
  EventInsertar: EventEmitter<any> = new EventEmitter();

  constructor(private fs: FacadeService, private fb: FormBuilder, public modalRef: BsModalRef, public funciones: Funciones) { }

  ngOnInit() {
    this.FiltroExpresionInteres = new FiltroExpresionInteres();
    this.FiltroExpresionInteres.fecha_publicacion_desde = "";
    this.FiltroExpresionInteres.fecha_publicacion_hasta = "";
    this.consultarEntidades();
    this.consultarConvocatorasFiltro();
    this.ListarContratacionesSinVincular(0);
    this.ItemObjetoContratacion=1;
  }
  seleccionExpresionInteres(e: any, registro: any) {
    if (e.target.checked) {
      this.IdsSeleccionados.push(registro);
      //llenar a la lista de IDS seleccionados
      //llenar a la lista de seleccionados en memoria (osea la guilla de abajo)
    }
    else {
      this.IdsSeleccionados = this.IdsSeleccionados.filter(x => x.identificador !== registro.identificador);
      //quitar a la lista de IDS seleccionados
      //quitar a la lista de seleccionados en memoria (osea la guilla de abajo)
    }
    this.lstConvocatoriasSeleccionadas = this.IdsSeleccionados;
  }
  paginar(lista: any, numPagina: number, numfila: number, total: number) {
    let listFor = [];
    for (let i = numPagina; i < numPagina + numfila; i++) {
      if (i < total) {
        listFor.push(lista[i]);
      } else {
        i = numPagina + numfila;
      }
    };
    return listFor as any;
  }

  asignarEstadoSeleccionados() {
    let entro = "";
    if (this.lstExpresionInteresAsociacion != null) {
      this.lstExpresionInteresAsociacion.forEach(e => {
        if (this.lstExpresionesSeleccionados != null) {
          this.lstExpresionesSeleccionados.forEach(a => {
            if (e.identificador == a.identificador) {
              e.estado = true;
              entro = "si";
            }
          });
        }
        if (entro == "") {
          e.estado = false;
        }
        entro = "";
      });
    }
  }
  grabar() {
    if (this.lstExpresionesSeleccionados != null) {
      if (this.lstExpresionesSeleccionados.length > 0) {
        this.beRegistrarExpresionInteres = new RegistrarExpresionInteres();
        this.beRegistrarExpresionInteres.id_paquete = this.idPaquete;
        this.beRegistrarExpresionInteres._BE_Td_Sircc_Paquete_Expresion_Interes = new Array<PaqueteExpresionInteres>();
        this.beRegistrarExpresionInteres._BE_Td_Sircc_Paquete_Expresion_Interes = this.lstExpresionesSeleccionados;
      } else {
        this.funciones.mensaje("info", "Debe seleccionar al menos un registro para realizar la asociación.");
      }
    } else {
      this.funciones.mensaje("info", "Debe seleccionar al menos un registro para realizar la asociación.");
    }
  }


  cambiarPagina(pagina) {
    this.paginaActual = pagina.page;
    this.ListarContratacionesSinVincular((pagina.page * this.itemsPerPage) - this.itemsPerPage);

    //this.asignarEstadoSeleccionados();
  }
  closeModal() {
    this.modalRef.hide();
  }
  ListarContratacionesSinVincular(skip: number) {
    this.fs.procesoSeleccionService.listarFaseIdentificadorExonerar(this.idFase,0, this.itemsPerPage, skip,
      
      ((this.nombreEntidad==null)?"":this.nombreEntidad)
      , this.nombreConvocatoria).subscribe((data: any) => {
      this.ListaGeneral = data;

    });
  }
  eliminarConvocatoriaSeleccionada(iSeleccionado: any) {
    this.IdsSeleccionados = this.IdsSeleccionados.filter(x => x.identificador !== iSeleccionado.identificador);
    this.lstConvocatoriasSeleccionadas = this.IdsSeleccionados;
    let intemEliminado = this.ListaGeneral.resultado.find(c => c.identificador == iSeleccionado.identificador);
    intemEliminado.estado = false;
  }

  buscarConvocatorias() {
    this.ListarContratacionesSinVincular(0);
  }
  mostrarConvocatoriaSeleccionada(pConvocatoriaSeleccionado) {
    this.nombreConvocatoria = pConvocatoriaSeleccionado;
  }
  mostrarMunicipalidadSeleccionada(pEntidadSeleccionada) {
    this.nombreEntidad = pEntidadSeleccionada;
  }

  consultarEntidades() {
    this.fs.procesoSeleccionService.listarEntidadesBusquedaConvocatorias().subscribe(
      (data: any) => {
        let response = data;
        this.unidadesEjecutoras = response;
      });
  }
  consultarConvocatorasFiltro() {
    var self = this;

    self.buscarConvocatoria.valueChanges.subscribe(
      term => {
        if (term != '') {
          if (term.length > 2) {
            self.nombreConvocatoria = term.toUpperCase();
            (<any>window).Pace.ignore(function () {
              self.fs.procesoSeleccionService.listarConvocatoriasBusquedaDescripcion(self.nombreConvocatoria).subscribe(
                data => {
                  let convocatoriaReturn;
                  convocatoriaReturn = data as any;
                  self.lstConvocatorias = convocatoriaReturn;
                });
            })
          } else {
            self.lstConvocatorias = undefined;
          }
        }
      })
  }
  limpiarAutocompleteDescripcionItem() {
    this.lstConvocatorias = undefined;
  }
  Insertar(item){
    let param=[];
      param.push({"id_fase":this.idFase, "identificador":item.identificador, "id_objeto":item.id_objeto, "usuario_creacion":sessionStorage.getItem("IdUsuario")});

    this.fs.procesoSeleccionService.insertarFaseIdentificador(param).subscribe((data:any)=>{
      this.buscarConvocatorias();
      this.EventInsertar.emit(item.id_objeto);
      this.funciones.alertaSimple("success","","",true);
    });
  }
}