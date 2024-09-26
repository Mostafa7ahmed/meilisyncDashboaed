import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SourceComponent } from './source.component';

describe('SourceComponent', () => {
  let component: SourceComponent;
  let fixture: ComponentFixture<SourceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SourceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
