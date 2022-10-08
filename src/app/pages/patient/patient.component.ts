import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { switchMap } from 'rxjs';
import { Patient } from 'src/app/model/patient';
import { PatientService } from 'src/app/service/patient.service';

@Component({
  selector: 'app-patient',
  templateUrl: './patient.component.html',
  styleUrls: ['./patient.component.css']
})
export class PatientComponent implements OnInit {

  displayedColumns: string[] = ['id', 'firstName', 'lastName', 'dni', 'actions'];
  dataSource: MatTableDataSource<Patient>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  totalElements: number;

  constructor(
    private snackBar: MatSnackBar,
    private patientService: PatientService
  ) { }

  ngOnInit(): void {
    this.patientService.patientChange.subscribe(data => {
      //console.log(this.paginator);
      //luego de crear un nuevo patient estando en pageIndex=3 por ejemplo, se mostrara pageIndex=0 (esto al crear editar y eliminar)
      this.paginator.pageIndex = 0;
      this.createTable(data);
    });

    this.patientService.getMessageChange().subscribe(data => {
      this.snackBar.open(data, 'INFO', { duration: 2000, verticalPosition: "top", horizontalPosition: "right" });
    });

    /*
    // se mueve el codigo a ngAfterViewInit, pues en este momento this.paginator es undefined
    //
    //el size tiene que coincidir con el pageSize default al cargar la pagina
    //se hace uso de this.paginator.pageSize en lugar de un valor numerico (ejem: 5)
    //console.log(this.paginator);
    this.patientService.listPageable(0, this.paginator.pageSize).subscribe(data => {
      this.createTable(data);
    });
    */

    /*this.patientService.findAll().subscribe(data => {
      this.createTable(data);
    });*/
  }

  ngAfterViewInit() {
    //el size tiene que coincidir con el pageSize default al cargar la pagina
    //se hace uso de this.paginator.pageSize en lugar de un valor numerico (ejem: 5)
    //console.log(this.paginator);
    this.patientService.listPageable(0, this.paginator.pageSize).subscribe(data => {
      this.createTable(data);
    });
  }

  applyFilter(e: any) {
    this.dataSource.filter = e.target.value.trim().toLowerCase();
  }

  delete(idPatient: number){
    this.patientService.delete(idPatient).pipe(switchMap( ()=> {
      //return this.patientService.findAll();
      return this.patientService.listPageable(0, this.paginator.pageSize);
    }))
    .subscribe(data => {
      this.patientService.patientChange.next(data);
      this.patientService.setMessageChange('DELETED!');
    })
    ;
  }

  createTable(patients: any){
    this.dataSource = new MatTableDataSource(patients.content);    
    this.totalElements = patients.totalElements;
    //this.dataSource.paginator = this.paginator;
    //this.dataSource.sort = this.sort;        
  }

  showMore(e: any){
    console.log(e);
    this.patientService.listPageable(e.pageIndex, e.pageSize).subscribe(data => this.createTable(data));
  }

}
