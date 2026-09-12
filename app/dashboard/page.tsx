'use client'
import { useState, useEffect, useRef } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

const SHOP = [
  { id: 'sword', name: 'Iron Sword', icon: '⚔️', cost: 100, effect: '+5 STR' },
  { id: 'shield', name: 'Wooden Shield', icon: '🛡️', cost: 100, effect: '+5 AGI' },
  { id: 'crown', name: 'Hero Crown', icon: '👑', cost: 250, effect: '+10 INT' },
  { id: 'gem', name: 'Magic Gem', icon: '💎', cost: 500, effect: '+50 Gold' },
  { id: 'potion', name: 'XP Potion', icon: '🧪', cost: 300, effect: '+100 XP one-time' },
]

const RANKS = [
  { name: 'Bronze', min: 1, max: 2, color: 'bg-amber-800', text: 'text-amber-200', icon: '🥉', border: 'border-amber-800' },
  { name: 'Silver', min: 3, max: 5, color: 'bg-zinc-400', text: 'text-black', icon: '🥈', border: 'border-zinc-400' },
  { name: 'Gold', min: 6, max: 9, color: 'bg-yellow-400', text: 'text-black', icon: '🥇', border: 'border-yellow-400' },
  { name: 'Diamond', min: 10, max: 19, color: 'bg-cyan-400', text: 'text-black', icon: '💎', border: 'border-cyan-400' },
  { name: 'Elite', min: 20, max: 999, color: 'bg-gradient-to-r from-purple-500 to-pink-500', text: 'text-white', icon: '👑', border: 'border-purple-500' },
]

const DIFFICULTY = {
  easy: { xp: 15, gold: 25, label: 'Easy', color: 'bg-green-500/20 text-green-300' },
  medium: { xp: 25, gold: 50, label: 'Medium', color: 'bg-yellow-500/20 text-yellow-300' },
  hard: { xp: 50, gold: 100, label: 'Hard', color: 'bg-red-500/20 text-red-300' },
  epic: { xp: 100, gold: 200, label: 'Epic', color: 'bg-purple-500/20 text-purple-300' },
}

const QUEST_ICONS = ['💪','🧠','🧘','📚','🏃','💧','🥗','💤','💻','🎯','🔥','⭐']
const ACHIEVEMENTS = [
  { id: 'first', name: 'First Step', icon: '🎯', desc: 'Complete 1 quest', check: (c:any,q:any)=> c.xp >= 25 },
  { id: 'streak3', name: 'On Fire', icon: '🔥', desc: '3 day streak', check: (c:any)=> c.streak >= 3 },
  { id: 'streak7', name: 'Unstoppable', icon: '⚡', desc: '7 day streak', check: (c:any)=> c.streak >= 7 },
  { id: 'gold100', name: 'Rich', icon: '💰', desc: '500 Gold', check: (c:any)=> c.gold >= 500 },
  { id: 'lvl5', name: 'Rising', icon: '🚀', desc: 'Reach Level 5', check: (c:any)=> c.level >= 5 },
  { id: 'boss', name: 'Boss Slayer', icon: '👹', desc: 'Defeat Weekly Boss', check: (c:any)=> c.bossDefeated >= 1 },
]

const getRank = (lvl: number) => RANKS.find(r => lvl >= r.min && lvl <= r.max) || RANKS[0]
const getNextRank = (lvl: number) => RANKS.find(r => r.min > lvl)
const getToday = () => new Date().toISOString().split('T')[0]
const getYesterday = () => { const d = new Date(); d.setDate(d.getDate() - 1); return d.toISOString().split('T')[0] }

