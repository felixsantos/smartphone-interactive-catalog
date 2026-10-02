export interface EspecificacaoAnimada {
  id: string;
  titulo: string;
  valor: string;
  detalhe?: string;
  posicaoX: number; // Percentual X (0 - 100%)
  posicaoY: number; // Percentual Y (0 - 100%)
  posXOffset?: number; // Deslocamento X customizado em pixels no comparador
  posYOffset?: number; // Deslocamento Y customizado em pixels no comparador
  fontSizeScale?: number; // Escala de tamanho da fonte (ex: 0.8x a 2.5x)
  direcaoSeta?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'top' | 'bottom';
  icone?: string;
  tipoVisual?: 'pointed' | 'floating-text';
}

export interface TextoFundoGigante {
  textoOuNumero: string;
  subrotulo?: string;
  posicao: 'tras-direita' | 'tras-esquerda' | 'centro-atras';
  gradiente?: string;
  posX?: number; // Percentual customizado X
  posY?: number; // Percentual customizado Y
  scale?: number; // Fator de escala do texto
  silhueta?: 'camera' | 'processador' | 'tela' | 'bateria' | 'peso' | 'nenhuma';
  silhuetaScale?: number; // Tamanho/Escala da Silhueta (0.5x - 4.0x)
  silhuetaOpacity?: number; // Opacidade da Silhueta (0.0 - 1.0)
}

export interface SlideAparelho {
  id: string;
  tipo: 'camera' | 'processador' | 'tela' | 'bateria';
  tituloSlide: string;
  subtituloSlide: string;
  descricaoSlide: string;
  imagemCutout: string;
  modelo3DGlb?: string; // Caminho para modelo 3D GLB real (ex: assets/models/z-fold8.glb)
  iframeEmbed3D?: string; // URL do Iframe Embed 3D (ex: Sketchfab, Spline, etc.)
  fotoDepth3D?: number; // Profundidade 3D / Elevação Z da foto enviada
  fotoModoFrame?: 'sem-moldura' | 'moldura-tela' | 'modelo-3d-glb' | 'iframe-embed-3d'; // Modo de exibição
  fotoFit?: 'contain' | 'cover' | 'fill'; // Enquadramento da foto enviada
  fotoScale?: number; // Escala/Zoom da foto ou modelo 3D
  // CONFIGURAÇÕES 3D DA APRESENTAÇÃO SOLO (EXPLORAR HARDWARE)
  cameraOrbit?: string; // Angulação 3D fixada na apresentação solo
  cameraTarget?: string; // Ponto de foco na apresentação solo
  fieldOfView?: string; // Zoom fixado na apresentação solo
  autoRotate3D?: boolean; // Rotação na apresentação solo
  autoRotateSpeed?: number; // Velocidade na apresentação solo

  // PROPRIEDADES 3D ISOLADAS E EXCLUSIVAS DO MÓDULO DE COMPARATIVO 3D (NÃO AFETAM A APRESENTAÇÃO SOLO)
  compareCameraOrbit?: string;
  compareCameraTarget?: string;
  compareFieldOfView?: string;
  compareAutoRotate3D?: boolean;
  compareAutoRotateSpeed?: number;
  
  // CONFIGURAÇÃO EXCLUSIVA DE NEON / GLOW APENAS DO ELEMENTO 3D (SEM ALTERAR O FUNDO)
  elementNeonEnabled?: boolean; // Se o neon no elemento 3D está ativado ou desativado
  elementNeonColor?: string; // Cor do neon exclusivo do elemento 3D (ex: #00f2fe, #ff007f, #7928ca)
  elementNeonIntensity?: number; // Intensidade/opacidade do neon (0.0 a 2.0x)
  elementNeonRadius?: number; // Alcance do raio do neon em pixels (0px a 100px)

  // CHECKBOX & CONTROLES DE ILUMINAÇÃO, BRILHO & REFLEXOS DO MODELO GLB
  glbCustomMaterialEnabled?: boolean; // Se true, aplica personalização; se false, mantém 100% padrão original
  glbExposure?: number; // Brilho/Exposição (0.2x - 3.0x)
  glbShadowIntensity?: number; // Intensidade da Sombra (0.0 - 3.0)
  glbShadowSoftness?: number; // Suavidade da Sombra (0.0 - 1.0)
  glbEnvironmentImage?: string; // Ambiente/Reflexos ('neutral' | 'legacy')
  glbRoughnessFactor?: number; // Rugosidade/Fosco das texturas (0.0 - 1.0)
  glbMetallicFactor?: number; // Reflexo Metálico do Vidro/Corpo (0.0 - 1.0)

  posicaoCamera3D?: {
    rotX: number;
    rotY: number;
    scale: number;
  };
  textoFundo?: TextoFundoGigante;
  especificacoes: EspecificacaoAnimada[];
}

export interface Smartphone {
  id: string;
  marca: string;
  modelo: string;
  tagline: string;
  preco: string;
  corHex: string;
  imagemThumb: string;
  slides: SlideAparelho[];
  destaques: string[];

  // CONFIGURAÇÃO CMS DO MODO DE AVANÇO DOS SLIDES
  modoAvancoSlides?: 'automatico' | 'teclado-espaco' | 'manual-clique'; // Escolha no CMS
  tempoAutoplaySegundos?: number; // Tempo de cada slide em segundos no modo automático
}
