import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { switchMap } from 'rxjs';
import { Patient } from 'src/app/model/patient';
import { PatientService } from 'src/app/service/patient.service';

@Component({
  selector: 'app-patient-dialog',
  templateUrl: './patient-dialog.component.html',
  styleUrls: ['./patient-dialog.component.css']
})
export class PatientDialogComponent implements OnInit {

  form: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<PatientDialogComponent>,
    private patientService: PatientService
  ) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      'idPatient': new FormControl(0),
      'firstName': new FormControl('', [Validators.required, Validators.minLength(3)]),
      'lastName': new FormControl('', [Validators.required, Validators.minLength(3)]),
      'dni': new FormControl('', [Validators.required, Validators.maxLength(8)]),
      'phone': new FormControl('', [Validators.required, Validators.minLength(9)]),
      'email': new FormControl('', [Validators.required, Validators.email])
    });
  }

  save(){
    if (this.form.invalid) { return; }

    let patient = new Patient();
    patient.idPatient = this.form.value['idPatient'];
    patient.firstName = this.form.value['firstName'];
    patient.lastName = this.form.value['lastName'];
    patient.dni = this.form.value['dni'];
    patient.phone = this.form.value['phone'];
    patient.email = this.form.value['email'];

    this.patientService.save(patient).pipe(switchMap((response)=>{
      //console.log(response.body);
      return this.patientService.findById(response.body['idPatient']);
    }))
    .subscribe( (patient) => {
      //console.log(patient)
      this.patientService.patientChange.next(patient);
      this.patientService.setMessageChange("CREATED!")
    });

    /*
    this.patientService.save(patient).subscribe( (data) => {
      console.log("ok")
      console.log(data)
      console.log(data.body)
      console.log(data.headers.get('Location'));
      //this.patientService.patientChange.next(patient);
      //this.patientService.setMessageChange("CREATED!")
    });
    */

    /*
    this.patientService.save(patient).subscribe(response => {
      response.headers
        .keys()
        .forEach(keyName =>
          console.log(
            `The value of the ${keyName} header is: ${response.headers.get(
              keyName
            )}`
          )
        );
    });
    */

    this.close();
  }
  
  close(){
    this.dialogRef.close();
  }
}
