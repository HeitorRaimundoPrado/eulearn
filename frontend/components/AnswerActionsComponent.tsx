"use client";

import VoteButtons from './VoteButtons';
import { AnswerButton, AnswerForm } from './AddAnswerComponent'
import { useState } from 'react';

interface AnswerActionsComponentProps {
  netVotes: number;
  parentPost: number;
}

export default function AnswerActionsComponent({ netVotes, parentPost }: AnswerActionsComponentProps) {
  const [openForm, setOpenForm] = useState(false);

  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-row items-center mb-4">
        <VoteButtons net_votes={netVotes} post={parentPost} className="mr-4"/>
        <AnswerButton onClick={() => setOpenForm(old => !old)}/>
      </div>
      {
        openForm &&
          <AnswerForm parent_post={parentPost} closeForm={() => setOpenForm(false)} className="w-[70%] h-44 mb-4"/>
      }
    </div>
  )
}
