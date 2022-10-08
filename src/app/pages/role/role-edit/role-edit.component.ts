import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { Role } from 'src/app/model/role';
import { RoleService } from 'src/app/service/role.service';

@Component({
  selector: 'app-role-edit',
  templateUrl: './role-edit.component.html',
  styleUrls: ['./role-edit.component.css']
})
export class RoleEditComponent implements OnInit {

  id: number;
  isEdit: boolean;
  form: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private roleService: RoleService
  ) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      'idRole': new FormControl(0),
      'name': new FormControl('', [Validators.required, Validators.minLength(3)]),
      'description': new FormControl('', [Validators.required, Validators.minLength(3)])      
    });

    this.route.params.subscribe(data => {
      this.id = data['id'];
      this.isEdit = data['id'] != null;
      this.initForm();
    })

  }

  initForm() {
    if (this.isEdit) {

      this.roleService.findById(this.id).subscribe(data => {
        this.form = new FormGroup({
          'idRole': new FormControl(data.idRole),
          'name': new FormControl(data.name, [Validators.required, Validators.minLength(3)]),
          'description': new FormControl(data.description, [Validators.required, Validators.minLength(3)])          
        });
      });
    }
  }

  get f() {
    return this.form.controls;
  }

  operate() {
    if (this.form.invalid) { return; }

    let role = new Role();
    role.idRole = this.form.value['idRole'];
    role.name = this.form.value['name'];
    role.description = this.form.value['description'];
    

    if (this.isEdit) {
      //UPDATE
      this.roleService.update(role).pipe(switchMap(()=>{        
        //return this.roleService.findAll();
        return this.roleService.listPageable(0, 5);
      }))
      .subscribe(data => {
        this.roleService.setRoleChange(data);
        this.roleService.setMessageChange("UPDATED!")
      });
    } else {      
      //INSERT
      this.roleService.save(role).pipe(switchMap(()=>{        
        //return this.roleService.findAll();
        return this.roleService.listPageable(0, 5);
      }))
      .subscribe(data => {
        this.roleService.setRoleChange(data);
        this.roleService.setMessageChange("CREATED!")
      });
    }
    this.router.navigate(['/pages/role']);
  }

}
