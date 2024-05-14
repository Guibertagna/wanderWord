import { Injectable, NgZone } from '@angular/core';
import { FirebaseService } from './firebase-service.service';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { getAuth, signInWithPopup, browserPopupRedirectResolver, GoogleAuthProvider, GithubAuthProvider } from 'firebase/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  userData : any;
  constructor(private firebase: FirebaseService, private fireAuth: AngularFireAuth, private router: Router, private ngZone: NgZone) { 
    this.fireAuth.authState.subscribe(user=> {
      if (user){
        this.userData = user;
        localStorage.setItem('user', JSON.stringify(this.userData));
      }else{
        localStorage.setItem('user', 'null')
      }
    });
  }

  public singIn(email: string, password: string) {
    return this.fireAuth.signInWithEmailAndPassword(email, password);
  }

  public signUpWithEmailAndPassword(email: string, password: string) {
    return this.fireAuth.createUserWithEmailAndPassword(email, password);
  }

  public recoverPassword(email: string) {
    return this.fireAuth.sendPasswordResetEmail(email);
  }

  public signOut() {
    return this.fireAuth.signOut().then(() => {
      localStorage.removeItem('user');
      this.router.navigate(['login']);
    });
  }

  public getUserLogged() {
    const user: any = JSON.parse(localStorage.getItem('user') || 'null');
    if (user != null) {
      return user;
    } else {
      return null;
    }
  }

  public isLoggedIn(): boolean {
    const user: any = JSON.parse(localStorage.getItem('user') || 'null');
    return user !== null ? true : false;
  }

  public singInWithGoogle() {
    const provider = new GoogleAuthProvider();
    const auth = getAuth();
    return signInWithPopup(auth, provider, browserPopupRedirectResolver);
  }
  
}

