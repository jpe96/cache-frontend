import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BookFrontendComponent } from './book-frontend.component';

describe('BookFrontendComponent', () => {
  let component: BookFrontendComponent;
  let fixture: ComponentFixture<BookFrontendComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BookFrontendComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookFrontendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
