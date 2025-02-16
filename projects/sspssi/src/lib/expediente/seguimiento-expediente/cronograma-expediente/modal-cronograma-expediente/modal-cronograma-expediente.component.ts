import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { CronogramaAvanceService } from 'projects/sspssi/src/servicios/expediente/cronograma-expediente/cronograma-avance.service';
import { EspecialidadComponenteService } from 'projects/sspssi/src/servicios/expediente/cronograma-expediente/especialidad-componente.service';
import { Functions } from 'projects/sspssi/src/appSettings';

@Component({
  selector: 'ssi-modal-cronograma-expediente',
  templateUrl: './modal-cronograma-expediente.component.html',
  styleUrls: ['./modal-cronograma-expediente.component.css']
})
export class ModalCronogramaExpedienteComponent implements OnInit {

  formProgramacionEntregables: FormGroup;
  programacionEntregablesList: FormArray;
  id_seguimientoMonitoreoExpediente: number;
  bEstado: boolean;
  entidadEditar: any;

  listaDocumentoAprobacion: any = [];
  listaComponentesExpediente: any = [];
  listaEspecialidadesComponente: any = [];

  listaEspecialidadSelect: any = [];
  listaEntregablesEdicion: FormArray;

  cambiarEditar = false;
  esValidoSumaPorcentajeAvanceProgramado = true;

  @Output() retornoValoresCronograma = new EventEmitter();

  constructor(private bsModal: BsModalRef, private fb: FormBuilder, private cronogramaAvanceExpedienteService: CronogramaAvanceService, private especialidadService: EspecialidadComponenteService, public funciones: Functions) {
    this.formProgramacionEntregables = this.fb.group({
      id_cronograma_expediente: [0],
      id_seguimiento_actividad: [0],
      denominacion: [null],
      num_informe: [null, [Validators.required, Validators.max(12)]],
      documento_aprobacion: [null, Validators.required],
      activo: true,
      informe: this.fb.array([]),
    });
  }

  ngOnInit() {
    this.programacionEntregablesList = this.formProgramacionEntregables.get('informe') as FormArray;
    this.listaEntregablesEdicion = new FormArray([]);
    this.listarCombosCronograma();

    if (this.entidadEditar != null) {
      this.cambiarEditar = true;
      const tempEditar = JSON.parse(JSON.stringify(this.entidadEditar));
      this.listarCombosCronogramaEdicion();
      this.listarEspecialidades()
        .then(() => {
          this.cargarInformesCronograma(tempEditar.informe);
          tempEditar.informe = this.poblarEspecialidadesEdicion(tempEditar.informe, this.listaEspecialidadesComponente);
          this.formProgramacionEntregables.patchValue(tempEditar);
        })
        .catch(error => console.error(error));
    } else {
      this.listarEspecialidades()
        .then(() => {
        })
        .catch(error => console.error(error));
    }
  }

  listarEspecialidades(): Promise<any> {
    const promise = new Promise((resolve, reject) => {
      this.especialidadService.listarEspecialidadComponenteExpediente().subscribe(
        data => {
          this.listaEspecialidadesComponente = data;
          resolve();
        }, () => {
          reject(new Error('Error de ejecución . . . :( '));
        }
      );
    });
    return promise;
  }

  get informeExpediente(): FormGroup {
    return this.fb.group({
      id_informe_expediente: '',
      num_informe: '',
      id_cronograma_expediente: '',
      activo: '',
      componente: this.fb.array([]),
      plazo_entrega: ['', Validators.required],
      porcentaje: ['', Validators.required]
    });
  }

  get componenteExpediente(): FormGroup {
    return this.fb.group({
      id_componente_expediente: '',
      id_informe_expediente: '',
      id_tipo_componente: 0,
      activo: '',
      lista_especialidad: [null, Validators.required],
    });
  }

  onKey(cantidad_informes: number) {
    if (this.programacionEntregablesList.length > 0) {
      for (let i = this.programacionEntregablesList.length - 1; i >= 0; i--) {
        this.removerInformeExpediente(i);
      }
    }
    if (cantidad_informes > 0 && cantidad_informes <= 12) {
      for (let i = 0; i < cantidad_informes; i++) {
        this.agregarInformeExpediente();
      }
    }
  }

  validarSumaPorcentajes() {
    let informes: FormArray = this.formProgramacionEntregables.get('informe') as FormArray;
    let sumaTotal = 0;
    informes.controls.forEach(x => {
      let valueAvance: number = Number.parseFloat(x.value.porcentaje);
      sumaTotal += valueAvance;
    });

    if (sumaTotal > 100) {
      this.esValidoSumaPorcentajeAvanceProgramado = false;
      this.funciones.mensaje('info', 'La suma del avance programado no puede ser mayor a 100');
      return;
    } else {
      this.esValidoSumaPorcentajeAvanceProgramado = true;
    }
  }

