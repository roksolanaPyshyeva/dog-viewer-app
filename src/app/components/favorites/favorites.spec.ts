import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { vi } from 'vitest';
import { FavoritesComponent } from './favorites';
import { DogStateService } from '../../services/dog-state.service';
import { DogImage } from '../../services/dog.service';

const DOG_A: DogImage = { url: 'https://images.dog.ceo/breeds/labrador/1.jpg', breed: 'Labrador' };
const DOG_B: DogImage = { url: 'https://images.dog.ceo/breeds/poodle/2.jpg', breed: 'Poodle' };

describe('FavoritesComponent', () => {
  let fixture: ComponentFixture<FavoritesComponent>;
  let el: HTMLElement;
  let mockState: {
    favorites: ReturnType<typeof signal<DogImage[]>>;
    selectDog: ReturnType<typeof vi.fn>;
    removeFavorite: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    mockState = {
      favorites: signal<DogImage[]>([]),
      selectDog: vi.fn(),
      removeFavorite: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [FavoritesComponent],
      providers: [{ provide: DogStateService, useValue: mockState }],
    }).compileComponents();

    fixture = TestBed.createComponent(FavoritesComponent);
    el = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('shows empty state message when there are no favorites', () => {
    expect(el.querySelector('.favorites__empty')).toBeTruthy();
    expect(el.querySelector('.favorites__empty')?.textContent).toContain('No favorites yet');
  });

  it('hides empty state message when favorites exist', () => {
    mockState.favorites.set([DOG_A]);
    fixture.detectChanges();
    expect(el.querySelector('.favorites__empty')).toBeNull();
  });

  it('renders one list item per favorite', () => {
    mockState.favorites.set([DOG_A, DOG_B]);
    fixture.detectChanges();
    expect(el.querySelectorAll('.favorites__item').length).toBe(2);
  });

  it('displays the breed name for each favorite', () => {
    mockState.favorites.set([DOG_A, DOG_B]);
    fixture.detectChanges();
    const breeds = Array.from(el.querySelectorAll('.favorites__breed')).map((n) => n.textContent?.trim());
    expect(breeds).toContain('Labrador');
    expect(breeds).toContain('Poodle');
  });

  it('calls selectDog when a favorite item is clicked', () => {
    mockState.favorites.set([DOG_A]);
    fixture.detectChanges();
    el.querySelector<HTMLElement>('.favorites__item')?.click();
    expect(mockState.selectDog).toHaveBeenCalledWith(DOG_A);
  });

  it('calls removeFavorite when the remove button is clicked', () => {
    mockState.favorites.set([DOG_A, DOG_B]);
    fixture.detectChanges();
    el.querySelectorAll<HTMLElement>('.favorites__remove-btn')[0].click();
    expect(mockState.removeFavorite).toHaveBeenCalledWith(DOG_A);
  });
});
