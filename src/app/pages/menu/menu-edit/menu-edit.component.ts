import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { Menu } from 'src/app/model/menu';
import { MenuService } from 'src/app/service/menu.service';

@Component({
  selector: 'app-menu-edit',
  templateUrl: './menu-edit.component.html',
  styleUrls: ['./menu-edit.component.css']
})
export class MenuEditComponent implements OnInit {

  id: number;
  isEdit: boolean;
  form: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private menuService: MenuService
  ) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      'idMenu': new FormControl(0),
      'name': new FormControl('', [Validators.required, Validators.minLength(3)]),
      'icon': new FormControl('', [Validators.required, Validators.minLength(3)]),          
      'url': new FormControl('', [Validators.required, Validators.minLength(3)]),
      'ordermenu': new FormControl('', Validators.required)     
    });

    this.route.params.subscribe(data => {
      this.id = data['id'];
      this.isEdit = data['id'] != null;
      this.initForm();
    })

  }

  initForm() {
    if (this.isEdit) {

      this.menuService.findById(this.id).subscribe(data => {
        this.form = new FormGroup({
          'idMenu': new FormControl(data.idMenu),
          'name': new FormControl(data.name, [Validators.required, Validators.minLength(3)]),
          'icon': new FormControl(data.icon, [Validators.required, Validators.minLength(3)]),          
          'url': new FormControl(data.url, [Validators.required, Validators.minLength(3)]),
          'ordermenu': new FormControl(data.ordermenu, Validators.required)
        });
      });
    }
  }

  get f() {
    return this.form.controls;
  }

  operate() {
    if (this.form.invalid) { return; }

    let menu = new Menu();
    menu.idMenu = this.form.value['idMenu'];
    menu.name = this.form.value['name'];
    menu.icon = this.form.value['icon'];
    menu.url = this.form.value['url'];
    menu.ordermenu = this.form.value['ordermenu'];
    

    if (this.isEdit) {
      console.log("edit")
      //UPDATE
      this.menuService.update(menu).pipe(switchMap(()=>{        
        //return this.menuService.findAll();
        return this.menuService.listPageable(0, 5);
      }))
      .subscribe(data => {
        this.menuService.setMenuChangeCrud(data);
        this.menuService.setMessageChange("UPDATED!")
      });
    } else {    
      console.log("new")  
      //INSERT
      this.menuService.save(menu).pipe(switchMap(()=>{        
        //return this.menuService.findAll();
        return this.menuService.listPageable(0, 5);
      }))
      .subscribe(data => {
        this.menuService.setMenuChangeCrud(data);
        this.menuService.setMessageChange("CREATED!")
      });
    }
    this.router.navigate(['/pages/menu']);
  }

}
