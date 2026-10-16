import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogFrontendComponent } from './blog-frontend.component';

describe('BlogFrontendComponent', () => {
  let component: BlogFrontendComponent;
  let fixture: ComponentFixture<BlogFrontendComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BlogFrontendComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlogFrontendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
