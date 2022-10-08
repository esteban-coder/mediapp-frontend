import { Component, OnInit } from '@angular/core';
import { ConsultService } from 'src/app/service/consult.service';
import { Chart } from 'chart.js';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {

  type: string = 'line';
  chart: any;

  pdfSrc: string;

  filename: string;
  selectedFiles: FileList;
  imageData: any;

  constructor(
    private consultService: ConsultService,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    this.draw();

    this.consultService.readFile(1).subscribe(data => {
      //console.log(data);
      this.convert(data);
    })
  }

  convert(data: any){
    let reader = new FileReader();
    reader.readAsDataURL(data);
    reader.onloadend = () => {
      let base64 = reader.result;
      console.log(base64);
      this.imageData = base64;//si funciona sin aplicarle la sanacion
      //this.applySanitizer(base64);
    }
  }

  applySanitizer(base64: any){
    this.imageData = this.sanitizer.bypassSecurityTrustResourceUrl(base64);
  }

  draw(){
    this.consultService.callProcedureOrFunction().subscribe(data => {
      console.log(data);

      let dates = data.map(x => x.consultdate);
      let quantities = data.map(x => x.quantity);

      console.log(dates);
      console.log(quantities);

      this.chart = new Chart('canvas', {
        type: this.type,
        data: {
          labels: dates,
          datasets: [
            {
              label: 'Quantity',
              data: quantities,
              borderColor: "#3cba9f",
              fill: false,
              backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 0, 0.2)',
                'rgba(255, 159, 64, 0.2)'
              ]
            }
          ]
        },
        options: {
          legend: {
            display: true
          },
          scales: {
            xAxes: [{
              display: true
            }],
            yAxes: [{
              display: true,
              ticks: {
                beginAtZero: true
              }
            }],
          }
        }
      });
    });
  }

  change(type: string){
    this.type = type;
    if(this.chart != null){
      this.chart.destroy();
    }
    this.draw();
  }

  viewReport(){
    this.consultService.generateReport().subscribe(data => {      
      this.pdfSrc = window.URL.createObjectURL(data);
    });
  }

  downloadReport(){
    this.consultService.generateReport().subscribe(data => {
      const url = window.URL.createObjectURL(data);
      console.log(url);
      const a = document.createElement('a');
      a.setAttribute('style', 'display:none');
      document.body.appendChild(a);
      a.href = url;
      a.download = 'report.pdf';
      a.click();
    });
  }

  selectFile(e: any){    
    console.log(e);
    this.filename = e.target.files[0]?.name;
    this.selectedFiles = e.target.files;
    console.log(this.filename);
  }

  upload(){
    if(this.selectedFiles.item(0) != null){
      console.log(this.selectedFiles.item(0));
      this.consultService.saveFile(this.selectedFiles.item(0)).subscribe();
    }    
  }
}
