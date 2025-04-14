
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useTheoryTest } from '@/context/TheoryTestContext';
import Layout from '@/components/Layout/Layout';
import { AlertCircle, CheckCircle2, ArrowRight, Undo2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const TheoryTest = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const {
    questions,
    startTest,
    submitTest,
    testStarted,
    testFinished,
    testResults,
    resetTest,
  } = useTheoryTest();
  
  const [answers, setAnswers] = useState<number[]>(Array(questions.length).fill(-1));

  if (!user || user.role !== 'student') {
    return (
      <Layout>
        <div className="text-center py-10">
          <h1 className="text-2xl font-bold">Unauthorized Access</h1>
          <p className="mt-4">You must be logged in as a student to take this test.</p>
          <Button className="mt-4" onClick={() => navigate('/login')}>
            Go to Login
          </Button>
        </div>
      </Layout>
    );
  }

  const handleAnswerSelect = (questionIndex: number, answerIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex] = answerIndex;
    setAnswers(newAnswers);
  };

  const handleStartTest = () => {
    startTest();
    setAnswers(Array(questions.length).fill(-1));
  };

  const handleSubmitTest = () => {
    submitTest(answers);
  };

  const areAllQuestionsAnswered = answers.every((answer) => answer !== -1);

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold mb-2 rtl">מבחן תיאוריה</h1>
          <p className="text-muted-foreground rtl">
            מבחן תרגול לקראת מבחן התיאוריה הרשמי
          </p>
        </div>

        {!testStarted && !testFinished && (
          <Card>
            <CardHeader>
              <CardTitle className="rtl">הוראות למבחן</CardTitle>
              <CardDescription className="rtl">קרא בעיון לפני שתתחיל</CardDescription>
            </CardHeader>
            <CardContent className="rtl space-y-4">
              <p>המבחן כולל 10 שאלות אמריקאיות</p>
              <p>לכל שאלה יש 4 תשובות אפשריות, עליך לבחור את התשובה הנכונה</p>
              <p>על מנת לעבור את המבחן עליך לענות נכון על לפחות 8 שאלות</p>
              <p>בהצלחה!</p>
            </CardContent>
            <CardFooter>
              <Button onClick={handleStartTest} className="w-full rtl">
                התחל מבחן
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        )}

        {testStarted && !testFinished && (
          <div className="space-y-6">
            {questions.map((question, questionIndex) => (
              <Card key={question.id}>
                <CardHeader>
                  <CardTitle className="rtl flex items-start">
                    <span className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center mr-2 flex-shrink-0">
                      {questionIndex + 1}
                    </span>
                    <span>{question.question}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup
                    value={answers[questionIndex]?.toString()}
                    className="rtl space-y-3"
                  >
                    {question.options.map((option, optionIndex) => (
                      <div
                        key={optionIndex}
                        className="flex items-center space-x-2 space-x-reverse border p-3 rounded-md hover:bg-muted/50 cursor-pointer"
                        onClick={() => handleAnswerSelect(questionIndex, optionIndex)}
                      >
                        <RadioGroupItem value={optionIndex.toString()} id={`q${questionIndex}-o${optionIndex}`} />
                        <Label htmlFor={`q${questionIndex}-o${optionIndex}`} className="cursor-pointer w-full">
                          {option}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </CardContent>
              </Card>
            ))}

            <div className="flex justify-center">
              <Button 
                onClick={handleSubmitTest} 
                disabled={!areAllQuestionsAnswered}
                className="w-full max-w-md rtl"
              >
                הגש מבחן
              </Button>
            </div>

            {!areAllQuestionsAnswered && (
              <div className="text-center text-muted-foreground rtl">
                יש לענות על כל השאלות לפני הגשת המבחן
              </div>
            )}
          </div>
        )}

        {testFinished && testResults && (
          <Card>
            <CardHeader>
              <CardTitle className={`text-center rtl ${
                testResults.passed ? 'text-green-600' : 'text-red-600'
              }`}>
                {testResults.passed ? (
                  <CheckCircle2 className="inline-block mr-2 h-6 w-6" />
                ) : (
                  <AlertCircle className="inline-block mr-2 h-6 w-6" />
                )}
                {testResults.passed
                  ? 'ברכות! עברת את המבחן'
                  : 'מצטערים, נכשלת במבחן'}
              </CardTitle>
              <CardDescription className="text-center rtl text-lg">
                ציון: {testResults.score} / 10
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center rtl">
              <p className="mb-4">
                {testResults.passed
                  ? 'כל הכבוד! יש לך הבנה טובה של חוקי התנועה'
                  : 'אל דאגה, אתה יכול לנסות שוב. המשך ללמוד את החומר'}
              </p>
            </CardContent>
            <CardFooter className="flex justify-between flex-col sm:flex-row gap-3">
              <Button onClick={resetTest} variant="outline" className="w-full sm:w-auto rtl">
                <Undo2 className="mr-2 h-4 w-4" />
                נסה שוב
              </Button>
              <Button onClick={() => navigate('/dashboard')} className="w-full sm:w-auto rtl">
                חזרה לדף הבית
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default TheoryTest;
