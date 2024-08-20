"use client";

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { apiGet } from '@/utils/api'
import Subject from '@/interfaces/Subject'

export default function Home() {
  const [subjects, setSubjects] = useState<Subject[]>([])

  useEffect(() => {
    apiGet("subjects")
    .then(data => {
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
