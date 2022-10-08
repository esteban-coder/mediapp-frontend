import { Component, OnInit } from '@angular/core';
import { Menu } from 'src/app/model/menu';
import { LoginService } from 'src/app/service/login.service';
import { MenuService } from 'src/app/service/menu.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {

  menus: Menu[];

  constructor(
    private menuService: MenuService,
    private loginService: LoginService
  ) { }

  ngOnInit(): void {
    this.menuService.getMenuChange().subscribe(data => this.menus = data);

    //Se mueve este codigo en caso se haga F5 en cualquier pagina interna para no perder el arbol de menus
    this.menuService.getMenusByUser().subscribe(data => {
    //this.menuService.getMenusByUserFront(this.username).subscribe(data => {
      this.menuService.setMenuChange(data);
    });
  }

  logout(){
    this.loginService.logout();
  }

}
