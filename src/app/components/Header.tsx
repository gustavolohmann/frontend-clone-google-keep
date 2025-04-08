'use client'


import { Search, RefreshCw, List, Settings } from 'lucide-react';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';

export default function Header() {

    const pathname = usePathname();
    if (pathname === '/login') return null;
    const [searchQuery, setSearchQuery] = useState('');
    const router = useRouter();

    useEffect(() => {
        if (searchQuery.trim() !== '') {
            router.push(`/?query=${encodeURIComponent(searchQuery)}`);
        }
    }, [searchQuery, router]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    return (
        <header className="sticky top-0 z-50 bg-[#202124] text-white shadow-sm border-b border-[#5F6368]">
            <div className="flex h-16 items-center px-4">
                <div className="flex items-center min-w-[240px]">
                    <div className="flex items-center">
                        <Image
                            src="/keep_2020q4_48dp.png"
                            alt="Google Keep"
                            width={40}
                            height={40}
                            className="h-10 w-10"
                        />
                        <span className="ml-2 text-xl font-medium">Keep</span>
                    </div>
                </div>

                <div className="flex flex-1 justify-center">
                    <div className="flex max-w-2xl flex-1 items-center rounded-lg bg-[#525355] bg-opacity-20 px-4 py-2 hover:bg-opacity-30 focus-within:bg-opacity-30">
                        <Search className="h-5 w-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Pesquisar"
                            className="ml-2 w-full bg-transparent text-white outline-none placeholder:text-gray-400"
                            value={searchQuery}
                            onChange={handleInputChange}

                        />
                    </div>
                </div>

                <div className="flex min-w-[240px] justify-end items-center space-x-4">
                    <button className="rounded-full p-2 text-gray-300 hover:bg-[#3C4043] hover:text-white">
                        <RefreshCw className="h-5 w-5" />
                    </button>
                    <button className="rounded-full p-2 text-gray-300 hover:bg-[#3C4043] hover:text-white">
                        <List className="h-5 w-5" />
                    </button>
                    <button className="rounded-full p-2 text-gray-300 hover:bg-[#3C4043] hover:text-white">
                        <Settings className="h-5 w-5" />
                    </button>
                </div>
            </div>
        </header>
    );
}