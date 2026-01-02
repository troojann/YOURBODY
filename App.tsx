
import React, { useState, useEffect } from 'react';
import { Activity } from './types';
import ActivityForm from './components/ActivityForm';
import Calendar from './components/Calendar';
import { getHealthInsights } from './services/geminiService';

const App: React.FC = () => {
  // Inicialização do estado de atividades vindo do localStorage
  const [activities, setActivities] = useState<Activity[]>(() => {
    try {
      const saved = localStorage.getItem('fit_track_activities');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Erro ao carregar atividades:", e);
      return [];
    }
  });
  
  // Inicialização do insight da IA vindo do localStorage
  const [aiInsight, setAiInsight] = useState<string>(() => {
    return localStorage.getItem('fit_track_last_insight') || '';
  });

  const [loadingAi, setLoadingAi] = useState(false);
  const [activeTab, setActiveTab] = useState<'calendar' | 'form'>('calendar');

  // Persistência automática de atividades
  useEffect(() => {
    localStorage.setItem('fit_track_activities', JSON.stringify(activities));
  }, [activities]);

  // Persistência automática do insight
  useEffect(() => {
    localStorage.setItem('fit_track_last_insight', aiInsight);
  }, [aiInsight]);

  const handleAddActivity = (newActivity: Omit<Activity, 'id'>) => {
    const activityWithId = { ...newActivity, id: Math.random().toString(36).substr(2, 9) };
    setActivities(prev => [...prev, activityWithId]);
    setActiveTab('calendar');
  };

  const handleDeleteActivity = (id: string) => {
    if (window.confirm('Deseja excluir este registro permanentemente?')) {
      setActivities(prev => prev.filter(a => a.id !== id));
    }
  };

  const fetchAiInsight = async () => {
    setLoadingAi(true);
    const insight = await getHealthInsights(activities);
    setAiInsight(insight);
    setLoadingAi(false);
  };

  const stats = {
    totalDuration: activities.reduce((acc, curr) => acc + curr.duration, 0),
    totalDistance: activities.reduce((acc, curr) => acc + (curr.distance || 0), 0),
    count: activities.length
  };

  return (
    <div className="min-h-screen pb-24 md:pb-12 bg-slate-50">
      {/* Header */}
      <header className="bg-indigo-600 text-white pt-8 pb-16 px-4 shadow-lg">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight">FitTrack AI</h1>
              <div className="flex items-center gap-1.5 mt-1 opacity-80">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                <span className="text-[10px] uppercase font-bold tracking-widest">Sincronizado Localmente</span>
              </div>
            </div>
            <div className="bg-white/20 px-4 py-1 rounded-full text-sm font-medium backdrop-blur-sm border border-white/10">
              {new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10">
              <p className="text-indigo-100 text-xs uppercase font-bold tracking-wider mb-1">Total</p>
              <p className="text-2xl font-bold">{stats.count}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10">
              <p className="text-indigo-100 text-xs uppercase font-bold tracking-wider mb-1">Minutos</p>
              <p className="text-2xl font-bold">{stats.totalDuration}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10">
              <p className="text-indigo-100 text-xs uppercase font-bold tracking-wider mb-1">KM</p>
              <p className="text-2xl font-bold">{stats.totalDistance.toFixed(1)}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto -mt-8 px-4 relative z-10">
        
        {/* AI Insight Section */}
        <section className="bg-white p-6 rounded-2xl shadow-xl border border-indigo-50 mb-8 overflow-hidden relative group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a10 10 0 1 0 10 10H12V2Z"/><path d="M12 2a10 10 0 0 1 10 10h-7.5l-3.5 3.5-3.5-3.5H2"/><path d="M12 2v10"/></svg>
          </div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>
            </div>
            <h2 className="text-lg font-bold text-slate-800">IA Insights</h2>
            {aiInsight && !loadingAi && (
              <button 
                onClick={fetchAiInsight}
                className="ml-auto text-xs text-indigo-600 font-semibold hover:underline"
              >
                Atualizar
              </button>
            )}
          </div>
          
          {aiInsight ? (
            <div className="text-slate-600 leading-relaxed italic pr-8">
              "{aiInsight}"
            </div>
          ) : (
            <div className="flex flex-col items-center py-4">
              <p className="text-slate-400 text-sm mb-4">Clique para receber seu feedback personalizado!</p>
              <button 
                onClick={fetchAiInsight}
                disabled={loadingAi}
                className="bg-indigo-50 text-indigo-700 font-semibold px-6 py-2 rounded-full hover:bg-indigo-100 transition-colors flex items-center gap-2 border border-indigo-100 disabled:opacity-50"
              >
                {loadingAi ? 'Analisando...' : 'Gerar Insight IA'}
              </button>
            </div>
          )}
          {loadingAi && aiInsight && <div className="absolute inset-0 bg-white/60 flex items-center justify-center font-bold text-indigo-600">Atualizando insights...</div>}
        </section>

        {/* Tab Switching */}
        <div className="flex bg-slate-200/50 p-1 rounded-xl mb-6 backdrop-blur-sm sticky top-4 z-20">
          <button 
            onClick={() => setActiveTab('calendar')}
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${activeTab === 'calendar' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Calendário
          </button>
          <button 
            onClick={() => setActiveTab('form')}
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${activeTab === 'form' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Nova Atividade
          </button>
        </div>

        {activeTab === 'calendar' ? (
          <Calendar activities={activities} />
        ) : (
          <ActivityForm onAdd={handleAddActivity} />
        )}

        {/* Recent Activity List */}
        {activities.length > 0 && activeTab === 'calendar' && (
          <div className="mt-8">
            <div className="flex justify-between items-end mb-4 px-2">
              <h3 className="text-lg font-bold text-slate-800">Histórico Recente</h3>
              <span className="text-xs text-slate-400">Arraste ou clique para excluir</span>
            </div>
            <div className="space-y-3">
              {activities.slice().reverse().slice(0, 10).map(activity => (
                <div key={activity.id} className="bg-white p-4 rounded-xl border border-slate-100 flex justify-between items-center hover:border-indigo-200 transition-all group shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-50 transition-colors">
                      {activity.type === 'Caminhada' && <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 20V10"/><path d="M12 20V4"/><path d="M6 20v-6"/></svg>}
                      {activity.type === 'Academia' && <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6.5 6.5 11 11"/><path d="m21 21-1-1"/><path d="m3 3 1 1"/><path d="m18 22 4-4"/><path d="m2 6 4-4"/><path d="m3 10 7-7"/><path d="m14 21 7-7"/></svg>}
                      {(activity.type !== 'Academia' && activity.type !== 'Caminhada') && <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 22h14"/><path d="M12 2v20"/><path d="M17 7H7"/></svg>}
                    </div>
                    <div>
                      <p className="font-bold text-slate-800">{activity.type}</p>
                      <p className="text-xs text-slate-500">{new Date(activity.date + 'T00:00:00').toLocaleDateString('pt-BR')}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-bold text-slate-800">{activity.duration} min</p>
                      {activity.distance && <p className="text-xs text-slate-500">{activity.distance} km</p>}
                    </div>
                    <button 
                      onClick={() => handleDeleteActivity(activity.id)}
                      className="p-2 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                      title="Excluir"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Persistent Bottom Nav */}
      <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-xl border border-indigo-100 shadow-2xl rounded-2xl px-6 py-3 flex gap-8 items-center md:hidden z-50">
        <button 
          onClick={() => setActiveTab('calendar')}
          className={`p-2 rounded-lg transition-colors ${activeTab === 'calendar' ? 'text-indigo-600 bg-indigo-50' : 'text-slate-400'}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
        </button>
        <button 
          onClick={() => setActiveTab('form')}
          className={`w-12 h-12 bg-indigo-600 text-white rounded-full flex items-center justify-center shadow-lg shadow-indigo-200 active:scale-95 transition-transform`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" x2="12" y1="5" y2="19"/><line x1="5" x2="19" y1="12" y2="12"/></svg>
        </button>
        <button 
          onClick={fetchAiInsight}
          className="p-2 text-slate-400 hover:text-indigo-600 transition-colors"
        >
           <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/></svg>
        </button>
      </nav>
    </div>
  );
};

export default App;
