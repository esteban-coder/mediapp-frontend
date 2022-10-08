import { Component, OnInit } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Role } from 'src/app/model/role';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  username: string;
  roles: Role[];

  constructor() { }

  ngOnInit(): void {
    const helper = new JwtHelperService();  
    const decodedToken = helper.decodeToken(sessionStorage.getItem(environment.TOKEN_NAME));
    console.log(decodedToken);
    this.username = decodedToken.user_name;
    this.roles = decodedToken.authorities;
  }

}
