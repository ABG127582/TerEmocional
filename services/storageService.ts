import { Assessment, SafetyPlan } from '../types';

const STORAGE_KEY = 'emotional_assessments';
const THEME_KEY = 'theme_preference';
const SAFETY_PLAN_KEY = 'safety_plan_v1';

export const storageService = {
  getAssessments: (): Assessment[] => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (err) {
      return [];
    }
  },
  saveAssessment: (assessment: Omit<Assessment, 'id' | 'timestamp'>): boolean => {
    try {
      const assessments = storageService.getAssessments();
      const newAssessment: Assessment = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        ...assessment
      };
      assessments.push(newAssessment);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(assessments));
      return true;
    } catch (err) {
      return false;
    }
  },
  deleteAssessment: (id: number): boolean => {
    try {
      const assessments = storageService.getAssessments();
      const filtered = assessments.filter(a => a.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
      return true;
    } catch (err) {
      return false;
    }
  },
  clearAssessments: (): boolean => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      return true;
    } catch (err) {
      return false;
    }
  },
  // --- IMPORT/RESTORE ---
  importAssessments: (newAssessments: Assessment[]): { success: boolean; count: number } => {
    try {
      if (!Array.isArray(newAssessments)) return { success: false, count: 0 };
      
      // Validação básica de schema
      const validAssessments = newAssessments.filter(a => 
        a.timestamp && a.emotion && typeof a.level === 'number'
      );

      if (validAssessments.length === 0) return { success: false, count: 0 };

      const current = storageService.getAssessments();
      
      // Merge evitando duplicatas exatas de ID ou Timestamp
      const currentIds = new Set(current.map(c => c.id || c.timestamp));
      let addedCount = 0;

      validAssessments.forEach(a => {
        const key = a.id || a.timestamp;
        if (!currentIds.has(key)) {
          current.push(a);
          addedCount++;
        }
      });

      // Re-ordenar por data
      current.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

      localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
      return { success: true, count: addedCount };
    } catch (err) {
      return { success: false, count: 0 };
    }
  },
  saveTheme: (theme: 'light' | 'dark'): void => {
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch (err) {
        // ignore write error
    }
  },
  getTheme: (): 'light' | 'dark' => {
    try {
      const theme = localStorage.getItem(THEME_KEY);
      return (theme === 'dark' || theme === 'light') ? theme : 'dark';
    } catch (err) {
      return 'dark';
    }
  },
  // --- SAFETY PLAN ---
  getSafetyPlan: (): SafetyPlan => {
    try {
      const raw = localStorage.getItem(SAFETY_PLAN_KEY);
      if (raw) return JSON.parse(raw);
      return {
        contacts: [],
        copingPhantom: "Isso é temporário. Eu já sobrevivi a dias difíceis antes.",
        safePlace: "Meu quarto, ouvindo chuva."
      };
    } catch (err) {
      return { contacts: [], copingPhantom: "", safePlace: "" };
    }
  },
  saveSafetyPlan: (plan: SafetyPlan): boolean => {
    try {
      localStorage.setItem(SAFETY_PLAN_KEY, JSON.stringify(plan));
      return true;
    } catch (err) {
      return false;
    }
  }
};