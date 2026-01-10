import { createServerSupabaseClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import LessonViewer from '@/components/LessonViewer'

interface Props {
  params: Promise<{ id: string; subject: string; skill: string }>
}

export default async function LessonPage({ params }: Props) {
  const { id, subject, skill } = await params
  const supabase = await createServerSupabaseClient()

  const { data: student } = await supabase
    .from('children')
    .select('id, name')
    .eq('id', id)
    .single()

  if (!student) {
    redirect('/')
  }

  return (
    <LessonViewer
      studentId={student.id}
      subjectCode={subject}
      skillId={skill}
    />
  )
}
