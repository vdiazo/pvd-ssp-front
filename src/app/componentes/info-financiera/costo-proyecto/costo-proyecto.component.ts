import { Component, OnInit, Input } from '@angular/core';
import { Snip } from '../../../models/response/snip';
import { ActivatedRoute } from '@angular/router';
import { InfoFinancieraService } from '../../../services/info-financiera.service';

@Component({
  selector: 'app-costo-proyecto',
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
