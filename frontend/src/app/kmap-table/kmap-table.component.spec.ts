import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KmapTableComponent } from './kmap-table.component';

describe('KmapTableComponent', () => {
  let component: KmapTableComponent;
  let fixture: ComponentFixture<KmapTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KmapTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KmapTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
