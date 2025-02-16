import { Component, OnInit, Input } from '@angular/core';
import { Snip } from 'projects/sspssi/src/models/response/snip';

@Component({
  selector: 'ssi-costo-proyecto',
  templateUrl: './costo-proyecto.component.html',
  styleUrls: ['./costo-proyecto.component.css']
})
export class CostoProyectoComponent implements OnInit {

  codigoSnip: number;
  _BE_Snip: Snip;
  @Input() listCostoProyecto: Snip;

  constructor() { }

  ngOnInit() {
    this._BE_Snip = this.listCostoProyecto;
  }
}
