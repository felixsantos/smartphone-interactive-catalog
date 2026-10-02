import { Injectable } from '@angular/core';
import { Smartphone } from '../models/smartphone.model';
import { SmartphoneService } from './smartphone.service';

@Injectable({
  providedIn: 'root'
})
export class AiAgentService {
  private readonly PROMPT_TEMPLATE_KEY = 'CATALOG_AI_PROMPT_TEMPLATE';
  private readonly API_KEY_STORAGE = 'CATALOG_GEMINI_API_KEY';

  public defaultSystemPrompt = `Você é um especialista em hardware de smartphones e design industrial.
Sua missão é gerar um objeto JSON completo representando o smartphone solicitado pelo usuário.
Regras Importantes:
1. Crie pelo menos 3 slides de apresentação (Câmera, Processador, Bateria/Construção).
2. Cada slide deve conter de 2 a 4 especificações técnicas detalhadas.
3. Defina cores neon vibrantes (#00f2fe, #7928ca, #ff007f, #38ef7d, #f5af19) e ângulos 3D adequados para cada slide.
4. Responda ESTRITAMENTE em formato JSON válido respeitando o Schema do Catálogo.`;

  constructor(private smartphoneService: SmartphoneService) {}

  getApiKey(): string {
    return localStorage.getItem(this.API_KEY_STORAGE) || '';
  }

  saveApiKey(key: string): void {
    localStorage.setItem(this.API_KEY_STORAGE, key.trim());
  }

  getSystemPrompt(): string {
    return localStorage.getItem(this.PROMPT_TEMPLATE_KEY) || this.defaultSystemPrompt;
  }

  saveSystemPrompt(promptText: string): void {
    localStorage.setItem(this.PROMPT_TEMPLATE_KEY, promptText.trim());
  }

  resetSystemPrompt(): void {
    localStorage.removeItem(this.PROMPT_TEMPLATE_KEY);
  }

