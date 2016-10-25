import { Component, OnInit, AfterViewInit, ViewChild, Renderer, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

import { QuotationService } from '../shared/quotation.service';
import { ApiService }   from '../shared/api.service';


@Component({
  selector: 'quotation',
  templateUrl: './quotation.component.html',
  styleUrls: ['./quotation.component.css'],
  providers: []
})
export class QuotationComponent implements OnInit, AfterViewInit {
  quotationForm: FormGroup;
  loading: boolean;
  error: boolean;
  @ViewChild('userName') input: ElementRef

  constructor (
    private quotationService:QuotationService,
    private apiService:ApiService,
    private fb: FormBuilder,
    private renderer:Renderer) {

    this.loading = false;
    this.error = false;

    this.quotationForm = fb.group({
      'sourceAmount': [null, []],
      'destinationAmount': [25, [Validators.required, this.validAmount]],
      'userName': ['', []],
      'hasAccount': [false, [this.hasAccount]]
    })

    // subscribe to getQuotation() on destinationAmount changes
    this.quotationForm.controls['destinationAmount']
    .valueChanges
    .debounceTime(300)
    .subscribe(value => {
      this.quotationForm.patchValue({ 'sourceAmount': null })
      if (this.quotationForm.controls['destinationAmount'].valid) {
        this.getQuotation(value)
      } else {
        this.error = false;
      }
    });
  }

  getQuotation (destinationAmount:number): void {
    // Reset form status vars
    this.loading = true;
    this.error = false

    this.apiService.getQuotation(destinationAmount)
    .then(quotation => {
      this.quotationForm.controls['sourceAmount'].setValue(quotation.sourceAmount);
      this.quotationForm.controls['destinationAmount'].setValue(quotation.destinationAmount, {emitEvent: false});
      // Quotation successfully retrieved.
      this.error = false;
      this.loading = false;
    })
    .catch(err => {
      this.loading = false;
      this.error = true;
    });
  }

  submitForm() {
    let value = this.quotationForm.value.destinationAmount;
    this.quotationService.changeAmount(value)
    console.log(this.quotationForm)
  }

  ngOnInit() {
    // Call getQuotation with default values
    this.getQuotation(this.quotationForm.value.destinationAmount);
  }

  ngAfterViewInit() {
    // Set focus on userName input
    // FIXME!
    setTimeout(() => {
      this.renderer.invokeElementMethod(this.input.nativeElement, 'focus');
    }, 500)
  }

  toggleHasAccount() {
    this.quotationForm.controls['hasAccount'].setValue(!this.quotationForm.controls['hasAccount'].value);
    console.log(this.quotationForm)
  }

  validAmount(control: FormControl) {
    let value = control.value;
    if (isNaN(value) || (value <= 0) || (value >= 1000)) {
      return { invalidAmount: true }
    }
  }

  hasAccount(control: FormControl) {
    if (control.value !== true) {
      return { hasAccount: true }
    }
  }
}
