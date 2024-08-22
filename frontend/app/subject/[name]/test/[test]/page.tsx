"use client";

import { useState, useEffect } from 'react';
import { apiGet, apiPost } from '@/utils/api';

function MapAnswers ({ question, selectAnswer }) {
  const [selectedAnsId, setSelectedAnsId] = useState(-1);

  const handleChangeSelectedAns = (e, id) => {
    selectAnswer(question.id, id)
    setSelectedAnsId(id)
  }

  return question.answers.map((ans, idx) => {
           return (
             <div key={ans.id}>
               <label>{String.fromCharCode('a'.charCodeAt(0)+idx)} {ans.content}</label>
               <input name={`${question.id}`} type="radio" checked={selectedAnsId === ans.id} onChange={(e) => handleChangeSelectedAns(e, ans.id)}/>
             </div>
           )
        })
}


function MapQuestions({ questions, selectAnswer }) {
  return questions.map((question, idx) => {
           return (
             <div key={question.id}>
               <p>{idx+1}. {question.statement}</p>
               <ul>
                 <MapAnswers question={question} selectAnswer={selectAnswer} />
               </ul>
             </div>
           )
         })
}

function ExplanationsAndGrade({ explanations, questions }) {
  console.log(explanations)
  return (
    <div>
    <p>Nota: {explanations.reduce((nota, q) => nota + (q.correct ? 1 : 0), 0)} / {explanations.length}</p>
    {
      explanations.map((q, idx) => {
        return (
        <div>
          <p>Questão {idx}:</p>

          {
            q.correct ?
            <p>Você acertou!</p>
            :
            <>
            <p>Você errou!</p>
            <p>A alternativa correta era: {String.fromCharCode(questions[idx].answers.findIndex(a => a.id === q.correct_ans) + 'a'.charCodeAt(0))}</p>
            </>
          }

          <h2>Explicação: </h2>
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
    <div>
      <h1>{testObj.title}</h1>
      <MapQuestions questions={testObj.questions} selectAnswer={selectAnswer} />
      <button onClick={handleFinishTest} >Terminar teste</button>
      {
        finishedTest && 
        <ExplanationsAndGrade explanations={explanations} questions={testObj.questions}/>
      }
    </div>
  )
}
