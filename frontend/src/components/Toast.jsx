import { useEffect, useState } from 'react'

let listeners = []
export const toast = (type, message) => {
  listeners.forEach(l => l({ type, message }))
}

export default function Toast() {
  const [items, setItems] = useState([])

  useEffect(() => {
    const listener = (t) => {
      const id = Date.now() + Math.random()
      setItems(prev => [...prev, { id, ...t }])
      setTimeout(() => setItems(prev => prev.filter(i => i.id !== id)), 4000)
    }
    listeners.push(listener)
    return () => { listeners = listeners.filter(l => l !== listener) }
  }, [])

  return (
    <div className="fixed right-4 top-16 z-50 space-y-2">
      {items.map(i => (
        <div key={i.id} className={`px-4 py-2 rounded shadow text-white ${i.type==='error' ? 'bg-red-600' : 'bg-green-600'}`}>
          {i.message}
        </div>
      ))}
    </div>
  )
}
