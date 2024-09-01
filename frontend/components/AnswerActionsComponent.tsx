"use client";

import VoteButtons from './VoteButtons';
import { AnswerButton, AnswerForm } from './AddAnswerComponent'
import { useState } from 'react';

interface AnswerActionsProps {
  net_votes: number,
  parent_post: number
}

export default function AnswerActionsComponent({ net_votes, parent_post }: AnswerActionsProps) {
  const [openForm, setOpenForm] = useState(false);

  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-row items-center mb-4">
        <VoteButtons net_votes={net_votes} post={parent_post} className="mr-4"/>
        <AnswerButton onClick={() => setOpenForm(old => !old)}/>
      </div>
      {
        openForm &&
          <AnswerForm parent_post={parent_post} closeForm={() => setOpenForm(false)} className="w-[70%] h-44 mb-4"/>
      }
    </div>
  )
}
