import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {
  LoggedIn = false;
  constructor() { }

  ngOnInit(): void {
  }

  onSwitchMode() {
    this.LoggedIn = !this.LoggedIn;
  }
}
