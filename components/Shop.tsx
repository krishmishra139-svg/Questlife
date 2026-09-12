'use client'
import { useCharacterStore } from '@/store/useCharacterStore'

const SHOP_ITEMS = [
  { id: 'sword', name: 'Iron Sword', cost: 50, rarity: 'common' },
  { id: 'shield', name: 'Wooden Shield', cost: 50, rarity: 'common' },
  { id: 'crown', name: 'Hero Crown', cost: 200, rarity: 'rare' },
  { id: 'gem', name: 'Magic Gem', cost: 500, rarity: 'epic' },
  { id: 'legendary', name: 'Legendary Set', cost: 1000, rarity: 'legendary' },
]

export default function Shop() {
  const character = useCharacterStore((s: any) => s.character || s.profile)
  const gold = character?.gold?? 0
  const inventory = character?.inventory?? []

  return (
    <div className="space-y-3">
      {SHOP_ITEMS.map((item) => {
        const owned = (inventory || []).includes(item.id)
        const canAfford = (gold || 0) >= item.cost

        return (
          <div key={item.id} className="bg-[#1e3a5f]/60 border border-white/10 rounded-xl p-3 flex justify-between items-center">
            <div>
              <p className="font-bold text-white text-sm">{item.name}</p>
              <p className="text-xs text-white/50">{item.cost} gold • {item.rarity}</p>
            </div>
            <span className={`text-xs px-3 py-1 rounded-full font-bold ${owned? 'bg-green-500/20 text-green-400' : canAfford? 'bg-yellow-400 text-black' : 'bg-white/10 text-white/40'}`}>
              {owned? 'Owned' : canAfford? 'Buy' : 'No Gold'}
            </span>
          </div>
        )
      })}
    </div>
  )
}