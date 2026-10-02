import { Component, Input, ElementRef, ViewChild, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EspecificacaoAnimada } from '../../models/smartphone.model';
import gsap from 'gsap';

@Component({
  selector: 'app-spec-callout',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './spec-callout.component.html',
  styleUrl: './spec-callout.component.scss'
})
export class SpecCalloutComponent implements AfterViewInit, OnChanges {
  @Input({ required: true }) spec!: EspecificacaoAnimada;
  @Input() isVisible: boolean = true;

  @ViewChild('reticlePoint') reticlePoint!: ElementRef<HTMLDivElement>;
  @ViewChild('svgPath') svgPath!: ElementRef<SVGPathElement>;
  @ViewChild('specBadge') specBadge!: ElementRef<HTMLDivElement>;

  isExpanded: boolean = false;

  ngAfterViewInit(): void {
    if (this.isVisible) {
      this.animateIn();
    } else {
      this.animateOutInstantly();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isVisible']) {
      if (this.isVisible) {
        this.animateIn();
      } else {
        this.animateOutInstantly();
      }
    }
  }

  toggleExpand(): void {
    this.isExpanded = !this.isExpanded;
  }

  public animateIn(): void {
    if (!this.reticlePoint || !this.specBadge) return;

    gsap.killTweensOf(this.reticlePoint.nativeElement);
    gsap.killTweensOf(this.specBadge.nativeElement);
    if (this.svgPath?.nativeElement) {
      gsap.killTweensOf(this.svgPath.nativeElement);
    }

    const tl = gsap.timeline();

    gsap.set(this.reticlePoint.nativeElement, { scale: 0, opacity: 0 });
    gsap.set(this.specBadge.nativeElement, { opacity: 0, y: 15, scale: 0.9 });

    if (this.svgPath?.nativeElement) {
      const length = this.svgPath.nativeElement.getTotalLength() || 150;
      
      gsap.set(this.svgPath.nativeElement, {
        strokeDasharray: length,
        strokeDashoffset: length,
        opacity: 1
      });

      tl.to(this.reticlePoint.nativeElement, { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(1.7)' })
        .to(this.svgPath.nativeElement, { strokeDashoffset: 0, duration: 0.35, ease: 'power2.out' }, '-=0.15')
        .to(this.specBadge.nativeElement, { opacity: 1, y: 0, scale: 1, duration: 0.3, ease: 'power2.out' }, '-=0.2');
    } else {
      tl.to(this.reticlePoint.nativeElement, { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(1.7)' })
        .to(this.specBadge.nativeElement, { opacity: 1, y: 0, scale: 1, duration: 0.3, ease: 'power2.out' }, '-=0.15');
    }
  }

  // HIDE INSTANTÂNEO SEM ATRASO AO TROCAR DE SLIDE
  public animateOutInstantly(): void {
    if (!this.reticlePoint || !this.specBadge) return;

    gsap.killTweensOf(this.reticlePoint.nativeElement);
    gsap.killTweensOf(this.specBadge.nativeElement);
    if (this.svgPath?.nativeElement) {
      gsap.killTweensOf(this.svgPath.nativeElement);
    }

    gsap.set(this.reticlePoint.nativeElement, { scale: 0, opacity: 0 });
    gsap.set(this.specBadge.nativeElement, { opacity: 0, y: -10, scale: 0.9 });

    if (this.svgPath?.nativeElement) {
      const length = this.svgPath.nativeElement.getTotalLength() || 150;
      gsap.set(this.svgPath.nativeElement, { strokeDashoffset: length, opacity: 0 });
    }
  }

  getPathD(): string {
    const dir = this.spec?.direcaoSeta || 'top-left';
    switch (dir) {
      case 'top-left':
        return 'M 100 80 L 40 25 L 0 25';
      case 'top-right':
        return 'M 0 80 L 60 25 L 100 25';
      case 'bottom-left':
        return 'M 100 0 L 40 55 L 0 55';
      case 'bottom-right':
        return 'M 0 0 L 60 55 L 100 55';
      case 'top':
        return 'M 50 80 L 50 10';
      case 'bottom':
        return 'M 50 0 L 50 70';
      default:
        return 'M 100 80 L 40 25 L 0 25';
    }
  }
}
