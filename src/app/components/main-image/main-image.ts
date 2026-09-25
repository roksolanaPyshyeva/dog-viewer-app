import { Component, inject } from '@angular/core';
import { DogStateService } from '../../services/dog-state.service';

@Component({
  selector: 'app-main-image',
  templateUrl: './main-image.html',
  styleUrl: './main-image.scss',
})
export class MainImageComponent {
  dogStateService = inject(DogStateService);

  onToggleFavorite(): void {
    this.dogStateService.toggleFavorite();
  }
}
