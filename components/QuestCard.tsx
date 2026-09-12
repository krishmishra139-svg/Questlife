'use client'

export default function QuestCard({ quest, onComplete }: any) {
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 flex justify-between items-center">
      <div>
        <p className="font-bold">{quest.title}</p>
        <p className="text-xs text-gray-400">{quest.duration || '30m'} • {quest.category || 'general'} • {quest.xp_reward || 20}XP</p>
      </div>
      <button onClick={()=>onComplete(quest)} className="bg-yellow-400 text-black px-3 py-1 rounded-lg text-sm font-bold">
        Done
      </button>
    </div>
  )
}