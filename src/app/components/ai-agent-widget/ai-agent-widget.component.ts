import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AiAgentService } from '../../services/ai-agent.service';
import { Smartphone } from '../../models/smartphone.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ai-agent-widget',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ai-agent-widget.component.html',
  styleUrls: ['./ai-agent-widget.component.scss']
})
export class AiAgentWidgetComponent implements OnInit {
  isOpen = false;
  activeTab: 'chat' | 'settings' | 'apikey' = 'chat';
  
  userPrompt = '';
  apiKeyInput = '';
  customSystemPrompt = '';
  
  isLoading = false;
  generatedPhone?: Smartphone;
  jsonTextString = '';

  toastMessage = '';

  constructor(
    private aiAgentService: AiAgentService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.apiKeyInput = this.aiAgentService.getApiKey();
    this.customSystemPrompt = this.aiAgentService.getSystemPrompt();
  }

  toggleWidget(): void {
    this.isOpen = !this.isOpen;
  }

  saveApiKey(): void {
    this.aiAgentService.saveApiKey(this.apiKeyInput);
    this.showToast('🗝️ Chave API do Gemini salva com sucesso!');
  }

  saveSystemPrompt(): void {
    this.aiAgentService.saveSystemPrompt(this.customSystemPrompt);
    this.showToast('💾 Template de Prompt salvo no navegador!');
  }

  resetSystemPrompt(): void {
    this.aiAgentService.resetSystemPrompt();
    this.customSystemPrompt = this.aiAgentService.defaultSystemPrompt;
    this.showToast('🔄 Template de Prompt restaurado para o padrão.');
  }

  async generateModel(): Promise<void> {
    if (!this.userPrompt.trim()) {
      this.showToast('⚠️ Por favor, digite o modelo do smartphone.');
      return;
    }

    this.isLoading = true;
    this.generatedPhone = undefined;
    this.jsonTextString = '';

    try {
      this.generatedPhone = await this.aiAgentService.generateSmartphone(this.userPrompt);
      this.jsonTextString = JSON.stringify(this.generatedPhone, null, 2);
      this.showToast('✨ Aparelho e slides gerados com sucesso!');
    } catch (e) {
      console.error(e);
      this.showToast('❌ Erro ao gerar o modelo via IA.');
    } finally {
      this.isLoading = false;
    }
  }

  syncJsonText(): void {
    try {
      this.generatedPhone = JSON.parse(this.jsonTextString);
    } catch (e) {
      // Ignora erro temporário de sintaxe enquanto o usuário digita
    }
  }

  importToCatalog(): void {
    if (!this.generatedPhone) return;

    try {
      const phoneToImport: Smartphone = JSON.parse(this.jsonTextString);
      this.aiAgentService.importSmartphoneToCatalog(phoneToImport);
      this.showToast(`🚀 "${phoneToImport.modelo}" importado para o catálogo!`);

      // Redireciona diretamente para o visualizador solo do modelo importado
      setTimeout(() => {
        this.isOpen = false;
        this.router.navigate(['/visualizador', phoneToImport.id]);
      }, 1000);
    } catch (e) {
      this.showToast('⚠️ Erro de sintaxe no JSON editado.');
    }
  }

  private showToast(msg: string): void {
    this.toastMessage = msg;
    setTimeout(() => {
      this.toastMessage = '';
    }, 3000);
  }
}
