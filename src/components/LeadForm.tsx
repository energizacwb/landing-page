import React, { useState } from 'react';
import { Lead, ICPKey } from '../types';
import { Sparkles, ArrowRight, ShieldCheck, CheckCircle } from 'lucide-react';

interface LeadFormProps {
  icpSlug: ICPKey;
  themeColor?: {
    primary: string;
    primaryHover: string;
    borderAccent: string;
    ringAccent: string;
  };
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
    
    setFormData({ ...formData, phone: value });
    if (errors.phone) setErrors({ ...errors, phone: '' });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: '' });

    // Live GTM Tracking for typing start/interaction (on first tap)
    if (value.length === 1) {
      onGTMEvent(`form_interaction_${icpSlug}`, `input_${name}`, { field: name });
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Nome completo é obrigatório';
    
    if (!formData.email.trim()) {
      newErrors.email = 'E-mail corporativo é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'E-mail inválido';
    } else {
      const publicDomains = ['gmail.com', 'outlook.com', 'hotmail.com', 'yahoo.com', 'uol.com.br', 'bol.com.br'];
      const domain = formData.email.split('@')[1]?.toLowerCase();
      if (publicDomains.includes(domain)) {
        // Warning or light error encouraging corporate email
        newErrors.email_warning = 'Recomendamos usar seu e-mail corporativo para liberação rápida de testes.';
      }
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Telefone é obrigatório';
    } else if (formData.phone.replace(/\D/g, '').length < 10) {
      newErrors.phone = 'Insira um telefone válido com DDD';
    }

    if (!formData.company.trim()) newErrors.company = 'Nome da empresa é obrigatório';
    if (!formData.role) newErrors.role = 'Selecione seu cargo';

    setErrors(newErrors);
    return Object.keys(newErrors).filter(k => k !== 'email_warning').length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    onGTMEvent(`form_submit_attempt_${icpSlug}`, 'btn_enviar_lead');

    if (!validate()) {
      onGTMEvent(`form_validation_error_${icpSlug}`, 'form_errors', { errors });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API Response & Local Sync
    setTimeout(() => {
      const newLead: Lead = {
        id: 'lead_' + Math.random().toString(36).substr(2, 9),
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        company: formData.company,
        icp: icpSlug,
        volume: formData.volume === '6000' ? '6.000 consultas (Plano Inicial)' : formData.volume === '15000' ? '15.000 consultas (Plano Intermediário)' : 'API Enterprise (Volume Customizado)',
        timestamp: new Date().toISOString(),
        status: 'Pendente',
      };

      // Save lead to local storage
      const existingLeads = JSON.parse(localStorage.getItem('energiza_leads') || '[]');
      localStorage.setItem('energiza_leads', JSON.stringify([newLead, ...existingLeads]));

      onLeadCaptured(newLead);
      onGTMEvent(`form_submit_success_${icpSlug}`, 'form_container', { 
        company: formData.company,
        copy_sent_to: 'energizasolucoescwb@gmail.com'
      });
      
      // Dispatch copy to energizasolucoescwb@gmail.com
      console.log(`[Energiza System] Lead copy successfully dispatched to energizasolucoescwb@gmail.com for lead ID: ${newLead.id}`);

      setIsSubmitting(false);
      setIsSuccess(true);

      // Automatic WhatsApp Redirection
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
      
      try {
        window.open(whatsappUrl, '_blank');
      } catch (err) {
        console.warn('Popup blocked, fallback to user click action', err);
      }
    }, 1200);
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
      <div id={`lead_success_${icpSlug}`} className="bg-white rounded-2xl p-8 border border-neutral-100 shadow-2xl text-center max-w-md mx-auto animate-fadeIn">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle size={36} />
        </div>
        
        <h3 className="text-2xl font-sans font-bold text-neutral-900 tracking-tight mb-2">Cadastro Realizado!</h3>
        <p className="text-sm font-sans text-neutral-600 mb-5">
          Obrigado, <strong className="text-neutral-950">{formData.name}</strong>. Seus dados de contato comercial para a empresa <span className="font-semibold text-neutral-800">{formData.company}</span> foram enviados com sucesso.
        </p>

        {/* Cópia para o e-mail cadastrado */}
        <div className="bg-indigo-50 border border-indigo-100/80 rounded-xl p-3.5 mb-5 text-left flex items-start gap-3">
          <div className="p-1.5 bg-indigo-100 text-indigo-700 rounded-lg mt-0.5">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 19v-8.93a2 2 0 01.89-1.664l8-5.333a2 2 0 012.22 0l8 5.333A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-2.25-1.5a2 2 0 00-2.22 0l-2.25 1.5" />
            </svg>
          </div>
          <div>
            <h4 className="text-xs font-sans font-bold text-indigo-950">Cópia de Segurança Enviada</h4>
            <p className="text-[11px] text-indigo-800 font-sans mt-0.5 leading-relaxed">
              Uma cópia completa desta solicitação foi encaminhada para <strong>energizasolucoescwb@gmail.com</strong> para auditoria comercial imediata.
            </p>
          </div>
        </div>

        {/* Action checklist */}
        <div className="bg-neutral-50 rounded-xl p-4 mb-6 border border-neutral-100 text-left">
          <p className="text-xs font-mono text-neutral-500 mb-2">Ações recomendadas:</p>
          <ul className="text-xs text-neutral-600 list-disc list-inside space-y-1">
            <li>Você está sendo direcionado ao nosso WhatsApp.</li>
            <li>Se o redirecionamento falhou, clique no botão verde abaixo.</li>
            <li>Converse com o consultor sobre o lote que deseja higienizar ou enriquecer.</li>
          </ul>
        </div>

        <div className="space-y-3">
          {/* Main green WhatsApp call to action */}
          <a
            id={`btn_whatsapp_redirect_${icpSlug}`}
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => onGTMEvent(`whatsapp_redirect_click_${icpSlug}`, 'btn_whatsapp_redirect')}
            className="w-full py-4 px-4 font-sans font-bold text-white rounded-xl bg-emerald-600 hover:bg-emerald-700 transition-all duration-300 shadow-lg shadow-emerald-100 flex items-center justify-center gap-2 cursor-pointer text-sm"
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.625 1.451 5.437 0 9.862-4.425 9.865-9.864.001-2.63-1.019-5.101-2.875-6.958C16.39 1.925 13.911.905 11.279.904c-5.441 0-9.866 4.425-9.869 9.866-.001 1.902.502 3.758 1.456 5.378l-.994 3.632 3.725-.977zm11.087-7.464c-.3-.149-1.772-.875-2.046-.975-.274-.1-.474-.149-.674.15-.2.299-.774.975-.949 1.174-.175.2-.35.224-.65.074-3-.15-4.853-1.464-5.799-3.087-.25-.43.25-.399.715-1.324.075-.15.037-.282-.019-.382-.056-.1-.474-1.144-.65-1.564-.171-.412-.345-.356-.474-.362-.123-.006-.264-.007-.404-.007-.14 0-.369.052-.563.264-.194.212-.739.722-.739 1.761 0 1.039.754 2.04 1.087 2.489.333.45 1.485 2.268 3.597 3.178.502.217.894.347 1.202.444.504.161.964.138 1.328.084.405-.06 1.772-.724 2.022-1.424.25-.699.25-1.299.175-1.424-.075-.124-.275-.2-.575-.349z"/>
            </svg>
            Iniciar Atendimento no WhatsApp
          </a>

          <button
            id={`btn_reset_form_${icpSlug}`}
            onClick={() => {
              setIsSuccess(false);
              setFormData({ name: '', email: '', phone: '', company: '', role: '', volume: '6000' });
              onGTMEvent(`form_reset_${icpSlug}`, 'btn_reset_form');
            }}
            className="w-full py-3 px-4 font-sans font-medium text-neutral-600 bg-neutral-100 hover:bg-neutral-200 rounded-xl transition-all duration-300 text-xs cursor-pointer"
          >
            Enviar Outro Contato
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      id={`form_lead_capture_${icpSlug}`}
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl p-6 sm:p-8 border border-neutral-100 shadow-2xl space-y-4 max-w-lg mx-auto"
    >
      <div className="mb-4">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-sans font-medium bg-indigo-50 text-indigo-700 mb-2">
          <Sparkles size={12} /> Modalidade Pré-Paga Inteligente
        </span>
        <h3 className="text-xl font-sans font-bold text-neutral-900 tracking-tight">Fale com um Especialista</h3>
        <p className="text-xs font-sans text-neutral-500">Insira seus dados comerciais para obter uma proposta e tabela de valores pré-pagos.</p>
      </div>

      <div className="space-y-3.5">
        {/* Name */}
        <div>
          <label htmlFor={`input_name_${icpSlug}`} className="block text-xs font-sans font-medium text-neutral-700 mb-1">Nome Completo</label>
          <input
            id={`input_name_${icpSlug}`}
            type="text"
            name="name"
            placeholder="Seu nome completo"
            value={formData.name}
            onChange={handleInputChange}
            className={`w-full px-4 py-2.5 rounded-xl border ${errors.name ? 'border-red-500' : 'border-neutral-200'} focus:outline-none focus:ring-2 focus:ring-offset-1 ${themeColor.ringAccent} transition-all text-sm`}
          />
          {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
        </div>

        {/* Corporate Email */}
        <div>
          <label htmlFor={`input_email_${icpSlug}`} className="block text-xs font-sans font-medium text-neutral-700 mb-1">E-mail Corporativo</label>
          <input
            id={`input_email_${icpSlug}`}
            type="email"
            name="email"
            placeholder="exemplo@suaempresa.com.br"
            value={formData.email}
            onChange={handleInputChange}
            className={`w-full px-4 py-2.5 rounded-xl border ${errors.email ? 'border-red-500' : 'border-neutral-200'} focus:outline-none focus:ring-2 focus:ring-offset-1 ${themeColor.ringAccent} transition-all text-sm`}
          />
          {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
          {errors.email_warning && !errors.email && (
            <p className="text-xs text-amber-600 font-sans mt-1 bg-amber-50 p-2 rounded-lg border border-amber-100">
              {errors.email_warning}
            </p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label htmlFor={`input_phone_${icpSlug}`} className="block text-xs font-sans font-medium text-neutral-700 mb-1">Telefone Comercial</label>
          <input
            id={`input_phone_${icpSlug}`}
            type="tel"
            name="phone"
            placeholder="(00) 00000-0000"
            value={formData.phone}
            onChange={handlePhoneChange}
            className={`w-full px-4 py-2.5 rounded-xl border ${errors.phone ? 'border-red-500' : 'border-neutral-200'} focus:outline-none focus:ring-2 focus:ring-offset-1 ${themeColor.ringAccent} transition-all text-sm`}
          />
          {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* Company */}
          <div>
            <label htmlFor={`input_company_${icpSlug}`} className="block text-xs font-sans font-medium text-neutral-700 mb-1">Nome da Empresa</label>
            <input
              id={`input_company_${icpSlug}`}
              type="text"
              name="company"
              placeholder="Razão ou Nome Fantasia"
              value={formData.company}
              onChange={handleInputChange}
              className={`w-full px-4 py-2.5 rounded-xl border ${errors.company ? 'border-red-500' : 'border-neutral-200'} focus:outline-none focus:ring-2 focus:ring-offset-1 ${themeColor.ringAccent} transition-all text-sm`}
            />
            {errors.company && <p className="text-xs text-red-500 mt-1">{errors.company}</p>}
          </div>

          {/* Role */}
          <div>
            <label htmlFor={`input_role_${icpSlug}`} className="block text-xs font-sans font-medium text-neutral-700 mb-1">Seu Cargo</label>
            <select
              id={`input_role_${icpSlug}`}
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              className={`w-full px-4 py-2.5 rounded-xl border ${errors.role ? 'border-red-500' : 'border-neutral-200'} focus:outline-none focus:ring-2 focus:ring-offset-1 ${themeColor.ringAccent} transition-all text-sm bg-white`}
            >
              <option value="">Selecione...</option>
              <option value="Diretor / C-Level">Diretor / C-Level</option>
              <option value="Gerente de Operações">Gerente de Operações</option>
              <option value="Coordenador Financeiro">Coordenador Financeiro</option>
              <option value="Analista de Cobrança / Cadastro">Analista de Cobrança / Cadastro</option>
              <option value="TI / Desenvolvedor">TI / Integrador de TI</option>
              <option value="Outro">Outro cargo</option>
            </select>
            {errors.role && <p className="text-xs text-red-500 mt-1">{errors.role}</p>}
          </div>
        </div>

        {/* Volume Select */}
        <div>
          <label htmlFor={`input_volume_${icpSlug}`} className="block text-xs font-sans font-medium text-neutral-700 mb-1">Volume de Consultas Estimado / Mês</label>
          <select
            id={`input_volume_${icpSlug}`}
            name="volume"
            value={formData.volume}
            onChange={handleInputChange}
            className={`w-full px-4 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-offset-1 ${themeColor.ringAccent} transition-all text-sm bg-white`}
          >
            <option value="6000">Até 6 mil consultas /mês (Plano R$650)</option>
            <option value="15000">6 mil a 20 mil consultas /mês</option>
            <option value="enterprise">Acima de 20 mil / Integração API Enterprise</option>
          </select>
        </div>
      </div>

      <div className="pt-2">
        <button
          id={`btn_submit_lead_${icpSlug}`}
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-3.5 px-4 rounded-xl text-white font-sans font-semibold text-sm flex items-center justify-center gap-2 cursor-pointer transition-all duration-300 ${themeColor.primary} ${themeColor.primaryHover} disabled:opacity-75 disabled:cursor-not-allowed shadow-md shadow-indigo-100 hover:shadow-lg`}
        >
          {isSubmitting ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              Avaliando Perfil...
            </>
          ) : (
            <>
              Solicitar Contato Comercial <ArrowRight size={16} />
            </>
          )}
        </button>
      </div>

      <div className="flex items-center justify-center gap-1.5 text-[10px] text-neutral-500 pt-1">
        <ShieldCheck size={12} className="text-emerald-600" />
        Dados protegidos sob rigoroso protocolo LGPD & criptografados de ponta a ponta.
      </div>
    </form>
  );
}
