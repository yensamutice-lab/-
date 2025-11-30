import React, { useState, useEffect } from 'react';
import { Car, MaintenanceRecord } from './types';
import { INITIAL_CARS, INITIAL_RECORDS } from './constants';
import { CarCard } from './components/CarCard';
import { MaintenanceTable } from './components/MaintenanceTable';
import { AddRecordForm } from './components/AddRecordForm';
import { analyzeFleetMaintenance } from './services/geminiService';
import { Plus, Wrench, BarChart2, Sparkles, XCircle, Search, FileDown } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export default function App() {
  const [cars] = useState<Car[]>(INITIAL_CARS);
  const [records, setRecords] = useState<MaintenanceRecord[]>(INITIAL_RECORDS);
  const [selectedCarId, setSelectedCarId] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<MaintenanceRecord | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showAnalysisModal, setShowAnalysisModal] = useState(false);

  // Derived state
  const selectedCar = cars.find(c => c.id === selectedCarId);
  const filteredRecords = selectedCarId 
    ? records.filter(r => r.carId === selectedCarId).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    : [];

  // Helper to find next maintenance
  const getNextMaintenance = (carId: string) => {
    const carRecords = records.filter(r => r.carId === carId && r.expiryDate);
    if (carRecords.length === 0) return undefined;

    // Group by type to find the LATEST record of each type
    const latestByType = new Map<string, MaintenanceRecord>();
    carRecords.forEach(r => {
      const existing = latestByType.get(r.type);
      // We assume larger ID or newer date is latest, simpler to check date
      if (!existing || new Date(r.date) > new Date(existing.date)) {
        latestByType.set(r.type, r);
      }
    });

    const activeRecords = Array.from(latestByType.values());
    const today = new Date();

    // Sort by expiry date (ascending)
    const sorted = activeRecords.sort((a, b) => new Date(a.expiryDate!).getTime() - new Date(b.expiryDate!).getTime());
    
    // We want the earliest one that is effectively the next deadline
    if (sorted.length === 0) return undefined;
    const nearest = sorted[0];

    const expiry = new Date(nearest.expiryDate!);
    const diffTime = expiry.getTime() - today.getTime();
    const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return {
      type: nearest.type,
      date: nearest.expiryDate!,
      daysRemaining
    };
  };

  const handleSaveRecord = (recordData: Omit<MaintenanceRecord, 'id'>) => {
    if (editingRecord) {
      setRecords(prev => prev.map(r => r.id === editingRecord.id ? { ...recordData, id: editingRecord.id } : r));
    } else {
      const id = Math.random().toString(36).substring(2, 9);
      setRecords(prev => [...prev, { ...recordData, id }]);
    }
    setIsFormOpen(false);
    setEditingRecord(null);
  };

  const handleDeleteRecord = (id: string) => {
    if (confirm('คุณต้องการลบรายการนี้ใช่หรือไม่?')) {
      setRecords(prev => prev.filter(r => r.id !== id));
    }
  };

  const handleEditRecord = (record: MaintenanceRecord) => {
    setEditingRecord(record);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingRecord(null);
  };

  const handleAnalyze = async () => {
    setShowAnalysisModal(true);
    if (!aiAnalysis) {
      setIsAnalyzing(true);
      const result = await analyzeFleetMaintenance(cars, records);
      setAiAnalysis(result);
      setIsAnalyzing(false);
    }
  };

  const handleExportCSV = () => {
    // Header
    const headers = ['Car License', 'Brand', 'Model', 'Maintenance Type', 'Payment Date', 'Expiry Date', 'Cost', 'Provider', 'Notes', 'Mileage'];
    
    // Rows
    const rows = records.map(r => {
      const car = cars.find(c => c.id === r.carId);
      return [
        car?.licensePlate || '',
        car?.brand || '',
        car?.model || '',
        r.type,
        r.date,
        r.expiryDate || '-',
        r.cost,
        `"${r.provider}"`, // Quote to handle commas
        `"${r.notes}"`,
        r.mileageAtService || '-'
      ].join(',');
    });

    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "maintenance_schedule_template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-10">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-brand-600 p-2 rounded-lg text-white">
              <Wrench size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800 leading-none">FleetTrack Pro</h1>
              <p className="text-xs text-slate-500">ระบบจัดการซ่อมบำรุงยานพาหนะ</p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <button 
              onClick={handleExportCSV}
              className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-all text-sm font-medium"
            >
              <FileDown size={16} />
              <span className="hidden sm:inline">Export CSV</span>
            </button>
            <button 
              onClick={handleAnalyze}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-lg hover:shadow-lg transition-all text-sm font-medium"
            >
              <Sparkles size={16} />
              <span className="hidden sm:inline">วิเคราะห์ด้วย AI</span>
              <span className="sm:hidden">AI วิเคราะห์</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Dashboard Overview - Car Selection */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-700 flex items-center gap-2">
              <BarChart2 size={20} />
              ยานพาหนะทั้งหมด ({cars.length})
            </h2>
            <span className="text-sm text-slate-500">เลือกรถเพื่อดูประวัติ</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {cars.map(car => (
              <CarCard 
                key={car.id} 
                car={car} 
                isSelected={selectedCarId === car.id}
                onClick={() => setSelectedCarId(car.id)}
                nextMaintenance={getNextMaintenance(car.id)}
              />
            ))}
          </div>
        </section>

        {/* Selected Car Details & History */}
        {selectedCar ? (
          <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden animate-fade-in">
            <div className="p-6 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                 <div className="h-16 w-16 rounded-full overflow-hidden border-2 border-slate-100 hidden sm:block">
                   <img src={selectedCar.image} alt={selectedCar.model} className="w-full h-full object-cover" />
                 </div>
                 <div>
                    <h3 className="text-xl font-bold text-slate-900">{selectedCar.brand} {selectedCar.model}</h3>
                    <div className="flex items-center gap-3 text-sm text-slate-500 mt-1">
                      <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-700 font-semibold border border-slate-200">
                        {selectedCar.licensePlate}
                      </span>
                      <span>{selectedCar.currentMileage.toLocaleString()} km</span>
                    </div>
                 </div>
              </div>

              <div className="flex gap-2">
                 <button 
                  onClick={() => setIsFormOpen(true)}
                  className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm"
                 >
                   <Plus size={18} />
                   ลงบันทึกซ่อม/ต่ออายุ
                 </button>
              </div>
            </div>

            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-slate-700">ประวัติและกำหนดการ</h4>
                <div className="text-xs text-slate-400">
                  {filteredRecords.length} รายการ
                </div>
              </div>
              <MaintenanceTable 
                records={filteredRecords} 
                onDelete={handleDeleteRecord}
                onEdit={handleEditRecord}
              />
            </div>
          </section>
        ) : (
          <div className="text-center py-20 bg-slate-100 rounded-xl border-2 border-dashed border-slate-300">
            <Search className="mx-auto h-12 w-12 text-slate-400 mb-3" />
            <h3 className="text-lg font-medium text-slate-600">กรุณาเลือกรถเพื่อดูรายละเอียด</h3>
            <p className="text-slate-400 text-sm">คลิกที่การ์ดรถด้านบนเพื่อจัดการข้อมูล หรือดูแจ้งเตือน</p>
          </div>
        )}
      </main>

      {/* Add/Edit Record Modal */}
      {isFormOpen && selectedCarId && (
        <AddRecordForm 
          carId={selectedCarId}
          initialData={editingRecord}
          onSave={handleSaveRecord}
          onCancel={handleCloseForm}
        />
      )}

      {/* AI Analysis Modal */}
      {showAnalysisModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[85vh] flex flex-col animate-fade-in-up">
            <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-gradient-to-r from-violet-50 to-indigo-50 rounded-t-xl">
              <div className="flex items-center gap-2 text-violet-800">
                <Sparkles size={20} />
                <h3 className="font-bold text-lg">AI Fleet Analysis</h3>
              </div>
              <button 
                onClick={() => setShowAnalysisModal(false)}
                className="text-slate-400 hover:text-slate-600 hover:bg-white/50 rounded-full p-1 transition-all"
              >
                <XCircle size={24} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 bg-slate-50/50">
              {isAnalyzing ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600 mb-4"></div>
                  <p className="text-slate-600 font-medium animate-pulse">กำลังวิเคราะห์ข้อมูลรถยนต์และประวัติการซ่อม...</p>
                  <p className="text-slate-400 text-sm mt-2">อาจใช้เวลาสักครู่</p>
                </div>
              ) : (
                <div className="prose prose-slate prose-sm max-w-none">
                  <ReactMarkdown>{aiAnalysis || "ไม่สามารถดึงข้อมูลได้"}</ReactMarkdown>
                </div>
              )}
            </div>
            
            <div className="p-4 border-t border-slate-200 bg-white rounded-b-xl flex justify-end">
              <button 
                onClick={() => setShowAnalysisModal(false)}
                className="px-5 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-900 font-medium transition-colors"
              >
                ปิดหน้าต่าง
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}