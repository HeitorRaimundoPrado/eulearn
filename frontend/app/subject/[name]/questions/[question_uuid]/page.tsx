"use client"
import { useEffect, useState } from 'react'
import { apiGet } from '@/utils/api'

export default function Page({params}) {
  const { name, question_uuid } = params;

  const [question, setQuestion] = useState(null);
  const [selectedAns, setSelectedAns] = useState(null);
  const [explanation, setExplanation] = useState("");
  
  useEffect(() => {
    apiGet(`questions/?route=${question_uuid}`)
    .then(data => {
      console.log(data)
      if (data.length === 1) {
        setQuestion(data[0])
        setSelectedAns(data[0].answers[0].id)
        return
      }

      alert("Você está tentando acessar uma questão que não existe!!")
    })
  }, [])

  const handleCheckAnswer = () => {
    apiGet(`answers/${selectedAns}`)
    .then(data => {
      if (data.is_correct) {
        alert('Você acertou');
        return;
      }

      alert('Você errou');
    })
  }

  const handleExplanation = () => {
    apiGet(`questions/?route=${question_uuid}&get_explanation=1`)
    .then(data => {
      if (data.length !== 1) {
        alert('Algo aconteceu e não fomos capazes de achar a explicação para essa questão!')
        return;
      }

      setExplanation(data[0].explanation);
    })
  }


  if (question === null) {
    return (
      <div>loading... {question}</div>
    )
  }

  return (
    <div>
      <h1>{question.statement}</h1>
      <ul>
      {
        question.answers.map((ans, idx) => (
          <div key={idx}>
            <label>{ans.content}</label>
            <input type="radio" onChange={() => setSelectedAns(ans.id)} checked={ans.id === selectedAns}/>
          </div>
        ))
      }
      </ul>
      {
        explanation !== "" &&
        <div>
          <h2>Explicação:</h2>
          <p>{explanation}</p>
        </div>
      }
      <button onClick={handleCheckAnswer}>Checar Resposta</button>
      <button onClick={handleExplanation}>Mostrar explicação</button>
    </div>
  )
}
