import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs';
import { Role } from 'src/app/model/role';
import { RoleService } from 'src/app/service/role.service';

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.css']
})
export class RoleComponent implements OnInit {

  displayedColumns: string[] = ['id', 'name', 'description', 'actions'];
  dataSource: MatTableDataSource<Role>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  totalElements: number;

  constructor(
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private roleService: RoleService
  ) { }

  ngOnInit(): void {
    this.roleService.getRoleChange().subscribe(data => {
      this.paginator.pageIndex = 0;
      this.createTable(data);
    });

    this.roleService.getMessageChange().subscribe(data => {
      this.snackBar.open(data, 'INFO', { duration: 2000, verticalPosition: "top", horizontalPosition: "right" });
    });

    /*
    this.roleService.findAll().subscribe(data => {
      this.createTable(data);
    });
    */
  }

  ngAfterViewInit() {
    this.roleService.listPageable(0, this.paginator.pageSize).subscribe(data => {
      this.createTable(data);
    });
  }

  applyFilter(e: any) {
    this.dataSource.filter = e.target.value.trim().toLowerCase();
  }

  delete(idRole: number){
    this.roleService.delete(idRole).pipe(switchMap( ()=> {
      //return this.roleService.findAll();
      return this.roleService.listPageable(0, this.paginator.pageSize);
    }))
    .subscribe(data => {
      this.roleService.setRoleChange(data);
      this.roleService.setMessageChange('DELETED!');
    })
    ;
  }

  createTable(roles: any){
    this.dataSource = new MatTableDataSource(roles.content);    
    this.totalElements = roles.totalElements;
    //this.dataSource.paginator = this.paginator;
    //this.dataSource.sort = this.sort;        
  }

  showMore(e: any){
    console.log(e);
    this.roleService.listPageable(e.pageIndex, e.pageSize).subscribe(data => this.createTable(data));
  }

  checkChildren(): boolean{
    return this.route.children.length != 0;
  }
}
