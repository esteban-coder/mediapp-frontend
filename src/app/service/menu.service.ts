import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Menu } from '../model/menu';
import { GenericService } from './generic.service';

@Injectable({
  providedIn: 'root'
})
export class MenuService extends GenericService<Menu> {

  private menuChange = new Subject<Menu[]>();//viene Menu[]
  private menuChangeCrud = new Subject<any>();//puede venir Menu[] o un objeto (java de tipo Page)
  private messageChange = new Subject<string>;

  constructor(http: HttpClient) {
    super(
      http,
      `${environment.HOST}/menus`);
  }

  getMenusByUser(){
    let token = sessionStorage.getItem(environment.TOKEN_NAME);

    return this.http.get<Menu[]>(`${this.url}/user`, {
      headers: new HttpHeaders().set('Authorization', `Bearer ${token}`) //.set('Content-Type', 'application/json') //para metodo GET no es necesario
    });
  }

  getMenusByUserFront(username: string){
    let token = sessionStorage.getItem(environment.TOKEN_NAME);

    return this.http.post<Menu[]>(`${this.url}/user_front`, username, {
      headers: new HttpHeaders().set('Authorization', `Bearer ${token}`).set('Content-Type', 'application/json')
    });
  }

  listPageable(p: number, s: number) {
    return this.http.get<any>(`${this.url}/pageable?page=${p}&size=${s}`);
  }
  
  //////////get set/////////////
  getMenuChange(){
    return this.menuChange.asObservable();
  }

  setMenuChange(menus: Menu[]){
    this.menuChange.next(menus);
  }

  getMenuChangeCrud(){
    return this.menuChangeCrud.asObservable();
  }

  setMenuChangeCrud(t: any){
    this.menuChangeCrud.next(t);
  }

  setMessageChange(message: string) {
    this.messageChange.next(message);
  }

  getMessageChange() {
    return this.messageChange.asObservable();
  }
}
