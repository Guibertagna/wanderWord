import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/model/service/auth.service';

@Component({
  selector: 'app-singup',
  templateUrl: './singup.page.html',
  styleUrls: ['./singup.page.scss'],
})
export class SingupPage implements OnInit {
  formCadastrar: FormGroup;
  passwordType: string = 'password';
  passwordIcon: string = 'eye-off';
  confirmPasswordType: string = 'password';
  confirmPasswordIcon: string = 'eye-off';

  constructor(private router: Router, private formBuilder: FormBuilder, private authService: AuthService) { 
    this.formCadastrar = new FormGroup({
      email: new FormControl(''),
      senha: new FormControl(''),
      confsenha: new FormControl('') 
    });
  }

  ngOnInit() {
    this.formCadastrar = this.formBuilder.group({
      nome: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(6)]],
      confsenha: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  get errorControl() {
    return this.formCadastrar.controls;
  }

  cadastrar() {
    this.authService.signUpWithEmailAndPassword(this.formCadastrar.value['email'], this.formCadastrar.value['senha']).then((res) => {
      this.router.navigate(["tabs/home"]);
    }).catch((error) => {
      console.log(error.message);
    });
  }

  submitForm(): boolean {
    if (!this.formCadastrar.valid || this.formCadastrar.value['senha'] !== this.formCadastrar.value['confsenha']) {
      return false;
    } else {
      this.cadastrar();
      return true;
    }
  }

  togglePasswordVisibility() {
    this.passwordType = this.passwordType === 'password' ? 'text' : 'password';
    this.passwordIcon = this.passwordIcon === 'eye-off' ? 'eye' : 'eye-off';
  }

  toggleConfirmPasswordVisibility() {
    this.confirmPasswordType = this.confirmPasswordType === 'password' ? 'text' : 'password';
    this.confirmPasswordIcon = this.confirmPasswordIcon === 'eye-off' ? 'eye' : 'eye-off';
  }
}
  