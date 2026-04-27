import { useState, useEffect } from 'react';
import { auth, db, handleFirestoreError, OperationType, signInWithGoogle } from '../lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { collection, addDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';
import { motion, AnimatePresence } from 'motion/react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { Check, ChevronRight, ChevronLeft, CreditCard, Clock, User as UserIcon } from 'lucide-react';
import { cn, formatDate, formatCurrency } from '../lib/utils';

const services = [
  { id: 'personal_color', name: 'Personal Color Diagnosis', price: 120000, duration: '90 min' },
  { id: 'tarot', name: 'Tarot Deep Reading', price: 50000, duration: '40 min' },
  { id: 'integrated_package', name: 'Integrated Package', price: 150000, duration: '120 min' }
];

const timeSlots = [
  '10:00', '11:30', '13:00', '14:30', '16:00', '17:30', '19:00'
];

type Step = 'service' | 'datetime' | 'confirm' | 'success';

export default function Reservation() {
  const [user, setUser] = useState<User | null>(null);
  const [step, setStep] = useState<Step>('service');
  const [selectedService, setSelectedService] = useState(services[0]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reservedSlots, setReservedSlots] = useState<string[]>([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (step === 'datetime') {
      fetchReservedSlots();
    }
  }, [step, selectedDate]);

  const fetchReservedSlots = async () => {
    const q = query(
      collection(db, 'reservations'),
      where('date', '==', formatDate(selectedDate)),
      where('status', '!=', 'cancelled')
    );
    try {
      const snapshot = await getDocs(q);
      const slots = snapshot.docs.map(doc => doc.data().timeSlot);
      setReservedSlots(slots);
    } catch (e) {
      console.error(e);
    }
  };

  const handleReservation = async () => {
    if (!user) return;
    setIsSubmitting(true);
    try {
      const reservationData = {
        userId: user.uid,
        userName: user.displayName,
        userEmail: user.email,
        serviceType: selectedService.id,
        serviceName: selectedService.name,
        date: formatDate(selectedDate),
        timeSlot: selectedTime,
        status: 'pending',
        totalPrice: selectedService.price,
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(db, 'reservations'), reservationData);
      setStep('success');
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'reservations');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20 px-6">
        <div className="max-w-md w-full text-center space-y-8 bg-white p-12 rounded-[3rem] shadow-xl">
          <div className="w-20 h-20 prism-bg rounded-3xl mx-auto flex items-center justify-center text-white">
            <UserIcon size={40} />
          </div>
          <h2 className="text-3xl font-serif">Sign in to Reserve</h2>
          <p className="text-brand-ink/60">예약을 진행하시려면 로그인이 필요합니다.</p>
          <button 
            onClick={signInWithGoogle}
            className="w-full bg-brand-ink text-white py-4 rounded-full font-bold uppercase tracking-widest hover:opacity-90 transition-opacity"
          >
            Google 로그인
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 bg-brand-beige/50">
      <div className="max-w-4xl mx-auto">
        {/* Progress Bar */}
        <div className="flex items-center justify-between mb-12">
          {['service', 'datetime', 'confirm'].map((s, idx) => (
            <div key={s} className="flex-1 flex items-center">
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold transition-all",
                step === s ? "prism-bg text-white shadow-lg" : 
                ['datetime', 'confirm'].includes(step) && idx < 1 ? "bg-brand-ink text-white" :
                step === 'confirm' && idx < 2 ? "bg-brand-ink text-white" :
                "bg-white text-brand-ink/30"
              )}>
                {idx + 1}
              </div>
              {idx < 2 && <div className={cn("flex-1 h-[2px] mx-4 opacity-10 bg-brand-ink")} />}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 'service' && (
            <motion.div 
              key="service"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="text-center space-y-2">
                <h2 className="text-4xl font-serif">Choose a Service</h2>
                <p className="text-brand-ink/60">원하시는 상담 코스를 선택해주세요.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {services.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setSelectedService(s)}
                    className={cn(
                      "p-8 rounded-[2.5rem] text-left transition-all border-2",
                      selectedService.id === s.id 
                        ? "border-brand-ink bg-white shadow-xl" 
                        : "border-transparent bg-white/50 hover:bg-white"
                    )}
                  >
                    <h3 className="font-bold text-lg mb-2">{s.name}</h3>
                    <div className="flex items-center space-x-2 text-xs text-brand-ink/40 mb-6">
                      <Clock size={12} />
                      <span>{s.duration}</span>
                    </div>
                    <p className="text-xl font-serif">{formatCurrency(s.price)}</p>
                  </button>
                ))}
              </div>
              <div className="flex justify-end">
                <button 
                  onClick={() => setStep('datetime')}
                  className="bg-brand-ink text-white px-10 py-4 rounded-full font-bold flex items-center space-x-2 hover:opacity-90"
                >
                  <span>Next Step</span>
                  <ChevronRight size={18} />
                </button>
              </div>
            </motion.div>
          )}

          {step === 'datetime' && (
            <motion.div 
              key="datetime"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-12"
            >
              <div className="text-center space-y-2">
                <h2 className="text-4xl font-serif">Select Date & Time</h2>
                <p className="text-brand-ink/60">방문 일정을 선택해주세요.</p>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div>
                  <Calendar 
                    onChange={(d) => setSelectedDate(d as Date)} 
                    value={selectedDate}
                    minDate={new Date()}
                    locale="ko-KR"
                  />
                </div>
                <div className="space-y-6">
                  <h3 className="font-bold text-sm uppercase tracking-widest flex items-center space-x-2">
                    <Clock size={16} />
                    <span>Available Times</span>
                  </h3>
                  <div className="grid grid-cols-3 gap-3">
                    {timeSlots.map((time) => {
                      const isReserved = reservedSlots.includes(time);
                      return (
                        <button
                          key={time}
                          disabled={isReserved}
                          onClick={() => setSelectedTime(time)}
                          className={cn(
                            "py-4 rounded-2xl text-sm font-medium transition-all",
                            isReserved ? "bg-red-50 text-red-200 cursor-not-allowed line-through" :
                            selectedTime === time ? "bg-brand-ink text-white shadow-lg" : 
                            "bg-white hover:bg-brand-ink/5"
                          )}
                        >
                          {time}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <button 
                  onClick={() => setStep('service')}
                  className="px-10 py-4 font-bold flex items-center space-x-2 opacity-60 hover:opacity-100"
                >
                  <ChevronLeft size={18} />
                  <span>Back</span>
                </button>
                <button 
                  disabled={!selectedTime}
                  onClick={() => setStep('confirm')}
                  className="bg-brand-ink text-white px-10 py-4 rounded-full font-bold flex items-center space-x-2 hover:opacity-90 disabled:opacity-30"
                >
                  <span>Review Booking</span>
                  <ChevronRight size={18} />
                </button>
              </div>
            </motion.div>
          )}

          {step === 'confirm' && (
            <motion.div 
              key="confirm"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-12"
            >
              <div className="text-center space-y-2">
                <h2 className="text-4xl font-serif">Final Confirmation</h2>
                <p className="text-brand-ink/60">예약 내용을 확인해주세요.</p>
              </div>

              <div className="bg-white p-12 rounded-[3.5rem] shadow-xl grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-8">
                  <div>
                    <h4 className="text-[10px] uppercase font-bold tracking-[0.2em] opacity-40 mb-2">Service</h4>
                    <p className="text-2xl font-serif">{selectedService.name}</p>
                    <p className="text-xs text-brand-ink/40">{selectedService.duration}</p>
                  </div>
                  <div>
                    <h4 className="text-[10px] uppercase font-bold tracking-[0.2em] opacity-40 mb-2">Date & Time</h4>
                    <p className="text-lg">{formatDate(selectedDate)} at {selectedTime}</p>
                  </div>
                  <div className="pt-4 border-t border-brand-ink/5">
                    <h4 className="text-[10px] uppercase font-bold tracking-[0.2em] opacity-40 mb-2">Customer</h4>
                    <p className="text-sm font-medium">{user.displayName} ({user.email})</p>
                  </div>
                </div>

                <div className="bg-brand-beige/30 p-8 rounded-[2rem] flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-brand-ink/60">Base Price</span>
                      <span className="font-medium">{formatCurrency(selectedService.price)}</span>
                    </div>
                    <div className="flex justify-between items-center text-prism-purple">
                      <span className="text-sm">Discount</span>
                      <span className="font-medium">₩0</span>
                    </div>
                  </div>
                  <div className="pt-8 border-t border-brand-ink/10 flex justify-between items-end">
                    <span className="text-xs uppercase font-bold tracking-widest opacity-40">Total</span>
                    <span className="text-4xl font-serif">{formatCurrency(selectedService.price)}</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <button 
                  onClick={() => setStep('datetime')}
                  className="px-10 py-4 font-bold flex items-center space-x-2 opacity-60 hover:opacity-100"
                >
                  <ChevronLeft size={18} />
                  <span>Modify</span>
                </button>
                <button 
                  disabled={isSubmitting}
                  onClick={handleReservation}
                  className="bg-brand-ink text-white px-16 py-5 rounded-full font-bold flex items-center space-x-3 hover:scale-105 transition-all shadow-xl"
                >
                  <CreditCard size={18} />
                  <span>{isSubmitting ? 'Processing...' : 'Complete Booking'}</span>
                </button>
              </div>
            </motion.div>
          )}

          {step === 'success' && (
            <motion.div 
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20 bg-white rounded-[4rem] shadow-2xl space-y-8"
            >
              <div className="w-24 h-24 prism-bg rounded-full mx-auto flex items-center justify-center text-white shadow-xl">
                <Check size={48} strokeWidth={3} />
              </div>
              <div className="space-y-4">
                <h2 className="text-5xl font-serif">Thank You!</h2>
                <p className="text-brand-ink/60 text-lg">
                  예약이 성공적으로 완료되었습니다.<br />
                  진단 당일 10분 전까지 방문 부탁드립니다.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
                <a href="/mypage" className="px-10 py-4 rounded-full bg-brand-ink text-white font-bold uppercase tracking-widest">
                  View My Bookings
                </a>
                <a href="/" className="px-10 py-4 rounded-full border border-brand-ink/20 font-bold uppercase tracking-widest hover:bg-brand-beige transition-colors">
                  Back to Home
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
