import { Directive, ElementRef, HostListener, Inject, Input, OnInit } from '@angular/core';
import { Utils } from '../../shared/util/utils';
import { SidebarHelperService } from '../services/sidebar-helper.service';

@Directive({
  selector: '[appSidebarContainer]',
})
export class SidebarContainerDirective implements OnInit {
  @Input('appSidebarContainer') id: string;
  nativeEl;
  content: SidebarContentDirective;

  constructor(public el: ElementRef, private _sidenavHelperService: SidebarHelperService) {
    this.nativeEl = this.el.nativeElement;
    this.nativeEl.className += ' sidebar-container';
  }

  ngOnInit() {}
}

@Directive({
  selector: '[appSidebarContent]',
})
export class SidebarContentDirective {
  @Input('appSidebarContent') id: string;
  nativeEl;

  constructor(
    public el: ElementRef,
    private _sidenavHelperService: SidebarHelperService,
    @Inject(SidebarContainerDirective) public container: SidebarContainerDirective
  ) {
    this.nativeEl = this.el.nativeElement;
    this.container.content = this;
    this.nativeEl.className += ' sidebar-content';
  }

  createBackdrop() {}
}

@Directive({
  selector: '[appSidebar]',
})
export class SidebarDirective implements OnInit {
  @Input('align') public align: 'left' | 'right' = 'left';
  @Input('mode') public mode: 'over' | 'side' = 'side';
  @Input('appSidebar') id: string;
  @Input('closed') closed: boolean;

  public width;
  public nativeEl: any;
  public containerNativeEl: any;
  public contentNativeEl: any;

  constructor(
    private el: ElementRef,
    private _sidenavHelperService: SidebarHelperService,
    @Inject(SidebarContainerDirective) public container: SidebarContainerDirective
  ) {
    this.nativeEl = this.el.nativeElement;
    this.containerNativeEl = this.container.el.nativeElement;
    this.contentNativeEl = this.container.content.el.nativeElement;
    this.nativeEl.className += ' sidebar';
  }

  ngOnInit() {
    this.width = this.el.nativeElement.offsetWidth + 'px';
    this._sidenavHelperService.setSidenav(this.id, this);
    this.initSidebar();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.initSidebar();
  }

  private initSidebar() {
    this.closed = Utils.isMobile();
    if (this.closed) {
      this.close();
    } else {
      this.open();
    }
  }

  open() {
    if (this.align === 'left') {
      this.nativeEl.style.left = 0;
      if (!Utils.isMobile()) {
        this.contentNativeEl.style.marginLeft = this.width;
      }
    } else if (this.align === 'right') {
      this.nativeEl.style.right = 0;
      if (!Utils.isMobile()) {
        this.contentNativeEl.style.marginRight = this.width;
      }
    }
    this.closed = false;
  }

  close() {
    if (this.align === 'left') {
      this.nativeEl.style.left = '-' + this.width;
      this.contentNativeEl.style.marginLeft = 0;
    } else if (this.align === 'right') {
      this.nativeEl.style.right = '-' + this.width;
      this.contentNativeEl.style.marginRight = 0;
    }
    this.closed = true;
  }

  toggle() {
    if (this.closed) {
      this.open();
    } else {
      this.close();
    }
  }
}

@Directive({
  selector: '[appSidebarToggler]',
})
export class SidebarTogglerDirective {
  @Input('appSidebarToggler') id;

  constructor(private _sidenavHelperService: SidebarHelperService) {}

  @HostListener('click')
  onClick() {
    this._sidenavHelperService.getSidenav(this.id).toggle();
  }
}
