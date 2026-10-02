import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'visualizador/apex-ultra-16-pro', pathMatch: 'full' },
  { 
    path: 'catalogo', 
    loadComponent: () => import('./components/catalog/catalog.component').then(m => m.CatalogComponent) 
  },
  { 
    path: 'visualizador/:id', 
    loadComponent: () => import('./components/specs-visualizer/specs-visualizer.component').then(m => m.SpecsVisualizerComponent) 
  },
  { 
    path: 'comparador', 
    loadComponent: () => import('./components/comparator/comparator.component').then(m => m.ComparatorComponent) 
  },
  { 
    path: 'admin', 
    loadComponent: () => import('./components/admin/admin.component').then(m => m.AdminComponent) 
  },
  { path: '**', redirectTo: 'catalogo' }
];
