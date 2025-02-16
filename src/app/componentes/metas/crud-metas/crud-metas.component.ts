import { Component, OnInit, Input, Output, EventEmitter, ViewChild, OnDestroy } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { MetasService } from 'src/app/services/metas.service';
import { FormGroup, FormBuilder, NgForm } from '@angular/forms';
import { Functions } from 'src/app/appSettings';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-crud-metas',
  templateUrl: './crud-metas.component.html',
  styleUrls: ['./crud-metas.component.css']
})
export class CrudMetasComponent implements OnInit, OnDestroy {
  ngOnDestroy(): void {
    this.Suscripciones.unsubscribe();
  }
  USUARIO_ACTUAL:string;
  ACCION: number;
  ID_PROYECTO: number;
  ListaMetas = {
    proyecto: [],
    cantidad_registro: 0
  }

  Title: string = "";
  TitleDescription:string="";
  BsModalRef_Hijo: BsModalRef;


  formAgregarMeta: FormGroup;
  lstComponentes = [];
  lastTipoIntervencion = [];
  lastSubTipoIntervencion = [];
  lstMetasRegistradas = [];
  showTipoIntervencion: boolean = false;
  showTipoSubIntervencion: boolean = false;
  showOtros: boolean = false;
  showCantidad: boolean = false;
  Suscripciones:Subscription=new Subscription();
  @ViewChild('FormularioRegistroMetas') FormularioRegistroMetas:NgForm;
  @Output() MetaRegistradaEvent = new EventEmitter<any>();
  constructor(
    private BsModalRef: BsModalRef,
    private servicio: MetasService,
    private BsModalService: BsModalService,
    private fb: FormBuilder,
    public funciones: Functions
  ) { }

  ngOnInit() {
    switch (this.ACCION) {
      case 1:
        this.Title = "Nueva meta";
        this.TitleDescription="Formulario para el registro de metas.";
        break;
      case 2:
        break;
      case 3:
        this.Title = "Metas";
        this.TitleDescription="Listado de metas.";
        this.CargarLista();
        break;
      default:
        break;
    };

    this.formAgregarMeta = this.fb.group({
      id_meta_componente: null,
      id_tipo_intervencion: null,
      id_sub_tipo_intervencion: null,
      otros: "",
      cantidad: null,
      id_unidad_medida: null,
      unidad: null
    });
    this.servicio.listarMetaComponente().subscribe(
      data => {
        this.lstComponentes = data as any;
      }
    );
      this.USUARIO_ACTUAL=sessionStorage.getItem("Usuario");
  }

  RegistrarMeta() {

    let lstTipoIntervencionMeta=[];
    if(this.formAgregarMeta.value.id_tipo_intervencion!=null){
      lstTipoIntervencionMeta.push({"id_tipo_intervencion": this.formAgregarMeta.value.id_tipo_intervencion});
    }
    if(this.formAgregarMeta.value.id_sub_tipo_intervencion!=null){
      lstTipoIntervencionMeta.push({"id_tipo_intervencion": this.formAgregarMeta.value.id_sub_tipo_intervencion});
    }

    let param = {
      "BE_Td_Ssppvd_Meta":
      {
        "id_proyecto": this.ID_PROYECTO,
        "descripcion": this.formAgregarMeta.value.otros,
        "cantidad": this.formAgregarMeta.value.cantidad,
        "usuario_creacion": this.USUARIO_ACTUAL
      },
      "lstTipoIntervencionMeta":lstTipoIntervencionMeta
    };
    this.servicio.insertarMeta(param).subscribe((data:any)=>{
      if(data>0){
        this.MetaRegistradaEvent.emit();
        this.funciones.alertaSimple("success","","Meta registrad.",true);
      }else{
        this.funciones.alertaSimple("info","","No fue posible registrar meta.",true);
      }
    });
  }

