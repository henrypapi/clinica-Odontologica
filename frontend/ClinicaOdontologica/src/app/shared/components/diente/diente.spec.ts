import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Diente } from './diente';

describe('Diente', () => {
  let component: Diente;
  let fixture: ComponentFixture<Diente>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Diente]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Diente);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
