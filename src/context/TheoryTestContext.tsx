
import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface TestQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
}

interface TheoryTestContextType {
  questions: TestQuestion[];
  startTest: () => void;
  submitTest: (answers: number[]) => { passed: boolean; score: number };
  testStarted: boolean;
  testFinished: boolean;
  testResults: { passed: boolean; score: number } | null;
  resetTest: () => void;
}

// Hebrew theory test questions
const THEORY_TEST_QUESTIONS: TestQuestion[] = [
  {
    id: 1,
    question: "מה פירוש רמזור אדום?",
    options: [
      "א. האט לקראת עצירה",
      "ב. עצור והמתן מאחורי הקו",
      "ג. עצור רק אם יש תנועה חוצה",
      "ד. המשך בזהירות"
    ],
    correctAnswer: 1 // Index of correct answer (option B)
  },
  {
    id: 2,
    question: "מהי המהירות המרבית המותרת בדרך עירונית (אם אין תמרור אחר)?",
    options: [
      "א. 50 קמ״ש",
      "ב. 60 קמ״ש",
      "ג. 70 קמ״ש",
      "ד. 80 קמ״ש"
    ],
    correctAnswer: 0 // Index of correct answer (option A)
  },
  {
    id: 3,
    question: "מתי מותר לעקוף מצד ימין?",
    options: [
      "א. אף פעם",
      "ב. כשהרכב שלפניך מאותת שמאלה",
      "ג. בכל פעם שהנתיב פנוי",
      "ד. בכביש רב-נתיבי"
    ],
    correctAnswer: 1 // Index of correct answer (option B)
  },
  {
    id: 4,
    question: "מה תפקידה של חגורת הבטיחות?",
    options: [
      "א. למנוע את התנעת הרכב ללא חגירה",
      "ב. לשמור על מיקום הנהג במקרה של תאונה",
      "ג. להפחית רעש בזמן נסיעה",
      "ד. כל התשובות נכונות"
    ],
    correctAnswer: 1 // Index of correct answer (option B)
  },
  {
    id: 5,
    question: "כיצד יש לנהוג כשמתקרבים למעבר חצייה עם הולך רגל המתכוון לחצות?",
    options: [
      "א. לצפור כדי להזהיר את הולך הרגל",
      "ב. להמשיך בנסיעה אם הולך הרגל טרם התחיל לחצות",
      "ג. להאט ולעצור כדי לאפשר לו לעבור",
      "ד. לנסוע מהר יותר כדי לעבור לפני שהולך הרגל מתחיל לחצות"
    ],
    correctAnswer: 2 // Index of correct answer (option C)
  },
  {
    id: 6,
    question: "מהו המרחק החוקי לעצירה לפני מעבר חצייה?",
    options: [
      "א. 3 מטר",
      "ב. 5 מטר",
      "ג. 10 מטר",
      "ד. 12 מטר"
    ],
    correctAnswer: 1 // Index of correct answer (option B)
  },
  {
    id: 7,
    question: "כיצד עליך לנהוג כשאתה רואה תמרור \"תן זכות קדימה\"?",
    options: [
      "א. עצור תמיד",
      "ב. האט ל-30 קמ\"ש",
      "ג. תן זכות קדימה לתנועה בדרך החוצה",
      "ד. המשך בנסיעה רגילה"
    ],
    correctAnswer: 2 // Index of correct answer (option C)
  },
  {
    id: 8,
    question: "מה אסור לעשות בכביש רטוב אחרי גשם ראשון?",
    options: [
      "א. להדליק אורות",
      "ב. להפעיל מגבים",
      "ג. לנסוע מהר או לבלום בפתאומיות",
      "ד. להפעיל חימום"
    ],
    correctAnswer: 2 // Index of correct answer (option C)
  },
  {
    id: 9,
    question: "מה המשמעות של תמרור עצור?",
    options: [
      "א. עצור רק אם יש תנועה",
      "ב. האט ועצור לפי הצורך",
      "ג. עצור תמיד, גם אם אין תנועה",
      "ד. עצור רק בשעות העומס"
    ],
    correctAnswer: 2 // Index of correct answer (option C)
  },
  {
    id: 10,
    question: "מה עליך לעשות כאשר אתה מתקרב לצומת לא מרומזר?",
    options: [
      "א. לצפור כדי להזהיר נהגים אחרים",
      "ב. להאיץ כדי לעבור את הצומת מהר",
      "ג. להאט ולתת זכות קדימה לפי הסדר הנכון",
      "ד. להישאר באמצע הכביש"
    ],
    correctAnswer: 2 // Index of correct answer (option C)
  }
];

const TheoryTestContext = createContext<TheoryTestContextType | undefined>(undefined);

export const TheoryTestProvider = ({ children }: { children: ReactNode }) => {
  const [testStarted, setTestStarted] = useState(false);
  const [testFinished, setTestFinished] = useState(false);
  const [testResults, setTestResults] = useState<{ passed: boolean; score: number } | null>(null);
  const [questions] = useState<TestQuestion[]>(THEORY_TEST_QUESTIONS);

  const startTest = () => {
    setTestStarted(true);
    setTestFinished(false);
    setTestResults(null);
  };

  const submitTest = (answers: number[]) => {
    let correctCount = 0;

    for (let i = 0; i < questions.length; i++) {
      if (answers[i] === questions[i].correctAnswer) {
        correctCount++;
      }
    }

    const passed = correctCount >= 8; // Pass if 8 or more answers are correct
    const results = { passed, score: correctCount };
    
    setTestResults(results);
    setTestFinished(true);
    
    return results;
  };

  const resetTest = () => {
    setTestStarted(false);
    setTestFinished(false);
    setTestResults(null);
  };

  return (
    <TheoryTestContext.Provider
      value={{
        questions,
        startTest,
        submitTest,
        testStarted,
        testFinished,
        testResults,
        resetTest,
      }}
    >
      {children}
    </TheoryTestContext.Provider>
  );
};

export const useTheoryTest = () => {
  const context = useContext(TheoryTestContext);
  if (context === undefined) {
    throw new Error('useTheoryTest must be used within a TheoryTestProvider');
  }
  return context;
};
