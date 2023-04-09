import {Component, EventEmitter, Input, Output, SimpleChanges} from '@angular/core';
import {stringIsSetAndFilled} from "../../util/values";
import {TodoItemsService} from "../todo-items.service";
import {TodoItem} from "../todo-item/todoItem.model";

@Component({
  selector: 'app-suggestions',
  templateUrl: './suggestions.component.html',
  styleUrls: ['./suggestions.component.scss']
})
export class SuggestionsComponent {
  @Input() search: string;
  @Output() onItemAdded = new EventEmitter<void>();

  public allSuggestions: Array<string> = [];
  public suggestions: Array<string> = [];

  constructor(private todoItemsService: TodoItemsService) {

  }

  async ngOnInit(){
    this.allSuggestions = await this.todoItemsService.getSuggestions();
    this.todoItemsService.addListener(async () => {
      this.allSuggestions = await this.todoItemsService.getSuggestions();
    });
  }


  ngOnChanges(simpleChanges: SimpleChanges) {
    if (!stringIsSetAndFilled(this.search)) {
      this.suggestions = [];
      return;
    }
    this.suggestions = this.allSuggestions.filter(e => e.includes(this.search)).sort((a, b) => {
      return a.localeCompare(b);
    });
  }

  async addItem(suggestion: string) {
    await this.todoItemsService.addItem(new TodoItem(suggestion));
    this.onItemAdded.emit();
  }
}
