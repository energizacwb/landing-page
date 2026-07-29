import React, { useState } from 'react';
import { ICPConfig, Lead } from '../types';
import LucideIcon from './LucideIcon';
import LeadForm from './LeadForm';
import EnergizaLogo from './EnergizaLogo';
import { ShieldCheck, Plus, Minus, ArrowUpRight, HelpCircle, Check, Users, Download, FileText, MessageSquare, Sparkles } from 'lucide-react';
import { generateIcpPDF } from '../utils/pdfGenerator';

interface LPBuilderProps {
  config: ICPConfig;
  onLeadCaptured: (lead: Lead) => void;
  onGTMEvent: (eventName: string, elementId: string, metadata?: any) => void;
  onBackToHub?: () => void;
}

export default function LPBuilder({ config, onLeadCaptured, onGTMEvent, onBackToHub }: LPBuilderProps) {
  const [calcValue, setCalcValue] = useState<number>(config.calculator.inputDefault);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);

  const handleDownloadPDF = () => {
    setIsDownloadingPdf(true);
    onGTMEvent(`pdf_download_click_${config.slug}`, `btn_download_pdf_blueprint_${config.slug}`);
    
    setTimeout(() => {
      try {
        generateIcpPDF(config);
      } catch (err) {
        console.error('Error generating PDF:', err);
      } finally {
        setIsDownloadingPdf(false);
      }
    }, 800);
  };

  const handleFaqToggle = (index: number) => {
    const isOpening = openFaqIndex !== index;
    setOpenFaqIndex(isOpening ? index : null);
    
    onGTMEvent(
      `faq_click_${config.slug}`,
      `faq_item_${index}`,
      { question: config.faqs[index].question, action: isOpening ? 'open' : 'close' }
    );
  };

  const handleCtaClick = (elementId: string) => {
    onGTMEvent(`cta_click_${config.slug}`, elementId);
    // Smooth scroll to form
    const formElement = document.getElementById(`form_lead_capture_${config.slug}`);
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <div id={`lp_wrapper_${config.slug}`} className="min-h-screen bg-neutral-50/50 text-neutral-900 selection:bg-indigo-100 selection:text-indigo-900 font-sans">
      
      {/* Header */}
      <header id={`header_${config.slug}`} className="bg-white border-b border-neutral-100 py-4 px-4 sm:px-6 lg:px-8 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <EnergizaLogo size="sm" />

          <div className="flex items-center gap-3 sm:gap-4">
            {onBackToHub && (
              <button
                id={`btn_back_to_control_panel_${config.slug}`}
                onClick={onBackToHub}
                className="text-xs font-sans font-medium text-neutral-600 hover:text-neutral-900 transition-colors cursor-pointer flex items-center gap-1 bg-neutral-100 hover:bg-neutral-200 py-1.5 px-3 rounded-lg"
              >
                ← Home
              </button>
            )}
            <span className="hidden sm:flex items-center gap-1 text-[11px] font-sans font-semibold text-neutral-500 bg-neutral-100 py-1 px-2.5 rounded-full">
              <ShieldCheck size={12} className="text-emerald-600" /> LGPD Compliant (Art. 11, II)
            </span>
            <button
              id={`btn_header_cta_${config.slug}`}
              onClick={() => handleCtaClick('header_cta')}
              className={`text-xs font-sans font-semibold px-4 py-2 rounded-xl text-white ${config.colorClass.primary} ${config.colorClass.primaryHover} transition-all duration-300 cursor-pointer shadow-sm`}
            >
              Fazer Teste Grátis
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section id={`hero_${config.slug}`} className="relative bg-white pt-10 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Abstract Background Blur Nodes */}
        <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-neutral-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 pointer-events-none"></div>
        <div className="absolute bottom-10 -right-1/4 w-96 h-96 bg-indigo-50 rounded-full mix-blend-multiply filter blur-3xl opacity-50 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center relative z-10">
          
          {/* Left Column (Copy) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-1.5 py-1 px-3 rounded-full text-xs font-sans font-semibold bg-neutral-100 text-neutral-800">
              <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-ping"></span>
              {config.sector}
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-sans font-black text-neutral-900 leading-tight tracking-tight">
              {config.headline}
            </h1>

            <p className="text-base sm:text-lg text-neutral-600 font-sans max-w-2xl leading-relaxed">
              {config.subheadline}
            </p>

            <div className="flex flex-col sm:flex-row flex-wrap gap-4 pt-4">
              <button
                id={`btn_hero_cta_${config.slug}`}
                onClick={() => handleCtaClick('hero_cta')}
                className={`py-3.5 px-6 rounded-xl font-sans font-bold text-white text-sm cursor-pointer shadow-lg transition-all duration-300 text-center ${config.colorClass.primary} ${config.colorClass.primaryHover} transform hover:-translate-y-0.5`}
              >
                {config.ctaText}
              </button>
              <a
                id={`lnk_documentation_${config.slug}`}
                href="#calculator_section"
                onClick={(e) => {
                  e.preventDefault();
                  onGTMEvent(`hero_secondary_click_${config.slug}`, 'btn_hero_calculator');
                  document.getElementById('calculator_section')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="py-3.5 px-6 rounded-xl font-sans font-semibold text-neutral-700 text-sm border border-neutral-200 hover:bg-neutral-50 transition-all text-center flex items-center justify-center gap-1.5"
              >
                Calcular ROI Estimado
              </a>
              <button
                id={`btn_download_blueprint_${config.slug}`}
                onClick={handleDownloadPDF}
                disabled={isDownloadingPdf}
                className="py-3.5 px-6 rounded-xl font-sans font-bold text-neutral-800 text-sm border-2 border-dashed border-indigo-200 bg-indigo-50/30 hover:bg-indigo-50/60 hover:border-indigo-300 transition-all text-center flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Download size={15} className="text-indigo-600" />
                {isDownloadingPdf ? 'Gerando PDF...' : 'Baixar Blueprint PDF'}
              </button>
            </div>

            {/* Trusted By Block */}
            <div className="pt-8 border-t border-neutral-100">
              <p className="text-[11px] font-mono font-bold text-neutral-400 uppercase tracking-wider mb-3">Empresas que confiam na Energiza:</p>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-3 opacity-60 grayscale hover:grayscale-0 transition-all duration-300">
                <span className="text-xs font-sans font-black tracking-tighter text-neutral-800">BRASPRESS</span>
                <span className="text-xs font-sans font-extrabold text-neutral-800">SICREDI</span>
                <span className="text-xs font-sans font-bold text-neutral-800">GRUPO BOTICÁRIO</span>
                <span className="text-xs font-sans font-black tracking-tight text-neutral-800">HAVAN</span>
                <span className="text-xs font-sans font-medium text-neutral-800">ANHANGUERA</span>
              </div>
            </div>
          </div>

          {/* Right Column (Lead Form) */}
          <div className="lg:col-span-5 relative">
            <div className="absolute -top-4 -left-4 w-72 h-72 bg-indigo-50 rounded-full mix-blend-multiply filter blur-2xl opacity-40 -z-10 pointer-events-none"></div>
            <LeadForm
              icpSlug={config.slug}
              themeColor={{
                primary: config.colorClass.primary,
                primaryHover: config.colorClass.primaryHover,
                borderAccent: config.colorClass.borderAccent,
                ringAccent: config.colorClass.ringAccent,
              }}
              onLeadCaptured={onLeadCaptured}
              onGTMEvent={onGTMEvent}
            />
          </div>

        </div>
      </section>

      {/* Pain Points Section */}
      <section id={`pains_${config.slug}`} className="py-20 px-4 sm:px-6 lg:px-8 bg-neutral-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-2xl sm:text-3xl font-sans font-extrabold tracking-tight text-neutral-900 mb-4">
              {config.painTitle}
            </h2>
            <p className="text-sm sm:text-base text-neutral-600 font-sans">
              {config.painSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {config.pains.map((pain) => (
              <div
                key={pain.id}
                id={`card_pain_${pain.id}`}
                className="bg-white rounded-2xl p-6 border border-neutral-200/60 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center mb-6">
                    <LucideIcon name={pain.icon} size={24} />
                  </div>
                  <h3 className="text-lg font-sans font-bold text-neutral-900 tracking-tight mb-2">
                    {pain.title}
                  </h3>
                  <p className="text-xs text-neutral-500 font-sans leading-relaxed">
                    {pain.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solutions Section */}
      <section id={`solutions_${config.slug}`} className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-2xl sm:text-3xl font-sans font-extrabold tracking-tight text-neutral-900 mb-4">
              {config.solutionTitle}
            </h2>
            <p className="text-sm sm:text-base text-neutral-600 font-sans">
              {config.solutionSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {config.solutions.map((sol) => (
              <div
                key={sol.id}
                id={`card_solution_${sol.id}`}
                className="bg-neutral-50/50 rounded-2xl p-6 border border-neutral-100 hover:border-neutral-200 transition-all duration-300"
              >
                <div className={`w-12 h-12 rounded-xl ${config.colorClass.bgLight} ${config.colorClass.textAccent} flex items-center justify-center mb-6`}>
                  <LucideIcon name={sol.icon} size={24} />
                </div>
                <h3 className="text-lg font-sans font-bold text-neutral-900 tracking-tight mb-2">
                  {sol.title}
                </h3>
                <p className="text-xs text-neutral-500 font-sans leading-relaxed">
                  {sol.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Calculator Section */}
      <section id="calculator_section" className="py-20 px-4 sm:px-6 lg:px-8 bg-indigo-950 text-white relative overflow-hidden">
        {/* Background gradient flares */}
        <div className="absolute top-1/2 -left-1/4 w-80 h-80 bg-indigo-500/10 rounded-full filter blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 -right-1/4 w-80 h-80 bg-violet-500/10 rounded-full filter blur-3xl pointer-events-none"></div>

        <div className="max-w-5xl mx-auto relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-mono font-bold tracking-widest text-indigo-300 uppercase block mb-2">Simulador de Resultado</span>
            <h2 className="text-2xl sm:text-3xl font-sans font-black tracking-tight mb-4">
              {config.calculator.title}
            </h2>
            <p className="text-xs sm:text-sm text-indigo-200 font-sans">
              {config.calculator.description}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white/5 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl">
            
            {/* Input Slider Column */}
            <div className="lg:col-span-5 space-y-6">
              <div>
                <label htmlFor="calculator_slider" className="block text-xs font-sans font-medium text-indigo-200 mb-2">
                  {config.calculator.inputLabel}
                </label>
                <div className="flex items-center justify-between gap-4 mb-3">
                  <input
                    id="calculator_number_input"
                    type="number"
                    min={config.calculator.inputMin}
                    max={config.calculator.inputMax}
                    value={calcValue}
                    onChange={(e) => {
                      const val = Math.min(config.calculator.inputMax, Math.max(config.calculator.inputMin, Number(e.target.value)));
                      setCalcValue(val);
                      onGTMEvent(`calc_adjust_${config.slug}`, 'num_input', { value: val });
                    }}
                    className="bg-indigo-900/50 border border-indigo-700 rounded-xl px-3 py-2 w-32 font-mono font-bold text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  />
                  <span className="text-xs font-sans font-medium text-indigo-300">{config.calculator.inputUnit}</span>
                </div>
                <input
                  id="calculator_slider"
                  type="range"
                  min={config.calculator.inputMin}
                  max={config.calculator.inputMax}
                  step={config.slug === 'imobiliarias' ? 5 : 1000}
                  value={calcValue}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setCalcValue(val);
                    onGTMEvent(`calc_adjust_${config.slug}`, 'slider', { value: val });
                  }}
                  className="w-full h-2 bg-indigo-800 rounded-lg appearance-none cursor-pointer accent-indigo-400 focus:outline-none"
                />
                <div className="flex justify-between text-[10px] text-indigo-300 font-mono mt-1.5">
                  <span>{config.calculator.inputMin.toLocaleString('pt-BR')}</span>
                  <span>{config.calculator.inputMax.toLocaleString('pt-BR')}</span>
                </div>
              </div>

              <div className="bg-white/5 p-4 rounded-xl border border-white/5 text-[11px] text-indigo-200 font-sans">
                💡 <span className="font-semibold text-white">Como calculamos isso?</span> Nossas métricas são calibradas com base nos resultados reais coletados em mais de 4,5 milhões de consultas mensais operadas por nossos clientes ativos no Brasil.
              </div>
            </div>

            {/* Metrics Output Column */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-4">
              {config.calculator.metrics.map((metric, idx) => (
                <div
                  key={idx}
                  id={`calc_result_${idx}`}
                  className="bg-indigo-900/40 p-5 rounded-2xl border border-indigo-800/60 flex flex-col justify-between hover:border-indigo-700 transition-all duration-300"
                >
                  <div className="text-[11px] font-sans font-semibold text-indigo-200 tracking-tight leading-tight mb-2">
                    {metric.label}
                  </div>
                  <div>
                    <div className="text-xl sm:text-2xl font-sans font-black tracking-tight text-white leading-none mb-1">
                      {metric.formula(calcValue)}
                    </div>
                    <div className="text-[10px] font-mono font-bold text-indigo-300 uppercase tracking-wider mb-2">
                      {metric.suffix}
                    </div>
                  </div>
                  <p className="text-[10px] text-indigo-200/80 font-sans leading-tight border-t border-indigo-800/40 pt-2">
                    {metric.desc}
                  </p>
                </div>
              ))}
            </div>

          </div>

          <div className="mt-8 text-center">
            <button
              id={`btn_calc_cta_${config.slug}`}
              onClick={() => handleCtaClick('calc_cta')}
              className="inline-flex items-center gap-1.5 px-6 py-3 rounded-full text-xs font-sans font-bold bg-white text-indigo-950 hover:bg-indigo-50 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer"
            >
              Exportar Diagnóstico Gratuito para Minha Empresa <ArrowUpRight size={14} />
            </button>
          </div>
        </div>
      </section>

      {/* Social Proof (Bento Grid) */}
      <section id={`social_${config.slug}`} className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-2xl sm:text-3xl font-sans font-extrabold tracking-tight text-neutral-900 mb-4">
              {config.socialProofTitle}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {config.socialProof.map((proof, idx) => (
              <div
                key={idx}
                id={`card_social_${idx}`}
                className="bg-neutral-50/50 rounded-2xl p-6 border border-neutral-100 flex flex-col justify-between relative overflow-hidden"
              >
                {/* Quotation Watermark */}
                <span className="absolute right-4 bottom-2 text-8xl font-serif text-neutral-200/50 select-none pointer-events-none">”</span>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-neutral-900 text-white font-sans font-black flex items-center justify-center text-xs">
                      {proof.logoText}
                    </div>
                    <div>
                      <h4 className="text-sm font-sans font-bold text-neutral-900">{proof.client}</h4>
                      <p className="text-[10px] font-mono font-semibold text-neutral-400">Cliente Homologado</p>
                    </div>
                  </div>

                  <p className="text-xs text-neutral-600 font-sans leading-relaxed relative z-10">
                    O uso do motor de enriquecimento da Energiza nos permitiu obter <span className="font-semibold text-neutral-800">{proof.resultText}</span>
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-neutral-100 flex items-baseline gap-2">
                  <span className={`text-3xl font-sans font-black tracking-tight ${config.colorClass.textAccent}`}>
                    {proof.metric}
                  </span>
                  <span className="text-[10px] font-mono font-bold text-neutral-400 uppercase tracking-wider">de impacto direto</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Step by Step Section */}
      <section id={`steps_${config.slug}`} className="py-20 px-4 sm:px-6 lg:px-8 bg-neutral-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-2xl sm:text-3xl font-sans font-extrabold tracking-tight text-neutral-900 mb-2">
              {config.stepsTitle}
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 font-sans">Sem burocracia técnica. Pronto em minutos.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            {config.steps.map((stepObj, idx) => (
              <div
                key={idx}
                id={`card_step_${idx}`}
                className="bg-white rounded-2xl p-5 border border-neutral-200/50 relative hover:border-neutral-300 transition-all shadow-sm"
              >
                <div className={`text-2xl font-mono font-black ${config.colorClass.textAccent} mb-4`}>
                  {stepObj.step}
                </div>
                <h3 className="text-sm font-sans font-bold text-neutral-900 tracking-tight mb-2">
                  {stepObj.title}
                </h3>
                <p className="text-[11px] text-neutral-500 font-sans leading-relaxed">
                  {stepObj.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Offer / Pricing Section */}
      <section id={`pricing_${config.slug}`} className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-3xl mx-auto bg-neutral-50 rounded-3xl p-6 sm:p-10 border border-neutral-200/80 shadow-lg text-center relative overflow-hidden">
          
          {/* Top colored flag */}
          <div className={`absolute top-0 left-1/2 transform -translate-x-1/2 w-48 h-1.5 ${config.colorClass.primary} rounded-b-full`}></div>

          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-sans font-bold uppercase tracking-wider ${config.colorClass.badge} mb-4`}>
            Recomendado para {config.sector}
          </span>

          <h2 className="text-2xl sm:text-3xl font-sans font-black tracking-tight text-neutral-900 mb-1">
            {config.pricing.title}
          </h2>
          <p className="text-xs text-neutral-500 font-sans mb-6">{config.pricing.subtitle}</p>

          <div className="mb-6">
            <span className="text-3xl sm:text-5xl font-sans font-black text-neutral-950 tracking-tight">
              {config.pricing.price}
            </span>
            <span className="text-xs font-mono font-bold text-neutral-400 block mt-1">
              {config.pricing.period}
            </span>
          </div>

          <div className="max-w-md mx-auto bg-white rounded-2xl p-6 border border-neutral-150 text-left space-y-3 mb-8">
            {config.pricing.features.map((feat, idx) => (
              <div key={idx} className="flex items-start gap-2.5 text-xs text-neutral-600 font-sans">
                <span className="text-emerald-500 mt-0.5"><Check size={14} strokeWidth={3} /></span>
                <span>{feat}</span>
              </div>
            ))}
          </div>

          <button
            id={`btn_pricing_cta_${config.slug}`}
            onClick={() => handleCtaClick('pricing_cta')}
            className={`w-full py-4 px-6 rounded-xl font-sans font-bold text-white text-sm cursor-pointer shadow-md transition-all duration-300 text-center ${config.colorClass.primary} ${config.colorClass.primaryHover} mb-6`}
          >
            {config.pricing.ctaText}
          </button>

          <div className="pt-6 border-t border-neutral-200/60 text-left max-w-md mx-auto space-y-3">
            <div className="flex items-start gap-3 bg-white p-4 rounded-xl border border-neutral-200/70">
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                <FileText size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-sans font-bold text-neutral-900 leading-tight">Precisa apresentar este projeto?</h4>
                <p className="text-[10px] text-neutral-500 font-sans mt-1 leading-snug">Baixe o blueprint comercial em formato PDF contendo diagramas, tabela de preços e os recursos técnicos estruturados.</p>
                <button
                  id={`btn_pricing_pdf_download_${config.slug}`}
                  onClick={handleDownloadPDF}
                  disabled={isDownloadingPdf}
                  className="mt-2 text-[10px] font-sans font-extrabold text-indigo-600 hover:text-indigo-800 transition cursor-pointer flex items-center gap-1 disabled:opacity-50"
                >
                  <Download size={11} /> {isDownloadingPdf ? 'Gerando...' : 'Download Proposta PDF'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Objection & Consultation */}
      <section id={`objections_${config.slug}`} className="py-20 px-4 sm:px-6 lg:px-8 bg-neutral-50 border-t border-b border-neutral-200/40">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-4 flex justify-center">
            <div className={`w-24 h-24 rounded-full ${config.colorClass.bgLight} ${config.colorClass.textAccent} flex items-center justify-center`}>
              <HelpCircle size={48} strokeWidth={1.5} />
            </div>
          </div>
          <div className="md:col-span-8 space-y-4">
            <h3 className="text-xl font-sans font-bold text-neutral-900 tracking-tight">
              {config.objectionTitle}
            </h3>
            <p className="text-xs sm:text-sm text-neutral-500 font-sans leading-relaxed">
              {config.objectionText}
            </p>
          </div>
        </div>
      </section>

      {/* Compliance / LGPD Block */}
      <section id={`compliance_${config.slug}`} className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <ShieldCheck size={28} />
          </div>
          <h3 className="text-lg sm:text-xl font-sans font-bold text-neutral-950 tracking-tight">
            {config.complianceTitle}
          </h3>
          <p className="text-xs text-neutral-500 font-sans leading-relaxed max-w-xl mx-auto">
            {config.complianceText}
          </p>
          <div className="flex justify-center gap-6 opacity-40 pt-4">
            <span className="text-[10px] font-mono font-bold">✓ LGPD COMPLIANT (ART. 11, II)</span>
            <span className="text-[10px] font-mono font-bold">✓ AUDITORIA ANUAL</span>
            <span className="text-[10px] font-mono font-bold">✓ ENCRIPTADO AES-256</span>
          </div>
        </div>
      </section>

      {/* FAQ Section (Accordion) */}
      <section id={`faq_${config.slug}`} className="py-20 px-4 sm:px-6 lg:px-8 bg-neutral-50">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-2xl sm:text-3xl font-sans font-extrabold tracking-tight text-neutral-900 mb-2">
              Perguntas Frequentes
            </h2>
            <p className="text-xs text-neutral-500 font-sans">Ficou com alguma dúvida? Nós respondemos.</p>
          </div>

          <div className="space-y-4">
            {config.faqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  id={`faq_accordion_item_${idx}`}
                  className="bg-white rounded-2xl border border-neutral-200/60 overflow-hidden shadow-sm transition-all duration-300"
                >
                  <button
                    id={`btn_faq_accordion_header_${idx}`}
                    onClick={() => handleFaqToggle(idx)}
                    className="w-full py-4 px-6 text-left flex items-center justify-between gap-4 font-sans font-bold text-xs sm:text-sm text-neutral-900 hover:bg-neutral-50/50 cursor-pointer transition-colors focus:outline-none"
                  >
                    <span>{faq.question}</span>
                    <span className={`text-neutral-400 transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`}>
                      <Plus size={18} />
                    </span>
                  </button>
                  <div
                    id={`faq_accordion_content_${idx}`}
                    className={`transition-all duration-300 ease-in-out ${isOpen ? 'max-h-60 border-t border-neutral-100 p-6' : 'max-h-0 opacity-0 overflow-hidden'}`}
                  >
                    <p className="text-xs text-neutral-500 font-sans leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Final Call To Action Banner */}
      <section id={`cta_final_${config.slug}`} className={`py-20 px-4 sm:px-6 lg:px-8 text-white text-center relative overflow-hidden bg-gradient-to-r ${config.colorClass.gradient}`}>
        <div className="absolute top-0 left-0 right-0 bottom-0 bg-black/10"></div>
        <div className="max-w-3xl mx-auto relative z-10 space-y-6">
          <h2 className="text-2xl sm:text-4xl font-sans font-black tracking-tight leading-tight">
            Pare de jogar tempo e dinheiro fora com bases desatualizadas
          </h2>
          <p className="text-sm text-white/90 font-sans max-w-xl mx-auto leading-relaxed">
            Comece a rodar sua equipe de forma cirúrgica hoje mesmo com nossa plataforma na modalidade pré-paga.
          </p>
          <div className="pt-4">
            <button
              id={`btn_final_cta_scroll_${config.slug}`}
              onClick={() => handleCtaClick('cta_final')}
              className="px-8 py-4 bg-white text-neutral-950 font-sans font-bold text-sm rounded-xl hover:bg-neutral-50 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-0.5 inline-flex items-center gap-2"
            >
              Falar com um Especialista Agora <ArrowUpRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id={`footer_${config.slug}`} className="bg-neutral-900 text-neutral-400 py-12 px-4 sm:px-6 lg:px-8 border-t border-neutral-800 text-xs font-sans">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8">
          
          <div className="md:col-span-5 space-y-4">
            <EnergizaLogo size="sm" textColorClass="text-white" subtextColorClass="text-neutral-500" />
            <p className="max-w-sm text-[11px] leading-relaxed">
              Líder em enriquecimento, validação cadastral em tempo real e inteligência analítica baseada em dados públicos de CPF e CNPJ para o mercado corporativo brasileiro.
            </p>
          </div>

          <div className="md:col-span-4 space-y-2">
            <h4 className="font-mono font-bold text-neutral-200 uppercase tracking-wider mb-3">Informações de Contato</h4>
            <p><strong>E-mail:</strong> <a href="mailto:giza@energizasolucoes.com" className="hover:underline text-indigo-400">giza@energizasolucoes.com</a></p>
            <p><strong>Telefone/WhatsApp:</strong> (41) 99716-2138</p>
          </div>

          <div className="md:col-span-3 space-y-2">
            <h4 className="font-mono font-bold text-neutral-200 uppercase tracking-wider mb-3">Conformidade Legal</h4>
            <p>© {new Date().getFullYear()} Energiza Soluções Ltda. Todos os direitos reservados.</p>
            <p>Em conformidade total com o Art. 11, II, "d" da Lei Geral de Proteção de Dados (LGPD).</p>
          </div>

        </div>
      </footer>

      {/* Floating Quick Contact Bar */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col sm:flex-row items-end sm:items-center gap-2.5">
        <button
          onClick={() => handleCtaClick('floating_bar_lead')}
          className="bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold py-2.5 px-4 rounded-full shadow-2xl border border-neutral-700 flex items-center gap-2 transition-all cursor-pointer transform hover:scale-105"
        >
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Formulário de Cotação</span>
        </button>

        <a
          href={`https://api.whatsapp.com/send?phone=5541997162138&text=${encodeURIComponent(`Olá! Vim pela página de ${config.sector} (${config.name}) da Energiza Soluções e gostaria de solicitar uma proposta comercial.`)}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => onGTMEvent(`whatsapp_floating_click_${config.slug}`, 'btn_floating_whatsapp')}
          className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold py-2.5 px-4 rounded-full shadow-2xl flex items-center gap-2 transition-all cursor-pointer transform hover:scale-105"
        >
          <MessageSquare className="w-4 h-4" />
          <span>WhatsApp (41) 99716-2138</span>
        </a>
      </div>

    </div>
  );
}
