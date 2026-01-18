import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const childId = searchParams.get('childId');

  if (!childId) {
    return NextResponse.json({ error: 'childId required' }, { status: 400 });
  }

  try {
    const supabase = await createServerSupabaseClient();

    // Get child data
    const { data: child, error: childError } = await supabase
      .from('children')
      .select('name, grade_level, coins, current_streak, level, last_activity_date')
      .eq('id', childId)
      .single();

    if (childError || !child) {
      return NextResponse.json({ error: 'Child not found' }, { status: 404 });
    }

    // Get last lesson in progress
    const { data: lastLesson } = await supabase
      .from('lesson_progress')
      .select('skill_id, skill_name, subject_code, completed')
      .eq('child_id', childId)
      .eq('completed', false)
      .order('last_attempt_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    // Get learning profile for weakest/strongest subjects
    const { data: profile } = await supabase
      .from('learning_profiles')
      .select('strongest_subjects, weakest_subjects')
      .eq('child_id', childId)
      .maybeSingle();

    // Check if new user (no lesson progress at all)
    const { count } = await supabase
      .from('lesson_progress')
      .select('*', { count: 'exact', head: true })
      .eq('child_id', childId);

    const isNewUser = (count || 0) === 0;

    // Determine suggested greeting based on context
    let suggestedGreeting = '';

    if (isNewUser) {
      suggestedGreeting = `Hey ${child.name}! Looks like you're new here. I'm so excited to learn with you! What subject sounds fun?`;
    } else if (lastLesson && !lastLesson.completed) {
      suggestedGreeting = `Welcome back ${child.name}! I see you were working on ${lastLesson.skill_name}. Want to pick up where you left off?`;
    } else if (child.current_streak >= 3) {
      suggestedGreeting = `Wow ${child.name}! ${child.current_streak} days in a row - you're on fire! What do you want to learn today?`;
    } else if (child.current_streak === 0 && child.last_activity_date) {
      suggestedGreeting = `Hey ${child.name}! I missed you! Let's get your streak going again. What sounds fun today?`;
    } else {
      suggestedGreeting = `Hey ${child.name}! Great to see you! What would you like to work on?`;
    }

    return NextResponse.json({
      childName: child.name,
      gradeLevel: child.grade_level,
      coins: child.coins,
      streak: child.current_streak,
      level: child.level,
      isNewUser,
      lastLesson: lastLesson ? {
        skillId: lastLesson.skill_id,
        skillName: lastLesson.skill_name,
        subject: lastLesson.subject_code,
      } : null,
      strongestSubjects: profile?.strongest_subjects || [],
      weakestSubjects: profile?.weakest_subjects || [],
      suggestedGreeting,
    });
  } catch (error: any) {
    console.error('Context API error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
