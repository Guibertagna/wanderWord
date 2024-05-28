import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/model/service/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  formLogar: FormGroup;

  constructor(private router: Router, private formBuilder: FormBuilder, private authService: AuthService) {
    this.formLogar = new FormGroup({
      email: new FormControl(''),
      senha: new FormControl(''),
    });
  }

  ngOnInit() {
    this.formLogar = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  get errorControl() {
    return this.formLogar.controls;
  }

  private logar() {
    this.authService.singIn(this.formLogar.value['email'], this.formLogar.value['senha']).then((res) => {
      this.router.navigate(['tabs/home']);
    }).catch((error) => {
      console.log(error.message);
    });
  }

  submitForm(): boolean {
    if (!this.formLogar.valid) {
      return false;
    } else {
      this.logar();
      return true;
    }
  }

  logarComGoogle(): void {
    this.authService.singInWithGoogle().then((res) => {
      this.router.navigate(['tabs/home']);
    }).catch((error) => {
      console.log(error.message);
    });
  }

  irParaSingUp() {
    console.log('to indo')
    this.router.navigate(['/singup']);
  }
}
