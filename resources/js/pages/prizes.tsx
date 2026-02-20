import { Head, Link, usePage } from '@inertiajs/react';
import {
    Calendar,
    Car,
    ChevronRight,
    DollarSign,
    Gem,
    Trophy,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import Footer from '@/components/landing/footer';
import { DEFAULT_SETTINGS, PRIZE_IMAGES, TRANSLATIONS } from '@/constants';
import { dashboard, login, register } from '@/routes';
import type { AppSettings, Language } from '@/types/app';

interface PrizesProps {
    language: Language;
    settings: AppSettings;
}

export default function Prizes({ language = 'en', settings }: PrizesProps) {
    const { auth } = usePage().props;

    // Translation helpers
    settings = DEFAULT_SETTINGS;
    const t = TRANSLATIONS[language].prizes_page;
    const commonT = TRANSLATIONS[language];
    
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const displayImages =
        settings?.prizeImages && settings.prizeImages.length > 0
            ? settings.prizeImages
            : PRIZE_IMAGES;

    // Carousel Effect
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prev) => (prev + 1) % displayImages.length);
        }, 10000);
        return () => clearInterval(interval);
    }, [displayImages.length]);

    return (
        <>
            <Head title="Prizes & Winners" />
            
            <div className="flex min-h-screen flex-col items-center pt-6 text-[#1b1b18] lg:justify-center">
                <header className="mb-6 w-full max-w-[90%] lg:max-w-4xl">
                    <nav className="flex items-center justify-between gap-4">
                        <Link
                            href="/"
                            className="flex cursor-pointer items-center space-x-2"
                        >
                            <div className="rounded-lg bg-amber-700 p-2">
                                <Gem className="h-6 w-6 text-white" />
                            </div>
                            <span className="text-xl font-bold tracking-wide text-amber-500 md:text-2xl">
                                Blessed{' '}
                                <span className="text-amber-400">የመኪና ዕቁብ</span>
                            </span>
                        </Link>
                        
                        <div className="flex gap-2">
                            {auth.user ? (
                                <Link
                                    href={dashboard()}
                                    className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm font-medium text-[#1b1b18] hover:bg-black/5"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={login()}
                                        className="inline-block px-5 py-1.5 text-sm font-medium text-[#1b1b18] hover:underline"
                                    >
                                        Log in
                                    </Link>
                                    <Link
                                        href={register()}
                                        className="inline-block rounded-sm border border-amber-700 bg-amber-700 px-5 py-1.5 text-sm font-medium text-white hover:bg-amber-800"
                                    >
                                        Register
                                    </Link>
                                </>
                            )}
                        </div>
                    </nav>
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
                                                            {language === 'en' ? settings.nextDrawDateEn : settings.nextDrawDateAm}
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

                            {/* Past Winners Grid */}
                            <div className="animate-fade-in-up mb-16">
                                <h3 className="mb-8 text-2xl font-bold text-stone-800">{t.past_winners}</h3>
                                <div className="grid gap-6 md:grid-cols-3">
                                    {settings.recentWinners.map((winner) => (
                                        <div key={winner.id} className="rounded-xl border border-stone-100 bg-white p-6 shadow-sm">
                                            <div className="mb-4 flex items-start justify-between">
                                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-xl font-bold text-amber-600">
                                                    {language === 'en' ? winner.name.charAt(0) : winner.nameAm.charAt(0)}
                                                </div>
                                                <span className="rounded bg-stone-100 px-2 py-1 text-xs font-medium text-stone-500">
                                                    {language === 'en' ? winner.cycle : winner.cycleAm}
                                                </span>
                                            </div>
                                            <h4 className="text-lg font-bold text-stone-800">
                                                {language === 'en' ? winner.name : winner.nameAm}
                                            </h4>
                                            <p className="mb-4 text-sm text-stone-500">
                                                {language === 'en' ? winner.location : winner.locationAm}
                                            </p>
                                            <div className="border-t border-stone-50 pt-4">
                                                <p className="flex items-center font-bold text-emerald-700">
                                                    <Car className="mr-2 h-4 w-4" />
                                                    {language === 'en' ? winner.prize : winner.prizeAm}
                                                </p>
                                            </div>
                                        </div>
                                    ))}

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
        </>
    );
}