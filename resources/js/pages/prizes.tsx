import { Head, Link, usePage } from '@inertiajs/react';
import {
    Calendar,
    Car,
    ChevronRight,
    DollarSign,
    Globe,
    Trophy,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import Footer from '@/components/landing/footer';
import { PRIZE_IMAGES, TRANSLATIONS } from '@/constants';
import { useLanguage } from '@/hooks/use-language';
import { dashboard, login, register } from '@/routes';
import type { AppSettings, Language } from '@/types/app';

interface PrizesProps {
    language: Language;
    settings: AppSettings;
}

export default function Prizes({ language = 'am', settings }: PrizesProps) {
    const { auth } = usePage().props;
    const { language: currentLanguage, updateLanguage } = useLanguage();

    // Use the hook's language state if not provided via props
    const displayLanguage = language && (language === 'en' || language === 'am') ? language : currentLanguage;

    // Translation helpers
    settings = usePage().props.settings as AppSettings;
    const t = TRANSLATIONS[displayLanguage].prizes_page;
    const commonT = TRANSLATIONS[displayLanguage];


    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const displayImages = PRIZE_IMAGES;

    // Carousel Effect
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prev) => (prev + 1) % displayImages.length);
        }, 10000);
        return () => clearInterval(interval);
    }, [displayImages.length]);

    return (
        <>
            <div className="flex min-h-screen flex-col text-[#1b1b18] lg:justify-center">
                <Head title="Prizes & Winners" />
                <div className="flex min-h-screen flex-col items-center text-[#1b1b18] lg:justify-center">
                    <header className="sticky top-0 z-50 w-full not-has-[nav]:hidden">
                        <div className="w-full border-b border-stone-200/20 bg-gradient-to-br from-emerald-950 via-emerald-900 to-stone-900 backdrop-blur-xl">
                            <nav className="mx-auto flex w-full max-w-[90%] items-center justify-between gap-4 py-4 text-sm lg:max-w-4xl">
                                <div
                                    className="flex cursor-pointer items-center space-x-2"
                                    // onClick={() => setView('landing')}
                                >
                                    <div className="rounded-lg bg-amber-700 p-2">
                                        <img src="/mainlogo.png" alt="Blessed Equb Logo" className="h-6 w-6 rounded-sm" />
                                    </div>
                                    <span className="text-xl font-bold tracking-wide text-amber-500 md:text-2xl">
                                        Blessed{' '}
                                        <span className="text-amber-400">ዕቁብ</span>
                                    </span>
                                </div>

                                <div className="flex items-center space-x-4">
                                    {/* Quick Links */}
                                    <div className="hidden md:flex items-center space-x-6">
                                        <a
                                            href="#features"
                                            className="text-amber-100 hover:text-amber-300 transition-colors font-medium"
                                        >
                                            {t.nav.how}
                                        </a>
                                        <Link
                                            href="/prizes"
                                            prefetch
                                            className="text-amber-100 hover:text-amber-300 transition-colors font-medium"
                                        >
                                            {t.nav.prizes}
                                        </Link>
                                    </div>

                                    {/* Beautiful Language Toggle */}
                                    <div className="relative">
                                        <button
                                            onClick={() => updateLanguage(displayLanguage === 'am' ? 'en' : 'am')}
                                            className="flex items-center space-x-2 rounded-lg border border-amber-600/30 bg-amber-900/20 px-3 py-2 text-sm font-semibold text-amber-100 shadow-sm transition-all hover:border-amber-600/50 hover:bg-amber-900/30"
                                            aria-label="Toggle language"
                                        >
                                            <Globe className="h-4 w-4" />
                                            <span className="font-mono font-bold">{displayLanguage === 'am' ? 'AM' : 'EN'}</span>
                                        </button>
                                    </div>

                                    {/* Auth Links */}
                                    {auth.user ? (
                                        <Link
                                            href={dashboard().url}
                                            className="inline-flex items-center justify-center rounded-lg border border-red-900/30 bg-white px-5 py-2 text-sm font-semibold leading-normal text-red-900 shadow-sm transition-colors hover:border-red-900/50 hover:bg-red-50"
                                            prefetch
                                        >
                                            {t.nav.dashboard}
                                        </Link>
                                    ) : (
                                            <>
                                                <Link
                                                    href={login().url}
                                                    className="inline-flex items-center justify-center rounded-lg border border-transparent bg-white px-5 py-2 text-sm font-semibold leading-normal text-red-900 transition-colors hover:border-red-900/30 hover:bg-red-50"
                                                    prefetch
                                                >
                                                    {t.nav.login}
                                                </Link>
                                                <Link
                                                    href={register().url}
                                                    className="inline-flex items-center justify-center rounded-lg bg-red-900 px-5 py-2 text-sm font-semibold leading-normal text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-red-800"
                                                    prefetch
                                                >
                                                    {t.nav.register}
                                                </Link>
                                            </>
                                        )}
                                </div>
                            </nav>
                        </div>
                    </header>

                    <main className="w-full">
                        <div className="min-h-screen bg-stone-50 pb-12">
                            {/* Header Banner */}
                            <div className="animate-fade-in-down mb-12 bg-emerald-900 px-4 py-16 text-white">
                                <div className="mx-auto max-w-7xl text-center">
                                    <div className="mb-4 inline-flex items-center justify-center rounded-full bg-emerald-800 p-3 shadow-lg">
                                        <Trophy className="h-8 w-8 text-amber-400" />
                                    </div>
                                    <h1 className="mb-4 text-4xl font-bold md:text-5xl">
                                        {t.title}
                                    </h1>
                                    <p className="mx-auto max-w-2xl text-xl text-emerald-200">
                                        {t.subtitle}
                                    </p>
                                </div>
                            </div>

                            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                                {/* Current Prize Hero */}
                                <div className="animate-fade-in-up mb-16 overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-xl">
                                    <div className="grid md:grid-cols-2">
                                        <div className="relative flex flex-col justify-center overflow-hidden bg-gradient-to-br from-stone-800 to-stone-900 p-8 text-white md:p-12">
                                            <div className="absolute top-0 right-0 p-4 opacity-5">
                                                <Car className="h-64 w-64" />
                                            </div>

                                            <div className="relative z-10">
                                                <span className="mb-4 inline-block animate-pulse rounded-full bg-amber-500 px-4 py-1 text-sm font-bold text-stone-900">
                                                    {t.current_prize}
                                                </span>
                                                <h2 className="mb-2 text-3xl font-bold md:text-5xl">
                                                    {settings.prizeName}
                                                </h2>
                                                <div className="mb-6 h-1 w-20 bg-emerald-500"></div>

                                                <div className="mb-8 space-y-4">
                                                    <div className="flex items-center">
                                                        <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-lg bg-white/10">
                                                            <DollarSign className="h-5 w-5 text-emerald-400" />
                                                        </div>
                                                        <div>
                                                            <p className="text-xs tracking-wider text-stone-400 uppercase">
                                                                {t.value}
                                                            </p>
                                                            <p className="text-xl font-bold">{settings.prizeValue}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-lg bg-white/10">
                                                            <Calendar className="h-5 w-5 text-amber-400" />
                                                        </div>
                                                        <div>
                                                            <p className="text-xs tracking-wider text-stone-400 uppercase">
                                                                {t.draw_date}
                                                            </p>
                                                            <p className="text-xl font-bold">
                                                                {displayLanguage === 'en' ? settings.nextDrawDateEn : settings.nextDrawDateAm}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>

                                                <Link
                                                    href={register()}
                                                    className="group flex w-full items-center justify-center rounded-xl bg-emerald-600 px-8 py-3 font-bold text-white shadow-lg shadow-emerald-900/20 transition-all hover:bg-emerald-500 md:w-auto"
                                                >
                                                    {commonT.hero.cta}
                                                    <ChevronRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                                                </Link>
                                            </div>
                                        </div>

                                        <div className="relative h-64 overflow-hidden bg-stone-200 md:h-auto">
                                            {displayImages.map((img, index) => (
                                                <img
                                                    key={index}
                                                    src={img}
                                                    alt={`${settings.prizeName} view ${index + 1}`}
                                                    className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ease-in-out ${index === currentImageIndex ? 'opacity-100' : 'opacity-0'}`}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Second and Third Prizes */}
                                <div className="animate-fade-in-up mb-16">
                                    <h3 className="mb-8 text-2xl font-bold text-stone-800 text-center">
                                        {displayLanguage === 'en' ? 'Additional Prizes' : 'ተጨማሪ ሽልማቶች'}
                                    </h3>
                                    <div className="grid gap-6 md:grid-cols-2">
                                        {/* Second Prize */}
                                        <div className="group relative overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                                            <div className="absolute inset-0 bg-gradient-to-br from-gray-600 to-gray-800 opacity-5"></div>
                                            <div className="relative p-8">
                                                <div className="mb-4 inline-flex items-center justify-center rounded-full bg-gray-100 p-3 shadow-md">
                                                    <Trophy className="h-8 w-8 text-gray-600" />
                                                </div>
                                                <div className="mb-2 flex items-center space-x-2">
                                                    <span className="rounded-full bg-gray-600 px-3 py-1 text-sm font-bold text-white">
                                                        2nd
                                                    </span>
                                                    <span className="text-sm font-medium text-stone-500">
                                                        {displayLanguage === 'en' ? 'Second Prize' : 'ሁለተኛ ሽልማት'}
                                                    </span>
                                                </div>
                                                <h4 className="mb-3 text-3xl font-bold text-stone-800">
                                                    ETB 100,000
                                                </h4>
                                                <p className="text-stone-600">
                                                    {displayLanguage === 'en'
                                                        ? 'Generous cash prize for the second lucky winner.'
                                                        : 'ለሁለተኛው እድለኛ ሰው ተገቢ የገንዘብ ሽልማት።'
                                                    }
                                                </p>
                                            </div>
                                        </div>

                                        {/* Third Prize */}
                                        <div className="group relative overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                                            <div className="absolute inset-0 bg-gradient-to-br from-amber-600 to-orange-700 opacity-5"></div>
                                            <div className="relative p-8">
                                                <div className="mb-4 inline-flex items-center justify-center rounded-full bg-amber-100 p-3 shadow-md">
                                                    <Trophy className="h-8 w-8 text-amber-600" />
                                                </div>
                                                <div className="mb-2 flex items-center space-x-2">
                                                    <span className="rounded-full bg-amber-600 px-3 py-1 text-sm font-bold text-white">
                                                        3rd
                                                    </span>
                                                    <span className="text-sm font-medium text-stone-500">
                                                        {displayLanguage === 'en' ? 'Third Prize' : 'ሶስተኛ ሽልማት'}
                                                    </span>
                                                </div>
                                                <h4 className="mb-3 text-3xl font-bold text-stone-800">
                                                    ETB 50,000
                                                </h4>
                                                <p className="text-stone-600">
                                                    {displayLanguage === 'en'
                                                        ? 'Exciting cash prize for the third lucky winner.'
                                                        : 'ለሶስተኛው እድለኛ ሰው ጥሩ የገንዘብ ሽልማት።'
                                                    }
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Past Winners Grid */}
                                <div className="animate-fade-in-up mb-16">
                                    <h3 className="mb-8 text-2xl font-bold text-stone-800">{t.past_winners}</h3>
                                    <div className="grid gap-6 md:grid-cols-3">
                                        {/* {settings.recentWinners.map((winner) => (
                                        <div key={winner.id} className="rounded-xl border border-stone-100 bg-white p-6 shadow-sm">
                                            <div className="mb-4 flex items-start justify-between">
                                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-xl font-bold text-amber-600">
                                                    {displayLanguage === 'en' ? winner.name.charAt(0) : winner.nameAm.charAt(0)}
                                                </div>
                                                <span className="rounded bg-stone-100 px-2 py-1 text-xs font-medium text-stone-500">
                                                    {displayLanguage === 'en' ? winner.cycle : winner.cycleAm}
                                                </span>
                                            </div>
                                            <h4 className="text-lg font-bold text-stone-800">
                                                {displayLanguage === 'en' ? winner.name : winner.nameAm}
                                            </h4>
                                            <p className="mb-4 text-sm text-stone-500">
                                                {displayLanguage === 'en' ? winner.location : winner.locationAm}
                                            </p>
                                            <div className="border-t border-stone-50 pt-4">
                                                <p className="flex items-center font-bold text-emerald-700">
                                                    <Car className="mr-2 h-4 w-4" />
                                                    {displayLanguage === 'en' ? winner.prize : winner.prizeAm}
                                                </p>
                                            </div>
                                        </div>
                                    ))} */}

                                        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-stone-300 bg-stone-50 p-6 text-center">
                                            <h4 className="mb-2 text-lg font-bold text-stone-600">{t.cta_title}</h4>
                                            <Link href={register()} className="text-sm font-bold text-emerald-600 hover:underline">
                                                {t.cta_btn}
                                            </Link>
                                        </div>
                                    </div>
                                </div>

                                {/* CTA Section */}
                                <div className="animate-fade-in-up relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 p-8 text-center text-white md:p-12">
                                    <div className="relative z-10 mx-auto max-w-2xl">
                                        <h2 className="mb-4 text-3xl font-bold">{t.cta_title}</h2>
                                        <Link
                                            href={register()}
                                            className="inline-block transform rounded-full bg-white px-8 py-3 font-bold text-emerald-900 shadow-lg transition-colors hover:scale-105 hover:bg-stone-100"
                                        >
                                            {t.cta_btn}
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <Footer language={language} />
                    </main>
                </div>
            </div>
        </>
    );
}
