import { Component, inject, input, output } from '@angular/core';
import { DogImage } from '../../services/dog.service';
import { DogStateService } from '../../services/dog-state.service';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.html',
  styleUrl: './favorites.scss',
})
export class FavoritesComponent {
  dogStateService = inject(DogStateService);

  onDogSelected(dog: DogImage): void {
    this.dogStateService.selectDog(dog);
  }

  onFavoriteremoved(dog: DogImage): void {
    this.dogStateService.removeFavorite(dog);
  }
}
