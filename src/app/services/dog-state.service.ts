import { Injectable, computed, inject, signal } from '@angular/core';
import { DogImage, DogService } from './dog.service';
import { catchError, EMPTY, take } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DogStateService {
  private dogService = inject(DogService);

  readonly mainDog = signal<DogImage | null>(null);
  readonly thumbnails = signal<DogImage[]>([]);
  readonly favorites = signal<DogImage[]>([]);
  readonly loading = signal(true);

  readonly isCurrentFavorited = computed(() => {
    const mainDog = this.mainDog();
    return mainDog ? this.favorites().some((dog) => dog.url === mainDog.url) : false;
  });

  loadDogs(): void {
    this.loading.set(true);
    this.dogService.getRandomImages(10)
    .pipe(
      take(1),
      catchError(() => {
        this.loading.set(false)
        return EMPTY;
      }),
    )
    .subscribe((dogs) => {
      this.mainDog.set(dogs[0]);
      this.thumbnails.set(dogs);
      this.loading.set(false);
    });
  }

  selectDog(dog: DogImage): void {
    this.mainDog.set(dog);
  }

  toggleFavorite(): void {
    const mainDog = this.mainDog();
    if (!mainDog) return;
    if (this.isCurrentFavorited()) {
      this.favorites.update((favorites) => favorites.filter((dog) => dog.url !== mainDog.url));
    } else {
      this.favorites.update((favs) => [...favs, mainDog]);
    }
  }

  removeFavorite(dog: DogImage): void {
    this.favorites.update((favorites) => favorites.filter((favoriteDog) => favoriteDog.url !== dog.url));
  }
}
