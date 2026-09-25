import { Component, OnInit, inject } from '@angular/core';
import { DogStateService } from './services/dog-state.service';
import { FavoritesComponent } from './components/favorites/favorites';
import { MainImageComponent } from './components/main-image/main-image';
import { ThumbnailsComponent } from './components/thumbnails/thumbnails';

@Component({
  selector: 'app-root',
  imports: [FavoritesComponent, MainImageComponent, ThumbnailsComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  dogStateService = inject(DogStateService);

  ngOnInit() {
    this.dogStateService.loadDogs();
  }
}
