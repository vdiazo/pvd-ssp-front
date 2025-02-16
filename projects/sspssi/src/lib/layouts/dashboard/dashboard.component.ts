import { Component, OnInit } from '@angular/core';
import 'leaflet';
import { HttpClient } from '@angular/common/http';
import { Proyecto } from 'projects/sspssi/src/models/request/proyecto-request';
import { FacadeService } from 'projects/sspssi/src/patterns/facade.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Functions } from 'projects/sspssi/src/appSettings';
declare let L;

@Component({
  selector: 'ssi-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  public beProyecto: Proyecto = new Proyecto();
  public modalRef: BsModalRef;
  totalProyectos = 0;

  totalPreinversion: number;
  totalExpediente: number;
  totalObras: number;

  costoTotalPim: number;
  costoTotalDevengado = 0;

  tipoInversion: any = [];
  tipoInversionGrafico: any = [];
  estadoSituacional: any = [];
  paletteCustomize: any = [];

  listProyectos: any = [];
  listProyectosBusqueda: any = [];
  listProyectosDepartamento: any = [];
  listaProyectoCosto: any = [];

  dataMapa: any = [];

  map: any;
  DataShape: any;
  Lgeojson: any;
  MapaJson: any;
  DepartamentoActual = '00';
  NombreDepartamento = '';

  tipoInfraestructuraGrafico: any = [];

  fechaActual;
  EstadoBusqueda = false;
  listRegiones = [];
  codDepa: string = null;
  proyectoSeleccionado: any;

  constructor(private http: HttpClient, private modalService: BsModalService, private fs: FacadeService, public funciones: Functions) { }

  ngOnInit() {
    this.fechaActual = Date.now();
    this.generarmapa();
  }

  customizeLabel(arg) {
    return `${arg.valueText}\n(${arg.percentText})`;
  }

  customizeLabel1(point) {
    return `${point.argumentText}: ${point.valueText}`;
  }

  customizeTooltip(arg) {
    return { text: arg.seriesName.toUpperCase() };
  }

  customizeTooltip1(arg) {
    return { text: arg.argumentText.toUpperCase() };
  }

  pointClickHandler(arg) {
    arg.target.select();
  }

  generarmapa() {
    this.map = L.map('map').setView([18.35, -81.33], 5);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 19
    }).addTo(this.map);
    this.CargarShapeDB();
  }

  CargarShapeDB() {
    const path = './assets/mapa/00.json';
    this.http.get(path).subscribe((data: any) => {
      this.MapaJson = data;
      this.DataShape = JSON.parse(JSON.stringify(this.MapaJson));
      // this.AddGeojson();
      this.Procesar();
    });
  }

  RemoveGeojson() {
    const map = this.map;
    map.eachLayer(function (layer) {
      if (layer.hasOwnProperty('myTag')) {
        if (layer.myTag && layer.myTag === 'myGeoJSON') {
          map.removeLayer(layer);
        }
      }
    });
  }

  Procesar(CodDepartamentoActual?: any) {
    if (CodDepartamentoActual != undefined) {
      this.DepartamentoActual = CodDepartamentoActual;
    }
    if (this.DepartamentoActual == '00') {
      // this.router.navigate(['/ssi/dashboard']);
      this.NombreDepartamento = '';
      this.DataShape = JSON.parse(JSON.stringify(this.MapaJson));
      this.AddGeojson();
      this.reiniciarValores();
      this.ConsultaPrincipal('');
    }
    if (this.DepartamentoActual != '00') {
      let shapeJson;
      shapeJson = this.MapaJson.features.filter(x => x.properties.iddpto == this.DepartamentoActual);
      this.NombreDepartamento = this.MapaJson.features.filter(x => x.properties.iddpto == this.DepartamentoActual)[0].properties.nombdep;
      this.DataShape = JSON.parse(JSON.stringify(shapeJson));
      this.AddGeojson();
      this.reiniciarValores();
      this.ConsultaPrincipal(this.DepartamentoActual);
    }
  }

  getColor(idDepartamento: any) {
    let d = idDepartamento == '' ? 0 : parseInt(idDepartamento);
    return d > 20 ? '#084594' :
      d > 15 ? '#2171b5' :
        d > 10 ? '#4292c6' :
          d > 5 ? '#6baed6' :
            d > 3 ? '#9ecae1' :
              '#c6dbef';
  }

  AddGeojson() {
    const principal = this;
    this.RemoveGeojson();
    this.Lgeojson = L.geoJSON(principal.DataShape,
      {
        style: function (feature) {
          return {
            fillColor: principal.getColor(feature.properties.iddpto),
            weight: 1,
            opacity: 1,
            color: 'white',
            fillOpacity: 0.6
          }
        },
        onEachFeature: function (feature, layer) {
          // principal.SetearBgShape(layer);
          layer.myTag = 'myGeoJSON';
          /* layer.on('click', function (e) {
            if (principal.DepartamentoActual == '00') {
              const info = e.target.feature.properties;
              principal.NombreDepartamento = info.nombdep;
              principal.DepartamentoActual = info.iddpto;
              principal.Procesar();
            }
            principal.CargarShape();
          }); */
          layer.on('mouseover', function (e) {
            principal.highlightFeature(e);
            // layer.bindPopup("dasdas", {sticky: true});
            // layer.bindTooltip(e.target.feature.properties.nombdep, { sticky: true });
            // layer.bindTooltip(principal.DetalleHover(e.target.feature.properties.iddpto)).openTooltip();
          });
          layer.on('mouseout', function (e) {
            principal.resetFeature(e);
          });
        }
      });

    this.Lgeojson.addTo(this.map);
    this.map.fitBounds(this.Lgeojson.getBounds());
    // this.CargarInfoMapa();
    // this.AgregarMarker();
  }

  private highlightFeature(e) {
    const layer = e.target;
    layer.setStyle({
      weight: 5,
      opacity: 1.0,
      color: 'white',
      fillOpacity: 1.0,
      fillColor: '#084594',
    });
  }

  private resetFeature(e) {
    const layer = e.target;
    layer.setStyle({
      fillColor: this.getColor(e.target.feature.properties.iddpto),
      weight: 1,
      opacity: 1,
      color: 'white',
      fillOpacity: 0.6
    });
  }

  DetalleHover(coddepa): string {
    const info: any = this.listProyectosBusqueda.find(x => x.coddepa == coddepa);
    const html: string = '<b>Region: ' + info.nombre_depa + '</b>'; /*  +
       '<div>Intervenciones : ' + info.cantidad + '</div>'; */
    // '<div>Monto Transferido : ' + this.fn.formatMoneda((info.monto_transferido).toString()) + '</div>' +
    // '<div>Beneficiarios : ' + this.fn.formatMiles((info.beneficiario).toString()) + '</div>';
    // let html = '<h1></h1>';
    return html;
  }

  CargarShape(event?: any, CodDepartamentoActual?: string) {
    let shapeJson;
    if (this.DepartamentoActual != '00') {
      shapeJson = this.MapaJson.features.filter(x => x.properties.iddpto == this.DepartamentoActual);
    } else {
      event.preventDefault();
      shapeJson = JSON.parse(JSON.stringify(this.MapaJson));
      this.DepartamentoActual = '00';
      this.NombreDepartamento = '';
    }
    this.DataShape = JSON.parse(JSON.stringify(shapeJson));
    this.AddGeojson();
  }

  AgregarMarker() {
    const map = this.map;
    const data = this.dataMapa;
    const proyectos = this.listProyectos;
    const principal = this;

    map.eachLayer(function (layer) {
      if (layer.hasOwnProperty('myTag')) {
        if (layer.myTag && layer.myTag === 'myGeoJSON') {
          const coddepa = layer.feature.properties.iddpto;
          const nombre_depa = layer.feature.properties.nombdep;
          const info = data.find(x => x.coddepa == coddepa);
          const proy = proyectos.find(x => x.coddepa == coddepa);
          if (info != null || undefined) {
            const html = '<div class="marker"></div><div class="marker-content">' + info.cantidad + '</div>';
            const html1 = '<div class="marker"></div><div class="marker-content"><b>Departamento: ' + nombre_depa + '</b><br>Intervenciones:' + info.cantidad + '</div>';
            const myIcon = L.divIcon({ className: 'my-div-icon', html: html });
            L.marker(layer.getCenter(), { icon: myIcon }).addTo(map).bindTooltip(html1, { direction: 'top' })
              .on('click', function (e) {
                principal.Procesar(coddepa);
              });
            layer.on('mousemove', function (e) {
              // principal.Procesar(e.proy);
              // layer.bindPopup("dasdas", {sticky: true});
              // layer.bindTooltip(e.target.feature.properties.nombdep, { sticky: true });
              // activar con datos para SSI
              // layer.bindTooltip(principal.DetalleHover(e.target.feature.properties.iddpto)).openTooltip();
              layer.bindTooltip(html1).openTooltip();
            });
          }
        }
      }
    });
  }

  ConsultaPrincipal(codDepa: string) {
    if (this.beProyecto.nombre_municipalidad == '') {
      this.beProyecto.id_municipalidad = 0;
    }
    this.beProyecto.id_usuario = parseInt(sessionStorage.getItem('IdUsuario'), 10);
    this.beProyecto.id_perfil = parseInt(sessionStorage.getItem('Id_Perfil'), 10);

    this.EstadoBusqueda = true;

    // this.beProyecto.coddepartamento = this.codDepa == null ? "" : codDepa;
    this.beProyecto.coddepartamento = codDepa;

    this.fs.wsConsultaPrincipalService.cargarDashboard(this.beProyecto).subscribe(
      data => {
        let dataReturn;
        dataReturn = data as any;
        this.totalProyectos = dataReturn.cantidad_registro;
        this.tipoInversion = dataReturn.proyecto_tipo;
        this.dataMapa = dataReturn.cantidad_depa;
        this.listProyectos = dataReturn.lstproyectos;
        this.listProyectosBusqueda = dataReturn.lstproyectos;
        this.listaProyectoCosto = dataReturn.lst_dev_pim;
        this.cargarGraficas();
        this.AgregarMarker();
        this.obtenerCostos();
        if (codDepa != '00') { this.listProyectosDepartamento = dataReturn.lstproyectos; }
      });
  }

  getTipoInfraestructura(tipoInfraestructura: number): string {
    let rpta: string;
    switch (tipoInfraestructura) {
      case 1: rpta = 'Carretera'; break;
      case 2: rpta = 'Puente definitivo'; break;
      case 3: rpta = 'Puente modular'; break;
      default: rpta = 'Otros'; break;
    }
    return rpta;
  }

  detalleProyecto(CUI: number, template) {
    this.proyectoSeleccionado = this.listProyectosBusqueda.find(x => {
      return x.cod_unificado == CUI
    })
    let config = {
      class: 'modal-resetearClave'
    }
    this.modalRef = this.modalService.show(template, config);
  }

  cargarGraficas() {
    let ioarr = 0, proy_inversion = 0;

    this.tipoInversion.forEach(element => {
      if (element.id_tipo_inversion == 1) {
        proy_inversion = element.cantidad;
      } if (element.id_tipo_inversion == 2) {
        ioarr = element.cantidad;
      }
    });

    this.tipoInversionGrafico.push(
      {
        denominacion: 'Inversiones',
        ioarr: ioarr,
        proy_inversion: proy_inversion
      }
    );

    const data = this.listProyectos;

    let preInversion = 0;
    let obra = 0;
    let expediente = 0;

    let carretera = 0;
    let puente_definitivo = 0;
    let puente_modular = 0;
    let otros = 0;

    let actuacionesPrep = 0;
    let proceSele = 0;
    let contraSusc = 0;
    let enEje = 0;
    let culminado = 0;
    let paralizada = 0;
    let sinEstado = 0;

    data.forEach(element => {
      if (element.id_tipo_fase == 5) {
        ++obra;
        switch (element.estado) {
          case 'ActuacionesPreparatorias': { ++actuacionesPrep; break; }
          case 'ProcedimientoSeleccion': { ++proceSele; break; }
          case 'ContratoSuscrito': { ++contraSusc; break; }
          case 'EnEjecucion': { ++enEje; break; }
          case 'Culminado': { ++culminado; break; }
          case 'Paralizada': { ++paralizada; break; }
          default: { ++sinEstado; break; }
        };
      } else if (element.id_tipo_fase == 4) {
        ++expediente;
        switch (element.estado) {
          case 'ActuacionesPreparatorias': { ++actuacionesPrep; break; }
          case 'ProcedimientoSeleccion': { ++proceSele; break; }
          case 'ContratoSuscrito': { ++contraSusc; break; }
          case 'EnEjecucion': { ++enEje; break; }
          case 'Culminado': { ++culminado; break; }
          case 'Paralizada': { ++paralizada; break; }
          default: { ++sinEstado; break; }
        }
      } else if (element.id_tipo_fase == 1) {
        ++preInversion;
        switch (element.estado) {
          case 'ActuacionesPreparatorias': { ++actuacionesPrep; break; }
          case 'ProcedimientoSeleccion': { ++proceSele; break; }
          case 'ContratoSuscrito': { ++contraSusc; break; }
          case 'EnEjecucion': { ++enEje; break; }
          case 'Culminado': { ++culminado; break; }
          case 'Paralizada': { ++paralizada; break; }
          default: { ++sinEstado; break; }
        }
      };

      switch (element.id_tipo_infraestructura) {
        case 1: { ++carretera; break; }
        case 2: { ++puente_definitivo; break; }
        case 3: { ++puente_modular; break; }
        default: { ++otros; break; }
      }
    });

    this.totalObras = obra;
    this.totalExpediente = expediente;
    this.totalPreinversion = preInversion;

    if (actuacionesPrep > 0) {
      this.estadoSituacional.push(
        {
          estado: 'Actos Preparatorios',
          cantidad: actuacionesPrep,
        });
      this.paletteCustomize.push('#212123');
    }
    if (proceSele > 0) {
      this.estadoSituacional.push(
        {
          estado: 'Procedimiento Selección',
          cantidad: proceSele,
        });
      this.paletteCustomize.push('#FFEB3B');
    }
    if (contraSusc > 0) {
      this.estadoSituacional.push(
        {
          estado: 'Contrato Suscrito',
          cantidad: contraSusc,
        });
      this.paletteCustomize.push('#757575');
    }
    if (enEje > 0) {
      this.estadoSituacional.push(
        {
          estado: 'En Ejecución',
          cantidad: enEje,
        });
      this.paletteCustomize.push('#00c853');
    }
    if (culminado > 0) {
      this.estadoSituacional.push(
        {
          estado: 'Culminado',
          cantidad: culminado,
        });
      this.paletteCustomize.push('#1e88e5');
    }
    if (paralizada > 0) {
      this.estadoSituacional.push(
        {
          estado: 'Paralizada',
          cantidad: paralizada,
        });
      this.paletteCustomize.push('#db4437');
    }
    if (sinEstado > 0) {
      this.estadoSituacional.push(
        {
          estado: 'Sin Iniciar',
          cantidad: sinEstado,
        });
      this.paletteCustomize.push('#db9900');
    }

    this.tipoInfraestructuraGrafico.push(
      {
        state: 'Proyectos',
        carretera: carretera,
        puente_definitivo: puente_definitivo,
        puente_modular: puente_modular,
        otros: otros
      }
    );
  }

  obtenerCostos() {
    let costoPim = 0;
    let costoDev = 0;
    if (this.listaProyectoCosto != null) {
      this.listaProyectoCosto.forEach(element => {
        costoPim += element.suma_pim;
        costoDev += element.suma_devengado;
      });
      this.costoTotalDevengado = costoDev;
      this.costoTotalPim = costoPim;
    }
  }

  reiniciarValores() {
    this.tipoInfraestructuraGrafico = [];
    this.estadoSituacional = [];
    this.paletteCustomize = [];
    this.totalObras = 0;
    this.totalExpediente = 0;
    this.totalPreinversion = 0;
    this.tipoInversionGrafico = [];
    this.totalProyectos = 0;
    this.tipoInversion = [];
    this.dataMapa = [];
    this.listProyectos = [];
    this.listProyectosDepartamento = [];
    this.costoTotalDevengado = 0;
    this.costoTotalPim = 0;
  }
}