  registrarCronogramaExpediente() {
    const cronogramaEnvio = Object.assign({}, this.formProgramacionEntregables.value);

    if (this.cambiarEditar) {
      // modificar registro
      cronogramaEnvio.usuario_modificacion = sessionStorage.getItem('Usuario');
      const informeModificado = this.poblarEspecialidades(cronogramaEnvio.informe, this.cambiarEditar);
      cronogramaEnvio.informe = informeModificado;
      this.cronogramaAvanceExpedienteService.modificarCronogramaExpediente(cronogramaEnvio).subscribe(
        rpta => {
          if (rpta > 0) {
            this.funciones.mensaje('success', this.funciones.mostrarMensaje('actualizar', ''));
            this.retornoValoresCronograma.emit(this.id_seguimientoMonitoreoExpediente);
            this.closeModal();
          } else {
            this.funciones.mensaje('error', this.funciones.mostrarMensaje('error', ''));
          }
        },
        error => this.funciones.mensaje('error', this.funciones.mostrarMensaje('error', ''))
      );
    } else {
      // nuevo registro
      cronogramaEnvio.id_seguimiento_actividad = cronogramaEnvio.documento_aprobacion;
      cronogramaEnvio.usuario_creacion = sessionStorage.getItem('Usuario');
      const informeModificado = this.poblarEspecialidades(cronogramaEnvio.informe, this.cambiarEditar);
      cronogramaEnvio.informe = informeModificado;
      this.cronogramaAvanceExpedienteService.insertarCronogramaExpediente(cronogramaEnvio).subscribe(
        rpta => {
          if (rpta > 0) {
            this.funciones.mensaje('success', this.funciones.mostrarMensaje('insertar', ''));
            this.retornoValoresCronograma.emit(this.id_seguimientoMonitoreoExpediente);
            this.closeModal();
          } else {
            this.funciones.mensaje('error', this.funciones.mostrarMensaje('error', ''));
          }
        },
        error => this.funciones.mensaje('error', this.funciones.mostrarMensaje('error', ''))
      );
    }
  }

  listarCombosCronograma() {
    this.cronogramaAvanceExpedienteService.listarTipoDocumentoAprobCronogramaExpediente(this.id_seguimientoMonitoreoExpediente).subscribe(
      data => {
        this.listaDocumentoAprobacion = data;
      }
    );
    this.cronogramaAvanceExpedienteService.listarTipoComponenteExpediente(this.id_seguimientoMonitoreoExpediente).subscribe(
      data => {
        this.listaComponentesExpediente = data;
      }
    );
  }

  listarCombosCronogramaEdicion() {
    this.cronogramaAvanceExpedienteService.listarTipoDocumentoAprobCronogramaExpedienteMod(this.id_seguimientoMonitoreoExpediente).subscribe(
      data => {
        this.listaDocumentoAprobacion = data;
      }
    );
  }

  closeModal() {
    this.bsModal.hide();
  }

  agregarInformeExpediente() {
    this.programacionEntregablesList.push(this.createInformeCronogramaExpediente());
  }

  removerInformeExpediente(index: number) {
    this.programacionEntregablesList.removeAt(index);
  }

  createInformeCronogramaExpediente(): FormGroup {
    const nro_informe = this.programacionEntregablesList.length === 0 ? 1 : this.programacionEntregablesList.length + 1;
    return this.fb.group({
      id_informe_expediente: [0],
      num_informe: [nro_informe],
      id_cronograma_expediente: [0],
      activo: [true],
      componente: this.fb.array([this.createComponenteExpediente()]),
      plazo_entrega: ['', Validators.required],
      porcentaje: ['', Validators.required]
    });
  }

  createComponenteExpediente(): FormGroup {
    return this.fb.group({
      id_componente_expediente: [0],
      id_informe_expediente: [0],
      id_tipo_componente: [null, Validators.required],
      lista_especialidad: [null, Validators.required],
      activo: [true],
    });
  }

  agregarComponenteExpediente(index: number) {
    const listaComponenteExpediente = this.programacionEntregablesList.at(index).get('componente') as FormArray;
    listaComponenteExpediente.push(this.createComponenteExpediente());
  }

  removerComponenteExpediente(index: number, ij: number) {
    const listaComponenteExpediente = this.programacionEntregablesList.at(index).get('componente') as FormArray;
    if (listaComponenteExpediente.at(ij).get('id_componente_expediente').value > 0) {
      listaComponenteExpediente.at(ij).patchValue({
        activo: false
      });
    } else {
      listaComponenteExpediente.removeAt(ij);
    }
  }

  cargarInformesCronograma(informesExpediente: any) {
    if (informesExpediente.length > 0) {
      for (let index = 0; index < informesExpediente.length; index++) {
        const listaInformeEdicion = this.formProgramacionEntregables.get('informe') as FormArray;
        listaInformeEdicion.push(this.informeExpediente);
        const informe = informesExpediente[index];
        for (let ij = 0; ij < informe.componente.length; ij++) {
          const listaComponenteEdicion = listaInformeEdicion.at(index).get('componente') as FormArray;
          listaComponenteEdicion.push(this.componenteExpediente);
        }
      }
    }
  }

