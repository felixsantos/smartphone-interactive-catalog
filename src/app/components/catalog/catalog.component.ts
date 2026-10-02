import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SmartphoneService } from '../../services/smartphone.service';
import { Smartphone } from '../../models/smartphone.model';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [CommonModule, RouterLink, NavbarComponent],
  templateUrl: './catalog.component.html',
  styleUrl: './catalog.component.scss'
})
export class CatalogComponent implements OnInit {
  smartphones: Smartphone[] = [];
  filteredSmartphones: Smartphone[] = [];
  selectedBrand: string = 'TODAS';
  searchQuery: string = '';

  brands: string[] = ['TODAS', 'Samsung', 'APEX', 'NOVA'];

  // Seleção via Checkbox para Comparativo Dual 3D (Inicia vazio por padrão)
  selectedCompareIds: string[] = [];

  constructor(private smartphoneService: SmartphoneService) {}

  ngOnInit(): void {
    this.smartphoneService.getSmartphones().subscribe(phones => {
      this.smartphones = phones;
      this.filteredSmartphones = phones;
    });
  }

  toggleCompare(phoneId: string, event: Event): void {
    event.stopPropagation();
    event.preventDefault();

    const index = this.selectedCompareIds.indexOf(phoneId);
    if (index !== -1) {
      this.selectedCompareIds.splice(index, 1);
    } else {
      if (this.selectedCompareIds.length >= 2) {
        this.selectedCompareIds.shift(); // remove o mais antigo se já houver 2
      }
      this.selectedCompareIds.push(phoneId);
    }
  }

  isCompared(phoneId: string): boolean {
    return this.selectedCompareIds.includes(phoneId);
  }

  clearCompareSelection(): void {
    this.selectedCompareIds = [];
  }

  filterByBrand(brand: string): void {
    this.selectedBrand = brand;
    this.applyFilters();
  }

  onSearchChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchQuery = input.value.toLowerCase();
    this.applyFilters();
  }

  private applyFilters(): void {
    this.filteredSmartphones = this.smartphones.filter(phone => {
      const matchesBrand = this.selectedBrand === 'TODAS' || phone.marca.toUpperCase() === this.selectedBrand.toUpperCase();
      const matchesSearch = phone.modelo.toLowerCase().includes(this.searchQuery) || 
                            phone.tagline.toLowerCase().includes(this.searchQuery);
      return matchesBrand && matchesSearch;
    });
  }
}
