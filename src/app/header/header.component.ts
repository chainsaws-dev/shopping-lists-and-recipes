import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataStorageService } from '../shared/data-storage.service';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';
import { NgForm } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})

export class HeaderComponent implements OnInit, OnDestroy {
  LoggedIn = false;
  UserEmail: string;
  private LoginSub: Subscription;

  constructor(private datastore: DataStorageService,
              private auth: AuthService,
              private router: Router) { }

  ngOnInit(): void {
    this.LoggedIn = true;
    this.UserEmail = 'test@test.ru';
    /*
    this.LoggedIn = this.auth.CheckRegistered();
    this.UserEmail = this.auth.GetUserEmail();

    this.LoginSub = this.auth.AuthResultSub.subscribe((loggedin) => {
      this.LoggedIn = loggedin;
      this.UserEmail = this.auth.GetUserEmail();
    });
    */
  }

  SearchRecipes(form: NgForm): void {
    if (form.valid) {
      const fvalue = form.value;
      this.datastore.SearchRecipes(1, environment.RecipePageSize, fvalue.searchreq);
      this.router.navigate(['recipes', 'searchresult', 1]);
    }
  }

  ngOnDestroy(): void {
    this.LoginSub.unsubscribe();
  }

  OnLogout() {
    this.auth.SignOut();
    this.LoggedIn = false;
    this.UserEmail = '';
  }
}
