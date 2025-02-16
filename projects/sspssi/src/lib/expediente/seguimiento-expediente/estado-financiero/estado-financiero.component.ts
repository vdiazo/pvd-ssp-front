import { Component, OnInit } from '@angular/core';
import { Functions } from 'projects/sspssi/src/appSettings';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'ssi-estado-financiero',
  templateUrl: './estado-financiero.component.html',
  styleUrls: ['./estado-financiero.component.css']
})
export class EstadoFinancieroComponent implements OnInit {

  estadoFinancieroEnvio: any;
  fechaConsulta: Date | string;
  datosContrato: any = [];
  detalleMontoContrato: any = [];
  resumenAdicionalDeductivo: any = [];
  resumenPagosEfectuados: any = [];
  listaFianzas: any = [];
  detalleListaFianzas: any = [];
  amortizacionAdelanto: any = [];
  listadoAmortizacionAdelanto: any = [];
  listaTempPagosEfectuados: any = [];
  listaPagosEfectuados: any = [];
  ejecucionPorFuente: any = [];
  listadoEjecucionPorFuente: any = [];
  listaAdicionalDeductivo: any = [];
  detalleListaAdicionalDeductivo: any = [];
  totalMontoContrato: any = [];
  totalDetallePago: any = [];
  totalResumenPago: any;
  datosProyecto: any;
  seguimiento: any;
  actual: any;
  fecha: Date = new Date();
  constructor(public funciones: Functions, private bsModalRef: BsModalRef) {

  }

  ngOnInit() {
    if (this.estadoFinancieroEnvio != null) {
      this.cargarInformacionExpediente();
      this.fechaConsulta = this.funciones.formatFullDate(new Date());
    }
    this.actual = `${this.fecha.getDate()}/${(this.fecha.getMonth() + 1)}/${this.fecha.getFullYear()}`;
  }

  imprimir(pdf) {
    pdf.saveAs(`Estado_Economico${this.actual}.pdf`);
  }
  cargarInformacionExpediente() {
    this.datosContrato = this.estadoFinancieroEnvio.Contrato != [] ? this.estadoFinancieroEnvio.Contrato[0] : [];
    this.resumenAdicionalDeductivo = this.estadoFinancieroEnvio.Resumen_adicionales != [] ? this.estadoFinancieroEnvio.Resumen_adicionales[0] : [];
    this.resumenPagosEfectuados = this.estadoFinancieroEnvio.Resumen_pagos != [] ? this.estadoFinancieroEnvio.Resumen_pagos[0] : [];
    this.listaFianzas = this.estadoFinancieroEnvio.Fianzas != [] ? this.estadoFinancieroEnvio.Fianzas[0] : [];
    this.amortizacionAdelanto = this.estadoFinancieroEnvio.Amortizacion_adelantos != [] ? this.estadoFinancieroEnvio.Amortizacion_adelantos[0] : [];
    this.listaTempPagosEfectuados = this.estadoFinancieroEnvio.Pagos_efectuados != [] ? this.estadoFinancieroEnvio.Pagos_efectuados[0] : [];
    this.ejecucionPorFuente = this.estadoFinancieroEnvio.Ejec_por_Fte != [] ? this.estadoFinancieroEnvio.Ejec_por_Fte[0] : [];
    this.listaAdicionalDeductivo = this.estadoFinancieroEnvio.Adicionales != [] ? this.estadoFinancieroEnvio.Adicionales[0] : [];
    this.validacionPagos(this.listaTempPagosEfectuados);
    this.validarFechasPagos(this.listaPagosEfectuados);
    this.acumularTotalPagos(this.listaPagosEfectuados);
    this.validarMontoContrato(this.datosContrato, this.resumenAdicionalDeductivo);
    this.acumularTotalMontoContrato(this.detalleMontoContrato);
    this.validarResumenSaldo(this.resumenPagosEfectuados);
    this.validarRelacionAdicional(this.listaAdicionalDeductivo);
    this.validarRelacionFianzas(this.listaFianzas);
    this.validarRelacionAmortizacionAdelanto(this.amortizacionAdelanto);
    this.validarEjecucionPorFuente(this.ejecucionPorFuente);
  }

