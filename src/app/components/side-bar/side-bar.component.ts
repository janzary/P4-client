import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CartItem, Cart } from 'src/app/models/cart';
import { SharedDataService } from 'src/app/services/shared-data.service';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.css']
})
export class SideBarComponent implements OnInit {
  @Input() addedItem: CartItem[];
  @Input() cartTotal: number;
  @Input() isLoggedIn: boolean;
  @Input() cart: Cart;
  @Output() cartCollapsed = new EventEmitter<boolean>();
  @Output() deletedItemArr = new EventEmitter<CartItem[]>();
  public collapseClicked: number = 1;
  public updatedItem: CartItem[];
  public itemQuantityChanged: number;
  public cartItemsList: Array<CartItem[]> = [];
  
 

  public constructor(private sharingData: SharedDataService,
    private cartService: CartService) { }

  ngOnInit() {
  }

  public getCollapseClicked() {
    return this.collapseClicked % 2 == 0 ? '5px' : '510px';
  }

  public timesClicked() {
    this.collapseClicked++;
    if (this.collapseClicked % 2 == 0) {
      this.cartCollapsed.emit(true);
    } else {
      this.cartCollapsed.emit(false);
    }
  }

  public updateQuantity(quantity, item_id) {
    this.itemQuantityChanged = item_id;
    this.cartService.updateQuantity(quantity, item_id).subscribe(res => {
      if (res['state'] === "success") {
        console.log(res['message']);
        this.displayUpdatedItem();
      }
    }, err => {
      console.log("Error: " + err.message);
    });

  }



  public displayUpdatedItem() {
    this.cartService.getCartItems(this.cart.id).subscribe(res => {
      if (res['state'] === "success") {
        console.log(res['message']);
        this.cartItemsList = res['message'];
        this.sharingData.setCartItems(this.cartItemsList); 
        this.updatedItem = this.cartItemsList.find(item => item['item_id'] == this.itemQuantityChanged);
        let index = this.addedItem.findIndex(item => item['item_id'] == this.itemQuantityChanged)
        this.addedItem[index].quantity = this.updatedItem['quantity'];
        this.addedItem[index].total_price = this.updatedItem['total_price'];
        this.cartTotal = this.cartItemsList.map(item => item['total_price']).reduce((a,b)=> {return a + b});
      }
    }, err => {
      console.log("Error: " + err.message);
    })
  }



  public deleteItem(id) {
    console.log(id)
    this.cartService.deleteItem(id).subscribe(res => {
      if (res['state'] === "success") {
        console.log(res['message']);
       let deletedItem : any = this.addedItem.filter(item => item.item_id == id); 
       this.deletedItemArr.emit(deletedItem);
       let index = this.addedItem.findIndex(x => x.item_id == id);
       this.addedItem.splice(index, 1);
       this.displayNewTotal();
      }
    }, err => {
      console.log("Error: " + err.message);
    });
  }

public displayNewTotal(){
  this.cartService.getCartItems(this.cart.id).subscribe(res => {
    if (res['state'] === "success") {
      console.log(res['message']);
      this.cartItemsList = res['message'];
      this.sharingData.setCartItems(this.cartItemsList); 
      this.cartTotal = this.cartItemsList.map(item => item['total_price']).reduce((a,b)=> {return a + b});
    }
  }, err => {
    console.log("Error: " + err.message);
  })
}



  public removeAllItems(){
    console.log(this.cart.id)
    this.cartService.emptyCart(this.cart.id).subscribe(res => {
      if (res['state'] === "success") {
        console.log(res['message']);  
        this.deletedItemArr.emit(this.addedItem);
        this.addedItem.splice(0, this.addedItem.length)   
        this.sharingData.setCartItems(this.addedItem)
      }
    }, err => {
      console.log("Error: " + err.message);
    });
  }

  



}
