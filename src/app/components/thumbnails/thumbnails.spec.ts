import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { vi } from 'vitest';
import { ThumbnailsComponent } from './thumbnails';
import { DogStateService } from '../../services/dog-state.service';
import { DogImage } from '../../services/dog.service';

const DOG_A: DogImage = { url: 'https://images.dog.ceo/breeds/labrador/1.jpg', breed: 'Labrador' };
const DOG_B: DogImage = { url: 'https://images.dog.ceo/breeds/poodle/2.jpg', breed: 'Poodle' };

describe('ThumbnailsComponent', () => {
  let fixture: ComponentFixture<ThumbnailsComponent>;
  let el: HTMLElement;
  let mockState: {
    thumbnails: ReturnType<typeof signal<DogImage[]>>;
    selectDog: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    mockState = {
      thumbnails: signal<DogImage[]>([]),
      selectDog: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [ThumbnailsComponent],
      providers: [{ provide: DogStateService, useValue: mockState }],
    }).compileComponents();

    fixture = TestBed.createComponent(ThumbnailsComponent);
    el = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('renders one card per thumbnail', () => {
    mockState.thumbnails.set([DOG_A, DOG_B]);
    fixture.detectChanges();
    expect(el.querySelectorAll('.thumbnails__card').length).toBe(2);
  });

  it('displays the image with correct src and alt', () => {
    mockState.thumbnails.set([DOG_A]);
    fixture.detectChanges();
    const img = el.querySelector<HTMLImageElement>('.thumbnails__img');
    expect(img?.src).toBe(DOG_A.url);
    expect(img?.alt).toBe(DOG_A.breed);
  });

  it('displays the breed label for each thumbnail', () => {
    mockState.thumbnails.set([DOG_A, DOG_B]);
    fixture.detectChanges();
    const labels = Array.from(el.querySelectorAll('.thumbnails__breed')).map((n) => n.textContent?.trim());
    expect(labels).toContain('Labrador');
    expect(labels).toContain('Poodle');
  });

  it('calls selectDog with the clicked dog', () => {
    mockState.thumbnails.set([DOG_A, DOG_B]);
    fixture.detectChanges();
    el.querySelectorAll<HTMLElement>('.thumbnails__card')[1].click();
    expect(mockState.selectDog).toHaveBeenCalledWith(DOG_B);
  });

  it('renders the section title', () => {
    expect(el.querySelector('.thumbnails__title')?.textContent?.trim()).toBe('More Dogs');
  });
});
