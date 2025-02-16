import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Snip } from '../../../../models/response/snip';
import { InfoFinancieraService } from '../../../services/info-financiera.service';

@Component({
  selector: 'set-costo-proyecto',
  templateUrl: './costo-proyecto.component.html',
  styleUrls: ['./costo-proyecto.component.css']
})
export class CostoProyectoComponent implements OnInit {

  codigoSnip: number;
  _BE_Snip: Snip;
  @Input() listCostoProyecto: Snip;

  constructor(private servicio: InfoFinancieraService, private route: ActivatedRoute) { }

  ngOnInit() {
    this._BE_Snip = this.listCostoProyecto;
  }
}
