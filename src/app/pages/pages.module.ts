import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { MaterialModule } from '../material/material.module';
import { PatientComponent } from './patient/patient.component';
import { PatientEditComponent } from './patient/patient-edit/patient-edit.component';
import { MedicComponent } from './medic/medic.component';
import { MedicDialogComponent } from './medic/medic-dialog/medic-dialog.component';
import { ExamComponent } from './exam/exam.component';
import { ExamEditComponent } from './exam/exam-edit/exam-edit.component';
import { ExamDialogComponent } from './exam/exam-dialog/exam-dialog.component';
import { SpecialtyComponent } from './specialty/specialty.component';
import { SpecialtyEditComponent } from './specialty/specialty-edit/specialty-edit.component';
import { ConsultComponent } from './consult/consult.component';
import { ConsultAutocompleteComponent } from './consult-autocomplete/consult-autocomplete.component';
import { ConsultWizardComponent } from './consult-wizard/consult-wizard.component';
import { SearchComponent } from './search/search.component';
import { ReportComponent } from './report/report.component';
import { LayoutComponent } from './layout/layout.component';
import { PagesRoutingModule } from './pages-routing.module';
import { CommonModule } from '@angular/common';
import { SearchDialogComponent } from './search/search-dialog/search-dialog.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { Not403Component } from './not403/not403.component';
import { Not404Component } from './not404/not404.component';
import { ProfileComponent } from './profile/profile.component';
import { VitalsignComponent } from './vitalsign/vitalsign.component';
import { VitalsignEditComponent } from './vitalsign/vitalsign-edit/vitalsign-edit.component';
import { PatientDialogComponent } from './patient/patient-dialog/patient-dialog.component';
import { RoleComponent } from './role/role.component';
import { RoleEditComponent } from './role/role-edit/role-edit.component';
import { MenuComponent } from './menu/menu.component';
import { MenuEditComponent } from './menu/menu-edit/menu-edit.component';

@NgModule({
    imports: [
        MaterialModule,
        CommonModule,
        HttpClientModule,
        ReactiveFormsModule, //para uso de forms
        FormsModule, //para two-way binding
        FlexLayoutModule,
        PdfViewerModule,        
        PagesRoutingModule
    ],
    exports: [],
    declarations: [
        PatientComponent,
        PatientEditComponent,
        MedicComponent,
        MedicDialogComponent,
        ExamComponent,
        ExamEditComponent,
        SpecialtyComponent,
        SpecialtyEditComponent,
        ExamDialogComponent,
        ConsultComponent,
        ConsultAutocompleteComponent,
        ConsultWizardComponent,
        SearchComponent,
        SearchDialogComponent,
        ReportComponent,
        LayoutComponent,
        DashboardComponent,
        Not403Component,
        Not404Component,
        ProfileComponent,
        VitalsignComponent,
        VitalsignEditComponent,
        PatientDialogComponent,
        RoleComponent,
        RoleEditComponent,
        MenuComponent,
        MenuEditComponent
    ],
    providers: [],
})
export class PagesModule { }
