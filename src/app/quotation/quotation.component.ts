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
  @ViewChild('destinationInput') input: ElementRef

  constructor (
    private quotationService:QuotationService,
    private apiService:ApiService,
    private fb: FormBuilder,
    private renderer:Renderer) {

    this.loading = false;
    this.error = false;

    this.quotationForm = fb.group({
      'sourceAmount': null,
      'destinationAmount': [25, [Validators.required, this.validAmount]],
      'userName': [''],
    })

    // subscribe getQuotation() on destinationAmount changes
    this.quotationForm.controls['destinationAmount']
    .valueChanges
    .debounceTime(300)
    .subscribe(value => {
      this.quotationForm.patchValue({ 'sourceAmount': null })
      if (this.quotationForm.valid) {
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

  submitForm () {
    let value = this.quotationForm.value.destinationAmount;
    this.quotationService.changeAmount(value)
  }

  ngOnInit () {
    // Call getQuotation with default values
    this.getQuotation(this.quotationForm.value.destinationAmount);
  }

  ngAfterViewInit () {
    // Put focus on destinationAmount when app loads
    this.renderer.invokeElementMethod(this.input.nativeElement, 'focus');
  }

  validAmount(control: FormControl) {
    let value = control.value;
    if (isNaN(value) || (value <= 0) || (value >= 1000)) {
      return { invalidAmount: true }
    }
  }
}
