"use client";

import { useState, useEffect } from 'react';
import { apiGet, apiPost } from '@/utils/api';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

function MapAnswers ({ question, selectAnswer }) {
  const [selectedAnsId, setSelectedAnsId] = useState(-1);

  const handleChangeSelectedAns = (id) => {
    selectAnswer(question.id, id)
    setSelectedAnsId(id)
  }

  return (
    <RadioGroup onValueChange={(val) => handleChangeSelectedAns(val)}>
      {
        question.answers.map((ans, idx) => {
           return (
             <div key={ans.id} className="flex flex-row mb-2 items-center" >
               <RadioGroupItem className="mr-4" name={`${question.id}`} value={ans.id} checked={selectedAnsId === ans.id}/>
               <Label>{String.fromCharCode('a'.charCodeAt(0)+idx)}. {ans.content}</Label>
             </div>
           )
        })
      }
    </RadioGroup>
  )
}


function MapQuestions({ questions, selectAnswer }) {
  return questions.map((question, idx) => {
           return (
             <div key={question.id}>
               <p className="mt-4 mb-2 font-bold text-xl">{idx+1}. {question.statement}</p>
               <ul className="ml-4">
                 <MapAnswers question={question} selectAnswer={selectAnswer} />
               </ul>
             </div>
           )
         })
}

function ExplanationsAndGrade({ explanations, questions }) {
  return (
    <div className="ml-4">
    <p className=" font-bold text-xl my-4">Nota: {explanations.reduce((nota, q) => nota + (q.correct ? 1 : 0), 0)} / {explanations.length}</p>
    {
      explanations.map((q, idx) => {
        return (
        <div key={q.id} className="ml-2">
          <p className="my-2 font-bold">Questão {idx+1}:</p>

          {
            q.correct ?
            <p className="text-green-400">Você acertou!</p>
            :
            <>
            <p className="text-red-400">Você errou!</p>
            <p>A alternativa correta era: <span className="text-green-400">{String.fromCharCode(questions[idx].answers.findIndex(a => a.id === q.correct_ans) + 'a'.charCodeAt(0))}</span></p>
            </>
          }

          <h2 className="font-bold">Explicação: (Questão {idx+1})</h2>
          <p>{q.explanation}</p>
        </div>
        )
      })
    }
    </div>
  )
}

export default function Page({ params }) {
  const { name, test } = params;

  const [finishedTest, setFinishedTest] = useState(false);
  const [testObj, setTestObj] = useState<Test>({
    title: "",
    author: -1,
    created_at: "",
    route: "",
    questions: []
  })

  const [userAnswers, setUserAnswers] = useState({})
  const [grade, setGrade] = useState("")
  const [explanations, setExplanations] = useState([]);

  useEffect(() => {
    apiGet(`test/${test}`)
    .then(data => {
      setTestObj(data);

      setUserAnswers(data.questions.reduce((o, q) => {
        return {...o, [q.id]: -1}
      }, {}))

      // creates an object that maps each question id to the corresponding id of the answer
      // selected by the user for that question
      //
      // if the user has not selected an answer for that question the value is -1
    })
  }, [])


  const selectAnswer = (question, answer) => {
    setUserAnswers({...userAnswers, [question]: answer})
  }

  const handleFinishTest = () => {
    setFinishedTest(true);
    apiPost(`check-test/`, userAnswers)
    .then(data => setExplanations(data.test_result));
  }
  
  return (
    <div className="mb-10">
        <h1 className="text-2xl font-bold">{testObj.title}</h1>
      <MapQuestions questions={testObj.questions} selectAnswer={selectAnswer} />
      <button onClick={handleFinishTest} className="bg-primary px-4 py-2 hover:opacity-[80%] transition-all rounded-md my-6 ease-in-out duration-200">Terminar teste</button>
      {
        finishedTest && 
        <ExplanationsAndGrade explanations={explanations} questions={testObj.questions}/>
      }
    </div>
  )
}
