import { Component } from '@angular/core';
import {TodoItemsService} from "../todo-items.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  environment: string;
  token: string;

  constructor(private todoItemsService: TodoItemsService, private router: Router) {
  }

  async enterToken() {
    await this.todoItemsService.login(this.environment, this.token);
    await this.router.navigateByUrl('/items');
  }
}
