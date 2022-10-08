import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Specialty } from '../model/specialty';
import { GenericService } from './generic.service';

@Injectable({
  providedIn: 'root'
})
export class SpecialtyService extends GenericService<Specialty> {

  private specialtyChange = new Subject<Specialty[]>;
  private messageChange = new Subject<string>;

  constructor(protected override http: HttpClient) {
    super(
      http,
      `${environment.HOST}/specialties`
    );
  }

  //////////get set/////////////
  setSpecialtyChange(list: Specialty[]) {
    this.specialtyChange.next(list);
  }

  getSpecialtyChange() {
    return this.specialtyChange.asObservable();
  }

  setMessageChange(message: string) {
    this.messageChange.next(message);
  }

  getMessageChange() {
    return this.messageChange.asObservable();
  }

}
