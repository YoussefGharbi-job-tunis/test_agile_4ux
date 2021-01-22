import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Product } from 'src/app/interfaces/product';
import { ProdService } from 'src/app/services/products/prod.service';
import { ActivatedRoute, Router } from '@angular/router';


import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-details-product',
  templateUrl: './details-product.page.html',
  styleUrls: ['./details-product.page.scss'],
})
export class DetailsProductPage implements OnInit {
  private productCode: string = null;
  public product: Product = {};
  productSubscription: any;
 

  @ViewChild('cart', { static: false, read: ElementRef }) fab: ElementRef;
  constructor(
    private productService: ProdService,
    private activatedRoute: ActivatedRoute ,
    private toastCtrl: ToastController,) {
    this.productCode = this.activatedRoute.snapshot.params['productCode'];

    if (this.productCode) this.loadProduct();
  }

  ngOnInit() { 
  
  }


  loadProduct() {
    this.productSubscription = this.productService.getProduct(this.productCode).subscribe(data => {
      this.product = data;
      console.log(this.product);
      
    });
  }
  async presentToast(message: string) {
    const toast = await this.toastCtrl.create({ message, duration: 1000 });
    toast.present();
  }
}
