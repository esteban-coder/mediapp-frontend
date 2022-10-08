import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { Exam } from 'src/app/model/exam';
import { ExamService } from 'src/app/service/exam.service';

@Component({
  selector: 'app-exam-edit',
  templateUrl: './exam-edit.component.html',
  styleUrls: ['./exam-edit.component.css']
})
export class ExamEditComponent implements OnInit {

  id: number;
  isEdit: boolean;
  form: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private examService: ExamService
  ) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      'idExam': new FormControl(0),
      'name': new FormControl('', [Validators.required, Validators.minLength(3)]),
      'description': new FormControl('', [Validators.required, Validators.minLength(3)])      
    });

    this.route.params.subscribe(data => {
      this.id = data['id'];
      this.isEdit = data['id'] != null;
      this.initForm();
    })

  }

  initForm() {
    if (this.isEdit) {

      this.examService.findById(this.id).subscribe(data => {
        this.form = new FormGroup({
          'idExam': new FormControl(data.idExam),
          'name': new FormControl(data.name, [Validators.required, Validators.minLength(3)]),
          'description': new FormControl(data.description, [Validators.required, Validators.minLength(3)])          
        });
      });
    }
  }

  get f() {
    return this.form.controls;
  }

  operate() {
    if (this.form.invalid) { return; }

    let exam = new Exam();
    exam.idExam = this.form.value['idExam'];
    exam.name = this.form.value['name'];
    exam.description = this.form.value['description'];
    

    if (this.isEdit) {
      //UPDATE
      //PRACTICA COMUN
      this.examService.update(exam).subscribe(() => {
        this.examService.findAll().subscribe(data => {
          this.examService.setExamChange(data);
          this.examService.setMessageChange('UPDATED!')
        });
      });
    } else {      
      //INSERT
      //PRACTICA IDEAL
      this.examService.save(exam).pipe(switchMap(()=>{        
        return this.examService.findAll();
      }))
      .subscribe(data => {
        this.examService.setExamChange(data);
        this.examService.setMessageChange("CREATED!")
      });
    }
    this.router.navigate(['/pages/exam']);
  }


}
