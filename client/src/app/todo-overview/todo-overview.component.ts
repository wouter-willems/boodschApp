import { Component, ViewChild } from '@angular/core';
import {stringIsSetAndFilled} from "../../util/values";
import {TodoItem} from "../todo-item/todoItem.model";
import {TodoItemsService} from "../todo-items.service";
import {NewTodoItemComponent} from "../new-todo-item/new-todo-item.component";

export const TODO_ITEMS_KEY = 'todoItems';

@Component({
  selector: 'app-todo-overview',
  templateUrl: './todo-overview.component.html',
  styleUrls: ['./todo-overview.component.scss']
})
export class TodoOverviewComponent {
  public todoItems: Array<TodoItem>;
  public currentSearch: string;

  @ViewChild(NewTodoItemComponent) newTodoItemComponent: NewTodoItemComponent;

  constructor(private todoItemsService: TodoItemsService) {

  }


  async ngOnInit() {
    this.todoItems = await this.todoItemsService.getItems();
  }

  async itemAdded() {
    this.newTodoItemComponent.clear();
    this.todoItems = await this.todoItemsService.getItems();
  }

  itemInputBlurred() {

  }

  itemInputFocused() {

  }

  setCurrentSearch($event: string) {
    this.currentSearch = $event;
  }

  async refreshItems() {
    this.todoItems = await this.todoItemsService.getItems();
  }
}
