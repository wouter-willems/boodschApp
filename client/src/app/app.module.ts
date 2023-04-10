import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {TodoItemComponent} from "./todo-item/todo-item.component";
import {TodoOverviewComponent} from "./todo-overview/todo-overview.component";
import {NewTodoItemComponent} from "./new-todo-item/new-todo-item.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { SuggestionsComponent } from './suggestions/suggestions.component';
import { LoginComponent } from './login/login.component';
import { AuthInterceptor } from './auth-interceptor';

@NgModule({
  declarations: [
    AppComponent,
    TodoOverviewComponent,
    TodoItemComponent,
    NewTodoItemComponent,
    SuggestionsComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
