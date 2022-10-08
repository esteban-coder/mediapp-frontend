import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { switchMap } from 'rxjs';
import { Medic } from 'src/app/model/medic';
import { MedicService } from 'src/app/service/medic.service';

@Component({
  selector: 'app-medic-dialog',
  templateUrl: './medic-dialog.component.html',
  styleUrls: ['./medic-dialog.component.css']
})
export class MedicDialogComponent implements OnInit {

  medic: Medic;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: Medic,
    private dialogRef: MatDialogRef<MedicDialogComponent>,
    private medicService: MedicService
  ) { }

  ngOnInit(): void {
    //this.medic = this.data;
    //console.log(this.medic);
    this.medic = { ...this.data };
    /*this.medic = new Medic();
    this.medic.idMedic = this.data.idMedic;
    this.medic.firstName = this.data.firstName;
    this.medic.lastName = this.data.lastName;
    this.medic.cmp = this.data.cmp;
    this.medic.photoUrl = this.data.photoUrl;*/

  }

  operate() {
    if(this.medic != null && this.medic.idMedic >0 ){
      //UPDATE
      this.medicService.update(this.medic).pipe(switchMap(()=>{
        return this.medicService.findAll();
      }))
      .subscribe(data => {
        this.medicService.setMedicChange(data);
        this.medicService.setMessageChange('UPDATED!');
      });
    }else{
      //SAVE
      this.medicService.save(this.medic).pipe(switchMap(()=>{
        return this.medicService.findAll();
      }))
      .subscribe(data => {
        this.medicService.setMedicChange(data);
        this.medicService.setMessageChange('CREATED!');
      });
    }
    this.close();
  }

  close() {
    this.dialogRef.close();
  }

}
