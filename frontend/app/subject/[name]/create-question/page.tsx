"use client";

import { useEffect, useState } from 'react';
import { apiPost, apiGet } from '@/utils/api';
import Answer from '@/interfaces/Answer';

export default function Page({ params }) {
  const { name } = params;
  const [question, setQuestion] = useState({
    statement: "",
  })

  const [subject, setSubject] = useState(null);
  const [answers, setAnswers] = useState<Answer[]>([])
  const [newAnswer, setNewAnswer] = useState<Answer>({
    content: "",
    is_correct: false
  })

  useEffect(() => {
    apiGet(`subjects/?name=${name}`)
    .then(result => {
      if (result.length === 0)  {
        alert("Você está acessando uma página não existente")
        return;
      }

      setSubject(result[0].id)
    })
  }, [])

  const addAnswer = () => {
    if (answers.length === 5) {
      return;
    }

    setAnswers([...answers, newAnswer]);
    setNewAnswer({
      is_correct: false,
      content: ""
    })
  }

  const handleChangeCorrect = (idx: number) => {
    let answers_ = answers.map(a => {
      return {...a, is_correct: false }
    });

    answers_[idx].is_correct = true;
    setAnswers(answers_)
  }

  const createQuestion = () => {
    apiPost('questions/', {
     ...question,
     answers: answers,
     subject: subject
   })
    .then(data => {
    alert("Questão criada com sucesso")
    })
  }

  return (
    <div>
      
      <div>
        <label>Enunciado da Questão</label>
        <input type="text" onChange={e => setQuestion({...question, statement: e.target.value})}/>
      </div>

      {
        answers.map((answer, idx) => (
          <div className="flex flex-row" key={idx}>
            <label>{answer.content}</label>
            <input type="radio" name="isCorrect" onChange={() => handleChangeCorrect(idx)} checked={answer.is_correct}/>
          </div>
        ))

      }
            
      <input onChange={(e) => setNewAnswer(ans => {
          return {...ans, content: e.target.value}
        })}/>

      <button onClick={addAnswer}>Adicionar nova resposta</button>
      <button onClick={createQuestion}>Criar Questão</button>
    </div>
  )
}
