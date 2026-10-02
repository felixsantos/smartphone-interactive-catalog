import { Component, OnInit, ElementRef, ViewChild, HostListener, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { SmartphoneService } from '../../services/smartphone.service';
import { Smartphone, SlideAparelho, EspecificacaoAnimada } from '../../models/smartphone.model';
import { NavbarComponent } from '../navbar/navbar.component';
import { SpecCalloutComponent } from '../spec-callout/spec-callout.component';
import gsap from 'gsap';
import { take } from 'rxjs';

@Component({
  selector: 'app-specs-visualizer',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, NavbarComponent, SpecCalloutComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './specs-visualizer.component.html',
  styleUrl: './specs-visualizer.component.scss'
})
export class SpecsVisualizerComponent implements OnInit {
  Math = Math;

  smartphonesList: Smartphone[] = [];
  smartphone?: Smartphone;
  activeSlideIndex: number = 0;
  isCalloutsVisible: boolean = true;
  isAutoplay: boolean = false;
  autoplayInterval?: any;

  // FULLSCREEN & PRESENTATION STATE
  isFullscreenMode: boolean = false;

  // 3D IDLE TIMER FOR RETURNING TO SAVED CAMERA ANGLE
  idleCameraResetTimeout?: any;

  // TAB SLIDE DRAG & DROP REORDERING STATE
  draggedSlideIndex: number | null = null;
  dragOverSlideIndex: number | null = null;

  // LAYERS TREE DRAG & DROP REORDERING STATE
  draggedSpecIndex: number | null = null;
  dragOverSpecIndex: number | null = null;

  // SIDE DRAWER EDITOR & LAYERS TREE STATE
  isEditMode: boolean = false;
  activeDrawerTab: 'layers' | 'properties' = 'layers';
  selectedSpecForDrawer?: EspecificacaoAnimada;
  isEditingBgText: boolean = false;
  isEditingCentralElement: boolean = false;
  notificationMsg: string = '';

  // DEDICATED SVG & IFRAME CODE INPUT AREA
  rawSvgInput: string = '';
  rawIframeEmbedInput: string = '';

  // INTERACTIVE DRAG & SCALE STATE FOR GIANT BG TEXT
  isDraggingBgText: boolean = false;
  isResizingBgText: boolean = false;
  dragStartX: number = 0;
  dragStartY: number = 0;
  initialPosX: number = 50;
  initialPosY: number = 20;
  initialScale: number = 1.0;

  // 3D Motion state
  mouseX: number = 0;
  mouseY: number = 0;
  tiltX: number = 0;
  tiltY: number = 0;

  @ViewChild('phoneStage') phoneStage!: ElementRef<HTMLDivElement>;
  @ViewChild('stageContainer') stageContainer!: ElementRef<HTMLDivElement>;
  @ViewChild('modelViewer') modelViewerRef!: ElementRef<any>;

  iconOptions: string[] = ['camera', 'zoom-in', 'aperture', 'layers', 'cpu', 'zap', 'activity', 'wind', 'sun', 'refresh-cw', 'shield', 'battery-charging', 'radio'];
  directionOptions: ('top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'top' | 'bottom')[] = ['top-left', 'top-right', 'bottom-left', 'bottom-right', 'top', 'bottom'];
  bgPositionOptions: ('tras-direita' | 'tras-esquerda' | 'centro-atras')[] = ['tras-direita', 'tras-esquerda', 'centro-atras'];
  silhuetaOptions: ('camera' | 'processador' | 'tela' | 'bateria' | 'peso' | 'nenhuma')[] = ['camera', 'processador', 'tela', 'bateria', 'peso', 'nenhuma'];
  fotoFitOptions: ('contain' | 'cover' | 'fill')[] = ['contain', 'cover', 'fill'];
  neonColorOptions = [
    { label: '🩵 Azul Ciano Cyberpunk', value: '#00f2fe' },
    { label: '💜 Violeta Neon', value: '#7928ca' },
    { label: '🩷 Rosa Magenta', value: '#ff007f' },
    { label: '💚 Verde Esmeralda', value: '#38ef7d' },
    { label: '❤️ Vermelho Vivo', value: '#f12711' },
    { label: '💛 Amarelo Elétrico', value: '#fde047' },
    { label: '🤍 Branco Puro', value: '#ffffff' }
  ];

  constructor(
    private route: ActivatedRoute,
    private smartphoneService: SmartphoneService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.smartphoneService.getSmartphones().subscribe(phones => {
      this.smartphonesList = phones;

      this.smartphonesList.forEach(phone => {
        phone.slides.forEach(slide => {
          if (slide.fotoDepth3D === undefined) {
            slide.fotoDepth3D = 45;
          }
          if (!slide.fotoModoFrame) {
            slide.fotoModoFrame = 'sem-moldura';
          }
          if (!slide.fotoFit) {
            slide.fotoFit = 'contain';
          }
          if (slide.fotoScale === undefined) {
            slide.fotoScale = 1.0;
          }
          if (slide.autoRotate3D === undefined) {
            slide.autoRotate3D = !slide.cameraOrbit;
          }
          if (slide.autoRotateSpeed === undefined) {
            slide.autoRotateSpeed = 12;
          }
          if (slide.glbCustomMaterialEnabled === undefined) {
            slide.glbCustomMaterialEnabled = false;
          }

          // Inicialização de neon exclusivo do elemento 3D
          if (slide.elementNeonEnabled === undefined) {
            slide.elementNeonEnabled = true;
          }
          if (!slide.elementNeonColor) {
            slide.elementNeonColor = '#7928ca';
          }
          if (slide.elementNeonIntensity === undefined) {
            slide.elementNeonIntensity = 0.5;
          }
          if (slide.elementNeonRadius === undefined) {
            slide.elementNeonRadius = 45;
          }

          if (slide.textoFundo) {
            if (!slide.textoFundo.silhueta) {
              slide.textoFundo.silhueta = slide.tipo as any || 'camera';
            }
            if (slide.textoFundo.silhuetaScale === undefined) {
              slide.textoFundo.silhuetaScale = 1.8;
            }
            if (slide.textoFundo.silhuetaOpacity === undefined) {
              slide.textoFundo.silhuetaOpacity = 0.25;
            }
          }
        });
      });

      // Preserva o smartphone atualmente selecionado ou busca da rota
      const currentParamId = this.route.snapshot.params['id'];
      if (this.smartphone) {
        const reFound = this.smartphonesList.find(p => p.id === this.smartphone?.id);
        if (reFound) {
          this.smartphone = reFound;
        }
      } else if (currentParamId) {
        this.smartphone = this.smartphonesList.find(p => p.id === currentParamId) || this.smartphonesList[0];
      } else if (this.smartphonesList.length > 0) {
        this.smartphone = this.smartphonesList[0];
      }

      if (this.smartphone) {
        if (!this.smartphone.modoAvancoSlides) {
          this.smartphone.modoAvancoSlides = 'teclado-espaco';
        }
        if (this.smartphone.tempoAutoplaySegundos === undefined) {
          this.smartphone.tempoAutoplaySegundos = 5;
        }
      }

      if (this.activeSlideIndex >= (this.smartphone?.slides.length || 1)) {
        this.activeSlideIndex = 0;
      }
    });

    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id && this.smartphonesList.length > 0) {
        const found = this.smartphonesList.find(p => p.id === id);
        if (found) {
          this.smartphone = found;
          if (this.activeSlideIndex >= (this.smartphone.slides.length || 1)) {
            this.activeSlideIndex = 0;
          }
          this.triggerSlideTransition();
        }
      }
    });
  }

  onModoAvancoChanged(): void {
    if (!this.smartphone) return;
    if (this.smartphone.modoAvancoSlides === 'automatico') {
      if (!this.isAutoplay) {
        this.toggleAutoplay();
      }
    } else {
      if (this.isAutoplay && this.autoplayInterval) {
        clearInterval(this.autoplayInterval);
        this.isAutoplay = false;
      }
    }
    this.saveChanges();
    this.showToast(
      this.smartphone.modoAvancoSlides === 'automatico'
        ? `⏱️ Modo Automático (${this.smartphone.tempoAutoplaySegundos || 5}s) ativado no CMS.`
        : this.smartphone.modoAvancoSlides === 'teclado-espaco'
          ? '⌨️ Modo Teclado (Tecla ESPAÇO) ativado no CMS.'
          : '🖱️ Modo Manual por Cliques ativado no CMS.'
    );
  }

  get activeSlide(): SlideAparelho | undefined {
    return this.smartphone?.slides[this.activeSlideIndex];
  }

  getEffectiveSilhueta(): string {
    if (!this.activeSlide?.textoFundo) return 'camera';
    if (this.activeSlide.textoFundo.silhueta) {
      return this.activeSlide.textoFundo.silhueta;
    }
    return this.activeSlide.tipo || 'camera';
  }

  getGradStart(tipo?: string): string {
    switch (tipo) {
      case 'camera': return '#00f2fe';
      case 'processador': return '#ff007f';
      case 'tela': return '#38ef7d';
      case 'bateria': return '#f12711';
      default: return '#00f2fe';
    }
  }

  getGradEnd(tipo?: string): string {
    switch (tipo) {
      case 'camera': return '#4facfe';
      case 'processador': return '#7928ca';
      case 'tela': return '#11998e';
      case 'bateria': return '#f5af19';
      default: return '#4facfe';
    }
  }

  // --- MODO EDIÇÃO & ÁRVORE DE CAMADAS DA TELA ---
  toggleEditMode(): void {
    if (this.isFullscreenMode) {
      this.showToast('⚠️ Edição bloqueada no modo Tela Cheia. Saia do fullscreen para editar.');
      return;
    }

    this.isEditMode = !this.isEditMode;
    if (!this.isEditMode) {
      this.closeSideDrawer();
      this.saveChanges();
    } else {
      this.isCalloutsVisible = true;
      this.activeDrawerTab = 'layers';
      this.selectedSpecForDrawer = undefined;
      this.isEditingBgText = false;
      this.isEditingCentralElement = false;
      this.showToast('🥞 Árvore de Camadas aberta! Gerencie e edite os componentes da tela.');
    }
  }

  openLayersTreeDrawer(): void {
    if (this.isFullscreenMode) return;
    this.isEditMode = true;
    this.activeDrawerTab = 'layers';
    this.selectedSpecForDrawer = undefined;
    this.isEditingBgText = false;
    this.isEditingCentralElement = false;
  }

  // REORDENAÇÃO DE CAMADAS DE APONTADORES NA ÁRVORE (DRAG AND DROP)
  onSpecLayerDragStart(event: DragEvent, index: number): void {
    if (!this.isEditMode) return;
    this.draggedSpecIndex = index;
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/plain', index.toString());
    }
  }

  onSpecLayerDragOver(event: DragEvent, index: number): void {
    if (!this.isEditMode || this.draggedSpecIndex === null) return;
    event.preventDefault();
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'move';
    }
    this.dragOverSpecIndex = index;
  }

  onSpecLayerDrop(event: DragEvent, dropIndex: number): void {
    if (!this.isEditMode || this.draggedSpecIndex === null || !this.activeSlide) return;
    event.preventDefault();

    const fromIndex = this.draggedSpecIndex;
    if (fromIndex !== dropIndex) {
      const movedSpec = this.activeSlide.especificacoes.splice(fromIndex, 1)[0];
      this.activeSlide.especificacoes.splice(dropIndex, 0, movedSpec);

      this.saveChanges();
      this.showToast(`↔️ Camada "${movedSpec.titulo}" reordenada!`);
    }

    this.onSpecLayerDragEnd();
  }

  onSpecLayerDragEnd(): void {
    this.draggedSpecIndex = null;
    this.dragOverSpecIndex = null;
  }

  moveSpecUp(index: number, event: Event): void {
    event.stopPropagation();
    if (!this.activeSlide || index <= 0) return;
    const specs = this.activeSlide.especificacoes;
    [specs[index - 1], specs[index]] = [specs[index], specs[index - 1]];
    this.saveChanges();
    this.showToast('▲ Camada movida para cima.');
  }

  moveSpecDown(index: number, event: Event): void {
    event.stopPropagation();
    if (!this.activeSlide || index >= this.activeSlide.especificacoes.length - 1) return;
    const specs = this.activeSlide.especificacoes;
    [specs[index], specs[index + 1]] = [specs[index + 1], specs[index]];
    this.saveChanges();
    this.showToast('▼ Camada movida para baixo.');
  }

  // SELECT COMPONENT LAYER FROM TREE
  selectCentralElementFromTree(): void {
    if (!this.activeSlide) return;
    this.isEditMode = true;
    this.activeDrawerTab = 'properties';
    this.selectedSpecForDrawer = undefined;
    this.isEditingBgText = false;
    this.isEditingCentralElement = true;
    this.openBgTextDrawer();
  }

  selectBgTextFromTree(): void {
    if (!this.activeSlide) return;
    this.isEditMode = true;
    this.activeDrawerTab = 'properties';
    this.selectedSpecForDrawer = undefined;
    this.isEditingCentralElement = false;
    this.isEditingBgText = true;
    this.openBgTextDrawer();
  }

  selectSpecFromTree(spec: EspecificacaoAnimada): void {
    this.isEditMode = true;
    this.activeDrawerTab = 'properties';
    this.isEditingBgText = false;
    this.isEditingCentralElement = false;
    this.selectedSpecForDrawer = spec;
  }

  isCustomImage(imagemCutout?: string): boolean {
    if (!imagemCutout) return false;
    return (
      imagemCutout.startsWith('data:image/') ||
      imagemCutout.startsWith('http://') ||
      imagemCutout.startsWith('https://') ||
      imagemCutout.startsWith('assets/') ||
      imagemCutout.trim().startsWith('<svg') ||
      imagemCutout.includes('.')
    );
  }

  getDisplayImageSrc(imagemCutout?: string): string {
    if (!imagemCutout) return '';
    const trimmed = imagemCutout.trim();
    if (trimmed.startsWith('<svg')) {
      return 'data:image/svg+xml;utf8,' + encodeURIComponent(trimmed);
    }
    return imagemCutout;
  }

  // --- MODO TELA CHEIA (FULLSCREEN) ---
  toggleFullscreen(): void {
    this.isFullscreenMode = !this.isFullscreenMode;

    if (this.isFullscreenMode) {
      this.isEditMode = false;
      this.closeSideDrawer();
      document.body.classList.add('fullscreen-mode-active');
      this.injectFullscreenShadowDomCursor();

      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().catch(err => {
          console.warn('Fullscreen não suportado ou negado:', err);
        });
      }
    } else {
      document.body.classList.remove('fullscreen-mode-active');
      this.injectFullscreenShadowDomCursor();

      if (document.fullscreenElement && document.exitFullscreen) {
        document.exitFullscreen().catch(err => {
          console.warn('Erro ao sair do fullscreen:', err);
        });
      }
    }
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

  injectFullscreenShadowDomCursor(): void {
    if (!this.modelViewerRef?.nativeElement) return;
    const viewer = this.modelViewerRef.nativeElement;

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
          shadowStyle.textContent = `
            *, canvas, .slot.canvas, [class*="canvas"] {
              cursor: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="rgba(255,255,255,0.15)" stroke="rgba(0,242,254,0.3)" stroke-width="1.5" d="M3 3l7 18 3-7 7-3L3 3z"/></svg>') 0 0, auto !important;
            }
          `;
        } else {
          shadowStyle.textContent = '';
        }
      }
    } catch (e) {
      console.warn('ShadowRoot cursor injection skipped:', e);
    }
  }

  // --- OCULTAR BALÕES AO MOVER (APENAS FORA DO MODO EDIÇÃO) ---
  on3DWheel(event: WheelEvent): void {
    event.stopPropagation();
  }

  on3DCameraUserInteractionStart(): void {
    if (this.isEditMode) return;

    this.isCalloutsVisible = false;

    if (this.idleCameraResetTimeout) {
      clearTimeout(this.idleCameraResetTimeout);
      this.idleCameraResetTimeout = undefined;
    }
  }

  on3DCameraUserInteractionEnd(): void {
    if (this.isEditMode) return;

    if (this.idleCameraResetTimeout) {
      clearTimeout(this.idleCameraResetTimeout);
    }

    this.idleCameraResetTimeout = setTimeout(() => {
      this.restoreSaved3DCameraPosition();
    }, 2500);
  }

  restoreSaved3DCameraPosition(): void {
    if (this.isEditMode || !this.activeSlide || !this.modelViewerRef?.nativeElement) return;
    const viewer = this.modelViewerRef.nativeElement;

    if (this.activeSlide.cameraOrbit) {
      viewer.cameraOrbit = this.activeSlide.cameraOrbit;
    }
    if (this.activeSlide.cameraTarget) {
      viewer.cameraTarget = this.activeSlide.cameraTarget;
    }
    if (this.activeSlide.fieldOfView) {
      viewer.fieldOfView = this.activeSlide.fieldOfView;
    }

    setTimeout(() => {
      this.isCalloutsVisible = true;
    }, 300);

    this.showToast('↩️ Posição 3D e apontadores restaurados!');
  }

  // --- REORDENAÇÃO DE SLIDES POR DRAG AND DROP / SETAS NA BARRA INFERIOR ---
  onTabDragStart(event: DragEvent, index: number): void {
    if (!this.isEditMode) return;
    this.draggedSlideIndex = index;
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/plain', index.toString());
    }
  }

  onTabDragOver(event: DragEvent, index: number): void {
    if (!this.isEditMode || this.draggedSlideIndex === null) return;
    event.preventDefault();
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'move';
    }
    this.dragOverSlideIndex = index;
  }

  onTabDrop(event: DragEvent, dropIndex: number): void {
    if (!this.isEditMode || this.draggedSlideIndex === null || !this.smartphone) return;
    event.preventDefault();

    const fromIndex = this.draggedSlideIndex;
    if (fromIndex !== dropIndex) {
      const movedSlide = this.smartphone.slides.splice(fromIndex, 1)[0];
      this.smartphone.slides.splice(dropIndex, 0, movedSlide);

      if (this.activeSlideIndex === fromIndex) {
        this.activeSlideIndex = dropIndex;
      } else if (this.activeSlideIndex > fromIndex && this.activeSlideIndex <= dropIndex) {
        this.activeSlideIndex--;
      } else if (this.activeSlideIndex < fromIndex && this.activeSlideIndex >= dropIndex) {
        this.activeSlideIndex++;
      }

      this.saveChanges();
      this.showToast(`↔️ Ordem dos slides alterada! ("${movedSlide.tituloSlide.split(' ')[0]}" movido)`);
    }

    this.onTabDragEnd();
  }

  onTabDragEnd(): void {
    this.draggedSlideIndex = null;
    this.dragOverSlideIndex = null;
  }

  moveSlideLeft(index: number, event: Event): void {
    event.stopPropagation();
    if (!this.smartphone || index <= 0) return;
    const slides = this.smartphone.slides;
    [slides[index - 1], slides[index]] = [slides[index], slides[index - 1]];
    if (this.activeSlideIndex === index) {
      this.activeSlideIndex = index - 1;
    } else if (this.activeSlideIndex === index - 1) {
      this.activeSlideIndex = index;
    }
    this.saveChanges();
    this.showToast('⬅️ Slide movido para a esquerda.');
  }

  moveSlideRight(index: number, event: Event): void {
    event.stopPropagation();
    if (!this.smartphone || index >= this.smartphone.slides.length - 1) return;
    const slides = this.smartphone.slides;
    [slides[index], slides[index + 1]] = [slides[index + 1], slides[index]];
    if (this.activeSlideIndex === index) {
      this.activeSlideIndex = index + 1;
    } else if (this.activeSlideIndex === index + 1) {
      this.activeSlideIndex = index;
    }
    this.saveChanges();
    this.showToast('➡️ Slide movido para a direita.');
  }

  deleteSlide(index: number, event: Event): void {
    event.stopPropagation();
    if (!this.smartphone || this.smartphone.slides.length <= 1) {
      this.showToast('⚠️ A apresentação precisa de pelo menos 1 slide.');
      return;
    }
    const removed = this.smartphone.slides.splice(index, 1)[0];
    if (this.activeSlideIndex >= this.smartphone.slides.length) {
      this.activeSlideIndex = this.smartphone.slides.length - 1;
    }
    this.saveChanges();
    this.showToast(`🗑️ Slide "${removed.tituloSlide.split(' ')[0]}" excluído.`);
  }

  // --- TRANSIÇÕES DE SLIDE ---
  selectSlide(index: number): void {
    if (this.activeSlideIndex === index) return;

    if (this.idleCameraResetTimeout) {
      clearTimeout(this.idleCameraResetTimeout);
      this.idleCameraResetTimeout = undefined;
    }

    const currentSlide = this.activeSlide;
    const nextSlide = this.smartphone?.slides[index];

    // Oculta balões no início da troca de slide para não embolar durante o movimento
    this.isCalloutsVisible = false;
    this.closeSideDrawer();

    const isBoth3DGlb = (currentSlide?.fotoModoFrame === 'modelo-3d-glb' || currentSlide?.modelo3DGlb) &&
                        (nextSlide?.fotoModoFrame === 'modelo-3d-glb' || nextSlide?.modelo3DGlb);

    if (isBoth3DGlb) {
      this.activeSlideIndex = index;
      setTimeout(() => {
        this.isCalloutsVisible = true; // Fade-in suave dos balões após ajustar a câmera 3D
        if (this.activeSlide?.glbCustomMaterialEnabled) {
          this.applyGlbMaterialCustomization();
        }
      }, 350);
      return;
    }

    if (this.phoneStage?.nativeElement) {
      gsap.to(this.phoneStage.nativeElement, {
        scale: 0.92,
        rotationY: 15,
        opacity: 0,
        duration: 0.22,
        ease: 'power2.in',
        onComplete: () => {
          this.activeSlideIndex = index;

          requestAnimationFrame(() => {
            setTimeout(() => {
              this.triggerSlideTransition();
            }, 30);
          });
        }
      });
    } else {
      this.activeSlideIndex = index;
      this.triggerSlideTransition();
    }
  }

  private triggerSlideTransition(): void {
    if (this.phoneStage?.nativeElement) {
      const slide3D = this.activeSlide?.posicaoCamera3D || { rotX: 0, rotY: 0, scale: 1 };
      
      gsap.set(this.phoneStage.nativeElement, { scale: 0.9, opacity: 0, rotationY: -15 });

      gsap.to(this.phoneStage.nativeElement, {
        scale: slide3D.scale || 1,
        opacity: 1,
        rotationY: 0,
        duration: 0.45,
        ease: 'power3.out',
        onComplete: () => {
          this.isCalloutsVisible = true; // Exibe o fade-in suave dos balões APÓS o slide 3D terminar de entrar!
          if (this.activeSlide?.glbCustomMaterialEnabled) {
            this.applyGlbMaterialCustomization();
          }
        }
      });
    } else {
      this.isCalloutsVisible = true;
    }
  }

  // --- CONTROLE DE MATERIAIS, ILUMINAÇÃO E REFLEXO GLB ---
  onToggleGlbCustomMaterial(): void {
    if (!this.activeSlide) return;
    this.saveChanges();
    if (this.activeSlide.glbCustomMaterialEnabled) {
      this.applyGlbMaterialCustomization();
      this.showToast('🎨 Personalização de materiais ATIVADA.');
    } else {
      this.resetGlbMaterialsToDefault();
      this.showToast('✨ Padrão original de cores mantido.');
    }
  }

  applyGlbMaterialCustomization(): void {
    if (!this.modelViewerRef?.nativeElement || !this.activeSlide) return;
    const viewer = this.modelViewerRef.nativeElement;

    if (!this.activeSlide.glbCustomMaterialEnabled) {
      return;
    }

    if (viewer.model && viewer.model.materials) {
      const roughness = this.activeSlide.glbRoughnessFactor !== undefined ? this.activeSlide.glbRoughnessFactor : 0.4;
      const metallic = this.activeSlide.glbMetallicFactor !== undefined ? this.activeSlide.glbMetallicFactor : 0.8;

      viewer.model.materials.forEach((mat: any) => {
        if (mat.pbrMetallicRoughness) {
          if (typeof mat.pbrMetallicRoughness.setRoughnessFactor === 'function') {
            mat.pbrMetallicRoughness.setRoughnessFactor(roughness);
          }
          if (typeof mat.pbrMetallicRoughness.setMetallicFactor === 'function') {
            mat.pbrMetallicRoughness.setMetallicFactor(metallic);
          }
        }
      });
    }

    this.saveChanges();
  }

  resetGlbMaterialsToDefault(): void {
    if (!this.activeSlide) return;

    this.activeSlide.glbCustomMaterialEnabled = false;
    this.activeSlide.glbExposure = 1.0;
    this.activeSlide.glbShadowIntensity = 1.0;
    this.activeSlide.glbShadowSoftness = 0.8;
    this.activeSlide.glbRoughnessFactor = undefined;
    this.activeSlide.glbMetallicFactor = undefined;

    if (this.modelViewerRef?.nativeElement) {
      const viewer = this.modelViewerRef.nativeElement;
      if (viewer.model && viewer.model.materials) {
        viewer.model.materials.forEach((mat: any) => {
          if (mat.pbrMetallicRoughness) {
            if (typeof mat.pbrMetallicRoughness.setRoughnessFactor === 'function') {
              mat.pbrMetallicRoughness.setRoughnessFactor(0.5);
            }
            if (typeof mat.pbrMetallicRoughness.setMetallicFactor === 'function') {
              mat.pbrMetallicRoughness.setMetallicFactor(0.8);
            }
          }
        });
      }
    }

    this.saveChanges();
  }

  onGlbModelLoaded(): void {
    setTimeout(() => {
      this.injectFullscreenShadowDomCursor();
      if (this.activeSlide?.glbCustomMaterialEnabled) {
        this.applyGlbMaterialCustomization();
      }
    }, 200);
  }

  // --- SKETCHFAB / IFRAME 3D EMBED HELPERS ---
  getSafeIframeUrl(url?: string): SafeResourceUrl {
    const targetUrl = url || this.activeSlide?.iframeEmbed3D || 'https://sketchfab.com/models/9fe8c0cbf5e54b598a76440ee90d0f80/embed';
    return this.sanitizer.bypassSecurityTrustResourceUrl(targetUrl);
  }

  applyIframeEmbedCode(): void {
    if (!this.activeSlide || !this.rawIframeEmbedInput.trim()) return;

    let input = this.rawIframeEmbedInput.trim();
    let extractedUrl = input;

    const match = input.match(/src=["']([^"']+)["']/i);
    if (match && match[1]) {
      extractedUrl = match[1];
    }

    this.activeSlide.iframeEmbed3D = extractedUrl;
    this.activeSlide.fotoModoFrame = 'iframe-embed-3d';
    this.saveChanges();
    this.showToast('Modelo 3D Sketchfab Embed aplicado com sucesso!');
  }

  // --- CRIAR NOVO SLIDE USANDO O MESMO MODELO 3D ---
  addNextSlideWithSameModel(): void {
    if (!this.smartphone || !this.activeSlide) return;

    const slideCount = this.smartphone.slides.length + 1;
    const isSketchfab = this.activeSlide.fotoModoFrame === 'iframe-embed-3d' || !!this.activeSlide.iframeEmbed3D;
    const currentGlb = this.activeSlide.modelo3DGlb || 'assets/models/z-fold8.glb';
    const currentEmbed = this.activeSlide.iframeEmbed3D || 'https://sketchfab.com/models/9fe8c0cbf5e54b598a76440ee90d0f80/embed';

    const newSlide: SlideAparelho = {
      id: 'slide-3d-' + Date.now(),
      tipo: (slideCount % 2 === 0 ? 'processador' : 'camera') as any,
      tituloSlide: `Slide 3D #${slideCount}`,
      subtituloSlide: isSketchfab ? 'MODELO SKETCHFAB EMBED' : 'NOVO ÂNGULO E CORES FIXADAS',
      descricaoSlide: 'Ajuste a rotação, o brilho e os reflexos deste slide na barra lateral.',
      imagemCutout: this.activeSlide.imagemCutout,
      modelo3DGlb: isSketchfab ? undefined : currentGlb,
      iframeEmbed3D: isSketchfab ? currentEmbed : undefined,
      fotoModoFrame: isSketchfab ? 'iframe-embed-3d' : 'modelo-3d-glb',
      fotoFit: 'contain',
      fotoScale: this.activeSlide.fotoScale || 1.0,
      glbCustomMaterialEnabled: this.activeSlide.glbCustomMaterialEnabled || false,
      glbExposure: this.activeSlide.glbExposure || 1.0,
      glbShadowIntensity: this.activeSlide.glbShadowIntensity || 1.0,
      glbShadowSoftness: this.activeSlide.glbShadowSoftness || 0.8,
      glbEnvironmentImage: this.activeSlide.glbEnvironmentImage || 'neutral',
      glbRoughnessFactor: this.activeSlide.glbRoughnessFactor,
      glbMetallicFactor: this.activeSlide.glbMetallicFactor,
      cameraOrbit: '45deg 75deg auto',
      cameraTarget: '0m 0m 0m',
      fieldOfView: 'auto',
      autoRotate3D: false,
      textoFundo: {
        textoOuNumero: `0${slideCount}`,
        subrotulo: isSketchfab ? 'SKETCHFAB 3D EMBED' : 'ÂNGULO PERSONALIZADO 3D',
        posicao: 'tras-direita',
        gradiente: 'linear-gradient(135deg, #00f2fe 0%, #7928ca 100%)',
        silhueta: 'camera',
        silhuetaScale: 1.8,
        silhuetaOpacity: 0.25,
        posX: 50,
        posY: 20,
        scale: 1.0
      },
      especificacoes: [
        {
          id: 'spec-new-3d-' + Date.now(),
          titulo: 'Destaque de Ângulo 3D',
          valor: 'Visão Detalhada',
          detalhe: 'Clique em "Modo Edição" para ajustar este apontador.',
          posicaoX: 40,
          posicaoY: 45,
          direcaoSeta: 'top-right',
          icone: 'zoom-in'
        }
      ]
    };

    this.smartphone.slides.push(newSlide);
    this.saveChanges();

    const newIndex = this.smartphone.slides.length - 1;
    this.selectSlide(newIndex);
    this.showToast(`✨ Slide 3D #${slideCount} criado!`);
  }

  // --- FIXAR & TRAVAR ÂNGULO, ZOOM E POSIÇÃO 3D ---
  captureAndSave3DPosition(): void {
    if (!this.activeSlide) return;

    this.activeSlide.autoRotate3D = false;

    if (this.modelViewerRef?.nativeElement) {
      const viewer = this.modelViewerRef.nativeElement;
      
      if (typeof viewer.getCameraOrbit === 'function') {
        const orbit = viewer.getCameraOrbit();
        if (orbit) {
          const thetaDeg = Math.round((orbit.theta * 180) / Math.PI);
          const phiDeg = Math.round((orbit.phi * 180) / Math.PI);
          const radius = orbit.radius ? `${orbit.radius.toFixed(2)}m` : 'auto';
          this.activeSlide.cameraOrbit = `${thetaDeg}deg ${phiDeg}deg ${radius}`;
        }
      }

      if (typeof viewer.getFieldOfView === 'function') {
        const fov = viewer.getFieldOfView();
        if (fov) {
          this.activeSlide.fieldOfView = `${fov.toFixed(1)}deg`;
        }
      }

      if (typeof viewer.getCameraTarget === 'function') {
        const target = viewer.getCameraTarget();
        if (target) {
          this.activeSlide.cameraTarget = `${target.x.toFixed(2)}m ${target.y.toFixed(2)}m ${target.z.toFixed(2)}m`;
        }
      }

      this.saveChanges();
      this.showToast('📌 Ângulo, Zoom e Posição 3D FIXADOS com sucesso!');
      return;
    }

    this.saveChanges();
  }

  toggleAutoRotate3D(): void {
    if (!this.activeSlide) return;
    this.activeSlide.autoRotate3D = !this.activeSlide.autoRotate3D;
    if (this.activeSlide.autoRotateSpeed === undefined) {
      this.activeSlide.autoRotateSpeed = 12;
    }
    this.saveChanges();
    this.showToast(this.activeSlide.autoRotate3D ? '🔄 Rotação suave no próprio eixo ATIVADA' : '🛑 Rotação no próprio eixo DESATIVADA (Fixo)');
  }

  reset3DPosition(): void {
    if (!this.activeSlide) return;
    this.activeSlide.cameraOrbit = '0deg 75deg auto';
    this.activeSlide.cameraTarget = '0m 0m 0m';
    this.activeSlide.fieldOfView = 'auto';
    this.activeSlide.autoRotate3D = false;
    this.resetGlbMaterialsToDefault();
    this.saveChanges();
    this.showToast('Posição 3D e Cores Padrão resetadas.');
  }

  applyRawSvgCode(): void {
    if (!this.activeSlide || !this.rawSvgInput.trim()) return;

    let svgStr = this.rawSvgInput.trim();
    if (!svgStr.startsWith('data:image/') && svgStr.startsWith('<svg')) {
      svgStr = 'data:image/svg+xml;utf8,' + encodeURIComponent(svgStr);
    }

    this.activeSlide.imagemCutout = svgStr;
    this.activeSlide.fotoModoFrame = 'sem-moldura';
    this.saveChanges();
    this.showToast('Vetor SVG aplicado com sucesso no slide!');
  }

  onSlideImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0] && this.activeSlide) {
      const file = input.files[0];
      const fileName = file.name.toLowerCase();

      if (fileName.endsWith('.glb') || fileName.endsWith('.gltf')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const glbDataUrl = e.target?.result as string;
          if (this.activeSlide) {
            this.activeSlide.modelo3DGlb = glbDataUrl;
            this.activeSlide.fotoModoFrame = 'modelo-3d-glb';
            this.activeSlide.autoRotate3D = false;
            this.saveChanges();
            this.showToast('Modelo 3D GLB Real carregado com sucesso!');
          }
        };
        reader.readAsDataURL(file);
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const base64Image = e.target?.result as string;
        if (this.activeSlide) {
          this.activeSlide.imagemCutout = base64Image;
          this.activeSlide.fotoModoFrame = 'sem-moldura';
          if (this.activeSlide.fotoDepth3D === undefined) {
            this.activeSlide.fotoDepth3D = 45;
          }
          if (this.activeSlide.fotoScale === undefined) {
            this.activeSlide.fotoScale = 1.0;
          }
          this.saveChanges();
          this.showToast('Foto do Smartphone carregada sem cortes!');
        }
      };
      reader.readAsDataURL(file);
    }
  }

  removeCustomSlideImage(): void {
    if (!this.activeSlide) return;
    this.activeSlide.imagemCutout = this.activeSlide.tipo;
    this.activeSlide.modelo3DGlb = undefined;
    this.activeSlide.iframeEmbed3D = undefined;
    this.activeSlide.fotoModoFrame = 'sem-moldura';
    this.rawSvgInput = '';
    this.rawIframeEmbedInput = '';
    this.saveChanges();
    this.showToast('Imagem do elemento central restaurada.');
  }

  nextSlide(): void {
    if (!this.smartphone) return;
    const nextIdx = (this.activeSlideIndex + 1) % this.smartphone.slides.length;
    this.selectSlide(nextIdx);
  }

  prevSlide(): void {
    if (!this.smartphone) return;
    const prevIdx = (this.activeSlideIndex - 1 + this.smartphone.slides.length) % this.smartphone.slides.length;
    this.selectSlide(prevIdx);
  }

  toggleAutoplay(): void {
    this.isAutoplay = !this.isAutoplay;
    if (this.isAutoplay) {
      this.autoplayInterval = setInterval(() => this.nextSlide(), 5000);
      this.showToast('▶️ Autoplay Automático (5s) ATIVADO');
    } else if (this.autoplayInterval) {
      clearInterval(this.autoplayInterval);
      this.showToast('⏸️ Autoplay Pausado (Use a tecla ESPAÇO ou Setas)');
    }
  }

  @HostListener('window:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    const targetTag = (event.target as HTMLElement)?.tagName?.toLowerCase();
    if (targetTag === 'input' || targetTag === 'textarea' || targetTag === 'select') {
      return; // Ignora se o usuário estiver digitando nos campos de edição
    }

    if (event.code === 'Space' || event.key === ' ') {
      event.preventDefault();
      this.nextSlide();
      this.showToast('⌨️ [ESPAÇO] Próximo Slide');
    } else if (event.key === 'ArrowRight' || event.key === 'ArrowDown' || event.key === 'PageDown') {
      event.preventDefault();
      this.nextSlide();
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp' || event.key === 'PageUp') {
      event.preventDefault();
      this.prevSlide();
    }
  }

  // --- DRAG & CORNER RESIZE FOR GIANT BACKGROUND TEXT ---
  startBgTextDrag(event: MouseEvent): void {
    if (!this.isEditMode || !this.activeSlide?.textoFundo) return;
    event.stopPropagation();

    this.isDraggingBgText = true;
    this.isResizingBgText = false;
    this.dragStartX = event.clientX;
    this.dragStartY = event.clientY;

    if (this.activeSlide.textoFundo.posX === undefined) {
      this.activeSlide.textoFundo.posX = 50;
    }
    if (this.activeSlide.textoFundo.posY === undefined) {
      this.activeSlide.textoFundo.posY = 20;
    }

    this.initialPosX = this.activeSlide.textoFundo.posX;
    this.initialPosY = this.activeSlide.textoFundo.posY;

    this.openBgTextDrawer();
  }

  startBgTextResize(event: MouseEvent): void {
    if (!this.isEditMode || !this.activeSlide?.textoFundo) return;
    event.stopPropagation();

    this.isResizingBgText = true;
    this.isDraggingBgText = false;
    this.dragStartX = event.clientX;

    if (!this.activeSlide.textoFundo.scale) {
      this.activeSlide.textoFundo.scale = 1.0;
    }
    this.initialScale = this.activeSlide.textoFundo.scale;

    this.openBgTextDrawer();
  }

  @HostListener('document:mousemove', ['$event'])
  onDocumentMouseMove(event: MouseEvent): void {
    if (this.isDraggingBgText && this.activeSlide?.textoFundo && this.stageContainer) {
      const rect = this.stageContainer.nativeElement.getBoundingClientRect();
      const deltaX = event.clientX - this.dragStartX;
      const deltaY = event.clientY - this.dragStartY;

      const deltaPercentX = (deltaX / rect.width) * 100;
      const deltaPercentY = (deltaY / rect.height) * 100;

      this.activeSlide.textoFundo.posX = Math.min(Math.max(Math.round(this.initialPosX + deltaPercentX), 5), 95);
      this.activeSlide.textoFundo.posY = Math.min(Math.max(Math.round(this.initialPosY + deltaPercentY), 5), 95);
    } else if (this.isResizingBgText && this.activeSlide?.textoFundo) {
      const deltaX = event.clientX - this.dragStartX;
      const scaleDelta = deltaX * 0.005;
      const newScale = Math.min(Math.max(Number((this.initialScale + scaleDelta).toFixed(2)), 0.3), 3.0);
      this.activeSlide.textoFundo.scale = newScale;
    }
  }

  @HostListener('document:mouseup')
  onDocumentMouseUp(): void {
    if (this.isDraggingBgText || this.isResizingBgText) {
      this.isDraggingBgText = false;
      this.isResizingBgText = false;
      this.saveChanges();
    }
  }

  // --- SIDE DRAWER SELECTION & EDITING ---
  openSpecDrawer(spec: EspecificacaoAnimada, event: Event): void {
    if (this.isFullscreenMode) return;
    event.stopPropagation();
    this.isEditMode = true;
    this.activeDrawerTab = 'properties';
    this.isEditingBgText = false;
    this.isEditingCentralElement = false;
    this.selectedSpecForDrawer = spec;
  }

  openBgTextDrawer(): void {
    if (this.isFullscreenMode || !this.activeSlide) return;
    this.isEditMode = true;
    this.activeDrawerTab = 'properties';
    this.selectedSpecForDrawer = undefined;
    this.isEditingBgText = true;

    if (this.activeSlide.imagemCutout?.startsWith('<svg') || this.activeSlide.imagemCutout?.startsWith('data:image/svg+xml')) {
      if (this.activeSlide.imagemCutout.startsWith('data:image/svg+xml;utf8,')) {
        this.rawSvgInput = decodeURIComponent(this.activeSlide.imagemCutout.replace('data:image/svg+xml;utf8,', ''));
      } else {
        this.rawSvgInput = this.activeSlide.imagemCutout;
      }
    } else {
      this.rawSvgInput = '';
    }

    if (this.activeSlide.iframeEmbed3D) {
      this.rawIframeEmbedInput = this.activeSlide.iframeEmbed3D;
    } else {
      this.rawIframeEmbedInput = '';
    }

    if (this.activeSlide.fotoDepth3D === undefined) {
      this.activeSlide.fotoDepth3D = 45;
    }

    if (!this.activeSlide.fotoModoFrame) {
      this.activeSlide.fotoModoFrame = 'sem-moldura';
    }

    if (!this.activeSlide.textoFundo) {
      this.activeSlide.textoFundo = {
        textoOuNumero: '50 MP',
        subrotulo: 'SISTEMA TRIPLE PRO OPTICS',
        posicao: 'tras-direita',
        gradiente: 'linear-gradient(135deg, #00f2fe 0%, #4facfe 100%)',
        silhueta: 'camera',
        silhuetaScale: 1.8,
        silhuetaOpacity: 0.25,
        posX: 50,
        posY: 20,
        scale: 1.0
      };
    } else {
      if (!this.activeSlide.textoFundo.silhueta) {
        this.activeSlide.textoFundo.silhueta = this.activeSlide.tipo as any || 'camera';
      }
      if (this.activeSlide.textoFundo.silhuetaScale === undefined) {
        this.activeSlide.textoFundo.silhuetaScale = 1.8;
      }
      if (this.activeSlide.textoFundo.silhuetaOpacity === undefined) {
        this.activeSlide.textoFundo.silhuetaOpacity = 0.25;
      }
    }
  }

  closeSideDrawer(): void {
    this.selectedSpecForDrawer = undefined;
    this.isEditingBgText = false;
    this.isEditingCentralElement = false;
  }

  addNewSpecInDrawer(): void {
    if (this.isFullscreenMode || !this.activeSlide) return;

    const newSpec: EspecificacaoAnimada = {
      id: 'spec-' + Date.now(),
      titulo: 'Novo Apontador',
      valor: '50 MP • f/1.8',
      detalhe: 'Descrição detalhada.',
      posicaoX: 50,
      posicaoY: 50,
      direcaoSeta: 'top-left',
      icone: 'camera'
    };

    this.activeSlide.especificacoes.push(newSpec);
    this.openSpecDrawer(newSpec, new MouseEvent('click'));
    this.saveChanges();
  }

  deleteSpecFromDrawer(specId: string): void {
    if (!this.activeSlide) return;
    this.activeSlide.especificacoes = this.activeSlide.especificacoes.filter(s => s.id !== specId);
    if (this.selectedSpecForDrawer?.id === specId) {
      this.activeDrawerTab = 'layers';
      this.closeSideDrawer();
    }
    this.saveChanges();
  }

  getElementNeonFilter(): string {
    if (!this.activeSlide) return 'drop-shadow(0 35px 70px rgba(0, 0, 0, 0.95))';
    
    if (this.activeSlide.elementNeonEnabled === false || (this.activeSlide.elementNeonIntensity || 0) === 0) {
      return 'drop-shadow(0 35px 70px rgba(0, 0, 0, 0.95))';
    }

    const color = this.activeSlide.elementNeonColor || '#00f2fe';
    const intensity = this.activeSlide.elementNeonIntensity !== undefined ? this.activeSlide.elementNeonIntensity : 0.5;
    const radius = this.activeSlide.elementNeonRadius !== undefined ? this.activeSlide.elementNeonRadius : 45;
    const rgba = this.hexToRgba(color, intensity);

    return `drop-shadow(0 35px 70px rgba(0, 0, 0, 0.95)) drop-shadow(0 0 ${radius}px ${rgba})`;
  }

  getElementNeonBoxShadow(): string {
    if (!this.activeSlide) return '0 35px 70px rgba(0, 0, 0, 0.95)';
    
    if (this.activeSlide.elementNeonEnabled === false || (this.activeSlide.elementNeonIntensity || 0) === 0) {
      return '0 35px 70px rgba(0, 0, 0, 0.95)';
    }

    const color = this.activeSlide.elementNeonColor || '#00f2fe';
    const intensity = this.activeSlide.elementNeonIntensity !== undefined ? this.activeSlide.elementNeonIntensity : 0.5;
    const radius = this.activeSlide.elementNeonRadius !== undefined ? this.activeSlide.elementNeonRadius : 45;
    const rgba = this.hexToRgba(color, intensity);

    return `0 35px 70px rgba(0, 0, 0, 0.95), 0 0 ${radius}px ${rgba}`;
  }

  hexToRgba(hex: string, alpha: number): string {
    let c: any;
    if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
      c = hex.substring(1).split('');
      if (c.length === 3) {
        c = [c[0], c[0], c[1], c[1], c[2], c[2]];
      }
      c = '0x' + c.join('');
      return `rgba(${[(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',')},${alpha})`;
    }
    return `rgba(0, 242, 254, ${alpha})`;
  }

  saveChanges(): void {
    if (this.smartphone && this.smartphonesList.length > 0) {
      let idx = this.smartphonesList.findIndex(p => p.id === this.smartphone?.id);
      if (idx === -1) {
        idx = this.smartphonesList.indexOf(this.smartphone);
      }
      if (idx !== -1) {
        this.smartphonesList[idx] = this.smartphone;
      } else {
        this.smartphonesList.push(this.smartphone);
      }
      this.smartphoneService.saveSmartphonesToStorage(this.smartphonesList);
    }
  }

  private showToast(msg: string): void {
    if (this.isFullscreenMode) return; // NUNCA exibe alertas/toasts em Modo Tela Cheia
    this.notificationMsg = msg;
    setTimeout(() => {
      this.notificationMsg = '';
    }, 2500);
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    if (this.isEditMode || this.activeSlide?.fotoModoFrame === 'modelo-3d-glb' || this.activeSlide?.fotoModoFrame === 'iframe-embed-3d') return;

    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    
    this.mouseX = (event.clientX / windowWidth) * 2 - 1;
    this.mouseY = (event.clientY / windowHeight) * 2 - 1;

    this.tiltX = this.mouseY * -16;
    this.tiltY = this.mouseX * 16;
  }
}
