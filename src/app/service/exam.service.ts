import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Exam } from '../model/exam';
import { GenericService } from './generic.service';

@Injectable({
  providedIn: 'root'
})
export class ExamService extends GenericService<Exam>{

  private examChange = new Subject<Exam[]>;
  private messageChange = new Subject<string>;

  constructor(protected override http: HttpClient) {
    super(
      http,
      `${environment.HOST}/exams`
    );
  }

  //////////get set/////////////
  setExamChange(list: Exam[]) {
    this.examChange.next(list);
  }

  getExamChange() {
    return this.examChange.asObservable();
  }

  setMessageChange(message: string) {
    this.messageChange.next(message);
  }

  getMessageChange() {
    return this.messageChange.asObservable();
  }

}
