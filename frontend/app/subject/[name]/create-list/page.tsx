"use client"

import { useState, useEffect } from 'react';
import { apiGet, apiPost } from '@/utils/api';
import CreateQuestion from '@/components/CreateQuestion'
import Question from '@/interfaces/Question';

export default function Page({ params }) {
  const { name } = params;
  const [subjId, setSubjId] = useState(null);
  const [newQuestion, setNewQuestion] = useState(false);
  const [newTest, setNewTest] = useState<Test>({
    title: "",
    subject: -1,
    questions: []
  })

  const [subjQuestions, setSubjQuestions] = useState<Question[]> ([])

  useEffect(() => {
    apiGet(`subject/${name}`)
    .then(data => {
      setSubjId(data.id)
      setNewTest({...newTest, subject: data.id})
    });
  }, [])

  
  useEffect(() => {
    if (subjId !== null) {
      apiGet(`questions/?subject=${subjId}`)
      .then(data => {
        setSubjQuestions(data);
      })
    }
  }, [subjId])

  const handleAddQuestion = (question) => {
    if (newTest.questions.includes(question)) {
      return;
    }

    setNewTest({...newTest, questions: [...newTest.questions, question]})
  }

  const handleCreateNewQuestion = (question) => {
    setNewQuestion(false);
    setNewTest({...newTest, questions: [...newTest.questions, question]})
    alert("Nova questão criada com sucesso")
  }

  const handleCreateTest = () => {
    apiPost(`tests/`, {...newTest, questions: newTest.questions.map(q => q.id)})
    .then(data => {
      alert("Nova lista de exercícios criada com sucesso!")
    })
  }

  return (
    <div>
      <div>
        <div>
          <label>Título da prova:</label>
          <input type="text" onChange={(e) => setNewTest({...newTest, title: e.target.value})}/>
        </div>
        <div>
        </div>
        <h2>Questões no teste:</h2>
        {
          newTest.questions.map(question => {
            return (
              <div key={question.id} className="flex flex-row">
                <p>{question.statement}</p>
                <button onClick={() => setTestQuestions(newTest.questions.filter(q => q.id !== question.id))}>Remover questão da lista</button>
              </div>
            )
          })
        }
      </div>

      {
        newQuestion ?
          <CreateQuestion subjId={subjId} createQuestionCallback={handleCreateNewQuestion}/>
          :
          <button onClick={() => setNewQuestion(true)}>Criar nova questão</button>
      }


      {
        subjQuestions.map(question => {
          return (
            <div key={question.id} className="flex flex-row">
              <p>{question.statement}</p>
              <button onClick={() => handleAddQuestion(question)}>Adicionar questão à lista</button>
            </div>
          )
        })
      }

      <button onClick={handleCreateTest}>Criar Teste</button>
    </div>
  )
}