  AnularMeta(id_meta: number) {
    this.funciones.alertaRetorno("question","","¿Está seguro que desea eliminar este registro?",true,(rpta)=>{
      if(rpta.value){
        
        let param={"id_meta":id_meta, "usuario_eliminacion":this.USUARIO_ACTUAL}
        this.servicio.anularMeta(param).subscribe((data:any)=>{

          if(data){
            this.funciones.alertaSimple("info","","Meta eliminada.",true);
            this.CargarLista();
          }else{
            this.funciones.alertaSimple("info","","No fue posible eliminar este registro.",true);
          }
        });
      }
    });

  }
  Cerrar() {
    this.BsModalRef.hide();
  }
  CargarLista() {
    this.servicio.listarMeta(this.ID_PROYECTO, 100, 0).subscribe(
      (data: any) => {
        this.ListaMetas = data;
      }
    );
  }
  ModalAbrirNuevoRegistro() {
    let config = {
      initialState: {
        ACCION: 1,
        ID_PROYECTO: this.ID_PROYECTO,
        valor: null
      }
    }
    this.BsModalRef_Hijo = this.BsModalService.show(CrudMetasComponent, config);
    this.Suscripciones.add(this.BsModalRef_Hijo.content.MetaRegistradaEvent.subscribe(data=>{
      this.CargarLista();
      this.BsModalRef_Hijo.hide();
    }));
  }


  ElegirMeta(e) {
    this.lastTipoIntervencion = null;
    this.lastSubTipoIntervencion = null;
    this.showTipoIntervencion = false;
    this.showTipoSubIntervencion = false;
    this.showCantidad = false;
    this.showOtros = false;
    this.formAgregarMeta.controls['id_tipo_intervencion'].setValue(null);
    this.formAgregarMeta.controls['id_sub_tipo_intervencion'].setValue(null);

    if (typeof (e) != 'undefined') {
      this.servicio.listarTipoIntervencion(e.id_meta_componente).subscribe(
        (data: any) => {
          this.lastTipoIntervencion = data;
          if (data != null) {
            this.showTipoIntervencion = true;
            this.showOtros = false;
            this.showCantidad = false;
          }
          else {
            this.showOtros = true;
            if (e.cod_meta_componente == "C0013" || e.cod_meta_componente == "C0014") {
              this.showOtros = false;
              this.formAgregarMeta.controls['unidad'].setValue("Unidad");
              this.formAgregarMeta.controls['id_unidad_medida'].setValue(2);
            }
            this.showCantidad = true;
          }
          if (e.cod_meta_componente == "C0015") {
            this.formAgregarMeta.controls['unidad'].setValue("Unidad");
            this.formAgregarMeta.controls['id_unidad_medida'].setValue(2);
          }
        }
      );
    }
  }
  ElegirTipoIntervencion(e) {
    this.lastSubTipoIntervencion = null;
    this.formAgregarMeta.controls['id_sub_tipo_intervencion'].setValue(null);
    this.showTipoSubIntervencion = false;
    this.showCantidad = false;
    this.showOtros = false;

    if (typeof (e) != 'undefined') {
      if (e.nombre_unidad_medida != null) {
        this.formAgregarMeta.controls['unidad'].setValue(e.nombre_unidad_medida);
        this.formAgregarMeta.controls['id_unidad_medida'].setValue(e.id_unidad_medida);
      }
      if (e.subtipointervencion != null) {
        this.lastSubTipoIntervencion = e.subtipointervencion;
        this.showTipoSubIntervencion = true;
      }
      else {
        if (e.nombre.toLowerCase() == "otros") {
          this.showOtros = true;
        }
        else {
          this.showOtros = false;
          this.formAgregarMeta.patchValue({ otros: "" });
        }
        this.showCantidad = true;
      }
    }
  }
  ElegirTipoSubIntervencion(e) {
    this.showCantidad = false;
    if (typeof (e) != 'undefined') {
      this.showCantidad = true;
    }
    else {
      this.showCantidad = false;
    }
  }
  Registrar(){
    this.FormularioRegistroMetas.ngSubmit.emit();
  }
}