  async generateSmartphone(userPrompt: string): Promise<Smartphone> {
    const apiKey = this.getApiKey();
    const systemPrompt = this.getSystemPrompt();

    if (apiKey) {
      try {
        const { GoogleGenAI, Type } = await import('@google/genai');
        const ai = new GoogleGenAI({ apiKey });

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: `Prompt do Usuário: "${userPrompt}".\n\nDiretrizes do Sistema:\n${systemPrompt}`,
          config: {
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                modelo: { type: Type.STRING },
                marca: { type: Type.STRING },
                tagline: { type: Type.STRING },
                preco: { type: Type.STRING },
                corHex: { type: Type.STRING },
                slides: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.STRING },
                      tipo: { type: Type.STRING },
                      tituloSlide: { type: Type.STRING },
                      subtituloSlide: { type: Type.STRING },
                      descricaoSlide: { type: Type.STRING },
                      modelo3DGlb: { type: Type.STRING },
                      fotoModoFrame: { type: Type.STRING },
                      cameraOrbit: { type: Type.STRING },
                      elementNeonColor: { type: Type.STRING },
                      especificacoes: {
                        type: Type.ARRAY,
                        items: {
                          type: Type.OBJECT,
                          properties: {
                            id: { type: Type.STRING },
                            titulo: { type: Type.STRING },
                            valor: { type: Type.STRING },
                            detalhe: { type: Type.STRING },
                            posicaoX: { type: Type.NUMBER },
                            posicaoY: { type: Type.NUMBER }
                          },
                          required: ['id', 'titulo', 'valor']
                        }
                      }
                    },
                    required: ['id', 'tipo', 'tituloSlide', 'especificacoes']
                  }
                }
              },
              required: ['id', 'modelo', 'marca', 'slides']
            }
          }
        });

        if (response.text) {
          const parsed = JSON.parse(response.text) as Smartphone;
          return this.sanitizeGeneratedSmartphone(parsed, userPrompt);
        }
      } catch (e) {
        console.warn('Erro ao chamar API do Gemini, utilizando gerador inteligente de fallback:', e);
      }
    }

    return this.generateFallbackSmartphone(userPrompt);
  }

  private sanitizeGeneratedSmartphone(parsed: Smartphone, prompt: string): Smartphone {
    const slug = parsed.id || prompt.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    parsed.id = slug;
    parsed.tagline = parsed.tagline || 'Engenharia Extrema em 3D';
    parsed.preco = parsed.preco || 'R$ 6.999';
    parsed.corHex = parsed.corHex || '#00f2fe';
    parsed.imagemThumb = parsed.imagemThumb || 'assets/phone-thumb-1.png';
    parsed.destaques = parsed.destaques || ['Painel 3D Interativo', 'Especificações Geradas via IA'];

    if (!parsed.slides || parsed.slides.length === 0) {
      parsed.slides = this.generateFallbackSmartphone(prompt).slides;
    }
    parsed.slides.forEach((s, idx) => {
      if (!s.id) s.id = `slide-ai-${idx}-${Date.now()}`;
      if (!s.modelo3DGlb) s.modelo3DGlb = 'assets/models/z-fold8.glb';
      if (!s.fotoModoFrame) s.fotoModoFrame = 'modelo-3d-glb';
      if (!s.cameraOrbit) s.cameraOrbit = '0deg 75deg 1.6m';
      if (!s.elementNeonColor) s.elementNeonColor = idx % 2 === 0 ? '#00f2fe' : '#7928ca';
    });
    return parsed;
  }

  private generateFallbackSmartphone(prompt: string): Smartphone {
    const cleanPrompt = prompt.trim();
    const slug = 'ai-' + cleanPrompt.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    return {
      id: slug,
      modelo: cleanPrompt || 'Smartphone IA Pro',
      marca: 'Gerado via IA',
      tagline: 'Engenharia Extrema Gerada por Inteligência Artificial',
      preco: 'R$ 6.999',
      corHex: '#00f2fe',
      imagemThumb: 'assets/phone-thumb-1.png',
      destaques: ['Renderização 3D WebGL', 'NPU Neural Integrada', 'Sensor Pro optics'],
      slides: [
        {
          id: `slide-camera-${Date.now()}`,
          tipo: 'camera',
          tituloSlide: 'Sistema de Câmeras Avançado',
          subtituloSlide: 'SISTEMA TRIPLE OPTICS PRO',
          descricaoSlide: 'Conjunto de lentes geradas com processamento de imagem por IA.',
          imagemCutout: 'camera',
          modelo3DGlb: 'assets/models/z-fold8.glb',
          fotoModoFrame: 'modelo-3d-glb',
          cameraOrbit: '0deg 75deg 1.5m',
          elementNeonColor: '#00f2fe',
          elementNeonIntensity: 0.6,
          elementNeonRadius: 45,
          textoFundo: {
            textoOuNumero: '200 MP',
            subrotulo: 'SENSOR ULTRA SIGHT',
            posicao: 'tras-direita',
            gradiente: 'linear-gradient(135deg, #00f2fe 0%, #7928ca 100%)',
            posX: 50,
            posY: 20
          },
          especificacoes: [
            {
              id: 'spec-ai-1',
              titulo: 'LENTE PRINCIPAL',
              valor: '200 MP • f/1.7',
              detalhe: 'Estabilização óptica de 5 eixos com IA.',
              posicaoX: 35,
              posicaoY: 45
            },
            {
              id: 'spec-ai-2',
              titulo: 'ZOOM ÓPTICO',
              valor: '5x Periscópio 50MP',
              detalhe: 'Captação clara em ambientes noturnos.',
              posicaoX: 65,
              posicaoY: 55
            }
          ]
        },
        {
          id: `slide-chipset-${Date.now()}`,
          tipo: 'processador',
          tituloSlide: 'Processador e Performance IA',
          subtituloSlide: 'CHIPSET NANO MATRIX 3NM',
          descricaoSlide: 'Unidade NPU dedicada para renderização 3D e inteligência generativa.',
          imagemCutout: 'processador',
          modelo3DGlb: 'assets/models/z-fold8.glb',
          fotoModoFrame: 'modelo-3d-glb',
          cameraOrbit: '45deg 75deg 1.8m',
          elementNeonColor: '#ff007f',
          elementNeonIntensity: 0.6,
          elementNeonRadius: 45,
          textoFundo: {
            textoOuNumero: '3nm',
            subrotulo: 'ARQUITETURA NPU IA',
            posicao: 'tras-direita',
            gradiente: 'linear-gradient(135deg, #ff007f 0%, #7928ca 100%)',
            posX: 50,
            posY: 20
          },
          especificacoes: [
            {
              id: 'spec-ai-3',
              titulo: 'CHIPSET',
              valor: 'Snapdragon 8 Elite Gen 5',
              detalhe: 'Ray tracing em tempo real para jogos.',
              posicaoX: 40,
              posicaoY: 40
            },
            {
              id: 'spec-ai-4',
              titulo: 'MEMÓRIA RAM',
              valor: '16 GB LPDDR5X',
              detalhe: 'Multitarefa ultra rápida com 1TB UFS 4.0.',
              posicaoX: 60,
              posicaoY: 60
            }
          ]
        }
      ]
    };
  }

  importSmartphoneToCatalog(phone: Smartphone): void {
    this.smartphoneService.getSmartphones().subscribe(list => {
      const idx = list.findIndex(p => p.id === phone.id);
      if (idx !== -1) {
        list[idx] = phone;
      } else {
        list.unshift(phone);
      }
      this.smartphoneService.saveSmartphonesToStorage(list);
    });
  }
}
