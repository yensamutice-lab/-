import { GoogleGenAI } from "@google/genai";
import { Car, MaintenanceRecord } from "../types";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing");
  }
  return new GoogleGenAI({ apiKey });
};

export const analyzeFleetMaintenance = async (cars: Car[], records: MaintenanceRecord[]) => {
  try {
    const client = getClient();
    
    // Prepare data summary for AI
    const summary = cars.map(car => {
      const carRecords = records.filter(r => r.carId === car.id);
      return {
        car: `${car.brand} ${car.model} (${car.licensePlate})`,
        mileage: car.currentMileage,
        history: carRecords.map(r => ({
          type: r.type,
          date: r.date,
          cost: r.cost,
          notes: r.notes,
          expiry: r.expiryDate
        }))
      };
    });

    const prompt = `
      คุณคือหัวหน้าช่างยนต์ผู้เชี่ยวชาญ (Senior Fleet Manager)
      กรุณาวิเคราะห์ข้อมูลการซ่อมบำรุงของรถบริษัททั้ง ${cars.length} คันนี้
      
      ข้อมูลรถและประวัติ:
      ${JSON.stringify(summary, null, 2)}

      สิ่งที่ต้องการให้วิเคราะห์ (ตอบเป็นภาษาไทย รูปแบบ Markdown):
      1. สรุปภาพรวมสถานะสุขภาพของรถแต่ละคัน (ดี/ต้องเฝ้าระวัง/วิกฤต)
      2. แจ้งเตือนรายการที่ "หมดอายุ" หรือ "ใกล้ถึงกำหนด" (ดูจาก expiryDate เทียบกับวันนี้ ${new Date().toISOString().split('T')[0]})
      3. วิเคราะห์ความคุ้มค่า หรือความผิดปกติของค่าใช้จ่าย (ถ้ามี)
      4. คำแนะนำในการบำรุงรักษาครั้งต่อไปสำหรับรถแต่ละคัน

      ใช้ภาษาที่เป็นทางการ เข้าใจง่าย และจัดรูปแบบให้อ่านง่าย
    `;

    const response = await client.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    return response.text;

  } catch (error) {
    console.error("Error analyzing fleet:", error);
    return "ไม่สามารถวิเคราะห์ข้อมูลได้ในขณะนี้ กรุณาลองใหม่อีกครั้ง หรือตรวจสอบ API Key";
  }
};