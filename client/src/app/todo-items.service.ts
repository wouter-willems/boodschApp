import {Injectable} from '@angular/core';
import {stringIsSetAndFilled} from "../util/values";
import {TodoItem} from "./todo-item/todoItem.model";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {firstValueFrom} from "rxjs";

const apiRoot = '/api/';
// const apiRoot = 'http://localhost:3000/api/';
const apiRootAuth = apiRoot + 'auth/';

@Injectable({
  providedIn: 'root'
})
export class TodoItemsService {

  private listeners = [];

  constructor(private http: HttpClient) {
  }

  public addListener(fn) {
    this.listeners.push(fn);
  }

  private fireListeners() {
    this.listeners.forEach(e => e());
  }

  public async getItems(): Promise<Array<TodoItem>> {
    const items: any = await firstValueFrom(this.http.get(apiRootAuth + 'items'));
    const currentItems = items.map(e => this.apiDataToTodoItem(e));

    return currentItems;
  }

  public async getSuggestions(): Promise<Array<string>> {
    return await firstValueFrom(this.http.get<Array<string>>(apiRootAuth + 'suggestions'));
  }

  private apiDataToTodoItem(e) {
    return new TodoItem(
      e.name,
      e.id,
      stringIsSetAndFilled(e.boughtAt) ? new Date(e.boughtAt) : null)
  }

  public async addItem(todoItem: TodoItem) {
    const newItem = await firstValueFrom(this.http.post<TodoItem>(apiRootAuth + 'items', {
      name: todoItem.name
    })).then(this.apiDataToTodoItem);
    this.fireListeners();
    return newItem;
  }

  public async itemBought(item: TodoItem): Promise<TodoItem> {
    const res = await firstValueFrom(this.http.patch<TodoItem>(apiRootAuth + `items/${item.id}`, {
      name: item.name,
      boughtAt: new Date(),
    })).then(this.apiDataToTodoItem);
    this.fireListeners();
    return res;
  }

  async undoItemBought(item: TodoItem) {
    const res = firstValueFrom(this.http.patch<TodoItem>(apiRootAuth + `items/${item.id}`, {
      name: item.name,
      boughtAt: null,
    })).then(this.apiDataToTodoItem);
    this.fireListeners();
    return res;
  }

  async deleteItem(item: TodoItem) {
    await firstValueFrom(this.http.delete<void>(apiRootAuth + `items/${item.id}`));
    this.fireListeners();
  }

  async login(environment: string, token: string) {
    const userName = await firstValueFrom(this.http.post<void>(apiRoot + `login`, {
      environment,
      token
    }));
    const envs: Array<string> = JSON.parse(localStorage.getItem('environments') ?? '[]');
    localStorage.setItem('environments', JSON.stringify([...envs, `${environment}-${token}`]));
    localStorage.setItem('active_environment', `${environment}-${token}`);
    return userName;
  }
}
