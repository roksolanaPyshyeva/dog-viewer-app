import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface DogImage {
  url: string;
  breed: string;
}

@Injectable({ providedIn: 'root' })
export class DogService {
  private http = inject(HttpClient);
  private baseUrl = 'https://dog.ceo/api';

  getRandomImages(count: number): Observable<DogImage[]> {
    return this.http
      .get<{ message: string[] }>(`${this.baseUrl}/breeds/image/random/${count}`)
      .pipe(map((res) => res.message.map((url) => ({ url, breed: this.extractBreed(url) }))));
  }

  extractBreed(url: string): string {
    const breed = url.split('/')[4] ?? '';
    return this.formatBreed(breed);
  }

  private formatBreed(breed: string): string {
    const parts = breed.split('-');
    if (parts.length === 1) return this.capitalize(parts[0]);
    const [main, ...subs] = parts;
    return [...subs.map((sub) => this.capitalize(sub)), this.capitalize(main)].join(' ');
  }

  private capitalize(word: string): string {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }
}
