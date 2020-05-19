import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(private httpClient: HttpClient, private auth: AuthService) { }
  ngOnInit(): void {
    this.auth.AutoSignIn();
    /*
    this.httpClient.get('/api/CreateTablesPostgre').subscribe((curevent: any) => {
    }); */
  }
}
