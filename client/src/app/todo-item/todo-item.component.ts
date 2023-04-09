import { Component, Input } from '@angular/core';
import {TodoItem} from "./todoItem.model";
import {TodoItemsService} from "../todo-items.service";
import {isValueSet} from "../../util/values";


@Component({
  selector: 'app-todo-item',
  templateUrl: './todo-item.component.html',
  styleUrls: ['./todo-item.component.scss']
})
export class TodoItemComponent {
  @Input() item: TodoItem;

  constructor(private todoItemsService: TodoItemsService) {
  }

  public async boughtIt() {
    this.item = await this.todoItemsService.itemBought(this.item);
  }

  shouldShowUndoButton() {
    if (!isValueSet(this.item.boughtAt)) {
      return false;
    }
    return true;
  }

  async undo() {
    this.item = await this.todoItemsService.undoItemBought(this.item);
  }
}
