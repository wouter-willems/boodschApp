import {Component} from '@angular/core';
import {TodoItemsService} from "./todo-items.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'boodschapp';
  public menuIsOpen = false;
  public environments: Array<{
    env: string,
    token: string,
  }>;
  public newEnv: string;
  public newToken: string;
  public activeEnv: string;

  constructor(private todoItemsService: TodoItemsService) {
  }

  ngOnInit() {
    try {
      this.environments = JSON.parse(localStorage.getItem('environments') ?? '[]').map(e => ({
        env: e.split('-')[0],
        token: e.split('-')[1],
      }));
    } catch (err) {
      this.environments = [];
    }
    this.activeEnv = localStorage.getItem('active_environment')?.split('-')[0];
  }

  toggleMenu() {
    this.menuIsOpen = !this.menuIsOpen;
  }

  changeEnvironment(env, token) {
    localStorage.setItem('active_environment', `${env}-${token}`);
    window.location.reload();
  }

  deleteEntry(index) {
    const environmentsToKeep = this.environments.filter((e, i) => index !== i).map(e => `${e.env}-${e.token}`);
    localStorage.setItem('environments', JSON.stringify(environmentsToKeep));
    if (environmentsToKeep[0]) {
      localStorage.setItem('active_environment', JSON.stringify(environmentsToKeep[0]));
    } else {
      localStorage.removeItem('active_environment');
    }
    window.location.reload();
  }

  async loginToNewEnv(env, token) {
    await this.todoItemsService.login(env, token);
    window.location.reload();
  }
}
