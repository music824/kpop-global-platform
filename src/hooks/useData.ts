'use client'

import useSWR from 'swr'
import { createClient } from '@/lib/supabase/client'

const supabase = createClient()

const fetcher = async (query: string) => {
  const { data, error } = await supabase.from(query.split('.')[1]).select('*')
  if (error) throw error
  return data
}

// Hooks for fetching data
export function useArtists() {
  return useSWR('artists', fetcher)
}

export function useEvents() {
  return useSWR('events', fetcher)
}

export function useNews() {
  return useSWR('news', fetcher)
}

export function useFlashNews() {
  return useSWR('flash_news', fetcher)
}