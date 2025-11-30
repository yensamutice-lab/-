export enum MaintenanceType {
  OIL_CHANGE = 'ถ่ายน้ำมันเครื่อง',
  INSURANCE = 'ต่อประกันภัย',
  TAX = 'ต่อภาษีรถยนต์',
  PRB = 'ต่อ พ.ร.บ.',
  REPAIR = 'ซ่อมบำรุงทั่วไป',
  TIRES = 'เปลี่ยนยาง',
  BATTERY = 'เปลี่ยนแบตเตอรี่',
  OTHER = 'อื่นๆ'
}

export interface MaintenanceRecord {
  id: string;
  carId: string;
  type: MaintenanceType;
  date: string; // YYYY-MM-DD
  expiryDate?: string; // YYYY-MM-DD (For insurance, tax, prb, or next oil change)
  cost: number;
  provider: string; // Garage or Service Center name
  notes: string;
  mileageAtService?: number;
}

export interface Car {
  id: string;
  licensePlate: string;
  brand: string;
  model: string;
  year: number;
  color: string;
  currentMileage: number;
  image: string;
}

export interface FleetData {
  cars: Car[];
  records: MaintenanceRecord[];
}