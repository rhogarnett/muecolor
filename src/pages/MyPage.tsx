import { useEffect, useState } from 'react';
import { auth, db, handleFirestoreError, OperationType } from '../lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { collection, query, where, getDocs, doc, updateDoc, orderBy } from 'firebase/firestore';
import { motion } from 'motion/react';
import { Calendar, Tag, Clock, ChevronRight, XCircle } from 'lucide-react';
import { cn, formatCurrency } from '../lib/utils';

interface Reservation {
  id: string;
  serviceName: string;
  date: string;
  timeSlot: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  totalPrice: number;
}

export default function MyPage() {
  const [user, setUser] = useState<User | null>(null);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, u => {
      setUser(u);
      if (u) {
        fetchReservations(u.uid);
      } else {
        setIsLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchReservations = async (uid: string) => {
    setIsLoading(true);
    const q = query(
      collection(db, 'reservations'),
      where('userId', '==', uid),
      orderBy('createdAt', 'desc')
    );
    try {
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() })) as Reservation[];
      setReservations(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const cancelReservation = async (id: string) => {
    if (!window.confirm('예약을 취소하시겠습니까?')) return;
    try {
      await updateDoc(doc(db, 'reservations', id), {
        status: 'cancelled',
        updatedAt: new Date()
      });
      setReservations(prev => prev.map(r => r.id === id ? { ...r, status: 'cancelled' } : r));
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, `reservations/${id}`);
    }
  };

  if (isLoading) return <div className="min-h-screen pt-40 px-6 text-center italic opacity-40">Loading your profile...</div>;

  if (!user) return <div className="min-h-screen pt-40 px-6 text-center">Please sign in to view your page.</div>;

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 bg-brand-beige/30">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Profile Header */}
        <div className="flex items-center space-x-8">
          <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg">
            <img src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName}`} alt="Avatar" className="w-full h-full object-cover" />
          </div>
          <div>
            <h1 className="text-3xl font-serif">{user.displayName}</h1>
            <p className="text-brand-ink/40 text-sm">{user.email}</p>
          </div>
        </div>

        {/* Reservations List */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold uppercase tracking-widest flex items-center space-x-2">
            <Calendar size={20} />
            <span>나의 예약 내역</span>
            <span className="ml-2 text-xs bg-brand-ink text-white px-2 py-0.5 rounded-full">{reservations.length}</span>
          </h2>

          <div className="space-y-4">
            {reservations.length === 0 ? (
              <div className="bg-white p-16 rounded-[3rem] text-center space-y-4">
                <p className="text-brand-ink/40">예약 내역이 없습니다.</p>
                <a href="/reservation" className="inline-block bg-brand-ink text-white px-8 py-3 rounded-full text-sm font-bold">
                  상담 예약하기
                </a>
              </div>
            ) : (
              reservations.map((r) => (
                <motion.div 
                  key={r.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white p-8 rounded-[2.5rem] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6"
                >
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <span className={cn(
                        "text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full",
                        r.status === 'pending' ? "bg-amber-100 text-amber-700" :
                        r.status === 'confirmed' ? "bg-green-100 text-green-700" :
                        r.status === 'cancelled' ? "bg-red-50 text-red-400" :
                        "bg-brand-beige text-brand-ink/60"
                      )}>
                        {r.status}
                      </span>
                      <span className="text-xs text-brand-ink/40 font-mono">ID: {r.id.slice(-6)}</span>
                    </div>
                    <h3 className="text-lg font-bold">{r.serviceName}</h3>
                    <div className="flex items-center space-x-6 text-sm text-brand-ink/60">
                      <div className="flex items-center space-x-2">
                        <Calendar size={14} />
                        <span>{r.date}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock size={14} />
                        <span>{r.timeSlot}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-8 pt-4 md:pt-0 border-t md:border-none border-brand-ink/5">
                    <div className="text-right">
                      <p className="text-xs text-brand-ink/40 uppercase tracking-widest">Amount</p>
                      <p className="text-xl font-serif">{formatCurrency(r.totalPrice)}</p>
                    </div>
                    {r.status === 'pending' && (
                      <button 
                        onClick={() => cancelReservation(r.id)}
                        className="p-3 text-red-400 hover:bg-red-50 rounded-full transition-colors"
                        title="Cancel Reservation"
                      >
                        <XCircle size={24} />
                      </button>
                    )}
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
