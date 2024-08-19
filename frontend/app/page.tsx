"use client";

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { apiGet } from '@/utils/api'

export default function Home() {
  const [subjects, setSubjects] = useState([])

  useEffect(() => {
    apiGet("subjects")
    .then(data => {
      console.log(data)
      setSubjects(data)
    })
    .catch(err => alert(err))
  }, [])

  return (
    <div>
      {
        subjects.map(subject => {
          return <Link key={subject.id} href={`/subject/${subject.route}`}>{subject.name}</Link>
        })
      }
    </div>
  );
}
