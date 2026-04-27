import { Instagram, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-brand-ink/10 py-16 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
        <div className="space-y-6">
          <h2 className="text-2xl font-serif font-bold tracking-widest">
            MUE <span className="text-gradient">COLOR</span>
          </h2>
          <p className="text-sm text-brand-ink/60 leading-relaxed max-w-xs">
            당신만의 고유한 아름다움을 발견하고 내일의 운명을 조율하는 공간. 
            MUE COLOR에서 진정한 당신의 스펙트럼을 찾아보세요.
          </p>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-prism-purple transition-colors"><Instagram size={20} /></a>
            <a href="#" className="hover:text-prism-purple transition-colors"><Mail size={20} /></a>
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-sm font-bold uppercase tracking-wider">Quick Links</h3>
          <ul className="space-y-4 text-sm text-brand-ink/60">
            <li><a href="/#about" className="hover:text-brand-ink transition-colors">About MUE</a></li>
            <li><a href="/#services" className="hover:text-brand-ink transition-colors">Services</a></li>
            <li><a href="/reservation" className="hover:text-brand-ink transition-colors">Reservation</a></li>
            <li><a href="/#reviews" className="hover:text-brand-ink transition-colors">Customer Reviews</a></li>
          </ul>
        </div>

        <div className="space-y-6">
          <h3 className="text-sm font-bold uppercase tracking-wider">Location & Contact</h3>
          <div className="space-y-4 text-sm text-brand-ink/60">
            <div className="flex items-start space-x-3">
              <MapPin size={18} className="mt-0.5 shrink-0" />
              <p>서울특별시 강남구 테헤란로 123<br />MUE 빌딩 5층</p>
            </div>
            <p className="pl-7">02-1234-5678</p>
            <p className="pl-7 text-xs opacity-60">사업자 등록번호: 123-45-67890 | 대표: 홍길동</p>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-brand-ink/5 text-center text-xs text-brand-ink/40 uppercase tracking-widest">
        &copy; 2026 MUE COLOR. ALL RIGHTS RESERVED.
      </div>
    </footer>
  );
}
