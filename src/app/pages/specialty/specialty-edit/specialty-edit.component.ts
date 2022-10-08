import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { Specialty } from 'src/app/model/specialty';
import { SpecialtyService } from 'src/app/service/specialty.service';

@Component({
  selector: 'app-specialty-edit',
  templateUrl: './specialty-edit.component.html',
  styleUrls: ['./specialty-edit.component.css']
})
export class SpecialtyEditComponent implements OnInit {

  id: number;
  isEdit: boolean;
  form: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private specialtyService: SpecialtyService
  ) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      'idSpecialty': new FormControl(0),
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

      this.specialtyService.findById(this.id).subscribe(data => {
        this.form = new FormGroup({
          'idSpecialty': new FormControl(data.idSpecialty),
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

    let specialty = new Specialty();
    specialty.idSpecialty = this.form.value['idSpecialty'];
    specialty.name = this.form.value['name'];
    specialty.description = this.form.value['description'];
    

    if (this.isEdit) {
      //UPDATE
      //PRACTICA COMUN
      this.specialtyService.update(specialty).subscribe(() => {
        this.specialtyService.findAll().subscribe(data => {
          this.specialtyService.setSpecialtyChange(data);
          this.specialtyService.setMessageChange('UPDATED!')
        });
      });
    } else {      
      //INSERT
      //PRACTICA IDEAL
      this.specialtyService.save(specialty).pipe(switchMap(()=>{        
        return this.specialtyService.findAll();
      }))
      .subscribe(data => {
        this.specialtyService.setSpecialtyChange(data);
        this.specialtyService.setMessageChange("CREATED!")
      });
    }
    this.router.navigate(['/pages/specialty']);
  }

}
