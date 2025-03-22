import { Routes } from '@angular/router';
import { MainComponent } from './main/main.component';
import { FavoritesComponent } from './favorites/favorites.component';

export const routes: Routes = [

  {path:'', component:MainComponent},
  { path: 'favorites', component: FavoritesComponent }

];
