
import React, { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Activity } from '../types';

interface CalendarProps {
  activities: Activity[];
}

const Calendar: React.FC<CalendarProps> = ({ activities }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getActivitiesForDay = (day: Date) => {
    return activities.filter(a => isSameDay(new Date(a.date + 'T00:00:00'), day));
  };

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-xl font-bold text-slate-800 capitalize">
          {format(currentDate, 'MMMM yyyy', { locale: ptBR })}
        </h3>
        <div className="flex gap-2">
          <button onClick={prevMonth} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-600">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          </button>
          <button onClick={nextMonth} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-600">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2 mb-2">
        {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
          <div key={day} className="text-center text-xs font-semibold text-slate-400 uppercase">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {/* Placeholder for days of the week before the month starts */}
        {Array.from({ length: monthStart.getDay() }).map((_, i) => (
          <div key={`empty-${i}`} className="h-24 rounded-lg bg-slate-50/50"></div>
        ))}

        {days.map(day => {
          const dayActivities = getActivitiesForDay(day);
          const hasActivities = dayActivities.length > 0;

          return (
            <div 
              key={day.toISOString()} 
              className={`h-24 p-2 rounded-lg border transition-all ${
                hasActivities 
                ? 'bg-indigo-50 border-indigo-100 shadow-sm' 
                : 'bg-white border-slate-100'
              }`}
            >
              <span className={`text-sm font-medium ${hasActivities ? 'text-indigo-700' : 'text-slate-500'}`}>
                {format(day, 'd')}
              </span>
              <div className="mt-1 flex flex-col gap-1 overflow-hidden">
                {dayActivities.slice(0, 2).map((a, idx) => (
                  <div key={idx} className="text-[10px] bg-indigo-600 text-white px-1.5 py-0.5 rounded truncate">
                    {a.type}
                  </div>
                ))}
                {dayActivities.length > 2 && (
                  <span className="text-[10px] text-indigo-600 font-medium">
                    +{dayActivities.length - 2} mais
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;
