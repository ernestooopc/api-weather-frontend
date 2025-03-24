import { Component } from '@angular/core';
import { FavoritesService } from '../favorites.service';
import { FormsModule} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Route,Router } from '@angular/router';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.css'
})
export class FavoritesComponent {
  favorites: string[] = [];
  searchTerm: any;

  constructor(private favoritesService: FavoritesService, private router:Router) {}

  getClima(city: string) {
    this.router.navigate(['/'], { queryParams: { city } });
  }

  ngOnInit() {
    this.loadFavorites();
    console.log(this.favorites);
  }

  loadFavorites() {
    this.favorites = this.favoritesService.getFavorites();
  }

  removeFavorite(city: string) {
    this.favoritesService.removeCity(city);
    this.loadFavorites();
  }

  trackByFn(index: number, item: string) {
    return item;
  }


}
