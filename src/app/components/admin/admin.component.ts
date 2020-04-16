import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SharedDataService } from 'src/app/services/shared-data.service';
import { ProductsService } from 'src/app/services/product.service';
import { Category } from 'src/app/models/category';
import { Product } from 'src/app/models/product';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  public updateForm: FormGroup;
  public addForm: FormGroup;
  public categories: Category[];
  public user: User;
  public isLoggedIn: boolean = true;
  public products: Product[];
  public searchInput: string = '';
  public inputVal: boolean = false;
  public searchClicked: boolean = false;
  public product_id: number;
  public product_name: string;
  public category_id: number;
  public price: number;
  public image: string;
  public msg: string;
  public addSelected: boolean = false;
  public updateSelected: boolean = false;
  public selectedFile: File = null;
  

  constructor(private productsService: ProductsService,
    private router: Router,
    private sharingService: SharedDataService,
    private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.addForm = this .formBuilder.group({
      productName: ["", Validators.required],
      category: ["", Validators.required],
      price: ["", Validators.required],
      image: ["", Validators.required]
    })

    this.updateForm = this .formBuilder.group({
      productId: ["", Validators.required],
      productName: ["", Validators.required],
      category: ["", Validators.required],
      price: ["", Validators.required],
      image: ["", Validators.required]
    })

    this.isLoggedIn = this.sharingService.getLoginData();
    this.user = this.sharingService.getUserData();

    this.productsService.getCategories().subscribe(categories => {
      this.categories = categories;
    }, err => {
      alert("Error: " + err.message);
    });

    this.displayAllProducts();

  }


  public getFileName(event){
    this.selectedFile = <File>event.target.files[0];
  }


 public fadeOutMsg() {
    setTimeout( () => {
           this.msg = null;
        }, 4000);
   }



  public displayAddForm(){
    this.msg = null;
    this.updateSelected = false; 
    this.addSelected = true;
  }


  public displayUpdateForm(){
    this.msg = null;
    this.addSelected = false;
    this.updateSelected = true;
  }

  public signOut() {
    localStorage.removeItem('Token');
    this.isLoggedIn = false;
    this.sharingService.setLoginData(this.isLoggedIn);
    this.router.navigateByUrl('/');

  }


  public displayAllProducts() {
    this.inputVal = false;
    this.productsService.getAllProducts().subscribe(products => {
      this.searchClicked = false;
      this.products = products;
    }, err => {
      console.log("Error: " + err.message);
    });
  }


  public displayOneCategory(event) {
    this.searchInput = '';
    let id = event.currentTarget.attributes.id.value;
    this.productsService.getOneCategory(id).subscribe((res) => {
      this.searchClicked = false;
      this.products = res;
      if (this.products.length < 1) {

      }
    }, err => console.log(err));
  }



  public triggerSearch() {
    if (this.searchInput === '') {
      return this.inputVal = false;
    }
    this.inputVal = true;
    this.searchClicked = true;
  }

  public unclickSearch() {
    this.inputVal = true;
    this.searchClicked = false;
    this.displayAllProducts();
  }

  

  public add() {
    if(!this.selectedFile){
      return this.msg = `missing field input`
    }
    let token = localStorage.getItem('Token');
    this.productsService.addProduct(token,
      this.product_name,
      this.category_id,
      this.price,
      this.selectedFile.name).subscribe((res) => {
        this.msg = (res['message']);
        this.fadeOutMsg();
        this.upload();
        this.addForm.reset();
        this.selectedFile = null;
      }, err => console.log(err));

  }



  public update() {
    if(!this.selectedFile){
      return this.msg = `missing field input`
    }
    let token = localStorage.getItem('Token');
    this.productsService.updateProduct(token,
      this.product_id,
      this.product_name,
      this.category_id,
      this.price,
      this.selectedFile.name).subscribe((res) => {
        this.msg = (res['message']);
        this.fadeOutMsg();
        this.upload();
        this.updateForm.reset();
        this.selectedFile = null;
      }, err => console.log(err));

  }



  public upload() {
  let fd = new FormData();
   fd.append('newImage', this.selectedFile, this.selectedFile.name);
    this.productsService.uploadImage(fd).subscribe((res) => {
      this.msg += `, ${res.message} `;
      this.fadeOutMsg();
      console.log(res)
    }, err => console.log(err));

  }

  


  

}