export default function Dashboard() {
  const [filter, setFilter] = useState('all')
  const [showAdd, setShowAdd] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const [showEditQuest, setShowEditQuest] = useState(false)
  const [editingQuest, setEditingQuest] = useState<any>(null)
  const [title, setTitle] = useState('')
  const [cat, setCat] = useState('strength')
  const [difficulty, setDifficulty] = useState<keyof typeof DIFFICULTY>('medium')
  const [qIcon, setQIcon] = useState('💪')
  const [dueDate, setDueDate] = useState('')
  const [dueTime, setDueTime] = useState('')
  const [repeat, setRepeat] = useState('none')
  const [editQTitle, setEditQTitle] = useState('')
  const [editQCat, setEditQCat] = useState('strength')
  const [editQDiff, setEditQDiff] = useState<keyof typeof DIFFICULTY>('medium')
  const [editQIcon, setEditQIcon] = useState('💪')
  const [editQDue, setEditQDue] = useState('')
  const [editQTime, setEditQTime] = useState('')
  const [editQRepeat, setEditQRepeat] = useState('none')

  const [quests, setQuests] = useState<any[]>([])
  const [char, setChar] = useState<any>({ name: 'Adventurer', bio: 'New adventurer ready to quest!', avatar: '', level: 1, xp: 0, gold: 50, streak: 1, lastStreakDate: '', attributes: { strength: 10, intelligence: 10, agility: 10 }, inventory: [], equipped: [], bossDefeated: 0, weeklyXP: [] })
  const [editName, setEditName] = useState(''); const [editBio, setEditBio] = useState(''); const [editAvatar, setEditAvatar] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)
  const [board, setBoard] = useState<any[]>([]); const [userId, setUserId] = useState('guest')
  const [bossHP, setBossHP] = useState(10)
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const t = setInterval(()=> setNow(new Date()), 1000)
    if (typeof window!== 'undefined' && 'Notification' in window && Notification.permission === 'default') Notification.requestPermission()
    return ()=> clearInterval(t)
  }, [])

  const saveChar = (nc: any) => { setChar(nc); localStorage.setItem(`questlife_character_${userId}`, JSON.stringify(nc)); localStorage.setItem('questlife_character', JSON.stringify(nc)); supabase.from('leaderboard').upsert({ user_id: userId, username: nc.name, level: nc.level, xp: nc.xp, gold: nc.gold, strength: nc.attributes.strength, streak: nc.streak, updated_at: new Date().toISOString() }, { onConflict: 'user_id' }).then(()=>{}) }
  const saveQuests = (nq: any[]) => { setQuests(nq); localStorage.setItem(`questlife_quests_${userId}`, JSON.stringify(nq)); localStorage.setItem('questlife_quests', JSON.stringify(nq)) }

  useEffect(() => {
    const check = setInterval(()=> {
      let newQuests = [...quests]
      let newChar = {...char}
      let changedChar = false
      let changedQuests = false
      quests.forEach((q:any)=> {
        if (!q.dueDate ||!q.dueTime || q.penalized) return
        const due = new Date(`${q.dueDate}T${q.dueTime}`)
        const diff = due.getTime() - Date.now()
        if (diff > 0 && diff < 5*60*1000 &&!q.notified) {
          const msg = `⏰ "${q.title}" due at ${q.dueTime}! Complete or lose reward!`
          if ('Notification' in window && Notification.permission === 'granted') new Notification('Quest Due Soon!', { body: msg })
          newQuests = newQuests.map((qq:any)=> qq.id===q.id? {...qq, notified: true} : qq)
          changedQuests = true
        }
        if (diff < 0 &&!q.penalized) {
          const d = DIFFICULTY[q.difficulty as keyof typeof DIFFICULTY] || DIFFICULTY.medium
          newChar.xp = Math.max(0, newChar.xp - d.xp)
          newChar.gold = Math.max(0, newChar.gold - d.gold)
          newChar.level = Math.floor(newChar.xp / 100) + 1
          changedChar = true
          const msg = `⚠️ "${q.title}" FAILED! -${d.xp} XP -${d.gold} Gold deducted!`
          if ('Notification' in window && Notification.permission === 'granted') new Notification('Quest Failed - Penalty!', { body: msg })
          else alert(msg)
          newQuests = newQuests.map((qq:any)=> qq.id===q.id? {...qq, penalized: true, overdueNotified: true, penalty: d} : qq)
          changedQuests = true
        }
      })
      if (changedChar) saveChar(newChar)
      if (changedQuests) saveQuests(newQuests)
    }, 10000)
    return ()=> clearInterval(check)
  }, [quests, char, userId])

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.auth.getUser()
      const authId = data.user?.id; if (!authId) { window.location.href = '/login'; return }
      setUserId(authId)
      const qKey = `questlife_quests_${authId}`; const cKey = `questlife_character_${authId}`
      let q = JSON.parse(localStorage.getItem(qKey) || localStorage.getItem('questlife_quests') || '[]')
      const cRaw = localStorage.getItem(cKey) || localStorage.getItem('questlife_character') || JSON.stringify({ name: data.user.email?.split('@')[0] || 'Adventurer', bio: 'New adventurer ready to quest!', avatar: '', level: 1, xp: 0, gold: 50, streak: 1, lastStreakDate: '', attributes: { strength: 10, intelligence: 10, agility: 10 }, inventory: [], equipped: [], bossDefeated: 0, weeklyXP: [] })
      const c = JSON.parse(cRaw)
      if (!c.bossDefeated) c.bossDefeated = 0; if (!c.weeklyXP) c.weeklyXP = []; if (!c.equipped) c.equipped = []
      const today = getToday()
      if (c.lastStreakDate && c.lastStreakDate!== today && c.lastStreakDate!== getYesterday()) c.streak = 1
      setQuests(q); setChar(c)
      localStorage.setItem(qKey, JSON.stringify(q)); localStorage.setItem(cKey, JSON.stringify(c))
      const { data: boardData } = await supabase.from('leaderboard').select('*').order('xp', { ascending: false }).limit(10)
      if (boardData) setBoard(boardData)
      setBossHP(Math.max(0, 10 - (c.weeklyXP?.length || 0)))
    }
    load()
  }, [])

  const openProfile = () => { setEditName(char.name); setEditBio(char.bio); setEditAvatar(char.avatar); setShowProfile(true) }
  const handlePhoto = (e: any) => { const file = e.target.files[0]; if (!file) return; if (file.size > 500000) return alert('Use <500KB'); const r = new FileReader(); r.onload = () => setEditAvatar(r.result as string); r.readAsDataURL(file) }
  const saveProfile = () => { if (!editName.trim()) return alert('Name required'); saveChar({...char, name: editName.trim(), bio: editBio.trim(), avatar: editAvatar}); setShowProfile(false) }

  const handleAdd = () => {
    if (!title.trim()) return alert('Title required')
    if (!dueDate ||!dueTime) return alert('Please set date and time to complete quest')
    const nq = { id: Date.now().toString(), title: title.trim(), category: cat, difficulty, icon: qIcon, dueDate, dueTime, repeat, notified: false, overdueNotified: false, penalized: false, createdAt: new Date().toISOString() }
    saveQuests([nq,...quests]); setTitle(''); setDueDate(''); setDueTime(''); setShowAdd(false)
  }

  const handleComplete = (id: string) => {
    const quest = quests.find((q:any)=> q.id===id); if (!quest) return
    const d = DIFFICULTY[quest.difficulty as keyof typeof DIFFICULTY] || DIFFICULTY.medium
    const isPenalized = quest.penalized
    let rewardXP = isPenalized? Math.floor(d.xp/2) : d.xp
    let rewardGold = isPenalized? Math.floor(d.gold/2) : d.gold
    if (isPenalized) alert(`Late completion! Only +${rewardXP} XP +${rewardGold} Gold (half) because penalty already applied`)
    let newQuests; if (quest.repeat==='daily') { newQuests = quests.map((q:any)=> q.id===id? {...q, lastDone: getToday(), notified: false, overdueNotified: false, penalized: false} : q) } else if (quest.repeat==='weekly') { const next = new Date(); next.setDate(next.getDate()+7); newQuests = quests.map((q:any)=> q.id===id? {...q, dueDate: next.toISOString().split('T')[0], notified: false, overdueNotified: false, penalized: false} : q) } else { newQuests = quests.filter((q:any)=> q.id!==id) }
    saveQuests(newQuests)
    const today = getToday(); const yesterday = getYesterday(); let newStreak = char.streak
    if (char.lastStreakDate!== today) { if (char.lastStreakDate === yesterday || char.lastStreakDate === '') newStreak = char.lastStreakDate? char.streak+1 : 1; else { const diffDays = Math.floor((new Date().getTime() - new Date(char.lastStreakDate).getTime())/(1000*60*60*24)); newStreak = diffDays===1? char.streak+1 : 1 } }
    const newXp = char.xp + rewardXP; const newGold = char.gold + rewardGold; const newLevel = Math.floor(newXp/100)+1
    const attrs = {...char.attributes}; if (quest.category==='strength') attrs.strength++; else if (quest.category==='intellect') attrs.intelligence++; else attrs.agility++
    const weeklyXP = [...(char.weeklyXP||[]), { date: today, xp: rewardXP }].slice(-30)
    let newBossHP = bossHP -1; if (newBossHP<=0) { newBossHP = 10; alert('👹 BOSS DEFEATED! +200 Gold!'); saveChar({...char, gold: newGold+200}) }
    const oldRank = getRank(char.level).name; const newR = getRank(newLevel); if (oldRank!== newR.name) alert(`🎉 RANK UP! ${oldRank} → ${newR.name} ${newR.icon}`)
    const nc = {...char, xp: newXp, gold: newGold, level: newLevel, attributes: attrs, streak: newStreak, lastStreakDate: today, weeklyXP }
    saveChar(nc); setBossHP(newBossHP)
  }

  const handleDelete = (id: string) => { if (!confirm('Delete this quest?')) return; saveQuests(quests.filter((q:any)=> q.id!==id)) }
  const openEditQuest = (q:any) => { setEditingQuest(q); setEditQTitle(q.title); setEditQCat(q.category); setEditQDiff(q.difficulty || 'medium'); setEditQIcon(q.icon || '💪'); setEditQDue(q.dueDate || ''); setEditQTime(q.dueTime || ''); setEditQRepeat(q.repeat || 'none'); setShowEditQuest(true) }
  const handleUpdateQuest = () => { if (!editQTitle.trim()) return alert('Title required'); if (!editQDue ||!editQTime) return alert('Set date and time'); const updated = quests.map((q:any)=> q.id===editingQuest.id? {...q, title: editQTitle.trim(), category: editQCat, difficulty: editQDiff, icon: editQIcon, dueDate: editQDue, dueTime: editQTime, repeat: editQRepeat, notified: false, overdueNotified: false, penalized: false } : q); saveQuests(updated); setShowEditQuest(false); setEditingQuest(null) }

  const buyItem = (id: string, cost: number) => { if (char.gold < cost || char.inventory.includes(id)) return; if (id==='potion') { saveChar({...char, gold: char.gold - cost, xp: char.xp + 100, level: Math.floor((char.xp+100)/100)+1}); return } saveChar({...char, gold: char.gold - cost, inventory: [...char.inventory, id] }) }
  const toggleEquip = (id: string) => { const isEq = char.equipped?.includes(id); let ne, na = {...char.attributes} as any; if (isEq) { ne = char.equipped.filter((x:string)=> x!==id); if(id==='sword') na.strength-=5; if(id==='shield') na.agility-=5; if(id==='crown') na.intelligence-=10 } else { ne = [...(char.equipped||[]), id]; if(id==='sword') na.strength+=5; if(id==='shield') na.agility+=5; if(id==='crown') na.intelligence+=10 } saveChar({...char, equipped: ne, attributes: na}) }
  const useItem = (id: string) => { if(id==='gem'){ if(!confirm('Use Gem +50 Gold?')) return; saveChar({...char, gold: char.gold+50, inventory: char.inventory.filter((x:string)=>x!==id), equipped: char.equipped.filter((x:string)=>x!==id)}) } else if(id==='potion'){ saveChar({...char, xp: char.xp+100, level: Math.floor((char.xp+100)/100)+1, inventory: char.inventory.filter((x:string)=>x!==id)}) } else toggleEquip(id) }

  const getTimeLeft = (q:any) => {
    if (!q.dueDate ||!q.dueTime) return null
    const due = new Date(`${q.dueDate}T${q.dueTime}`); const diff = due.getTime() - now.getTime()
    if (diff <= 0) return { text: `OVERDUE -${q.penalty?.xp || DIFFICULTY[q.difficulty as keyof typeof DIFFICULTY]?.xp} XP`, color: 'text-red-400 font-black animate-pulse', overdue: true }
    const h = Math.floor(diff / (1000*60*60)); const m = Math.floor((diff % (1000*60*60))/(1000*60)); const s = Math.floor((diff % (1000*60))/1000)
    if (h>0) return { text: `${h}h ${m}m left`, color: h<1? 'text-yellow-300' : 'text-white/60', overdue: false }
    return { text: `${m}m ${s}s left`, color: m<5? 'text-yellow-300 animate-pulse font-bold' : 'text-white/60', overdue: false }
  }

  const rank = getRank(char.level); const nextRank = getNextRank(char.level)
  const filtered = filter==='all'? quests : quests.filter((q:any)=> q.category===filter)
  const unlockedAch = ACHIEVEMENTS.filter(a=> a.check(char, quests))

  return (
    <div 
      style={{ backgroundImage: `url('/dashboard-bg.jpg')` }} 
      className="min-h-screen w-full bg-cover bg-center bg-fixed bg-no-repeat text-white"
    >
      {/* 45% dark tint overlay so text and cards remain legible over the background image */}
      <div className="min-h-screen w-full bg-black/45 backdrop-blur-[1px] p-4">
        <div className="max-w-[1300px] mx-auto">
          <div className="flex justify-between items-center mb-5">
            <div className="flex items-center gap-3"><div className="w-10 h-10 bg-yellow-400 rounded-xl flex items-center justify-center text-black font-black">✦</div><h1 className="font-black tracking-widest">QUESTLIFE</h1></div>
            <div className="flex gap-2 items-center"><div className={`px-3 py-1.5 rounded-full font-black text-xs ${rank.color} ${rank.text}`}>{rank.icon} {rank.name}</div><div className="px-3 py-1.5 rounded-full bg-amber-400/20 text-amber-300 font-bold text-xs">{char.gold} G • {char.xp} XP</div><div className="px-3 py-1.5 rounded-full bg-red-500/20 text-red-300 font-bold text-xs">👹 HP:{bossHP}/10</div><button onClick={async ()=>{ await supabase.auth.signOut(); window.location.href='/login'}} className="px-3 py-1.5 rounded-full bg-white/10 text-xs">Sign out</button></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className="space-y-5">
              <div onClick={openProfile} className={`rounded-[20px] bg-[#1e3a5f]/85 backdrop-blur-md p-5 cursor-pointer border-2 ${rank.border} hover:ring-2 hover:ring-yellow-400/50`}>
                <div className="flex gap-3"><div className="relative">{char.avatar? <img src={char.avatar} className={`w-16 h-16 rounded-xl object-cover border-2 ${rank.border}`} /> : <div className={`w-16 h-16 rounded-xl flex items-center justify-center text-2xl border-2 ${rank.border} bg-yellow-400`}>🧑</div>}<div className={`absolute -bottom-1 -right-1 w-6 h-6 ${rank.color} rounded-full flex items-center justify-center text-xs border border-white`}>{rank.icon}</div></div><div className="flex-1"><h2 className="font-black text-lg">{char.name} <span className="text-[9px] bg-white/20 px-1.5 py-0.5 rounded-full">EDIT</span></h2><div className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[9px] font-black ${rank.color} ${rank.text}`}>{rank.name} • Lv.{char.level}</div><p className="text-white/50 text-xs mt-1 truncate">{char.bio}</p><div className="mt-1 h-1.5 bg-black/30 rounded-full overflow-hidden w-28"><div className="h-full bg-cyan-400" style={{ width: `${char.xp % 100}%` }} /></div></div></div>
                <div className="mt-3 rounded-xl bg-black/30 p-2 border border-white/10"><div className="flex justify-between text-[9px] text-white/50"><span>{rank.icon} {rank.name}</span><span>{nextRank? `${nextRank.icon} ${nextRank.name} Lv.${nextRank.min}` : 'MAX'}</span></div><div className="mt-1 h-1.5 bg-black/40 rounded-full overflow-hidden"><div className={`h-full ${rank.color}`} style={{ width: nextRank? `${((char.level - rank.min)/(nextRank.min - rank.min))*100}%` : '100%' }} /></div></div>
                <div className="mt-3 flex gap-1.5 text-[11px] font-bold"><span className="px-2 py-1 rounded bg-black/20">STR:{char.attributes.strength}</span><span className="px-2 py-1 rounded bg-black/20">INT:{char.attributes.intelligence}</span><span className="px-2 py-1 rounded bg-black/20">AGI:{char.attributes.agility}</span></div>
                <div className="mt-3 rounded-xl bg-black/20 p-2.5"><p className="text-[10px] text-white/40">STREAK 🔥 {char.streak} {char.lastStreakDate===getToday()&&'✓'}</p><p className="text-[11px] mt-1">{char.lastStreakDate===getToday()? 'Saved today!' : 'Do 1 quest!'}</p></div>
              </div>
              <div className="rounded-[20px] bg-white/[0.07] backdrop-blur-md border border-white/10 p-4"><h3 className="font-black text-[11px] tracking-widest mb-2">👹 WEEKLY BOSS</h3><div className="h-3 bg-black/40 rounded-full overflow-hidden"><div className="h-full bg-red-500 transition-all" style={{ width: `${(bossHP/10)*100}%` }} /></div><p className="text-[11px] text-white/50 mt-2">{bossHP>0? `Defeat ${bossHP} more quests!` : 'Boss Defeated!'} • {char.bossDefeated} defeated</p></div>
              <div className="rounded-[20px] bg-white/[0.07] backdrop-blur-md border border-white/10 p-4"><h3 className="font-black text-[11px] tracking-widest mb-2">🏆 ACHIEVEMENTS {unlockedAch.length}/{ACHIEVEMENTS.length}</h3><div className="grid grid-cols-3 gap-2">{ACHIEVEMENTS.map(a=>{ const unlocked = a.check(char, quests); return <div key={a.id} className={`p-2 rounded-xl text-center border ${unlocked? 'bg-yellow-400/20 border-yellow-400/30' : 'bg-black/20 border-white/5 opacity-40'}`}><div className="text-lg">{a.icon}</div><p className="text-[9px] font-bold mt-1">{a.name}</p></div> })}</div></div>
              <div className="rounded-[20px] bg-white/[0.07] backdrop-blur-md border border-yellow-400/20 p-4"><h3 className="font-black text-xs tracking-widest mb-2">🏆 LEADERBOARD</h3><div className="space-y-1.5">{board.map((p:any,i:number)=>{ const pr = getRank(p.level); return <div key={p.user_id} className={`flex justify-between items-center p-2 rounded-xl text-xs ${p.user_id===userId?'bg-yellow-400/20 border border-yellow-400/30':'bg-black/20'}`}><span className="font-bold truncate">{i===0?'🥇':i===1?'🥈':i===2?'🥉':`#${i+1}`} {pr.icon} {p.username}</span><span className="text-yellow-300 font-bold">{pr.name}</span></div> })}</div></div>
            </div>

            <div className="lg:col-span-2">
              <div className="rounded-[20px] bg-white/[0.07] backdrop-blur-md border border-white/10 p-5">
                <div className="flex justify-between items-center mb-3"><h2 className="font-black text-lg">Active Quests ({filtered.length})</h2><button onClick={()=> setShowAdd(true)} className="px-4 py-1.5 rounded-full bg-yellow-400 text-black font-black text-xs">+ Add Quest</button></div>
                <div className="flex gap-2 mb-4 overflow-x-auto">{['all','strength','intellect','spirit'].map((f)=> (<button key={f} onClick={()=> setFilter(f)} className={`px-3 py-1 rounded-full text-xs font-bold capitalize whitespace-nowrap ${filter===f? 'bg-white text-black' : 'bg-white/10 text-white/60'}`}>{f}</button>))}</div>
                <div className="space-y-2">
                  {filtered.map((q:any)=> { const d = DIFFICULTY[q.difficulty as keyof typeof DIFFICULTY] || DIFFICULTY.medium; const timeLeft = getTimeLeft(q); const penalized = q.penalized; return (
                    <div key={q.id} className={`flex justify-between items-center p-3 rounded-xl border ${penalized? 'bg-red-500/20 border-red-500/40' : timeLeft?.overdue? 'bg-red-500/10 border-red-500/30' : 'bg-black/30 border-white/10'}`}>
                      <div className="flex gap-2 items-center"><span className="text-xl">{q.icon || '🎯'}</span><div><p className="font-bold text-sm flex gap-2 items-center">{q.title} <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${d.color}`}>{d.label}</span> {penalized&& <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-red-500/30 text-red-300">PENALTY -{d.xp}XP -{d.gold}G</span>}</p><p className="text-[11px] text-white/40">{q.category} • +{d.xp} XP +{d.gold} G • 📅 {q.dueDate} ⏰ {q.dueTime}</p>{timeLeft&& <p className={`text-[11px] ${timeLeft.color}`}>⏳ {timeLeft.text}</p>}</div></div>
                      <div className="flex gap-1"><button onClick={()=> openEditQuest(q)} className="px-2.5 py-1.5 rounded-xl bg-white/10 text-white text-xs">✏️</button><button onClick={()=> handleDelete(q.id)} className="px-2.5 py-1.5 rounded-xl bg-red-500/20 text-red-300 text-xs">🗑️</button><button onClick={()=> handleComplete(q.id)} className={`px-3 py-1.5 rounded-xl font-black text-xs ${penalized? 'bg-yellow-400 text-black' : 'bg-emerald-400 text-black'}`}>{penalized? 'Late Done' : 'Done'}</button></div>
                    </div>
                  )})}
                  {filtered.length===0 && <p className="text-center text-white/30 py-8 text-sm">No quests. Click + Add Quest!</p>}
                </div>
              </div>
              <div className="mt-5 rounded-[20px] bg-white/[0.07] backdrop-blur-md border border-white/10 p-4"><p className="text-[10px] tracking-widest text-white/30 font-bold mb-3">ITEM SHOP + INVENTORY</p><div className="grid grid-cols-1 gap-2">{SHOP.map((item)=>{ const owned = char.inventory.includes(item.id); const equipped = char.equipped?.includes(item.id); return (<div key={item.id} className={`flex justify-between items-center p-2.5 rounded-xl border ${equipped?'bg-yellow-400/20 border-yellow-400/40':'bg-black/30 border-white/10'}`}><div className="flex items-center gap-2"><span className="text-lg">{item.icon}</span><div><span className="text-xs font-bold block">{item.name} {equipped&&'✓'}</span><span className="text-[9px] text-white/40">{item.effect}</span></div></div>{!owned? <button onClick={()=> buyItem(item.id, item.cost)} className="text-xs px-2.5 py-1 rounded-full font-bold bg-yellow-400 text-black">{item.cost} G</button> : item.id==='gem' || item.id==='potion'? <button onClick={()=> useItem(item.id)} className="text-xs px-2.5 py-1 rounded-full font-bold bg-purple-500 text-white">USE</button> : <button onClick={()=> useItem(item.id)} className={`text-xs px-2.5 py-1 rounded-full font-bold ${equipped?'bg-white/20':'bg-emerald-400 text-black'}`}>{equipped?'UNEQUIP':'EQUIP'}</button>}</div>)})}</div></div>
            </div>
          </div>

          {/* DAILY GRAPH */}
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className="lg:col-span-2 rounded-[20px] bg-white/[0.07] backdrop-blur-md border border-white/10 p-5">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-black text-xs tracking-widest">📊 DAILY PROGRESS - LAST 7 DAYS</h3>
                <span className="text-[10px] text-white/40">Total: {char.weeklyXP?.reduce((s:any,v:any)=> s+v.xp,0) || 0} XP</span>
              </div>
              <div className="flex gap-2 h-32 items-end">
                {[6,5,4,3,2,1,0].map((ago)=> {
                  const date = new Date(Date.now() - ago*86400000).toISOString().split('T')[0]
                  const dayName = new Date(Date.now() - ago*86400000).toLocaleDateString('en', { weekday: 'short' })
                  const dayXP = char.weeklyXP?.filter((w:any)=> w.date===date).reduce((s:any,v:any)=> s+v.xp,0) || 0
                  const maxXP = Math.max(50,... (char.weeklyXP?.map((w:any)=> w.xp) || [0]))
                  const height = dayXP? Math.max(14, (dayXP/maxXP)*100) : 8
                  const isToday = ago===0
                  return (
                    <div key={date} className="flex-1 flex flex-col items-center gap-1">
                      <span className="text-[10px] text-yellow-300 font-bold">{dayXP>0? `+${dayXP}` : ''}</span>
                      <div className={`w-full rounded-t-lg transition-all ${isToday? 'bg-yellow-400' : dayXP>0? 'bg-cyan-400' : 'bg-white/10'}`} style={{ height: `${height}%`, minHeight: dayXP? '14px' : '6px' }} />
                      <span className={`text-[10px] font-bold ${isToday? 'text-yellow-400' : 'text-white/40'}`}>{dayName}</span>
                      <span className="text-[8px] text-white/30">{date.slice(5)}</span>
                    </div>
                  )
                })}
              </div>
              <div className="mt-4 grid grid-cols-4 gap-2 text-[10px]">
                <div className="p-2.5 rounded-xl bg-black/20 text-center"><p className="text-white/40">Today</p><p className="font-black text-cyan-300 mt-1">+{char.weeklyXP?.filter((w:any)=> w.date===getToday()).reduce((s:any,v:any)=> s+v.xp,0) || 0} XP</p></div>
                <div className="p-2.5 rounded-xl bg-black/20 text-center"><p className="text-white/40">Quests Done</p><p className="font-black text-white mt-1">{char.weeklyXP?.length || 0}</p></div>
                <div className="p-2.5 rounded-xl bg-black/20 text-center"><p className="text-white/40">Streak</p><p className="font-black text-orange-300 mt-1">🔥 {char.streak}</p></div>
                <div className="p-2.5 rounded-xl bg-black/20 text-center"><p className="text-white/40">Avg / Day</p><p className="font-black text-emerald-300 mt-1">{Math.round((char.weeklyXP?.reduce((s:any,v:any)=> s+v.xp,0) || 0)/7)} XP</p></div>
              </div>
            </div>
            <div className="rounded-[20px] bg-[#1e3a5f]/85 backdrop-blur-md border border-cyan-400/20 p-5">
              <h3 className="font-black text-xs tracking-widest mb-3">⚡ TODAY'S STATS</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 rounded-xl bg-black/20"><span className="text-xs">Overdue Quests</span><span className="text-xs font-black text-red-400">{quests.filter((q:any)=> { if(!q.dueDate||!q.dueTime) return false; return new Date(`${q.dueDate}T${q.dueTime}`).getTime() < now.getTime() }).length}</span></div>
                <div className="flex justify-between items-center p-3 rounded-xl bg-black/20"><span className="text-xs">Due Today</span><span className="text-xs font-black text-yellow-300">{quests.filter((q:any)=> q.dueDate===getToday()).length}</span></div>
                <div className="flex justify-between items-center p-3 rounded-xl bg-black/20"><span className="text-xs">Completed Today</span><span className="text-xs font-black text-emerald-400">{char.weeklyXP?.filter((w:any)=> w.date===getToday()).length || 0}</span></div>
                <div className="mt-2 h-2 bg-black/30 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-cyan-400 to-yellow-400 transition-all" style={{ width: `${Math.min(100, quests.filter((q:any)=> q.dueDate===getToday()).length>0? (char.weeklyXP?.filter((w:any)=> w.date===getToday()).length / quests.filter((q:any)=> q.dueDate===getToday()).length)*100 : 0)}%` }} /></div>
                <p className="text-[10px] text-white/40 text-center">Today's Completion</p>
              </div>
            </div>
          </div>

          {/* Add Quest Modal */}
          {showAdd && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={()=> setShowAdd(false)} />
              <div className="relative w-full max-w-md rounded-[20px] bg-[#1e293b] border border-white/10 p-5 max-h-[90vh] overflow-y-auto">
                <h3 className="font-black text-lg mb-3">Add New Quest</h3>
                <label className="text-[10px] text-white/50 font-bold">TITLE</label>
                <input value={title} onChange={(e)=> setTitle(e.target.value)} placeholder="e.g. Workout" className="w-full mt-1 px-3 py-2.5 rounded-xl bg-black/30 border border-white/10 text-white outline-none text-sm" />
                <label className="text-[10px] text-white/50 font-bold mt-3 block">ICON</label>
                <div className="flex gap-1.5 mt-1 flex-wrap">{QUEST_ICONS.map(ic=> <button key={ic} onClick={()=> setQIcon(ic)} className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm ${qIcon===ic? 'bg-yellow-400 text-black' : 'bg-white/10'}`}>{ic}</button>)}</div>
                <label className="text-[10px] text-white/50 font-bold mt-3 block">CATEGORY</label>
                <div className="flex gap-2 mt-1">{['strength','intellect','spirit'].map((c)=> (<button key={c} onClick={()=> setCat(c)} className={`px-3 py-1.5 rounded-full text-xs font-bold capitalize ${cat===c? 'bg-yellow-400 text-black' : 'bg-white/10'}`}>{c}</button>))}</div>
                <label className="text-[10px] text-white/50 font-bold mt-3 block">DIFFICULTY (Penalty = same)</label>
                <div className="grid grid-cols-4 gap-2 mt-1">{(Object.keys(DIFFICULTY) as any).map((k:string)=>{ const d = DIFFICULTY[k as keyof typeof DIFFICULTY]; return <button key={k} onClick={()=> setDifficulty(k as any)} className={`p-2 rounded-xl text-xs font-bold border ${difficulty===k? 'bg-white text-black border-white' : 'bg-black/20 border-white/10 text-white/60'}`}><div>{d.label}</div><div className="text-[10px]">+{d.xp}XP / -{d.xp}XP</div></button> })}</div>
                <div className="grid grid-cols-2 gap-3 mt-3">
                  <div><label className="text-[10px] text-white/50 font-bold">DUE DATE *</label><input type="date" value={dueDate} onChange={(e)=> setDueDate(e.target.value)} className="w-full mt-1 px-3 py-2 rounded-xl bg-black/30 border border-white/10 text-white outline-none text-xs" /></div>
                  <div><label className="text-[10px] text-white/50 font-bold">DUE TIME *</label><input type="time" value={dueTime} onChange={(e)=> setDueTime(e.target.value)} className="w-full mt-1 px-3 py-2 rounded-xl bg-black/30 border border-white/10 text-white outline-none text-xs" /></div>
                </div>
                <div className="mt-3">
                  <label className="text-[10px] text-white/50 font-bold">REPEAT</label>
                  <select value={repeat} onChange={(e)=> setRepeat(e.target.value)} className="w-full mt-1 px-3 py-2 rounded-xl bg-black/30 border border-white/10 text-white outline-none text-xs"><option value="none">None</option><option value="daily">Daily</option><option value="weekly">Weekly</option></select>
                </div>
                <p className="text-[10px] text-red-300/80 mt-3">⚠️ If not completed on time, -{DIFFICULTY[difficulty].xp} XP -{DIFFICULTY[difficulty].gold} Gold will be deducted automatically!</p>
                <div className="flex gap-3 mt-5">
                  <button onClick={()=> setShowAdd(false)} className="flex-1 py-2.5 rounded-xl bg-white/10 font-bold text-sm">Cancel</button>
                  <button onClick={handleAdd} className="flex-1 py-2.5 rounded-xl bg-yellow-400 text-black font-black text-sm">Create</button>
                </div>
              </div>
            </div>
          )}

          {/* Edit Quest Modal */}
          {showEditQuest && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={()=> setShowEditQuest(false)} />
              <div className="relative w-full max-w-md rounded-[20px] bg-[#1e293b] border border-white/10 p-5 max-h-[90vh] overflow-y-auto">
                <h3 className="font-black text-lg mb-3">Edit Quest</h3>
                <label className="text-[10px] text-white/50 font-bold">TITLE</label><input value={editQTitle} onChange={(e)=> setEditQTitle(e.target.value)} className="w-full mt-1 px-3 py-2.5 rounded-xl bg-black/30 border border-white/10 text-white outline-none text-sm" />
                <label className="text-[10px] text-white/50 font-bold mt-3 block">ICON</label><div className="flex gap-1.5 mt-1 flex-wrap">{QUEST_ICONS.map(ic=> <button key={ic} onClick={()=> setEditQIcon(ic)} className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm ${editQIcon===ic? 'bg-yellow-400 text-black' : 'bg-white/10'}`}>{ic}</button>)}</div>
                <label className="text-[10px] text-white/50 font-bold mt-3 block">CATEGORY</label><div className="flex gap-2 mt-1">{['strength','intellect','spirit'].map((c)=> (<button key={c} onClick={()=> setEditQCat(c)} className={`px-3 py-1.5 rounded-full text-xs font-bold capitalize ${editQCat===c? 'bg-yellow-400 text-black' : 'bg-white/10'}`}>{c}</button>))}</div>
                <label className="text-[10px] text-white/50 font-bold mt-3 block">DIFFICULTY</label><div className="grid grid-cols-4 gap-2 mt-1">{(Object.keys(DIFFICULTY) as any).map((k:string)=>{ const d = DIFFICULTY[k as keyof typeof DIFFICULTY]; return <button key={k} onClick={()=> setEditQDiff(k as any)} className={`p-2 rounded-xl text-xs font-bold border ${editQDiff===k? 'bg-white text-black border-white' : 'bg-black/20 border-white/10 text-white/60'}`}><div>{d.label}</div><div className="text-[10px]">+{d.xp}XP</div></button> })}</div>
                <div className="grid grid-cols-2 gap-3 mt-3"><div><label className="text-[10px] text-white/50 font-bold">DUE DATE *</label><input type="date" value={editQDue} onChange={(e)=> setEditQDue(e.target.value)} className="w-full mt-1 px-3 py-2 rounded-xl bg-black/30 border border-white/10 text-white outline-none text-xs" /></div><div><label className="text-[10px] text-white/50 font-bold">DUE TIME *</label><input type="time" value={editQTime} onChange={(e)=> setEditQTime(e.target.value)} className="w-full mt-1 px-3 py-2 rounded-xl bg-black/30 border border-white/10 text-white outline-none text-xs" /></div></div>
                <div className="mt-3"><label className="text-[10px] text-white/50 font-bold">REPEAT</label><select value={editQRepeat} onChange={(e)=> setEditQRepeat(e.target.value)} className="w-full mt-1 px-3 py-2 rounded-xl bg-black/30 border border-white/10 text-white outline-none text-xs"><option value="none">None</option><option value="daily">Daily</option><option value="weekly">Weekly</option></select></div>
                <div className="flex gap-3 mt-5"><button onClick={()=> setShowEditQuest(false)} className="flex-1 py-2.5 rounded-xl bg-white/10 font-bold text-sm">Cancel</button><button onClick={handleUpdateQuest} className="flex-1 py-2.5 rounded-xl bg-emerald-400 text-black font-black text-sm">Save Changes</button></div>
              </div>
            </div>
          )}

          {/* Profile Modal */}
          {showProfile && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={()=> setShowProfile(false)} />
              <div className="relative w-full max-w-md rounded-[20px] bg-[#1e293b] border border-white/10 p-5">
                <h3 className="font-black text-lg">Enhance Profile</h3>
                <div className={`inline-flex px-2 py-1 rounded-full text-xs font-black ${rank.color} ${rank.text} mt-1`}>{rank.icon} {rank.name} • Lv.{char.level} • {char.bossDefeated} Bosses</div>
                <div className="flex flex-col items-center gap-2 my-3">
                  <div className="relative">
                    {char.avatar || editAvatar ? (
                      <img src={editAvatar || char.avatar} className={`w-20 h-20 rounded-2xl object-cover border-2 ${rank.border}`} />
                    ) : (
                      <div className={`w-20 h-20 rounded-2xl flex items-center justify-center text-3xl border-2 ${rank.border} bg-yellow-400`}>🧑</div>
                    )}
                    <button onClick={()=> fileRef.current?.click()} className="absolute -bottom-1 -right-1 bg-white text-black text-[9px] px-1.5 py-0.5 rounded-full font-bold">Change</button>
                  </div>
                  <input ref={fileRef} type="file" accept="image/*" onChange={handlePhoto} className="hidden" />
                </div>
                <label className="text-[10px] text-white/50 font-bold">DISPLAY NAME</label>
                <input value={editName} onChange={(e)=> setEditName(e.target.value)} className="w-full mt-1 mb-2 px-3 py-2.5 rounded-xl bg-black/30 border border-white/10 text-white outline-none text-sm" />
                <label className="text-[10px] text-white/50 font-bold">BIO</label>
                <textarea value={editBio} onChange={(e)=> setEditBio(e.target.value)} rows={3} className="w-full mt-1 mb-3 px-3 py-2.5 rounded-xl bg-black/30 border border-white/10 text-white outline-none text-sm" />
                <div className="flex gap-3">
                  <button onClick={()=> setShowProfile(false)} className="flex-1 py-2.5 rounded-xl bg-white/10 font-bold text-sm">Cancel</button>
                  <button onClick={saveProfile} className="flex-1 py-2.5 rounded-xl bg-yellow-400 text-black font-black text-sm">Save</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}