import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { VitalSign } from '../model/vitalsign';
import { GenericService } from './generic.service';

@Injectable({
  providedIn: 'root'
})
export class VitalsignService extends GenericService<VitalSign>{

  //ahora llega un objeto tipo Page, y en su propiedad 'content' viene VitalSign[]
  //No hay error si mantenemos esta linea y mantenemos setVitalSignChange(list: VitalSign[])
  //Esto se debe a que lo que seteamos es del tipo any por eso lo acepta, pero saldria error si lo que seteamos es del tipo VitalSign por ejemplo
  //Por buena practica de tipado lo cambiamos, con esto se demuestra que typescript no es 100% tipado
  //private vitalSignChange = new Subject<VitalSign[]>; 
  private vitalSignChange = new Subject<any>;
  private messageChange = new Subject<string>;

  constructor(protected override http: HttpClient) { 
    super(
      http,
      `${environment.HOST}/vitalsigns`
      );
  }

  listPageable(p: number, s:number){
    return this.http.get<any>(`${this.url}/pageable?page=${p}&size=${s}`);
  }

  //////////get set/////////////
  setVitalSignChange(page: any){
    console.log(page);
    this.vitalSignChange.next(page);
  }

  getVitalSignChange(){
    return this.vitalSignChange.asObservable();
  }

  setMessageChange(message: string){
    this.messageChange.next(message);
  }

  getMessageChange(){
    return this.messageChange.asObservable();
  }
}
