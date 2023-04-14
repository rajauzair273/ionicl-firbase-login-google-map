import { ApiService } from './../services/api.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilService } from '../services/util.service';
import { NavController } from '@ionic/angular';
import { FormGroup, NgForm, FormBuilder, Validators } from '@angular/forms';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {
  icon = 'eye-off';
  login = { email: '', password: '', full_name: '', confirmPassword: '' };
  submitted = false;
  isLogin: boolean = false;

  data : any ;
  credentials: FormGroup | any ;
  constructor(
    private router: Router,
    private api: ApiService,
    private util: UtilService,
    private navCtrl: NavController ,
    private ac : ActivatedRoute , 
    public fb : FormBuilder
  ) {
      this.ac.queryParams.subscribe((res)=>{
        if(res.data){
          this.data = JSON.parse(res.data);
        }
      })
  }


  ngOnInit() {
    this.credentials = this.fb.group({
      full_name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }


  getValue(key){
    return this.credentials.get(key)?.value
  }
  onLogin() {
    
    if (this.credentials.valid) {
       this.util.show();
    
      this.isLogin = true;
      this.api.register(this.getValue('email') , this.getValue('password') , this.getValue('full_name')).then((userData) => {
       
        localStorage.setItem('uid', userData.uid);
        localStorage.setItem('help', userData.uid);
        this.api.getProfile(userData.uid).then((info) => {
          this.util.hide()
         
          if (info && info.type === 'user') {
            localStorage.setItem('userInfo' , JSON.stringify(info));
  
  
            localStorage.setItem('uid', userData.uid);
            localStorage.setItem('help', userData.uid);
            
            this.router.navigate(['/home']);
          } 
        })
      }).catch(err => {
        if (err) {
          console.log(err);
          this.util.showToast(`${err}`, 'danger', 'bottom');
        }
      }).then(el => this.isLogin = false);
    }
  }
  back() {
    this.navCtrl.back();
  }


  toggle() {
    if (this.icon == 'eye') {
      this.icon = 'eye-off';
    } else {
      this.icon = 'eye';
    }
  }
}