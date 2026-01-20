import { createClient } from '@/lib/supabase/client'

export interface NotificationPreferences {
  id?: string
  parent_id: string
  email: string
  weekly_summary: boolean
  achievement_unlocked: boolean
  streak_milestone: boolean
  test_results: boolean
}

// Get parent's notification preferences
export async function getNotificationPreferences(parentId: string): Promise<NotificationPreferences | null> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('notification_preferences')
    .select('*')
    .eq('parent_id', parentId)
    .single()

  if (error || !data) {
    // Return defaults if no preferences exist
    return null
  }

  return data as NotificationPreferences
}

// Create or update notification preferences
export async function saveNotificationPreferences(
  preferences: NotificationPreferences
): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient()

  const { error } = await supabase
    .from('notification_preferences')
    .upsert({
      parent_id: preferences.parent_id,
      email: preferences.email,
      weekly_summary: preferences.weekly_summary,
      achievement_unlocked: preferences.achievement_unlocked,
      streak_milestone: preferences.streak_milestone,
      test_results: preferences.test_results,
      updated_at: new Date().toISOString()
    }, {
      onConflict: 'parent_id'
    })

  if (error) {
    console.error('Failed to save notification preferences:', error)
    return { success: false, error: error.message }
  }

  return { success: true }
}

// Update a single preference
export async function updatePreference(
  parentId: string,
  key: 'weekly_summary' | 'achievement_unlocked' | 'streak_milestone' | 'test_results',
  value: boolean
): Promise<boolean> {
  const supabase = createClient()

  const { error } = await supabase
    .from('notification_preferences')
    .update({ [key]: value, updated_at: new Date().toISOString() })
    .eq('parent_id', parentId)

  if (error) {
    console.error('Failed to update preference:', error)
    return false
  }

  return true
}

// Delete notification preferences (unsubscribe from all)
export async function deleteNotificationPreferences(parentId: string): Promise<boolean> {
  const supabase = createClient()

  const { error } = await supabase
    .from('notification_preferences')
    .delete()
    .eq('parent_id', parentId)

  if (error) {
    console.error('Failed to delete notification preferences:', error)
    return false
  }

  return true
}
