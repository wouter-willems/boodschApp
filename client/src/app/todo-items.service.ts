import {Injectable} from '@angular/core';
import {TODO_ITEMS_KEY} from "./todo-overview/todo-overview.component";
import {stringIsSetAndFilled} from "../util/values";
import {TodoItem} from "./todo-item/todoItem.model";
import {HttpClient} from "@angular/common/http";
import {firstValueFrom} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class TodoItemsService {

  constructor(private http: HttpClient) {
  }

  public async getItems(): Promise<Array<TodoItem>> {
    const items: any = await firstValueFrom(this.http.get('http://localhost:3000/items'));
    const currentItems = items.map(e => this.apiDataToTodoItem(e));

    return currentItems;
  }

  private apiDataToTodoItem(e) {
    return new TodoItem(
      e.name,
      e.id,
      stringIsSetAndFilled(e.boughtAt) ? new Date(e.boughtAt) : null)
  }

  public async addItem(todoItem: TodoItem) {
    const newItem = firstValueFrom(this.http.post<TodoItem>('http://localhost:3000/items', {
      name: todoItem.name
    })).then(this.apiDataToTodoItem);
    return newItem;
  }

  public async itemBought(item: TodoItem): Promise<TodoItem> {
    return firstValueFrom(this.http.patch<TodoItem>(`http://localhost:3000/items/${item.id}`, {
      name: item.name,
      boughtAt: new Date(),
    })).then(this.apiDataToTodoItem);
  }

  async undoItemBought(item: TodoItem) {
    return firstValueFrom(this.http.patch<TodoItem>(`http://localhost:3000/items/${item.id}`, {
      name: item.name,
      boughtAt: null,
    })).then(this.apiDataToTodoItem);
  }
}
