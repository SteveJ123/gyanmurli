import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LanguageYear } from './language-year';

describe('LanguageYear', () => {
  let component: LanguageYear;
  let fixture: ComponentFixture<LanguageYear>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LanguageYear],
    }).compileComponents();

    fixture = TestBed.createComponent(LanguageYear);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
