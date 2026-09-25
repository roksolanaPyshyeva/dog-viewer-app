import { Component, inject, input, output } from '@angular/core';
import { DogImage } from '../../services/dog.service';
import { DogStateService } from '../../services/dog-state.service';

@Component({
  selector: 'app-thumbnails',
  templateUrl: './thumbnails.html',
  styleUrl: './thumbnails.scss',
})
export class ThumbnailsComponent {
  dogStateService = inject(DogStateService);

  onDogSelected(dog: DogImage): void {
    this.dogStateService.selectDog(dog);
  }
}
