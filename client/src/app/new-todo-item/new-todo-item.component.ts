import {Component, EventEmitter, Output} from '@angular/core';
import {stringIsSetAndFilled} from "../../util/values";
import {TODO_ITEMS_KEY} from '../todo-overview/todo-overview.component';
import {TodoItem} from "../todo-item/todoItem.model";
import {TodoItemsService} from "../todo-items.service";

@Component({
  selector: 'app-new-todo-item',
  templateUrl: './new-todo-item.component.html',
  styleUrls: ['./new-todo-item.component.scss']
})
export class NewTodoItemComponent {
  public itemName: string;
  @Output() onItemAdded = new EventEmitter<void>();
  @Output() onBlur = new EventEmitter<void>();
  @Output() onFocus = new EventEmitter<void>();
  @Output() onSearch = new EventEmitter<string>();

  constructor(private todoItemsService: TodoItemsService) {

  }

  public clear() {
    this.itemName = '';
    this.onSearch.emit('');
  }

  public async addItem() {
    if (stringIsSetAndFilled(this.itemName)) {
      await this.todoItemsService.addItem(new TodoItem(this.itemName));
      this.itemName = '';
      this.onItemAdded.emit();
    }
  }
}
