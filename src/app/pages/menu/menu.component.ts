import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs';
import { Menu } from 'src/app/model/menu';
import { MenuService } from 'src/app/service/menu.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  displayedColumns: string[] = ['id', 'name', 'icon', 'url', 'ordermenu', 'actions'];
  dataSource: MatTableDataSource<Menu>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  totalElements: number;

  constructor(
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private menuService: MenuService
  ) { }

  ngOnInit(): void {
    this.menuService.getMenuChangeCrud().subscribe(data => {
      this.paginator.pageIndex = 0;
      this.createTable(data);
    });

    this.menuService.getMessageChange().subscribe(data => {
      this.snackBar.open(data, 'INFO', { duration: 2000, verticalPosition: "top", horizontalPosition: "right" });
    });

    /*
    this.menuService.findAll().subscribe(data => {
      this.createTable(data);
    });
    */
  }

  ngAfterViewInit() {
    this.menuService.listPageable(0, this.paginator.pageSize).subscribe(data => {
      this.createTable(data);
    });
  }

  applyFilter(e: any) {
    this.dataSource.filter = e.target.value.trim().toLowerCase();
  }

  delete(idMenu: number){
    this.menuService.delete(idMenu).pipe(switchMap( ()=> {
      //return this.menuService.findAll();
      return this.menuService.listPageable(0, this.paginator.pageSize);
    }))
    .subscribe(data => {
      this.menuService.setMenuChangeCrud(data);
      this.menuService.setMessageChange('DELETED!');
    })
    ;
  }

  createTable(menus: any){
    this.dataSource = new MatTableDataSource(menus.content);    
    this.totalElements = menus.totalElements;
    //this.dataSource.paginator = this.paginator;
    //this.dataSource.sort = this.sort;        
  }

  showMore(e: any){
    console.log(e);
    this.menuService.listPageable(e.pageIndex, e.pageSize).subscribe(data => this.createTable(data));
  }

  checkChildren(): boolean{
    return this.route.children.length != 0;
  }
}
