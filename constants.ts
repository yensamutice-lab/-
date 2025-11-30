import { Car, MaintenanceRecord, MaintenanceType } from './types';

export const INITIAL_CARS: Car[] = [
  {
    id: 'c1',
    licensePlate: '1กข 1234',
    brand: 'Toyota',
    model: 'Hilux Revo',
    year: 2023,
    color: 'ขาว',
    currentMileage: 45000,
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'c2',
    licensePlate: '2ขค 5678',
    brand: 'Isuzu',
    model: 'D-Max',
    year: 2022,
    color: 'เงิน',
    currentMileage: 82000,
    image: 'https://images.unsplash.com/photo-1566008885218-90abf9200ddb?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'c3',
    licensePlate: '3งจ 9012',
    brand: 'Honda',
    model: 'City Hatchback',
    year: 2024,
    color: 'เทา',
    currentMileage: 15000,
    image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'c4',
    licensePlate: '4ฉช 3456',
    brand: 'Toyota',
    model: 'Commuter',
    year: 2021,
    color: 'ขาว',
    currentMileage: 120000,
    image: 'https://images.unsplash.com/photo-1464219789935-c2d9d9aba644?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'c5',
    licensePlate: '5ซฌ 7890',
    brand: 'Ford',
    model: 'Ranger',
    year: 2023,
    color: 'ดำ',
    currentMileage: 5000,
    image: 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?auto=format&fit=crop&q=80&w=800'
  }
];

export const INITIAL_RECORDS: MaintenanceRecord[] = [
  {
    id: 'r1',
    carId: 'c1',
    type: MaintenanceType.OIL_CHANGE,
    date: '2024-12-15',
    expiryDate: '2025-06-15',
    cost: 2500,
    provider: 'ศูนย์บริการโตโยต้า',
    notes: 'เปลี่ยนถ่ายน้ำมันเครื่องสังเคราะห์ 100%',
    mileageAtService: 40000
  },
  {
    id: 'r2',
    carId: 'c1',
    type: MaintenanceType.TAX,
    date: '2024-03-20',
    expiryDate: '2025-03-20',
    cost: 1500,
    provider: 'กรมการขนส่งทางบก',
    notes: 'ต่อภาษีประจำปี'
  },
  {
    id: 'r3',
    carId: 'c2',
    type: MaintenanceType.REPAIR,
    date: '2024-11-10',
    cost: 4500,
    provider: 'อู่ช่างหนึ่ง',
    notes: 'เปลี่ยนผ้าเบรคหน้า-หลัง',
    mileageAtService: 81000
  },
  {
    id: 'r4',
    carId: 'c4',
    type: MaintenanceType.PRB,
    date: '2024-05-01',
    expiryDate: '2025-05-01',
    cost: 645,
    provider: 'บ. วิริยะ',
    notes: 'ต่อ พรบ.'
  },
  {
    id: 'r5',
    carId: 'c2',
    type: MaintenanceType.INSURANCE,
    date: '2024-02-01',
    expiryDate: '2025-02-01',
    cost: 18000,
    provider: 'วิริยะประกันภัย',
    notes: 'ประกันชั้น 1'
  },
  {
    id: 'r6',
    carId: 'c3',
    type: MaintenanceType.OIL_CHANGE,
    date: '2024-10-05',
    expiryDate: '2025-04-05',
    cost: 1200,
    provider: 'B-Quik',
    notes: 'สังเคราะห์แท้',
    mileageAtService: 12000
  }
];