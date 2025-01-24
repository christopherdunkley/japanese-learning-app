'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'

export function Navbar() {
    const pathname = usePathname()
    const [dueCount, setDueCount] = useState(0)
  
    useEffect(() => {
      async function fetchDueCount() {
        const res = await fetch('/api/stats/due-count')
        const data = await res.json()
        setDueCount(data.count)
      }
      fetchDueCount()
    }, [pathname])

 return (
   <nav className="bg-gray-800 text-gray-100">
     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
       <div className="flex items-center justify-between h-16">
         <div className="flex items-center">
           <Link 
             href="/"
             className="text-xl font-bold"
           >
             Kanji Learning
           </Link>
         </div>
         <div className="flex space-x-4">
           <Link 
             href="/"
             className={`px-3 py-2 rounded-md ${
               pathname === '/' ? 'bg-gray-900' : 'hover:bg-gray-700'
             }`}
           >
             Dashboard
           </Link>
           <Link 
             href="/study"
             className={`px-3 py-2 rounded-md ${
               pathname === '/study' ? 'bg-gray-900' : 'hover:bg-gray-700'
             }`}
           >
             Study ({dueCount})
           </Link>
         </div>
       </div>
     </div>
   </nav>
 )
}