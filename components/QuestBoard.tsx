"use client"
import { useState } from "react"
import { useQuestStore } from "@/store/useQuestStore"
import AddQuestModal from "./AddQuestModal"

export default function QuestBoard() {
  const quests = useQuestStore((s: any) => s.quests)
  const [showAdd, setShowAdd] = useState(false)

  return (
    <div className="relative bg-[#1e293b]/50 border border-yellow-500/10 rounded-2xl p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-black text-white">ACTIVE QUESTS ({quests?.length || 0})</h2>
          <p className="text-gray-400 text-sm">Complete quests to earn XP, gold, and grow your attributes.</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="bg-[#facc15] text-black font-bold px-5 py-2.5 rounded-full hover:bg-yellow-400 cursor-pointer z-10">+ Add Quest</button>
      </div>

      <div className="flex gap-2 mb-6">
        <button className="bg-[#facc15] text-black px-4 py-1.5 rounded-full text-sm font-bold">All</button>
        <button className="text-gray-400 px-4 py-1.5 text-sm">Strength</button>
        <button className="text-gray-400 px-4 py-1.5 text-sm">Intellect</button>
        <button className="text-gray-400 px-4 py-1.5 text-sm">Spirit</button>
      </div>

      {quests.length === 0 ? (
        <div className="flex flex-col items-center py-16">
          <div className="text-6xl mb-4">👻</div>
          <p className="text-white font-bold mb-4 tracking-wider">NO QUESTS, ADVENTURER. REST WELL.</p>
          <button onClick={() => setShowAdd(true)} className="border border-gray-600 text-white px-5 py-2 rounded-full hover:bg-white/10 cursor-pointer z-10">+ Post a quest</button>
        </div>
      ) : (
        <div className="space-y-2">
          {quests.map((q: any) => (
            <div key={q.id} className="p-4 bg-[#0f172a] rounded-xl text-white border border-gray-800">
              <p className="font-bold">{q.title}</p>
              <p className="text-sm text-gray-400">{q.description} • {q.attribute} • {q.xp}XP</p>
            </div>
          ))}
        </div>
      )}

      {/* THIS IS THE MODAL - MUST BE HERE */}
      <AddQuestModal isOpen={showAdd} onClose={() => setShowAdd(false)} />
    </div>
  )
}