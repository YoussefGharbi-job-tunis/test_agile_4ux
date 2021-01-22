import { Component, OnInit } from '@angular/core';
import { SalesUnitService } from 'src/app/services/salesUnit/sales-unit.service';
import { AlertController, ToastController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';


@Component({
  selector: 'app-list-sales-unit',
  templateUrl: './list-sales-unit.page.html',
  styleUrls: ['./list-sales-unit.page.scss'],
})
export class ListSalesUnitPage implements OnInit {
  unitList: any[];
  unitListBackup: any[];
  loading: any;

  
  constructor(private salesUnitService:SalesUnitService,
    public alertController: AlertController,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private router:Router,
    ) { }

  async ngOnInit() {
  
   this.loadSalesUnit()
    console.log(this.unitList);
  }
  loadSalesUnit(){
    this.salesUnitService.getSalesUnits().subscribe((data)=>{
      this.unitList=data
      this.unitList.sort((a,b)=>{
        
        var A=a.libelle.toLowerCase(),B=b.libelle.toLowerCase()
        if (A < B) //sort string ascending
           return -1 
      })
      console.log(this.unitList);
      
    })
  }

  async delete(id: string) {
    await this.presentLoading()
    try {
      await this.salesUnitService.deleteSalesUnit(id)
      this.loading.dismiss();
      this.router.navigate(["list-sales-unit"])
    } catch (error) {
      console.log(error.message);
      
      this.presentToast('error');
    }
  }


  async presentToast(message: string) {
    const toast = await this.toastCtrl.create({ message, duration: 2000 });
    toast.present();
  }
  async presentLoading() {
    this.loading = await this.loadingCtrl.create({ message: 'wait...' });
    return this.loading.present();
  }
 
 
}
