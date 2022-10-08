import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/service/login.service';
import { environment } from 'src/environments/environment';
import '../../../assets/login-animation.js';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  username: string;
  password: string;
  message: string;
  error: string;

  constructor(
    private loginService: LoginService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    (window as any).initialize();
  }

  login(){
    this.loginService.login(this.username, this.password).subscribe(data => {
      //console.log(data);
      sessionStorage.setItem(environment.TOKEN_NAME, data.access_token);
      this.router.navigate(['/pages/dashboard']);
    });
  }

}
