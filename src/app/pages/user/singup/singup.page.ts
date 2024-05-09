import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertService } from 'src/app/common/alert.service';
import { AuthService } from 'src/app/model/service/auth.service';

@Component({
  selector: 'app-singup',
  templateUrl: './singup.page.html',
  styleUrls: ['./singup.page.scss'],
})
export class SingupPage implements OnInit {
  formSingup!: FormGroup; 

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private alertService: AlertService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    // Inicialize o FormGroup no ngOnInit
    this.formSingup = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confpassword: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  get errorControl() {
    return this.formSingup.controls;
  }

  register() {
    this.authService.signUpWithEmailAndPassword(this.formSingup.value.email, this.formSingup.value.password)
      .then((res) => {
        this.alertService.dismissLoader();
        this.alertService.presentAlert("cadastro", "cadastro realizado com sucesso");
        this.alertService.presentAlert("ola", "seja bem vindo");
        this.router.navigate(["home"]);
      })
      .catch((error) => {
        this.alertService.dismissLoader();
        this.alertService.presentAlert("cadastro", "cadastro não realizado com sucesso");
        console.log(error.message);
      });
  }

  submitForm(): boolean {
    if (!this.formSingup.valid || this.formSingup.value.password != this.formSingup.value.confpassword) {
      this.alertService.presentAlert("Cadastro", "Cadastro não realizado");
      this.alertService.simpleLoader();
      return false;
    } else {
      this.alertService.simpleLoader();
      this.register();
      return true;
    }
  }
}
