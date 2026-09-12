"use client"
import { useState } from "react"
import { useQuestStore } from "@/store/useQuestStore"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

export default function AddQuestModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [attribute, setAttribute] = useState("strength")
  const [loading, setLoading] = useState(false)
  const { fetchQuests } = useQuestStore((s: any) => s)

  if (!isOpen) return null

  const handleCreate = async () => {
    if (!title.trim()) return alert("Enter quest title")
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { alert("Please login first!"); setLoading(false); return }

      const { error } = await supabase.from("quests").insert({
        user_id: user.id,
        title: title.trim(),
        description: description.trim(),
        attribute: attribute,
        difficulty: "easy",
        xp: attribute === "strength" ? 20 : attribute === "intellect" ? 25 : 15,
        gold: 10,
        completed: false
      })

      if (error) {
        console.error(error)
        alert("Supabase error: " + error.message)
      } else {
        setTitle("")
        setDescription("")
        await fetchQuests(user.id)
        onClose()
        alert("Quest added! 🎉")
      }
    } catch (e: any) {
      alert(e.message)
    }
    setLoading(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative w-full max-w-md bg-[#1e293b] border border-yellow-500/20 rounded-2xl p-6 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-black text-white">NEW QUEST</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">&times;</button>
        </div>

        <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Quest title (e.g. Morning Workout)" className="w-full bg-[#0f172a] border border-gray-700 rounded-xl px-4 py-3 text-white mb-3 outline-none focus:border-yellow-500" />
        <textarea value={description} onChange={e=>setDescription(e.target.value)} placeholder="Description (optional)" rows={3} className="w-full bg-[#0f172a] border border-gray-700 rounded-xl px-4 py-3 text-white mb-4 outline-none focus:border-yellow-500"></textarea>

        <p className="text-gray-400 text-sm mb-2">Choose Attribute:</p>
        <div className="flex gap-2 mb-6">
          <button onClick={()=>setAttribute("strength")} className={`flex-1 py-3 rounded-xl font-bold border ${attribute==="strength" ? "bg-orange-500/20 border-orange-500 text-orange-400" : "bg-[#0f172a] border-gray-700 text-gray-400"}`}>⚔️ Strength</button>
          <button onClick={()=>setAttribute("intellect")} className={`flex-1 py-3 rounded-xl font-bold border ${attribute==="intellect" ? "bg-blue-500/20 border-blue-500 text-blue-400" : "bg-[#0f172a] border-gray-700 text-gray-400"}`}>🧠 Intellect</button>
          <button onClick={()=>setAttribute("spirit")} className={`flex-1 py-3 rounded-xl font-bold border ${attribute==="spirit" ? "bg-green-500/20 border-green-500 text-green-400" : "bg-[#0f172a] border-gray-700 text-gray-400"}`}>✨ Spirit</button>
        </div>

        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-3 rounded-full border border-gray-600 text-white font-bold">Cancel</button>
          <button onClick={handleCreate} disabled={loading} className="flex-1 py-3 rounded-full bg-[#facc15] text-black font-black disabled:opacity-50">{loading ? "Creating..." : "Create Quest"}</button>
        </div>
      </div>
    </div>
  )
}