import { Directive, OnInit, ElementRef } from '@angular/core';

@Directive({
  selector: '[equalHeight]'
})
export class MatchHeightDirective implements OnInit {

  constructor(
    private el: ElementRef
  ) { }


  ngOnInit() {
    this.el.nativeElement.style.display = 'none';
    console.log("this will be work", "color: red");
  }

}
