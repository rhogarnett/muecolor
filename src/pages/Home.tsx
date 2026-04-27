import { motion } from 'motion/react';
import { ArrowRight, Star, ShieldCheck, Sparkles, Calendar as CalendarIcon } from 'lucide-react';

const services = [
  {
    id: 'personal_color',
    title: 'Personal Color',
    subtitle: 'Find your True Spectrum',
    description: '어울리는 옷을 찾는 것이 아니라, 당신이 가장 빛나는 순간을 설계합니다.',
    price: '₩120,000',
    image: '/src/assets/images/personal_color_service_1777273772741.png'
  },
  {
    id: 'tarot',
    title: 'Tarot Reading',
    subtitle: 'Decode your Destiny',
    description: '답답한 고민의 끝에서 발견하는 명확한 방향성. 카드가 전하는 감각적인 조언을 경험하세요.',
    price: '₩50,000',
    image: '/src/assets/images/tarot_service_1777273789877.png'
  },
  {
    id: 'package',
    title: 'Integrated Package',
    subtitle: 'Harmony of Color & Fate',
    description: '퍼스널 컬러와 타로를 통한 통합 컨설팅. 내면과 외면의 완벽한 조화를 선사합니다.',
    price: '₩150,000',
    image: '/src/assets/images/integrated_package_service_1777273809130.png'
  }
];

const reviews = [
  {
    id: 1,
    name: '김**님',
    content: '퍼스널 컬러 진단받고 옷 고르기가 너무 편해졌어요. 나에게 딱 맞는 무드를 찾아주셔서 감사합니다!',
    rating: 5,
    tag: 'Personal Color'
  },
  {
    id: 2,
    name: '이**님',
    content: '고민이 많을 때 방문했는데, 타로 결과가 너무 정확해서 놀랐어요. 위로도 많이 받고 갑니다.',
    rating: 5,
    tag: 'Tarot'
  },
  {
    id: 3,
    name: '박**님',
    content: '패키지로 진행했는데 시간 가는 줄 모르고 즐겁게 받았네요. 공간도 너무 예쁘고 힐링되는 시간이었어요.',
    rating: 5,
    tag: 'Integrated'
  }
];

export default function Home() {
  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="/src/assets/images/mue_color_hero_1777273757755.png" 
            alt="Hero Background" 
            className="w-full h-full object-cover opacity-60"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-brand-beige/50 via-transparent to-brand-beige" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <h4 className="text-sm font-bold uppercase tracking-[0.3em] mb-4 opacity-70">Elevate Your Presence</h4>
            <h1 className="text-6xl md:text-8xl font-serif font-bold leading-[1.1]">
              Find your <br />
              <span className="text-gradient">True Spectrum</span>
            </h1>
          </motion.div>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="text-lg md:text-xl text-brand-ink/70 max-w-2xl mx-auto font-light leading-relaxed"
          >
            당신의 피부에 어울리는 색부터 마음의 결을 읽어내는 타로까지.<br />
            'MUE COLOR'에서 당신만의 고유한 아름다움을 완성하세요.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <a 
              href="/reservation" 
              className="bg-brand-ink text-white px-10 py-5 rounded-full text-sm font-bold uppercase tracking-widest hover:scale-105 transition-transform flex items-center space-x-3"
            >
              <span>나만의 컬러&운명 예약하기</span>
              <ArrowRight size={18} />
            </a>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-32 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-8">
            <h2 className="text-4xl md:text-5xl font-serif leading-tight">
              나만의 고유한 빛과 <br />
              운명을 조율하다
            </h2>
            <p className="text-brand-ink/60 leading-relaxed">
              MUE COLOR는 단순히 예뻐지는 방법을 알려주는 곳이 아닙니다.<br />
              당신이 가진 고유한 이미지를 분석하고, 현재의 심리적 흐름을 파악하여 
              가장 나다운 모습으로 당당하게 세상을 마주할 수 있도록 돕습니다.
            </p>
            <div className="grid grid-cols-2 gap-8 pt-8">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl prism-bg flex items-center justify-center text-white">
                  <Sparkles size={24} />
                </div>
                <h4 className="font-bold">전문적인 분석</h4>
                <p className="text-xs text-brand-ink/60">숙련된 컨설턴트의 정밀 진단 시스템</p>
              </div>
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-brand-ink flex items-center justify-center text-white">
                  <ShieldCheck size={24} />
                </div>
                <h4 className="font-bold">심층 상담</h4>
                <p className="text-xs text-brand-ink/60">타로를 통한 마음의 결 탐색</p>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-[4/5] rounded-[4rem] overflow-hidden shadow-2xl">
              <img 
                src="https://picsum.photos/seed/mue-about/800/1000" 
                alt="Studio" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -bottom-10 -right-10 w-64 h-64 prism-bg rounded-[3rem] -z-10 blur-3xl opacity-30 animate-pulse" />
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-32 bg-white px-6">
        <div className="max-w-7xl mx-auto text-center space-y-4 mb-20">
          <h4 className="text-sm font-bold uppercase tracking-widest text-prism-purple">Our Services</h4>
          <h2 className="text-4xl md:text-5xl font-serif">Selected Consultations</h2>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
          {services.map((service, idx) => (
            <motion.div 
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.2 }}
              className="group cursor-pointer"
            >
              <div className="aspect-[4/3] rounded-3xl overflow-hidden mb-6 relative">
                <img 
                  src={service.image} 
                  alt={service.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-4 py-1 rounded-full text-xs font-bold">
                  {service.price}
                </div>
              </div>
              <h3 className="text-lg font-bold mb-1">{service.title}</h3>
              <p className="text-xs text-brand-ink/40 uppercase tracking-widest mb-3">{service.subtitle}</p>
              <p className="text-sm text-brand-ink/60 leading-relaxed">{service.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Review Section */}
      <section id="reviews" className="py-32 px-6">
        <div className="max-w-7xl mx-auto text-center space-y-4 mb-20">
          <h2 className="text-4xl font-serif">What Our Clients Say</h2>
          <p className="text-brand-ink/60">진정성 있는 후기가 말해주는 MUE COLOR의 가치</p>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((review) => (
            <div key={review.id} className="bg-white p-10 rounded-[3rem] shadow-sm border border-brand-ink/5 space-y-6">
              <div className="flex space-x-1 text-prism-purple">
                {[...Array(review.rating)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
              </div>
              <p className="text-brand-ink/80 italic leading-relaxed font-light">"{review.content}"</p>
              <div className="flex items-center justify-between pt-4">
                <span className="text-sm font-bold">{review.name}</span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full bg-brand-beige">
                  {review.tag}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 px-6 border-t border-brand-ink/5">
        <div className="max-w-4xl mx-auto prism-bg p-16 md:p-24 rounded-[4rem] text-center text-white space-y-8">
          <h2 className="text-4xl md:text-5xl font-serif font-bold">Experience Your Inner Light</h2>
          <p className="text-white/80 text-lg">지금 바로 예약하고 당신만의 고유한 컬러와 운명을 만나보세요.</p>
          <a 
            href="/reservation" 
            className="inline-flex items-center space-x-3 bg-white text-brand-ink px-12 py-5 rounded-full font-bold uppercase tracking-widest hover:bg-opacity-90 transition-all"
          >
            <CalendarIcon size={18} />
            <span>상담 예약하기</span>
          </a>
        </div>
      </section>
    </div>
  );
}
