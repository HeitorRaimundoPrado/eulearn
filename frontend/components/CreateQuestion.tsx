
"use client";

import { useEffect, useState } from 'react';
import { apiPost, apiGet } from '@/utils/api';
import Answer from '@/interfaces/Answer';

export default function CreateQuestion({ subjId, createQuestionCallback }) {
  const [question, setQuestion] = useState({
    statement: "",
    explanation: ""
  })

  const [answers, setAnswers] = useState<Answer[]>([])
  const [newAnswer, setNewAnswer] = useState<Answer>({
    content: "",
    is_correct: false
  })


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
    let is_valid = 0;
    for (const answer of answers) {
      if (answer.is_correct == true) {
        is_valid++;
      }
    }

    if (is_valid !== 1) {
      alert("Sua pergunta deve ter exatamente uma resposta correta!")
    }

    apiPost('questions/', {
     ...question,
     answers: answers,
     subject: subjId
   })
    .then(data => {
      createQuestionCallback(data)
    })
  }

  return (
    <div>
      <div>
        <label>Enunciado da Questão</label>
        <input type="text" onChange={e => setQuestion({...question, statement: e.target.value})}/>
      </div>

      <div>
        <label>Explicação</label>
        <textarea onChange={e => setQuestion({...question, explanation: e.target.value})}/>
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
