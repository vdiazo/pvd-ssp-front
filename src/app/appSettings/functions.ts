import swal from 'sweetalert2/dist/sweetalert2.js'
import createNumberMask from '../../../node_modules/text-mask-addons/dist/createNumberMask';
import moment from 'moment';

export class Functions {

    alertaRetorno(tipo: string, titulo: string, texto: string, cancel: boolean, condicion: any) {
        swal.fire({
            title: titulo,
            type: tipo,
            html: texto,
            showCancelButton: cancel,
            allowOutsideClick: false,
            confirmButtonText:"Si",
            cancelButtonText:"No",
            focusCancel:true,
        }).then(condicion);
    }

    alertaSimple(tipo: string, titulo: string, texto: string, confirmar: boolean) {
        swal.fire({
            title: titulo,
            type: tipo,
            text: texto,
            allowOutsideClick: false,
            showConfirmButton: confirmar
        });
    }
    cerrarAlerta() {
        swal.close("close");
    }

    mostrarMensaje(tipo, nombreCampo) {
        var mensaje = "";
        if (tipo == "insertar") {
            mensaje = "Se realizó satisfactoriamente el registro.";
        } else if (tipo == "actualizar") {
            mensaje = "Se realizó satisfactoriamente la actualización.";
        } else if (tipo == "eliminacion") {
            mensaje = "Se realizó satisfactoriamente la eliminación del registro.";
        } else if (tipo == "error") {
            mensaje = "Hubo un error en el sistema. Consulte con el administrador.";
        } else if (tipo == "validación") {
            mensaje = "El dato" + nombreCampo + " es obligatorio.";
        }

        return mensaje;
    }

    IsNumberKey(event) {
        if (event.charCode >= 48 && event.charCode <= 57) {
            return true;
        }
        return false;
    }
    ObtenerFechaDescarga() {
        // var d = new Date(),
        //     month = '' + (d.getUTCMonth() + 1),
        //     day = '' + d.getUTCDate(),
        //     year = '' + d.getFullYear(),
        //     hora = '' + d.getHours(),
        //     minutos = '' + d.getMinutes(),
        //     segundos = '' + d.getSeconds();
        // if (month.length < 2) month = '0' + month;
        // if (day.length < 2) day = '0' + day;

        // return [day, month, year].join('/') + " " + [hora, minutos, segundos].join(':');
        return moment().format("DD/MM/YYYY HH:mm:ss");
    }

    obtenerFechaDescargaGuardarArchivo() {
        // var d = new Date(),
        //     month = '' + (d.getUTCMonth() + 1),
        //     day = '' + d.getUTCDate(),
        //     year = '' + d.getFullYear(),
        //     hora = '' + d.getHours(),
        //     minutos = '' + d.getMinutes(),
        //     segundos = '' + d.getSeconds();
        // if (month.length < 2) month = '0' + month;
        // if (day.length < 2) day = '0' + day;

        // return [day, month, year].join('_') + "_" + [hora, minutos, segundos].join('');
        return moment().format("DD_MM_YYYY_HHmmss");
    }

    formatDate(date) {
        var d = new Date(date),
            month = '' + (d.getUTCMonth() + 1),
            day = '' + d.getUTCDate(),
            year = d.getFullYear();
        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return [day, month, year].join('/');
    }
    formatDateAAAAMMDD(date) {
        var d = new Date(date),
            month = '' + (d.getUTCMonth() + 1),
            day = '' + d.getUTCDate(),
            year = d.getFullYear();
        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return [year, month, day].join('-');
    }

    formatDateMDY(date) {
        var d = new Date(date),
            month = '' + (d.getUTCMonth() + 1),
            day = '' + d.getUTCDate(),
            year = d.getFullYear();
        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return [month, day, year].join('/');
    }

    ConvertStringtoDate(fecha) {
        var parts = fecha.split('/');
        var mydate = new Date(parts[2], parts[1] - 1, parts[0]);
        return mydate;
    }

    ConvertStringtoDateDB(fecha) {
        var parts = fecha.split('-');
        var mydate = new Date(parts[0], parts[1] - 1, parts[2]);
        return mydate;
    }

    SumDaytoDate(fecha: Date, dias: number) {
        var fechaAumentada = new Date(fecha);
        var retorno = new Date(fechaAumentada.setDate(fechaAumentada.getDate() + dias));
        return retorno;
    }

    mensaje(tipo: string, mensaje: string) {
        // let fecha = new Date();
        // let identificador: string = 'alert' + Date.now();

        // let html = '<div class="alert alert-' + tipo + '" alert-dismissible fade" role="alert" id="' + identificador + '">';
        // html += mensaje;
        // html += '<button type="button" class="close" data-dismiss="alert" aria-label="Close">';
        // html += '<span aria-hidden="true">&times;</span>';
        // html += '</button>';
        // html += '</div>';
        // if (dom) {
        //     $(html).appendTo('#' + dom).addClass('show');
        // }
        // else {
        //     $(html).appendTo('body').addClass('show');
        // }
        // setTimeout(() => {
        //     $('#' + identificador).hide('fast', function () {
        //         $('#' + identificador).remove();
        //     })

        // }, 10000);

        this.alertaSimple(tipo, "", mensaje, true);
    }

