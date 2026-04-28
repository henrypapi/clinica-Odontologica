import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TratamientosPaciente } from './tratamientos-paciente';

describe('TratamientosPaciente', () => {
  let component: TratamientosPaciente;
  let fixture: ComponentFixture<TratamientosPaciente>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TratamientosPaciente]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TratamientosPaciente);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
