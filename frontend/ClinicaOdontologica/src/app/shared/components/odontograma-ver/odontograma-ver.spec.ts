import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OdontogramaVer } from './odontograma-ver';

describe('OdontogramaVer', () => {
  let component: OdontogramaVer;
  let fixture: ComponentFixture<OdontogramaVer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OdontogramaVer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OdontogramaVer);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
