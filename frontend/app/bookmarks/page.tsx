"use client";
import { useState, useEffect } from 'react'
import { apiGet } from '@/utils/api'
import Link from 'next/link';

export default function Page() {
  const [testBookmarks, setTestBookmarks] = useState<any[]>([]);
  const [questionBookmarks, setQuestionBookmarks] = useState<any[]>([]);
  const [postBookmarks, setPostBookmarks] = useState<any[]>([]);

  useEffect(() => {
    apiGet('bookmarks')
      .then((data) => {
        console.log(data)
        // TODO: Maybe later move filtering logic to the backend
        data.forEach((bookmark: any) => {
          if (bookmark.content_type === "test") {
            setTestBookmarks((old: any) => [...old, bookmark])
          }
          else if (bookmark.content_type === "post") {
            setPostBookmarks((old: any) => [...old, bookmark])
          }
          else if (bookmark.content_type === "question") {
            setQuestionBookmarks((old: any) => [...old, bookmark])
          }
        })
      })
  }, [])

  return (
    <div>
      <h1>Bookmarks</h1>
      <h2>Listas de Exercícios salvas</h2>
      <ul>
        {
          testBookmarks.length > 0 ?
            testBookmarks.map(tb => {
              return (
                <Link href={`/subject/${tb.content_object.subject}/test/${tb.object_id}`}>
                  {tb.content_object.title}
                </Link>
              )
            })

            :
            <p>Você ainda não salvou nenhuma lista de exercícios!</p>
        }
      </ul>
    </div>
  )
}
