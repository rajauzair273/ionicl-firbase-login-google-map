import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { BehaviorSubject } from 'rxjs';
import * as firebase from 'firebase';
import { AngularFirestore } from '@angular/fire/firestore';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';


export class AuthInfo {
  constructor(public $uid: string) {}

  isLoggedIn() {
    return !!this.$uid;
  }
}

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  static UNKNOWN_USER = new AuthInfo('');
  db = firebase.firestore();
  public authInfo$: BehaviorSubject<AuthInfo> = new BehaviorSubject<AuthInfo>(
    ApiService.UNKNOWN_USER
  );
  constructor(
    private fireAuth: AngularFireAuth,
    private adb: AngularFirestore,
    private http: HttpClient
  ) {}

  public checkAuth() {
    return new Promise((resolve, reject) => {
      this.fireAuth.auth.onAuthStateChanged((user) => {
        console.log(user);
        if (user) {
          localStorage.setItem('uid', user.uid);
          resolve(user);
        } else {
          this.logout();
          resolve(false);
        }
      });
    });
  }

  public login(email: string, password: string): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.fireAuth.auth
        .signInWithEmailAndPassword(email, password)
        .then((res) => {
          if (res.user) {
            this.db
              .collection('users')
              .doc(res.user.uid)
              .update({
                fcm_token: localStorage.getItem('fcm')
                  ? localStorage.getItem('fcm')
                  : '',
              });
            this.authInfo$.next(new AuthInfo(res.user.uid));
            resolve(res.user);
          }
        })
        .catch((err) => {
          this.authInfo$.next(ApiService.UNKNOWN_USER);
          reject(`login failed ${err}`);
        });
    });
  }

  public register(
    email: string,
    password: string,
    fullname: string
  ): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.fireAuth.auth
        .createUserWithEmailAndPassword(email, password)
        .then((res) => {
          if (res.user) {
            this.db
              .collection('users')
              .doc(res.user.uid)
              .set({
                uid: res.user.uid,
                email: email,
                fullname: fullname,
                type: 'user',
                status: 'active'
              });
            this.authInfo$.next(new AuthInfo(res.user.uid));
            resolve(res.user);
          }
        })
        .catch((err) => {
          this.authInfo$.next(ApiService.UNKNOWN_USER);
          reject(`login failed ${err}`);
        });
    });
  }

  public resetPassword(email: string): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.fireAuth.auth
        .sendPasswordResetEmail(email)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(`reset failed ${err}`);
        });
    });
  }

  public logout(): Promise<void> {
    this.authInfo$.next(ApiService.UNKNOWN_USER);
    if(localStorage.getItem('uid')){
      this.db.collection('users').doc(localStorage.getItem('uid')).update({ "fcm_token": firebase.firestore.FieldValue.delete()  })

    }
    return this.fireAuth.auth.signOut();
  }

  public getProfile(id): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.adb
        .collection('users')
        .doc(id)
        .get()
        .subscribe(
          (profile) => {
            resolve(profile.data());
          },
          (error) => {
            reject(error);
          }
        );
    });
  }
  
}