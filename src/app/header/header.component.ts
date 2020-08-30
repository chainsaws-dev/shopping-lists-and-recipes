import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})

export class HeaderComponent implements OnInit, OnDestroy {
  LoggedIn = false;
  UserEmail: string;
  UserAdmin: boolean;

  private LoginSub: Subscription;

  constructor(
    private auth: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.LoggedIn = true;
    this.UserEmail = 'test@test.ru';
    this.UserAdmin = false;

    this.LoggedIn = this.auth.CheckRegistered();
    this.UserEmail = this.auth.GetUserEmail();
    this.UserAdmin = this.auth.CheckIfUserIsAdmin();

    this.LoginSub = this.auth.AuthResultSub.subscribe((loggedin) => {
      this.LoggedIn = loggedin;
      this.UserEmail = this.auth.GetUserEmail();
      this.UserAdmin = this.auth.CheckIfUserIsAdmin();
    });

  }

  SearchRecipes(form: NgForm): void {
    if (form.valid) {
      const fvalue = form.value;
      this.router.navigate(['recipes'], { queryParams: { search: encodeURI(fvalue.searchreq)}  });
    }
  }

  ngOnDestroy(): void {
    this.LoginSub.unsubscribe();
  }

  OnLogout() {
    this.auth.SignOut();
    this.LoggedIn = false;
    this.UserEmail = '';
    this.UserAdmin = false;
  }
}
