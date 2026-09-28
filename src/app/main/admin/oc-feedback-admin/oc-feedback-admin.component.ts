import { Component, OnInit } from '@angular/core';
import { GcService } from 'app/service/gc/gc.service';

@Component({
  selector: 'app-oc-feedback-admin',
  templateUrl: './oc-feedback-admin.component.html',
  styleUrls: ['./oc-feedback-admin.component.scss']
})
export class OcFeedbackAdminComponent implements OnInit {
  responses: any[] = [];
  loading = false;
  errorMessage = '';

  constructor(private gcService: GcService) {}

  ngOnInit(): void {
    this.loadResponses();
  }

  loadResponses(): void {
    this.loading = true;
    this.gcService.getOcFeedbackList().subscribe(
      (res: any) => {
        this.loading = false;
        if (res && res.status === 'OK') {
          this.responses = res.object || [];
        } else {
          this.errorMessage = res && res.message ? res.message : 'Unable to load feedback.';
        }
      },
      err => {
        this.loading = false;
        this.errorMessage = 'Unable to load feedback.';
      }
    );
  }

  downloadExcel(): void {
    this.gcService.downloadOcFeedbackExcel().subscribe(
      (response: any) => {
        const blob = response.body;
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'OC_Feedback.xlsx';
        link.click();
        window.URL.revokeObjectURL(url);
      },
      () => {
        this.errorMessage = 'Unable to download Excel file.';
      }
    );
  }
}
