import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ToastController, ActionSheetController, MenuController } from '@ionic/angular';
import { Product } from 'src/app/interfaces/product';
import { ProdService } from 'src/app/services/products/prod.service';
import { first } from 'rxjs/operators';
import { map } from 'rxjs/operators';
@Component({
  selector: 'app-stock',
  templateUrl: './stock.page.html',
  styleUrls: ['./stock.page.scss'],
})
export class StockPage implements OnInit {

  private loading: any;
  public products = new Array<Product>();
  firestore: any;
  prodList: any;

  constructor(
    private productService: ProdService,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController, 
     public actionSheetController: ActionSheetController, 
     private router:Router,public menuCtrl: MenuController) {}

  ngOnInit() { 
    this.loadProducts()
  }

  loadProducts(){
    this.productService.getProducts().subscribe(data=>{
       this.products=data;
       })
   }
   
   async deleteProduct(id: string) {
    await this.presentLoading()
    try {
      await this.productService.deleteProduct(id)
      this.loading.dismiss();
        this.router.navigate(["/home"])
    } catch (error) {
      this.presentToast('error');
    }
  }


  
  async initializeItems(): Promise<any> {
    const prodList = await this.firestore.collection('Products')
      .snapshotChanges().pipe(map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;          
          return { id, ...data };
        });
      }),first()).toPromise();
      
  
    return prodList;
  }

  



  filterList(evt) {
    
    const searchTerm = evt.srcElement.value;
    if (!searchTerm) {
      return;
    }
  this.products = this.products.filter(currentGoal => {
      if (currentGoal.name && searchTerm) {
      if (currentGoal.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1) {
        return true;
        }
        return false;
      }
    });
  }
  async presentLoading() {
    this.loading = await this.loadingCtrl.create({ message: 'wait...' });
    return this.loading.present();
  }
  async presentToast(message: string) {
    const toast = await this.toastCtrl.create({ message, duration: 2000 });
    toast.present();
  }


  

}
