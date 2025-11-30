import React from 'react';
import { Car } from '../types';
import { Car as CarIcon, Gauge, CalendarClock, AlertCircle } from 'lucide-react';

interface CarCardProps {
  car: Car;
  isSelected: boolean;
  onClick: () => void;
  nextMaintenance?: {
    type: string;
    date: string;
    daysRemaining: number;
  };
}

export const CarCard: React.FC<CarCardProps> = ({ car, isSelected, onClick, nextMaintenance }) => {
  const getStatusColor = (days: number) => {
    if (days < 0) return 'text-red-600 bg-red-50 border-red-100';
    if (days <= 30) return 'text-amber-600 bg-amber-50 border-amber-100';
    return 'text-green-600 bg-green-50 border-green-100';
  };

  return (
    <div 
      onClick={onClick}
      className={`
        cursor-pointer rounded-xl border transition-all duration-200 overflow-hidden group flex flex-col h-full
        ${isSelected 
          ? 'border-brand-500 ring-2 ring-brand-200 bg-white shadow-lg transform scale-[1.02]' 
          : 'border-slate-200 bg-white hover:border-brand-300 hover:shadow-md'
        }
      `}
    >
      <div className="h-32 overflow-hidden relative shrink-0">
        <img 
          src={car.image} 
          alt={`${car.brand} ${car.model}`}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-2 left-3 text-white">
          <p className="text-xs opacity-90">{car.brand}</p>
          <p className="font-bold text-lg leading-tight">{car.model}</p>
        </div>
      </div>
      
      <div className="p-3 flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-2">
          <span className="bg-slate-100 text-slate-700 text-xs font-bold px-2 py-1 rounded border border-slate-200">
            {car.licensePlate}
          </span>
          <div className="flex items-center text-slate-500 text-xs">
            <Gauge size={14} className="mr-1" />
            {car.currentMileage.toLocaleString()} km
          </div>
        </div>
        <div className="flex items-center text-xs text-slate-400 mb-3">
          <CarIcon size={12} className="mr-1" /> 
          {car.year} • {car.color}
        </div>

        {nextMaintenance ? (
           <div className={`mt-auto rounded-lg p-2 border flex items-start gap-2 ${getStatusColor(nextMaintenance.daysRemaining)}`}>
             <div className="mt-0.5"><CalendarClock size={14} /></div>
             <div className="flex-1">
               <div className="text-[10px] uppercase font-bold tracking-wider opacity-80">ครบกำหนดถัดไป</div>
               <div className="text-xs font-bold truncate">{nextMaintenance.type}</div>
               <div className="text-[10px] opacity-90">
                 {new Date(nextMaintenance.date).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit'})}
                 {nextMaintenance.daysRemaining < 0 
                    ? ` (เกิน ${Math.abs(nextMaintenance.daysRemaining)} วัน)` 
                    : ` (เหลือ ${nextMaintenance.daysRemaining} วัน)`}
               </div>
             </div>
           </div>
        ) : (
          <div className="mt-auto rounded-lg p-2 border border-slate-100 bg-slate-50 text-slate-400 flex items-center gap-2">
             <AlertCircle size={14} />
             <span className="text-xs">ไม่มีรายการแจ้งเตือน</span>
          </div>
        )}
      </div>
    </div>
  );
};