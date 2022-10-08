import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Menu } from '../model/menu';
import { LoginService } from './login.service';
import { MenuService } from './menu.service';

@Injectable({
  providedIn: 'root'
})
export class GuardService implements CanActivate {

  constructor(
    private loginService: LoginService,
    private menuService: MenuService,
    private router: Router
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    //1) VERIFICAR SI EL USUARIO ESTA LOGUEADO
    let rpta = this.loginService.isLogged();
    if (!rpta) {
      this.loginService.logout();
      return false;
    }
    //2) VERIFICAR SI EL TOKEN NO HA EXPIRADO
    const helper = new JwtHelperService();
    let token = sessionStorage.getItem(environment.TOKEN_NAME);

    if (!helper.isTokenExpired(token)) {
      //3) VERIFICAR SI TIENES EL ROL NECESARIO PARA ACCEDER A ESE COMPONENTE 'PAGINA'
      //url -> /pages/patient
      let url = state.url;
      const decodedToken = helper.decodeToken(token);

      //return this.menuService.getMenusByUserFront(decodedToken.user_name).pipe(map( (data: Menu[]) => {
      return this.menuService.getMenusByUser().pipe(map( (data: Menu[]) => {
        this.menuService.setMenuChange(data);

        let cont = 0;
        for (let m of data) {
          if (url.startsWith(m.url)) {
            cont++;
            break;
          }
        }

        if (cont > 0) {
          return true;
        } else {
          this.router.navigate(['/pages/not-403']);
          return false;
        }

      }));

    } else {
      this.loginService.logout();
      return false;
    }



  }
}
