import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

/**
 * SELF-MONITORING AI API
 *
 * This API provides monitoring and analysis capabilities:
 * - GET: Fetch monitoring data (alerts, insights, summaries)
 * - POST: Run monitoring analysis for a child
 *
 * The AI monitors for:
 * - Struggling students (low accuracy, consecutive wrong answers)
 * - Inactive students (no activity for X days)
 * - Broken streaks
 * - Subject weaknesses
 * - Frustration detection
 * - Achievements and improvements
 */

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Alert thresholds
const THRESHOLDS = {
  LOW_ACCURACY: 0.5, // Below 50% triggers warning
  CONSECUTIVE_WRONG: 5, // 5 wrong in a row triggers frustration alert
  INACTIVE_DAYS: 3, // No activity for 3 days triggers alert
  STRUGGLING_SCORE: 60, // Below 60% on a lesson
  CELEBRATION_STREAK: 7, // 7-day streak triggers celebration
  IMPROVEMENT_THRESHOLD: 0.15, // 15% improvement triggers celebration
};

// GET - Fetch monitoring data
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const childId = searchParams.get('childId');
  const familyId = searchParams.get('familyId');
  const type = searchParams.get('type') || 'all'; // alerts, insights, summary, all

  try {
    const response: Record<string, any> = {};

    // Fetch alerts
    if (type === 'all' || type === 'alerts') {
      let alertQuery = supabase
        .from('monitoring_alerts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (childId) {
        alertQuery = alertQuery.eq('child_id', childId);
      } else if (familyId) {
        alertQuery = alertQuery.eq('family_id', familyId);
      }

      const { data: alerts, error: alertError } = await alertQuery;
      if (alertError) throw alertError;
      response.alerts = alerts || [];

      // Count unread
      response.unreadCount = alerts?.filter(a => !a.is_read).length || 0;
    }

    // Fetch insights
    if (type === 'all' || type === 'insights') {
      let insightQuery = supabase
        .from('monitoring_insights')
        .select('*')
        .eq('is_active', true)
        .order('confidence', { ascending: false })
        .limit(20);

      if (childId) {
        insightQuery = insightQuery.eq('child_id', childId);
      }

      const { data: insights, error: insightError } = await insightQuery;
      if (insightError) throw insightError;
      response.insights = insights || [];
    }

    // Fetch daily summary
    if (type === 'all' || type === 'summary') {
      if (childId) {
        const { data: summaries, error: summaryError } = await supabase
          .from('daily_summaries')
          .select('*')
          .eq('child_id', childId)
          .order('summary_date', { ascending: false })
          .limit(7);

        if (summaryError) throw summaryError;
        response.summaries = summaries || [];
      }
    }

    // Fetch child overview for dashboard
    if (childId && (type === 'all' || type === 'overview')) {
      const { data: child } = await supabase
        .from('children')
        .select(`
          id, name, grade_level, coins, current_streak, level,
          last_activity_at, consecutive_wrong_answers, total_sessions
        `)
        .eq('id', childId)
        .single();

      const { data: learningProfile } = await supabase
        .from('learning_profiles')
        .select('*')
        .eq('child_id', childId)
        .single();

      response.overview = {
        child,
        learningProfile,
      };
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error('Monitoring GET error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch monitoring data' },
      { status: 500 }
    );
  }
}

