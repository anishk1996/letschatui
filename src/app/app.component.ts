import { Component } from '@angular/core';
import { fadeAnimation, zoomUpAnimation, slideUpAnimation} from './myanimation';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [zoomUpAnimation]
})
export class AppComponent {
  title = 'letschat';

  getState(outlet: any) {
    return outlet.isActivated ? 
    outlet.activatedRoute.snapshot.url[0].path: 
    "none";
  }
}
