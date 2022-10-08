import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { map, Observable, switchMap } from 'rxjs';
import { Patient } from 'src/app/model/patient';
import { VitalSign } from 'src/app/model/vitalsign';
import { PatientService } from 'src/app/service/patient.service';
import { VitalsignService } from 'src/app/service/vitalsign.service';
import * as moment from 'moment';
import { PatientDialogComponent } from '../../patient/patient-dialog/patient-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-vitalsign-edit',
  templateUrl: './vitalsign-edit.component.html',
  styleUrls: ['./vitalsign-edit.component.css']
})
export class VitalsignEditComponent implements OnInit {

  id: number;
  isEdit: boolean;

  form: FormGroup;
  patientControl: FormControl = new FormControl();
  patientsFiltered$: Observable<Patient[]>;

  patients: Patient[];

  maxDate: Date = new Date();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private patientService: PatientService,
    private vitalsignService: VitalsignService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {

    this.form = new FormGroup({
      'idVitalSign' : new FormControl(0),// seteo en 0 para pasar validacion
      'patient': this.patientControl,
      'takenDate': new FormControl(),
      'temperature': new FormControl('', [Validators.required, Validators.max(100)]),
      'pulse': new FormControl([Validators.required, Validators.max(1000)]),
      'respiratoryRate': new FormControl([Validators.required, Validators.max(1000)]),
    });

    this.patientService.findAll().subscribe(patients => {
      this.patients = patients;
      //para el caso que findAll demore mucho, nos aseguramos que primero se asigne patients para luego asginar patientsFiltered$
      this.patientsFiltered$ = this.patientControl.valueChanges.pipe(map(val => this.filterPatients(val)));

      //ponemos este bloque adentro del subscribe para asegurarnos que patients y patientsFiltered$ esten asignados (lo ultimo que se ejecuta sera this.patientControl.setValue)
      this.route.params.subscribe(data => {
        this.id = data['id'];
        this.isEdit = data['id'] != null;
        this.initForm();
      })

    });

    this.patientService.patientChange.subscribe( patient => {
      console.log(patient);
      this.patientService.findAll().subscribe( patients => {
        this.patients = patients;
        this.patientControl.setValue(patient);
      });
    });

    this.patientService.getMessageChange().subscribe( data => {
      console.log("open info");
      this.snackBar.open(data, 'INFO', { duration: 2000, verticalPosition: "top", horizontalPosition: "right" });
    });

  }

  initForm(){
    if(this.isEdit){
      this.vitalsignService.findById(this.id).subscribe(data => {
        //console.log(data);
        
        this.form = new FormGroup({
          'idVitalSign' : new FormControl(data.idVitalSign),
          //'patient': new FormControl(data.patient),
          'patient': this.patientControl,
          'takenDate': new FormControl(new Date(data.takenDate)),
          //'takenDate': new FormControl(data.takenDate),
          'temperature': new FormControl(data.temperature, [Validators.required, Validators.max(100)]),
          'pulse': new FormControl(data.pulse, [Validators.required, Validators.max(1000)]),
          'respiratoryRate': new FormControl(data.respiratoryRate, [Validators.required, Validators.max(1000)]),
        });
       
        this.patientControl.setValue(data.patient);
        //setTimeout(() => { this.patientControl.setValue(data.patient); }, 1000);

      });
    }
  }

  filterPatients(val: any){
    console.log(val);console.log(this.patientControl.value);//son lo mismo
    if(val?.idPatient > 0){
      return this.patients.filter(el =>
        el.firstName.toLowerCase().includes(val.firstName.toLowerCase()) || el.lastName.toLowerCase().includes(val.lastName.toLowerCase())
      )
    }else{
      return this.patients.filter(el =>
        el.firstName.toLowerCase().includes(val?.toLowerCase()) || el.lastName.toLowerCase().includes(val?.toLowerCase())
      )
    }    
  }

  showPatient(val: any){
    return val ? `${val.firstName} ${val.lastName}` : val;
  }

  get f() {
    return this.form.controls;
  }

  operate(){
    console.log(this.form.value['patient']);console.log(this.patientControl);

    if (this.form.invalid || this.form.value['patient'].idPatient == undefined) { return; }
    
    let vitalSign = new VitalSign();
    vitalSign.idVitalSign = this.form.value['idVitalSign'];
    vitalSign.patient = this.form.value['patient'];
    vitalSign.takenDate = moment(this.form.value['takenDate']).format('YYYY-MM-DDTHH:mm:ss');
    vitalSign.temperature = this.form.value['temperature'];
    vitalSign.pulse = this.form.value['pulse'];
    vitalSign.respiratoryRate = this.form.value['respiratoryRate'];
    //console.log(vitalSign);
    
    if (this.isEdit) {
      //UPDATE
      this.vitalsignService.update(vitalSign).pipe(switchMap(()=>{
        //return this.vitalsignService.findAll();
        return this.vitalsignService.listPageable(0, 5);
      }))
      .subscribe(data => {
        this.vitalsignService.setVitalSignChange(data);
        this.vitalsignService.setMessageChange("UPDATED!")
      });
    } else {      
      //INSERT
      this.vitalsignService.save(vitalSign).pipe(switchMap(()=>{
        //return this.vitalsignService.findAll();
        return this.vitalsignService.listPageable(0, 5);
      }))
      .subscribe(data => {
        this.vitalsignService.setVitalSignChange(data);
        this.vitalsignService.setMessageChange("CREATED!")
      });
    }
    this.router.navigate(['/pages/vitalsign']);
  }

  openDialog(){
    this.dialog.open(PatientDialogComponent, {
      width: '250px',
      //data: {}
    });
  }

}
