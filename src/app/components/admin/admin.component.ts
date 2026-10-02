import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { SmartphoneService } from '../../services/smartphone.service';
import { Smartphone, SlideAparelho, EspecificacaoAnimada } from '../../models/smartphone.model';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, NavbarComponent],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent implements OnInit {
  smartphones: Smartphone[] = [];
  selectedPhone?: Smartphone;
  activeSlideIndex: number = 0;

  // Form Editing State
  editingSpec?: EspecificacaoAnimada;
  isEditingSpecModal: boolean = false;
  isNewSpec: boolean = false;

  // Interactive Position Picker
  @ViewChild('phoneFramePicker') phoneFramePicker!: ElementRef<HTMLDivElement>;

  iconOptions: string[] = ['camera', 'zoom-in', 'aperture', 'layers', 'cpu', 'zap', 'activity', 'wind', 'sun', 'refresh-cw', 'shield', 'battery-charging', 'radio'];
  directionOptions: ('top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'top' | 'bottom')[] = ['top-left', 'top-right', 'bottom-left', 'bottom-right', 'top', 'bottom'];

  notificationMessage: string = '';

  constructor(private smartphoneService: SmartphoneService) {}

  ngOnInit(): void {
    this.loadCatalog();
  }

  loadCatalog(): void {
    this.smartphoneService.getSmartphones().subscribe(phones => {
      this.smartphones = phones;
      if (phones.length > 0) {
        if (this.selectedPhone) {
          const reFound = phones.find(p => p.id === this.selectedPhone?.id);
          this.selectedPhone = reFound || phones[0];
        } else {
          this.selectedPhone = phones[0];
        }
      }
    });
  }

  selectPhone(phone: Smartphone): void {
    this.selectedPhone = phone;
    this.activeSlideIndex = 0;
  }

  selectSlide(index: number): void {
    this.activeSlideIndex = index;
  }

  // --- DEVICE ACTIONS ---
  addNewDevice(): void {
    const newId = 'phone-' + Date.now();
    const newPhone: Smartphone = {
      id: newId,
      marca: 'NOVA MARCA',
      modelo: 'Modelo Pro X',
      tagline: 'Novo smartphone topo de linha com inteligência de silício.',
      preco: 'R$ 7.999,00',
      corHex: '#00f2fe',
      imagemThumb: '',
      destaques: ['Câmera 50 MP', 'Chip Pro 3nm', 'Tela OLED 120Hz'],
      slides: [
        {
          id: 'slide-cam-' + Date.now(),
          tipo: 'camera',
          tituloSlide: 'Sistema de Câmeras',
          subtituloSlide: 'Óptica de Precisão',
          descricaoSlide: 'Capturas de ultra alta definição com estabilização óptica.',
          imagemCutout: 'camera',
          especificacoes: [
            {
              id: 'spec-1',
              titulo: 'Lente Principal',
              valor: '50 MP • f/1.8',
              detalhe: 'Sensor de alto desempenho.',
              posicaoX: 45,
              posicaoY: 35,
              direcaoSeta: 'top-left',
              icone: 'camera'
            }
          ]
        }
      ]
    };

    this.smartphones.push(newPhone);
    this.selectedPhone = newPhone;
    this.saveToStorage('Novo smartphone criado com sucesso!');
  }

  deleteCurrentDevice(): void {
    if (!this.selectedPhone) return;
    if (confirm(`Tem certeza que deseja excluir o modelo ${this.selectedPhone.modelo}?`)) {
      this.smartphones = this.smartphones.filter(p => p.id !== this.selectedPhone?.id);
      this.selectedPhone = this.smartphones.length > 0 ? this.smartphones[0] : undefined;
      this.saveToStorage('Smartphone excluído.');
    }
  }

  // --- SLIDE ACTIONS ---
  addNewSlide(): void {
    if (!this.selectedPhone) return;

    const newSlide: SlideAparelho = {
      id: 'slide-' + Date.now(),
      tipo: 'processador',
      tituloSlide: 'Novo Slide de Destaque',
      subtituloSlide: 'Engenharia Avançada',
      descricaoSlide: 'Descrição detalhada dos componentes de hardware.',
      imagemCutout: 'chip',
      especificacoes: []
    };

    this.selectedPhone.slides.push(newSlide);
    this.activeSlideIndex = this.selectedPhone.slides.length - 1;
    this.saveToStorage('Novo slide adicionado!');
  }

  deleteCurrentSlide(): void {
    if (!this.selectedPhone || this.selectedPhone.slides.length <= 1) {
      alert('O smartphone precisa ter pelo menos 1 slide.');
      return;
    }
    this.selectedPhone.slides.splice(this.activeSlideIndex, 1);
    this.activeSlideIndex = 0;
    this.saveToStorage('Slide removido.');
  }

  // --- SPECIFICATION CALLOUT ACTIONS ---
  openAddSpecModal(): void {
    this.isNewSpec = true;
    this.editingSpec = {
      id: 'spec-' + Date.now(),
      titulo: 'Nova Especificação',
      valor: '50 MP • f/1.8',
      detalhe: 'Descrição detalhada da funcionalidade.',
      posicaoX: 50,
      posicaoY: 50,
      direcaoSeta: 'top-left',
      icone: 'camera'
    };
    this.isEditingSpecModal = true;
  }

  openEditSpecModal(spec: EspecificacaoAnimada): void {
    this.isNewSpec = false;
    this.editingSpec = { ...spec };
    this.isEditingSpecModal = true;
  }

  saveSpecModal(): void {
    if (!this.selectedPhone || !this.editingSpec) return;

    const activeSlide = this.selectedPhone.slides[this.activeSlideIndex];
    if (this.isNewSpec) {
      activeSlide.especificacoes.push(this.editingSpec);
    } else {
      const idx = activeSlide.especificacoes.findIndex(s => s.id === this.editingSpec?.id);
      if (idx !== -1) {
        activeSlide.especificacoes[idx] = { ...this.editingSpec };
      }
    }

    this.isEditingSpecModal = false;
    this.saveToStorage('Especificação salva!');
  }

  deleteSpec(specId: string): void {
    if (!this.selectedPhone) return;
    const activeSlide = this.selectedPhone.slides[this.activeSlideIndex];
    activeSlide.especificacoes = activeSlide.especificacoes.filter(s => s.id !== specId);
    this.saveToStorage('Especificação removida.');
  }

  // --- INTERACTIVE VISUAL PICKER ---
  onFrameClick(event: MouseEvent): void {
    if (!this.phoneFramePicker || !this.editingSpec) return;

    const rect = this.phoneFramePicker.nativeElement.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Convert to percentages (0 - 100)
    const posXPercent = Math.round((x / rect.width) * 100);
    const posYPercent = Math.round((y / rect.height) * 100);

    this.editingSpec.posicaoX = Math.min(Math.max(posXPercent, 5), 95);
    this.editingSpec.posicaoY = Math.min(Math.max(posYPercent, 5), 95);
  }

  // --- IMAGE UPLOAD SIMULATION ---
  onImageSelected(event: Event, targetField: 'thumb' | 'cutout'): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64Image = e.target?.result as string;
        if (targetField === 'thumb' && this.selectedPhone) {
          this.selectedPhone.imagemThumb = base64Image;
        } else if (targetField === 'cutout' && this.selectedPhone) {
          this.selectedPhone.slides[this.activeSlideIndex].imagemCutout = base64Image;
        }
        this.saveToStorage('Imagem carregada com sucesso!');
      };
      reader.readAsDataURL(file);
    }
  }

  // --- LOCALSTORAGE & JSON EXPORT/IMPORT ---
  saveToStorage(msg: string = 'Alterações salvas!'): void {
    this.smartphoneService.saveSmartphonesToStorage(this.smartphones);
    this.showNotification(msg);
  }

  exportJSON(): void {
    const jsonString = JSON.stringify(this.smartphones, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'smartphones-catalogo.json';
    a.click();
    URL.revokeObjectURL(url);
    this.showNotification('JSON exportado com sucesso!');
  }

  importJSON(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const parsed = JSON.parse(e.target?.result as string);
          if (Array.isArray(parsed)) {
            this.smartphones = parsed;
            this.selectedPhone = parsed[0];
            this.activeSlideIndex = 0;
            this.saveToStorage('JSON importado com sucesso!');
          }
        } catch (err) {
          alert('Erro ao processar arquivo JSON. Verifique a estrutura.');
        }
      };
      reader.readAsText(input.files[0]);
    }
  }

  restoreDefaults(): void {
    if (confirm('Deseja restaurar o catálogo padrão de fábrica? Suas edições locais serão sobrescritas.')) {
      this.smartphoneService.resetToDefaults();
      this.loadCatalog();
      this.showNotification('Catálogo restaurado para os padrões!');
    }
  }

  private showNotification(msg: string): void {
    this.notificationMessage = msg;
    setTimeout(() => {
      this.notificationMessage = '';
    }, 3500);
  }
}
