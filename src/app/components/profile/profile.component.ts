import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/model/service/auth.service';
import { User } from 'firebase/auth'; // Importe o tipo User do Firebase

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  user: User | null = null;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.getProfile();
  }

  getProfile() {
    const user = this.authService.getUserLogged(); // Obter o usuário diretamente de localStorage

    if (user) {
      this.user = user;
    } else {
      console.error('Erro ao obter informações do usuário:', 'Usuário não encontrado.');
    }
  }

  logout() {
    this.authService.signOut().then(() => {
      // Após fazer logout, redirecione para a página de login ou para a página inicial
      // Dependendo de sua implementação
    }).catch(error => {
      console.error('Erro ao fazer logout:', error);
    });
  }
}