    setearValorDecimal(input) {
        var num;
        if (input.length > 2) {
            if (!input.toString().includes(".")) {
                num = input.toString() + "00";
            } else {
                var arrMonto = input.toString().split('.');
                if (arrMonto[1].length == 1) {
                    input = input.toString() + '0';
                }
                num = input.toString().replace('.', '');
                num = num.toString().replace(/\,/g, '');
            }
        } else {
            num = input;
        }
        return num;
    }
    format(input) {
        var num = input.replace(/\./g, '');
        num = num.replace(/\,/g, '');

        if (!isNaN(num)) {
            if (num.length > 2) {
                num = num.substring(0, num.length - 2) + '.' + num.substring(num.length - 2);
            }
            input = num;
        }
        else {
            input = input.replace(/[^\d\.]*/g, '');
        }
        input = this.addCommas(input)
        var resultado = input;
        return resultado;
    }

    addCommas(nStr) {
        nStr += '';
        let x = nStr.split('.');
        let x1 = x[0];
        let x2 = x.length > 1 ? '.' + x[1] : '';
        var rgx = /(\d+)(\d{3})/;
        while (rgx.test(x1)) {
            x1 = x1.replace(rgx, '$1' + ',' + '$2');
        }
        return x1 + x2;
    }

    fixed(numero: number, decimales: number) {
        numero = Number(numero.toFixed(decimales));
        return numero;
    }

    IsFloat(event) {
        var key = window.event ? event.which : event.keyCode;
        var chark = String.fromCharCode(key);
        var tempValue = event.currentTarget.value + chark;
        if (key >= 48 && key <= 57) {
            if (this.filter(tempValue) === false) {
                return false;
            } else {
                return true;
            }
        } else {
            if (key == 8 || key == 13 || key == 0) {
                return true;
            } else if (key == 46) {
                if (this.filter(tempValue) === false) {
                    return false;
                } else {
                    return true;
                }
            } else {
                return false;
            }
        }
    }

    filter(__val__) {
        var preg = /^([0-9]+\.?[0-9]{0,2})$/;
        if (preg.test(__val__) === true) {
            return true;
        } else {
            return false;
        }
    }

    IsMenor(valor, numero: number) {
        valor === undefined ? valor = 0 : valor;
        if (valor <= numero) {
            return valor;
        } else {
            let cadena = valor.toString();
            return parseInt(cadena.slice(0, -1));
        }
    }

    castToFloat(monto: number | string): number {
        if (monto == 0 || monto == "") {
            return 0;
        }

        let valueWithReplace = monto.toString().replace(/,/g, "");

        let value = Number.parseFloat(valueWithReplace);
        return value;
    }

