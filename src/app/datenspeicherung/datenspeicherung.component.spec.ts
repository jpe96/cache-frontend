import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatenspeicherungComponent } from './datenspeicherung.component';

describe('DatenspeicherungComponent', () => {
  let component: DatenspeicherungComponent;
  let fixture: ComponentFixture<DatenspeicherungComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatenspeicherungComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatenspeicherungComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
