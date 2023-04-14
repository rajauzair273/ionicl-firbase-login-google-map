import { UtilService } from './../services/util.service';
import { ApiService } from './../services/api.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, LoadingController, Platform } from '@ionic/angular';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  icon = 'eye-off'; 
  credentials: FormGroup | any ;
  constructor(
    private fb: FormBuilder,
    public util: UtilService,
    private api: ApiService,
    private router: Router , 
    private platform : Platform , 
    private alertCtrl : AlertController
  ) {}

  ngOnInit() {
    this.credentials = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }
  toggle() {
    if (this.icon == 'eye-off') {
      this.icon = 'eye';
    } else {
      this.icon = 'eye-off';
    }
  }

  

  // Easy access for form fields
  get email() {
    return this.credentials.get('email');
  }

  get password() {
    return this.credentials.get('password');
  }

  async login() {
    await this.util.show();

    this.api.login(this.credentials.get('email')?.value, this.credentials.get('password')?.value).then((userData: any) => {
      this.api.getProfile(userData.uid).then(async (info) => {
        this.util.hide()
       
        if (info && info.type === 'user') {


          localStorage.setItem('uid', userData.uid);
         
         
          this.router.navigate(['/']);
        } else {
          this.api.logout();
          const alert = await this.alertCtrl.create({
            header: 'Error',
            subHeader: 'Unauthorized user',
            message: 'This is an alert!',
            buttons: ['OK'],
          });
      
          await alert.present();
          
        }
      }).catch(err => {
       
        this.util.showToast(`${err}`, 'danger', 'bottom');
      });
    }).catch((err )=>{
      this.util.hide();

      if(err.code === 'auth/user-not-found'){
        this.util.showSimpleAlert('Please try again!', 'Registration failed');
      }else{
        this.util.showSimpleAlert('Please try again!', 'Registration failed');
      }
        
    });
  }

 
}