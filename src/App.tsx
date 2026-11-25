import React, { useState, useEffect } from 'react';
import {
  Wine,
  Sparkles,
  Users,
  Calendar,
  Award,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  Send,
  Clock,
  ShieldCheck,
  HelpCircle,
  ArrowRight,
  Menu,
  X,
  PhoneCall,
  Flame,
  Star,
  CheckSquare,
  FileText,
  Printer
} from 'lucide-react';

// --- Contact Constants ---
const CONTACT_TELEGRAM = 'https://t.me/eugenica_club';
const CONTACT_MAX = 'https://max.ru/eugenica_club';

// --- Logo Asset Constant ---
const LOGO_GLASSES_SRC = '/src/assets/images/logo_two_wine_glasses_1795615021848.jpg';

// --- Booking Message Types & Builder ---
type EventDraft = {
  format: string;
  occasion: string;
  guests: string;
  date: string;
  location: string;
};

const DEFAULT_DRAFT: EventDraft = {
  format: 'Винное казино (Хит)',
  occasion: 'Корпоратив / Тимбилдинг',
  guests: '6–10 гостей (камерный формат)',
  date: '',
  location: '',
};

export function buildBookingMessage(draft: EventDraft): string {
  const cleanGuests = draft.guests.replace(/\s*\(.*?\)/g, '').trim();
  const cleanDate = draft.date ? draft.date : 'уточняется';
  const cleanLocation = draft.location.trim() ? draft.location.trim() : 'уточняется';

  return [
    'Здравствуйте! Хочу забронировать вечер в Evgenika Club:',
    `• Формат: ${draft.format}`,
    `• Повод: ${draft.occasion}`,
    `• Количество гостей: ${cleanGuests}`,
    `• Желаемая дата: ${cleanDate}`,
    `• Город / Локация: ${cleanLocation}`,
    '',
    'Жду расчёт сметы и подробности!',
  ].join('\n');
}

export default function App() {
  const [currentHash, setCurrentHash] = useState<string>(window.location.hash || '#/');
  const [proposalModalOpen, setProposalModalOpen] = useState(false);
  const [proposalDraft, setProposalDraft] = useState<EventDraft>(DEFAULT_DRAFT);

  // Listen to hash changes for hash routing
  useEffect(() => {
    const handleHashChange = () => {
      setCurrentHash(window.location.hash || '#/');
      window.scrollTo(0, 0);
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = (hash: string) => {
    window.location.hash = hash;
  };

  const openProposal = (draft: EventDraft) => {
    setProposalDraft(draft);
    setProposalModalOpen(true);
  };

  // Determine active page
  const isFormatsPage = currentHash.startsWith('#/formats');

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF6F0] text-[#1E1B18] antialiased selection:bg-[#6B1D2F] selection:text-[#FAF6F0]">
      <StickyHeader currentHash={currentHash} onNavigate={navigateTo} onOpenProposal={() => openProposal(proposalDraft)} />
      
      <main className="flex-grow">
        {isFormatsPage ? <FormatsPage onNavigate={navigateTo} /> : <HomePage onNavigate={navigateTo} onOpenProposal={openProposal} />}
      </main>

      <Footer />

      {proposalModalOpen && (
        <ProposalModal draft={proposalDraft} onClose={() => setProposalModalOpen(false)} />
      )}
    </div>
  );
}

// --- Image with Robust Fallback (Zero Broken Images) ---
function SafeImage({ src, alt, className, title }: { src: string; alt: string; className?: string; title: string }) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div className={`w-full h-full bg-[#FAF6F0] border border-[#6B1D2F]/20 flex flex-col items-center justify-center p-6 text-center ${className || ''}`}>
        <Wine className="w-10 h-10 text-[#6B1D2F] mb-2 opacity-80" />
        <span className="font-serif text-sm font-semibold text-[#1E1B18]">{title}</span>
        <span className="text-xs text-[#1E1B18]/60 mt-1">Evgenika Club</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
    />
  );
}

