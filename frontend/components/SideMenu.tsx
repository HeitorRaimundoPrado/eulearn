"use client"

import { useState, useEffect } from 'react';
import { MdOutlineHome } from 'react-icons/md';
import { IoChatboxEllipsesOutline } from "react-icons/io5";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { CiSettings, CiBookmark } from "react-icons/ci";
import { IoIosInformationCircleOutline } from "react-icons/io";
import { apiGet } from '@/utils/api';
import Link from 'next/link';

export default function Page() {
  const [subjects, setSubjects] = useState<Subject[]>([])

  useEffect(() => {
    apiGet("subjects")
    .then(data => {
      setSubjects(data)
    })
    .catch(err => alert(err))
  }, [])

  return (
    <div className="border-r-2 p-4 border-white border-opacity-[20%] w-[13%] h-full text-xl">
      <div className="[&>*]:flex [&>*]:flex-row [&>*]:items-center [&_p]:ml-4 [&>*]:mb-6 border-b-2 border-white border-opacity-[20%] p-4">
        <Link href="/">
          <MdOutlineHome className="w-8 h-auto"/>
          <p>Página Inicial</p>
        </Link>
        <Link href="/chat-messages">
          <IoChatboxEllipsesOutline className="w-8 h-auto"/>
          <p>Mensagens</p>
        </Link>
      </div>
      <div className="p-4 pb-0 border-b-2 border-opacity-[20%] border-white">
        <h2 className="w-full opacity-[40%]">DISCIPLINAS</h2>
        <ul>
          {
            subjects.map(subj => {
              return (
                <Link href={`/subject/${subj.id}`} className="opacity-[80%] flex flex-row justify-between my-4 items-center">
                  <p className="overflow-hidden whitespace-nowrap text-ellipsis"># {subj.name}</p>
                  <MdOutlineKeyboardArrowDown className="w-6 h-auto"/>
                </Link>
              )
            })
          }
        </ul>
        <MdOutlineKeyboardArrowDown className="w-10 mt-2 h-auto opacity-[20%] m-auto"/>
      </div>
        <div className="[&>*]:flex [&>*]:flex-row [&_p]:ml-4 [&>*]:my-6">
        <Link href="/settings">
          <CiSettings className="w-8 h-auto"/>
          <p>Configurações</p>
        </Link>

        <Link href="/bookmarks">
          <CiBookmark className="w-8 h-auto"/>
          <p>Salvos</p>
        </Link>

        <Link href="/about">
          <IoIosInformationCircleOutline className="w-8 h-auto"/>
          <p>Sobre</p>
        </Link>
      </div>
    </div>
  )
}
