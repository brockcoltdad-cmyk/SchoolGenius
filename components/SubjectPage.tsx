'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase-client'
import type { CurriculumSkill } from '@/types/database'
import { BookOpen, Star, Lock, CheckCircle, Play, Trophy } from 'lucide-react'

type StudentSkillProgress = {
  id: string
  student_id: string | null
  subject_code: string
  skill_code: string
  completed: boolean | null
  best_score: number | null
  attempts: number | null
  last_practiced: string | null
  questions_correct: number | null
  questions_answered: number | null
  created_at: string | null
}

interface SubjectPageProps {
  studentId: string
  subjectCode: string
  subjectName: string
  gradeLevel: number
}

interface Skill {
  id: string
  skill_name: string
  skill_description: string
  status: 'locked' | 'available' | 'in_progress' | 'complete'
  score?: number
}

export default function SubjectPage({ studentId, subjectCode, subjectName, gradeLevel }: SubjectPageProps) {
  const [skills, setSkills] = useState<Skill[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ completed: 0, total: 0 })
  const supabase = createClient()

  useEffect(() => { loadSkills() }, [subjectCode, gradeLevel])

  async function loadSkills() {
    setLoading(true)
    const { data: skillDefs } = await supabase
      .from('curriculum_skills')
      .select('*')
      .eq('subject_code', subjectCode)
      .eq('grade_level', gradeLevel)
      .eq('is_active', true)
      .order('display_order')
      .returns<CurriculumSkill[]>()

    if (!skillDefs) { setLoading(false); return }

    const { data: progress } = await supabase
      .from('student_skill_progress')
      .select('*')
      .eq('student_id', studentId)
      .eq('subject_code', subjectCode)
      .returns<StudentSkillProgress[]>()

    const progressMap = new Map(progress?.map(p => [p.skill_code, p]) || [])
    let completedCount = 0

    const skillList: Skill[] = skillDefs.map((skill, index) => {
      // Use skill.id since skill_code field doesn't exist on curriculum_skills table
      const prog = progressMap.get(skill.id)
      let status: Skill['status'] = 'locked'
      if (prog?.completed) { status = 'complete'; completedCount++ }
      else if (prog) status = 'in_progress'
      else if (index === 0 || progressMap.get(skillDefs[index - 1]?.id)?.completed) status = 'available'
      return { id: skill.id, skill_name: skill.skill_name, skill_description: skill.description || '', status, score: prog?.best_score || undefined }
    })

    if (skillList.length > 0 && !skillList.some(s => s.status === 'available' || s.status === 'in_progress')) {
      skillList[0].status = 'available'
    }

    setSkills(skillList)
    setStats({ completed: completedCount, total: skillDefs.length })
    setLoading(false)
  }

  function getStatusIcon(status: Skill['status']) {
    switch (status) {
      case 'complete': return <CheckCircle className="w-6 h-6 text-green-500" />
      case 'in_progress': return <Play className="w-6 h-6 text-blue-500" />
      case 'available': return <Star className="w-6 h-6 text-yellow-500" />
      case 'locked': return <Lock className="w-6 h-6 text-gray-400" />
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-[400px]"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div></div>
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-6 text-white mb-8">
        <div className="flex items-center gap-4">
          <div className="bg-white/20 rounded-xl p-3"><BookOpen className="w-8 h-8" /></div>
          <div>
            <h1 className="text-3xl font-bold">{subjectName}</h1>
            <p className="text-white/80">Grade {gradeLevel}</p>
          </div>
        </div>
        <div className="mt-6">
          <div className="flex justify-between text-sm mb-2">
            <span>{stats.completed} of {stats.total} skills complete</span>
            <span>{Math.round((stats.completed / stats.total) * 100) || 0}%</span>
          </div>
          <div className="h-3 bg-white/20 rounded-full overflow-hidden">
            <div className="h-full bg-white rounded-full transition-all" style={{ width: `${(stats.completed / stats.total) * 100}%` }} />
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Skills to Master</h2>
        {skills.map((skill, index) => (
          <div key={skill.id}
            onClick={() => { if (skill.status === 'available' || skill.status === 'in_progress') window.location.href = `/kid/${studentId}/lesson/${subjectCode}/${skill.id}` }}
            className={`border-2 rounded-xl p-4 transition-all ${
              skill.status === 'complete' ? 'bg-green-50 border-green-200' :
              skill.status === 'in_progress' ? 'bg-blue-50 border-blue-200 cursor-pointer hover:bg-blue-100' :
              skill.status === 'available' ? 'bg-yellow-50 border-yellow-200 cursor-pointer hover:bg-yellow-100' :
              'bg-gray-50 border-gray-200 opacity-60'
            }`}>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center font-bold text-gray-600">{index + 1}</div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800">{skill.skill_name}</h3>
                <p className="text-sm text-gray-500">{skill.skill_description}</p>
              </div>
              <div className="flex items-center gap-3">
                {skill.score !== undefined && (
                  <div className="flex items-center gap-1 text-sm">
                    <Trophy className="w-4 h-4 text-yellow-500" />
                    <span className="font-medium">{skill.score}%</span>
                  </div>
                )}
                {getStatusIcon(skill.status)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
