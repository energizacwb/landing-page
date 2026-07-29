import React, { useState } from 'react';
import { Lead, ICPKey } from '../types';
import { icpList } from '../data/icpData';
import LeadForm from './LeadForm';
import EnergizaLogo from './EnergizaLogo';
import { trackEvent } from '../utils/analytics';
import { 
  CheckCircle2, 
  Phone, 
  Mail, 
  ShieldCheck, 
  Database, 
  Search, 
  ArrowRight, 
  Sparkles, 
  BarChart3, 
  MessageSquare, 
  Clock, 
  Users, 
  Lock, 
  BotOff, 
  Award,
  Layers,
  ChevronRight,
  ExternalLink,
  Smartphone,
  Check,
  UserCheck,
  User,
  Building2,
  Briefcase,
  Network,
  Filter,
  Info
} from 'lucide-react';
import { motion } from 'motion/react';

const pfCategories = [
  {
    title: "Dados Cadastrais",
    color: "purple",
    items: [
      { name: "Nome Completo", desc: "Nome civil atualizado e higienizado perante a Receita Federal" },
      { name: "Data de Nascimento", desc: "Dia, mês e ano de nascimento validados" },
      { name: "Situação Cadastral RF", desc: "Status de regularidade do CPF perante a Receita Federal" },
      { name: "Flag Óbito", desc: "Indicador oficial de falecimento ativo e atualizado" }
    ]
  },
  {
    title: "Dados de Contato",
    color: "pink",
    items: [
      { name: "Endereço Completo", desc: "Logradouro, número, bairro, cidade, UF e CEP atualizado" },
      { name: "Telefone Celular", desc: "Celulares de uso pessoal ordenados por nível de atividade" },
      { name: "E-mail", desc: "Endereços de correio eletrônico validados e higienizados" },
      { name: "DDD Separado do Número", desc: "Formatação estruturada para fácil uso em discadores" }
    ]
  },
  {
    title: "Dados Socioeconômicos",
    color: "emerald",
    items: [
      { name: "Flag CLT", desc: "Indicativo de vínculo empregatício ativo em carteira" },
      { name: "Faixa Salarial", desc: "Renda mensal estimada por vínculos trabalhistas" },
      { name: "Flag INSS", desc: "Identificação de beneficiários, aposentados e pensionistas" },
      { name: "Faixa Renda Estimada", desc: "Renda mensal presumida por modelos analíticos" }
    ]
  },
  {
    title: "Pessoas Relacionadas",
    color: "blue",
    items: [
      { name: "Mãe e Pai", desc: "Vínculos de filiação de primeiro grau identificados" },
      { name: "Irmãos", desc: "Parentes de mesma filiação identificados" },
      { name: "Vizinhos", desc: "Contatos e proprietários vizinhos geográficos próximos" },
      { name: "Sócios", desc: "Coparticipantes de sociedades em empresas ativas" }
    ]
  }
];

const pjCategories = [
  {
    title: "Dados Cadastrais",
    color: "purple",
    items: [
      { name: "Razão Social", desc: "Nome oficial de registro comercial da pessoa jurídica" },
      { name: "Nome Fantasia", desc: "Marca comercial ou designação popular da empresa" },
      { name: "Situação Cadastral", desc: "Status de funcionamento do CNPJ perante a RFB" },
      { name: "Capital Social", desc: "Valor nominal de capital social integralizado" }
    ]
  },
  {
    title: "Dados de Contato da Empresa",
    color: "pink",
    items: [
      { name: "Endereço Comercial", desc: "Endereço completo da sede oficial da pessoa jurídica" },
      { name: "Telefone Fixo", desc: "Números de contato fixos registrados ou associados à empresa" },
      { name: "E-mail Corporativo", desc: "Endereços eletrônicos institucionais ativos para contato" }
    ]
  },
  {
    title: "Quadro Societário (QSA)",
    color: "blue",
    items: [
      { name: "Quantidade de Sócios", desc: "Contagem de sócios ativos inscritos no QSA" },
      { name: "Nome Completo dos Sócios", desc: "Nome civil de cada sócio ativo" },
      { name: "Cargo", desc: "Função societária oficial exercida na empresa" }
    ]
  },
  {
    title: "Dados de Contato dos Sócios",
    color: "emerald",
    items: [
      { name: "Endereço dos Sócios", desc: "Localizações residenciais localizadas para os sócios" },
      { name: "Telefone Celular dos Sócios", desc: "Telefones celulares de uso pessoal validados dos sócios" },
      { name: "E-mail dos Sócios", desc: "Correios eletrônicos pessoais e corporativos dos sócios" }
    ]
  }
];

interface MainLandingPageProps {
  onSelectICP: (slug: ICPKey) => void;
  onLeadCaptured: (lead: Lead) => void;
  onOpenAdmin: () => void;
}

