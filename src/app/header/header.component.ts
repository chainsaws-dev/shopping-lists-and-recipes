import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataStorageService } from '../shared/data-storage.service';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';
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
    this.LoggedIn = this.auth.CheckRegistered();
    this.LoginSub = this.auth.AuthResultSub.subscribe((loggedin) => {
      this.LoggedIn = loggedin;
      this.UserEmail = this.auth.GetUserEmail();
    });
  }

  ngOnDestroy(): void {
    this.LoginSub.unsubscribe();
  }

  OnSaveData() {
    this.datastore.SaveRecipes();
  }

  OnFetchData() {
    this.datastore.FetchRecipes().subscribe();
  }

  OnLogout() {
    this.auth.SignOut();
    this.LoggedIn = false;
    this.UserEmail = '';
    this.router.navigate(['/auth']);
  }
}
