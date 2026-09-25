import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { DogService } from './dog.service';

describe('DogService', () => {
  let service: DogService;
  let httpController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(DogService);
    httpController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // ── extractBreed ────────────────────────────────────────────────────────────

  describe('extractBreed', () => {
    it('capitalizes a single-word breed', () => {
      expect(service.extractBreed('https://images.dog.ceo/breeds/labrador/1.jpg')).toBe('Labrador');
    });

    it('formats sub-breed as "Sub Main" (e.g. hound-afghan → Afghan Hound)', () => {
      expect(service.extractBreed('https://images.dog.ceo/breeds/hound-afghan/1.jpg')).toBe('Afghan Hound');
    });

    it('formats retriever-golden → Golden Retriever', () => {
      expect(service.extractBreed('https://images.dog.ceo/breeds/retriever-golden/1.jpg')).toBe('Golden Retriever');
    });

    it('formats terrier-cairn → Cairn Terrier', () => {
      expect(service.extractBreed('https://images.dog.ceo/breeds/terrier-cairn/1.jpg')).toBe('Cairn Terrier');
    });

    it('returns empty string for an unrecognised URL structure', () => {
      expect(service.extractBreed('https://example.com/bad-url')).toBe('');
    });
  });

  // ── getRandomImages ─────────────────────────────────────────────────────────

  describe('getRandomImages', () => {
    it('makes a GET request to the correct URL', () => {
      service.getRandomImages(3).subscribe();

      const req = httpController.expectOne('https://dog.ceo/api/breeds/image/random/3');
      expect(req.request.method).toBe('GET');
      req.flush({ message: [] });
    });

    it('maps the API response to DogImage objects with extracted breeds', () => {
      const urls = [
        'https://images.dog.ceo/breeds/labrador/1.jpg',
        'https://images.dog.ceo/breeds/hound-afghan/2.jpg',
      ];
      let result: { url: string; breed: string }[] = [];

      service.getRandomImages(2).subscribe((dogs) => (result = dogs));

      httpController.expectOne('https://dog.ceo/api/breeds/image/random/2').flush({ message: urls });

      expect(result).toEqual([
        { url: urls[0], breed: 'Labrador' },
        { url: urls[1], breed: 'Afghan Hound' },
      ]);
    });

    it('returns an empty array when the API returns no images', () => {
      let result: unknown[] = ['initial'];

      service.getRandomImages(0).subscribe((dogs) => (result = dogs));

      httpController.expectOne('https://dog.ceo/api/breeds/image/random/0').flush({ message: [] });

      expect(result).toEqual([]);
    });

    it('preserves the original URL on each DogImage', () => {
      const url = 'https://images.dog.ceo/breeds/poodle/3.jpg';
      let result: { url: string; breed: string }[] = [];

      service.getRandomImages(1).subscribe((dogs) => (result = dogs));

      httpController.expectOne('https://dog.ceo/api/breeds/image/random/1').flush({ message: [url] });

      expect(result[0].url).toBe(url);
    });
  });
});
