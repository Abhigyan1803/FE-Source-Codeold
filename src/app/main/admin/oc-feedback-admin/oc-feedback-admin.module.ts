import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'app/material/material.module';
import { OcFeedbackAdminComponent } from './oc-feedback-admin.component';

@NgModule({
  declarations: [OcFeedbackAdminComponent],
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule.forChild([{ path: '', component: OcFeedbackAdminComponent }])
  ]
})
export class OcFeedbackAdminModule {}
