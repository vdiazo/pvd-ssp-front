import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { IColaboradores, IColaborador } from 'src/app/Interfaces';
import { FacadeService } from 'src/app/patterns/facade.service';
import { sessionStorageItems, Functions } from 'src/app/appSettings';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ModalColaboradorComponent } from './modal-colaborador/modal-colaborador.component';
import { Usuario } from 'src/app/models/Usuario';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-colaboradores',
  templateUrl: './colaboradores.component.html',
  styleUrls: ['./colaboradores.component.css']
})
export class ColaboradoresComponent implements OnInit {
  @Output() retornoValores = new EventEmitter();
  colaboradores: IColaboradores
  nombreUsuario: string
  idMunicipalidad: number
  paginaActual: number = 1;
  totalRegistros: number = 0
  arreglo: IColaborador[]

  bsModalRef: BsModalRef;

  constructor(private fs: FacadeService, private modalService: BsModalService, private funciones: Functions, private svcUsuario: UsuarioService) { }

  ngOnInit() {
    this.busquedaColaboradores();
  }

  busquedaColaboradores(skip: number = 10, take: number = 0) {
    this.idMunicipalidad = Number.parseInt(sessionStorage.getItem(sessionStorageItems.SS_ID_MUNICIPALIDAD));
    this.fs.colaboradoresService.listarColaboradores(this.nombreUsuario, this.idMunicipalidad, skip, take).subscribe(
      data => {
        this.totalRegistros = data.cantidad_registro;

        if (this.totalRegistros === 0) {
          this.arreglo = [];
        } else {
          this.arreglo = data.data;
        }
      }
    )
  }

  addOrEditColaboradorColaborador(idColaborador: number = 0) {
    const initialState = {
      idColaborador: idColaborador,
    };

    let config = {
      ignoreBackdropClick: true,
      keyboard: false,
      class: 'modal-standar-md',
      initialState: initialState
    };

    this.bsModalRef = this.modalService.show(ModalColaboradorComponent, config);
    this.bsModalRef.content.retornoValores.subscribe(
      data => {
        let pagina = { page: this.paginaActual }
        this.cambiarPagina(pagina);
      }
    )

  }

  paginaActiva: number = 0;
  numero_Pagina: number = 0;
  num_filas: number = 5;
  numPaginasMostrar: number = 5;

  cambiarPagina(pagina) {
    this.paginaActiva = ((pagina.page - 1) * this.numPaginasMostrar);
    this.numero_Pagina = this.paginaActiva;
    this.busquedaColaboradores(this.num_filas, this.numero_Pagina);
  }

  estado(evento, objActivar: IColaborador) {
    let envioActivar = new Usuario();
    envioActivar.estado = evento;
    envioActivar.id_usuario = objActivar.id_usuario;
    envioActivar.usuario_modificacion = sessionStorage.getItem("Usuario");
    this.svcUsuario.cambiarEstado(envioActivar).subscribe(
      data => {
        if (data == 1) {
          if (evento) {
            this.funciones.alertaSimple("success", "Se habilitó al usuario!", "", true);
          } else {
            this.funciones.alertaSimple("success", "Se deshabilitó al usuario!", "", true);
          }

          let pagina = { page: this.paginaActual }
          this.cambiarPagina(pagina);
        }
        else {
          this.funciones.alertaSimple("error", "Ocurrio un problema al deshabilitar al usuario", "", true);
        }
      }
    );
  }

  consultaResetear(entidad) {
    this.funciones.alertaRetorno("question", "Deseas restablecer la contraseña?", "", true, (respuesta) => {
      if (respuesta.value) {
        this.resetarClave(entidad);
      }
    })
  }

  mostrarAlerta(codigo) {
    this.funciones.alertaRetorno("question", "Deseas eliminar el siguiente registro?", "", true, (respuesta) => {
      if (respuesta.value) {
        this.eliminar(codigo);
      }
    })
  }

  eliminar(codigo) {
    let entidadEliminar = new Usuario();
    entidadEliminar.id_usuario = codigo;
    entidadEliminar.usuario_anulacion = sessionStorage.getItem("Usuario");
    this.svcUsuario.anularUsuario(entidadEliminar).subscribe(
      data => {
        if (data == 1) {
          this.funciones.alertaSimple("success", "Se deshabilitó al usuario!", "", true);
          let pagina = { page: this.paginaActual }
          this.cambiarPagina(pagina);
        }
        else {
          this.funciones.alertaSimple("error", "Ocurrio un error al momento deshabilitar al usuario", "", true);
        }
      }
    )
  }

  resetarClave(entidad: IColaborador) {
    let envio = new Usuario();
    envio.id_usuario = entidad.id_usuario;
    envio.usuario = entidad.usuario;
    envio.usuario_modificacion = sessionStorage.getItem("Usuario");
    this.svcUsuario.restablecerClave(envio).subscribe(
      data => {
        if (data == 1) {
          this.funciones.alertaSimple("success", "Se restablecio la contraseña correctamente!", "", true);
          let pagina = { page: this.paginaActual }
          this.cambiarPagina(pagina);
        }
        else {
          this.funciones.alertaSimple("error", "Ocurrio un error al momento de restablecer la contraseña", "", true);
        }
      }
    );
  }
}
