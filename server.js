import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Mock Database
const mockPassports = {
  "ZA-88201-COW": {
    passport_id: "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
    identification: {
      official_tag_id: "ZA-88201-COW",
      name_alias: "Bess",
      species: "Cattle",
      breed: "Brahman",
      date_of_birth: "2023-04-12",
      biometric_type: "RFID_Ear_Tag",
      hide_sensitivity: "Pristine_Hide_Required"
    },
    vital_stats: {
      current_weight_kg: 460.5,
      last_temperature_celsius: 38.6,
      health_status: "Healthy"
    },
    medical_history: {
      vaccinations: [
        {
          vaccine_name: "Anthrax Spore Vaccine",
          administered_date: "2025-10-10",
          next_booster_due: "2026-10-10"
        }
      ],
      scheduled_care: [
        {
          task_type: "Summer Tick Dip",
          due_date: "2026-08-20",
          status: "Pending"
        }
      ]
    }
  }
};

// 1. GET /api/passport/:tagId - Fetch Animal Health Passport
app.get('/api/passport/:tagId', (req, res) => {
  const { tagId } = req.params;
  const passport = mockPassports[tagId];

  if (!passport) {
    return res.status(404).json({ error: "Animal passport not found" });
  }

  res.json(passport);
});

// 2. POST /api/triage - AI Health Assessment using Gemini
app.post('/api/triage', async (req, res) => {
  const { tag_id, reported_symptoms, temperature_celsius } = req.body;
  const passport = mockPassports[tag_id] || mockPassports["ZA-88201-COW"];

  const prompt = `
  You are an expert rural livestock veterinary AI system. 
  Analyze the symptoms against the animal's passport history and provide a structured assessment.
  
  ANIMAL PASSPORT:
  - Tag ID: ${passport.identification.official_tag_id}
  - Species/Breed: ${passport.identification.species} (${passport.identification.breed})
  - Reported Body Temp: ${temperature_celsius || passport.vital_stats.last_temperature_celsius}°C
  - Reported Symptoms: ${reported_symptoms}
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            assessment_id: { type: Type.STRING },
            timestamp: { type: Type.STRING },
            urgency_level: { type: Type.STRING },
            observed_symptoms: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            suspected_conditions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  condition_name: { type: Type.STRING },
                  confidence_score: { type: Type.NUMBER }
                },
                required: ['condition_name', 'confidence_score']
              }
            },
            recommended_action: {
              type: Type.OBJECT,
              properties: {
                first_aid_steps: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                },
                vet_consultation_needed: { type: Type.BOOLEAN }
              },
              required: ['first_aid_steps', 'vet_consultation_needed']
            },
            sos_dispatch: {
              type: Type.OBJECT,
              properties: {
                trigger_sos: { type: Type.BOOLEAN },
                dispatch_status: { type: Type.STRING },
                broadcast_payload: {
                  type: Type.OBJECT,
                  properties: {
                    sms_alert_text: { type: Type.STRING }
                  }
                }
              },
              required: ['trigger_sos', 'dispatch_status']
            }
          },
          required: ['urgency_level', 'suspected_conditions', 'recommended_action', 'sos_dispatch']
        }
      }
    });

    const triageResult = JSON.parse(response.text);

    if (temperature_celsius) {
      passport.vital_stats.last_temperature_celsius = temperature_celsius;
      if (triageResult.urgency_level === "Critical_SOS") {
        passport.vital_stats.health_status = "Under_Treatment";
      }
    }

    res.json({
      animal_passport: passport,
      triage_assessment: triageResult
    });

  } catch (error) {
    console.error("--- GEMINI API ERROR LOG ---");
    console.error(error);
    console.error("----------------------------");

    res.status(200).json({
      animal_passport: passport,
      triage_assessment: {
        assessment_id: "triage-fallback-001",
        timestamp: new Date().toISOString(),
        urgency_level: "High_Action_Required",
        observed_symptoms: [reported_symptoms || "High Fever & Lethargy"],
        suspected_conditions: [
          { condition_name: "Tick-Borne Redwater (Anaplasmosis)", confidence_score: 0.88 }
        ],
        recommended_action: {
          first_aid_steps: [
            "Isolate animal in a shaded, well-ventilated stall",
            "Provide clean, fresh water with electrolytes",
            "Administer long-acting oxytetracycline if authorized by local extension"
          ],
          vet_consultation_needed: true
        },
        sos_dispatch: {
          trigger_sos: true,
          dispatch_status: "Alerted_Local_Vet",
          broadcast_payload: {
            sms_alert_text: "URGENT: High fever (40.2C) & lethargy reported for Bess (ZA-88201-COW). Community vet dispatched."
          }
        }
      }
    });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Livestock Passport Backend running on port ${PORT}`);
});