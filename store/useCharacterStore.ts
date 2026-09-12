import { create } from 'zustand'
import { createClient } from '@supabase/supabase-js'
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

export const useCharacterStore = create((set: any, get: any) => ({
  character: null,
  profile: null,
  
  fetchCharacter: async (userId: string) => {
    const { data } = await supabase.from('characters').select('*').eq('user_id', userId).single()
    if (data) set({ character: data, profile: data })
    return data
  },

  fetchProfile: async (userId: string) => {
    const { data } = await supabase.from('characters').select('*').eq('user_id', userId).single()
    if (data) set({ character: data, profile: data })
    return data
  },

  resetCharacter: () => set({ character: null, profile: null }),
  resetProfile: () => set({ character: null, profile: null })
}))