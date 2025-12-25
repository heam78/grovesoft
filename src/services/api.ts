export interface Reward {
  id: number
  name: string
  image: string
}

export interface EventData {
  id: number
  title: string
  endDate: string
  description: string
  rewards: Reward[]
}

export interface EntryFormData {
  name: string
  phone: string
  email: string
  agreeTerms: boolean
}

const EVENT_API_URL = 'https://6948eac91ee66d04a45081ef.mockapi.io/api/vi/event'
const ENTRY_API_URL = 'https://6948eac91ee66d04a45081ef.mockapi.io/api/vi/entries'

export async function fetchEvent(): Promise<EventData | null> {
  const res = await fetch(EVENT_API_URL)

  if (!res.ok) {
    console.error('Failed to fetch event', res.statusText)
    return null
  }

  const data = (await res.json()) as EventData[]
  return data[0] ?? null
}

export async function checkDuplicateEntry(email: string, phone: string): Promise<boolean> {
  try {
    const normalizedEmail = email.trim().toLowerCase()
    const normalizedPhone = phone.trim().replace(/-/g, '')
    
    const res = await fetch(ENTRY_API_URL)
    if (!res.ok) {
      return false
    }
    
    const entries = await res.json()
    return entries.some((entry: any) => {
      const entryEmail = (entry.email || '').trim().toLowerCase()
      const entryPhone = (entry.phone || '').trim().replace(/-/g, '')
      return entryEmail === normalizedEmail || entryPhone === normalizedPhone
    })
  } catch (error) {
    console.error('Error checking duplicate entry:', error)
    return false
  }
}

export async function submitEntry(formData: EntryFormData): Promise<{ success: boolean; error?: string }> {
  try {
    const isDuplicate = await checkDuplicateEntry(formData.email, formData.phone)
    if (isDuplicate) {
      return { success: false, error: '이미 응모하신 정보입니다. 중복 응모는 불가능합니다.' }
    }

    const res = await fetch(ENTRY_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...formData,
        submittedAt: new Date().toISOString(),
      }),
    })

    if (!res.ok) {
      console.error('Failed to submit entry', res.statusText)
      return { success: false, error: '응모 제출에 실패했습니다. 다시 시도해주세요.' }
    }

    return { success: true }
  } catch (error) {
    console.error('Error submitting entry:', error)
    return { success: false, error: '네트워크 오류가 발생했습니다. 다시 시도해주세요.' }
  }
}