  validarFechasPagos(arrayPagos: any) {
    arrayPagos.forEach(element => {
      const temp1: string = element.d_fecemision;
      element.d_fecemision = temp1.substring(0, 10);
      const temp2: string = element.FECPAGO;
      element.FECPAGO = temp2.substring(0, 10);

      const tmp3 = element.CP;
      element.CP = tmp3.trim();

      const tmp4 = element.ENTFIN;
      element.ENTFIN = tmp4.trim();
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

  validarMontoContrato(detalleContrato: any, detalleAdicional: any) {
    this.detalleMontoContrato = [];
    /* const temp = {
      tipo: 'Inicial',
      subTotal: detalleContrato.n_vventa_sol,
      igv: detalleContrato.n_IGV_sol,
      total: detalleContrato.n_total_sol,
    };
    this.detalleMontoContrato.push(temp); */

    if (detalleAdicional != null) {
      if (detalleAdicional.length > 1) {
        detalleAdicional.forEach(element => {
          const temp1 = {
            tipo: element.tipo,
            subTotal: element.venta,
            igv: element.igv,
            total: element.total,
          };
          this.detalleMontoContrato.push(temp1);
        });
      } else {
        if (detalleAdicional.tipo != '') {
          const temp1 = {
            tipo: detalleAdicional.tipo,
            subTotal: detalleAdicional.venta,
            igv: detalleAdicional.igv,
            total: detalleAdicional.total,
          };
          this.detalleMontoContrato.push(temp1);
        }
      }
    }
  }

  acumularTotalMontoContrato(detalleAcumContrato: any) {
    this.totalMontoContrato = [];
    let subTotal = 0;
    let igv = 0;
    let total = 0;

    if (detalleAcumContrato.length > 0) {
      detalleAcumContrato.forEach(element => {
        if (element.tipo.toUpperCase() == 'DEDUCTIVO') {
          subTotal -= element.subTotal;
          igv -= element.igv;
          total -= element.total;
        } else {
          subTotal += element.subTotal;
          igv += element.igv;
          total += element.total;
        }
      });
      const temp2 = {
        acumuladoSub: parseFloat(subTotal.toFixed(2)),
        acumuladoIgv: parseFloat(igv.toFixed(2)),
        acumuladoTotal: parseFloat(total.toFixed(2)),
      };
      this.totalMontoContrato.push(temp2);
    }
  }

  acumularTotalPagos(detallePagos: any) {
    this.totalDetallePago = [];
    let importe = 0;
    let adelanto = 0;
    let valBruta = 0;
    let amortizacion = 0;
    let netoPagar = 0;

    if (detallePagos.length > 0) {
      detallePagos.forEach(element => {
        importe += element.COMPROMISO;
        adelanto += element.ADELANTO;
        valBruta += element.VALBRUTA;
        amortizacion += element.AMORTIZACION;
        netoPagar += element.NETOPAGAR;
      });
      const temp = {
        acumuladoImporte: parseFloat(importe.toFixed(2)),
        acumuladoAdelanto: parseFloat(adelanto.toFixed(2)),
        acumuladoValBruta: parseFloat(valBruta.toFixed(2)),
        acumuladoAmortizacion: parseFloat(amortizacion.toFixed(2)),
        acumuladoNetoPagar: parseFloat(netoPagar.toFixed(2)),
      };
      this.totalDetallePago.push(temp);
    }
  }

  validarResumenSaldo(resumenPagos: any) {
    if (resumenPagos != '') {
      let avance = (resumenPagos.TOTALPAGADO / resumenPagos.TOTAL) * 100;
      avance = parseFloat(avance.toFixed(2));
      let temp = {
        avanceFinanciero: avance,
        totalPagado: resumenPagos.TOTALPAGADO,
        saldoPagar: resumenPagos.SALDO,
        saldoAmortizacion: resumenPagos.AMORTIZADO,
      };
      this.totalResumenPago = temp;
    }
  }

  validarRelacionAdicional(relacionAdicionalDeductivo: any) {
    this.detalleListaAdicionalDeductivo = [];
    if (relacionAdicionalDeductivo != null) {
      if (relacionAdicionalDeductivo.length > 1) {
        relacionAdicionalDeductivo.forEach(element => {
          this.detalleListaAdicionalDeductivo.push(element);
        });
      } else {
        this.detalleListaAdicionalDeductivo.push(relacionAdicionalDeductivo);
      }

      this.detalleListaAdicionalDeductivo.forEach(element => {
        const temp = element.d_fecresolucion;
        element.d_fecresolucion = temp.substring(0, 10);
        const temp1 = element.tipo;
        element.tipo = temp1.substring(0, 3);
      });
    }
  }

  validarRelacionFianzas(listadofianzas: any) {
    this.detalleListaFianzas = [];
    if (listadofianzas != null) {
      if (listadofianzas.length > 1) {
        listadofianzas.forEach(element => {
          this.detalleListaFianzas.push(element);
        });
      } else {
        this.detalleListaFianzas.push(listadofianzas);
      }

      this.detalleListaFianzas.forEach(element => {
        const temp = element.d_fecvcmto;
        element.d_fecvcmto = temp.substring(0, 10);
        const temp1 = element.c_numcarta;
        element.c_numcarta = temp1.trim();
      });
    }
  }

  validarRelacionAmortizacionAdelanto(listaAmortizacionAdelanto: any) {
    this.listadoAmortizacionAdelanto = [];
    if (listaAmortizacionAdelanto != null) {
      if (listaAmortizacionAdelanto.length > 1) {
        listaAmortizacionAdelanto.forEach(element => {
          this.listadoAmortizacionAdelanto.push(element);
        });
      } else {
        this.listadoAmortizacionAdelanto.push(listaAmortizacionAdelanto);
      }
    }
  }

  validarEjecucionPorFuente(listaEjecucionPorFuente: any) {
    this.listadoEjecucionPorFuente = [];
    if (listaEjecucionPorFuente != null) {
      if (listaEjecucionPorFuente.length > 1) {
        listaEjecucionPorFuente.forEach(element => {
          this.listadoEjecucionPorFuente.push(element);
        });
      } else {
        this.listadoEjecucionPorFuente.push(listaEjecucionPorFuente);
      }
    }
  }
  closeModal() {
    this.bsModalRef.hide();
  }
}
