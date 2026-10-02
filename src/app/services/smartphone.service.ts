import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Smartphone } from '../models/smartphone.model';

@Injectable({
  providedIn: 'root'
})
export class SmartphoneService {
  private readonly STORAGE_KEY = 'antigravity_smartphone_catalog_v2';

  // SVG completo do Smartphone Lavanda Vidro 3D
  public readonly LAVANDA_GLASS_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 800" shape-rendering="geometricPrecision" text-rendering="geometricPrecision"><defs><linearGradient id="corpo_grad_lavanda" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:%23E3D6F5;stop-opacity:1"/><stop offset="50%" style="stop-color:%23C7B5E2;stop-opacity:1"/><stop offset="100%" style="stop-color:%239E8CBF;stop-opacity:1"/></linearGradient><linearGradient id="vidro_reflexo_diagonal" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:rgba(255,255,255,0.45);stop-opacity:1"/><stop offset="25%" style="stop-color:rgba(255,255,255,0.18);stop-opacity:1"/><stop offset="50%" style="stop-color:rgba(255,255,255,0.02);stop-opacity:1"/><stop offset="100%" style="stop-color:rgba(255,255,255,0.0);stop-opacity:1"/></linearGradient><linearGradient id="painel_escuro_grad" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" style="stop-color:%232a2a2a;stop-opacity:1"/><stop offset="50%" style="stop-color:%23171717;stop-opacity:1"/><stop offset="100%" style="stop-color:%23090909;stop-opacity:1"/></linearGradient><linearGradient id="borda_metal_grad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:%23FFFFFF;stop-opacity:1"/><stop offset="20%" style="stop-color:%23E0E0E0;stop-opacity:1"/><stop offset="50%" style="stop-color:%23B8B8B8;stop-opacity:1"/><stop offset="80%" style="stop-color:%23D8D8D8;stop-opacity:1"/><stop offset="100%" style="stop-color:%23757575;stop-opacity:1"/></linearGradient><linearGradient id="modulo_fundo_grad" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" style="stop-color:%23F0E7FA;stop-opacity:1"/><stop offset="50%" style="stop-color:%23D6C7EC;stop-opacity:1"/><stop offset="100%" style="stop-color:%23B3A2CF;stop-opacity:1"/></linearGradient><radialGradient id="vidro_safira_coating" cx="35%" cy="35%" r="65%"><stop offset="0%" style="stop-color:rgba(0,242,254,0.6);stop-opacity:1"/><stop offset="40%" style="stop-color:rgba(121,40,202,0.35);stop-opacity:1"/><stop offset="80%" style="stop-color:rgba(15,15,25,0.95);stop-opacity:1"/><stop offset="100%" style="stop-color:%2305050a;stop-opacity:1"/></radialGradient><radialGradient id="flash_vidro_grad" cx="40%" cy="40%" r="60%"><stop offset="0%" style="stop-color:%23FFFFFF;stop-opacity:1"/><stop offset="50%" style="stop-color:%23FFF9C4;stop-opacity:1"/><stop offset="100%" style="stop-color:%23FBC02D;stop-opacity:1"/></radialGradient><filter id="sombra_3d_aparelho" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="15" dy="25" stdDeviation="20" flood-color="rgba(0,0,0,0.55)"/><feDropShadow dx="-5" dy="10" stdDeviation="10" flood-color="rgba(0,242,254,0.15)"/></filter><filter id="modulo_sombra_pro" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="5" dy="12" stdDeviation="10" flood-color="rgba(0,0,0,0.45)"/><feDropShadow dx="-2" dy="-2" stdDeviation="4" flood-color="rgba(255,255,255,0.6)"/></filter></defs><g id="dispositivo-completo" transform="translate(50, 50)" filter="url(%23sombra_3d_aparelho)"><g id="corpo"><path d="M 30,10 a 20,20 0 0 1 20,-20 h 0 v 680 a 20,20 0 0 1 -20,20 h 0 z" fill="url(%23painel_escuro_grad)"/><rect x="50" y="-10" width="350" height="690" rx="20" ry="20" fill="none" stroke="url(%23borda_metal_grad)" stroke-width="4"/><rect x="52" y="-8" width="346" height="686" rx="18" ry="18" fill="url(%23corpo_grad_lavanda)"/><path d="M 52,-8 L 398,-8 L 180,678 L 52,678 Z" fill="url(%23vidro_reflexo_diagonal)"/><path d="M 280,-8 L 398,-8 L 398,300 Z" fill="rgba(255,255,255,0.25)"/><g id="botoes-laterais" fill="%23222" stroke="url(%23borda_metal_grad)" stroke-width="1"><rect x="28" y="100" width="8" height="110" rx="4" ry="4"/><rect x="28" y="230" width="8" height="50" rx="4" ry="4"/></g></g><g id="modulo-camera" filter="url(%23modulo_sombra_pro)"><rect x="100" y="50" width="100" height="240" rx="50" ry="50" fill="url(%23modulo_fundo_grad)" stroke="url(%23borda_metal_grad)" stroke-width="2.5"/><path d="M 100,100 A 50,50 0 0 1 200,100 L 150,290 Z" fill="rgba(255,255,255,0.22)"/><g id="lentes" transform="translate(150, 50)"><g transform="translate(0, 60)"><circle cx="0" cy="0" r="40" fill="none" stroke="url(%23borda_metal_grad)" stroke-width="3"/><circle cx="0" cy="0" r="36" fill="%23000"/><circle cx="0" cy="0" r="33" fill="url(%23vidro_safira_coating)"/><circle cx="0" cy="0" r="22" fill="none" stroke="rgba(0, 242, 254, 0.4)" stroke-width="1.5" stroke-dasharray="6 3"/><circle cx="0" cy="0" r="14" fill="%23080c14" stroke="%231e293b" stroke-width="2"/><circle cx="0" cy="0" r="6" fill="%23020408"/><path d="M -24,-18 A 30,30 0 0 1 18,-24 A 32,32 0 0 0 -24,-18 Z" fill="rgba(255,255,255,0.85)"/><circle cx="-12" cy="-12" r="3.5" fill="%23ffffff"/><circle cx="14" cy="14" r="4.5" fill="rgba(0,242,254,0.4)"/></g><g transform="translate(0, 160)"><circle cx="0" cy="0" r="40" fill="none" stroke="url(%23borda_metal_grad)" stroke-width="3"/><circle cx="0" cy="0" r="36" fill="%23000"/><circle cx="0" cy="0" r="33" fill="url(%23vidro_safira_coating)"/><circle cx="0" cy="0" r="22" fill="none" stroke="rgba(255, 0, 127, 0.4)" stroke-width="1.5" stroke-dasharray="6 3"/><circle cx="0" cy="0" r="14" fill="%23080c14" stroke="%231e293b" stroke-width="2"/><circle cx="0" cy="0" r="6" fill="%23020408"/><path d="M -24,-18 A 30,30 0 0 1 18,-24 A 32,32 0 0 0 -24,-18 Z" fill="rgba(255,255,255,0.85)"/><circle cx="-12" cy="-12" r="3.5" fill="%23ffffff"/><circle cx="14" cy="14" r="4.5" fill="rgba(255,0,127,0.4)"/></g><g transform="translate(0, 225)"><circle cx="0" cy="0" r="10" fill="none" stroke="url(%23borda_metal_grad)" stroke-width="1.5"/><circle cx="0" cy="0" r="8.5" fill="url(%23flash_vidro_grad)"/><circle cx="0" cy="0" r="5" fill="rgba(255,255,255,0.6)"/></g></g></g></g></svg>`;