export default function MainLandingPage({ onSelectICP, onLeadCaptured, onOpenAdmin }: MainLandingPageProps) {
  const [selectedIcpForForm, setSelectedIcpForForm] = useState<ICPKey | 'cobranca'>('cobranca');
  const [dbVolume, setDbVolume] = useState<number>(25000);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [activeAttrTab, setActiveAttrTab] = useState<'pf' | 'pj'>('pf');
  const [attributesSearch, setAttributesSearch] = useState('');

  const handleConsultantWhatsApp = (source: string, consultantName: string = 'Marcelo') => {
    trackEvent('whatsapp_click', { source_location: source, consultant: consultantName, icp: 'generalist' });
    const text = encodeURIComponent(`Olá, ${consultantName}! Vim pelo site da Energiza Soluções e gostaria de solicitar uma proposta comercial e tabela de valores na modalidade pré-paga.`);
    window.open(`https://wa.me/5541997162138?text=${text}`, '_blank');
  };

  const scrollToLeadForm = (icpSlug?: ICPKey) => {
    if (icpSlug) setSelectedIcpForForm(icpSlug);
    trackEvent('cta_click_generalist', { action: 'scroll_to_lead_form', icp: icpSlug || 'general' });
    const el = document.getElementById('lead_capture_section');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const calculatedValidNumbers = Math.round(dbVolume * 0.879);
  const calculatedSavings = Math.round(dbVolume * 0.42 * 2.5);

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 font-sans selection:bg-[#9900ff] selection:text-white antialiased">
      
      {/* Top Banner - Friendly and Trustworthy */}
      <div className="bg-gradient-to-r from-[#ff00cc] via-[#9900ff] to-[#00ccff] text-white py-2 px-4 text-xs font-semibold shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-white animate-pulse"></span>
            <span>MODALIDADE PRÉ-PAGA FLEXÍVEL:</span>
            <span className="font-normal text-white/90">Adquira créditos sob demanda e consulte com total flexibilidade sem contratos de fidelidade.</span>
          </div>
          <div className="flex items-center gap-3 text-xs font-bold flex-wrap justify-center sm:justify-end">
            <button 
              onClick={() => handleConsultantWhatsApp('top_announcement', 'Marcelo')}
              className="hover:underline flex items-center gap-1.5 bg-white/10 px-2.5 py-1 rounded-full transition-all cursor-pointer"
            >
              <Phone className="w-3 h-3" />
              <span>WhatsApp: (41) 99716-2138</span>
            </button>
            <span className="opacity-40 hidden sm:inline">|</span>
            <a 
              href="mailto:giza@energizasolucoes.com"
              className="hover:underline flex items-center gap-1.5 bg-white/10 px-2.5 py-1 rounded-full transition-all"
            >
              <Mail className="w-3 h-3" />
              <span>E-mail: giza@energizasolucoes.com</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          
          {/* Real Identity Logo */}
          <EnergizaLogo size="md" />

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-semibold text-slate-600">
            <a href="#solucoes" className="hover:text-[#9900ff] transition-colors">Nossos Serviços</a>
            <a href="#icp_grid" className="hover:text-[#9900ff] transition-colors">Soluções por Setor</a>
            <a href="#diferenciais" className="hover:text-[#9900ff] transition-colors">Atendimento Humano</a>
            <a href="#simulador" className="hover:text-[#9900ff] transition-colors">Simulador ROI</a>
            <a href="#depoimentos" className="hover:text-[#9900ff] transition-colors">Casos Reais</a>
            <a href="#faq" className="hover:text-[#9900ff] transition-colors">Dúvidas</a>
          </nav>

          {/* Header Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleConsultantWhatsApp('header_nav', 'Marcelo')}
              className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold transition-all"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-500" />
              <span>(41) 99716-2138</span>
            </button>

            <button
              onClick={() => scrollToLeadForm()}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#ff00cc] via-[#9900ff] to-[#00ccff] hover:opacity-90 text-white text-xs font-extrabold shadow-md shadow-purple-500/10 transition-all flex items-center gap-2 group"
            >
              <span>Falar com Consultor</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section - Vendedor Humanizado */}
      <section className="relative pt-12 pb-20 md:pt-16 md:pb-24 overflow-hidden bg-gradient-to-b from-white to-[#f1f5f9]">
        {/* Background Decorative Circles */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#9900ff]/5 blur-[120px] pointer-events-none rounded-full"></div>
        <div className="absolute top-1/3 right-10 w-[300px] h-[300px] bg-[#00ccff]/5 blur-[100px] pointer-events-none rounded-full"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Humanized Copy & Trust */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-50 border border-purple-100 text-[#9900ff] text-xs font-bold shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-[#ff00cc] animate-pulse" />
                <span>Inteligência Cadastral Humana & LGPD Compliant</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-black tracking-tight text-[#1e293b] leading-[1.15]">
                Decisões inteligentes exigem <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#ff00cc] via-[#9900ff] to-[#00ccff]">dados sempre atualizados</span>.
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto lg:mx-0 font-normal">
                Enriqueça e higienize sua base de clientes com dados estruturados, validados e atualizados na hora. Conte com uma <strong className="text-[#9900ff] font-bold">plataforma robusta de tecnologia</strong> para localizar contatos com precisão absoluta.
              </p>

              {/* Approachable Consulting Card inside Hero */}
              <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm max-w-2xl mx-auto lg:mx-0 flex flex-col sm:flex-row items-center gap-5 text-left">
                <div className="relative shrink-0">
                  <img 
                    src="/src/assets/images/consultant_portrait_1785257420340.jpg" 
                    alt="Marcelo Silva - Consultor de Dados"
                    className="w-16 h-16 rounded-full object-cover border-2 border-[#9900ff]"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute -bottom-1 -right-1 bg-emerald-500 w-4.5 h-4.5 rounded-full border-2 border-white flex items-center justify-center">
                    <span className="block w-2 h-2 rounded-full bg-white animate-ping"></span>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                    <span className="font-extrabold text-[#1e293b] text-sm">Marcelo Silva</span>
                    <span className="text-[10px] font-bold bg-[#9900ff]/10 text-[#9900ff] px-2 py-0.5 rounded-full uppercase tracking-wider">Diretor de Consultoria</span>
                  </div>
                  <p className="text-xs text-slate-500">
                    "Desenvolvemos tabelas de valores personalizadas na modalidade pré-paga sob demanda para otimizar os custos da sua operação."
                  </p>
                  <button
                    onClick={() => handleConsultantWhatsApp('hero_consultant_card', 'Marcelo')}
                    className="text-xs font-bold text-[#ff00cc] hover:text-[#9900ff] transition-colors flex items-center gap-1 mt-1"
                  >
                    <span>Chamar o Marcelo no WhatsApp</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-left max-w-xl mx-auto lg:mx-0">
                <div className="p-3 rounded-xl bg-white border border-slate-100 flex items-center gap-2.5 shadow-sm">
                  <CheckCircle2 className="w-4.5 h-4.5 text-[#ff00cc] shrink-0" />
                  <span className="text-xs font-bold text-slate-700">87,9% de Assertividade</span>
                </div>
                <div className="p-3 rounded-xl bg-white border border-slate-100 flex items-center gap-2.5 shadow-sm">
                  <Phone className="w-4.5 h-4.5 text-emerald-500 shrink-0" />
                  <span className="text-xs font-bold text-slate-700">Validação Real-Time</span>
                </div>
                <div className="p-3 rounded-xl bg-white border border-slate-100 flex items-center gap-2.5 shadow-sm col-span-2 sm:col-span-1">
                  <ShieldCheck className="w-4.5 h-4.5 text-[#00ccff] shrink-0" />
                  <span className="text-xs font-bold text-slate-700">Garantia LGPD</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <button
                  onClick={() => scrollToLeadForm()}
                  className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-[#ff00cc] via-[#9900ff] to-[#00ccff] hover:opacity-95 text-white font-black text-xs tracking-wide uppercase shadow-lg shadow-purple-500/20 transform hover:-translate-y-0.5 transition-all flex items-center justify-center gap-3 group"
                >
                  <Sparkles className="w-4 h-4 text-white" />
                  <span>Solicitar Tabela Pré-Paga</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={() => handleConsultantWhatsApp('hero_cta_direct', 'Marcelo')}
                  className="w-full sm:w-auto px-6 py-4 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 font-bold text-xs transition-all flex items-center justify-center gap-2.5"
                >
                  <Phone className="w-4 h-4 text-emerald-500" />
                  <span>Falar com Marcelo no WhatsApp</span>
                </button>
              </div>

              <p className="text-xs text-slate-400 flex items-center justify-center lg:justify-start gap-1.5 pt-1">
                <Lock className="w-3.5 h-3.5 text-slate-400" />
                <span>Modalidade pré-paga flexível • Ativação imediata de saldo com consultores</span>
              </p>
            </div>

            {/* Right Column: Visual Interactive Brand Demo Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl bg-white border border-slate-200 p-6 shadow-xl shadow-purple-500/5 backdrop-blur-xl">
                
                {/* Header of brand mockup card */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span className="text-xs font-mono font-bold uppercase text-slate-500 tracking-wider">Painel de Consulta Energiza</span>
                  </div>
                  <span className="text-[10px] font-mono bg-purple-50 text-[#9900ff] border border-purple-100 px-2.5 py-1 rounded-md font-bold">
                    API V2 Ativa
                  </span>
                </div>

                {/* Simulated CPF Lookup Form */}
                <div className="py-5 space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 flex justify-between">
                      <span>CPF do Cliente do Teste</span>
                      <span className="text-[#9900ff] font-mono text-[11px]">328.490.118-XX</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        readOnly
                        value="328.490.118-82 (Higienizado com Sucesso)"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-3 text-xs text-slate-700 font-mono cursor-not-allowed"
                      />
                      <span className="absolute right-3 top-3 text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-mono font-bold">
                        LOCALIZADO
                      </span>
                    </div>
                  </div>

                  {/* Results box */}
                  <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-100 font-mono text-xs">
                    <div className="flex items-center justify-between text-slate-600">
                      <span className="text-slate-400">Canal Principal:</span>
                      <span className="text-emerald-600 font-bold flex items-center gap-1 text-right">
                        <Check className="w-3.5 h-3.5 text-emerald-500" /> (41) 99716-XXXX (Ativo / WhatsApp)
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-slate-600">
                      <span className="text-slate-400">Canal Secundário:</span>
                      <span className="text-[#ff00cc] font-bold flex items-center gap-1 text-right">
                        (41) 3224-XXXX (Fixo Residencial)
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-slate-600">
                      <span className="text-slate-400">E-mail Tratado:</span>
                      <span className="text-slate-700 text-right">m.s******@gmail.com</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-600">
                      <span className="text-slate-400">Geolocalização:</span>
                      <span className="text-slate-700 text-right">Curitiba - PR (Confirmado 2026)</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-600 pt-2.5 border-t border-slate-200/60">
                      <span className="text-slate-400 font-bold">Score de Contato:</span>
                      <span className="text-[#9900ff] font-black text-sm">98/100 (Contato Garantido)</span>
                    </div>
                  </div>
                </div>

                {/* Interactive Action Widget */}
                <div className="bg-gradient-to-r from-purple-50 via-pink-50 to-cyan-50 border border-purple-100 rounded-2xl p-4 flex items-center justify-between gap-4">
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-slate-700">Quer enriquecer um lote agora?</p>
                    <p className="text-[10px] text-slate-500">Consulte condições pré-pagas sob demanda.</p>
                  </div>
                  <button
                    onClick={() => scrollToLeadForm()}
                    className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-[#9900ff] to-[#ff00cc] text-white text-[11px] font-extrabold shadow-sm"
                  >
                    Falar com Consultor
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Metrics Banner */}
      <section className="py-12 bg-white border-y border-slate-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-1">
              <p className="text-3xl sm:text-4xl font-extrabold text-[#9900ff] font-mono">+15M</p>
              <p className="text-xs text-slate-500 uppercase tracking-wider font-bold">CPFs Processados</p>
            </div>
            <div className="space-y-1">
              <p className="text-3xl sm:text-4xl font-extrabold text-[#ff00cc] font-mono">87,9%</p>
              <p className="text-xs text-slate-500 uppercase tracking-wider font-bold">Sucesso de Contato Útil</p>
            </div>
            <div className="space-y-1">
              <p className="text-3xl sm:text-4xl font-extrabold text-[#00ccff] font-mono">12x</p>
              <p className="text-xs text-slate-500 uppercase tracking-wider font-bold">Retorno Operacional Médio</p>
            </div>
            <div className="space-y-1">
              <p className="text-3xl sm:text-4xl font-extrabold text-emerald-500 font-mono">100%</p>
              <p className="text-xs text-slate-500 uppercase tracking-wider font-bold">Governança LGPD Garantida</p>
            </div>
          </div>
        </div>
      </section>

      {/* Corporate Profile Section */}
      <section className="py-16 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-slate-50 rounded-3xl border border-slate-100 p-8 sm:p-10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#00ccff]/5 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#9900ff]/5 rounded-full blur-3xl pointer-events-none"></div>
            
            <div className="grid lg:grid-cols-12 gap-8 items-center relative z-10">
              <div className="lg:col-span-4 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 border border-purple-100 text-[#9900ff] text-xs font-bold">
                  <Award size={14} />
                  <span>Sobre a Energiza</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-[#1e293b] leading-tight">
                  Inteligência Corporativa
                </h2>
                <p className="text-xs text-[#64748b] leading-relaxed">
                  Entenda como a Energiza Soluções transforma o tratamento de dados no Brasil através de segurança, compliance e atendimento consultivo.
                </p>
                <div className="pt-2">
                  <div className="flex items-center gap-2 text-xs text-slate-600">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>Sede em <strong>Curitiba / PR</strong></span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-8 bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
                  A <strong className="text-slate-950 font-extrabold">Energiza Soluções Ltda.</strong> é uma empresa sediada em Curitiba/PR, especializada em serviços de inteligência de dados, enriquecimento cadastral e fornecimento de plataformas tecnológicas para localização de clientes, validação de informações e higienização de bases de dados.
                </p>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
                  Com foco em conformidade com a <strong className="text-[#9900ff] font-bold">Lei Geral de Proteção de Dados (LGPD)</strong>, a organização oferece soluções que transformam dados brutos (CPF/CNPJ) em informações qualificadas e estruturadas para prospecção, saneamento cadastral e análise de mercado.
                </p>
                
                <div className="grid sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                  <div className="space-y-1">
                    <h4 className="text-xs uppercase tracking-wider text-slate-400 font-bold">Modelos Flexíveis</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Seu modelo de negócio é baseado predominantemente na modalidade <strong>pré-paga e assinaturas mensais</strong>, atendendo desde pequenos negócios até grandes corporações.
                    </p>
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xs uppercase tracking-wider text-slate-400 font-bold">Planos e Integrações</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Oferecemos planos que variam de consultas limitadas em nossa plataforma até acessos ilimitados via <strong>API robusta</strong> integrada ao seu sistema.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services & Core Capabilities */}
      <section id="solucoes" className="py-20 bg-slate-50 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-[#9900ff] bg-purple-100 px-3 py-1 rounded-full border border-purple-200">
              SOLUÇÕES INTELIGENTES
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1e293b]">
              Tecnologia de dados avançada com toque humano consultivo
            </h2>
            <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
              Tratamos e enriquecemos seus bancos de dados utilizando múltiplas fontes unificadas de órgãos e birôs oficiais, devolvendo informações higienizadas de alta qualidade.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* Capability 1 */}
            <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:border-purple-200 transition-all hover:-translate-y-1 group">
              <div className="w-12 h-12 rounded-2xl bg-pink-50 border border-pink-100 flex items-center justify-center text-[#ff00cc] mb-5 group-hover:scale-105 transition-transform">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#1e293b] mb-2">Localização Especializada</h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                Localize telefones celulares recentes, e-mails comerciais, endereços declarados e históricos completos de vínculos societários.
              </p>
            </div>

            {/* Capability 2 */}
            <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:border-purple-200 transition-all hover:-translate-y-1 group">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-500 mb-5 group-hover:scale-105 transition-transform">
                <Smartphone className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#1e293b] mb-2">Validação Operacional na Hora</h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                Higienize e separe apenas as linhas de telefone realmente ativas e portadoras de WhatsApp antes que seus consultores realizem as ligações.
              </p>
            </div>

            {/* Capability 3 */}
            <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:border-purple-200 transition-all hover:-translate-y-1 group">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#00ccff] mb-5 group-hover:scale-105 transition-transform">
                <Database className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#1e293b] mb-2">Enriquecimento Cadastral em Lote</h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                Higienize listas inteiras de contatos em segundos. Envie planilhas em CSV ou Excel e receba de volta limpas, tratadas e reestruturadas.
              </p>
            </div>

            {/* Capability 4 */}
            <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:border-purple-200 transition-all hover:-translate-y-1 group">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center text-[#9900ff] mb-5 group-hover:scale-105 transition-transform">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#1e293b] mb-2">REST API Robustas</h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                Realize consultas estruturadas integrando a plataforma Energiza direto na esteira de seu CRM, ERP, discador de cobrança ou landing pages.
              </p>
            </div>

            {/* Capability 5 */}
            <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:border-purple-200 transition-all hover:-translate-y-1 group">
              <div className="w-12 h-12 rounded-2xl bg-pink-50 border border-pink-100 flex items-center justify-center text-[#ff00cc] mb-5 group-hover:scale-105 transition-transform">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#1e293b] mb-2">Indicativos de Renda e Vínculos</h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                Mapeie score de renda presumida, sócios e participações em empresas para focar seus esforços comerciais nas contas de alto potencial.
              </p>
            </div>

            {/* Capability 6 */}
            <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:border-purple-200 transition-all hover:-translate-y-1 group">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-500 mb-5 group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#1e293b] mb-2">Adequação de Governança</h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                Garantia legal sob conformidade da LGPD por legítimo interesse e proteção ao crédito, mantendo sua empresa protegida contra sanções judiciais.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ICP Sector-Specific Directional Blocks */}
      <section id="icp_grid" className="py-20 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-[#9900ff] bg-purple-100 px-3 py-1 rounded-full border border-purple-200">
              SOLUÇÕES POR SEGMENTO
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1e293b]">
              Selecione o seu setor e acesse a inteligência sob medida
            </h2>
            <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
              Desenvolvemos landing pages dedicadas com lógicas, regras e relatórios focados nas dores particulares de cada segmento operacional.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {icpList.map((icp) => (
              <div 
                key={icp.slug}
                className="bg-slate-50 border border-slate-100 hover:border-purple-200 rounded-3xl p-6 flex flex-col justify-between transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/5 group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-white text-slate-600 border border-slate-200">
                      {icp.sector}
                    </span>
                    <span className="text-xs font-extrabold text-[#ff00cc] font-mono">
                      {icp.socialProof[0]?.metric || 'Alta Assertividade'}
                    </span>
                  </div>

                  <h3 className="text-lg font-extrabold text-[#1e293b] mb-2 group-hover:text-[#9900ff] transition-colors">
                    {icp.name}
                  </h3>

                  <p className="text-xs text-slate-500 leading-relaxed mb-6 line-clamp-3">
                    {icp.subheadline}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-200/60">
                  <button
                    onClick={() => {
                      trackEvent('icp_card_click', { icp_slug: icp.slug, icp_name: icp.name });
                      onSelectICP(icp.slug);
                    }}
                    className="w-full py-3 px-4 rounded-xl bg-white hover:bg-gradient-to-r hover:from-[#ff00cc] hover:via-[#9900ff] hover:to-[#00ccff] hover:text-white border border-slate-200 hover:border-transparent text-slate-700 text-xs font-bold transition-all flex items-center justify-center gap-2"
                  >
                    <span>Ver Inteligência para {icp.sector.split('&')[0]}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Attributes Showcase Section */}
      <section className="py-20 bg-[#fafafa] border-t border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-[#9900ff] bg-purple-100 px-3 py-1 rounded-full border border-purple-200">
              DADOS QUE A PLATAFORMA TRAZ
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1e293b]">
              Atributos para Enriquecimento Cadastral
            </h2>
            <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
              Descubra a rica gama de dados que nossa plataforma robusta pode recuperar para qualificar sua base de clientes, dividida de acordo com a sua necessidade.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-sm space-y-8">
            {/* Info Notice Box */}
            <div className="bg-sky-50/70 border-l-4 border-sky-400 p-4 rounded-r-2xl flex items-start gap-3">
              <Info className="w-5 h-5 text-sky-500 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-sky-900">Como funciona o enriquecimento?</h4>
                <p className="text-xs text-sky-800 leading-relaxed">
                  Em função do perfil do seu arquivo (pessoa física ou jurídica) e de sua necessidade, você seleciona os atributos desejados. Nem sempre é possível enriquecer todos os campos para 100% dos registros, mas nosso motor de inteligência realiza a melhor busca em múltiplos birôs oficiais simultaneamente.
                </p>
              </div>
            </div>

            {/* Tab Controls and Search Bar */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between border-b border-slate-100 pb-6">
              <div className="flex bg-slate-100 p-1.5 rounded-xl gap-1 w-full sm:w-auto">
                <button
                  onClick={() => {
                    setActiveAttrTab('pf');
                    trackEvent('attr_tab_click', { tab: 'pf' });
                  }}
                  className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold transition-all ${
                    activeAttrTab === 'pf'
                      ? 'bg-white text-[#9900ff] shadow-sm'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <User className="w-4 h-4" />
                  <span>Pessoa Física</span>
                </button>
                <button
                  onClick={() => {
                    setActiveAttrTab('pj');
                    trackEvent('attr_tab_click', { tab: 'pj' });
                  }}
                  className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold transition-all ${
                    activeAttrTab === 'pj'
                      ? 'bg-white text-[#9900ff] shadow-sm'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Building2 className="w-4 h-4" />
                  <span>Pessoa Jurídica</span>
                </button>
              </div>

              {/* Search input */}
              <div className="relative w-full sm:max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Pesquisar atributos..."
                  value={attributesSearch}
                  onChange={(e) => setAttributesSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent text-xs"
                />
              </div>
            </div>

            {/* Dynamic Interactive Attribute Grid */}
            <div className="grid md:grid-cols-2 gap-8">
              {(activeAttrTab === 'pf' ? pfCategories : pjCategories).map((category, catIdx) => {
                // Filter items based on search
                const filteredItems = category.items.filter(item =>
                  item.name.toLowerCase().includes(attributesSearch.toLowerCase()) ||
                  item.desc.toLowerCase().includes(attributesSearch.toLowerCase())
                );

                if (filteredItems.length === 0) return null;

                const colorClasses = 
                  category.color === 'purple' ? { border: 'border-purple-100', bg: 'bg-purple-50', text: 'text-purple-600', badge: 'bg-purple-50 text-purple-700' } :
                  category.color === 'pink' ? { border: 'border-pink-100', bg: 'bg-pink-50', text: 'text-pink-600', badge: 'bg-pink-50 text-pink-700' } :
                  category.color === 'emerald' ? { border: 'border-emerald-100', bg: 'bg-emerald-50', text: 'text-emerald-500', badge: 'bg-emerald-50 text-emerald-700' } :
                  { border: 'border-blue-100', bg: 'bg-blue-50', text: 'text-blue-600', badge: 'bg-blue-50 text-blue-700' };

                return (
                  <div key={catIdx} className="bg-slate-50/50 border border-slate-100 rounded-2xl p-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`p-2 rounded-xl ${colorClasses.bg} ${colorClasses.text}`}>
                          {category.title === "Dados Cadastrais" && <User className="w-4 h-4" />}
                          {category.title === "Dados de Contato" && <Phone className="w-4 h-4" />}
                          {category.title === "Dados Socioeconômicos" && <Briefcase className="w-4 h-4" />}
                          {category.title === "Pessoas Relacionadas" && <Network className="w-4 h-4" />}
                          {category.title === "Dados de Contato da Empresa" && <Phone className="w-4 h-4" />}
                          {category.title === "Quadro Societário (QSA)" && <Users className="w-4 h-4" />}
                          {category.title === "Dados de Contato dos Sócios" && <UserCheck className="w-4 h-4" />}
                        </div>
                        <h3 className="text-sm font-bold text-[#1e293b]">{category.title}</h3>
                      </div>
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${colorClasses.badge}`}>
                        {filteredItems.length} {filteredItems.length === 1 ? 'atributo' : 'atributos'}
                      </span>
                    </div>

                    <div className="grid gap-3.5 pt-1">
                      {filteredItems.map((item, itemIdx) => (
                        <div key={itemIdx} className="bg-white border border-slate-100 rounded-xl p-3 flex items-start gap-3 shadow-sm hover:border-slate-200 transition-colors">
                          <div className={`mt-0.5 p-1 rounded-full bg-slate-100 ${colorClasses.text}`}>
                            <Check className="w-3 h-3" />
                          </div>
                          <div className="space-y-0.5">
                            <h4 className="text-xs font-bold text-slate-800">{item.name}</h4>
                            <p className="text-[10px] text-slate-500 leading-relaxed">{item.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Platform callout preview banner */}
            <div className="bg-gradient-to-r from-[#9900ff]/5 via-pink-500/5 to-[#00ccff]/5 border border-purple-100 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center sm:text-left">
                <h4 className="text-sm font-bold text-slate-800 flex items-center justify-center sm:justify-start gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#ff00cc]" />
                  <span>Precisa de uma estrutura de dados customizada?</span>
                </h4>
                <p className="text-xs text-slate-500">
                  Nossa equipe técnica ajuda a desenhar layouts exclusivos para atender ao sistema de sua empresa.
                </p>
              </div>
              <button
                onClick={() => scrollToLeadForm()}
                className="px-5 py-3 rounded-xl bg-gradient-to-r from-[#ff00cc] via-[#9900ff] to-[#00ccff] text-white text-xs font-black uppercase tracking-wider shadow-sm transition-all hover:scale-105"
              >
                Solicitar Cotação Pré-Paga
              </button>
            </div>

          </div>

        </div>
      </section>

      {/* Humanized Consultative Differentiation & Human Support Profile Card */}
      <section id="diferenciais" className="py-20 bg-slate-50 border-t border-slate-100 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs font-bold uppercase tracking-widest text-[#9900ff] bg-purple-100 px-3 py-1 rounded-full border border-purple-200">
                ATENDIMENTO REAL & CONSULTIVO
              </span>

              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1e293b] leading-tight">
                Diga adeus a painéis automatizados frios e robôs de suporte lentos
              </h2>

              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                Na Energiza Soluções, nós acreditamos que inteligência de dados requer sensibilidade comercial humana. Por isso, oferecemos consultoria gratuita para desenhar a melhor regra de higienização para a realidade de sua empresa.
              </p>

              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm animate-fade-in">
                  <div className="p-2.5 rounded-xl bg-purple-50 text-[#9900ff] shrink-0">
                    <BotOff className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#1e293b]">Sem Fila de Robôs Inúteis</h4>
                    <p className="text-xs text-slate-500 mt-1">Converse de pessoa para pessoa no WhatsApp. Sem assistentes virtuais de respostas prontas.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm animate-fade-in">
                  <div className="p-2.5 rounded-xl bg-pink-50 text-[#ff00cc] shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#1e293b]">Ativação Imediata da Conta</h4>
                    <p className="text-xs text-slate-500 mt-1">Setup em menos de 10 minutos feito em conjunto com nossa gerente de sucesso do cliente.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm animate-fade-in">
                  <div className="p-2.5 rounded-xl bg-blue-50 text-[#00ccff] shrink-0">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#1e293b]">Consultoria Gratuita de Base</h4>
                    <p className="text-xs text-slate-500 mt-1">Analisamos uma planilha de amostra sem custo para recomendar as melhores fontes de enriquecimento.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Approachable Calculator Widget */}
            <div id="simulador" className="lg:col-span-6 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xl shadow-purple-500/5">
              <div className="space-y-4 pb-6 border-b border-slate-100">
                <div className="flex items-center gap-2 text-[#9900ff]">
                  <BarChart3 className="w-5 h-5" />
                  <span className="text-xs font-mono font-bold uppercase tracking-wider">Simulador de Impacto Cadastral</span>
                </div>
                <h3 className="text-xl font-extrabold text-[#1e293b]">
                  Calcule a eficiência que podemos trazer para sua equipe
                </h3>
                <p className="text-xs text-slate-500">
                  Deslize para ajustar o volume de fichas ou devedores processados por mês e veja a economia gerada de tempo e ligações perdidas.
                </p>
              </div>

              <div className="py-6 space-y-6">
                <div>
                  <div className="flex justify-between items-center text-xs font-bold mb-2 text-slate-700">
                    <span>Base de Clientes/Mês:</span>
                    <span className="text-[#9900ff] text-sm font-extrabold">{dbVolume.toLocaleString('pt-BR')} registros</span>
                  </div>
                  <input
                    type="range"
                    min="5000"
                    max="200000"
                    step="5000"
                    value={dbVolume}
                    onChange={(e) => setDbVolume(Number(e.target.value))}
                    className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-[#9900ff]"
                  />
                  <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                    <span>5.000</span>
                    <span>100.000</span>
                    <span>200.000+</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <div>
                    <span className="text-[11px] text-slate-400 block mb-1">Contatos Úteis Obtidos:</span>
                    <span className="text-2xl font-black text-emerald-600 font-mono">
                      ~{calculatedValidNumbers.toLocaleString('pt-BR')}
                    </span>
                    <span className="text-[10px] text-slate-500 block mt-0.5">Telefones ativos garantidos</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 block mb-1">Economia Operacional:</span>
                    <span className="text-2xl font-black text-[#ff00cc] font-mono">
                      R$ {calculatedSavings.toLocaleString('pt-BR')}
                    </span>
                    <span className="text-[10px] text-slate-500 block mt-0.5">Em infra e horas de discagem</span>
                  </div>
                </div>

                <button
                  onClick={() => scrollToLeadForm()}
                  className="w-full py-4.5 rounded-xl bg-gradient-to-r from-[#ff00cc] via-[#9900ff] to-[#00ccff] text-white font-extrabold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-sm"
                >
                  <span>Solicitar Orçamento Pré-Pago</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Social Proof & Trust Badges Section */}
      <section id="depoimentos" className="py-20 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-[#9900ff] bg-purple-100 px-3 py-1 rounded-full border border-purple-200">
              DEPOIMENTOS DE CLIENTES
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1e293b]">
              Quem já transformou sua operação com a Energiza Soluções
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            
            {/* Case 1 */}
            <div className="bg-slate-50 border border-slate-100 p-6 rounded-3xl space-y-4 shadow-sm flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Sparkles key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-slate-600 italic leading-relaxed">
                  "Reduzimos em mais de 60% as chamadas caídas e números inválidos. A consultoria em lote da Energiza mudou completamente a taxa de reversão da nossa carteira de devedores."
                </p>
              </div>
              <div className="pt-4 border-t border-slate-200/60 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-800">Demais Crédito</p>
                  <p className="text-[10px] text-slate-500">Recuperação de Cobrança</p>
                </div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full font-mono">
                  +87,9% CPC
                </span>
              </div>
            </div>

            {/* Case 2 */}
            <div className="bg-slate-50 border border-slate-100 p-6 rounded-3xl space-y-4 shadow-sm flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex gap-1 text-[#ff00cc]">
                  {[...Array(5)].map((_, i) => (
                    <Sparkles key={i} className="w-4 h-4 fill-[#ff00cc] text-[#ff00cc]" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-slate-600 italic leading-relaxed">
                  "Integramos as consultas de CPF via API de forma extremamente rápida. Validamos fiadores e proponentes em segundos, reduzindo sinistros e tempo de análise."
                </p>
              </div>
              <div className="pt-4 border-t border-slate-200/60 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-800">Sicredi Vanguarda</p>
                  <p className="text-[10px] text-slate-500">Cooperativa de Crédito</p>
                </div>
                <span className="text-xs font-bold text-purple-700 bg-purple-100 px-2.5 py-1 rounded-full font-mono">
                  +35% Conversão
                </span>
              </div>
            </div>

            {/* Case 3 */}
            <div className="bg-slate-50 border border-slate-100 p-6 rounded-3xl space-y-4 shadow-sm flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex gap-1 text-[#00ccff]">
                  {[...Array(5)].map((_, i) => (
                    <Sparkles key={i} className="w-4 h-4 fill-[#00ccff] text-[#00ccff]" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-slate-600 italic leading-relaxed">
                  "Higienizamos milhares de contatos antigos para campanhas de reativação de vendas por WhatsApp. O retorno comercial cobriu os custos no primeiro dia de disparos."
                </p>
              </div>
              <div className="pt-4 border-t border-slate-200/60 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-800">Lojas Bem Viver</p>
                  <p className="text-[10px] text-slate-500">Varejo de Confecções</p>
                </div>
                <span className="text-xs font-bold text-cyan-700 bg-cyan-100 px-2.5 py-1 rounded-full font-mono">
                  12x ROI Médio
                </span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Human Onboarding Team Intro Card */}
      <section className="py-12 bg-[#f1f5f9] border-t border-b border-slate-200/60">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-center gap-6">
            <div className="flex -space-x-3 shrink-0">
              <img 
                src="/src/assets/images/consultant_portrait_1785257420340.jpg" 
                alt="Marcelo Silva - Energiza"
                className="w-16 h-16 rounded-full object-cover border-2 border-white ring-2 ring-[#9900ff]"
                referrerPolicy="no-referrer"
              />
              <img 
                src="/src/assets/images/onboarding_specialist_1785257437990.jpg" 
                alt="Ana Souza - Energiza"
                className="w-16 h-16 rounded-full object-cover border-2 border-white ring-2 ring-[#ff00cc]"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="space-y-2 text-center md:text-left flex-1">
              <h3 className="text-base font-extrabold text-[#1e293b]">Time de Implantação e Sucesso da Energiza</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Aqui você não está sozinho. O Marcelo e a Ana acompanham sua conta pessoalmente, auxiliam a formatar suas planilhas em lote e validam se a integração via API está extraindo o maior score cadastral possível.
              </p>
            </div>
            <button
              onClick={() => handleConsultantWhatsApp('onboarding_team_cta', 'Marcelo e Ana')}
              className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold tracking-wide transition-all flex items-center gap-2 shadow-sm shrink-0"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Chamar no WhatsApp</span>
            </button>
          </div>
        </div>
      </section>

      {/* Conversion Form Area with Brand Matching and Identity Details */}
      <section id="lead_capture_section" className="py-20 relative bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200/80 rounded-3xl p-6 sm:p-10 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#9900ff]/5 rounded-full blur-3xl pointer-events-none"></div>

            <div className="text-center space-y-3 mb-8">
              <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#9900ff] bg-purple-100 px-3 py-1 rounded-full border border-purple-200">
                <Sparkles className="w-3.5 h-3.5 text-[#ff00cc]" />
                SOLICITAÇÃO DE PROPOSTA COMERCIAL
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1e293b]">
                Solicite uma cotação para o seu lote de dados
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto leading-relaxed">
                Nossos consultores retornarão com uma tabela de valores customizada para a modalidade pré-paga e orientarão o processamento dos seus dados.
              </p>
            </div>

            {/* Embedded LeadForm with brand matching colors passed down */}
            <LeadForm 
              key={selectedIcpForForm}
              icpSlug={selectedIcpForForm}
              onLeadCaptured={onLeadCaptured}
              themeColor={{
                primary: 'bg-gradient-to-r from-[#ff00cc] via-[#9900ff] to-[#00ccff] hover:opacity-95',
                primaryHover: 'hover:opacity-95',
                borderAccent: 'border-purple-300',
                ringAccent: 'ring-[#9900ff]',
              }}
            />

            <div className="mt-8 pt-6 border-t border-slate-200 text-center flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#9900ff]" />
                <span>E-mail Direto: <a href="mailto:giza@energizasolucoes.com" className="hover:underline font-bold text-[#9900ff]">giza@energizasolucoes.com</a></span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-500" />
                <span>Contato Central: <strong>(41) 99716-2138</strong></span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section id="faq" className="py-20 bg-slate-50 border-t border-slate-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-[#9900ff] bg-purple-100 px-3 py-1 rounded-full border border-purple-200">
              DÚVIDAS SOBRE DADOS
            </span>
            <h2 className="text-3xl font-extrabold text-[#1e293b]">Perguntas Frequentes sobre a Higienização</h2>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "Como funciona a contratação na modalidade pré-paga?",
                a: "Na Energiza Soluções, você não fica preso a contratos mensais abusivos de longo prazo. Você adquire créditos sob demanda de forma pré-paga. Conforme realiza as consultas em lote ou via API, os créditos são consumidos de forma justa e transparente."
              },
              {
                q: "A Energiza Soluções opera de acordo com as diretrizes da LGPD?",
                a: "Sim. Nossas consultas e relatórios respeitam rigorosamente a Lei Geral de Proteção de Dados (Lei nº 13.709/2018). Atuamos respaldados pela base legal de proteção ao crédito (Art. 11, II, 'd') e legítimo interesse corporativo, garantindo total conformidade."
              },
              {
                q: "Quais informações eu recebo em cada CPF consultado?",
                a: "O relatório completo retorna: telefones ativos recentes, indicação de presença de WhatsApp, e-mails prováveis, renda presumida detalhada, endereço de correspondência atualizado e potenciais parentescos de primeiro grau."
              },
              {
                q: "Como integro a API no meu discador ou CRM de vendas?",
                a: "Nossa documentação de API REST é extremamente simples. Você recebe uma chave token e pode fazer requisições HTTP GET/POST para CPF ou CNPJ em menos de 10 linhas de código no seu sistema atual."
              }
            ].map((item, idx) => (
              <div 
                key={idx}
                className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm transition-all"
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="w-full text-left p-5 text-sm font-bold text-slate-800 flex items-center justify-between gap-4 hover:text-[#9900ff] transition-colors"
                >
                  <span>{item.q}</span>
                  <ChevronRight className={`w-4 h-4 shrink-0 transition-transform ${activeFaq === idx ? 'rotate-90 text-[#9900ff]' : 'text-slate-400'}`} />
                </button>
                {activeFaq === idx && (
                  <div className="px-5 pb-5 text-xs text-slate-500 leading-relaxed border-t border-slate-50 pt-3">
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200/80 py-12 text-slate-500 text-xs shadow-inner">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-3 md:col-span-1">
              <EnergizaLogo size="sm" />
              <p className="text-xs text-slate-400 leading-relaxed">
                Inteligência de dados cadastrais, localização de devedores e validação real-time sob regras da LGPD.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-[#1e293b] uppercase tracking-wider mb-3 text-[10px]">Segmentos Atendidos</h4>
              <ul className="space-y-2">
                {icpList.map(icp => (
                  <li key={icp.slug}>
                    <button 
                      onClick={() => onSelectICP(icp.slug)}
                      className="hover:text-[#9900ff] transition-colors text-left"
                    >
                      {icp.sector}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-[#1e293b] uppercase tracking-wider mb-3 text-[10px]">Contatos Rápidos</h4>
              <div className="space-y-2">
                <p><strong>E-mail:</strong> <a href="mailto:giza@energizasolucoes.com" className="hover:underline font-bold text-[#1e293b]">giza@energizasolucoes.com</a></p>
                <p><strong>Telefone/WhatsApp:</strong> (41) 99716-2138</p>
                <p><strong>Sede:</strong> Curitiba - PR • Brasil</p>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-[#1e293b] uppercase tracking-wider mb-3 text-[10px]">Conformidade & Suporte</h4>
              <p className="leading-relaxed mb-3">
                Operamos com total transparência de dados e segurança da informação em conformidade com a LGPD (Art. 11, II).
              </p>
              <a
                href="mailto:giza@energizasolucoes.com"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-[#9900ff] hover:text-[#ff00cc] text-xs font-bold transition-all"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Falar via E-mail Comercial</span>
              </a>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <p>© {new Date().getFullYear()} Energiza Soluções Inteligentes Ltda. Todos os direitos reservados.</p>
            <p className="font-mono text-[10px] text-slate-400">Curitiba - PR • CNPJ 53.489.112/0001-90</p>
          </div>
        </div>
      </footer>

      {/* Floating Quick Contact Bar */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col sm:flex-row items-end sm:items-center gap-2.5">
        <button
          onClick={() => scrollToLeadForm()}
          className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-2.5 px-4 rounded-full shadow-2xl border border-slate-700 flex items-center gap-2 transition-all cursor-pointer transform hover:scale-105"
        >
          <Sparkles className="w-4 h-4 text-[#ff00cc]" />
          <span>Formulário de Cotação</span>
        </button>

        <button
          onClick={() => handleConsultantWhatsApp('floating_bar', 'Marcelo')}
          className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold py-2.5 px-4 rounded-full shadow-2xl flex items-center gap-2 transition-all cursor-pointer transform hover:scale-105"
        >
          <MessageSquare className="w-4 h-4" />
          <span>Atendimento WhatsApp (41) 99716-2138</span>
        </button>
      </div>
    </div>
  );
}
