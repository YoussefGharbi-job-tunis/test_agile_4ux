import { Component, OnInit} from '@angular/core';
import { LoadingController, ToastController, MenuController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { Router } from '@angular/router';
import * as firebase from 'firebase';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
 
  private loading: any;

  constructor(
    private authService: AuthService,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    public keyboard: Keyboard,
    public router:Router,public menuCtrl: MenuController
  ) { }

  ngOnInit() { }

 
  async login(email,password) {
    await this.presentLoading();

    try {
      await  this.authService.login(email, password).then( res =>{
       
       this.router.navigate(['/home']);
      })
    } catch (error) {
      this.presentToast(error.message);
    } finally {
      this.loading.dismiss();
    }
  }

  
  async presentLoading() {
    this.loading = await this.loadingCtrl.create({ message: 'wait...' });
    return this.loading.present();
  }

  async presentToast(message: string) {
    const toast = await this.toastCtrl.create({ message, duration: 2000 });
    toast.present();
  }

  ionViewWillEnter() {
    this.menuCtrl.enable(false);
  }
}