import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GcService } from 'app/service/gc/gc.service';
import { AuthService } from 'app/service/auth-service/auth.service';

@Component({
  selector: 'app-oc-feedback',
  templateUrl: './oc-feedback.component.html',
  styleUrls: ['./oc-feedback.component.scss']
})
export class OcFeedbackComponent implements OnInit {
  feedbackForm: FormGroup;
  submitting = false;
  successMessage = '';
  errorMessage = '';

  cadet: any = {};
  displayDate = new Date();
  termYear = 'SPRING TERM 2026';

  readonly ratings = [
    { value: 5, label: 'Excellent' },
    { value: 4, label: 'Very Good' },
    { value: 3, label: 'Good' },
    { value: 2, label: 'Fair' },
    { value: 1, label: 'Poor' }
  ];

  readonly questions = [
    { section: 'Q1. Please rate the following wrt Offr Cdt Accommodation:', type: 'rating', key: 'furnitureIssued', number: '1.1', label: 'Furniture issued' },
    { type: 'rating', key: 'electricalGadgets', number: '1.2', label: 'Serviceability of electrical gadgets' },
    { type: 'rating', key: 'electricityHotWater', number: '1.3', label: 'Electricity and hot water supply' },
    { type: 'yesNo', key: 'leakageSeepage', number: '1.4', label: 'Leakage/seepage in cabin or washroom' },
    { section: 'Q2. How do you rate the following wrt VB Mess?', type: 'rating', key: 'messFoodQuality', number: '2.1', label: 'Quality of food' },
    { type: 'rating', key: 'messMenuVariety', number: '2.2', label: 'Variety in menu' },
    { type: 'rating', key: 'messQuantity', number: '2.3', label: 'Quantity and adequacy of food' },
    { type: 'rating', key: 'messStaffBehaviour', number: '2.4', label: 'Staff behaviour and service attitude' },
    { type: 'rating', key: 'messOverall', number: '2.5', label: 'Overall satisfaction with mess functioning' },
    { section: 'Q3. Rate the quality and variety of clothing items purchased from Kapoor & Co.', type: 'rating', key: 'kapoorQuality', number: '3.1', label: 'Quality of items' },
    { type: 'rating', key: 'kapoorPrice', number: '3.2', label: 'Reasonable price' },
    { type: 'rating', key: 'kapoorStitching', number: '3.3', label: 'Stitching/fitting quality' },
    { section: 'Q4. Rate the quality and variety of clothing items purchased from Mec Gear.', type: 'rating', key: 'mecQuality', number: '4.1', label: 'Quality of items' },
    { type: 'rating', key: 'mecPrice', number: '4.2', label: 'Reasonable price' },
    { type: 'rating', key: 'mecOverall', number: '4.3', label: 'Overall satisfaction' },
    { section: 'Q5. Were all ordnance issue items and web equipment issued in serviceable condition?', type: 'yesNo', key: 'ordIssueServiceable', number: '5', label: 'Select one response' },
    { section: 'Q6. Bicycles', type: 'rating', key: 'bicycleCondition', number: '6.1', label: 'Condition on issue' },
    { type: 'rating', key: 'bicycleMaintenance', number: '6.2', label: 'Maintenance standards' },
    { section: 'Q7. Medical support', type: 'rating', key: 'medicalAccess', number: '7.1', label: 'Ease of access during training hours' },
    { type: 'rating', key: 'medicalBehaviour', number: '7.2', label: 'Behaviour of medical staff' },
    { section: 'Q9. Miscellaneous issues', type: 'banking', key: 'bankingFacilities', number: '9.1', label: 'Are banking facilities at IMA through ATMs/e-Lobbies sufficient?' },
    { type: 'rating', key: 'csdStores', number: '9.2.1', label: 'CSD extension counter: adequacy of stores' },
    { type: 'rating', key: 'csdBillingCounters', number: '9.2.2', label: 'CSD extension counter: number of billing counters' }
  ];

  readonly bankingOptions = ['Yes', 'No', 'More ATMs / e-Lobbies reqd'];

  constructor(
    private fb: FormBuilder,
    private gcService: GcService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const loginResponse = this.authService.getLocalStorageUser();
    this.cadet = loginResponse && loginResponse.object ? loginResponse.object : (loginResponse || {});
    this.termYear = ((this.cadet.termName || this.cadet.termSession || 'SPRING TERM') + ' ' +
      (this.cadet.year || '2026')).trim().toUpperCase();

    const controls: any = {
      acadNo: [this.cadet.academyNo || this.cadet.serialNo || '', Validators.required],
      rank: [this.cadet.cadetRank || 'Officer Cadet', Validators.required],
      cabinNo: ['', Validators.required],
      leakageSeepage: ['', Validators.required],
      ordIssueServiceable: ['', Validators.required],
      suggestion1: ['', [Validators.maxLength(1000)]],
      suggestion2: ['', [Validators.maxLength(1000)]],
      suggestion3: ['', [Validators.maxLength(1000)]],
      confirmation: [false, Validators.requiredTrue]
    };
    this.questions.forEach(q => {
      if (q.type === 'rating') {
        controls[q.key] = ['', Validators.required];
      } else {
        controls[q.key] = ['', Validators.required];
      }
    });
    this.feedbackForm = this.fb.group(controls);
  }

  submit(): void {
    this.successMessage = '';
    this.errorMessage = '';
    if (this.feedbackForm.invalid) {
      this.feedbackForm.markAllAsTouched();
      this.errorMessage = 'Please complete all required fields before submitting.';
      return;
    }

    const payload = this.feedbackForm.value;
    this.submitting = true;
    this.gcService.submitOcFeedback(payload).subscribe(
      (res: any) => {
        this.submitting = false;
        if (res && res.status === 'OK') {
          this.successMessage = 'Feedback submitted successfully.';
          this.feedbackForm.reset({
            rank: 'Officer Cadet',
            confirmation: false
          });
        } else {
          this.errorMessage = res && res.message ? res.message : 'Unable to submit feedback.';
        }
      },
      err => {
        this.submitting = false;
        this.errorMessage = err && err.error && err.error.message ? err.error.message : 'Unable to submit feedback.';
      }
    );
  }
}
