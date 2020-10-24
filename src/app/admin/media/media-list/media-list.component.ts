import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-media-list',
  templateUrl: './media-list.component.html',
  styleUrls: ['./media-list.component.css']
})
export class MediaListComponent implements OnInit {

  PageSize: number;
  collectionSize: number;
  currentPage: number;

  constructor() { }

  ngOnInit(): void {
    this.PageSize = environment.MediaListPageSize;
    this.collectionSize = 100;
    this.currentPage = 1;
  }

  OnPageChanged(page: number) {
    // TODO
  }

  OnDeleteFile() {
    // TODO
  }

}
