import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs';
import { VitalSign } from 'src/app/model/vitalsign';
import { VitalsignService } from 'src/app/service/vitalsign.service';

@Component({
  selector: 'app-vitalsign',
  templateUrl: './vitalsign.component.html',
  styleUrls: ['./vitalsign.component.css']
})
export class VitalsignComponent implements OnInit {

  displayedColumns: string[] = ['id', 'patient', 'takenDate', 'temperature', 'pulse', 'respiratoryRate', 'actions'];
  dataSource: MatTableDataSource<VitalSign>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  totalElements: number;

  constructor(
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private vitalSignService: VitalsignService
  ) { }

  ngOnInit(): void {
    this.vitalSignService.getVitalSignChange().subscribe(data => {
      this.paginator.pageIndex = 0;
      this.createTable(data);
    });

    this.vitalSignService.getMessageChange().subscribe(data => {
      this.snackBar.open(data, 'INFO', { duration: 2000, verticalPosition: "top", horizontalPosition: "right" });
    });

    /*
    this.vitalSignService.findAll().subscribe(data => {
      this.createTable(data);
    });
    */
  }

  ngAfterViewInit() {
    this.vitalSignService.listPageable(0, this.paginator.pageSize).subscribe(data => {
      this.createTable(data);
    });
  }

  applyFilter(e: any) {
    //console.log(this.dataSource.filteredData);//pendiente como filtrar por nombre de patient
    this.dataSource.filter = e.target.value.trim().toLowerCase();
  }

  delete(idVitalSign: number){
    this.vitalSignService.delete(idVitalSign).pipe(switchMap( ()=> {
      //return this.vitalSignService.findAll();
      return this.vitalSignService.listPageable(0, this.paginator.pageSize);
    }))
    .subscribe(data => {
      this.vitalSignService.setVitalSignChange(data);
      this.vitalSignService.setMessageChange('DELETED!');
    })
    ;
  }

  createTable(vitalSigns: any){
    this.dataSource = new MatTableDataSource(vitalSigns.content);    
    this.totalElements = vitalSigns.totalElements;
    //this.dataSource.paginator = this.paginator;
    //this.dataSource.sort = this.sort;        
  }

  showMore(e: any){
    console.log(e);
    this.vitalSignService.listPageable(e.pageIndex, e.pageSize).subscribe(data => this.createTable(data));
  }

  checkChildren(): boolean{
    return this.route.children.length != 0;
  }
}
