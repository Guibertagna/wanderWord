  import { Component, OnInit } from '@angular/core';
  import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
  import { Router } from '@angular/router';
  import { AlertService } from 'src/app/common/alert.service';
  import { AuthService } from 'src/app/model/service/auth.service';

  @Component({
    selector: 'app-login',
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.scss'],
  })
  export class LoginPage implements OnInit {
    formLogar: FormGroup;

    constructor(private router: Router, private formBuilder: FormBuilder, private alertService: AlertService, private authService: AuthService) { 
      this.formLogar = new FormGroup({
        email: new FormControl(''),
        senha: new FormControl(''),
        Confsenha: new FormControl(''),
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
        this.alertService.dismissLoader();
        this.alertService.presentAlert('login', 'login realizado com sucesso');
        this.alertService.presentAlert('ola', 'seja bem vindo');
        this.router.navigate(['home']);
      }).catch((error) => {
        this.alertService.dismissLoader();
        this.alertService.presentAlert('login', 'login não realizado com sucesso');
        console.log(error.message);
      });
    }

    submitForm(): boolean {
      if (!this.formLogar.valid) {
        this.alertService.presentAlert('Erro ao logar', 'Erro ao logar');
        return false;
      } else {
        this.alertService.simpleLoader();
        this.logar();
        return true;
      }
    }

    logarComGoogle(): void {
      this.authService.signInWithGoogle()
        .then((res) => {
          this.alertService.dismissLoader();
          // Exibir um único alerta para indicar que o login foi realizado com sucesso e redirecionar para a página 'home'
          this.alertService.presentAlert('Sucesso', 'Login realizado com sucesso. Bem-vindo!');
          this.router.navigate(['home']);
        })
        .catch((error) => {
          this.alertService.dismissLoader();
          // Exibir alerta apenas em caso de erro no login
          this.alertService.presentAlert('Erro', 'Falha ao realizar o login. Por favor, tente novamente.');
          console.error(error.message);
        });
    }
    



    irParaSingUp() {
      this.router.navigate(['signup']);
    }


  }
