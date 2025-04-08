'use client'

import { Archive, Bell, Brush, Lightbulb, Palette, Settings, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar() {

  const pathname = usePathname();
  if (pathname === '/login') return null;
  return (
    <div className="fixed left-0 top-20 h-[calc(100vh-48px)] w-64 bg-[#202124] text-gray-300 ">
      <nav className="p-2">
        <ul className="space-y-1">
          <SidebarItem icon={<Lightbulb size={18} />} text="Notas" active />
        </ul>
      </nav>
    </div>
  );
}

function SidebarItem({ icon, text, active = false }: { icon: React.ReactNode; text: string; active?: boolean }) {
  return (
    <li>
      <Link
        href="#"
        className={`flex items-center gap-3 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${active ? 'bg-[#41331C] text-yellow-300 hover:bg-[#41331C]' : 'hover:bg-[#3C4043] hover:text-white'
          }`}
      >
        <span className="opacity-80">{icon}</span>
        <span>{text}</span>
      </Link>
    </li>
  );
}   