import { Component } from '@angular/core';
import { ImageViewerConfig, ImageViewerEvent } from 'projects/image-viewer/src/lib/image-viewer.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ngx';
  images = [
    'https://raw.githubusercontent.com/intelligo-systems/memorize/master/.github/home.jpg',
    'https://raw.githubusercontent.com/intelligo-systems/memorize/master/.github/home.jpg'
  ];

  imageIndexOne = 0;
  imageIndexTwo = 0;

  config: ImageViewerConfig = {customBtns: [{name: 'print', icon: 'fa fa-print'}, {name: 'link', icon: 'fa fa-link'}]};

  handleEvent(event: ImageViewerEvent) {
    console.log(`${event.name} has been click on img ${event.imageIndex + 1}`);

    switch (event.name) {
      case 'print':
        console.log('run print logic');
        break;
    }
  }
}
