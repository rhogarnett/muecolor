import { useEffect, useState } from 'react';
import { auth, db } from '../lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { collection, query, getDocs, doc, updateDoc, orderBy, where } from 'firebase/firestore';
import { motion } from 'motion/react';
import { Calendar, Users, Filter, CheckCircle, XCircle, Clock } from 'lucide-react';
import { cn, formatCurrency } from '../lib/utils';

interface Reservation {
  id: string;
  userName: string;
  userEmail: string;
  serviceName: string;
  date: string;
  timeSlot: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  totalPrice: number;
  createdAt: any;
}

export default function Admin() {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        // Simple admin check: if email is special or in a roles collection
        // For development, we allow rhogarnett@gmail.com
        if (u.email === 'rhogarnett@gmail.com') {
          setIsAdmin(true);
          fetchReservations();
        } else {
          // Check firestore for role
          const userSnap = await getDocs(query(collection(db, 'users'), where('userId', '==', u.uid)));
          if (!userSnap.empty && userSnap.docs[0].data().role === 'admin') {
            setIsAdmin(true);
            fetchReservations();
          } else {
            setIsAdmin(false);
            setIsLoading(false);
          }
        }
      } else {
        setIsAdmin(false);
        setIsLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchReservations = async () => {
    setIsLoading(true);
    const q = query(collection(db, 'reservations'), orderBy('createdAt', 'desc'));
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

  const updateStatus = async (id: string, status: string) => {
    try {
      await updateDoc(doc(db, 'reservations', id), { 
        status,
        updatedAt: new Date()
      });
      setReservations(prev => prev.map(r => r.id === id ? { ...r, status: status as any } : r));
    } catch (e) {
      console.error(e);
    }
  };

  const filteredReservations = reservations.filter(r => 
    filterStatus === 'all' ? true : r.status === filterStatus
  );

  if (isLoading) return <div className="min-h-screen pt-40 px-6 text-center italic opacity-40 text-sm tracking-widest uppercase">Admin: Fetching data...</div>;

  if (!isAdmin) {
    return (
      <div className="min-h-screen pt-40 px-6 text-center space-y-4">
        <h2 className="text-2xl font-serif">Access Denied</h2>
        <p className="text-brand-ink/40">You do not have permission to view the admin dashboard.</p>
        <a href="/" className="inline-block underline underline-offset-4 decoration-prism-purple">Go back to Home</a>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 bg-brand-ink text-white/90">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <h4 className="text-[10px] uppercase font-bold tracking-[0.4em] text-prism-purple">Admin Dashboard</h4>
            <h1 className="text-5xl font-serif text-white">MUE Management</h1>
          </div>
          
          <div className="flex items-center space-x-4 bg-white/5 p-2 rounded-2xl border border-white/10">
            {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map((s) => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={cn(
                  "px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all",
                  filterStatus === s ? "bg-white text-brand-ink shadow-lg" : "hover:bg-white/10 opacity-60 hover:opacity-100"
                )}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/5 p-8 rounded-[2rem] border border-white/10 flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-widest opacity-40 mb-1">Total Bookings</p>
              <p className="text-3xl font-serif">{reservations.length}</p>
            </div>
            <Calendar className="text-prism-blue opacity-40" />
          </div>
          <div className="bg-white/5 p-8 rounded-[2rem] border border-white/10 flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-widest opacity-40 mb-1">Pending Requests</p>
              <p className="text-3xl font-serif text-amber-400">
                {reservations.filter(r => r.status === 'pending').length}
              </p>
            </div>
            <Clock className="text-amber-400 opacity-40" />
          </div>
          <div className="bg-white/5 p-8 rounded-[2rem] border border-white/10 flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-widest opacity-40 mb-1">Total Revenue</p>
              <p className="text-3xl font-serif">
                {formatCurrency(reservations.filter(r => r.status !== 'cancelled').reduce((acc, r) => acc + r.totalPrice, 0))}
              </p>
            </div>
            <CheckCircle className="text-prism-pink opacity-40" />
          </div>
        </div>

        <div className="bg-white/5 rounded-[3rem] border border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/10 text-[10px] uppercase tracking-[0.2em] opacity-40">
                  <th className="px-8 py-6">Customer</th>
                  <th className="px-8 py-6">Service</th>
                  <th className="px-8 py-6">Schedule</th>
                  <th className="px-8 py-6">Status</th>
                  <th className="px-8 py-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredReservations.map((r) => (
                  <tr key={r.id} className="hover:bg-white/2 transition-colors">
                    <td className="px-8 py-8">
                      <p className="font-bold">{r.userName}</p>
                      <p className="text-xs opacity-40 font-mono italic">{r.userEmail}</p>
                    </td>
                    <td className="px-8 py-8">
                      <p className="text-sm">{r.serviceName}</p>
                      <p className="text-[10px] opacity-40 font-serif italic">{formatCurrency(r.totalPrice)}</p>
                    </td>
                    <td className="px-8 py-8">
                      <p className="text-sm">{r.date}</p>
                      <p className="text-xs opacity-40 flex items-center space-x-1">
                        <Clock size={10} />
                        <span>{r.timeSlot}</span>
                      </p>
                    </td>
                    <td className="px-8 py-8">
                      <span className={cn(
                        "text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full",
                        r.status === 'pending' ? "bg-amber-400/20 text-amber-400" :
                        r.status === 'confirmed' ? "bg-green-400/20 text-green-400" :
                        r.status === 'completed' ? "bg-prism-blue/20 text-prism-blue" :
                        "bg-red-400/20 text-red-400"
                      )}>
                        {r.status}
                      </span>
                    </td>
                    <td className="px-8 py-8">
                      <div className="flex items-center justify-end space-x-2">
                        {r.status === 'pending' && (
                          <button 
                            onClick={() => updateStatus(r.id, 'confirmed')}
                            className="p-3 bg-green-400/10 hover:bg-green-400/20 text-green-400 rounded-xl transition-all"
                            title="Confirm"
                          >
                            <CheckCircle size={18} />
                          </button>
                        )}
                        {r.status === 'confirmed' && (
                          <button 
                            onClick={() => updateStatus(r.id, 'completed')}
                            className="p-3 bg-prism-blue/10 hover:bg-prism-blue/20 text-prism-blue rounded-xl transition-all"
                            title="Mark Completed"
                          >
                            <CheckCircle size={18} />
                          </button>
                        )}
                        {['pending', 'confirmed'].includes(r.status) && (
                          <button 
                            onClick={() => updateStatus(r.id, 'cancelled')}
                            className="p-3 bg-red-400/10 hover:bg-red-400/20 text-red-400 rounded-xl transition-all"
                            title="Cancel"
                          >
                            <XCircle size={18} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredReservations.length === 0 && (
            <div className="py-20 text-center opacity-40 italic">No bookings found for this filter.</div>
          )}
        </div>
      </div>
    </div>
  );
}
