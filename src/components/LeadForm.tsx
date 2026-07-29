import React, { useState, useRef } from 'react';
import { Lead, ICPKey } from '../types';
import { Sparkles, ArrowRight, ShieldCheck, CheckCircle, Phone, MessageSquare } from 'lucide-react';

interface LeadFormProps {
  key?: React.Key;
  icpSlug: ICPKey;
  themeColor?: {
    primary: string;
    primaryHover: string;
    borderAccent: string;
    ringAccent: string;
  };
  title?: string;
  subtitle?: string;
  onLeadCaptured: (lead: Lead) => void;
  onGTMEvent?: (eventName: string, elementId: string, metadata?: any) => void;
}

export default function LeadForm({ 
  icpSlug, 
  themeColor = {
    primary: 'bg-amber-600',
    primaryHover: 'hover:bg-amber-700',
    borderAccent: 'border-amber-500',
    ringAccent: 'ring-amber-500',
  }, 
  title = 'Fale com um Especialista',
  subtitle = 'Insira seus dados comerciais para obter uma proposta e tabela de valores pré-pagos.',
  onLeadCaptured, 
  onGTMEvent 
}: LeadFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    role: '',
    volume: '6000',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const successRef = useRef<HTMLDivElement>(null);

  // Phone Masking
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 11) value = value.slice(0, 11);

    if (value.length > 10) {
      value = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7)}`;
    } else if (value.length > 6) {
      value = `(${value.slice(0, 2)}) ${value.slice(2, 6)}-${value.slice(6)}`;
    } else if (value.length > 2) {
      value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
    } else if (value.length > 0) {
      value = `(${value.slice(0, 2)}`;
    }
    
    setFormData(prev => ({ ...prev, phone: value }));
    if (errors.phone) setErrors(prev => ({ ...prev, phone: '' }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));

    // Live GTM Tracking for typing start/interaction
    if (value.length === 1 && onGTMEvent) {
      onGTMEvent(`form_interaction_${icpSlug}`, `input_${name}`, { field: name });
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Nome completo é obrigatório';
    
    if (!formData.email.trim()) {
      newErrors.email = 'E-mail corporativo é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'E-mail inválido';
    } else {
      const publicDomains = ['gmail.com', 'outlook.com', 'hotmail.com', 'yahoo.com', 'uol.com.br', 'bol.com.br'];
      const domain = formData.email.trim().split('@')[1]?.toLowerCase();
      if (domain && publicDomains.includes(domain)) {
        newErrors.email_warning = 'Recomendamos usar seu e-mail corporativo para liberação rápida de testes.';
      }
    }

    const cleanPhone = formData.phone.replace(/\D/g, '');
    if (!cleanPhone) {
      newErrors.phone = 'Telefone é obrigatório';
    } else if (cleanPhone.length < 10) {
      newErrors.phone = 'Insira um telefone válido com DDD (mínimo 10 dígitos)';
    }

    if (!formData.company.trim()) newErrors.company = 'Nome da empresa é obrigatório';
    if (!formData.role) newErrors.role = 'Selecione seu cargo';

    setErrors(newErrors);
    return Object.keys(newErrors).filter(k => k !== 'email_warning').length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onGTMEvent) onGTMEvent(`form_submit_attempt_${icpSlug}`, 'btn_enviar_lead');

    if (!validate()) {
      if (onGTMEvent) onGTMEvent(`form_validation_error_${icpSlug}`, 'form_errors');
      if (formRef.current) {
        formRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setIsSubmitting(true);

    const segmentName = icpSlug === 'cobranca' ? 'Assessoria de Cobrança' 
      : icpSlug === 'instituicoes-financeiras' ? 'Instituições Financeiras'
      : icpSlug === 'varejo' ? 'Varejo'
      : icpSlug === 'educacao' ? 'Educação'
      : icpSlug === 'logistica' ? 'Logística'
      : icpSlug === 'advogados' ? 'Escritórios de Advocacia'
      : icpSlug;

    const whatsappText = `Olá! Acabei de me cadastrar no site da Energiza Soluções.\n\n` +
      `*Nome:* ${formData.name}\n` +
      `*E-mail:* ${formData.email}\n` +
      `*Telefone:* ${formData.phone}\n` +
      `*Empresa:* ${formData.company}\n` +
      `*Cargo:* ${formData.role || 'Não Informado'}\n` +
      `*Segmento:* ${segmentName}\n` +
      `*Volume de Consultas:* ${formData.volume === '6000' ? 'Até 6 mil/mês' : formData.volume === '15000' ? '6 mil a 20 mil/mês' : 'Acima de 20 mil/mês'}\n\n` +
      `Gostaria de solicitar uma proposta personalizada para a modalidade pré-paga!`;

    const whatsappUrl = `https://api.whatsapp.com/send?phone=5541997162138&text=${encodeURIComponent(whatsappText)}`;

    // Quick feedback transition
    setTimeout(() => {
      const newLead: Lead = {
        id: 'lead_' + Math.random().toString(36).substr(2, 9),
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        company: formData.company.trim(),
        icp: icpSlug,
        volume: formData.volume === '6000' ? '6.000 consultas (Plano Inicial)' : formData.volume === '15000' ? '15.000 consultas (Plano Intermediário)' : 'API Enterprise (Volume Customizado)',
        timestamp: new Date().toISOString(),
        status: 'Pendente',
      };

      // Save lead to local storage
      try {
        const existingLeads = JSON.parse(localStorage.getItem('energiza_leads') || '[]');
        localStorage.setItem('energiza_leads', JSON.stringify([newLead, ...existingLeads]));
      } catch (err) {
        console.error('Error saving lead to cache:', err);
      }

      // Send lead details email via PHP script
      fetch('/send_lead.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newLead.name,
          email: newLead.email,
          phone: newLead.phone,
          company: newLead.company,
          role: formData.role,
          icp: icpSlug,
          volume: newLead.volume
        })
      })
      .then(response => {
        if (!response.ok) {
          console.error('Error sending lead email:', response.statusText);
        }
      })
      .catch(err => {
        console.error('Network error sending lead email:', err);
      });

      try {
        if (onLeadCaptured) onLeadCaptured(newLead);
      } catch (err) {
        console.error('Error executing onLeadCaptured callback:', err);
      }

      try {
        if (onGTMEvent) {
          onGTMEvent(`form_submit_success_${icpSlug}`, 'form_container', { 
            company: formData.company,
            copy_sent_to: 'giza@energizasolucoes.com'
          });
        }
      } catch (err) {
        console.error('Error executing onGTMEvent callback:', err);
      }

      setIsSubmitting(false);
      setIsSuccess(true);

      // Scroll smoothly to success block
      setTimeout(() => {
        if (successRef.current) {
          successRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    }, 400);
  };

  if (isSuccess) {
    const segmentName = icpSlug === 'cobranca' ? 'Assessoria de Cobrança' 
      : icpSlug === 'instituicoes-financeiras' ? 'Instituições Financeiras'
      : icpSlug === 'varejo' ? 'Varejo'
      : icpSlug === 'educacao' ? 'Educação'
      : icpSlug === 'logistica' ? 'Logística'
      : icpSlug === 'advogados' ? 'Escritórios de Advocacia'
      : icpSlug;

    const whatsappText = `Olá! Acabei de me cadastrar no site da Energiza Soluções.\n\n` +
      `*Nome:* ${formData.name}\n` +
      `*E-mail:* ${formData.email}\n` +
      `*Telefone:* ${formData.phone}\n` +
      `*Empresa:* ${formData.company}\n` +
      `*Cargo:* ${formData.role || 'Não Informado'}\n` +
      `*Segmento:* ${segmentName}\n` +
      `*Volume de Consultas:* ${formData.volume === '6000' ? 'Até 6 mil/mês' : formData.volume === '15000' ? '6 mil a 20 mil/mês' : 'Acima de 20 mil/mês'}\n\n` +
      `Gostaria de solicitar uma proposta personalizada para a modalidade pré-paga!`;

    const whatsappUrl = `https://api.whatsapp.com/send?phone=5541997162138&text=${encodeURIComponent(whatsappText)}`;

    return (
      <div 
        ref={successRef}
        id={`lead_success_${icpSlug}`} 
        className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-2xl text-center max-w-lg mx-auto animate-fadeIn space-y-5"
      >
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
          <CheckCircle size={36} />
        </div>
        
        <div>
          <h3 className="text-2xl font-sans font-bold text-slate-900 tracking-tight">Solicitação Enviada com Sucesso!</h3>
          <p className="text-xs sm:text-sm font-sans text-slate-600 mt-1">
            Obrigado, <strong className="text-slate-950">{formData.name}</strong>. Recebemos os dados comerciais de <strong className="text-slate-900">{formData.company}</strong>.
          </p>
        </div>

        {/* Summary card */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 text-left text-xs space-y-2">
          <div className="flex justify-between items-center pb-2 border-b border-slate-200/60">
            <span className="text-slate-500 font-medium">E-mail Cadastrado:</span>
            <span className="font-bold text-slate-800">{formData.email}</span>
          </div>
          <div className="flex justify-between items-center pb-2 border-b border-slate-200/60">
            <span className="text-slate-500 font-medium">Telefone:</span>
            <span className="font-bold text-slate-800">{formData.phone}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-500 font-medium">Segmento:</span>
            <span className="font-bold text-[#9900ff]">{segmentName}</span>
          </div>
        </div>

        {/* Dispatch notification */}
        <div className="bg-indigo-50/80 border border-indigo-100 rounded-xl p-3 text-left flex items-start gap-2.5">
          <div className="p-1 bg-indigo-100 text-indigo-700 rounded mt-0.5 shrink-0">
            <Sparkles size={14} />
          </div>
          <p className="text-[11px] text-indigo-900 leading-relaxed font-medium">
            Uma cópia completa da solicitação foi registrada no banco de dados e enviada para a central de atendimento (<strong>giza@energizasolucoes.com</strong>).
          </p>
        </div>

        {/* Main WhatsApp CTA & Direct Email CTA */}
        <div className="space-y-3 pt-2">
          <a
            id={`btn_whatsapp_redirect_${icpSlug}`}
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
              if (onGTMEvent) onGTMEvent(`whatsapp_redirect_click_${icpSlug}`, 'btn_whatsapp_redirect');
            }}
            className="w-full py-4 px-5 font-sans font-extrabold text-white rounded-xl bg-emerald-600 hover:bg-emerald-700 transition-all duration-300 shadow-lg shadow-emerald-200/50 flex items-center justify-center gap-2.5 cursor-pointer text-sm transform hover:scale-[1.01]"
          >
            <MessageSquare size={18} />
            <span>Falar Agora no WhatsApp com o Consultor</span>
          </a>

          <a
            href={`mailto:giza@energizasolucoes.com?subject=Solicitação de Proposta Comercial - ${encodeURIComponent(formData.company)}&body=${encodeURIComponent(whatsappText)}`}
            className="w-full py-3 px-4 font-sans font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl transition-all flex items-center justify-center gap-2 text-xs"
          >
            <span>Enviar E-mail para giza@energizasolucoes.com</span>
          </a>

          <button
            id={`btn_reset_form_${icpSlug}`}
            onClick={() => {
              setIsSuccess(false);
              setFormData({ name: '', email: '', phone: '', company: '', role: '', volume: '6000' });
              if (onGTMEvent) onGTMEvent(`form_reset_${icpSlug}`, 'btn_reset_form');
            }}
            className="w-full py-2.5 px-4 font-sans font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all text-xs cursor-pointer"
          >
            Enviar Outra Solicitação
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      ref={formRef}
      id={`form_lead_capture_${icpSlug}`}
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-4 max-w-lg mx-auto"
    >
      <div className="mb-4 text-center sm:text-left">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-sans font-bold bg-purple-50 text-[#9900ff] border border-purple-100 mb-2">
          <Sparkles size={12} className="text-[#ff00cc]" /> Modalidade Pré-Paga Flexível
        </span>
        <h3 className="text-xl font-sans font-extrabold text-slate-900 tracking-tight">{title}</h3>
        <p className="text-xs font-sans text-slate-500 mt-1 leading-relaxed">{subtitle}</p>
      </div>

      <div className="space-y-3.5">
        {/* Name */}
        <div>
          <label htmlFor={`input_name_${icpSlug}`} className="block text-xs font-sans font-semibold text-slate-700 mb-1">
            Nome Completo <span className="text-red-500">*</span>
          </label>
          <input
            id={`input_name_${icpSlug}`}
            type="text"
            name="name"
            placeholder="Seu nome completo"
            value={formData.name}
            onChange={handleInputChange}
            className={`w-full px-4 py-2.5 rounded-xl border ${errors.name ? 'border-red-500 bg-red-50/30' : 'border-slate-200'} focus:outline-none focus:ring-2 focus:ring-offset-1 ${themeColor.ringAccent} transition-all text-sm`}
          />
          {errors.name && <p className="text-xs text-red-500 mt-1 font-medium">{errors.name}</p>}
        </div>

        {/* Corporate Email */}
        <div>
          <label htmlFor={`input_email_${icpSlug}`} className="block text-xs font-sans font-semibold text-slate-700 mb-1">
            E-mail Corporativo <span className="text-red-500">*</span>
          </label>
          <input
            id={`input_email_${icpSlug}`}
            type="email"
            name="email"
            placeholder="exemplo@suaempresa.com.br"
            value={formData.email}
            onChange={handleInputChange}
            className={`w-full px-4 py-2.5 rounded-xl border ${errors.email ? 'border-red-500 bg-red-50/30' : 'border-slate-200'} focus:outline-none focus:ring-2 focus:ring-offset-1 ${themeColor.ringAccent} transition-all text-sm`}
          />
          {errors.email && <p className="text-xs text-red-500 mt-1 font-medium">{errors.email}</p>}
          {errors.email_warning && !errors.email && (
            <p className="text-[11px] text-amber-700 font-sans mt-1 bg-amber-50 p-2 rounded-lg border border-amber-200">
              {errors.email_warning}
            </p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label htmlFor={`input_phone_${icpSlug}`} className="block text-xs font-sans font-semibold text-slate-700 mb-1">
            Telefone Comercial com DDD <span className="text-red-500">*</span>
          </label>
          <input
            id={`input_phone_${icpSlug}`}
            type="tel"
            name="phone"
            placeholder="(41) 99999-9999"
            value={formData.phone}
            onChange={handlePhoneChange}
            className={`w-full px-4 py-2.5 rounded-xl border ${errors.phone ? 'border-red-500 bg-red-50/30' : 'border-slate-200'} focus:outline-none focus:ring-2 focus:ring-offset-1 ${themeColor.ringAccent} transition-all text-sm`}
          />
          {errors.phone && <p className="text-xs text-red-500 mt-1 font-medium">{errors.phone}</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* Company */}
          <div>
            <label htmlFor={`input_company_${icpSlug}`} className="block text-xs font-sans font-semibold text-slate-700 mb-1">
              Nome da Empresa <span className="text-red-500">*</span>
            </label>
            <input
              id={`input_company_${icpSlug}`}
              type="text"
              name="company"
              placeholder="Razão ou Nome Fantasia"
              value={formData.company}
              onChange={handleInputChange}
              className={`w-full px-4 py-2.5 rounded-xl border ${errors.company ? 'border-red-500 bg-red-50/30' : 'border-slate-200'} focus:outline-none focus:ring-2 focus:ring-offset-1 ${themeColor.ringAccent} transition-all text-sm`}
            />
            {errors.company && <p className="text-xs text-red-500 mt-1 font-medium">{errors.company}</p>}
          </div>

          {/* Role */}
          <div>
            <label htmlFor={`input_role_${icpSlug}`} className="block text-xs font-sans font-semibold text-slate-700 mb-1">
              Seu Cargo <span className="text-red-500">*</span>
            </label>
            <select
              id={`input_role_${icpSlug}`}
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              className={`w-full px-4 py-2.5 rounded-xl border ${errors.role ? 'border-red-500 bg-red-50/30' : 'border-slate-200'} focus:outline-none focus:ring-2 focus:ring-offset-1 ${themeColor.ringAccent} transition-all text-sm bg-white`}
            >
              <option value="">Selecione seu cargo...</option>
              <option value="Diretor / C-Level">Diretor / C-Level</option>
              <option value="Gerente de Operações">Gerente de Operações</option>
              <option value="Coordenador Financeiro">Coordenador Financeiro / Crédito</option>
              <option value="Analista de Cobrança / Cadastro">Analista de Cobrança / Cadastro</option>
              <option value="TI / Integrador de APIs">TI / Integrador de APIs</option>
              <option value="Outro">Outro cargo</option>
            </select>
            {errors.role && <p className="text-xs text-red-500 mt-1 font-medium">{errors.role}</p>}
          </div>
        </div>

        {/* Volume Select */}
        <div>
          <label htmlFor={`input_volume_${icpSlug}`} className="block text-xs font-sans font-semibold text-slate-700 mb-1">
            Volume Estimado de Consultas / Mês
          </label>
          <select
            id={`input_volume_${icpSlug}`}
            name="volume"
            value={formData.volume}
            onChange={handleInputChange}
            className={`w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-offset-1 ${themeColor.ringAccent} transition-all text-sm bg-white`}
          >
            <option value="6000">Até 6 mil consultas /mês (Plano Inicial)</option>
            <option value="15000">6 mil a 20 mil consultas /mês (Intermediário)</option>
            <option value="enterprise">Acima de 20 mil / Integração API Enterprise</option>
          </select>
        </div>
      </div>

      <div className="pt-2">
        <button
          id={`btn_submit_lead_${icpSlug}`}
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-4 px-5 rounded-xl text-white font-sans font-extrabold text-sm flex items-center justify-center gap-2 cursor-pointer transition-all duration-300 ${themeColor.primary} ${themeColor.primaryHover} disabled:opacity-75 disabled:cursor-not-allowed shadow-md hover:shadow-lg transform hover:scale-[1.01]`}
        >
          {isSubmitting ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>Processando Solicitação...</span>
            </>
          ) : (
            <>
              <span>Solicitar Cotação Pré-Paga</span>
              <ArrowRight size={16} />
            </>
          )}
        </button>
      </div>

      <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500 pt-1 text-center">
        <ShieldCheck size={14} className="text-emerald-600 shrink-0" />
        <span>Dados protegidos sob conformidade rigorosa da LGPD (Art. 11, II).</span>
      </div>
    </form>
  );
}