  poblarEspecialidades(informesExpediente: any, editar: boolean) {
    if (editar) {
      // modificar cronograma
      let listaEspecialidadEdicion: any = [];
      for (let index = 0; index < this.entidadEditar.informe.length; index++) {
        const informe = this.entidadEditar.informe[index];
        for (let ij = 0; ij < informe.componente.length; ij++) {
          const componente = informe.componente[ij];
          for (let k = 0; k < componente.lista_especialidad.length; k++) {
            const especialidad = componente.lista_especialidad;
            listaEspecialidadEdicion.push(especialidad[k]);
          }
        }
      }

      if (informesExpediente.length > 0) {
        let listaEspecialidadCambio = JSON.parse(JSON.stringify(listaEspecialidadEdicion));
        for (let index = 0; index < informesExpediente.length; index++) {
          let informe = informesExpediente[index];
          for (let ij = 0; ij < informe.componente.length; ij++) {
            let componente = informe.componente[ij];
            let listaEspecialidades: any = [];
            for (let k = 0; k < componente.lista_especialidad.length; k++) {
              let especialidad = componente.lista_especialidad;
              especialidad.forEach(especialidadEditar => {
                let encontro = false;
                for (let l = 0; l < listaEspecialidadEdicion.length; l++) {
                  let especialidadEdicion = listaEspecialidadEdicion[l];
                  if (especialidadEdicion.id_especialidad == especialidadEditar && especialidadEdicion.id_componente_expediente == componente.id_componente_expediente) {
                    listaEspecialidades.push(especialidadEdicion);
                    encontro = true;
                    delete listaEspecialidadCambio[l];
                    break;
                  }
                }
                if (!encontro) {
                  this.listaEspecialidadesComponente.forEach(detalleElemento => {
                    if (especialidadEditar == detalleElemento.id_especialidad) {
                      const temp = {
                        id_tipo_componente_especialidad: 0,
                        id_componente_expediente: componente.id_componente_expediente,
                        id_tipo_componente: componente.id_tipo_componente,
                        id_especialidad: detalleElemento.id_especialidad,
                        nombre_especialidad: detalleElemento.nombre_especialidad,
                        activo: true,
                      };
                      listaEspecialidades.push(temp);
                    }
                  });
                }
              });
              componente.lista_especialidad = listaEspecialidades;
            }
          }
        }
        let result = listaEspecialidadCambio.filter(cambio => cambio != null);

        if (result.length > 0) {
          for (let index = 0; index < informesExpediente.length; index++) {
            const informe = informesExpediente[index];
            for (let ij = 0; ij < informe.componente.length; ij++) {
              const componente = informe.componente[ij];
              const tempEspecialidad = JSON.parse(JSON.stringify(componente.lista_especialidad));
              result.forEach(element => {
                if (element.id_componente_expediente == componente.id_componente_expediente && element.id_tipo_componente_expediente == componente.id_tipo_componente_expediente) {
                  element.activo = false;
                  tempEspecialidad.push(element);
                }
              });
              componente.lista_especialidad = tempEspecialidad;
            }
          }
        }
      }
    } else {
      // registrar nuevo cronograma
      if (informesExpediente.length > 0) {
        for (let index = 0; index < informesExpediente.length; index++) {
          const informe = informesExpediente[index];
          for (let ij = 0; ij < informe.componente.length; ij++) {
            const componente = informe.componente[ij];
            const listaEspecialidades: any = [];
            for (let k = 0; k < componente.lista_especialidad.length; k++) {
              const especialidad = componente.lista_especialidad;
              especialidad.forEach(element => {
                this.listaEspecialidadesComponente.forEach(detalleElemento => {
                  if (element == detalleElemento.id_especialidad) {
                    const temp = {
                      id_tipo_componente_especialidad: 0,
                      id_componente_expediente: componente.id_componente_expediente,
                      id_tipo_componente: componente.id_tipo_componente,
                      id_especialidad: detalleElemento.id_especialidad,
                      nombre_especialidad: detalleElemento.nombre_especialidad,
                      activo: true,
                    };
                    listaEspecialidades.push(temp);
                  }
                });
              });
              componente.lista_especialidad = listaEspecialidades;
            }
          }
        }
      }
    }
    return informesExpediente;
  }

  poblarEspecialidadesEdicion(informesExpediente: any[], listaEspecialidadesBD: any[]) {
    if (informesExpediente.length > 0) {
      for (let index = 0; index < informesExpediente.length; index++) {
        const informe = informesExpediente[index];
        for (let ij = 0; ij < informe.componente.length; ij++) {
          const componente = informe.componente[ij];
          const listaEspecialidades: any = [];
          for (let k = 0; k < componente.lista_especialidad.length; k++) {
            const especialidad = componente.lista_especialidad;
            especialidad.forEach(element => {
              listaEspecialidadesBD.forEach(detalleElemento => {
                if (element.id_especialidad == detalleElemento.id_especialidad) {
                  listaEspecialidades.push(detalleElemento.id_especialidad);
                }
              });
            });
            componente.lista_especialidad = listaEspecialidades;
          }
        }
      }
    }
    return informesExpediente;
  }
}
