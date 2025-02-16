import { Injectable,EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  AnyEvent= new EventEmitter();

  constructor() { }

  EjecAnyEvent(){
    this.AnyEvent.emit("touch");
  }
}
