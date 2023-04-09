import {Component, EventEmitter, Input, Output} from '@angular/core';
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
  @Output() onDelete = new EventEmitter<void>();
  public showDeleteAreYouSurePrompt = false;

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

  async deleteItem() {
    if (!this.showDeleteAreYouSurePrompt) {
      this.showDeleteAreYouSurePrompt = true;
      return;
    }
    await this.todoItemsService.deleteItem(this.item);
    this.onDelete.emit();
  }
}
