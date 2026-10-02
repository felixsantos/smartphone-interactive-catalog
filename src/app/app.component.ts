import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AiAgentWidgetComponent } from './components/ai-agent-widget/ai-agent-widget.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AiAgentWidgetComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'smartphone-interactive-catalog';
}
