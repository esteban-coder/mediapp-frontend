import { Component, OnInit } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-not403',
  templateUrl: './not403.component.html',
  styleUrls: ['./not403.component.css']
})
export class Not403Component implements OnInit {

  username: string;

  constructor() { }

  ngOnInit(): void {
    const helper = new JwtHelperService();
    let token = sessionStorage.getItem(environment.TOKEN_NAME);
    const decodedToken = helper.decodeToken(token);
    this.username = decodedToken.user_name;
  }

}
