import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DoormanComponent } from './doorman.component';

describe('DoormanComponent', () => {
  let component: DoormanComponent;
  let fixture: ComponentFixture<DoormanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DoormanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DoormanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
