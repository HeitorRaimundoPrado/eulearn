
"use client";

import { useEffect, useState } from 'react';
import { apiPost, apiGet } from '@/utils/api';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import Answer from '@/interfaces/Answer';
import Input from '@/components/Input';
import Textarea from '@/components/Textarea';
import { Label } from "@/components/ui/label"

export default function CreateQuestion({ subjId, createQuestionCallback, className="" }) {
  const [question, setQuestion] = useState({
    statement: "",
    explanation: "",
    subject: subjId
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
    console.log(answers_)
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
    <div className={`${className} [&>*]:w-full`}>
      <div className="mb-4">
        <Input placeholder={"Enunciado"} onChange={e => setQuestion({...question, statement: e.target.value})} className="w-[60%]"/>
      </div>

      <div className="mb-4">
        <Textarea onChange={e => setQuestion({...question, explanation: e.target.value})} placeholder={"Explicação"} className="h-56 w-[60%]"/>
      </div>

      <RadioGroup className="my-2 px-4 p-2" onValueChange={handleChangeCorrect}>
        {
          answers.map((answer, idx) => (
            <div className="flex flex-row mb-2 justify-between items-center" key={idx}>
              <RadioGroupItem id={`answer_${idx}`} name="isCorrect" value={idx} checked={answer.is_correct}/>
              <Label htmlFor={`answer_${idx}`} className="text-left grow ml-4">{answer.content}</Label>
            </div>
          ))

        }
      </RadioGroup>
            
      <div className="flex flex-row justify-between !w-[60%]">
        <Input onChange={(e) => setNewAnswer(ans => {
            return {...ans, content: e.target.value}
          })} className="w-[60%]" placeholder="Nova Resposta"
          />

        <button onClick={addAnswer} className="bg-secondary p-2 rounded-md border-2 border-white border-opacity-[20%]">Adicionar nova resposta</button>
      </div>
      <button className="!w-fit bg-accent p-2 border-2 border-white border-opacity-[20%] rounded-md mt-4" onClick={createQuestion}>Criar Questão</button>
    </div>
  )
}
