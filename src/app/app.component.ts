import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  classforcontainer = 'container-xl';

  constructor(private httpClient: HttpClient) { }
  ngOnInit(): void {
    this.httpClient.get('/api/CreateTablesPostgre');
  }
}
