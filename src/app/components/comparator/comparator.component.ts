import { Component, OnInit, ElementRef, ViewChild, HostListener, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Smartphone, SlideAparelho, EspecificacaoAnimada } from '../../models/smartphone.model';
import { SmartphoneService } from '../../services/smartphone.service';
import { SpecCalloutComponent } from '../spec-callout/spec-callout.component';
import gsap from 'gsap';

@Component({
  selector: 'app-comparator',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, SpecCalloutComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './comparator.component.html',
  styleUrl: './comparator.component.scss'
})
export class ComparatorComponent implements OnInit {
  smartphonesList: Smartphone[] = [];
  
  // Modelos selecionados para comparativo
  smartphoneA?: Smartphone; // Modelo da esquerda (ex: Fold 7)
  smartphoneB?: Smartphone; // Modelo da direita (ex: Fold 8 3D)

  activeSlideIndexA: number = 0;
  activeSlideIndexB: number = 0;

  // Estados de Interface e Edição no CMS
  isEditMode: boolean = false;
  isSideDrawerOpen: boolean = false;
  isFullscreenMode: boolean = false;
  activeDrawerTab: 'modelA' | 'modelB' | 'versus' = 'modelA';
  selectedSpecForDrawer?: EspecificacaoAnimada;

  // Animação e Visibilidade dos Balões
  isCalloutsVisibleA: boolean = true;
  isCalloutsVisibleB: boolean = true;

  // Forçar recriação do Web Component model-viewer
  isReloadingViewerA: boolean = false;
  isReloadingViewerB: boolean = false;

  // Notificações
  notificationMsg: string = '';

  @ViewChild('modelViewerA') modelViewerRefA!: ElementRef<any>;
  @ViewChild('modelViewerB') modelViewerRefB!: ElementRef<any>;
  @ViewChild('stageA') stageA!: ElementRef<HTMLDivElement>;
  @ViewChild('stageB') stageB!: ElementRef<HTMLDivElement>;

  // Opções de cor Neon do Elemento 3D
  neonColorOptions = [
    { label: 'Ciano Neon', value: '#00f2fe' },
    { label: 'Roxo Magenta', value: '#7928ca' },
    { label: 'Rosa Shocking', value: '#ff007f' },
    { label: 'Verde Esmeralda', value: '#38ef7d' },
    { label: 'Dourado Premium', value: '#f5af19' },
    { label: 'Azul Elétrico', value: '#2563eb' }
  ];

  constructor(
    private smartphoneService: SmartphoneService,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.smartphoneService.getSmartphones().subscribe(list => {
      this.smartphonesList = list;

      this.route.queryParams.subscribe(params => {
        const idA = params['a'];
        const idB = params['b'];

        if (this.smartphonesList.length > 0) {
          const itemA = (idA ? this.smartphonesList.find(p => p.id === idA) : null) || 
                        this.smartphonesList.find(p => p.id === 'apex-ultra-16-pro') || 
                        this.smartphonesList[0];

          const itemB = (idB ? this.smartphonesList.find(p => p.id === idB) : null) || 
                        this.smartphonesList.find(p => p.id === 'samsung-z-fold8-3d') || 
                        this.smartphonesList[1] || 
                        this.smartphonesList[0];

          this.smartphoneA = JSON.parse(JSON.stringify(itemA));
          this.smartphoneB = JSON.parse(JSON.stringify(itemB));
        }

        this.initSlideDefaults(this.smartphoneA);
        this.initSlideDefaults(this.smartphoneB);
      });
    });
  }

  private initSlideDefaults(phone?: Smartphone): void {
    if (!phone) return;
    phone.slides.forEach(slide => {
      if (slide.autoRotateSpeed === undefined) slide.autoRotateSpeed = 12;
      if (slide.elementNeonEnabled === undefined) slide.elementNeonEnabled = true;
      if (!slide.elementNeonColor) slide.elementNeonColor = '#00f2fe';
      if (slide.elementNeonIntensity === undefined) slide.elementNeonIntensity = 0.5;
      if (slide.elementNeonRadius === undefined) slide.elementNeonRadius = 45;
    });
  }

  get slideA(): SlideAparelho | undefined {
    return this.smartphoneA?.slides[this.activeSlideIndexA];
  }

