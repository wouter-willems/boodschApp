import {inject, NgModule} from '@angular/core';
import {ActivatedRouteSnapshot, Router, RouterModule, Routes} from '@angular/router';
import {TodoOverviewComponent} from "./todo-overview/todo-overview.component";
import {LoginComponent} from "./login/login.component";

const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
    canActivate: [() => {
      if (localStorage.getItem('token')) {
        const router = inject(Router);
        return router.parseUrl('/items');
      } else {
        return true;
      }
    }]
  },
  {
    path: 'items',
    component: TodoOverviewComponent,
    canActivate: [() => {
      if (localStorage.getItem('token')) {
        return true;
      } else {
        const router = inject(Router);
        return router.parseUrl('/');
      }
    }]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
