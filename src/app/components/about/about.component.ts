import { Component, OnInit } from '@angular/core';
import { AboutService } from 'src/app/services/about.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

  public totalProducts;
  public totalOrders; 

  constructor(private abooutService: AboutService) { }

  ngOnInit() {
    this.abooutService.getProductsTotal().subscribe( totalProducts => {
      this.totalProducts = totalProducts['total_products'];
    }, err => {
      alert("Error: " + err.message);
    });
    this.abooutService.getOrdersTotal().subscribe( totalOrders => {
      this.totalOrders = totalOrders['total_orders'];
    }, err => {
      alert("Error: " + err.message);
    });
  }

}