    numberWithCommas = (x) => {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    numberRange(valor: number, numInferior: number, numSuperior: number) {
        valor == undefined || valor == null ? valor = numInferior : valor;
        if (valor < numInferior || valor > numSuperior) {
            let valorCadena = valor.toString();
            let valorEntero: number = parseInt(valorCadena.slice(0, -1));
            return valorEntero = isNaN(valorEntero) ? numInferior : valorEntero;
        } else {
            return valor;
        }
    }

    public currencyMask = createNumberMask({
        prefix: '',
        suffix: '',
        includeThousandsSeparator: true,
        thousandsSeparatorSymbol: ',',
        allowDecimal: true,
        decimalSymbol: '.',
        decimalLimit: 2,
        integerLimit: null,
        requireDecimal: false,
        allowNegative: false,
        allowLeadingZeroes: false
    });

    public percentageMask = createNumberMask({
        prefix: '',
        suffix: '',
        includeThousandsSeparator: false,
        thousandsSeparatorSymbol: ',',
        allowDecimal: true,
        decimalSymbol: '.',
        decimalLimit: 2,
        integerLimit: null,
        requireDecimal: false,
        allowNegative: false,
        allowLeadingZeroes: false,
        maxValue: 100,
        minValue: 0
    });

    obtenerPeriodo(periodo: string): string {
        if (periodo == null || periodo == "" || periodo.length < 6) return "";

        let mes = periodo.substring(0, 2);
        let anio = periodo.substring(2, 6);
        let resultado = (mes == "01" ? "Enero" :
            mes == "02" ? "Febrero" :
                mes == "03" ? "Marzo" :
                    mes == "04" ? "Abril" :
                        mes == "05" ? "Mayo" :
                            mes == "06" ? "Junio" :
                                mes == "07" ? "Julio" :
                                    mes == "08" ? "Agosto" :
                                        mes == "09" ? "Setiembre" :
                                            mes == "10" ? "Octubre" :
                                                mes == "11" ? "Noviembre" : "Diciembre") + " " + anio;
        return resultado;
    }

    obtenerAbreviacionMes(mes: number): string {
        let resultado = (mes == 1 ? "Enero" :
            mes == 2 ? "Febrero" :
                mes == 3 ? "Marzo" :
                    mes == 4 ? "Abril" :
                        mes == 5 ? "Mayo" :
                            mes == 6 ? "Junio" :
                                mes == 7 ? "Julio" :
                                    mes == 8 ? "Agosto" :
                                        mes == 9 ? "Setiembre" :
                                            mes == 10 ? "Octubre" :
                                                mes == 11 ? "Noviembre" : "Diciembre");
        return resultado;
    }

    obtenerCorrelativoMes(mes: number): string {
        let resultado = "";
        if (mes > 9) {
            resultado = mes.toString();
        } else {
            resultado = "0" + mes.toString();
        }

        return resultado;
    }


    contarNumeroMeses(arrMatrizMeses, anio) {
        let cont = 0;
        arrMatrizMeses.forEach(element => {
            if (element.Anio == anio) {
                cont++;
            }
        });

        return cont;
    }

    obtenerMatrizDiferenciaFechas(pfechaInicio, pfechaFin) {
        let arrAnioMeses = [];
        let mesInicio = parseInt(pfechaInicio.split('/')[1]);
        let mesFin = parseInt(pfechaFin.split('/')[1]);
        let mesInicioTemporal = 1;
        let mesFinTemporal = 12;

        let anioInicio = parseInt(pfechaInicio.split('/')[2]);
        let anioFin = parseInt(pfechaFin.split('/')[2]);

        for (let i = anioInicio; i <= anioFin; i++) {
            if (i > anioInicio && i < anioFin) {
                mesInicioTemporal = 1;
                mesFinTemporal = 12;
            } else if (i == anioInicio && i == anioFin) {
                mesInicioTemporal = mesInicio;
                mesFinTemporal = mesFin;
            } else if (i == anioInicio && i < anioFin) {
                mesInicioTemporal = mesInicio;
                mesFinTemporal = 12;
            } else if (i > anioInicio && i == anioFin) {
                mesInicioTemporal = 1;
                mesFinTemporal = mesFin;
            }

            for (let j = mesInicioTemporal; j <= mesFinTemporal; j++) {
                arrAnioMeses.push({ "Anio": i, "Mes": j });
            }
        }
        return arrAnioMeses;
    }
    obtenerMatrizDiferenciaFechasGeneral(pfechaInicio, pfechaFin) {
        let arrAnioMeses = [];
        let mesInicioTemporal = 1;
        let mesFinTemporal = 12;
        for (let i = pfechaInicio; i <= pfechaFin; i++) {
            for (let j = mesInicioTemporal; j <= mesFinTemporal; j++) {
                arrAnioMeses.push({ "Anio": i, "Mes": j });
            }
        }
        return arrAnioMeses;
    }
    obtenerDiferenciaMeses(pfechaInicio, pfechaFin) {
        let mesInicio: number;
        let mesFin: number;
        let anioInicio: number;
        let anioFin: number;
        let diferenciaMeses: number;

        mesInicio = parseInt(pfechaInicio.split('/')[1]);
        mesFin = parseInt(pfechaFin.split('/')[1]);
        anioInicio = parseInt(pfechaInicio.split('/')[2]);
        anioFin = parseInt(pfechaFin.split('/')[2]);
        diferenciaMeses = (anioFin * 12 + mesFin) - (anioInicio * 12 + mesInicio)

        return diferenciaMeses + 1;
    }


    formatFullDate(date) {
        var d = new Date(date),
            month = '' + (d.getUTCMonth() + 1),
            day = '' + d.getUTCDate(),
            year = '' + d.getFullYear(),
            hora = '' + d.getHours(),
            minutos = '' + d.getMinutes(),
            segundos = '' + d.getSeconds();
        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        if (parseInt(segundos) < 10) {
            segundos = "0" + segundos;
        }
        if (parseInt(minutos) < 10) {
            minutos = "0" + minutos;
        }

        return [day, month, year].join('/') + " " + [hora, minutos, segundos].join(':');
    }

    existeHasClaim(claimType) {
        let auth = JSON.parse(sessionStorage.getItem("Componentes"));
        if (auth != null) {
            let infoClaim = auth.componente.find(c => c.nombre_componente.toLowerCase().trim() == claimType.toLowerCase().trim());
            if (infoClaim != undefined) {
                if (infoClaim.visible) {
                    return true;
                }
                else {
                    return false;
                }
            }
            else {
                return false;
            }
        }
    }
    
    fechaStringAAAAMMDDtoDDMMYYYY(fecha: String): String {
        //cuando ambos sean string
        //2019-01-01
        let partes=fecha.split("-");
        let dd = partes[2];
        let mm = partes[1];
        let yyyy = partes[0];
        return fecha = dd + '/' + mm + '/' + yyyy;
    }
    LogoBase64(): string {
        return "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";
    }
}