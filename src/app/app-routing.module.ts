import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './componentes/auth/auth.guard';
import { LoginComponent } from './componentes/login/login.component';
import { LogonComponent } from './componentes/logon/logon.component';
import { RoleGuardService } from './componentes/auth/role-guard.service';
import { UnidadesEjecutorasComponent } from './componentes/unidades-ejecutoras/unidades-ejecutoras.component';
import { HomeLayoutComponent } from './layouts/home-layout/home-layout.component';
import { LoginLayoutComponent } from './layouts/login-layout/login-layout.component';

const routes: Routes = [
  {
    path: '',
    component: HomeLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        redirectTo: "monitoreo",
        pathMatch: "full"
      },
      {
        path: 'metas',
        loadChildren:"./componentes/metas/metas.module#MetasModule",
        // canActivate: [RoleGuardService]
      },
      {
        path: 'monitoreo',
        loadChildren: "./componentes/info-principal/info-principal.module#InfoPrincipalModule",
        canActivate: [RoleGuardService]
      },
      {
        path: 'buscarproyecto',
        loadChildren: "./componentes/buscar-proyecto/buscar-proyecto.module#BuscarProyectoModule",
        canActivate: [RoleGuardService]
      },
      {
        path: 'buscartramo',
        loadChildren: "./componentes/buscar-tramo/buscar-tramo.module#BuscarTramoModule",
        canActivate: [RoleGuardService]
      },
      {
        path: 'buscargeo',
        loadChildren: "./componentes/buscar-geo/buscar-geo.module#BuscarGeoModule",
        canActivate: [RoleGuardService]
      },
      {
        path: 'monitoreo/proyecto',
        loadChildren: "./componentes/menu-tabs/menu-tabs.module#MenuTabsModule",
      },
      {
        path: 'monitoreo/proyecto/sspset/:idSeguimientoMonitoreo/:idTramo/:idFase/:idProyecto/:snip/:idMunicipalidad/:idTipoFase',
        loadChildren: "./componentes/seguimiento-expediente-tecnico/seguimiento-expediente-tecnico.module#SeguimientoExpedienteTecnicoModule",
      },
      {
        path: 'buscarusuario',
        loadChildren: "./componentes/buscar-usuario/buscar-usuario.module#BuscarUsuarioModule",
        canActivate: [RoleGuardService]
      },
      {
        path: 'perfil',
        loadChildren: "./componentes/perfil/perfil.module#PerfilModule",
      },
      {
        path: 'perfiles',
        loadChildren: "./componentes/buscar-perfil/buscar-perfil.module#BuscarPerfilModule",
        //component: BuscarPerfilComponent,
        canActivate: [RoleGuardService]
      },
      {
        path:'buscaracceso',
        loadChildren: "./componentes/buscar-acceso/buscar-acceso.module#BuscarAccesoModule",
        canActivate: [RoleGuardService]
      },
      {
        path:'buscarmenu',
        loadChildren: "./componentes/buscar-menu/buscar-menu.module#BuscarMenuModule",
        canActivate: [RoleGuardService]
      },
      {
        path:'buscartransferencia',
        loadChildren: "./componentes/transferencias/transferencias.module#TransferenciasModule",
        canActivate: [RoleGuardService]
      },
      {
        path:'buscarproyectoreporte',
        loadChildren: "./componentes/reporte-alta-direccion/reporte-alta-direccion.module#ReporteAltaDireccionModule",
        canActivate: [RoleGuardService]
      },
      {
        path:'componente',
        loadChildren:"./componentes/buscar-componentes/buscar-componentes.module#BuscarComponentesModule",
        //component:BuscarComponentesComponent,
        canActivate: [RoleGuardService]
      },
      {
        path:'buscarautocapacitacion',
        loadChildren:"./componentes/buscar-auto-capacitacion/buscar-auto-capacitacion.module#BuscarAutoCapacitacionModule",
        canActivate: [RoleGuardService]
      },

      {
        path: 'ue',
        loadChildren:"./componentes/unidades-ejecutoras/unidades-ejecutoras.module#UnidadesEjecutorasModule"
        //component: UnidadesEjecutorasComponent
      },
      {
        path:'autocapacitacion',
        loadChildren:"./componentes/auto-capacitacion/auto-capacitacion.module#AutoCapacitacionModule",
      },
      {
        path: 'colaboradores',
        loadChildren: "./componentes/colaboradores/colaboradores.module#ColaboradoresModule"
      },
    ]
  },
  {
    path: 'sistemas',
    loadChildren: "./layouts/sistemas/sistemas.module#SistemasModule",
    //canActivate: [RoleGuardService]
  },
  // {
  //   path: 'monitoreo/proyecto/sspssi',
  //   loadChildren: "./componentes/integracion-proyecto-ssi/integracion-proyecto-ssi.module#IntegracionProyectoSsiModule"
  //   //component: IntegracionProyectoSsiComponent
  // },
  {
    path: 'ssi',
    loadChildren: "../../projects/sspssi/src/lib/sspssi.module#SspssiModule"
    //loadChildren:"sspssi.module#SspssiModule"
   //loadChildren: "./componentes/integracion-proyecto-ssi/integracion-proyecto-ssi.module#IntegracionProyectoSsiModule"
  },
  {
    path: '404',
    loadChildren: "./layouts/error404/error404.module#Error404Module",
  },
  {
    path: '',
    component: LoginLayoutComponent,
    children: [
      {
        path: 'login',
        component: LoginComponent
      },
      {
        path: 'logon',
        component: LogonComponent
      }
    ]
  },
  { path: '**', redirectTo: '/404' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
