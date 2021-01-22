import { Component, OnInit, ViewChild } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { IonContent } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/firestore';
import { CategorieService } from 'src/app/services/categories/categorie.service';
import { Categorie } from 'src/app/interfaces/categorie';
import { Product } from 'src/app/interfaces/product';
import { ProdService } from 'src/app/services/products/prod.service';
import { first } from 'rxjs/operators';
import { map } from 'rxjs/operators';



@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})

export class HomePage implements OnInit {
  @ViewChild(IonContent, { static: false }) content: IonContent;
  catArray = new Array<Categorie>()
  prodArray=new Array<Product>()
  prodList: any;
 

  constructor(public menuCtrl: MenuController,
    private catService: CategorieService, private prodService: ProdService,
    private firestore: AngularFirestore) {
     
  }

  async ngOnInit() {
    this.loadCategories()
    this.loadProducts() 
 
  }

  ionViewWillEnter() {
    this.menuCtrl.enable(true);
  }
  loadCategories() {
    this.catService.getCategories().subscribe((data) => {
      this.catArray = data
      console.log(this.catArray);
    })
  }
loadProducts(){
  this.prodService.getAllProducts().subscribe(data=>{
    this.prodArray=data
  })
}
  ScrollToTop() {
    this.content.scrollToTop();
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
  async filterList(evt) {
    this.prodList= await this.initializeItems() 
    const searchTerm = evt.srcElement.value;
    console.log(searchTerm);
    if (!searchTerm) {
      this.prodList=[]
      return;
    }
      this.prodList = this.prodList.filter(currentFood => {
       if (currentFood.name && searchTerm) {
        return (currentFood.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1);
      }
    });
  }
  
 
  }