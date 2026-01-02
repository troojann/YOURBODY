
import React, { useState } from 'react';
import { ActivityType, Activity } from '../types';

interface ActivityFormProps {
  onAdd: (activity: Omit<Activity, 'id'>) => void;
}

const ActivityForm: React.FC<ActivityFormProps> = ({ onAdd }) => {
  const [type, setType] = useState<ActivityType>('Caminhada');
  const [duration, setDuration] = useState('');
  const [distance, setDistance] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!duration) return;

    onAdd({
      type,
      duration: Number(duration),
      distance: distance ? Number(distance) : undefined,
      date,
      notes
    });

    setDuration('');
    setDistance('');
    setNotes('');
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
      <h3 className="text-xl font-bold mb-4 text-slate-800">Registrar Atividade</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">Tipo</label>
          <select 
            value={type} 
            onChange={(e) => setType(e.target.value as ActivityType)}
            className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
          >
            <option value="Caminhada">Caminhada</option>
            <option value="Corrida">Corrida</option>
            <option value="Ciclismo">Ciclismo</option>
            <option value="Academia">Academia</option>
            <option value="Outro">Outro</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">Data</label>
          <input 
            type="date" 
            value={date} 
            onChange={(e) => setDate(e.target.value)}
            className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">Duração (min)</label>
          <input 
            type="number" 
            value={duration} 
            onChange={(e) => setDuration(e.target.value)}
            placeholder="Ex: 45"
            className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">Distância (km - opcional)</label>
          <input 
            type="number" 
            step="0.1"
            value={distance} 
            onChange={(e) => setDistance(e.target.value)}
            placeholder="Ex: 5.2"
            className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
          />
        </div>
      </div>

      <div className="mt-4">
        <label className="block text-sm font-medium text-slate-600 mb-1">Observações</label>
        <textarea 
          value={notes} 
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Como foi o treino?"
          className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none h-20 transition-all resize-none"
        />
      </div>

      <button 
        type="submit"
        className="mt-6 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-indigo-200 active:scale-[0.98]"
      >
        Salvar Atividade
      </button>
    </form>
  );
};

export default ActivityForm;
