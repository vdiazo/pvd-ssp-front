import { Component, OnInit, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { FacadeService } from 'projects/sspssi/src/patterns/facade.service';
import { Functions } from 'projects/sspssi/src/appSettings';

@Component({
  selector: 'ssi-asociacion-expresion-interes',
  templateUrl: './asociacion-expresion-interes.component.html',
  styleUrls: ['./asociacion-expresion-interes.component.css']
})
export class AsociacionExpresionInteresComponent implements OnInit {

  unidadesEjecutoras: any = [];
  ListaGeneral: any = [];
  convocatoriaSeleccionada: any;
  buscarConvocatoria: FormControl = new FormControl();
  formVincularProceso: FormGroup;
  lstConvocatorias: any = [];
  nombreConvocatoria = '';
  numero_Pagina: number = 0;
  num_filas: number = 10;
  numPaginasMostrar: number = 10;
  intIdFase: number = 0;
  totalRegistros: number;
  ObjetosContratacion = [{ idObjeto: 1, NombreObjeto: 'Obra' }, { idObjeto: 3, NombreObjeto: 'Consultoría' }, { idObjeto: 2, NombreObjeto: 'Bienes y Servicios' }];
  EventInsertar: EventEmitter<any> = new EventEmitter();

  constructor(private fb: FormBuilder, private bsModal: BsModalRef, private fs: FacadeService, public funciones: Functions) {

  }

  ngOnInit() {
    this.createForm();
    this.consultarEntidades();
    this.consultarConvocatoriasFiltro();
  }

  createForm() {
    this.formVincularProceso = this.fb.group({
      nombreEntidad: [null],
      nombreConvocatoria: [this.buscarConvocatoria],
    });
  }

  mostrarConvocatoriaSeleccionada(e: any) {
    this.convocatoriaSeleccionada = e.option.value;
  }

  buscarProcesoVincular() {
    this.ListarContratacionesSinVincular(0);
  }

  consultarEntidades() {
    this.fs.procesoSeleccionService.listarEntidadesBusquedaConvocatorias().subscribe(
      (data: any) => {
        let response = data;
        this.unidadesEjecutoras = response;
      });
  }

  consultarConvocatoriasFiltro() {
    var self = this;

    self.buscarConvocatoria.valueChanges.subscribe(
      term => {
        if (term != '') {
          if (term.length > 2) {
            self.nombreConvocatoria = term.toUpperCase();
            (<any>window).Pace.ignore(function () {
              self.fs.procesoSeleccionService.listarConvocatoriasBusquedaDescripcion(self.nombreConvocatoria).subscribe(
                (data: any) => {
                  let convocatoriaReturn;
                  convocatoriaReturn = data;
                  self.lstConvocatorias = convocatoriaReturn;
                });
            })
          } else {
            self.lstConvocatorias = undefined;
          }
        }
      })
  }

  ListarContratacionesSinVincular(skip: number) {
    const parametro = Object.assign({}, this.formVincularProceso.value);
    const entidad = parametro.nombreEntidad == null ? '' : parametro.nombreEntidad;
    parametro.nombreEntidad = entidad;
    this.fs.procesoSeleccionService.listarFaseIdentificadorExonerar(this.intIdFase, 0, this.num_filas, skip, parametro.nombreEntidad, parametro.nombreConvocatoria).subscribe(
      (data: any) => {
        let rptaListaGeneral = data;
        this.totalRegistros = rptaListaGeneral.cantidad;
        if (this.totalRegistros > 0) {
          this.ListaGeneral = rptaListaGeneral.resultado;
        } else {
          this.ListaGeneral = [];
        }
      },
      error => { this.funciones.alertaSimple("warning", "Registro no encontrado", "Intente con otro criterio de búsqueda", true); }
    );
  }

  registrarVincular(item) {
    let param = [];
    param.push({ "id_fase": this.intIdFase, "identificador": item.identificador, "id_objeto": item.id_objeto, "usuario_creacion": sessionStorage.getItem("Usuario") });
    this.fs.procesoSeleccionService.insertarFaseIdentificador(param).subscribe(
      (data: any) => {
        let rpta = data;
        if (rpta.estado == 1) {
          this.buscarProcesoVincular();
          this.EventInsertar.emit(item.id_objeto);
          this.funciones.alertaSimple("success", "Registro Correcto", "", true);
        }
      });
  }

  closeModal() {
    this.bsModal.hide();
  }

  limpiarAutocompleteDescripcionItem() {
    this.lstConvocatorias = undefined;
  }

  cambiarPagina(pagina) {
    this.numero_Pagina = pagina.page;
    this.ListarContratacionesSinVincular((pagina.page * this.num_filas) - this.num_filas);

  }
}
