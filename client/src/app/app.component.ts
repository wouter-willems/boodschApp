import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'boodschapp';
  public showLogOutConfirm = false;

  logOut() {
    if (!this.showLogOutConfirm) {
      this.showLogOutConfirm = true;
      return;
    }
    localStorage.removeItem('token');
    window.location.reload();
  }
}
