import React, { useState } from 'react';
import { MaintenanceType, MaintenanceRecord } from '../types';
import { X } from 'lucide-react';

interface AddRecordFormProps {
  carId: string;
  initialData?: MaintenanceRecord | null;
  onSave: (record: Omit<MaintenanceRecord, 'id'>) => void;
  onCancel: () => void;
}

export const AddRecordForm: React.FC<AddRecordFormProps> = ({ carId, initialData, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    type: initialData?.type || MaintenanceType.OIL_CHANGE,
    date: initialData?.date || new Date().toISOString().split('T')[0],
    expiryDate: initialData?.expiryDate || '',
    cost: initialData?.cost !== undefined ? initialData.cost : '',
    provider: initialData?.provider || '',
    notes: initialData?.notes || '',
    mileageAtService: initialData?.mileageAtService !== undefined ? initialData.mileageAtService : ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      carId,
      type: formData.type as MaintenanceType,
      date: formData.date,
      expiryDate: formData.expiryDate || undefined,
      cost: Number(formData.cost) || 0,
      provider: formData.provider,
      notes: formData.notes,
      mileageAtService: formData.mileageAtService ? Number(formData.mileageAtService) : undefined
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in-up">
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
          <h3 className="font-bold text-lg text-slate-800">
            {initialData ? 'แก้ไขประวัติการบำรุงรักษา' : 'บันทึกประวัติการบำรุงรักษา'}
          </h3>
          <button onClick={onCancel} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">ประเภท</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full rounded-lg border-slate-300 border px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none"
              >
                {Object.values(MaintenanceType).map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">วันที่ทำรายการ</label>
              <input
                type="date"
                name="date"
                required
                value={formData.date}
                onChange={handleChange}
                className="w-full rounded-lg border-slate-300 border px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">ค่าใช้จ่าย (บาท)</label>
              <input
                type="number"
                name="cost"
                required
                min="0"
                value={formData.cost}
                onChange={handleChange}
                placeholder="0.00"
                className="w-full rounded-lg border-slate-300 border px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">เลขไมล์ (กม.)</label>
              <input
                type="number"
                name="mileageAtService"
                min="0"
                value={formData.mileageAtService}
                onChange={handleChange}
                placeholder="ระบุเลขไมล์ล่าสุด"
                className="w-full rounded-lg border-slate-300 border px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none"
              />
            </div>
          </div>

          <div>
             <label className="block text-sm font-medium text-slate-700 mb-1">วันหมดอายุ / รอบถัดไป (ถ้ามี)</label>
             <input
                type="date"
                name="expiryDate"
                value={formData.expiryDate}
                onChange={handleChange}
                className="w-full rounded-lg border-slate-300 border px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none"
              />
             <p className="text-xs text-slate-400 mt-1">* สำหรับ พรบ., ภาษี, ประกันภัย หรือนัดหมายครั้งต่อไป</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">สถานที่บริการ / ผู้ให้บริการ</label>
            <input
              type="text"
              name="provider"
              value={formData.provider}
              onChange={handleChange}
              placeholder="เช่น ศูนย์โตโยต้า, อู่สมชายการช่าง"
              className="w-full rounded-lg border-slate-300 border px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">รายละเอียด / หมายเหตุ</label>
            <textarea
              name="notes"
              rows={3}
              value={formData.notes}
              onChange={handleChange}
              placeholder="รายละเอียดการซ่อม หรือข้อมูลเพิ่มเติม..."
              className="w-full rounded-lg border-slate-300 border px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none resize-none"
            />
          </div>

          <div className="flex gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-medium transition-colors"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 font-medium shadow-sm transition-colors"
            >
              {initialData ? 'บันทึกการแก้ไข' : 'บันทึกข้อมูล'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};