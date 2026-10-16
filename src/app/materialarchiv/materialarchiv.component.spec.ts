import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialarchivComponent } from './materialarchiv.component';

describe('MaterialarchivComponent', () => {
  let component: MaterialarchivComponent;
  let fixture: ComponentFixture<MaterialarchivComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaterialarchivComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialarchivComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
