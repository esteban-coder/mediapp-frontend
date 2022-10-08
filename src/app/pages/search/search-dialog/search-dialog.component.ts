import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Consult } from 'src/app/model/consult';
import { Exam } from 'src/app/model/exam';
import { ConsultService } from 'src/app/service/consult.service';

@Component({
  selector: 'app-search-dialog',
  templateUrl: './search-dialog.component.html',
  styleUrls: ['./search-dialog.component.css']
})
export class SearchDialogComponent implements OnInit {

  consult: Consult;
  exams: any[];

  constructor(
    private dialogRef: MatDialogRef<SearchDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: Consult,
    private consultService: ConsultService
  ) { }

  ngOnInit(): void {
    this.consult = { ...this.data };
    this.consultService.getExamsByIdConsult(this.consult.idConsult).subscribe(data => {
      this.exams = data;
    });
  }

  close() {
    this.dialogRef.close();
  }

}
