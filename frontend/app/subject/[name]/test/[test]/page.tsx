"use client";

import { useState, useEffect } from 'react';
import { apiGet, apiPost } from '@/utils/api';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import BookmarkButton from "@/components/BookmarkButton";

interface Answer {
  id: number;
  content: string;
}

interface Question {
  id: number;
  statement: string;
  answers: Answer[];
}

interface Test {
  title: string;
  author: number;
  created_at: string;
  route: string;
  questions: Question[];
}

interface Explanation {
  id: number;
  correct: boolean;
  already_answered: boolean;
  correct_ans: number;
  explanation: string;
}

interface MapAnswersProps {
  question: Question;
  selectAnswer: (questionId: number, answerId: number) => void;
}

function MapAnswers({ question, selectAnswer }: MapAnswersProps) {
  const [selectedAnsId, setSelectedAnsId] = useState<number>(-1);

  const handleChangeSelectedAns = (id: number) => {
    selectAnswer(question.id, id);
    setSelectedAnsId(id);
  };

  return (
    <RadioGroup onValueChange={(val) => handleChangeSelectedAns(Number(val))}>
      {question.answers.map((ans, idx) => (
        <div key={ans.id} className="flex flex-row mb-2 items-center">
          <RadioGroupItem
            className="mr-4"
            name={`${question.id}`}
            value={ans.id}
            checked={selectedAnsId === ans.id}
          />
          <Label>{String.fromCharCode('a'.charCodeAt(0) + idx)}. {ans.content}</Label>
        </div>
      ))}
    </RadioGroup>
  );
}

interface MapQuestionsProps {
  questions: Question[];
  selectAnswer: (questionId: number, answerId: number) => void;
}

function MapQuestions({ questions, selectAnswer }: MapQuestionsProps) {
  return questions.map((question, idx) => (
    <div key={question.id}>
      <p className="mt-4 mb-2 font-bold text-xl">{idx + 1}. {question.statement}</p>
      <ul className="ml-4">
        <MapAnswers question={question} selectAnswer={selectAnswer} />
      </ul>
    </div>
  ));
}

interface ExplanationsAndGradeProps {
  explanations: Explanation[];
  questions: Question[];
}

function ExplanationsAndGrade({ explanations, questions }: ExplanationsAndGradeProps) {
  return (
    <div className="ml-4">
      <p className="font-bold text-xl my-4">
        Nota: {explanations.reduce((nota, q) => nota + (q.correct ? 1 : 0), 0)} / {explanations.length}
      </p>
      {explanations.map((q, idx) => (
        <div key={q.id} className="border-b-2 border-white-20 mb-2 p-4">
          <p className="my-2 font-bold">Questão {idx + 1}:</p>
          {q.already_answered && (
            <p className="my-2 text-amber-400">
              Você já havia respondido essa questão (ela não provocará alterações no seu rating)
            </p>
          )}
          {q.correct ? (
            <p className="text-green-400">Você acertou!</p>
          ) : (
            <>
              <p className="text-red-400">Você errou!</p>
              <p>
                A alternativa correta era: <span className="text-green-400">
                  {String.fromCharCode(questions[idx].answers.findIndex(a => a.id === q.correct_ans) + 'a'.charCodeAt(0))}
                </span>
              </p>
            </>
          )}
          <div className="my-4">
            <h2 className="font-bold">Explicação: (Questão {idx + 1})</h2>
            <p>{q.explanation}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

interface PageProps {
  params: {
    name: string;
    test: string;
  };
}

export default function Page({ params }: PageProps) {
  const { name, test } = params;

  const [finishedTest, setFinishedTest] = useState<boolean>(false);
  const [testObj, setTestObj] = useState<Test>({
    title: "",
    author: -1,
    created_at: "",
    route: "",
    questions: []
  });

  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [grade, setGrade] = useState<string>("");
  const [explanations, setExplanations] = useState<Explanation[]>([]);

  useEffect(() => {
    apiGet(`test/${test}`)
      .then(data => {
        setTestObj(data);
        setUserAnswers(data.questions.reduce((o: any, q: any) => ({
          ...o,
          [q.id]: -1
        }), {}));
      });
  }, [test]);

  const selectAnswer = (questionId: number, answerId: number) => {
    setUserAnswers(prevAnswers => ({ ...prevAnswers, [questionId]: answerId }));
  };

  const handleFinishTest = () => {
    setFinishedTest(true);
    apiPost(`check-test/${test}`, userAnswers)
      .then(data => setExplanations(data.test_result));
  };

  return (
    <div className="mb-10">
      <h1 className="text-2xl font-bold">{testObj.title}</h1>
      <MapQuestions questions={testObj.questions} selectAnswer={selectAnswer} />
      <button onClick={handleFinishTest} className="bg-primary px-4 py-2 hover:opacity-[80%] transition-all rounded-md my-6 ease-in-out duration-200">
        Terminar teste
      </button>
      {finishedTest && (
        <>
          <ExplanationsAndGrade explanations={explanations} questions={testObj.questions} />
          <BookmarkButton className="ml-4 my-20 w-12 h-12" objectId={test} contentType="test" />
        </>
      )}
    </div>
  );
}