'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { LoopLogoIcon } from '@/components/ui/LoopLogo';
import { Button } from '@/components/ui/Button';
import {
  ArrowRight,
  Sparkles,
  Bot,
  Layers,
  BarChart3,
  FileText,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Quote,
  UploadCloud,
  Users,
  Search,
  ChevronRight,
  Database,
  Lock,
  Zap,
  Terminal,
  MessageSquare,
  Activity,
  Check
} from 'lucide-react';

export default function LandingPage() {
  const particleCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = particleCanvasRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const coarsePointer = window.matchMedia('(pointer: coarse)');
    const shouldAnimate = () =>
      !reducedMotion.matches && !coarsePointer.matches && window.innerWidth >= 768;
    type Particle = { x: number; y: number; vx: number; vy: number; radius: number };
    let particles: Particle[] = [];
    let frame = 0;
    let running = false;
    let width = 0;
    let height = 0;
    let pointer = { x: -1000, y: -1000 };

    const resize = () => {
      const bounds = canvas.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = bounds.width;
      height = bounds.height;
      canvas.width = width * ratio;
      canvas.height = height * ratio;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      particles = Array.from({ length: Math.min(64, Math.max(28, Math.floor(width / 20))) }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.22,
        vy: (Math.random() - 0.5) * 0.22,
        radius: 0.7 + Math.random() * 0.8,
      }));
      canvas.style.display = shouldAnimate() ? 'block' : 'none';
      if (shouldAnimate() && !running) animate();
    };

    const animate = () => {
      if (!shouldAnimate()) {
        running = false;
        context.clearRect(0, 0, width, height);
        canvas.style.display = 'none';
        return;
      }
      running = true;
      canvas.style.display = 'block';
      context.clearRect(0, 0, width, height);

      particles.forEach((particle) => {
        const dx = particle.x - pointer.x;
        const dy = particle.y - pointer.y;
        const distance = Math.hypot(dx, dy);
        if (distance < 115 && distance > 0) {
          const force = (115 - distance) / 115 * 0.16;
          particle.vx += (dx / distance) * force;
          particle.vy += (dy / distance) * force;
        }

        particle.vx = Math.max(-0.55, Math.min(0.55, particle.vx * 0.985));
        particle.vy = Math.max(-0.55, Math.min(0.55, particle.vy * 0.985));
        particle.x = (particle.x + particle.vx + width) % width;
        particle.y = (particle.y + particle.vy + height) % height;

        context.beginPath();
        context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        context.fillStyle = 'rgba(24, 24, 27, 0.25)';
        context.fill();
      });

      particles.forEach((particle, index) => {
        const nearPointer = Math.hypot(particle.x - pointer.x, particle.y - pointer.y) < 150;
        if (!nearPointer) return;
        for (let nextIndex = index + 1; nextIndex < particles.length; nextIndex += 1) {
          const next = particles[nextIndex];
          const distance = Math.hypot(particle.x - next.x, particle.y - next.y);
          if (distance < 90) {
            context.beginPath();
            context.moveTo(particle.x, particle.y);
            context.lineTo(next.x, next.y);
            context.strokeStyle = `rgba(39, 39, 42, ${(1 - distance / 90) * 0.12})`;
            context.lineWidth = 0.7;
            context.stroke();
          }
        }
      });

      frame = window.requestAnimationFrame(animate);
    };

    const movePointer = (event: PointerEvent) => {
      const bounds = canvas.getBoundingClientRect();
      pointer = { x: event.clientX - bounds.left, y: event.clientY - bounds.top };
    };
    const resetPointer = () => { pointer = { x: -1000, y: -1000 }; };
    const updateMotion = () => resize();

    resize();
    window.addEventListener('resize', resize);
    canvas.addEventListener('pointermove', movePointer);
    canvas.addEventListener('pointerleave', resetPointer);
    reducedMotion.addEventListener('change', updateMotion);
    coarsePointer.addEventListener('change', updateMotion);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('pointermove', movePointer);
      canvas.removeEventListener('pointerleave', resetPointer);
      reducedMotion.removeEventListener('change', updateMotion);
      coarsePointer.removeEventListener('change', updateMotion);
    };
  }, []);

  const pipelineStages = [
    { title: 'Customer Feedback', desc: 'Raw customer voices stream from Zendesk, Intercom, App Store & CSV', icon: MessageSquare },
    { title: 'AI Classification', desc: 'Zero-shot sentiment scoring & feature detection via Gemini 1.5 Pro', icon: Sparkles },
    { title: 'Theme Clustering', desc: 'Vector semantic embeddings group unstructured quotes into topics', icon: Layers },
    { title: 'Analytics', desc: 'Real-time volume tracking, sentiment distributions & trend trajectories', icon: BarChart3 },
    { title: 'Business Insight', desc: 'Executive VoC briefs and grounded evidence Q&A with zero hallucinations', icon: FileText }
  ];

  return (
    <div className="min-h-screen bg-white text-neutral-900 font-sans selection:bg-neutral-900 selection:text-white">
      {/* ============================================================== */}
      {/* TOP NAVIGATION HEADER                                          */}
      {/* ============================================================== */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 select-none">
            <div className="p-2 rounded-xl bg-neutral-900 text-white shadow-2xs">
              <LoopLogoIcon size={20} variant="light" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="whitespace-nowrap font-heading text-sm font-extrabold tracking-wider text-neutral-950 sm:text-lg">
                  PROJECT LOOP
                </span>
                <span className="hidden rounded border border-neutral-300 bg-neutral-100 px-1.5 py-0.2 font-mono-numbers text-[9px] font-bold text-neutral-800 sm:inline-flex">
                  AI PLATFORM
                </span>
              </div>
            </div>
          </Link>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-neutral-600">
            <a href="#pipeline" className="hover:text-neutral-950 transition-colors">
              Intelligence Pipeline
            </a>
            <a href="#how-it-works" className="hover:text-neutral-950 transition-colors">
              How It Works
            </a>
            <a href="#ask-loop" className="hover:text-neutral-950 transition-colors">
              Ask LOOP (RAG)
            </a>
            <a href="#analytics" className="hover:text-neutral-950 transition-colors">
              Analytics
            </a>
            <a href="#enterprise" className="hover:text-neutral-950 transition-colors">
              Enterprise
            </a>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="whitespace-nowrap px-2 py-2 text-xs font-bold text-neutral-700 transition-colors hover:text-neutral-950 sm:px-3"
            >
              Sign In
            </Link>

            <Link href="/login">
              <Button
                variant="primary"
                size="sm"
                icon={<ArrowRight className="w-3.5 h-3.5" />}
                className="whitespace-nowrap font-bold tracking-tight"
              >
                Analyse Your Feedback
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* ============================================================== */}
      {/* 1. HERO SECTION: Cinematic Enterprise AI                      */}
      {/* ============================================================== */}
      <section className="relative flex min-h-[calc(100svh-4rem)] items-center overflow-hidden border-b border-neutral-200 py-16 sm:py-20 lg:py-24">
        <canvas
          ref={particleCanvasRef}
          aria-hidden="true"
          className="hero-particles pointer-events-none absolute inset-0 z-0 h-full w-full"
        />
        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl space-y-6 text-center sm:space-y-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-neutral-300 bg-neutral-50 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-neutral-900 animate-pulse" />
              <span className="text-[11px] font-mono-numbers font-bold uppercase tracking-wider text-neutral-700">
                Enterprise Feedback Intelligence Engine
              </span>
            </div>

            <h1 className="font-heading text-4xl font-extrabold leading-[0.98] tracking-tight text-neutral-950 sm:text-7xl lg:text-[5rem]">
              Turn Customer Feedback Into Business Intelligence.
            </h1>

            <p className="mx-auto max-w-2xl font-sans text-base leading-relaxed text-neutral-600 sm:text-lg">
              LOOP transforms raw customer feedback into structured intelligence using AI-powered classification, theme discovery, analytics and evidence-based answers.
            </p>

            <div className="flex flex-col items-center justify-center gap-3 pt-2 sm:flex-row sm:gap-4">
              <Link href="/login" className="w-full sm:w-auto">
                <Button
                  variant="primary"
                  size="lg"
                  icon={<ArrowRight className="w-4 h-4" />}
                  className="w-full sm:w-auto px-8 py-3.5 text-sm font-bold shadow-md hover:scale-[1.02] transition-transform"
                >
                  Analyse Your Feedback
                </Button>
              </Link>

              <a href="#how-it-works" className="w-full sm:w-auto">
                <Button
                  variant="secondary"
                  size="lg"
                  className="w-full sm:w-auto px-6 py-3.5 text-sm font-semibold"
                >
                  Explore LOOP
                </Button>
              </a>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 pt-3 font-mono-numbers text-xs text-neutral-500">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-neutral-900" />
                Zero Hallucinations
              </span>
              <span className="flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-neutral-900" />
                Multi-Tenant RBAC
              </span>
              <span className="flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-neutral-900" />
                Gemini 1.5 Pro
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 2. CAPABILITY STRIP                                            */}
      {/* ============================================================== */}
      <section className="py-8 bg-neutral-900 text-white border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 text-center">
            {[
              { title: 'AI Classification', subtitle: 'Zero-shot sentiment & scoring' },
              { title: 'Theme Intelligence', subtitle: 'Vector cluster discovery' },
              { title: 'RAG Assistant', subtitle: 'Verified evidence citations' },
              { title: 'Analytics', subtitle: 'Multi-channel trajectory' },
              { title: 'Voice of Customer', subtitle: 'Automated executive briefs' }
            ].map((cap, idx) => (
              <div key={idx} className="space-y-1">
                <h4 className="font-heading text-sm font-bold text-white tracking-wide">
                  {cap.title}
                </h4>
                <p className="text-[11px] font-mono-numbers text-neutral-400">
                  {cap.subtitle}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 3. HOW LOOP WORKS: 5-Step Linear Flow                          */}
      {/* ============================================================== */}
      <section id="how-it-works" className="py-20 border-b border-neutral-200 bg-neutral-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-[11px] font-mono-numbers font-bold uppercase tracking-wider text-neutral-400">
              System Architecture
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-neutral-950">
              How PROJECT LOOP Works
            </h2>
            <p className="text-sm text-neutral-600 leading-relaxed font-sans">
              From disparate customer quotes to strategic product intelligence in 5 automated phases.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {pipelineStages.map((stage, idx) => {
              const Icon = stage.icon;
              return (
                <div
                  key={idx}
                  className="loop-card p-5 bg-white space-y-3 hover:shadow-md transition-shadow relative"
                >
                  <div className="flex items-center justify-between">
                    <div className="w-8 h-8 rounded-lg bg-neutral-900 text-white flex items-center justify-center font-mono-numbers font-bold text-xs">
                      0{idx + 1}
                    </div>
                    <Icon className="w-4 h-4 text-neutral-500" />
                  </div>

                  <h3 className="font-heading text-sm font-bold text-neutral-900 pt-1">
                    {stage.title}
                  </h3>
                  <p className="text-xs text-neutral-600 font-sans leading-relaxed">
                    {stage.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 4. AI INTELLIGENCE: Extraction Showcase                        */}
      {/* ============================================================== */}
      <section id="pipeline" className="py-20 border-b border-neutral-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-[11px] font-mono-numbers font-bold uppercase tracking-wider text-neutral-400">
              Deep Extraction
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-neutral-950">
              Turning Unstructured Noise Into Structured Signal
            </h2>
            <p className="text-sm text-neutral-600 leading-relaxed">
              Every customer comment is parsed, embedded, and tagged across 5 intelligence dimensions.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              { dimension: 'Sentiment', value: 'Positive / Negative / Neutral', detail: 'Zero-shot classification' },
              { dimension: 'Numerical Score', value: '0 to 100 Index', detail: 'Granular sentiment weight' },
              { dimension: 'Feature Area', value: 'UX / Billing / Mobile / API', detail: 'Auto-mapped feature tags' },
              { dimension: 'Executive Summary', value: 'One-line synthesis', detail: 'Actionable takeaway' },
              { dimension: 'Themes', value: 'Vector Semantic Clusters', detail: 'Cross-ticket correlation' }
            ].map((dim, idx) => (
              <div key={idx} className="loop-card p-5 space-y-2 border-l-4 border-l-black">
                <span className="text-[10px] uppercase font-mono-numbers font-bold text-neutral-400 block">
                  Dimension 0{idx + 1}
                </span>
                <h4 className="font-heading text-sm font-bold text-neutral-900">
                  {dim.dimension}
                </h4>
                <p className="text-xs font-semibold text-neutral-800">
                  {dim.value}
                </p>
                <p className="text-[11px] text-neutral-500 font-mono-numbers pt-1">
                  {dim.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 5. ASK LOOP SHOWCASE: Enterprise RAG Research                  */}
      {/* ============================================================== */}
      <section id="ask-loop" className="py-20 border-b border-neutral-200 bg-neutral-50/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-[11px] font-mono-numbers font-bold uppercase tracking-wider text-neutral-400">
              Flagship Feature
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-neutral-950">
              Ask LOOP — Evidence-Based AI Research
            </h2>
            <p className="text-sm text-neutral-600 leading-relaxed font-sans">
              Query your entire feedback corpus using natural language. Every sentence is grounded in verified customer citations.
            </p>
          </div>

          <div className="max-w-4xl mx-auto loop-card p-6 sm:p-8 bg-white border-neutral-300 shadow-xl space-y-6">
            {/* User Prompt */}
            <div className="flex items-start gap-3 justify-end">
              <div className="p-4 rounded-2xl bg-neutral-900 text-white rounded-br-xs max-w-lg text-sm font-medium">
                &ldquo;What are customers most unhappy about?&rdquo;
              </div>
              <div className="w-8 h-8 rounded-lg bg-neutral-950 text-white font-mono-numbers text-xs font-bold flex items-center justify-center shrink-0">
                PM
              </div>
            </div>

            {/* AI Response Card */}
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-neutral-900 text-white flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>

              <div className="flex-1 p-5 rounded-2xl bg-neutral-50 border border-neutral-200 rounded-bl-xs space-y-4">
                <div className="flex items-center justify-between text-xs border-b border-neutral-200 pb-2">
                  <span className="font-bold font-heading text-neutral-900">
                    LOOP Intelligence Engine
                  </span>
                  <span className="text-[10px] font-mono-numbers font-bold text-neutral-500">
                    Match Confidence: 94% &bull; Grounded
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-neutral-800 leading-relaxed font-sans">
                  Based on evidence retrieved across 1,482 customer records, the primary negative sentiment driver is <strong>Data Export Timeouts (UX Performance)</strong> during high-volume operations:
                </p>

                <div className="space-y-2">
                  <div className="p-3 bg-white rounded-xl border border-neutral-200 text-xs text-neutral-800">
                    <span className="font-bold text-neutral-900 block mb-1">
                      1. Bulk CSV Export Latency (FB-9021)
                    </span>
                    <p className="text-[11px] text-neutral-600 italic">
                      &ldquo;The bulk export feature constantly times out when trying to download more than 5,000 feedback records at once.&rdquo;
                    </p>
                    <span className="text-[10px] font-mono-numbers text-neutral-400 mt-1 block">
                      Sarah Jenkins • Zendesk • UX Performance
                    </span>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-neutral-200 text-xs text-neutral-800">
                    <span className="font-bold text-neutral-900 block mb-1">
                      2. Annual Pricing Renewal Transparency (FB-9024)
                    </span>
                    <p className="text-[11px] text-neutral-600 italic">
                      &ldquo;Annual pricing renewal rates feel steep given the lack of customizable dashboard widgets for executive reporting.&rdquo;
                    </p>
                    <span className="text-[10px] font-mono-numbers text-neutral-400 mt-1 block">
                      David Kim • Email • Billing & Pricing
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-neutral-200 flex items-center justify-between text-[11px] font-mono-numbers text-neutral-500">
                  <span>Themes: UX Performance, Billing & Pricing</span>
                  <span className="text-neutral-950 font-bold">2 Verified Citations</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 6. ANALYTICS PREVIEW: Controlled Visualizations                */}
      {/* ============================================================== */}
      <section id="analytics" className="py-20 border-b border-neutral-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-[11px] font-mono-numbers font-bold uppercase tracking-wider text-neutral-400">
              Controlled Analytics Palette
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-neutral-950">
              Actionable Metric Visualizations
            </h2>
            <p className="text-sm text-neutral-600 leading-relaxed font-sans">
              Monochrome dashboard structure with high-contrast, data-driven charts. Semantic colors are reserved strictly for sentiment analytics.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Sentiment Breakdown Card */}
            <div className="loop-card p-6 space-y-4">
              <span className="text-[10px] uppercase font-mono-numbers font-bold text-neutral-400">
                Sentiment Distribution
              </span>
              <h4 className="font-heading text-lg font-bold text-neutral-900">
                72.4% Positive
              </h4>
              {/* Controlled Sentiment Bar */}
              <div className="w-full bg-neutral-100 h-3 rounded-full overflow-hidden flex">
                <div style={{ width: '72%' }} className="bg-[#10B981] h-full" title="Positive: 72%" />
                <div style={{ width: '16%' }} className="bg-[#F59E0B] h-full" title="Neutral: 16%" />
                <div style={{ width: '12%' }} className="bg-[#EF4444] h-full" title="Negative: 12%" />
              </div>
              <div className="flex items-center justify-between text-xs font-mono-numbers text-neutral-500 pt-1">
                <span className="text-[#10B981] font-bold">● 72% Pos</span>
                <span className="text-[#F59E0B] font-bold">● 16% Neu</span>
                <span className="text-[#EF4444] font-bold">● 12% Neg</span>
              </div>
            </div>

            {/* Volume Trajectory Card */}
            <div className="loop-card p-6 space-y-4">
              <span className="text-[10px] uppercase font-mono-numbers font-bold text-neutral-400">
                Weekly Volume Influx
              </span>
              <h4 className="font-heading text-lg font-bold text-neutral-900">
                1,482 Tickets
              </h4>
              <div className="flex items-end gap-2 h-16 pt-2">
                {[35, 48, 62, 55, 78, 92, 110].map((val, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div
                      style={{ height: `${(val / 110) * 100}%` }}
                      className="w-full bg-neutral-900 rounded-t-sm"
                    />
                    <span className="text-[9px] font-mono-numbers text-neutral-400">
                      D{i + 1}
                    </span>
                  </div>
                ))}
              </div>
              <p className="text-[11px] text-neutral-500 font-mono-numbers">
                +18% volume increase week-over-week
              </p>
            </div>

            {/* Top Themes Card */}
            <div className="loop-card p-6 space-y-4">
              <span className="text-[10px] uppercase font-mono-numbers font-bold text-neutral-400">
                Top Theme Clusters
              </span>
              <h4 className="font-heading text-lg font-bold text-neutral-900">
                5 Active Topics
              </h4>
              <div className="space-y-2 text-xs font-sans">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-neutral-800">UX Performance</span>
                  <span className="font-mono-numbers font-bold text-neutral-900">342 tickets</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-neutral-800">Billing & Pricing</span>
                  <span className="font-mono-numbers font-bold text-neutral-900">218 tickets</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-neutral-800">Integration Request</span>
                  <span className="font-mono-numbers font-bold text-neutral-900">195 tickets</span>
                </div>
              </div>
              <p className="text-[11px] text-neutral-500 font-mono-numbers pt-1">
                Clustered automatically via Gemini vector cosine distance
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 7. ENTERPRISE FEATURES: Production Architecture               */}
      {/* ============================================================== */}
      <section id="enterprise" className="py-20 border-b border-neutral-200 bg-neutral-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-[11px] font-mono-numbers font-bold uppercase tracking-wider text-neutral-400">
              Enterprise Grade
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-neutral-950">
              Built for Serious SaaS Operations
            </h2>
            <p className="text-sm text-neutral-600 leading-relaxed font-sans">
              Strict multi-tenant security, granular role-based permissions, and streaming ingestion.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: 'Multi-Tenant Workspaces',
                desc: 'Complete data isolation per organization with dedicated encryption keys and customer identifiers.',
                icon: ShieldCheck
              },
              {
                title: 'RBAC Access Control',
                desc: 'Enforce OWNER, ADMIN, ANALYST, and VIEWER roles across all APIs and navigation surfaces.',
                icon: Lock
              },
              {
                title: 'High-Scale CSV Import',
                desc: 'Upload datasets exceeding 50,000+ rows with background streaming and progress bars.',
                icon: UploadCloud
              },
              {
                title: 'Executive VoC Reports',
                desc: 'Auto-synthesizes Voice of Customer briefs with NPS calculations and strategic recommendations.',
                icon: FileText
              },
              {
                title: 'RAG Q&A Assistant',
                desc: 'No hallucinations. All answers are grounded in customer quotes with clickable citations.',
                icon: Bot
              },
              {
                title: 'Channel Integrations',
                desc: 'Connect Zendesk, Intercom, App Store, Discourse, and custom webhooks with automated ingestion.',
                icon: Activity
              }
            ].map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div key={idx} className="loop-card p-6 bg-white space-y-3">
                  <div className="p-2 rounded-xl bg-neutral-100 border border-neutral-200 text-neutral-900 w-fit">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-heading text-base font-bold text-neutral-900">
                    {feat.title}
                  </h3>
                  <p className="text-xs text-neutral-600 font-sans leading-relaxed">
                    {feat.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 8. FINAL CTA: Close the feedback loop                          */}
      {/* ============================================================== */}
      <section className="py-24 bg-neutral-950 text-white text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="w-12 h-12 rounded-2xl bg-neutral-900 border border-neutral-800 text-white flex items-center justify-center mx-auto shadow-lg">
            <LoopLogoIcon size={24} variant="light" />
          </div>

          <h2 className="font-heading text-3xl sm:text-5xl font-extrabold tracking-tight">
            Close the feedback loop.
          </h2>

          <p className="text-sm sm:text-base text-neutral-400 max-w-xl mx-auto font-sans leading-relaxed">
            Stop guessing what customers need. Transform raw support tickets, reviews, and survey results into clear product intelligence.
          </p>

          <div className="pt-4">
            <Link href="/login">
              <Button
                variant="primary"
                size="lg"
                icon={<ArrowRight className="w-4 h-4" />}
                className="bg-white text-neutral-950 hover:bg-neutral-100 border-white text-sm font-bold px-8 py-3.5 shadow-xl hover:scale-[1.02] transition-transform"
              >
                Analyse Your Feedback
              </Button>
            </Link>
          </div>

          <p className="text-[11px] font-mono-numbers text-neutral-500 pt-2">
            No credit card required &bull; Multi-tenant RBAC enabled
          </p>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 9. FOOTER                                                      */}
      {/* ============================================================== */}
      <footer className="py-8 bg-neutral-900 text-neutral-400 border-t border-neutral-800 text-xs font-mono-numbers">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white">PROJECT LOOP</span>
            <span>&bull;</span>
            <span>Enterprise Customer Feedback Intelligence Platform</span>
          </div>

          <div className="flex items-center gap-6 text-[11px]">
            <Link href="/login" className="hover:text-white transition-colors">
              Workspace Login
            </Link>
            <Link href="/signup" className="hover:text-white transition-colors">
              Register Account
            </Link>
            <span className="flex items-center gap-1.5 text-neutral-300">
              <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 animate-pulse" />
              Engine Online
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
