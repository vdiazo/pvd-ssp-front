// import { Component, OnInit } from '@angular/core';
// import { ActivatedRoute,Router } from '@angular/router';
// import { Snip } from '../../models/Snip';
// import { FuenteFinanciera } from '../../models/fuente-financiera';
// import { InformacionFinanciera } from '../../models/informacion-financiera';
// import { InfoGeneralProyectoExpTecService } from '../services/info-general-proyecto-exp-tec.service';
// @Component({
//   selector: 'set-info-financiera-exp-tec',
//   templateUrl: './info-financiera-exp-tec.component.html',
//   styleUrls: ['./info-financiera-exp-tec.component.css']
// })
// export class InfoFinancieraExpTecComponent implements OnInit {
//   codigoSnip: number=4743; //4743
//   idFase: number=542; //542
//   numero_Pagina: number = 0;
//   num_filas: number = 10;
//   idTramo: number;
//   _BE_Snip: Snip;
//   infoFinanciera: InformacionFinanciera;
//   fteFinanciera: FuenteFinanciera;

//   constructor(private route: ActivatedRoute, private router: Router, private InfoGeneralService:InfoGeneralProyectoExpTecService) { }

//   ngOnInit() {
//     this.idTramo = JSON.parse(sessionStorage.getItem("datosProyectoExpTec")).idTramo;
//     this.codigoSnip = JSON.parse(sessionStorage.getItem("datosProyectoExpTec")).snip;
//    // this.idFase = JSON.parse(sessionStorage.getItem("datosProyectoExpTec")).idFase;
//     this.listarInformacionFinanciera(this.codigoSnip,this.idFase,this.num_filas,this.numero_Pagina);
//   }

//   listarInformacionFinanciera(codSnip: number,idFase: number, numfila: number, numPagina: number) {
//     this.InfoGeneralService.listarInformacionFinanciera(codSnip,idFase).subscribe(
//       respuesta => {
//         let infoFinanciera = JSON.parse(respuesta as any);
//         this._BE_Snip = infoFinanciera._BE_Snip;
//         this.infoFinanciera = infoFinanciera.LisBE_Info_Financiera;
//         this.fteFinanciera = infoFinanciera.LisBE_Fuente_Financiera;
//       }
//     );
//   }

// }
