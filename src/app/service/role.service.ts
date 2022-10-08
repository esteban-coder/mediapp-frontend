import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Role } from '../model/role';
import { GenericService } from './generic.service';

@Injectable({
  providedIn: 'root'
})
export class RoleService extends GenericService<Role>{

  private roleChange = new Subject<any>;//recibe un objeto (java de tipo page), pero puede venir Role[] si invocamos a findAll por ejemplo
  private messageChange = new Subject<string>;

  constructor(protected override http: HttpClient) {
    super(
      http,
      `${environment.HOST}/roles`
    );
  }

  listPageable(p: number, s: number) {
    return this.http.get<any>(`${this.url}/pageable?page=${p}&size=${s}`);
  }

  //////////get set/////////////
  setRoleChange(page: any) {
    console.log(page);
    this.roleChange.next(page);
  }

  getRoleChange() {
    return this.roleChange.asObservable();
  }

  setMessageChange(message: string) {
    this.messageChange.next(message);
  }

  getMessageChange() {
    return this.messageChange.asObservable();
  }
}
