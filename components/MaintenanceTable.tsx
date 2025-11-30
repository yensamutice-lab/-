import React from 'react';
import { MaintenanceRecord, MaintenanceType } from '../types';
import { Calendar, AlertTriangle, CheckCircle, Clock, Pencil, Trash2 } from 'lucide-react';

interface MaintenanceTableProps {
  records: MaintenanceRecord[];
  onDelete?: (id: string) => void;
  onEdit?: (record: MaintenanceRecord) => void;
}

export const MaintenanceTable: React.FC<MaintenanceTableProps> = ({ records, onDelete, onEdit }) => {
  
  const getBadgeColor = (type: MaintenanceType) => {
    switch (type) {
      case MaintenanceType.OIL_CHANGE: return 'bg-blue-100 text-blue-800 border-blue-200';
      case MaintenanceType.TAX: return 'bg-purple-100 text-purple-800 border-purple-200';
      case MaintenanceType.INSURANCE: return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case MaintenanceType.PRB: return 'bg-pink-100 text-pink-800 border-pink-200';
      case MaintenanceType.REPAIR: return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getStatus = (expiryDate?: string) => {
    if (!expiryDate) return null;
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return <span className="flex items-center text-red-600 font-bold text-xs"><AlertTriangle size={14} className="mr-1"/> หมดอายุแล้ว</span>;
    } else if (diffDays <= 30) {
      return <span className="flex items-center text-amber-600 font-bold text-xs"><Clock size={14} className="mr-1"/> ครบกำหนดใน {diffDays} วัน</span>;
    } else {
      return <span className="flex items-center text-green-600 font-bold text-xs"><CheckCircle size={14} className="mr-1"/> ปกติ</span>;
    }
  };

  if (records.length === 0) {
    return (
      <div className="text-center py-12 bg-slate-50 rounded-lg border-2 border-dashed border-slate-200">
        <div className="mx-auto w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-3">
          <Calendar className="text-slate-400" />
        </div>
        <p className="text-slate-500">ยังไม่มีประวัติการบำรุงรักษา</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200 shadow-sm">
      <table className="w-full text-sm text-left text-slate-600">
        <thead className="text-xs text-slate-700 uppercase bg-slate-50 border-b border-slate-200">
          <tr>
            <th className="px-6 py-3 whitespace-nowrap">วันเริ่มจ่าย / ซ่อม</th>
            <th className="px-6 py-3 whitespace-nowrap">รายการ</th>
            <th className="px-6 py-3 whitespace-nowrap">รายละเอียด</th>
            <th className="px-6 py-3 whitespace-nowrap">ค่าใช้จ่าย</th>
            <th className="px-6 py-3 whitespace-nowrap">วันหมดอายุ / ครบกำหนด</th>
            <th className="px-6 py-3 whitespace-nowrap">ผู้ให้บริการ</th>
            <th className="px-6 py-3 text-right">จัดการ</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-slate-100">
          {records.map((record) => (
            <tr key={record.id} className="hover:bg-slate-50 transition-colors">
              <td className="px-6 py-4 font-medium text-slate-900 whitespace-nowrap">
                {new Date(record.date).toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' })}
              </td>
              <td className="px-6 py-4">
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${getBadgeColor(record.type)}`}>
                  {record.type}
                </span>
              </td>
              <td className="px-6 py-4 max-w-xs truncate" title={record.notes}>
                {record.notes || '-'}
                {record.mileageAtService && <div className="text-xs text-slate-400 mt-1">เลขไมล์: {record.mileageAtService.toLocaleString()}</div>}
              </td>
              <td className="px-6 py-4 font-semibold text-slate-700">
                ฿{record.cost.toLocaleString()}
              </td>
              <td className="px-6 py-4">
                {record.expiryDate ? (
                  <div className="flex flex-col">
                    <span className="text-slate-900">
                      {new Date(record.expiryDate).toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </span>
                    <span className="mt-1">
                      {getStatus(record.expiryDate)}
                    </span>
                  </div>
                ) : (
                  <span className="text-slate-400">-</span>
                )}
              </td>
              <td className="px-6 py-4 text-slate-500">
                {record.provider}
              </td>
              <td className="px-6 py-4 text-right whitespace-nowrap">
                <div className="flex items-center justify-end gap-2">
                  {onEdit && (
                    <button 
                      onClick={() => onEdit(record)}
                      className="text-indigo-600 hover:text-indigo-800 p-1 rounded-md hover:bg-indigo-50 transition-colors"
                      title="แก้ไข"
                    >
                      <Pencil size={16} />
                    </button>
                  )}
                  {onDelete && (
                    <button 
                      onClick={() => onDelete(record.id)}
                      className="text-red-500 hover:text-red-700 p-1 rounded-md hover:bg-red-50 transition-colors"
                      title="ลบ"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};