import { Component } from '@angular/core';
import {stringIsSetAndFilled} from "../../util/values";
import {TodoItem} from "../todo-item/todoItem.model";
import {TodoItemsService} from "../todo-items.service";

export const TODO_ITEMS_KEY = 'todoItems';

@Component({
  selector: 'app-todo-overview',
  templateUrl: './todo-overview.component.html',
  styleUrls: ['./todo-overview.component.scss']
})
export class TodoOverviewComponent {
  public todoItems: Array<TodoItem>;

  constructor(private todoItemsService: TodoItemsService) {

  }


  async ngOnInit() {
    this.todoItems = await this.todoItemsService.getItems();
  }

  async itemAdded() {
    this.todoItems = await this.todoItemsService.getItems();
  }
}
