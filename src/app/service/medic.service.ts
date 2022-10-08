import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Medic } from '../model/medic';
import { GenericService } from './generic.service';

@Injectable({
  providedIn: 'root'
})
export class MedicService extends GenericService<Medic> {

  private medicChange = new Subject<Medic[]>;
  private messageChange = new Subject<string>;

  constructor(protected override http: HttpClient) { 
    super(
      http,
      `${environment.HOST}/medics`
      );
  }

  //////////get set/////////////
  setMedicChange(list: Medic[]){
    this.medicChange.next(list);
  }

  getMedicChange(){
    return this.medicChange.asObservable();
  }

  setMessageChange(message: string){
    this.messageChange.next(message);
  }

  getMessageChange(){
    return this.messageChange.asObservable();
  }

}
