import { useState, useEffect } from 'react';
import { auth, signInWithGoogle } from '../lib/firebase';
import { onAuthStateChanged, User, signOut } from 'firebase/auth';
import { Menu, X, User as UserIcon, LogOut, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

export default function Header() {
  const [user, setUser] = useState<User | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
    
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      unsubscribe();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
      isScrolled ? "bg-white/80 backdrop-blur-md shadow-sm py-3" : "bg-transparent py-6"
    )}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <a href="/" className="text-2xl font-serif tracking-widest font-bold">
          MUE <span className="text-gradient">COLOR</span>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-8 text-sm font-medium uppercase tracking-wider">
          <a href="/#about" className="hover:opacity-60 transition-opacity">About</a>
          <a href="/#services" className="hover:opacity-60 transition-opacity">Services</a>
          <a href="/#reviews" className="hover:opacity-60 transition-opacity">Reviews</a>
          
          {user ? (
            <div className="flex items-center space-x-6">
              <a href="/mypage" className="flex items-center space-x-2 hover:opacity-60 transition-opacity">
                <UserIcon size={18} />
                <span>My Page</span>
              </a>
              <button 
                onClick={() => signOut(auth)}
                className="flex items-center space-x-2 hover:opacity-60 transition-opacity cursor-pointer"
              >
                <LogOut size={18} />
                <span>Log Out</span>
              </button>
              <a 
                href="/reservation" 
                className="bg-brand-ink text-white px-6 py-2 rounded-full hover:opacity-90 transition-opacity"
              >
                Book Now
              </a>
            </div>
          ) : (
            <button 
              onClick={signInWithGoogle}
              className="bg-brand-ink text-white px-6 py-2 rounded-full hover:opacity-90 transition-opacity cursor-pointer"
            >
              Sign In
            </button>
          )}
        </nav>

        {/* Mobile Menu Toggle */}
        <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.nav 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 bg-white shadow-xl p-6 flex flex-col space-y-6 md:hidden"
          >
            <a href="/#about" onClick={() => setIsMenuOpen(false)}>About</a>
            <a href="/#services" onClick={() => setIsMenuOpen(false)}>Services</a>
            <a href="/#reviews" onClick={() => setIsMenuOpen(false)}>Reviews</a>
            {user ? (
              <>
                <a href="/mypage" onClick={() => setIsMenuOpen(false)}>My Page</a>
                <a href="/reservation" onClick={() => setIsMenuOpen(false)}>Book Now</a>
                <button onClick={() => { signOut(auth); setIsMenuOpen(false); }}>Log Out</button>
              </>
            ) : (
              <button onClick={() => { signInWithGoogle(); setIsMenuOpen(false); }}>Sign In</button>
            )}
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
