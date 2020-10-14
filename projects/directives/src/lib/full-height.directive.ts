import { Directive, Renderer2, ElementRef, OnInit, HostListener } from '@angular/core';

@Directive({
  selector: '[fullHeight]'
})
export class FullHeightDirective implements OnInit {

  windowHeight: number = 0;
  elementOffset: number = 0;
  staticHeight = 200;

  constructor(private renderer: Renderer2, private el: ElementRef) {}

  ngOnInit() {
    
  }

  setHeight() {

    this.el.nativeElement.classList.add('table-fullheight');

    this.windowHeight = window.innerHeight;

    this.elementOffset = this.el.nativeElement.offsetTop;

    let height = this.windowHeight - this.staticHeight - this.elementOffset;

    this.el.nativeElement.style.height = height + 'px';

    // check tables
    let table = document.querySelector('table thead');

    if(table.childNodes.length > 1) {
      table.classList.add('multiple_row');
    }
  }

  ngAfterViewInit() {
    this.setHeight();
  }

  @HostListener('window:resize', ['$event'])
  handleKeyDown(event: any) {
    this.setHeight();
  }

}