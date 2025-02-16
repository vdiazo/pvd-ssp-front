import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-seguimiento-expediente-tecnico',
  templateUrl: './seguimiento-expediente-tecnico.component.html',
  styleUrls: ['./seguimiento-expediente-tecnico.component.css']
})
export class SeguimientoExpedienteTecnicoComponent implements OnInit {
  constructor(private route: ActivatedRoute) {
   }

  ngOnInit() {
  }

}
