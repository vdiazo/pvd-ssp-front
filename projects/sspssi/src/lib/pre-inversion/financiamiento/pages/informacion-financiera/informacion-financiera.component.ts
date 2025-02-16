import { Component, OnInit, Input } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { InformacionFinancieraSigatService } from 'projects/sspssi/src/servicios/informacion-financiera-sigat.service';
import { Functions } from 'projects/sspssi/src/appSettings/functions';
import { SeguimientoPreinversionService } from 'projects/sspssi/src/servicios/preinversion/seguimiento-preinversion.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'ssi-informacion-financiera',
  templateUrl: './informacion-financiera.component.html',
  styleUrls: ['./informacion-financiera.component.css']
})
export class InformacionFinancieraComponent implements OnInit {

  @Input() idFase: number = 0;
  formVincularSigat: FormGroup;
  bVincular: boolean = false;
  bVinculacionSigat: boolean = false;
  lstComponentesPreinversion: any[] = [];
  lstPagosEfectuadosContratoPreinversion: any[] = [];
  listaPagosEfectuados: any[] = [];

  lstContratoPreinversion: any[] = [];
  bsModal: BsModalRef;
  constructor(private fb: FormBuilder, private infoFinancieraPreInvSvc: SeguimientoPreinversionService, private infoSigatSvc: InformacionFinancieraSigatService, public funciones: Functions) { }

  ngOnInit() {
    this.createForm();
    this.listarRegistroVinculoSigat(this.idFase);
  }

  createForm() {
    const contrato = `^([0-9]{4})\-?([0-9a-zA-Z]{5})$`;
    this.formVincularSigat = this.fb.group({
      nro_contrato: [null, [Validators.required, Validators.maxLength(10), Validators.pattern(contrato)]],
      id_fase: this.idFase,
      usuario_creacion: this.usuario
    })
  }

  obtenerInformacionSigat(nroContrato: string) {
    this.bVincular = true;
    this.infoSigatSvc.obtenerInformacionFinanciera(nroContrato).subscribe((data: any) => {
      this.lstContratoPreinversion = data.Contrato;
      if (data.Pagos_efectuados.length > 0) {
        this.lstPagosEfectuadosContratoPreinversion = data.Pagos_efectuados[0];
        this.validacionPagos(this.lstPagosEfectuadosContratoPreinversion);
      }
    });
  }

  validacionPagos(tempPagos: any) {
    this.listaPagosEfectuados = [];
    if (tempPagos != null) {
      if (tempPagos.length > 1) {
        let x = 0;
        for (let i = 0; i < tempPagos.length; i++) {
          for (let j = i + 1; j < tempPagos.length; j++) {
            if (tempPagos[i].c_numliquidacion == tempPagos[j].c_numliquidacion) {
              this.listaPagosEfectuados[x] = tempPagos[i];
              this.listaPagosEfectuados[x].CP = tempPagos[j].CP;
              this.listaPagosEfectuados[x].FECPAGO = tempPagos[j].FECPAGO;
              this.listaPagosEfectuados[x].ENTFIN = tempPagos[j].ENTFIN;
              x++;
              i = j;
              break;
            }
          }
        }
      }
    }
  }

  vincularInformacionSigat() {
    const paramEnvio = { ...{}, ...this.formVincularSigat.value };
    this.infoSigatSvc.obtenerInformacionFinanciera(paramEnvio.nro_contrato).subscribe((data: any) => {
      this.lstContratoPreinversion = data.Contrato;
      if (this.lstContratoPreinversion.length == 0) {
        this.funciones.alertaSimple('info', 'Sin información', 'El contrato ingresado no contiene información', true);
      } else {
        this.funciones.alertaRetorno('question', '', `Esta a punto de vincular el contrato del proyecto "${this.lstContratoPreinversion[0].objeto}". Es correcto?`, true, (rpta: any) => {
          if (rpta.value) {
            this.infoFinancieraPreInvSvc.vincularSigatPreinversion(paramEnvio).subscribe((data: any) => {
              this.funciones.alertaSimple('success', '', this.funciones.mostrarMensaje('insertar', ''), true);
              this.limpiarForm();
              this.listarRegistroVinculoSigat(this.idFase);
            });
          }
        })
      }
    });
  }

  listarRegistroVinculoSigat(id_fase: number) {
    const param = { id_fase: id_fase };
    this.infoFinancieraPreInvSvc.listarVinculacionSigatPreinversion(param).subscribe((data: any) => {
      if (data != 0) {
        const nroContrato = data.nro_contrato;
        this.obtenerInformacionSigat(nroContrato);
      }
    });
  }

  get f() { return this.formVincularSigat.controls; }

  get usuario(): string { return sessionStorage.getItem('Usuario'); }

  limpiarForm() {
    this.formVincularSigat.reset();
    this.formVincularSigat.patchValue({
      id_fase: this.idFase,
      usuario_creacion: this.usuario
    })
  }
}
