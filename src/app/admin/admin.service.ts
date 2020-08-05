import { Injectable } from '@angular/core';
import { User } from './admin.model';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  UserSelected = new Subject<User>();
  UsersUpdated = new Subject<void>();

  CurrentSelectedItem: User;
  Total: number;


  private Users: User[] = [];

  constructor() { }

  GetUsers() {
    return this.Users.slice();
  }

  SetUsers(newusers: User[]) {
    this.Users = newusers;
    this.UsersUpdated.next();
  }

  SetPagination(Total: number, Limit: number, Offset: number) {
    this.Total = Total;
  }

  SelectItemUsersList(ingredient: User) {
    this.CurrentSelectedItem = ingredient;
    this.UserSelected.next(ingredient);
  }

  IsCurrentSelected(user: User) {
    return this.CurrentSelectedItem === user;
  }

  GetUserById(id: number) {

    if (id < this.Users.length && id > 0) {
      return this.Users[id];
    } else {
      return this.Users[0];
    }
  }
}

