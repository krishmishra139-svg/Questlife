'use client'
import { useState } from 'react'
import PixelAvatar from './PixelAvatar'

export default function CharacterPanel({ character }: any) {
  const [isEditing, setIsEditing] = useState(false)
  const [draft, setDraft] = useState('')

  const name = character?.name || 'Adventurer'
  const level = character?.level || 1
  const gold = character?.gold || 0
  const xp = character?.xp || 0
  const attributes = character?.attributes || { strength: 10, intelligence: 10, agility: 10 }

  return (
    <div className="bg-[#1e3a5f]/80 backdrop-blur rounded-[20px] p-6 border border-white/10">
      <div className="flex gap-4">
        <div className="w-20 h-20 bg-[#fde047] rounded-xl flex items-center justify-center">
          <PixelAvatar level={level} />
        </div>
        <div className="flex-1">
          {isEditing? (
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onBlur={() => {
                setIsEditing(false)
                // FIXED: safe trim
                const newName = (draft || '').trim() || 'Adventurer'
                if (character) character.name = newName
              }}
              autoFocus
              className="bg-black/20 rounded px-2 py-1 text-white font-bold w-full"
            />
          ) : (
            <h2 onClick={() => { setDraft(name); setIsEditing(true) }} className="font-black text-white text-xl flex gap-2 cursor-pointer">
              {name} <span className="text-sm">✏️</span>
            </h2>
          )}
          <p className="text-white/70 text-sm">Level {level}</p>
          <p className="text-[#fde047] font-bold">{gold} Gold</p>

          <div className="mt-3 h-2 bg-black/30 rounded-full">
            <div className="h-full bg-[#38bdf8] rounded-full" style={{ width: `${xp % 100}%` }} />
          </div>
          <p className="text-xs text-white/60 mt-1">{xp} / 100 XP</p>

          <div className="mt-3 flex gap-4 text-xs font-bold text-white">
            <span>STR: {attributes.strength || 10}</span>
            <span>INT: {attributes.intelligence || 10}</span>
            <span>AGI: {attributes.agility || 10}</span>
          </div>
        </div>
      </div>
    </div>
  )
}