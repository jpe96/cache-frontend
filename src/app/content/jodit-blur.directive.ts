@Directive({
  selector: 'jodit-editor[trackBlur]',
  standalone: true
})
export class JoditBlurDirective implements AfterViewInit, OnDestroy {
  @Input() trackBlur!: any;
  private observer?: MutationObserver;

  constructor(private el: ElementRef) {}

  ngAfterViewInit() {
    this.observer = new MutationObserver(() => {
      const container = this.el.nativeElement.querySelector('.jodit-container');
      if (container) {
        container.addEventListener('focusout', this.onFocusOut);
        this.observer?.disconnect();
      }
    });
    this.observer.observe(this.el.nativeElement, { childList: true, subtree: true });
  }

  onFocusOut = (e: FocusEvent) => {
    const container = this.el.nativeElement.querySelector('.jodit-container');
    if (!container?.contains(e.relatedTarget as Node)) {
      this.trackBlur.height = false;
    }
  };

  ngOnDestroy() {
    this.observer?.disconnect();
    const container = this.el.nativeElement.querySelector('.jodit-container');
    container?.removeEventListener('focusout', this.onFocusOut);
  }
}