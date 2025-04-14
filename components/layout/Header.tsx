"use client"

import { useState, useEffect } from 'react';
import { MapPin, Menu, X, Heart, Bell } from 'lucide-react';
import { Button } from "@/components/ui/button";
import Link from 'next/link';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      // For the main navbar sticky effect
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header className={`${isScrolled ? 'fixed top-0 left-0 right-0 border-b border-gray-200 shadow-sm bg-white/95 backdrop-blur-sm z-50' : 'bg-white'} transition-all duration-300`}>
      <div className="container max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-gradient-to-r from-[#34e0a1] to-[#00aa6c] p-2.5 rounded-xl shadow-md transform rotate-12 hover:rotate-0 transition-transform duration-300">
              <MapPin size={24} className="text-white drop-shadow-sm" />
            </div>
            <span className="font-bold text-2xl tracking-tight">
              Trip<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#34e0a1] to-[#00aa6c]">Nest</span>
            </span>
          </Link>
        </div>
        <nav className="hidden md:flex justify-center items-center gap-8">
          <Link href="#" className="text-black hover:text-[#34e0a1] font-medium transition-colors duration-200 relative group">
            Discover
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#34e0a1] transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link href="/trip-planner" className="text-black hover:text-[#34e0a1] font-medium transition-colors duration-200 relative group">
            Trips
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#34e0a1] transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link href="#" className="text-black hover:text-[#34e0a1] font-medium transition-colors duration-200 relative group">
            Review
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#34e0a1] transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link href="#" className="text-black hover:text-[#34e0a1] font-medium transition-colors duration-200 relative group">
            Forums
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#34e0a1] transition-all duration-300 group-hover:w-full"></span>
          </Link>
        </nav>
        <div className="hidden md:flex items-center gap-4">
          <button className="text-gray-600 hover:text-gray-900">
            <Heart size={22} />
          </button>
          <button className="text-gray-600 hover:text-gray-900">
            <Bell size={22} />
          </button>
          <Button className="text-white rounded-full font-bold border border-gray-300 hover:bg-[#34e0a1] hover:text-white hover:border-transparent transition-all duration-300 py-6">Sign In</Button>
        </div>
        <button 
          className="md:hidden" 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden px-4 py-4 border-t">
          <nav className="flex flex-col gap-4">
            <Link href="#" className="text-black hover:text-[#34e0a1] font-medium transition-colors duration-200 relative group w-fit">
              Discover
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#34e0a1] transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link href="/trip-planner" className="text-black hover:text-[#34e0a1] font-medium transition-colors duration-200 relative group w-fit">
              Trips
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#34e0a1] transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link href="#" className="text-black hover:text-[#34e0a1] font-medium transition-colors duration-200 relative group w-fit">
              Review
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#34e0a1] transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link href="#" className="text-black hover:text-[#34e0a1] font-medium transition-colors duration-200 relative group w-fit">
              Forums
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#34e0a1] transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </nav>
          <div className="mt-4 flex flex-col gap-2">
            <Button variant="outline" className="w-full">Review</Button>
            <Button className="w-full text-black border border-gray-300 hover:bg-[#34e0a1] hover:text-white hover:border-transparent transition-all duration-300">Sign In</Button>
          </div>
        </div>
      )}
    </header>
  );
} 