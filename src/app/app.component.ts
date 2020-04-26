import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  classforcontainer = 'container';
  LoadedFeature = 'recipe';

  onClickToggleDisplay() {
    if (this.classforcontainer === 'container'){
      this.classforcontainer = 'container-fluid';
    } else {
      this.classforcontainer = 'container';
    }
  }

  onNavigate(feature: string) {
    this.LoadedFeature = feature;
  }
}
