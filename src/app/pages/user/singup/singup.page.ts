import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertService } from 'src/app/common/alert.service';
import { AuthService } from 'src/app/model/service/auth.service';

@Component({
  selector: 'app-singup',
  templateUrl: './singup.page.html',
  styleUrls: ['./singup.page.scss'],
})
export class SingupPage implements OnInit {
  formCadastrar : FormGroup;

  constructor(private router: Router, private formBuilder: FormBuilder, private authService : AuthService) { 
    this.formCadastrar = new FormGroup({
      email: new FormControl(''),
      senha: new FormControl(''),
      confsenha: new FormControl('') 
    });
  }

  ngOnInit(){
    this.formCadastrar = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      senha: ['',[Validators.required, Validators.minLength(6)]],
      confsenha: ['',[Validators.required, Validators.minLength(6)]]
    })
  }

  get errorControl(){
    return this.formCadastrar.controls;
  }

  cadastrar() {
    this.authService.signUpWithEmailAndPassword(this.formCadastrar.value['email'], this.formCadastrar.value['senha']).then((res) => {
      // Aqui vai o código para realizar as ações após o cadastro com sucesso
      this.router.navigate(["tabs/home"]);
    }).catch((error) => {
      // Aqui vai o código para lidar com o erro durante o cadastro
      console.log(error.message);
    });
  }

  submitForm(): boolean {
    if (!this.formCadastrar.valid || this.formCadastrar.value['senha'] != this.formCadastrar.value['confsenha']) {
      // Aqui vai o código para lidar com o formulário inválido ou senhas diferentes
      return false;
    } else {
      // Aqui vai o código para quando o formulário é válido
      this.cadastrar();
      return true;
    }
  }

}