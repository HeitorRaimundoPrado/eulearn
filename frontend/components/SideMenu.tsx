"use client"

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { apiGet } from '@/utils/api';
import Link from 'next/link';

import { GoHome } from "react-icons/go";
import { GoHomeFill } from "react-icons/go";
import { IoChatboxEllipsesOutline } from "react-icons/io5";
import { IoChatboxEllipses } from "react-icons/io5";
import { BsPlusCircle } from "react-icons/bs";
import { BsPlusCircleFill } from "react-icons/bs";
import { SlArrowDown } from "react-icons/sl";
import { BsBookmark } from "react-icons/bs";
import { BsBookmarkFill } from "react-icons/bs";
import { IoSettingsOutline } from "react-icons/io5";
import { IoSettingsSharp } from "react-icons/io5";
import { IoIosInformationCircleOutline } from "react-icons/io";
import { IoMdInformationCircle } from "react-icons/io";

export interface Subject {
	id: string;
	name: string;
}

export default function Page() {
	const [subjects, setSubjects] = useState<Subject[]>([])
	const pathname = usePathname();

	useEffect(() => {
		apiGet("subjects")
			.then(data => {
				setSubjects(data)
			})
			.catch(err => alert(err))
	}, [])

	return (
		<div className="w-64 h-full hidden xl:block border-r-[1px] border-white-20 px-3 py-3">
			<div className="[&>*]:flex [&>*]:flex-row flex flex-col gap-3 border-b-[1px] pb-3 border-white-20">

				<Link 
					href="/" 
					className={`h-11 w-12/12 rounded-lg pl-4
					flex flex-row justify-left items-center gap-3
					hover:text-white-100  duration-200 
					${pathname == '/' ? 'bg-white-10 hover:bg-white-10 text-white-100' : 'text-white-80 hover:bg-white-5'}`}
				>

					{pathname == '/' ? 
					<GoHomeFill className="w-6 h-6" /> : 
					<GoHome className="w-6 h-6" />
					}

					<p className='text-sm font-normal'>
						Página Inicial
					</p>
				</Link>

				<Link 
					href="/chat-messages" 
					className={`h-11 w-12/12 rounded-lg pl-4
					flex flex-row justify-left items-center gap-3
					hover:text-white-100 duration-200 
					${pathname == '/chat-messages' ? 'bg-white-10 hover:bg-white-10 text-white-100' : 'text-white-80 hover:bg-white-5'}`}
				>
					{
						pathname == '/chat-messages' ? 
						<IoChatboxEllipses className="w-6 h-6" /> : 
						<IoChatboxEllipsesOutline className="w-6 h-6" /> 
					}
					<p className='text-sm font-normal'>
						Mensagens
					</p>
				</Link>
				<Link 
					href="/create-community"
					className={`h-11 w-12/12 rounded-lg pl-4
					flex flex-row justify-left items-center gap-3
					hover:text-white-100 duration-200 
					${pathname == '/create-community' ? 'bg-white-10 hover:bg-white-10 text-white-100' : 'text-white-80 hover:bg-white-5'}`}
				>
					{
						pathname == '/create-community' ? 
						<BsPlusCircleFill className="w-5 h-5" /> : 
						<BsPlusCircle className="w-5 h-5" /> 
					}
					<p className='text-sm font-normal'>
						Criar comunidade
					</p>
				</Link>	
			</div>

			<div className="p-4 pb-0 border-b-[1px] border-white-20">
				<h2 className="w-full opacity-[40%] pb-2">DISCIPLINAS</h2>
				<ul>
					{
						subjects.map(subj => {
							return (
								<Link key={subj.id} href={`/subject/${subj.id}`} className="opacity-[80%] flex flex-row justify-between my-4 items-center">
									<p className="text-sm font-normal overflow-hidden whitespace-nowrap text-ellipsis">
										# {subj.name}
									</p>
									<SlArrowDown  className="w-5 h-auto" />
								</Link>
							)
						})
					}
				</ul>
				<SlArrowDown className="h-6 w-6 pb-2 opacity-[20%] m-auto cursor-pointer" />
			</div>

			<div className="[&>*]:flex [&>*]:flex-row flex flex-col gap-3 pt-3">
				<Link 
					href="/settings" 
					className={`h-11 w-12/12 rounded-lg pl-4
					flex flex-row justify-left items-center gap-3
					hover:text-white-100 duration-200 
					${pathname == '/settings' ? 'bg-white-10 hover:bg-white-10 text-white-100' : 'text-white-80 hover:bg-white-5'}`}
				>
					{
						pathname == '/settings' ?
						<IoSettingsSharp className="w-6 h-6" /> :
						<IoSettingsOutline className="w-6 h-6" />
					}
					<p className='text-sm font-normal'>
						Configurações
					</p>
				</Link>

				<Link 
					href="/bookmarks" 
					className={`h-12 w-12/12 rounded-lg pl-4
					flex flex-row justify-left items-center gap-3
					hover:text-white-100 duration-200 
					${pathname == '/bookmarks' ? 'bg-white-10 hover:bg-white-10 text-white-100' : 'text-white-80 hover:bg-white-5'}`}
				>
					{
						pathname == '/bookmarks' ? 
						<BsBookmarkFill className="w-5 h-5" /> :
						<BsBookmark className="w-5 h-5" />
					}
					<p className='text-sm font-normal'>
						Salvos
					</p>
				</Link>

				<Link 
					href="/about" 
					className={`h-12 w-12/12 rounded-lg pl-4
					flex flex-row justify-left items-center gap-3
					hover:text-white-100 duration-200 
					${pathname == '/about' ? 'bg-white-10 hover:bg-white-10 text-white-100' : 'text-white-80 hover:bg-white-5'}`}
				>
					{
						pathname == '/about' ? 
						<IoMdInformationCircle className="w-6 h-6" /> : 
						<IoIosInformationCircleOutline className="w-6 h-6" />
					}
					<p className='text-sm font-normal'>
						Sobre
					</p>
				</Link>
			</div>
		</div>
	)
}