  private defaultSmartphones: Smartphone[] = [
    {
      id: 'samsung-z-fold8-3d',
      marca: 'Samsung',
      modelo: 'Galaxy Z Fold 8 3D',
      tagline: 'Snapdragon 8 Elite Gen 5, Flex Titanium, 3.000 Nits & One UI 9.0',
      preco: 'R$ 12.999',
      corHex: '#7928ca',
      imagemThumb: 'assets/phone-thumb-1.png',
      destaques: ['Modelo 3D Real GLB', 'Tecnologia Flex Titanium (201g)', 'Snapdragon 8 Elite Gen 5', 'Tela 7.6" (3.000 Nits)', 'Bateria 4.800 mAh & Carga 45W'],
      slides: [
        {
          id: 'slide-zfold-titanium',
          tipo: 'camera',
          tituloSlide: 'Tecnologia Flex Titanium & Certificação IP48',
          subtituloSlide: 'DESIGN ULTRALEVE DE 201G A 211G',
          descricaoSlide: 'Construção revolucionária em Flex Titanium projetada para reduzir o vinco central ao mínimo, peso ultraleve de apenas 201g e resistência IP48 contra água e poeira.',
          imagemCutout: 'camera',
          modelo3DGlb: 'assets/models/z-fold8.glb',
          fotoModoFrame: 'modelo-3d-glb',
          fotoFit: 'contain',
          fotoScale: 1.0,
          fotoDepth3D: 45,
          autoRotate3D: false,
          cameraOrbit: '0deg 75deg 1.6m',
          cameraTarget: '0m 0m 0m',
          fieldOfView: 'auto',
          glbCustomMaterialEnabled: false,
          glbExposure: 1.0,
          glbShadowIntensity: 1.0,
          textoFundo: {
            textoOuNumero: '201g',
            subrotulo: 'FLEX TITANIUM & IP48 WATER RESIST',
            posicao: 'centro-atras',
            gradiente: 'linear-gradient(135deg, #7928ca 0%, #ff007f 100%)',
            silhueta: 'peso',
            silhuetaScale: 1.8,
            silhuetaOpacity: 0.25,
            posX: 50,
            posY: 20,
            scale: 1.0
          },
          especificacoes: [
            {
              id: 'z-spec-tit-1',
              titulo: 'Tecnologia Flex Titanium',
              valor: '201g a 211g • Vinco Reduzido',
              detalhe: 'Engenharia de dobra em titânio que minimiza a marca central e reduz o peso do aparelho.',
              posicaoX: 25,
              posicaoY: 32,
              direcaoSeta: 'top-left',
              icone: 'layers'
            },
            {
              id: 'z-spec-tit-2',
              titulo: 'Certificação IP48',
              valor: 'Proteção Água & Poeira',
              detalhe: 'Proteção oficial contra respingos e submersão acidental com vedação de titânio.',
              posicaoX: 75,
              posicaoY: 48,
              direcaoSeta: 'top-right',
              icone: 'shield'
            }
          ]
        },
        {
          id: 'slide-zfold-desempenho',
          tipo: 'processador',
          tituloSlide: 'Snapdragon 8 Elite Gen 5 for Galaxy',
          subtituloSlide: 'POTÊNCIA SUPREMA COM 12 GB RAM & ATÉ 1 TB',
          descricaoSlide: 'Processador Qualcomm Snapdragon 8 Elite Gen 5 customizado exclusivamente para a linha Galaxy, com 12 GB de RAM e armazenamento interno de 256 GB, 512 GB ou 1 TB.',
          imagemCutout: 'chip',
          modelo3DGlb: 'assets/models/z-fold8.glb',
          fotoModoFrame: 'modelo-3d-glb',
          fotoFit: 'contain',
          fotoScale: 1.1,
          fotoDepth3D: 45,
          autoRotate3D: false,
          cameraOrbit: '210deg 70deg 1.3m',
          cameraTarget: '0m 0m 0m',
          fieldOfView: 'auto',
          glbCustomMaterialEnabled: false,
          textoFundo: {
            textoOuNumero: 'GEN 5',
            subrotulo: 'SNAPDRAGON 8 ELITE GEN 5 & 12GB RAM',
            posicao: 'tras-esquerda',
            gradiente: 'linear-gradient(135deg, #ff007f 0%, #7928ca 100%)',
            silhueta: 'processador',
            silhuetaScale: 1.8,
            silhuetaOpacity: 0.25,
            posX: 50,
            posY: 20,
            scale: 1.0
          },
          especificacoes: [
            {
              id: 'z-spec-proc-1',
              titulo: 'Snapdragon 8 Elite Gen 5',
              valor: 'Processador for Galaxy',
              detalhe: 'Arquitetura de elite para execução ultra-rápida de modelos Galaxy AI e One UI 9.0.',
              posicaoX: 22,
              posicaoY: 34,
              direcaoSeta: 'top-left',
              icone: 'cpu'
            },
            {
              id: 'z-spec-proc-2',
              titulo: '12 GB RAM + Até 1 TB',
              valor: '256GB / 512GB / 1TB',
              detalhe: 'Memória LPDDR5X ultra-rápida com opções de armazenamento sem gargalos.',
              posicaoX: 78,
              posicaoY: 56,
              direcaoSeta: 'bottom-right',
              icone: 'zap'
            }
          ]
        },
        {
          id: 'slide-zfold-telas',
          tipo: 'tela',
          tituloSlide: 'Tela Interna 7.6" AMOLED (3.000 Nits)',
          subtituloSlide: 'DISPLAY 2448 X 1848 PIXELS & TELA EXTERNA DE 5.5"',
          descricaoSlide: 'Tela principal de 7,6" AMOLED Dinâmico 2X (2448 x 1848 pixels, 120Hz) com brilho recorde de até 3.000 nits e tela de capa externa de 5,5" AMOLED Dinâmico 2X de 120Hz.',
          imagemCutout: 'display',
          modelo3DGlb: 'assets/models/z-fold8.glb',
          fotoModoFrame: 'modelo-3d-glb',
          fotoFit: 'contain',
          fotoScale: 1.0,
          fotoDepth3D: 45,
          autoRotate3D: false,
          cameraOrbit: '0deg 90deg 1.5m',
          cameraTarget: '0m 0m 0m',
          fieldOfView: '30deg',
          glbCustomMaterialEnabled: false,
          textoFundo: {
            textoOuNumero: '3000 NITS',
            subrotulo: '7.6" 2448X1848 & EXTERNA 5.5" 120HZ',
            posicao: 'centro-atras',
            gradiente: 'linear-gradient(135deg, #38ef7d 0%, #11998e 100%)',
            silhueta: 'tela',
            silhuetaScale: 1.8,
            silhuetaOpacity: 0.25,
            posX: 50,
            posY: 20,
            scale: 1.0
          },
          especificacoes: [
            {
              id: 'z-spec-disp-1',
              titulo: 'Tela Principal 7.6" (3.000 Nits)',
              valor: '2448 x 1848 • 120Hz',
              detalhe: 'Display dobrável de altíssimo contraste e brilho de pico de 3.000 nits sob sol direto.',
              posicaoX: 25,
              posicaoY: 30,
              direcaoSeta: 'top-left',
              icone: 'sun'
            },
            {
              id: 'z-spec-disp-2',
              titulo: 'Tela Externa 5.5" 120Hz',
              valor: 'AMOLED Dinâmico 2X',
              detalhe: 'Display de capa de 5.5 polegadas responsivo com taxa de 120Hz para uso rápido.',
              posicaoX: 75,
              posicaoY: 55,
              direcaoSeta: 'bottom-right',
              icone: 'refresh-cw'
            }
          ]
        },
        {
          id: 'slide-zfold-cameras-oficiais',
          tipo: 'camera',
          tituloSlide: 'Câmeras Traseiras Duplas 50 MP (OIS)',
          subtituloSlide: 'SISTEMA DE 50 MP + ULTRA-WIDE 50 MP & FRONTAIS 10 MP',
          descricaoSlide: 'Conjunto de câmeras traseiras com sensor Principal de 50 MP com OIS + Ultra-wide de 50 MP, além de duas câmeras frontais de 10 MP (interna e externa).',
          imagemCutout: 'camera',
          modelo3DGlb: 'assets/models/z-fold8.glb',
          fotoModoFrame: 'modelo-3d-glb',
          fotoFit: 'contain',
          fotoScale: 1.15,
          fotoDepth3D: 45,
          autoRotate3D: false,
          cameraOrbit: '135deg 65deg 1.2m',
          cameraTarget: '0m 0.05m 0m',
          fieldOfView: '28deg',
          glbCustomMaterialEnabled: false,
          textoFundo: {
            textoOuNumero: '50 MP',
            subrotulo: 'DUAL 50 MP REAR & DUAL 10 MP FRONT',
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
              id: 'z-spec-cam-1',
              titulo: 'Traseira Principal 50 MP (OIS)',
              valor: '50 MP OIS + 50 MP Ultra-Wide',
              detalhe: 'Estabilização óptica de imagem avançada e lente grande-angular de 50 MP.',
              posicaoX: 28,
              posicaoY: 28,
              direcaoSeta: 'top-left',
              icone: 'camera'
            },
            {
              id: 'z-spec-cam-2',
              titulo: 'Frontais Duplas 10 MP + 10 MP',
              valor: '10 MP Interna & 10 MP Capa',
              detalhe: 'Selfies de alta definição e videochamadas nítidas em ambas as telas.',
              posicaoX: 72,
              posicaoY: 52,
              direcaoSeta: 'bottom-right',
              icone: 'aperture'
            }
          ]
        },
        {
          id: 'slide-zfold-bateria-sistema',
          tipo: 'bateria',
          tituloSlide: 'Bateria 4.800 mAh & Android 17 (One UI 9.0)',
          subtituloSlide: 'CARGA 45W FIO / 20W SEM FIO & 7 ANOS DE UPDATES',
          descricaoSlide: 'Bateria reforçada de 4.800 mAh com suporte a carregamento rápido de 45W com fio, 20W sem fio e suporte a 7 anos de atualizações de sistema e segurança com One UI 9.0.',
          imagemCutout: 'bateria',
          modelo3DGlb: 'assets/models/z-fold8.glb',
          fotoModoFrame: 'modelo-3d-glb',
          fotoFit: 'contain',
          fotoScale: 1.0,
          fotoDepth3D: 45,
          autoRotate3D: false,
          cameraOrbit: '270deg 85deg 1.4m',
          cameraTarget: '0m 0m 0m',
          fieldOfView: 'auto',
          glbCustomMaterialEnabled: false,
          textoFundo: {
            textoOuNumero: '4800 mAh',
            subrotulo: 'ONE UI 9.0 & 7 ANOS DE ATUALIZAÇÕES',
            posicao: 'tras-direita',
            gradiente: 'linear-gradient(135deg, #f12711 0%, #f5af19 100%)',
            silhueta: 'bateria',
            silhuetaScale: 1.8,
            silhuetaOpacity: 0.25,
            posX: 50,
            posY: 20,
            scale: 1.0
          },
          especificacoes: [
            {
              id: 'z-spec-bat-1',
              titulo: 'Carga 45W Fio / 20W Sem Fio',
              valor: 'Bateria de 4.800 mAh',
              detalhe: 'Recarga super rápida via cabo 45W e base sem fio de 20W.',
              posicaoX: 30,
              posicaoY: 45,
              direcaoSeta: 'top-left',
              icone: 'battery-charging'
            },
            {
              id: 'z-spec-bat-2',
              titulo: 'One UI 9.0 (Android 17)',
              valor: '7 Anos de Atualizações',
              detalhe: 'Suporte de longo prazo com 7 anos garantidos de atualizações de SO e patches de segurança.',
              posicaoX: 75,
              posicaoY: 60,
              direcaoSeta: 'bottom-right',
              icone: 'shield'
            }
          ]
        }
      ]
    },
    {
      id: 'samsung-z-fold8-sketchfab',
      marca: 'Samsung',
      modelo: 'Galaxy Z Fold 8 (Sketchfab 3D)',
      tagline: 'Modelo 3D Interativo Animado & Articulado via Sketchfab Embed',
      preco: 'R$ 12.999',
      corHex: '#1caad9',
      imagemThumb: 'assets/phone-thumb-1.png',
      destaques: ['Modelo 3D Sketchfab Embed', 'Articulado e Animação 3D', 'Gire 360° no Navegador', 'Tela Dobrável AMOLED'],
      slides: [
        {
          id: 'slide-sketchfab-3d',
          tipo: 'camera',
          tituloSlide: 'Samsung Z Fold 8 3D (Sketchfab Embed)',
          subtituloSlide: 'MODELO 3D ARTICULADO & ANIMADO',
          descricaoSlide: 'Modelo 3D Sketchfab completo com suporte a animação, texturas fidedignas e controle 360° diretamente incorporado.',
          imagemCutout: 'camera',
          iframeEmbed3D: 'https://sketchfab.com/models/9fe8c0cbf5e54b598a76440ee90d0f80/embed',
          fotoModoFrame: 'iframe-embed-3d',
          fotoFit: 'contain',
          fotoScale: 1.0,
          fotoDepth3D: 45,
          textoFundo: {
            textoOuNumero: 'Z FOLD 8',
            subrotulo: 'SKETCHFAB 3D EMBED BY DIKA3D',
            posicao: 'centro-atras',
            gradiente: 'linear-gradient(135deg, #1caad9 0%, #00f2fe 100%)',
            silhueta: 'camera',
            silhuetaScale: 1.8,
            silhuetaOpacity: 0.25,
            posX: 50,
            posY: 20,
            scale: 1.0
          },
          especificacoes: [
            {
              id: 'sk-spec-1',
              titulo: 'Dobradiça Articulada 3D',
              valor: 'Rigged & Animated',
              detalhe: 'Modelo tridimensional completo renderizado em tempo real pelo Sketchfab WebGL.',
              posicaoX: 25,
              posicaoY: 30,
              direcaoSeta: 'top-left',
              icone: 'layers'
            },
            {
              id: 'sk-spec-2',
              titulo: 'Conjunto Triplo de Câmeras',
              valor: 'Texturas HD 3D',
              detalhe: 'Detalhamento ultrarrealista com mapa de reflexos e materiais metálicos.',
              posicaoX: 75,
              posicaoY: 45,
              direcaoSeta: 'top-right',
              icone: 'camera'
            }
          ]
        }
      ]
    },
    {
      id: 'apex-ultra-16-pro',
      marca: 'Aura Technology',
      modelo: 'Apex Ultra 16 Pro',
      tagline: 'A Revolução da Fotografia & IA em Suas Mãos',
      preco: 'R$ 8.999',
      corHex: '#00f2fe',
      imagemThumb: 'assets/phone-thumb-1.png',
      destaques: ['Sistema Triplo 50MP', 'Chip A18 Bionic Pro', 'Super Retina XDR 120Hz', 'Bateria Titanium Charge'],
      slides: [
        {
          id: 'slide-camera',
          tipo: 'camera',
          tituloSlide: 'Lavanda Pro Optics 3D',
          subtituloSlide: 'MÓDULO DE FOTOGRAFIA EM VIDRO TEMPERADO',
          descricaoSlide: 'Sistema de tripla câmera de 50MP com lente principal de vidro de safira, estabilização óptica OIS de 5ª geração e reflexos 3D de alta precisão.',
          imagemCutout: this.LAVANDA_GLASS_SVG,
          fotoModoFrame: 'sem-moldura',
          fotoFit: 'contain',
          fotoScale: 1.0,
          fotoDepth3D: 45,
          textoFundo: {
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
          },
          especificacoes: [
            {
              id: 'spec-1',
              titulo: 'Lente Principal Pro Optics',
              valor: '50 MP • f/1.4',
              detalhe: 'Sensor de 1/1.14" com vidro antirreflexo de safira e abertura variável de f/1.4 a f/4.0.',
              posicaoX: 25,
              posicaoY: 28,
              direcaoSeta: 'top-left',
              icone: 'camera'
            },
            {
              id: 'spec-2',
              titulo: 'Telefoto Periscópica',
              valor: '5x Zoom Óptico 50MP',
              detalhe: 'Prisma tetraédrico com estabilização 3D de deslocamento do sensor.',
              posicaoX: 75,
              posicaoY: 42,
              direcaoSeta: 'top-right',
              icone: 'zoom-in'
            },
            {
              id: 'spec-3',
              titulo: 'Flash Dual LED Fresnel',
              valor: 'Flash Adaptativo',
              detalhe: 'Ajuste de intensidade por mapa de profundidade LiDAR em tempo real.',
              posicaoX: 25,
              posicaoY: 58,
              direcaoSeta: 'bottom-left',
              icone: 'aperture'
            }
          ]
        },
        {
          id: 'slide-chip',
          tipo: 'processador',
          tituloSlide: 'Processador A18 Pro',
          subtituloSlide: 'POTÊNCIA EXTREMA E INTELIGÊNCIA ARTIFICIAL',
          descricaoSlide: 'Construído em arquitetura de 3 nanômetros de 2ª geração com 6 núcleos de CPU e Neural Engine de 16 núcleos.',
          imagemCutout: 'chip',
          fotoModoFrame: 'sem-moldura',
          fotoFit: 'contain',
          fotoScale: 1.0,
          fotoDepth3D: 40,
          textoFundo: {
            textoOuNumero: '3 nm',
            subrotulo: 'ARQUITETURA A18 BIONIC PRO',
            posicao: 'centro-atras',
            gradiente: 'linear-gradient(135deg, #ff007f 0%, #7928ca 100%)',
            silhueta: 'processador',
            silhuetaScale: 1.8,
            silhuetaOpacity: 0.25,
            posX: 50,
            posY: 20,
            scale: 1.0
          },
          especificacoes: [
            {
              id: 'spec-chip-1',
              titulo: 'Neural Engine 16 Cores',
              valor: '35 Trilhões de OPS',
              detalhe: 'Aceleração nativa de modelos de linguagem e processamento fotográfico computacional.',
              posicaoX: 20,
              posicaoY: 30,
              direcaoSeta: 'top-left',
              icone: 'cpu'
            },
            {
              id: 'spec-chip-2',
              titulo: 'GPU Pro 6-Core',
              valor: 'Ray Tracing por Hardware',
              detalhe: 'Desempenho gráfico de classe de console com iluminação realista em tempo real.',
              posicaoX: 80,
              posicaoY: 50,
              direcaoSeta: 'bottom-right',
              icone: 'zap'
            }
          ]
        },
        {
          id: 'slide-tela',
          tipo: 'tela',
          tituloSlide: 'Super Retina XDR 120Hz',
          subtituloSlide: 'IMERSÃO VISUAL ABSOLUTA',
          descricaoSlide: 'Painel OLED de 6.7" com brilho de pico de 3000 nits, tecnologia ProMotion e Dynamic Island responsiva.',
          imagemCutout: 'display',
          fotoModoFrame: 'sem-moldura',
          fotoFit: 'contain',
          fotoScale: 1.0,
          fotoDepth3D: 40,
          textoFundo: {
            textoOuNumero: '120 Hz',
            subrotulo: 'TELA SUPER RETINA XDR PROMOTION',
            posicao: 'tras-esquerda',
            gradiente: 'linear-gradient(135deg, #38ef7d 0%, #11998e 100%)',
            silhueta: 'tela',
            silhuetaScale: 1.8,
            silhuetaOpacity: 0.25,
            posX: 50,
            posY: 20,
            scale: 1.0
          },
          especificacoes: [
            {
              id: 'spec-tela-1',
              titulo: 'Brilho Máximo HDR',
              valor: '3.000 Nits Outdoor',
              detalhe: 'Visibilidade perfeita sob luz solar direta com contraste dinâmico de 2.000.000:1.',
              posicaoX: 25,
              posicaoY: 35,
              direcaoSeta: 'top-left',
              icone: 'sun'
            },
            {
              id: 'spec-tela-2',
              titulo: 'Taxa ProMotion 120Hz',
              valor: '1Hz a 120Hz Adaptativo',
              detalhe: 'Economia de bateria em Always-On Display e fluidez máxima em jogos.',
              posicaoX: 75,
              posicaoY: 65,
              direcaoSeta: 'bottom-right',
              icone: 'refresh-cw'
            }
          ]
        },
        {
          id: 'slide-bateria',
          tipo: 'bateria',
          tituloSlide: 'Bateria & Carga Titanium',
          subtituloSlide: 'AUTONOMIA DE DIA INTEIRO',
          descricaoSlide: 'Célula de densidade reforçada com suporte a carregamento ultra-rápido MagFit de 45W e 29 horas de reprodução de vídeo.',
          imagemCutout: 'bateria',
          fotoModoFrame: 'sem-moldura',
          fotoFit: 'contain',
          fotoScale: 1.0,
          fotoDepth3D: 40,
          textoFundo: {
            textoOuNumero: '5000',
            subrotulo: 'BATERIA DENSIDADE ELEVADA MAH',
            posicao: 'tras-direita',
            gradiente: 'linear-gradient(135deg, #f12711 0%, #f5af19 100%)',
            silhueta: 'bateria',
            silhuetaScale: 1.8,
            silhuetaOpacity: 0.25,
            posX: 50,
            posY: 20,
            scale: 1.0
          },
          especificacoes: [
            {
              id: 'spec-bat-1',
              titulo: 'Carga MagFit 45W',
              valor: '50% em 20 Minutos',
              detalhe: 'Tecnologia de indução magnética refrigerada por câmara de vapor.',
              posicaoX: 25,
              posicaoY: 45,
              direcaoSeta: 'top-left',
              icone: 'battery-charging'
            }
          ]
        }
      ]
    }
  ];

  private smartphonesSubject = new BehaviorSubject<Smartphone[]>([]);

  constructor() {
    this.loadSmartphones();
  }

  private loadSmartphones(): void {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    if (saved) {
      try {
        const parsed: Smartphone[] = JSON.parse(saved);
        if (parsed && Array.isArray(parsed) && parsed.length > 0) {
          // PRESERVA INTEGRALMENTE TODAS AS EDIÇÕES, POSIÇÕES 3D E NOVOS SLIDES DO USUÁRIO!
          parsed.forEach(phone => {
            const primaryGlb = phone.slides[0]?.modelo3DGlb;
            phone.slides.forEach((slide, idx) => {
              if (idx > 0 && slide.modelo3DGlb === 'SAME_AS_PRIMARY_GLB') {
                slide.modelo3DGlb = primaryGlb;
              }
            });
          });
          this.smartphonesSubject.next(parsed);
          return;
        }
      } catch (e) {
        console.error('Erro ao ler localStorage do catálogo:', e);
      }
    }
    this.smartphonesSubject.next(this.defaultSmartphones);
    this.saveToStorage(this.defaultSmartphones);
  }

  getSmartphones(): Observable<Smartphone[]> {
    return this.smartphonesSubject.asObservable();
  }

  getSmartphoneById(id: string): Smartphone | undefined {
    return this.smartphonesSubject.value.find(p => p.id === id);
  }

  saveSmartphonesToStorage(smartphones: Smartphone[]): void {
    this.smartphonesSubject.next(smartphones);
    this.saveToStorage(smartphones);
  }

  resetToDefaults(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    this.smartphonesSubject.next(this.defaultSmartphones);
    this.saveToStorage(this.defaultSmartphones);
  }

  private saveToStorage(smartphones: Smartphone[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(smartphones));
    } catch (e) {
      console.warn('Alerta de cota do localStorage excedida. Aplicando salvamento otimizado de slides:', e);
      this.saveOptimizedStorage(smartphones);
    }
  }

  private saveOptimizedStorage(smartphones: Smartphone[]): void {
    try {
      const cleaned: Smartphone[] = JSON.parse(JSON.stringify(smartphones));
      cleaned.forEach((phone: Smartphone) => {
        const firstGlb = phone.slides[0]?.modelo3DGlb;
        phone.slides.forEach((slide, idx) => {
          if (idx > 0 && slide.modelo3DGlb && slide.modelo3DGlb.startsWith('data:') && slide.modelo3DGlb === firstGlb) {
            // Reaproveita referência do primeiro slide para evitar duplicar megabytes no localStorage
            slide.modelo3DGlb = 'SAME_AS_PRIMARY_GLB';
          }
        });
      });
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(cleaned));
    } catch (e2) {
      console.error('Falha crítica ao salvar no localStorage:', e2);
    }
  }
}
