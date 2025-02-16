import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { Functions } from 'projects/sspssi/src/appSettings/functions';
import { SeguimientoPreinversionService } from 'projects/sspssi/src/servicios/preinversion/seguimiento-preinversion.service';
import { data } from 'jquery';

@Component({
  selector: 'ssi-componente-proyecto',
  templateUrl: './componente-proyecto.component.html',
  styleUrls: ['./componente-proyecto.component.css']
})
export class ComponenteProyectoComponent implements OnInit {
  @Input() idFase: number = 0;
  formRegistroComponentes: FormGroup;
  bMostrar: boolean = false;

  lstTipoComponente: any[] = [];

  lstComponenteProyecto: any[] = [];
  listComponenteEliminados: any[] = [];

  constructor(private fb: FormBuilder, private componenteProyectoSvc: SeguimientoPreinversionService, public funciones: Functions) { }

  ngOnInit() {
    this.createForm();
    this.listarTipoComponenteCombo();
    this.listarComponentesPreinversion(this.idFase);
  }

  createForm() {
    this.formRegistroComponentes = this.fb.group({
      componentes: this.fb.array([])
    })
  }

  get f() { return this.formRegistroComponentes.controls; }

  get componente(): FormArray { return this.f.componentes as FormArray; }

  createComponente(): FormGroup {
    return this.fb.group({
      id_fase: this.idFase,
      id_componente_proyecto: 0,
      id_tipo_componente: [null, Validators.required],
      monto_componente: [null, Validators.required],
      activo: true,
      usuario_creacion: this.usuario,
      usuario_modificacion: this.usuario
    });
  }

  agregarComponente() {
    this.componente.push(this.createComponente());
  }

  removerComponente(index: number) {
    this.desactivarComponente(index);
    this.componente.removeAt(index);
  }

  desactivarComponente(index: number) {
    const temp = this.componente.at(index).value;
    temp.activo = false;
    temp.monto_componente = this.funciones.castToFloat(temp.monto_componente);
    this.listComponenteEliminados.push(temp);
  }

  listarTipoComponenteCombo() {
    this.componenteProyectoSvc.listarTipoComponentesPreinversionCombo().subscribe((data: any) => {
      if (data != null) {
        this.lstTipoComponente = data;
      }
    });
  }
  listarComponentesPreinversion(idFase) {
    const param = { id_fase: idFase };
    this.componenteProyectoSvc.listarComponentesPreinversion(param).subscribe((data: any) => {
      if (data != null) {
        this.lstComponenteProyecto = data;
        if (this.lstComponenteProyecto.length > 0) {
          this.rellenarForm(this.lstComponenteProyecto);
        } else {
          this.lstComponenteProyecto = [];
          this.componente.push(this.createComponente());
        }
      }
    });

  }

  registrarComponenteProyecto() {
    this.modificarMontos();
    const paramEnvio = { ...{}, ...this.formRegistroComponentes.value };
    if (this.listComponenteEliminados.length > 0) {
      this.listComponenteEliminados.forEach(element => {
        paramEnvio.componentes.push(element);
      });
    }
    this.componenteProyectoSvc.insertarDetalleComponentesPreinversion(paramEnvio).subscribe((data: any) => {
      if (data.resultado > 0) {
        this.funciones.alertaSimple('success', '', this.funciones.mostrarMensaje('insertar', ''), true);
        this.limpiarForm();
        this.listarComponentesPreinversion(this.idFase);
      }
    })
  }

  rellenarForm(lstComponentes: any[]) {
    while (this.componente.length !== 0) {
      this.componente.removeAt(0);
    }

    for (let i = 0; i < lstComponentes.length; i++) {
      this.componente.push(this.createComponente());
    }
    let tempo = { componentes: lstComponentes };
    this.formRegistroComponentes.patchValue(tempo);
  }

  modificarMontos(): void {
    this.componente.controls.forEach(x => {
      let value = x.value.monto_componente;
      x.value.monto_componente = this.funciones.castToFloat(value);
    });
  }

  get usuario(): string { return sessionStorage.getItem('Usuario'); }

  limpiarForm() {
    this.formRegistroComponentes.reset();
  }
}
