"use client"

import { useState, useEffect } from 'react';
import { apiGet, apiPost } from '@/utils/api';
import CreateQuestion from '@/components/CreateQuestion'
import Question from '@/interfaces/Question';
import Input from '@/components/Input';

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
    //TODO: validate the data in the backend too
    if (newTest.title === '') {
      alert("Você não pode criar uma questão sem título")
      return;
    }

    else if (newTest.title.length < 15) {
      alert("O título da questão deve ser descritivo para ajudar os usuários a pesquisarem pelo tema")
      return;
    }
    apiPost(`tests/`, {...newTest, questions: newTest.questions.map(q => q.id)})
    .then(data => {
      alert("Nova lista de exercícios criada com sucesso!")
    })
  }

  return (
    <div className="w-full flex flex-col">
      <div className="w-full">
        <div className="w-full">
          <Input type="text" placeholder="Título" onChange={(e) => setNewTest({...newTest, title: e.target.value})} className="mb-4 w-[60%]"/>
        </div>
        <div className="w-[60%] border-2 border-white border-opacity-[20%] p-4 rounded-md mb-4">
          <h2>Questões no teste:</h2>
          {
            newTest.questions.map(question => {
              return (
                <div key={question.id} className="flex flex-row items-center my-2">
                  <p>{question.statement}</p>
                  <button className="bg-destructive p-2 border-2 border-white rounded-md ml-10 border-opacity-[20%]" onClick={() => setNewTest({...newTest, questions: newTest.questions.filter(q => q.id !== question.id)})}>Remover questão da lista</button>
                </div>
              )
            })
          }
          {
            newTest.questions.length === 0 &&
              <div className="mt-4">
                <p>Nenhuma!</p>
                <p>Adicione uma questão à sua lista abaixo</p>
              </div>
          }
        </div>
      </div>

      {
        newQuestion ?
          <CreateQuestion subjId={subjId} createQuestionCallback={handleCreateNewQuestion}/>
          :
          <button className="w-fit p-2 bg-secondary border-white border-2 border-opacity-[60%] rounded-md" onClick={() => setNewQuestion(true)}>Criar nova questão</button>
      }


      <div className="my-2">
        {
          subjQuestions.map(question => {
            return (
              <div key={question.id} className="flex flex-row items-center justify-between w-[24%]">
                <p>{question.statement}</p>
                <button className="bg-secondary rounded-md border-2 border-white p-2 border-opacity-[20%] my-2" onClick={() => handleAddQuestion(question)}>Adicionar questão à lista</button>
              </div>
            )
          })
        }
      </div>

      <button className="w-fit p-2 bg-primary rounded-md mt-4" onClick={handleCreateTest}>Criar Teste</button>
    </div>
  )
}
