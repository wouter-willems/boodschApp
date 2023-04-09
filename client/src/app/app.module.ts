import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {TodoItemComponent} from "./todo-item/todo-item.component";
import {TodoOverviewComponent} from "./todo-overview/todo-overview.component";
import {NewTodoItemComponent} from "./new-todo-item/new-todo-item.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { HttpClientModule } from '@angular/common/http';
import { SuggestionsComponent } from './suggestions/suggestions.component';

@NgModule({
  declarations: [
    AppComponent,
    TodoOverviewComponent,
    TodoItemComponent,
    NewTodoItemComponent,
    SuggestionsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
