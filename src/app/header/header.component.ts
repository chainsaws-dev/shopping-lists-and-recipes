import { Component, OnInit, EventEmitter, Output } from '@angular/core';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  collapsed = true;
  @Output() FeatureSelected = new EventEmitter<string>();
  constructor() { }

  ngOnInit(): void {
  }

  onSelect(feature: string) {
    this.FeatureSelected.emit(feature);
  }

}
