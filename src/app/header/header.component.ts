import { Component, OnInit } from '@angular/core';
import { DataStorageService } from '../shared/data-storage.service';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})

export class HeaderComponent implements OnInit {

  constructor(private datastore: DataStorageService) { }

  ngOnInit(): void {
  }

  OnSaveData() {
    this.datastore.SaveRecipes();
  }

  OnFetchData() {
    this.datastore.FetchRecipes().subscribe();
  }
}
