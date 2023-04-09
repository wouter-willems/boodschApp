import {getRandomString, isValueSet, stringIsSetAndFilled} from "../../util/values";

export class TodoItem {
  public id: string;
  public name: string;
  public boughtAt: Date = null;

  constructor(name: string, id: string = null, boughtAt: Date = null) {
    if (stringIsSetAndFilled(id)) {
      this.id = id;
    } else {
      this.id = getRandomString();
    }
    this.name = name;
    this.boughtAt = boughtAt;
  }

  public isCompleted() {
    return isValueSet(this.boughtAt);
  }

}
