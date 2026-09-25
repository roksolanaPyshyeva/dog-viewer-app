import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { vi } from 'vitest';
import { MainImageComponent } from './main-image';
import { DogStateService } from '../../services/dog-state.service';
import { DogImage } from '../../services/dog.service';

const MOCK_DOG: DogImage = { url: 'https://images.dog.ceo/breeds/labrador/1.jpg', breed: 'Labrador' };

describe('MainImageComponent', () => {
  let fixture: ComponentFixture<MainImageComponent>;
  let el: HTMLElement;
  let mockState: {
    mainDog: ReturnType<typeof signal<DogImage | null>>;
    isCurrentFavorited: ReturnType<typeof signal<boolean>>;
    toggleFavorite: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    mockState = {
      mainDog: signal<DogImage | null>(null),
      isCurrentFavorited: signal(false),
      toggleFavorite: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [MainImageComponent],
      providers: [{ provide: DogStateService, useValue: mockState }],
    }).compileComponents();

    fixture = TestBed.createComponent(MainImageComponent);
    el = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('renders the section when mainDog has a value', () => {
    mockState.mainDog.set(MOCK_DOG);
    fixture.detectChanges();
    expect(el.querySelector('.main-image')).toBeTruthy();
  });

  it('displays the image with correct src and alt', () => {
    mockState.mainDog.set(MOCK_DOG);
    fixture.detectChanges();
    const img = el.querySelector<HTMLImageElement>('.main-image__img');
    expect(img?.src).toBe(MOCK_DOG.url);
    expect(img?.alt).toBe(MOCK_DOG.breed);
  });


  it('shows "Add to Favorites" when not favorited', () => {
    mockState.mainDog.set(MOCK_DOG);
    mockState.isCurrentFavorited.set(false);
    fixture.detectChanges();
    expect(el.querySelector('.main-image__btn')?.textContent?.trim()).toContain('Add to Favorites');
  });

  it('shows "Favorited" when already favorited', () => {
    mockState.mainDog.set(MOCK_DOG);
    mockState.isCurrentFavorited.set(true);
    fixture.detectChanges();
    expect(el.querySelector('.main-image__btn')?.textContent?.trim()).toContain('Favorited');
  });

  it('calls toggleFavorite when the favorites button is clicked', () => {
    mockState.mainDog.set(MOCK_DOG);
    fixture.detectChanges();
    el.querySelector<HTMLButtonElement>('.main-image__btn')?.click();
    expect(mockState.toggleFavorite).toHaveBeenCalledTimes(1);
  });
});