// --- Sticky Header ---
function StickyHeader({
  currentHash,
  onNavigate,
  onOpenProposal
}: {
  currentHash: string;
  onNavigate: (hash: string) => void;
  onOpenProposal: () => void;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isFormats = currentHash.startsWith('#/formats');

  const scrollToCalculator = () => {
    setMobileMenuOpen(false);
    if (window.location.hash !== '#/') {
      window.location.hash = '#/';
      setTimeout(() => {
        document.getElementById('calculator-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      document.getElementById('calculator-section')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-45 bg-[#FAF6F0]/95 backdrop-blur-md border-b border-[#6B1D2F]/10 px-4 sm:px-8 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Logo & Subtitle with Properly Framed Two-Wine-Glass Emblem */}
        <button
          onClick={() => onNavigate('#/')}
          className="flex items-center gap-3 text-left group focus:outline-none"
        >
          <div className="w-11 h-11 rounded-full overflow-hidden border border-[#B8925A]/40 shrink-0 bg-white p-0.5 flex items-center justify-center shadow-sm">
            <SafeImage
              src={LOGO_GLASSES_SRC}
              alt="Evgenika Club Logo"
              className="w-full h-full object-cover rounded-full group-hover:scale-105 transition-transform"
              title="Evgenika Club"
            />
          </div>
          <div>
            <span className="font-serif text-lg sm:text-xl font-bold tracking-tight text-[#6B1D2F] group-hover:opacity-90 transition-opacity block leading-tight">
              Evgenika Club
            </span>
            <span className="block text-[10px] sm:text-[11px] tracking-wider uppercase text-[#B8925A] font-medium leading-none mt-0.5">
              Винные игры и дегустации
            </span>
          </div>
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#1E1B18]">
          <button
            onClick={() => onNavigate('#/')}
            className={`transition-colors py-1 relative ${
              !isFormats ? 'text-[#6B1D2F] font-semibold' : 'hover:text-[#6B1D2F]'
            }`}
          >
            Главная
            {!isFormats && <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#6B1D2F] rounded-full" />}
          </button>
          <button
            onClick={() => onNavigate('#/formats')}
            className={`transition-colors py-1 relative ${
              isFormats ? 'text-[#6B1D2F] font-semibold' : 'hover:text-[#6B1D2F]'
            }`}
          >
            Форматы и игры
            {isFormats && <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#6B1D2F] rounded-full" />}
          </button>
          <a
            href="#faq"
            onClick={(e) => {
              if (window.location.hash !== '#/formats') {
                e.preventDefault();
                onNavigate('#/formats');
                setTimeout(() => {
                  document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }
            }}
            className="hover:text-[#6B1D2F] transition-colors"
          >
            Вопросы и ответы
          </a>
        </nav>

        {/* CTA Buttons */}
        <div className="hidden sm:flex items-center gap-3">
          <button
            onClick={onOpenProposal}
            className="px-4 py-2.5 rounded-full border border-[#6B1D2F]/30 text-[#6B1D2F] text-xs sm:text-sm font-semibold hover:bg-[#6B1D2F]/5 transition-all flex items-center gap-1.5 whitespace-nowrap"
          >
            <FileText className="w-4 h-4" />
            <span>Коммерческое КП</span>
          </button>
          <button
            onClick={scrollToCalculator}
            className="px-5 py-2.5 rounded-full bg-[#6B1D2F] text-[#FAF6F0] text-xs sm:text-sm font-semibold hover:bg-[#4A1220] transition-all shadow-sm hover:shadow active:scale-95 whitespace-nowrap"
          >
            Рассчитать вечер
          </button>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-[#6B1D2F] focus:outline-none"
          aria-label="Меню"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-[#FAF6F0] border-b border-[#6B1D2F]/10 px-6 py-6 shadow-lg flex flex-col gap-4 animate-fadeIn">
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onNavigate('#/');
            }}
            className={`text-left text-base font-medium py-2 ${!isFormats ? 'text-[#6B1D2F] font-bold' : 'text-[#1E1B18]'}`}
          >
            Главная
          </button>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onNavigate('#/formats');
            }}
            className={`text-left text-base font-medium py-2 ${isFormats ? 'text-[#6B1D2F] font-bold' : 'text-[#1E1B18]'}`}
          >
            Форматы и игры
          </button>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onNavigate('#/formats');
              setTimeout(() => {
                document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            }}
            className="text-left text-base font-medium py-2 text-[#1E1B18]"
          >
            Вопросы и ответы
          </button>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenProposal();
            }}
            className="w-full py-3 rounded-full border border-[#6B1D2F]/30 text-[#6B1D2F] text-sm font-semibold text-center flex items-center justify-center gap-2"
          >
            <FileText className="w-4 h-4" />
            <span>Коммерческое предложение (КП)</span>
          </button>
          <button
            onClick={scrollToCalculator}
            className="w-full py-3 rounded-full bg-[#6B1D2F] text-[#FAF6F0] text-sm font-semibold text-center shadow-sm"
          >
            Рассчитать вечер
          </button>
        </div>
      )}
    </header>
  );
}

// --- Page 1: Home ---
function HomePage({
  onNavigate,
  onOpenProposal
}: {
  onNavigate: (hash: string) => void;
  onOpenProposal: (draft: EventDraft) => void;
}) {
  return (
    <div className="flex flex-col gap-20 pb-24">
      {/* 1. Hero Section with Real Candid Photograph */}
      <section className="relative px-4 sm:px-8 pt-12 sm:pt-20 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#B8925A]/10 text-[#B8925A] text-xs font-semibold tracking-wide w-fit">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Премиальный выездной винный клуб</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#1E1B18] leading-[1.15]">
            Винное казино, дегустации и винные игры благородного формата
          </h1>
          <p className="text-base sm:text-lg text-[#1E1B18]/85 max-w-2xl leading-relaxed font-normal">
            Не нужно разбираться в вине — всё проходит легко, азартно и со вкусом. Профессиональный сомелье, роскошный реквизит и незабываемая атмосфера для вашего события.
          </p>
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <a
              href="#calculator-section"
              className="px-7 py-3.5 rounded-full bg-[#6B1D2F] text-[#FAF6F0] text-sm font-semibold hover:bg-[#4A1220] transition-all shadow-md hover:shadow-lg flex items-center gap-2 group"
            >
              <span>Подобрать формат</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
            <button
              onClick={() => onNavigate('#/formats')}
              className="px-7 py-3.5 rounded-full border border-[#6B1D2F]/30 text-[#6B1D2F] text-sm font-semibold hover:bg-[#6B1D2F]/5 transition-all"
            >
              Смотреть все игры
            </button>
          </div>
          <div className="grid grid-cols-3 gap-6 pt-6 border-t border-[#6B1D2F]/10 text-xs sm:text-sm text-[#1E1B18]/70">
            <div>
              <span className="block font-serif text-xl sm:text-2xl font-bold text-[#6B1D2F]">500+</span>
              <span>Проведенных игр</span>
            </div>
            <div>
              <span className="block font-serif text-xl sm:text-2xl font-bold text-[#6B1D2F]">100%</span>
              <span>Вовлечение гостей</span>
            </div>
            <div>
              <span className="block font-serif text-xl sm:text-2xl font-bold text-[#6B1D2F]">1–3 ч</span>
              <span>Длительность программы</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 relative">
          <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-[#6B1D2F]/15 bg-white aspect-[4/3] group">
            <SafeImage
              src="/src/assets/images/hero_candid_wine_gathering_1795613860686.jpg"
              alt="Теплая дружеская встреча с вином в Evgenika Club"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              title="Evgenika Club — Атмосфера вечера"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-6 pointer-events-none">
              <span className="text-[#FAF6F0] text-sm font-medium tracking-wide">
                Игры, объединяющие искушенных ценителей и новичков
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Occasions Strip ("Под любой ваш повод") */}
      <section className="bg-[#1E1B18] text-[#FAF6F0] py-16 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col gap-10">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs uppercase tracking-widest text-[#B8925A] font-semibold">Индивидуальный сценарий</span>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold mt-2">Под любой ваш повод</h2>
            <p className="text-sm sm:text-base text-[#FAF6F0]/80 mt-2">
              Адаптируем интерактив под масштаб и атмосферу вашего мероприятия.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <OccasionCard
              title="Корпоратив и тимбилдинг"
              desc="Сплачиваем команду через азарт, дегустацию и утонченное интеллектуальное соревнование."
              icon={<Users className="w-6 h-6 text-[#B8925A]" />}
            />
            <OccasionCard
              title="День рождения"
              desc="Яркий интерактивный центр вечера, который запомнится виновнику торжества и гостям."
              icon={<Sparkles className="w-6 h-6 text-[#B8925A]" />}
            />
            <OccasionCard
              title="Девичник / Мальчишник"
              desc="Стильный старт вечера в кругу близких друзей с премиальными напитками и дегустацией."
              icon={<Wine className="w-6 h-6 text-[#B8925A]" />}
            />
            <OccasionCard
              title="Камерный ужин / Свидание"
              desc="Изысканный интерактивный формат для узкого круга в приватной атмосфере."
              icon={<Star className="w-6 h-6 text-[#B8925A]" />}
            />
          </div>
        </div>
      </section>

      {/* 3. Formats Overview Grid (6 cards with distinct candid imagery) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 w-full flex flex-col gap-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-xl">
            <span className="text-xs uppercase tracking-widest text-[#B8925A] font-semibold">Наши программы</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1E1B18] mt-2">
              Форматы дегустаций и винных игр
            </h2>
            <p className="text-sm sm:text-base text-[#1E1B18]/70 mt-2">
              Каждый формат продуман до мелочей: от реквизита до работы сомелье-крупье.
            </p>
          </div>
          <button
            onClick={() => onNavigate('#/formats')}
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#6B1D2F] hover:text-[#4A1220] transition-colors group"
          >
            <span>Все подробности и правила игр</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FormatOverviewCard
            image="/src/assets/images/candid_wine_casino_1795613859914.jpg"
            title="Винное казино"
            tag="Хит мероприятий"
            desc="Азартная игра на зеленом сукне: ставки на сорта вин, регионы и крепость по слепым дегустационным бокалам."
            onSelect={() => onNavigate('#/formats')}
          />
          <FormatOverviewCard
            image="/src/assets/images/candid_wine_quiz_1795613859986.jpg"
            title="Винный квиз"
            tag="Интеллектуальное шоу"
            desc="Увлекательное командное состязание на эрудицию, логику и обоняние с мультимедийными вопросами."
            onSelect={() => onNavigate('#/formats')}
          />
          <FormatOverviewCard
            image="/src/assets/images/candid_blind_tasting_1795613860333.jpg"
            title="Слепая дегустация"
            tag="Классика сомелье"
            desc="Углубленное погружение в органолептику: угадываем год урожая, терруар и скрытые ноты в закрытых бокалах."
            onSelect={() => onNavigate('#/formats')}
          />
          <FormatOverviewCard
            image="/src/assets/images/candid_wine_mafia_1795613860238.jpg"
            title="Винная мафия"
            tag="Детективный интерактив"
            desc="Классическая психологическая игра в новом амплуа: среди мирных виноделов скрывается коварный сомелье-вредитель."
            onSelect={() => onNavigate('#/formats')}
          />
          <FormatOverviewCard
            image="/src/assets/images/hero_candid_wine_gathering_1795613860686.jpg"
            title="Винная церемония и сабраж"
            tag="Шоу-элемент"
            desc="Зрелищное открытие бутылки игристого саблей под рассказ об истории благородных шампанских домов."
            onSelect={() => onNavigate('#/formats')}
          />
          <FormatOverviewCard
            image="/src/assets/images/candid_sommelier_service_1795613861514.jpg"
            title="Выездной сомелье на фуршет"
            tag="Премиум сервис"
            desc="Элегантное сопровождение welcome-зоны: профессиональная подача, увлекательные истории о винах и общение с гостями."
            onSelect={() => onNavigate('#/formats')}
          />
        </div>
      </section>

      {/* 4. Interactive Event Brief Calculator */}
      <section id="calculator-section" className="max-w-5xl mx-auto px-4 sm:px-8 w-full">
        <CalculatorWidget onOpenProposal={onOpenProposal} />
      </section>
    </div>
  );
}

function OccasionCard({ title, desc, icon }: { title: string; desc: string; icon: React.ReactNode }) {
  return (
    <div className="p-6 rounded-2xl bg-white/5 border border-white/10 flex flex-col gap-4 hover:border-[#B8925A]/50 transition-colors">
      <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
        {icon}
      </div>
      <h3 className="font-serif text-xl font-bold text-white">{title}</h3>
      <p className="text-sm text-[#FAF6F0]/70 leading-relaxed">{desc}</p>
    </div>
  );
}

function FormatOverviewCard({ image, title, tag, desc, onSelect }: { image: string; title: string; tag: string; desc: string; onSelect: () => void }) {
  return (
    <div className="group rounded-2xl bg-white border border-[#6B1D2F]/15 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col">
      <div className="aspect-[4/3] overflow-hidden relative">
        <SafeImage
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          title={title}
        />
        <div className="absolute top-4 left-4 bg-[#6B1D2F] text-[#FAF6F0] text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
          {tag}
        </div>
      </div>
      <div className="p-6 flex flex-col flex-grow justify-between gap-4">
        <div>
          <h3 className="font-serif text-xl font-bold text-[#1E1B18] group-hover:text-[#6B1D2F] transition-colors">{title}</h3>
          <p className="text-sm text-[#1E1B18]/75 mt-2 leading-relaxed">{desc}</p>
        </div>
        <button
          onClick={onSelect}
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#6B1D2F] hover:text-[#4A1220] pt-2"
        >
          <span>Подробнее о правилах и тайминге</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

// --- Interactive Calculator Component (using EventDraft and buildBookingMessage) ---
const STORAGE_KEY = 'eugenica_calc_brief_v4';

function CalculatorWidget({ onOpenProposal }: { onOpenProposal: (draft: EventDraft) => void }) {
  const [draft, setDraft] = useState<EventDraft>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore storage error
    }
    return DEFAULT_DRAFT;
  });

  const [copied, setCopied] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
    } catch {
      // ignore storage error
    }
  }, [draft]);

  const summaryText = buildBookingMessage(draft);

  const handleCopy = () => {
    navigator.clipboard.writeText(summaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const telegramUrl = `${CONTACT_TELEGRAM}?text=${encodeURIComponent(summaryText)}`;
  const maxUrl = `${CONTACT_MAX}?text=${encodeURIComponent(summaryText)}`;

  return (
    <div className="bg-white rounded-3xl border border-[#6B1D2F]/20 p-6 sm:p-10 shadow-xl flex flex-col gap-8">
      <div className="text-center max-w-2xl mx-auto">
        <span className="text-xs uppercase tracking-widest text-[#B8925A] font-semibold">Калькулятор вечера</span>
        <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[#1E1B18] mt-2">
          Соберите параметры вашего события
        </h2>
        <p className="text-sm text-[#1E1B18]/70 mt-2">
          Выберите параметры ниже — мы сформируем готовый запрос для быстрой консультации и бронирования.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Format */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-[#6B1D2F]">
            1. Выберите формат
          </label>
          <select
            value={draft.format}
            onChange={(e) => setDraft({ ...draft, format: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-[#6B1D2F]/20 bg-[#FAF6F0] text-[#1E1B18] font-medium focus:outline-none focus:border-[#6B1D2F]"
          >
            <option value="Винное казино (Хит)">Винное казино (Хит)</option>
            <option value="Винный квиз">Винный квиз (Интеллектуальная игра)</option>
            <option value="Слепая дегустация">Слепая дегустация (Классика)</option>
            <option value="Винная мафия">Винная мафия (Детектив)</option>
            <option value="Винная церемония и сабраж">Винная церемония и сабраж</option>
            <option value="Выездной сомелье на фуршет">Выездной сомелье на фуршет</option>
          </select>
        </div>

        {/* Occasion */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-[#6B1D2F]">
            2. Повод мероприятия
          </label>
          <select
            value={draft.occasion}
            onChange={(e) => setDraft({ ...draft, occasion: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-[#6B1D2F]/20 bg-[#FAF6F0] text-[#1E1B18] font-medium focus:outline-none focus:border-[#6B1D2F]"
          >
            <option value="Корпоратив / Тимбилдинг">Корпоратив / Тимбилдинг</option>
            <option value="День рождения / Юбилей">День рождения / Юбилей</option>
            <option value="Девичник / Мальчишник">Девичник / Мальчишник</option>
            <option value="Камерный ужин / Свидание">Камерный ужин / Свидание</option>
            <option value="Другой частный праздник">Другой частный праздник</option>
          </select>
        </div>

        {/* Guests */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-[#6B1D2F]">
            3. Количество участников
          </label>
          <select
            value={draft.guests}
            onChange={(e) => setDraft({ ...draft, guests: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-[#6B1D2F]/20 bg-[#FAF6F0] text-[#1E1B18] font-medium focus:outline-none focus:border-[#6B1D2F]"
          >
            <option value="6–10 гостей (камерный формат)">6–10 гостей (камерный формат)</option>
            <option value="10–20 гостей (оптимально)">10–20 гостей (оптимально)</option>
            <option value="20–40 гостей (большой праздник)">20–40 гостей (большой праздник)</option>
            <option value="40+ гостей (масштабное событие)">40+ гостей (масштабное событие)</option>
          </select>
        </div>

        {/* Date & Location */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#6B1D2F]">
              4. Желаемая дата
            </label>
            <input
              type="date"
              value={draft.date}
              onChange={(e) => setDraft({ ...draft, date: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-[#6B1D2F]/20 bg-[#FAF6F0] text-[#1E1B18] font-medium focus:outline-none focus:border-[#6B1D2F]"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#6B1D2F]">
              5. Город / Площадка
            </label>
            <input
              type="text"
              value={draft.location}
              onChange={(e) => setDraft({ ...draft, location: e.target.value })}
              placeholder="Крым / Ваш город или площадка"
              className="w-full px-4 py-3 rounded-xl border border-[#6B1D2F]/20 bg-[#FAF6F0] text-[#1E1B18] font-medium focus:outline-none focus:border-[#6B1D2F]"
            />
          </div>
        </div>
      </div>

      {/* Generated Preview & Actions */}
      <div className="rounded-2xl bg-[#FAF6F0] border border-[#6B1D2F]/15 p-6 flex flex-col gap-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <span className="text-xs uppercase tracking-wider font-bold text-[#6B1D2F]">Готовый текст заявки</span>
          <button
            onClick={() => onOpenProposal(draft)}
            className="px-4 py-2 rounded-xl bg-[#6B1D2F]/10 text-[#6B1D2F] text-xs font-bold hover:bg-[#6B1D2F]/25 transition-all flex items-center gap-1.5"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Открыть коммерческое предложение (КП)</span>
          </button>
        </div>
        <div className="bg-white rounded-xl p-4 border border-[#6B1D2F]/10 font-mono text-xs sm:text-sm text-[#1E1B18] whitespace-pre-wrap leading-relaxed">
          {summaryText}
        </div>
        <div className="flex flex-wrap items-center gap-4 pt-2">
          <button
            onClick={handleCopy}
            className="px-6 py-3 rounded-xl bg-[#6B1D2F] text-[#FAF6F0] text-xs sm:text-sm font-semibold hover:bg-[#4A1220] transition-all flex items-center gap-2 shadow-sm"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Скопировано в буфер!' : 'Скопировать заявку'}</span>
          </button>
          <a
            href={telegramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 rounded-xl bg-[#0088cc] text-white text-xs sm:text-sm font-semibold hover:opacity-90 transition-opacity flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
            <span>Написать в Telegram</span>
          </a>
          <a
            href={maxUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 rounded-xl bg-[#2C3E50] text-white text-xs sm:text-sm font-semibold hover:opacity-90 transition-opacity flex items-center gap-2"
          >
            <PhoneCall className="w-4 h-4" />
            <span>Написать в MAX</span>
          </a>
        </div>
      </div>
    </div>
  );
}

// --- Printable Commercial Proposal Modal (КП) ---
function ProposalModal({ draft, onClose }: { draft: EventDraft; onClose: () => void }) {
  const handlePrint = () => {
    window.print();
  };

  const cleanGuests = draft.guests.replace(/\s*\(.*?\)/g, '').trim();

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-fadeIn">
      <div className="bg-[#FAF6F0] rounded-3xl border border-[#6B1D2F]/20 max-w-3xl w-full p-6 sm:p-10 shadow-2xl relative flex flex-col gap-8 my-8 print:m-0 print:shadow-none print:border-none print:w-full print:max-w-none">
        
        {/* Close Button (Hidden on Print) */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full bg-[#6B1D2F]/10 text-[#6B1D2F] hover:bg-[#6B1D2F]/25 transition-colors print:hidden"
          aria-label="Закрыть"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Proposal Header */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6 border-b border-[#6B1D2F]/20 pb-6 text-center sm:text-left">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-[#B8925A] shrink-0 bg-white p-0.5 shadow-sm flex items-center justify-center">
              <SafeImage
                src={LOGO_GLASSES_SRC}
                alt="Evgenika Club"
                className="w-full h-full object-cover rounded-full"
                title="Evgenika Club"
              />
            </div>
            <div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#6B1D2F]">Evgenika Club</h2>
              <span className="text-xs uppercase tracking-widest text-[#B8925A] font-semibold">Коммерческое предложение</span>
            </div>
          </div>
          <div className="text-xs text-[#1E1B18]/70 text-right sm:block">
            <p className="font-semibold text-[#1E1B18]">Выездные винные игры и дегустации</p>
            <p>Дата формирования: {new Date().toLocaleDateString('ru-RU')}</p>
          </div>
        </div>

        {/* Proposal Content */}
        <div className="flex flex-col gap-6">
          <div className="bg-white rounded-2xl p-6 border border-[#6B1D2F]/15 shadow-sm flex flex-col gap-4">
            <h3 className="font-serif text-lg font-bold text-[#1E1B18] border-b border-[#6B1D2F]/10 pb-2">
              Параметры вашего мероприятия
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-[#1E1B18]/60 block text-xs uppercase tracking-wider">Выбранный формат</span>
                <strong className="text-[#6B1D2F] text-base">{draft.format}</strong>
              </div>
              <div>
                <span className="text-[#1E1B18]/60 block text-xs uppercase tracking-wider">Повод события</span>
                <strong className="text-[#1E1B18]">{draft.occasion}</strong>
              </div>
              <div>
                <span className="text-[#1E1B18]/60 block text-xs uppercase tracking-wider">Количество гостей</span>
                <strong className="text-[#1E1B18]">{cleanGuests}</strong>
              </div>
              <div>
                <span className="text-[#1E1B18]/60 block text-xs uppercase tracking-wider">Дата и локация</span>
                <strong className="text-[#1E1B18]">
                  {draft.date ? draft.date : 'уточняется'} / {draft.location.trim() || 'Крым / Ваш город'}
                </strong>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-[#6B1D2F]/15 shadow-sm flex flex-col gap-4">
            <h3 className="font-serif text-lg font-bold text-[#1E1B18] border-b border-[#6B1D2F]/10 pb-2">
              Что входит в организацию под ключ
            </h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-[#1E1B18]/85">
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#B8925A]" /> Премиальная винная карта</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#B8925A]" /> Профессиональные бокалы</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#B8925A]" /> Игровое сукно, фишки и реквизит</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#B8925A]" /> Работа ведущего-сомелье</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#B8925A]" /> Индивидуальный тайминг и сценарий</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#B8925A]" /> Доставка и монтаж оборудования</li>
            </ul>
          </div>

          <div className="bg-[#6B1D2F]/5 rounded-2xl p-6 border border-[#6B1D2F]/20 flex flex-col gap-3 text-center sm:text-left">
            <h4 className="font-serif text-base font-bold text-[#6B1D2F]">Как забронировать дату и получить расчет</h4>
            <p className="text-sm text-[#1E1B18]/80 leading-relaxed">
              Свяжитесь с нами удобным способом для согласования меню, деталей площадки и окончательной стоимости:
            </p>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 pt-2">
              <a
                href={`${CONTACT_TELEGRAM}?text=${encodeURIComponent(buildBookingMessage(draft))}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-xl bg-[#0088cc] text-white text-xs font-semibold hover:opacity-90 transition-opacity flex items-center gap-2"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Telegram: @eugenica_club</span>
              </a>
              <a
                href={`${CONTACT_MAX}?text=${encodeURIComponent(buildBookingMessage(draft))}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-xl bg-[#2C3E50] text-white text-xs font-semibold hover:opacity-90 transition-opacity flex items-center gap-2"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>MAX</span>
              </a>
            </div>
          </div>
        </div>

        {/* Footer & Compliance Notice */}
        <div className="border-t border-[#6B1D2F]/20 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#1E1B18]/60 text-center sm:text-left">
          <p>18+. Мероприятия предназначены для совершеннолетних. Дистанционная продажа алкоголя не осуществляется.</p>
          <div className="flex items-center gap-3 print:hidden">
            <button
              onClick={handlePrint}
              className="px-5 py-2.5 rounded-xl bg-[#6B1D2F] text-[#FAF6F0] font-semibold hover:bg-[#4A1220] transition-colors flex items-center gap-2 shadow-sm"
            >
              <Printer className="w-4 h-4" />
              <span>Печать / Сохранить в PDF</span>
            </button>
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-[#6B1D2F]/30 text-[#6B1D2F] font-semibold hover:bg-[#6B1D2F]/5 transition-colors"
            >
              Закрыть
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

// --- Page 2: Formats & Rules ---
function FormatsPage({ onNavigate }: { onNavigate: (hash: string) => void }) {
  return (
    <div className="flex flex-col gap-24 pb-24 pt-8">
      {/* Header Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 w-full text-center">
        <span className="text-xs uppercase tracking-widest text-[#B8925A] font-semibold">Каталог программ</span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#1E1B18] mt-2">
          Форматы винных игр и дегустаций
        </h1>
        <p className="text-base sm:text-lg text-[#1E1B18]/75 max-w-2xl mx-auto mt-4 leading-relaxed">
          Подробный разбор каждой программы: правила, реквизит, тайминг и почему это захватывающе даже для тех, кто впервые знакомится с винной культурой.
        </p>
      </section>

      {/* Detailed Formats Breakdown (6 formats matching the grid with candid imagery) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 w-full flex flex-col gap-20">
        <FormatDetailRow
          image="/src/assets/images/candid_wine_casino_1795613859914.jpg"
          badge="Хит вечера"
          title="1. Винное казино"
          subtitle="Азарт классической рулетки в сочетании с благородными ароматами"
          rules={[
            'Бутылки вина упаковываются в непрозрачные чехлы (номера от 1 до 6).',
            'Участники получают игровые фишки и делают ставки на игровом сукне.',
            'Можно ставить на цвет (красное/белое), страну, крепость, год урожая или сорт винограда.',
            'Сомелье-крупье раскрывает карты и рассказывает увлекательные истории о каждом образце.'
          ]}
          duration="1.5 – 2 часа"
          participants="От 6 до 40 человек"
        />

        <FormatDetailRow
          image="/src/assets/images/candid_wine_quiz_1795613859986.jpg"
          badge="Интеллектуальное шоу"
          title="2. Винный квиз"
          subtitle="Интерактивное командное состязание на эрудицию, логику и обоняние"
          rules={[
            'Гости делятся на команды и соревнуются в нескольких раундах.',
            'Вопросы на экране и в бланках: от географии виноделия до кино и гастрономии.',
            'Слепые мини-дегустации на скорость и определение ароматов по нотницам.',
            'Победители получают памятные призы и титул знатоков вечера.'
          ]}
          duration="2 часа"
          participants="От 8 до 60 человек"
          reverse
        />

        <FormatDetailRow
          image="/src/assets/images/candid_blind_tasting_1795613860333.jpg"
          badge="Классика сомелье"
          title="3. Слепая дегустация"
          subtitle="Глубокое погружение в органолептику редких вин и терруаров"
          rules={[
            'Знакомство с техникой дегустации: цвет, аэрация, первый и второй нос, послевкусие.',
            'Сравнение вин одного сортового состава из разных уголков мира (Старый и Новый Свет).',
            'Профессиональная подача с правильными гастрономическими парами (сыры, орехи, фрукты).',
            'Живой диалог с сомелье без сложных и скучных терминов.'
          ]}
          duration="1.5 – 2 часа"
          participants="От 6 до 30 человек"
        />

        <FormatDetailRow
          image="/src/assets/images/candid_wine_mafia_1795613860238.jpg"
          badge="Детективный интерактив"
          title="4. Винная мафия"
          subtitle="Психологическая игра в новом благородном формате"
          rules={[
            'Знакомые правила мафии в винной стилистике с авторским реквизитом.',
            'Среди мирных виноделов скрывается коварный сомелье-фальсификатор.',
            'Каждый игрок защищает свой сорт и аргументирует выбор.',
            'Максимум веселья, живого общения и позитивных эмоций.'
          ]}
          duration="2 часа"
          participants="От 10 до 25 человек"
          reverse
        />

        <FormatDetailRow
          image="/src/assets/images/hero_candid_wine_gathering_1795613860686.jpg"
          badge="Шоу-элемент"
          title="5. Винная церемония и сабраж"
          subtitle="Эффектное открытие бутылки игристого саблей"
          rules={[
            'Исторический экскурс в традиции французских гусар и царских дворов.',
            'Инструктаж по безопасности и мастер-класс по сабражу для виновника торжества или гостей.',
            'Праздничный бокал игристого для каждого участника.',
            'Яркие фотографии и видео на память.'
          ]}
          duration="30 – 45 минут (как часть вечера)"
          participants="Без ограничений"
        />

        <FormatDetailRow
          image="/src/assets/images/candid_sommelier_service_1795613861514.jpg"
          badge="Премиум сервис"
          title="6. Выездной сомелье на фуршет"
          subtitle="Изысканное винное сопровождение вашего welcome-мероприятия"
          rules={[
            'Профессиональная подача вин на открытии мероприятия или фуршете.',
            'Сомелье знакомит гостей с историей напитков и помогает с выбором сочетаний.',
            'Элегантная подача, эстетика и поддержание атмосферы высокой культуры.',
            'Индивидуальный подбор ассортимента под ваш бюджет и концепцию.'
          ]}
          duration="от 2 часов"
          participants="Без ограничений"
          reverse
        />
      </section>

      {/* "Что входит в организацию вечера" Checklist */}
      <section className="bg-[#1E1B18] text-[#FAF6F0] py-20 px-4 sm:px-8 my-8">
        <div className="max-w-7xl mx-auto flex flex-col gap-12">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs uppercase tracking-widest text-[#B8925A] font-semibold">Все включено</span>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold mt-2">Что входит в организацию вечера</h2>
            <p className="text-sm sm:text-base text-[#FAF6F0]/80 mt-2">
              Мы берем на себя 100% забот: от премиального реквизита до работы профессионального сомелье.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <CheckItem
              title="Премиальная винная карта"
              desc="Отборные вина проверенных хозяйств Европы и Нового Света, гармонично подобранные под ваш формат."
            />
            <CheckItem
              title="Профессиональные бокалы"
              desc="Набор дегустационных бокалов правильной формы для каждого участника."
            />
            <CheckItem
              title="Игровой реквизит и сукно"
              desc="Брендированное игровое поле для винного казино, фишки, рулетка, слепые чехлы и бланки."
            />
            <CheckItem
              title="Работа ведущего-сомелье"
              desc="Опытный сомелье с харизмой и чувством юмора, который удержит внимание любой аудитории."
            />
            <CheckItem
              title="Индивидуальный сценарий"
              desc="Тайминг вечера, адаптированный под ваш праздник, банкет или корпоративную программу."
            />
            <CheckItem
              title="Доставка и монтаж"
              desc="Полная логистика: привезем оборудование, настроим свет и подготовим зону к началу игры."
            />
          </div>
        </div>
      </section>

      {/* SEO-friendly FAQ Accordion */}
      <section id="faq" className="max-w-4xl mx-auto px-4 sm:px-8 w-full flex flex-col gap-10 pt-8">
        <div className="text-center">
          <span className="text-xs uppercase tracking-widest text-[#B8925A] font-semibold">Ответы на вопросы</span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1E1B18] mt-2">Часто задаваемые вопросы</h2>
          <p className="text-sm text-[#1E1B18]/70 mt-2">Все, что нужно знать перед бронированием вашей винной игры.</p>
        </div>

        <div className="flex flex-col gap-4">
          <FaqItem
            question="Нужно ли гостям разбираться в вине?"
            answer="Совсем нет! Наши игры и дегустации созданы специально для того, чтобы увлекать как новичков, так и искушенных ценителей. Правила объясняются за 3 минуты, а ведущий сопровождает каждый шаг интересными фактами и подсказками."
          />
          <FaqItem
            question="Где могут проходить мероприятия?"
            answer="Мы работаем на любой площадке: в ресторанах, офисах, лофтах, загородных домах, на винодельнях Крыма или в любом другом городе. Наше выездное оборудование автономно и компактно размещается на любых столах."
          />
          <FaqItem
            question="Сколько по времени длится программа?"
            answer="Стандартная активная игровая программа (винное казино или квиз) длится от 1.5 до 2 часов. Время может быть гибко настроено под тайминг вашего банкета или фуршета."
          />
          <FaqItem
            question="Как забронировать дату?"
            answer="Вы можете воспользоваться калькулятором на главной странице, скопировать готовый бриф и написать нам в Telegram или MAX, либо просто забронировать удобным способом. Мы согласуем меню, дату и зафиксируем бронь."
          />
        </div>
      </section>
    </div>
  );
}

function FormatDetailRow({
  image,
  badge,
  title,
  subtitle,
  rules,
  duration,
  participants,
  reverse = false
}: {
  image: string;
  badge: string;
  title: string;
  subtitle: string;
  rules: string[];
  duration: string;
  participants: string;
  reverse?: boolean;
}) {
  return (
    <div className={`grid grid-cols-1 lg:grid-cols-12 gap-10 items-center ${reverse ? 'lg:flex-row-reverse' : ''}`}>
      <div className={`lg:col-span-6 ${reverse ? 'lg:order-2' : ''}`}>
        <div className="relative rounded-2xl overflow-hidden shadow-xl border border-[#6B1D2F]/15 aspect-[4/3] group">
          <SafeImage
            src={image}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            title={title}
          />
          <div className="absolute top-4 left-4 bg-[#6B1D2F] text-[#FAF6F0] text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
            {badge}
          </div>
        </div>
      </div>

      <div className={`lg:col-span-6 flex flex-col gap-6 ${reverse ? 'lg:order-1' : ''}`}>
        <div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1E1B18]">{title}</h2>
          <p className="text-sm sm:text-base text-[#B8925A] font-medium mt-1">{subtitle}</p>
        </div>

        <div className="flex flex-col gap-3">
          <span className="text-xs uppercase tracking-wider font-bold text-[#6B1D2F]">Как проходит игра:</span>
          <ul className="flex flex-col gap-2.5">
            {rules.map((rule, idx) => (
              <li key={idx} className="flex items-start gap-3 text-sm text-[#1E1B18]/85">
                <CheckCircle className="w-4 h-4 text-[#B8925A] shrink-0 mt-0.5" />
                <span>{rule}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-wrap gap-6 pt-2 border-t border-[#6B1D2F]/10 text-xs sm:text-sm text-[#1E1B18]/70">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#6B1D2F]" />
            <span>Длительность: <strong>{duration}</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-[#6B1D2F]" />
            <span>Участники: <strong>{participants}</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
}

function CheckItem({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="p-6 rounded-2xl bg-white/5 border border-white/10 flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <CheckSquare className="w-5 h-5 text-[#B8925A]" />
        <h3 className="font-serif text-lg font-bold text-white">{title}</h3>
      </div>
      <p className="text-sm text-[#FAF6F0]/70 leading-relaxed">{desc}</p>
    </div>
  );
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-[#6B1D2F]/20 rounded-2xl bg-white overflow-hidden shadow-sm transition-all">
      <button
        onClick={() => setOpen(!open)}
        className="w-full p-6 text-left flex items-center justify-between gap-4 focus:outline-none"
      >
        <span className="font-serif text-lg font-bold text-[#1E1B18]">{question}</span>
        {open ? <ChevronUp className="w-5 h-5 text-[#6B1D2F]" /> : <ChevronDown className="w-5 h-5 text-[#6B1D2F]" />}
      </button>
      {open && (
        <div className="px-6 pb-6 text-sm text-[#1E1B18]/80 leading-relaxed border-t border-[#6B1D2F]/10 pt-4">
          {answer}
        </div>
      )}
    </div>
  );
}

// --- Footer ---
function Footer() {
  return (
    <footer className="bg-[#1E1B18] text-[#FAF6F0] pt-16 pb-12 px-4 sm:px-8 border-t border-white/10 mt-auto print:hidden">
      <div className="max-w-7xl mx-auto flex flex-col gap-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          <div className="md:col-span-6 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full overflow-hidden border border-[#B8925A]/40 shrink-0 bg-white p-0.5 flex items-center justify-center">
                <SafeImage
                  src={LOGO_GLASSES_SRC}
                  alt="Evgenika Club"
                  className="w-full h-full object-cover rounded-full"
                  title="Evgenika Club"
                />
              </div>
              <span className="font-serif text-2xl font-bold tracking-tight text-white">
                Evgenika Club
              </span>
            </div>
            <p className="text-sm text-[#FAF6F0]/70 max-w-md leading-relaxed">
              Элегантные выездные винные игры, казино и дегустации премиального формата для корпоративных и частных событий.
            </p>
          </div>

          <div className="md:col-span-3 flex flex-col gap-3">
            <span className="text-xs uppercase tracking-widest text-[#B8925A] font-semibold">Навигация</span>
            <a href="#/" className="text-sm text-[#FAF6F0]/80 hover:text-white transition-colors">Главная страница</a>
            <a href="#/formats" className="text-sm text-[#FAF6F0]/80 hover:text-white transition-colors">Форматы и игры</a>
            <a href="#/formats" className="text-sm text-[#FAF6F0]/80 hover:text-white transition-colors">Вопросы и ответы</a>
          </div>

          <div className="md:col-span-3 flex flex-col gap-3">
            <span className="text-xs uppercase tracking-widest text-[#B8925A] font-semibold">Контакты и бронь</span>
            <span className="text-sm text-[#FAF6F0]/80">Крым, Москва, СПб и другие города</span>
            <a href={CONTACT_TELEGRAM} target="_blank" rel="noopener noreferrer" className="text-sm text-[#B8925A] hover:underline font-medium">
              Telegram / Мессенджеры
            </a>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#FAF6F0]/60">
          <p>© {new Date().getFullYear()} Evgenika Club. Все права защищены.</p>
          <p className="text-center sm:text-right max-w-xl">
            18+. Мероприятия предназначены для совершеннолетних. Мы не осуществляем дистанционную продажу алкоголя — оказываются исключительно услуги проведения дегустаций и винных игр.
          </p>
        </div>
      </div>
    </footer>
  );
}