  get slideB(): SlideAparelho | undefined {
    return this.smartphoneB?.slides[this.activeSlideIndexB];
  }

  // --- UPLOAD DE MODELO 3D REAL (.GLB) ---
  onModelAFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0] && this.slideA) {
      const file = input.files[0];
      const fileName = file.name.toLowerCase();

      if (fileName.endsWith('.glb') || fileName.endsWith('.gltf')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const glbDataUrl = e.target?.result as string;
          if (this.slideA) {
            this.slideA.modelo3DGlb = glbDataUrl;
            this.slideA.fotoModoFrame = 'modelo-3d-glb';
            this.slideA.autoRotate3D = false;
            this.saveChanges();
            this.showToast('✅ Arquivo 3D GLB do Modelo A carregado!');
          }
        };
        reader.readAsDataURL(file);
      }
    }
  }

  onModelBFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0] && this.slideB) {
      const file = input.files[0];
      const fileName = file.name.toLowerCase();

      if (fileName.endsWith('.glb') || fileName.endsWith('.gltf')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const glbDataUrl = e.target?.result as string;
          if (this.slideB) {
            this.slideB.modelo3DGlb = glbDataUrl;
            this.slideB.fotoModoFrame = 'modelo-3d-glb';
            this.slideB.autoRotate3D = false;
            this.saveChanges();
            this.showToast('✅ Arquivo 3D GLB do Modelo B carregado!');
          }
        };
        reader.readAsDataURL(file);
      }
    }
  }

  // --- NAVEGAÇÃO E TROCA DE SLIDES COM TRANSIÇÃO 3D E NOVAS ESPECIFICAÇÕES ---
  selectSlideA(index: number): void {
    if (this.activeSlideIndexA === index) return;
    this.isCalloutsVisibleA = false;
    this.activeSlideIndexA = index;
    
    // Anima a rotação 3D da câmera para a nova posição do slide A
    setTimeout(() => {
      this.isCalloutsVisibleA = true;
      if (this.modelViewerRefA?.nativeElement && this.slideA) {
        const orbit = this.slideA.compareCameraOrbit || this.slideA.cameraOrbit;
        if (orbit) {
          this.modelViewerRefA.nativeElement.cameraOrbit = orbit;
        }
      }
    }, 100);
  }

  selectSlideB(index: number): void {
    if (this.activeSlideIndexB === index) return;
    this.isCalloutsVisibleB = false;
    this.activeSlideIndexB = index;

    // Anima a rotação 3D da câmera para a nova posição do slide B
    setTimeout(() => {
      this.isCalloutsVisibleB = true;
      if (this.modelViewerRefB?.nativeElement && this.slideB) {
        const orbit = this.slideB.compareCameraOrbit || this.slideB.cameraOrbit;
        if (orbit) {
          this.modelViewerRefB.nativeElement.cameraOrbit = orbit;
        }
      }
    }, 100);
  }

  nextPair(): void {
    if (this.smartphoneA) {
      const nextA = (this.activeSlideIndexA + 1) % this.smartphoneA.slides.length;
      this.selectSlideA(nextA);
    }
    if (this.smartphoneB) {
      const nextB = (this.activeSlideIndexB + 1) % this.smartphoneB.slides.length;
      this.selectSlideB(nextB);
    }
  }

  prevPair(): void {
    if (this.smartphoneA) {
      const prevA = (this.activeSlideIndexA - 1 + this.smartphoneA.slides.length) % this.smartphoneA.slides.length;
      this.selectSlideA(prevA);
    }
    if (this.smartphoneB) {
      const prevB = (this.activeSlideIndexB - 1 + this.smartphoneB.slides.length) % this.smartphoneB.slides.length;
      this.selectSlideB(prevB);
    }
  }

  // --- DRAG & DROP DE CARDS DE ESPECIFICAÇÃO E TAMANHO DE FONTE NO COMPARADOR ---
  draggingSpec?: EspecificacaoAnimada;
  draggingSide?: 'A' | 'B';
  activeDragSpecId?: string;
  initialSpecOffsetX: number = 0;
  initialSpecOffsetY: number = 0;
  initialSpecFontSizeScale: number = 1.0;
  private isDraggingSpec: boolean = false;
  private dragStartMouseX: number = 0;
  private dragStartMouseY: number = 0;

  startSpecDrag(event: MouseEvent, spec: EspecificacaoAnimada, side: 'A' | 'B'): void {
    if (this.isFullscreenMode) return;
    event.stopPropagation();

    this.draggingSpec = spec;
    this.draggingSide = side;
    this.activeDragSpecId = spec.id;
    this.isDraggingSpec = true;
    this.dragStartMouseX = event.clientX;
    this.dragStartMouseY = event.clientY;

    if (spec.posXOffset === undefined) spec.posXOffset = 0;
    if (spec.posYOffset === undefined) spec.posYOffset = 0;
    if (spec.fontSizeScale === undefined) spec.fontSizeScale = 1.0;

    this.initialSpecOffsetX = spec.posXOffset;
    this.initialSpecOffsetY = spec.posYOffset;
    this.initialSpecFontSizeScale = spec.fontSizeScale;
  }

  adjustSpecFontSize(spec: EspecificacaoAnimada, delta: number, event?: Event): void {
    if (event) event.stopPropagation();
    if (spec.fontSizeScale === undefined) spec.fontSizeScale = 1.0;
    const newScale = Math.min(Math.max(Number((spec.fontSizeScale + delta).toFixed(2)), 0.6), 3.0);
    spec.fontSizeScale = newScale;
  }

  @HostListener('document:mousemove', ['$event'])
  onDocumentMouseMove(event: MouseEvent): void {
    if (this.isDraggingSpec && this.draggingSpec) {
      const deltaX = event.clientX - this.dragStartMouseX;
      const deltaY = event.clientY - this.dragStartMouseY;

      this.draggingSpec.posXOffset = Math.round(this.initialSpecOffsetX + deltaX);
      this.draggingSpec.posYOffset = Math.round(this.initialSpecOffsetY + deltaY);
    }
  }

  @HostListener('document:mouseup')
  onDocumentMouseUp(): void {
    if (this.isDraggingSpec) {
      this.isDraggingSpec = false;
    }
  }

  confirmSpecPosition(event?: Event): void {
    if (event) event.stopPropagation();
    this.saveChanges();
    this.activeDragSpecId = undefined;
    this.draggingSpec = undefined;
    this.showToast('💾 Posição e tamanho da especificação salvos!');
  }

  cancelSpecPosition(event?: Event): void {
    if (event) event.stopPropagation();
    if (this.draggingSpec) {
      this.draggingSpec.posXOffset = this.initialSpecOffsetX;
      this.draggingSpec.posYOffset = this.initialSpecOffsetY;
      this.draggingSpec.fontSizeScale = this.initialSpecFontSizeScale;
    }
    this.activeDragSpecId = undefined;
    this.draggingSpec = undefined;
    this.showToast('❌ Alteração de posição e tamanho cancelada.');
  }

  // --- SELEÇÃO DE MODELOS PARA COMPARATIVO NO CMS ---
  onModelASelected(modelId: string): void {
    const found = this.smartphonesList.find(p => p.id === modelId);
    if (found) {
      this.isReloadingViewerA = true;
      this.smartphoneA = JSON.parse(JSON.stringify(found));
      this.activeSlideIndexA = 0;
      this.initSlideDefaults(this.smartphoneA);
      this.saveChanges();
      setTimeout(() => { this.isReloadingViewerA = false; }, 60);
      this.showToast(`📱 Modelo A alterado para ${found.modelo}`);
    }
  }

  onModelBSelected(modelId: string): void {
    const found = this.smartphonesList.find(p => p.id === modelId);
    if (found) {
      this.isReloadingViewerB = true;
      this.smartphoneB = JSON.parse(JSON.stringify(found));
      this.activeSlideIndexB = 0;
      this.initSlideDefaults(this.smartphoneB);
      this.saveChanges();
      setTimeout(() => { this.isReloadingViewerB = false; }, 60);
      this.showToast(`📱 Modelo B alterado para ${found.modelo}`);
    }
  }

  // --- CONTROLES INDEPENDENTES DE POSIÇÃO 3D E CÂMERA DO COMPARADOR (NÃO AFETAM A APRESENTAÇÃO SOLO) ---
  capture3DPositionA(): void {
    if (!this.slideA || !this.modelViewerRefA?.nativeElement) return;
    const viewer = this.modelViewerRefA.nativeElement;
    
    this.slideA.compareAutoRotate3D = false;

    if (typeof viewer.getCameraOrbit === 'function') {
      const orbit = viewer.getCameraOrbit();
      if (orbit) {
        const thetaDeg = Math.round((orbit.theta * 180) / Math.PI);
        const phiDeg = Math.round((orbit.phi * 180) / Math.PI);
        const radius = orbit.radius ? `${orbit.radius.toFixed(2)}m` : 'auto';
        this.slideA.compareCameraOrbit = `${thetaDeg}deg ${phiDeg}deg ${radius}`;
      }
    }
    if (typeof viewer.getFieldOfView === 'function') {
      const fov = viewer.getFieldOfView();
      if (fov) this.slideA.compareFieldOfView = `${fov.toFixed(1)}deg`;
    }
    if (typeof viewer.getCameraTarget === 'function') {
      const target = viewer.getCameraTarget();
      if (target) this.slideA.compareCameraTarget = `${target.x.toFixed(2)}m ${target.y.toFixed(2)}m ${target.z.toFixed(2)}m`;
    }
    this.saveChanges();
    this.showToast('📌 Posição 3D do Modelo A FIXADA no Comparador!');
  }

  capture3DPositionB(): void {
    if (!this.slideB || !this.modelViewerRefB?.nativeElement) return;
    const viewer = this.modelViewerRefB.nativeElement;

    this.slideB.compareAutoRotate3D = false;

    if (typeof viewer.getCameraOrbit === 'function') {
      const orbit = viewer.getCameraOrbit();
      if (orbit) {
        const thetaDeg = Math.round((orbit.theta * 180) / Math.PI);
        const phiDeg = Math.round((orbit.phi * 180) / Math.PI);
        const radius = orbit.radius ? `${orbit.radius.toFixed(2)}m` : 'auto';
        this.slideB.compareCameraOrbit = `${thetaDeg}deg ${phiDeg}deg ${radius}`;
      }
    }
    if (typeof viewer.getFieldOfView === 'function') {
      const fov = viewer.getFieldOfView();
      if (fov) this.slideB.compareFieldOfView = `${fov.toFixed(1)}deg`;
    }
    if (typeof viewer.getCameraTarget === 'function') {
      const target = viewer.getCameraTarget();
      if (target) this.slideB.compareCameraTarget = `${target.x.toFixed(2)}m ${target.y.toFixed(2)}m ${target.z.toFixed(2)}m`;
    }
    this.saveChanges();
    this.showToast('📌 Posição 3D do Modelo B FIXADA no Comparador!');
  }

  // --- CONTROLE DE PRECISÃO DE ZOOM / DISTÂNCIA 3D VIA SLIDER ---
  get3DDistanceA(): number {
    const orbit = this.slideA?.compareCameraOrbit || this.slideA?.cameraOrbit || '0deg 75deg 1.6m';
    const match = orbit.match(/([\d\.]+)m$/i);
    return match ? parseFloat(match[1]) : 1.6;
  }

  set3DDistanceA(val: number): void {
    if (!this.slideA) return;
    const currentOrbit = this.slideA.compareCameraOrbit || this.slideA.cameraOrbit || '0deg 75deg 1.6m';
    const parts = currentOrbit.trim().split(/\s+/);
    const theta = parts[0] || '0deg';
    const phi = parts[1] || '75deg';
    const newOrbit = `${theta} ${phi} ${val.toFixed(2)}m`;

    this.slideA.compareCameraOrbit = newOrbit;
    if (this.modelViewerRefA?.nativeElement) {
      this.modelViewerRefA.nativeElement.cameraOrbit = newOrbit;
    }
    this.saveChanges();
  }

  get3DDistanceB(): number {
    const orbit = this.slideB?.compareCameraOrbit || this.slideB?.cameraOrbit || '0deg 75deg 1.6m';
    const match = orbit.match(/([\d\.]+)m$/i);
    return match ? parseFloat(match[1]) : 1.6;
  }

  set3DDistanceB(val: number): void {
    if (!this.slideB) return;
    const currentOrbit = this.slideB.compareCameraOrbit || this.slideB.cameraOrbit || '0deg 75deg 1.6m';
    const parts = currentOrbit.trim().split(/\s+/);
    const theta = parts[0] || '0deg';
    const phi = parts[1] || '75deg';
    const newOrbit = `${theta} ${phi} ${val.toFixed(2)}m`;

    this.slideB.compareCameraOrbit = newOrbit;
    if (this.modelViewerRefB?.nativeElement) {
      this.modelViewerRefB.nativeElement.cameraOrbit = newOrbit;
    }
    this.saveChanges();
  }

  toggleAutoRotateA(): void {
    if (!this.slideA) return;
    this.slideA.compareAutoRotate3D = !this.slideA.compareAutoRotate3D;
    this.saveChanges();
    this.showToast(this.slideA.compareAutoRotate3D ? '🔄 Rotação 3D do Modelo A ATIVADA' : '🛑 Rotação do Modelo A DESATIVADA');
  }

  toggleAutoRotateB(): void {
    if (!this.slideB) return;
    this.slideB.compareAutoRotate3D = !this.slideB.compareAutoRotate3D;
    this.saveChanges();
    this.showToast(this.slideB.compareAutoRotate3D ? '🔄 Rotação 3D do Modelo B ATIVADA' : '🛑 Rotação do Modelo B DESATIVADA');
  }

  // --- FILTROS DE NEON EXCLUSIVOS ---
  getElementNeonFilterA(): string {
    if (!this.slideA || this.slideA.elementNeonEnabled === false) return 'drop-shadow(0 30px 60px rgba(0,0,0,0.9))';
    const color = this.slideA.elementNeonColor || '#00f2fe';
    const intensity = this.slideA.elementNeonIntensity !== undefined ? this.slideA.elementNeonIntensity : 0.5;
    const radius = this.slideA.elementNeonRadius !== undefined ? this.slideA.elementNeonRadius : 45;
    const rgba = this.hexToRgba(color, intensity);
    return `drop-shadow(0 30px 60px rgba(0, 0, 0, 0.9)) drop-shadow(0 0 ${radius}px ${rgba})`;
  }

  getElementNeonFilterB(): string {
    if (!this.slideB || this.slideB.elementNeonEnabled === false) return 'drop-shadow(0 30px 60px rgba(0,0,0,0.9))';
    const color = this.slideB.elementNeonColor || '#7928ca';
    const intensity = this.slideB.elementNeonIntensity !== undefined ? this.slideB.elementNeonIntensity : 0.5;
    const radius = this.slideB.elementNeonRadius !== undefined ? this.slideB.elementNeonRadius : 45;
    const rgba = this.hexToRgba(color, intensity);
    return `drop-shadow(0 30px 60px rgba(0, 0, 0, 0.9)) drop-shadow(0 0 ${radius}px ${rgba})`;
  }

  getElementNeonBoxShadowA(): string {
    if (!this.slideA || this.slideA.elementNeonEnabled === false) return '0 30px 60px rgba(0,0,0,0.9)';
    const color = this.slideA.elementNeonColor || '#00f2fe';
    const intensity = this.slideA.elementNeonIntensity !== undefined ? this.slideA.elementNeonIntensity : 0.5;
    const radius = this.slideA.elementNeonRadius !== undefined ? this.slideA.elementNeonRadius : 45;
    const rgba = this.hexToRgba(color, intensity);
    return `0 30px 60px rgba(0, 0, 0, 0.9), 0 0 ${radius}px ${rgba}`;
  }

  getElementNeonBoxShadowB(): string {
    if (!this.slideB || this.slideB.elementNeonEnabled === false) return '0 30px 60px rgba(0,0,0,0.9)';
    const color = this.slideB.elementNeonColor || '#7928ca';
    const intensity = this.slideB.elementNeonIntensity !== undefined ? this.slideB.elementNeonIntensity : 0.5;
    const radius = this.slideB.elementNeonRadius !== undefined ? this.slideB.elementNeonRadius : 45;
    const rgba = this.hexToRgba(color, intensity);
    return `0 30px 60px rgba(0, 0, 0, 0.9), 0 0 ${radius}px ${rgba}`;
  }

  hexToRgba(hex: string, alpha: number): string {
    let c: any;
    if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
      c = hex.substring(1).split('');
      if (c.length === 3) c = [c[0], c[0], c[1], c[1], c[2], c[2]];
      c = '0x' + c.join('');
      return `rgba(${[(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',')},${alpha})`;
    }
    return `rgba(0, 242, 254, ${alpha})`;
  }

  // --- MODO EDIÇÃO E GAVETA LATERAL ---
  toggleEditMode(): void {
    this.isEditMode = !this.isEditMode;
    if (!this.isEditMode) this.closeSideDrawer();
  }

  openSideDrawer(tab: 'modelA' | 'modelB' | 'versus'): void {
    this.activeDrawerTab = tab;
    this.isSideDrawerOpen = true;
  }

  closeSideDrawer(): void {
    this.isSideDrawerOpen = false;
  }

  // --- MODO TELA CHEIA E TECLADO ---
  toggleFullscreen(): void {
    this.isFullscreenMode = !this.isFullscreenMode;
    if (this.isFullscreenMode) {
      this.isEditMode = false;
      this.closeSideDrawer();
      document.body.classList.add('fullscreen-mode-active');
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().catch(() => {});
      }
    } else {
      document.body.classList.remove('fullscreen-mode-active');
      if (document.fullscreenElement && document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    }
    this.injectFullscreenShadowDomCursor();
  }

  @HostListener('document:fullscreenchange', [])
  onFullscreenChange(): void {
    this.isFullscreenMode = !!document.fullscreenElement;
    if (this.isFullscreenMode) {
      this.isEditMode = false;
      this.closeSideDrawer();
      document.body.classList.add('fullscreen-mode-active');
    } else {
      document.body.classList.remove('fullscreen-mode-active');
    }
    this.injectFullscreenShadowDomCursor();
  }

  @HostListener('window:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    const targetTag = (event.target as HTMLElement)?.tagName?.toLowerCase();
    if (targetTag === 'input' || targetTag === 'textarea' || targetTag === 'select') return;

    if (event.code === 'Space' || event.key === ' ' || event.key === 'ArrowRight' || event.key === 'PageDown') {
      event.preventDefault();
      this.nextPair();
    } else if (event.key === 'ArrowLeft' || event.key === 'PageUp') {
      event.preventDefault();
      this.prevPair();
    }
  }

  injectFullscreenShadowDomCursor(): void {
    [this.modelViewerRefA?.nativeElement, this.modelViewerRefB?.nativeElement].forEach(viewer => {
      if (!viewer) return;
      try {
        const shadowRoot = viewer.shadowRoot;
        if (shadowRoot) {
          let shadowStyle = shadowRoot.querySelector('#fullscreen-custom-cursor-style');
          if (!shadowStyle) {
            shadowStyle = document.createElement('style');
            shadowStyle.id = 'fullscreen-custom-cursor-style';
            shadowRoot.appendChild(shadowStyle);
          }
          if (this.isFullscreenMode) {
            shadowStyle.textContent = `*, canvas { cursor: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="rgba(255,255,255,0.15)" stroke="rgba(0,242,254,0.3)" stroke-width="1.5" d="M3 3l7 18 3-7 7-3L3 3z"/></svg>') 0 0, auto !important; }`;
          } else {
            shadowStyle.textContent = '';
          }
        }
      } catch (e) {}
    });
  }

  saveChanges(): void {
    if (this.smartphoneA) {
      const idxA = this.smartphonesList.findIndex(p => p.id === this.smartphoneA?.id);
      if (idxA !== -1) {
        this.smartphonesList[idxA] = JSON.parse(JSON.stringify(this.smartphoneA));
      }
    }
    if (this.smartphoneB) {
      const idxB = this.smartphonesList.findIndex(p => p.id === this.smartphoneB?.id);
      if (idxB !== -1) {
        this.smartphonesList[idxB] = JSON.parse(JSON.stringify(this.smartphoneB));
      }
    }
    if (this.smartphonesList.length > 0) {
      this.smartphoneService.saveSmartphonesToStorage(this.smartphonesList);
    }
  }

  private showToast(msg: string): void {
    if (this.isFullscreenMode) return;
    this.notificationMsg = msg;
    setTimeout(() => { this.notificationMsg = ''; }, 2500);
  }
}
