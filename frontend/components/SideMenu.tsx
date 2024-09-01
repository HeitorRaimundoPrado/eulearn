import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { apiGet } from '@/utils/api';
import Link from 'next/link';
import useGlobalStore from '@/stores/globalStore';

import { GoHome } from "react-icons/go";
import { GoHomeFill } from "react-icons/go";
import { IoChatboxEllipsesOutline } from "react-icons/io5";
import { IoChatboxEllipses } from "react-icons/io5";
import { BsPlusCircle } from "react-icons/bs";
import { BsPlusCircleFill } from "react-icons/bs";
import { PiListPlusLight } from "react-icons/pi";
import { PiListPlusFill } from "react-icons/pi";
import { SlArrowDown } from "react-icons/sl";
import { SlArrowUp } from "react-icons/sl";
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
	const [open, setOpen] = useState<null | number>(null);

	const [isLoggedIn, setIsLoggedIn] = useGlobalStore((state) => [state.isLoggedIn, state.setIsLoggedIn]);
	const [hydrated, setHydrated] = useState<boolean>(false);

	useEffect(() => {
		apiGet("subjects")
			.then(data => {
				setSubjects(data)
				console.log('here')
			})
			.catch(err => alert(err))

		setHydrated(true);
	}, [])

	const handleClick = (index: number | null) => {
		setOpen(open === index ? null : index);
	};


	return (
		<div className="w-80 h-full hidden xl:block border-r-[1px] border-white-20 px-5 py-6">
			<div className="[&>*]:flex [&>*]:flex-row flex flex-col gap-3 border-b-[1px] pb-3 border-white-20">

				<Link
					href="/"
					className={`h-10 w-12/12 rounded-lg pl-4
					flex flex-row justify-left items-center gap-3
					hover:text-white-100 duration-200 
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
					className={`h-10 w-12/12 rounded-lg pl-4
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
					className={`h-10 w-12/12 rounded-lg pl-4
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
				{
					subjects.map((subject, idx) => (

						<Link
							key={subject.id}
							href={`/subject/${subject.id}/create-list`}
							className={`h-10 w-12/12 rounded-lg pl-4
								flex flex-row justify-left items-center gap-3
								hover:text-white-100 duration-200 
								${pathname == '/create' ? 'bg-white-10 hover:bg-white-10 text-white-100' : 'text-white-80 hover:bg-white-5'}`}
						>
							{
								pathname == '/create' ?
									<PiListPlusFill className="w-5 h-5" /> :
									<PiListPlusLight className="w-5 h-5" />
							}
							<p className='text-sm font-normal'>
								Criar lista de exercícios
							</p>
						</Link>
					))
				}
			</div>

			<div className=" pb-0 border-b-[1px] border-white-20">
				<h2 className="w-full opacity-[40%] px-4 py-2">DISCIPLINAS</h2>
					{/*{
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
					}*/}
					<ul>
						<ul>
						<li
							className={`h-10 w-full rounded-lg px-4
								flex flex-row justify-between items-center
								hover:text-white-100 duration-200 
								${open === 0 ? 'bg-white-10 text-white' : 'text-white-80 hover:bg-white-5'}
								duration-200 cursor-pointer`}
							onClick={() => handleClick(0)}
						>
							{
								subjects.map(subj => (
									<Link key={subj.id} href={`/subject/${subj.id}`} className="flex flex-row items-center justify-between w-full">
										<p className="text-sm font-normal">
											# {subj.name}
										</p>
										{pathname == `/subject/${subj.id}` ? <SlArrowDown className="w-3 h-3" /> : <SlArrowUp className="w-3 h-3" />}
									</Link>
								))
							}
						</li>

						<div
							style={{ display: open === 0 ? 'block' : 'none' }}
							className="w-full py-3"
						>
							<div className='flex flex-col gap-3 border-solid border-white-20 border-l-[1px] ml-3'>
								<Link href="/" >
									<p className={`h-9 w-full rounded-r-lg pl-4
										flex justify-left items-center 
										text-sm font-normal duration-200
										${pathname == '/' ? 'bg-white-10 hover:bg-white-10 text-white-100' : 'text-white-80 hover:bg-white-5'}`}>
										Fórum Principal
									</p>
								</Link>
								<Link href="/" >
									<p className={`h-9 w-full rounded-r-lg pl-4
										flex justify-left items-center 
										text-sm font-normal 
										${pathname == '/tt' ? 'bg-white-10 hover:bg-white-10 text-white-100' : 'text-white-80 hover:bg-white-5'}`}>
										Exercícios resolvidos
									</p>
								</Link>
								<Link href="/" >
									<p className={`h-9 w-full rounded-r-lg pl-4
										flex justify-left items-center 
										text-sm font-normal 
										${pathname == '/tt' ? 'bg-white-10 hover:bg-white-10 text-white-100' : 'text-white-80 hover:bg-white-5'}`}>
										Lista de exercícios
									</p>
								</Link>
								<Link href="/" >
									<p className={`h-9 w-full rounded-r-lg pl-4
										flex justify-left items-center 
										text-sm font-normal 
										${pathname == '/tt' ? 'bg-white-10 hover:bg-white-10 text-white-100' : 'text-white-80 hover:bg-white-5'}`}>
										Fórum informal
									</p>
								</Link>
							</div>

						</div>
					</ul>
				</ul>
				<SlArrowDown className="h-6 w-6 pb-2 opacity-[20%] m-auto cursor-pointer" />
			</div>

			<div className="flex flex-col gap-3 pt-3">
				{
					(hydrated && isLoggedIn) &&
					<div className="flex flex-col gap-3 pt-3">
						<Link
							href="/settings"
							className={`h-10 w-12/12 rounded-lg pl-4
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
							className={`h-10 w-12/12 rounded-lg pl-4
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
					</div>
				}

				<Link
					href="/about"
					className={`h-10 w-12/12 rounded-lg pl-4
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
		</div >
	)
}
