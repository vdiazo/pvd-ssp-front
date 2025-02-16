import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'ssi-financiamiento',
  templateUrl: './financiamiento.component.html',
  styleUrls: ['./financiamiento.component.css']
})
export class FinanciamientoComponent implements OnInit {

  id_fase: number = 0;

  separator: string = '';



  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    let idFase = this.route.snapshot.params.idFase;
    this.id_fase = parseInt(idFase, 10);
  }


}