// POST - Run monitoring analysis
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { childId, action } = body;

    if (!childId) {
      return NextResponse.json(
        { error: 'childId is required' },
        { status: 400 }
      );
    }

    const alerts: any[] = [];
    const insights: any[] = [];

    // Fetch child data
    const { data: child } = await supabase
      .from('children')
      .select('*, families(id, user_id)')
      .eq('id', childId)
      .single();

    if (!child) {
      return NextResponse.json({ error: 'Child not found' }, { status: 404 });
    }

    const familyId = child.family_id;

    // Fetch learning profile
    const { data: profile } = await supabase
      .from('learning_profiles')
      .select('*')
      .eq('child_id', childId)
      .single();

    // Fetch recent lesson progress
    const { data: recentProgress } = await supabase
      .from('lesson_progress')
      .select('*')
      .eq('child_id', childId)
      .order('completed_at', { ascending: false })
      .limit(20);

    // Fetch recent weekly test results
    const { data: testResults } = await supabase
      .from('weekly_test_results')
      .select('*')
      .eq('child_id', childId)
      .order('taken_at', { ascending: false })
      .limit(5);

    // === RUN ANALYSIS ===

    // 1. Check for inactivity
    if (child.last_activity_at) {
      const daysSinceActivity = Math.floor(
        (Date.now() - new Date(child.last_activity_at).getTime()) / (1000 * 60 * 60 * 24)
      );

      if (daysSinceActivity >= THRESHOLDS.INACTIVE_DAYS) {
        alerts.push({
          child_id: childId,
          family_id: familyId,
          alert_type: 'inactive',
          severity: daysSinceActivity >= 7 ? 'urgent' : 'warning',
          title: `${child.name} hasn't practiced in ${daysSinceActivity} days`,
          message: `It's been ${daysSinceActivity} days since ${child.name} last practiced. Regular practice helps maintain skills!`,
          data: { daysSinceActivity },
        });
      }
    }

    // 2. Check for struggling (low accuracy)
    if (profile && profile.overall_accuracy < THRESHOLDS.LOW_ACCURACY && profile.total_questions_answered >= 20) {
      alerts.push({
        child_id: childId,
        family_id: familyId,
        alert_type: 'low_accuracy',
        severity: 'warning',
        title: `${child.name} may need extra help`,
        message: `${child.name}'s overall accuracy is ${Math.round(profile.overall_accuracy * 100)}%. Consider reviewing lessons together or trying easier material.`,
        data: { accuracy: profile.overall_accuracy, questionsAnswered: profile.total_questions_answered },
      });
    }

    // 3. Check for frustration (consecutive wrong answers)
    if (child.consecutive_wrong_answers >= THRESHOLDS.CONSECUTIVE_WRONG) {
      alerts.push({
        child_id: childId,
        family_id: familyId,
        alert_type: 'frustration_detected',
        severity: 'urgent',
        title: `${child.name} might be frustrated`,
        message: `${child.name} has gotten ${child.consecutive_wrong_answers} answers wrong in a row. Consider taking a break or switching subjects.`,
        data: { consecutiveWrong: child.consecutive_wrong_answers },
      });
    }

    // 4. Check for subject weaknesses
    if (profile && profile.weakest_subjects && profile.weakest_subjects.length > 0) {
      const weakSubjects = profile.weakest_subjects;

      // Check recent performance in weak subjects
      const weakSubjectProgress = recentProgress?.filter(p => weakSubjects.includes(p.subject_code)) || [];
      const avgWeakScore = weakSubjectProgress.length > 0
        ? weakSubjectProgress.reduce((sum, p) => sum + (p.score || 0), 0) / weakSubjectProgress.length
        : null;

      if (avgWeakScore !== null && avgWeakScore < THRESHOLDS.STRUGGLING_SCORE) {
        alerts.push({
          child_id: childId,
          family_id: familyId,
          alert_type: 'subject_weakness',
          severity: 'warning',
          title: `${child.name} is struggling with ${weakSubjects.join(', ')}`,
          message: `Average score of ${Math.round(avgWeakScore)}% in ${weakSubjects.join(', ')}. Extra practice in these areas would help!`,
          subject_code: weakSubjects[0],
          data: { subjects: weakSubjects, avgScore: avgWeakScore },
        });
      }
    }

    // 5. Check for streak achievements
    if (child.current_streak >= THRESHOLDS.CELEBRATION_STREAK) {
      // Only create if not already celebrated this streak
      const { data: existingCelebration } = await supabase
        .from('monitoring_alerts')
        .select('id')
        .eq('child_id', childId)
        .eq('alert_type', 'celebration')
        .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
        .single();

      if (!existingCelebration) {
        alerts.push({
          child_id: childId,
          family_id: familyId,
          alert_type: 'celebration',
          severity: 'info',
          title: `🎉 ${child.name} has a ${child.current_streak}-day streak!`,
          message: `Amazing dedication! ${child.name} has practiced for ${child.current_streak} days in a row. Keep it up!`,
          data: { streak: child.current_streak },
        });
      }
    }

    // 6. Check for broken streak
    if (child.current_streak === 0 && child.total_sessions && child.total_sessions > 5) {
      const lastActivity = child.last_activity_at ? new Date(child.last_activity_at) : null;
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);

      if (lastActivity && lastActivity < yesterday) {
        alerts.push({
          child_id: childId,
          family_id: familyId,
          alert_type: 'streak_broken',
          severity: 'info',
          title: `${child.name}'s streak was reset`,
          message: `${child.name}'s practice streak was reset. Start a new streak today!`,
          data: {},
        });
      }
    }

    // 7. Check for improvement
    if (recentProgress && recentProgress.length >= 5) {
      const recentScores = recentProgress.slice(0, 5).map(p => p.score || 0);
      const olderScores = recentProgress.slice(5, 10).map(p => p.score || 0);

      if (olderScores.length >= 3) {
        const recentAvg = recentScores.reduce((a, b) => a + b, 0) / recentScores.length;
        const olderAvg = olderScores.reduce((a, b) => a + b, 0) / olderScores.length;
        const improvement = (recentAvg - olderAvg) / 100;

        if (improvement >= THRESHOLDS.IMPROVEMENT_THRESHOLD) {
          alerts.push({
            child_id: childId,
            family_id: familyId,
            alert_type: 'improvement',
            severity: 'info',
            title: `📈 ${child.name} is improving!`,
            message: `${child.name}'s recent scores are ${Math.round(improvement * 100)}% higher than before. Great progress!`,
            data: { improvement, recentAvg, olderAvg },
          });
        }
      }
    }

    // 8. Generate insights
    if (profile) {
      // Best time insight
      if (profile.best_time_of_day) {
        insights.push({
          child_id: childId,
          insight_type: 'best_time',
          title: 'Optimal Learning Time',
          description: `${child.name} learns best in the ${profile.best_time_of_day}.`,
          recommendation: `Try to schedule practice sessions during ${profile.best_time_of_day} hours for best results.`,
          confidence: profile.learning_style_confidence || 0.5,
          based_on_questions: profile.total_questions_answered || 0,
        });
      }

      // Learning style insight
      if (profile.primary_learning_style) {
        const styleDescriptions: Record<string, string> = {
          visual: 'pictures, diagrams, and videos',
          auditory: 'listening and verbal explanations',
          reading: 'reading and writing',
          kinesthetic: 'hands-on activities and movement',
        };

        insights.push({
          child_id: childId,
          insight_type: 'learning_pattern',
          title: 'Learning Style',
          description: `${child.name} is a ${profile.primary_learning_style} learner who responds best to ${styleDescriptions[profile.primary_learning_style]}.`,
          recommendation: `Use ${styleDescriptions[profile.primary_learning_style]} when explaining new concepts.`,
          confidence: profile.learning_style_confidence || 0.5,
          based_on_questions: profile.total_questions_answered || 0,
        });
      }

      // Pace recommendation
      if (profile.preferred_pace) {
        insights.push({
          child_id: childId,
          insight_type: 'pace_recommendation',
          title: 'Learning Pace',
          description: `${child.name} prefers a ${profile.preferred_pace} learning pace.`,
          recommendation: profile.preferred_pace === 'slow'
            ? 'Take time with each concept. Don\'t rush through material.'
            : profile.preferred_pace === 'fast'
              ? 'Keep things moving! Quick transitions between topics work well.'
              : 'A balanced pace with regular breaks works well.',
          confidence: 0.7,
        });
      }

      // Subject strengths/weaknesses
      if (profile.strongest_subjects && profile.strongest_subjects.length > 0) {
        insights.push({
          child_id: childId,
          insight_type: 'subject_strength',
          title: 'Strong Subjects',
          description: `${child.name} excels in ${profile.strongest_subjects.join(', ')}.`,
          recommendation: 'Build confidence by tackling more advanced topics in these areas.',
          confidence: 0.8,
          data: { subjects: profile.strongest_subjects },
        });
      }
    }

    // === SAVE ALERTS ===
    if (alerts.length > 0) {
      // Avoid duplicate alerts (check if similar alert exists in last 24 hours)
      for (const alert of alerts) {
        const { data: existing } = await supabase
          .from('monitoring_alerts')
          .select('id')
          .eq('child_id', alert.child_id)
          .eq('alert_type', alert.alert_type)
          .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
          .single();

        if (!existing) {
          await supabase.from('monitoring_alerts').insert(alert);
        }
      }
    }

    // === SAVE INSIGHTS ===
    if (insights.length > 0) {
      for (const insight of insights) {
        // Update or insert insight
        const { data: existing } = await supabase
          .from('monitoring_insights')
          .select('id')
          .eq('child_id', insight.child_id)
          .eq('insight_type', insight.insight_type)
          .single();

        if (existing) {
          await supabase
            .from('monitoring_insights')
            .update({ ...insight, updated_at: new Date().toISOString() })
            .eq('id', existing.id);
        } else {
          await supabase.from('monitoring_insights').insert(insight);
        }
      }
    }

    // === CREATE DAILY SUMMARY ===
    if (action === 'daily_summary' || action === 'full_analysis') {
      const today = new Date().toISOString().split('T')[0];

      // Get today's activity
      const { data: todayProgress } = await supabase
        .from('lesson_progress')
        .select('*')
        .eq('child_id', childId)
        .gte('completed_at', `${today}T00:00:00`)
        .lte('completed_at', `${today}T23:59:59`);

      const questionsAnswered = profile?.total_questions_answered || 0;
      const questionsCorrect = profile?.total_questions_correct || 0;

      // Subject breakdown
      const subjectBreakdown: Record<string, { completed: number; avgScore: number }> = {};
      if (todayProgress) {
        for (const progress of todayProgress) {
          const subject = progress.subject_code;
          if (!subjectBreakdown[subject]) {
            subjectBreakdown[subject] = { completed: 0, avgScore: 0 };
          }
          subjectBreakdown[subject].completed++;
          subjectBreakdown[subject].avgScore += progress.score || 0;
        }
        // Calculate averages
        for (const subject of Object.keys(subjectBreakdown)) {
          subjectBreakdown[subject].avgScore /= subjectBreakdown[subject].completed;
        }
      }

      const summary = {
        child_id: childId,
        summary_date: today,
        questions_answered: questionsAnswered,
        questions_correct: questionsCorrect,
        accuracy: questionsAnswered > 0 ? questionsCorrect / questionsAnswered : 0,
        lessons_completed: todayProgress?.length || 0,
        coins_earned: todayProgress?.reduce((sum, p) => sum + (p.coins_earned || 0), 0) || 0,
        subject_breakdown: subjectBreakdown,
        streak_maintained: (child.current_streak || 0) > 0,
        mood_detected: child.consecutive_wrong_answers >= 3 ? 'frustrated' : 'engaged',
      };

      await supabase
        .from('daily_summaries')
        .upsert(summary, { onConflict: 'child_id,summary_date' });
    }

    return NextResponse.json({
      success: true,
      alertsGenerated: alerts.length,
      insightsGenerated: insights.length,
      message: `Analysis complete. Generated ${alerts.length} alerts and ${insights.length} insights.`,
    });
  } catch (error) {
    console.error('Monitoring POST error:', error);
    return NextResponse.json(
      { error: 'Failed to run monitoring analysis' },
      { status: 500 }
    );
  }
}
