import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { AmountService }   from './amount.service';

export class Quotation {
  constructor(
    public id: number,
    public sourceAmount: number,
    public sourceCurrency: string,
    public destinationAmount: number,
    public destinationCurrency: string,
    public expiresAt: string) {}
}

@Component({
  selector: 'app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [ AmountService ]
})
export class AppComponent { }
