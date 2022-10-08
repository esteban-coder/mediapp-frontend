import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, map, Observable, switchMap } from 'rxjs';
import { Patient } from 'src/app/model/patient';
import { PatientService } from 'src/app/service/patient.service';

@Component({
  selector: 'app-patient-edit',
  templateUrl: './patient-edit.component.html',
  styleUrls: ['./patient-edit.component.css']
})
export class PatientEditComponent implements OnInit {

  id: number;
  isEdit: boolean;
  form: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private patientService: PatientService
  ) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      'idPatient': new FormControl(0),
      'firstName': new FormControl('', [Validators.required, Validators.minLength(3)]),
      'lastName': new FormControl('', [Validators.required, Validators.minLength(3)]),
      'dni': new FormControl('', [Validators.required, Validators.maxLength(8), Validators.minLength(8)]),
      'address': new FormControl(''),
      'phone': new FormControl('', [Validators.required, Validators.maxLength(9), Validators.minLength(9)]),
      'email': new FormControl('', [Validators.required, Validators.email])
    });

    this.route.params.subscribe(data => {
      this.id = data['id'];
      this.isEdit = data['id'] != null;
      this.initForm();
    })

  }

  initForm() {
    if (this.isEdit) {

      this.patientService.findById(this.id).subscribe(data => {
        this.form = new FormGroup({
          'idPatient': new FormControl(data.idPatient),
          'firstName': new FormControl(data.firstName, [Validators.required, Validators.minLength(3)]),
          'lastName': new FormControl(data.lastName, [Validators.required, Validators.minLength(3)]),
          'dni': new FormControl(data.dni, [Validators.required, Validators.maxLength(8), Validators.minLength(8)]),
          'address': new FormControl(data.address),
          'phone': new FormControl(data.phone, [Validators.required, Validators.maxLength(9), Validators.minLength(9)]),
          'email': new FormControl(data.email, [Validators.required, Validators.email])
        });
      });
    }
  }

  get f() {
    return this.form.controls;
  }

  operate() {
    if (this.form.invalid) { return; }

    let patient = new Patient();
    patient.idPatient = this.form.value['idPatient'];
    patient.firstName = this.form.value['firstName'];
    patient.lastName = this.form.value['lastName'];
    patient.dni = this.form.value['dni'];
    patient.address = this.form.value['address'];
    patient.phone = this.form.value['phone'];
    patient.email = this.form.value['email'];

    if (this.isEdit) {
      //UPDATE
      //PRACTICA COMUN
      this.patientService.update(patient).subscribe(() => {
        //this.patientService.findAll().subscribe(data => {
        this.patientService.listPageable(0, 5).subscribe(data => {
          this.patientService.patientChange.next(data);
          this.patientService.setMessageChange('UPDATED!')
        });
      });
    } else {      
      //INSERT
      //PRACTICA IDEAL
      this.patientService.save(patient).pipe(switchMap(()=>{        
        //return this.patientService.findAll();
        return this.patientService.listPageable(0, 5);
      }))
      .subscribe(data => {
        this.patientService.patientChange.next(data);
        this.patientService.setMessageChange("CREATED!")
      });
    }
    this.router.navigate(['/pages/patient']);
  }
}
