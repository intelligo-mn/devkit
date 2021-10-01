import { Component, OnInit } from '@angular/core';
import { ImageViewerConfig, ImageViewerEvent } from 'projects/image-viewer/src/public-api';

@Component({
  selector: 'app-image-viewer',
  templateUrl: './image-viewer.component.html',
  styleUrls: ['./image-viewer.component.css']
})
export class ImageViewerComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }
  title = 'ngx';
  images = [
    'https://raw.githubusercontent.com/intelligo-mn/memorize/master/.github/home.jpg',
    'https://raw.githubusercontent.com/intelligo-mn/memorize/master/.github/home.jpg'
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
