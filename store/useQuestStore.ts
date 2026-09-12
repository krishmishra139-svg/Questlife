import { create } from 'zustand'

const STORAGE_KEY = 'questlife_quests'

export const useQuestStore = create((set: any, get: any) => ({
  quests: typeof window !== 'undefined' ? JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') : [],

  fetchQuests: async (userId: string) => {
    // Load from localStorage - always works
    if (typeof window !== 'undefined') {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
      set({ quests: saved })
    }
  },

  addQuest: async (quest: any) => {
    const newQuest = {
      id: Date.now().toString(),
      title: quest.title,
      category: quest.category || 'strength',
      xp_reward: 20,
      duration: '2hrs',
      created_at: new Date().toISOString()
    }
    
    const updated = [newQuest, ...get().quests]
    set({ quests: updated })
    
    // Save to localStorage - NEVER fails
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    }
    
    console.log('Quest saved:', newQuest)
  },

  completeQuest: async (id: string) => {
    const quest = get().quests.find((q: any) => q.id === id)
    const updated = get().quests.filter((q: any) => q.id !== id)
    set({ quests: updated })
    
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    }

    // Also give XP/Gold
    if (typeof window !== 'undefined') {
      const charKey = 'questlife_character'
      const char = JSON.parse(localStorage.getItem(charKey) || '{"xp":0,"gold":0,"level":1,"attributes":{"strength":10,"intelligence":10,"agility":10}}')
      char.xp = (char.xp || 0) + 20
      char.gold = (char.gold || 0) + 10
      char.level = Math.floor(char.xp / 100) + 1
      if (quest?.category === 'strength') char.attributes.strength += 1
      if (quest?.category === 'intellect') char.attributes.intelligence += 1
      if (quest?.category === 'spirit') char.attributes.agility += 1
      localStorage.setItem(charKey, JSON.stringify(char))
    }
    
    // Reload to show new XP
    setTimeout(() => window.location.reload(), 300)
  }
}))