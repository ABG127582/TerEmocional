import React, { useState, useEffect } from 'react';
import { Shield, Phone, Heart, Anchor, AlertTriangle, Plus, Trash2, Info } from 'lucide-react';
import { storageService } from '../services/storageService';
import { SafetyPlan } from '../types';

interface SafetyPlanViewProps {
  theme: 'light' | 'dark';
}

export const SafetyPlanView: React.FC<SafetyPlanViewProps> = ({ theme }) => {
  const [plan, setPlan] = useState<SafetyPlan>({
    contacts: [
      { name: 'CVV (Centro de Valorização da Vida)', phone: '188', relation: 'Emergência Nacional' }
    ],
    copingPhantom: 'Isso é apenas uma tempestade química no meu cérebro. Vai passar.',
    safePlace: 'Meu quarto, debaixo das cobertas ouvindo chuva.'
  });

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('safety_plan');
    if (saved) {
      setPlan(JSON.parse(saved));
    }
  }, []);

  const savePlan = (newPlan: SafetyPlan) => {
    setPlan(newPlan);
    localStorage.setItem('safety_plan', JSON.stringify(newPlan));
  };

  const addContact = () => {
    const newPlan = {
      ...plan,
      contacts: [...plan.contacts, { name: 'Novo Contato', phone: '', relation: 'Amigo/Familiar' }]
    };
    savePlan(newPlan);
  };

  const removeContact = (index: number) => {
    const newPlan = {
      ...plan,
      contacts: plan.contacts.filter((_, i) => i !== index)
    };
    savePlan(newPlan);
  };

  const updateContact = (index: number, field: keyof SafetyPlan['contacts'][0], value: string) => {
    const newContacts = [...plan.contacts];
    newContacts[index][field] = value;
    savePlan({ ...plan, contacts: newContacts });
  };

  const textClass = theme === 'dark' ? 'text-white' : 'text-slate-900';
  const textSecondary = theme === 'dark' ? 'text-slate-400' : 'text-slate-500';
  const inputClass = theme === 'dark' ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900';

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in slide-in-from-bottom-8 duration-700">
      
      {/* Header SOS */}
      <div className="text-center space-y-4 mb-12">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-500/10 text-red-500 mb-2 shadow-[0_0_30px_rgba(239,68,68,0.2)]">
          <Shield className="w-10 h-10" />
        </div>
        <h2 className={`text-3xl font-black uppercase tracking-tight ${textClass}`}>Plano de Segurança</h2>
        <p className={`text-sm max-w-lg mx-auto ${textSecondary}`}>
          Este é o seu "paraquedas" emocional. Preencha isso quando estiver bem, para saber exatamente o que fazer quando a tempestade chegar.
        </p>
        <button 
          onClick={() => setIsEditing(!isEditing)}
          className={`mt-4 px-6 py-2 rounded-full text-sm font-bold transition-all ${isEditing ? 'bg-blue-600 text-white shadow-lg' : `border ${inputClass} hover:bg-slate-100 dark:hover:bg-slate-800`}`}
        >
          {isEditing ? 'Salvar Plano' : 'Editar Plano'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Lembrete de Ancoragem */}
        <div className={`p-6 rounded-2xl border backdrop-blur-sm ${theme === 'dark' ? 'bg-slate-800/50 border-slate-700' : 'bg-white/50 border-slate-200'}`}>
          <div className="flex items-center gap-3 mb-4">
            <Anchor className="w-6 h-6 text-blue-500" />
            <h3 className={`text-lg font-bold ${textClass}`}>Frase de Ancoragem</h3>
          </div>
          {isEditing ? (
            <textarea 
              value={plan.copingPhantom}
              onChange={(e) => savePlan({ ...plan, copingPhantom: e.target.value })}
              className={`w-full p-3 rounded-xl border ${inputClass} resize-none h-24`}
              placeholder="Ex: Isso é apenas química no meu cérebro. Vai passar."
            />
          ) : (
            <p className={`text-lg font-medium italic ${textClass} border-l-4 border-blue-500 pl-4 py-2`}>
              "{plan.copingPhantom}"
            </p>
          )}
        </div>

        {/* Lugar Seguro */}
        <div className={`p-6 rounded-2xl border backdrop-blur-sm ${theme === 'dark' ? 'bg-slate-800/50 border-slate-700' : 'bg-white/50 border-slate-200'}`}>
          <div className="flex items-center gap-3 mb-4">
            <Heart className="w-6 h-6 text-pink-500" />
            <h3 className={`text-lg font-bold ${textClass}`}>Meu Lugar Seguro</h3>
          </div>
          {isEditing ? (
             <textarea 
              value={plan.safePlace}
              onChange={(e) => savePlan({ ...plan, safePlace: e.target.value })}
              className={`w-full p-3 rounded-xl border ${inputClass} resize-none h-24`}
              placeholder="Lugar físico ou mental onde você se sente protegido."
            />
          ) : (
             <p className={`text-base font-medium ${textClass} bg-pink-500/10 p-4 rounded-xl border border-pink-500/20`}>
              {plan.safePlace}
            </p>
          )}
        </div>

      </div>

      {/* Contatos de Emergência */}
      <div className={`p-6 md:p-8 rounded-3xl border backdrop-blur-sm shadow-xl ${theme === 'dark' ? 'bg-slate-900/80 border-slate-700' : 'bg-white/80 border-slate-200'}`}>
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <Phone className="w-6 h-6 text-emerald-500" />
            <h3 className={`text-xl font-bold ${textClass}`}>Contatos de Emergência</h3>
          </div>
          {isEditing && (
            <button onClick={addContact} className="p-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors">
              <Plus className="w-5 h-5" />
            </button>
          )}
        </div>

        <div className="space-y-4">
          {plan.contacts.map((contact, index) => (
            <div key={index} className={`flex flex-col md:flex-row gap-4 p-4 rounded-xl border ${isEditing ? (theme === 'dark' ? 'bg-slate-800 border-slate-600' : 'bg-slate-50 border-slate-300') : (theme === 'dark' ? 'bg-slate-800/50 border-slate-700/50' : 'bg-slate-50/50 border-slate-200/50')} items-center`}>
              
              {isEditing ? (
                <>
                  <input 
                    type="text" value={contact.name} onChange={(e) => updateContact(index, 'name', e.target.value)}
                    className={`flex-1 p-2 rounded-lg border text-sm font-bold ${inputClass}`} placeholder="Nome"
                  />
                  <input 
                    type="text" value={contact.relation} onChange={(e) => updateContact(index, 'relation', e.target.value)}
                    className={`flex-1 p-2 rounded-lg border text-sm ${inputClass}`} placeholder="Relação (ex: Terapeuta)"
                  />
                  <input 
                    type="tel" value={contact.phone} onChange={(e) => updateContact(index, 'phone', e.target.value)}
                    className={`flex-1 p-2 rounded-lg border text-sm font-mono ${inputClass}`} placeholder="Telefone"
                  />
                  <button onClick={() => removeContact(index)} className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </>
              ) : (
                <>
                  <div className="flex-1">
                    <p className={`font-bold text-lg ${textClass}`}>{contact.name}</p>
                    <p className={`text-xs uppercase tracking-wider ${textSecondary}`}>{contact.relation}</p>
                  </div>
                  <a 
                    href={`tel:${contact.phone}`}
                    className="w-full md:w-auto px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    <Phone className="w-4 h-4" />
                    Ligar: {contact.phone}
                  </a>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
