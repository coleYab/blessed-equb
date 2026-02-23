import { Head, Link, router, usePage, useRemember } from '@inertiajs/react';
import {
    CheckCircle,
    ChevronRight,
    Globe,
    Lock,
    PartyPopper,
    Play,
    Search,
    Trophy,
    XCircle,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import Features from '@/components/landing/features';
import Footer from '@/components/landing/footer';
import SocialProofSection from '@/components/landing/social-proof';
import { PRIZE_IMAGES, TRANSLATIONS } from '@/constants';
import { useLanguage } from '@/hooks/use-language';
import { dashboard, login, register } from '@/routes';
import type { AppSettings } from '@/types/app';

type TicketBoardItem = { number: number; taken: boolean };

type TicketBoardPayload = {
    data: TicketBoardItem[];
    nextCursor: string | null;
};

type TicketBoardPage = {
    props: {
        ticketBoard: TicketBoardPayload;
    };
};

const PUBLIC_TICKET_BOARD_URL = '/ticket-board';
const PUBLIC_CHECK_AVAILABILITY_URL = '/tickets/public-check-availability';

export default function Welcome() {
    const { auth } = usePage().props;
    const { language, updateLanguage } = useLanguage();

    const pageSettings = usePage().props.settings as AppSettings;
    const page = usePage();
    const appUrl = (page.props as { appUrl?: string }).appUrl;
    const settings: AppSettings = {
        ...pageSettings,
        prizeImages: PRIZE_IMAGES,
    };
    const displayImages =
        settings.prizeImages && settings.prizeImages.length > 0
            ? settings.prizeImages
            : PRIZE_IMAGES;
    const t = TRANSLATIONS[language];

    const seoTitle = 'Blessed Digital Equb - Drive Your Dream. Secure Your Future.';
    const seoDescription = t.hero.desc;
    const canonicalUrl = (() => {
        if (typeof window !== 'undefined') {
            return new URL(page.url, window.location.origin).toString();
        }

        if (appUrl) {
            return new URL(page.url, appUrl).toString();
        }

        return page.url;
    })();
    const ogImage = settings.prizeImage || displayImages[0] || '/apple-touch-icon.png';

    const initialTicketBoard = usePage().props.ticketBoard as
        | TicketBoardPayload
        | undefined;

    const [tickets, setTickets] = useRemember<TicketBoardItem[]>(
        initialTicketBoard?.data ?? [],
        'welcome.ticketBoard.tickets',
    );
    const [nextCursor, setNextCursor] = useRemember<string | null>(
        initialTicketBoard?.nextCursor ?? null,
        'welcome.ticketBoard.nextCursor',
    );
    const [hasLoadedTicketsOnce, setHasLoadedTicketsOnce] = useRemember(
        !!initialTicketBoard,
        'welcome.ticketBoard.hasLoadedTicketsOnce',
    );
    const [isLoadingTickets, setIsLoadingTickets] = useState(false);

    const [luckySearch, setLuckySearch] = useRemember(
        '',
        'welcome.ticketBoard.luckySearch',
    );
    const [luckyStatus, setLuckyStatus] = useRemember<
        'IDLE' | 'AVAILABLE' | 'TAKEN'
    >('IDLE', 'welcome.ticketBoard.luckyStatus');
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const [confetti] = useState(() =>
        Array.from({ length: 30 }).map(() => ({
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 2}s`,
        })),
    );

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prev) => (prev + 1) % displayImages.length);
        }, 10000);
        return () => clearInterval(interval);
    }, [displayImages.length]);

    const loadInitialTickets = () => {
        if (hasLoadedTicketsOnce || isLoadingTickets) {
            return;
        }

        setIsLoadingTickets(true);

        router.get(
            PUBLIC_TICKET_BOARD_URL,
            { perPage: 60 },
            {
                preserveScroll: true,
                preserveState: true,
                only: ['ticketBoard'],
                onSuccess: (page) => {
                    const payload = (page as unknown as TicketBoardPage).props
                        .ticketBoard;
                    setTickets(payload.data);
                    setNextCursor(payload.nextCursor);
                    setHasLoadedTicketsOnce(true);
                },
                onFinish: () => {
                    setIsLoadingTickets(false);
                },
            },
        );
    };

    useEffect(() => {
        if (!hasLoadedTicketsOnce) {
            return;
        }

        const scrollContainer = document.querySelector(
            '[data-ticket-board-scroll-container="true"]',
        );

        if (!(scrollContainer instanceof HTMLElement)) {
            return;
        }

        const onScroll = () => {
            if (isLoadingTickets || !nextCursor) {
                return;
            }

            const remaining =
                scrollContainer.scrollHeight -
                scrollContainer.scrollTop -
                scrollContainer.clientHeight;

            if (remaining > 80) {
                return;
            }

            setIsLoadingTickets(true);

            router.get(
                PUBLIC_TICKET_BOARD_URL,
                { cursor: nextCursor, perPage: 60 },
                {
                    preserveScroll: true,
                    preserveState: true,
                    only: ['ticketBoard'],
                    onSuccess: (page) => {
                        const payload = (page as unknown as TicketBoardPage)
                            .props.ticketBoard;

                        setTickets((prev) => {
                            const existing = new Set(prev.map((t) => t.number));
                            const merged = [...prev];
                            for (const item of payload.data) {
                                if (!existing.has(item.number)) {
                                    merged.push(item);
                                }
                            }
                            return merged;
                        });
                        setNextCursor(payload.nextCursor);
                    },
                    onFinish: () => {
                        setIsLoadingTickets(false);
                    },
                },
            );
        };

        scrollContainer.addEventListener('scroll', onScroll, {
            passive: true,
        });

        return () => {
            scrollContainer.removeEventListener('scroll', onScroll);
        };
    }, [hasLoadedTicketsOnce, isLoadingTickets, nextCursor, setNextCursor, setTickets]);

    useEffect(() => {
        if (!settings.ticketSelectionEnabled) {
            setLuckyStatus('IDLE');
            return;
        }

        if (!luckySearch) {
            setLuckyStatus('IDLE');
            return;
        }

        const value = Number(luckySearch);
        if (!Number.isInteger(value) || value <= 0) {
            setLuckyStatus('IDLE');
            return;
        }

        const ticket = tickets.find((t) => t.number === value);
        if (ticket) {
            setLuckyStatus(ticket.taken ? 'TAKEN' : 'AVAILABLE');
            return;
        }

        let cancelled = false;
        const controller = new AbortController();

        fetch(`${PUBLIC_CHECK_AVAILABILITY_URL}?number=${encodeURIComponent(value)}`, {
            headers: { Accept: 'application/json' },
            signal: controller.signal,
        })
            .then(async (res) => {
                if (!res.ok) {
                    throw new Error('Request failed');
                }
                return (await res.json()) as { exists: boolean; taken: boolean | null };
            })
            .then((payload) => {
                if (cancelled) {
                    return;
                }
                if (!payload.exists) {
                    setLuckyStatus('IDLE');
                    return;
                }
                setLuckyStatus(payload.taken ? 'TAKEN' : 'AVAILABLE');
            })
            .catch(() => {
                if (cancelled) {
                    return;
                }
                setLuckyStatus('IDLE');
            });

        return () => {
            cancelled = true;
            controller.abort();
        };
    }, [luckySearch, setLuckyStatus, settings.ticketSelectionEnabled, tickets]);

    return (
        <>
            <Head title="Welcome">
                <meta name="description" content={seoDescription} />
                <link rel="canonical" href={canonicalUrl} />
                <meta name="robots" content="index, follow" />

                <meta property="og:type" content="website" />
                <meta property="og:site_name" content="Blessed Digital Equb" />
                <meta property="og:title" content={seoTitle} />
                <meta property="og:description" content={seoDescription} />
                <meta property="og:url" content={canonicalUrl} />
                <meta property="og:image" content={ogImage} />

                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={seoTitle} />
                <meta name="twitter:description" content={seoDescription} />
                <meta name="twitter:image" content={ogImage} />
                <meta name="twitter:url" content={canonicalUrl} />

                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600"
                    rel="stylesheet"
                />
            </Head>

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
                                <span className="hidden md:block text-xl font-bold tracking-wide text-amber-500 md:text-2xl">
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
                                        onClick={() => updateLanguage(language === 'am' ? 'en' : 'am')}
                                        className="flex items-center space-x-2 rounded-lg border border-amber-600/30 bg-amber-900/20 px-3 py-2 text-sm font-semibold text-amber-100 shadow-sm transition-all hover:border-amber-600/50 hover:bg-amber-900/30"
                                        aria-label="Toggle language"
                                    >
                                        <Globe className="h-4 w-4" />
                                        <span className="font-mono font-bold">{language === 'am' ? 'AM' : 'EN'}</span>
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
                <div className="flex w-full items-center justify-center opacity-100 transition-opacity duration-750 lg:grow starting:opacity-0">
                    <main className="flex w-full flex-col">
                        <section
                            id="home"
                            className="relative flex min-h-screen items-center overflow-hidden bg-stone-900 pt-24"
                        >
                            <div className="absolute inset-0 z-0">
                                <div className="absolute inset-0 bg-gradient-to-br from-emerald-950 via-emerald-900 to-stone-900 opacity-95"></div>
                                <div className="absolute top-0 right-0 -mt-20 -mr-20 h-96 w-96 rounded-full bg-amber-600/10 blur-3xl"></div>
                                <div className="absolute bottom-0 left-0 -mb-20 -ml-20 h-80 w-80 rounded-full bg-emerald-500/10 blur-3xl"></div>
                            </div>

                            <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 md:grid-cols-2 lg:px-8">
                                <div className="space-y-6 text-center md:text-left">
                                    <div className="animate-fade-in-down mb-2 inline-flex items-center rounded-full border border-emerald-700/50 bg-emerald-800/30 px-4 py-2 text-sm font-semibold text-emerald-300">
                                        <Trophy className="mr-2 h-4 w-4 text-amber-400" />
                                        {settings.daysRemaining === 0 ? (
                                            t.hero.subtitle_today
                                        ) : (
                                            <>
                                                {t.hero.subtitle}{' '}
                                                {language === 'en'
                                                    ? `${settings.daysRemaining} DAYS`
                                                    : `${settings.daysRemaining} ቀናት`}
                                            </>
                                        )}
                                    </div>

                                    <h1 className="animate-fade-in-up text-4xl leading-tight font-extrabold text-white md:text-6xl">
                                        {t.hero.title1} <br />
                                        <span className="bg-gradient-to-r from-amber-300 to-amber-600 bg-clip-text text-transparent">
                                            {t.hero.title2}
                                        </span>
                                    </h1>

                                    <p className="animate-fade-in-up mx-auto max-w-lg text-lg leading-relaxed text-stone-300 delay-[100ms] md:mx-0 md:text-xl">
                                        {t.hero.desc}
                                    </p>

                                    <div className="animate-fade-in-up flex w-full flex-row items-center justify-center space-x-3 pt-4 delay-[200ms] sm:w-auto md:justify-start">
                                        <Link
                                            href="/register"
                                            prefetch
                                            className="flex flex-1 items-center justify-center rounded-lg bg-red-900 px-4 py-4 text-sm font-bold whitespace-nowrap text-white shadow-xl shadow-red-900/20 transition-all hover:-translate-y-1 hover:bg-red-800 sm:w-auto sm:flex-none sm:px-8 sm:text-lg"
                                        >
                                            {t.hero.cta}
                                            <ChevronRight className="ml-1 h-4 w-4 sm:ml-2 sm:h-5 sm:w-5" />
                                        </Link>
                                        <a
                                        href={"https://youtube.com/shorts/A70Vsm03VF8?feature=share"}
                                        target="_blank"
                                        className="flex flex-1 items-center justify-center rounded-lg border border-stone-600 bg-stone-800 px-4 py-4 text-sm font-bold whitespace-nowrap text-white transition-all hover:bg-stone-700 sm:w-auto sm:flex-none sm:px-8 sm:text-lg">
                                            <Play
                                                className="mr-1 ml-1 h-4 w-4 sm:mr-2 sm:ml-2 sm:h-5 sm:w-5"
                                                fill="currentColor"
                                            />
                                            {t.hero.watch}
                                        </a>
                                    </div>
                                </div>

                                <div className="animate-fade-in-up relative -mt-8 delay-[300ms] md:mt-0">
                                    <div className="animate-wiggle-interval relative z-10 rounded-2xl border border-stone-700 bg-gradient-to-br from-stone-800 to-stone-900 p-2 shadow-2xl">
                                        {/* Conditional Rendering: Winner Card vs Prize Carousel */}
                                        {settings.winnerAnnouncementMode &&
                                        settings.currentWinner ? (
                                            // --- WINNER ANNOUNCEMENT CARD ---
                                            // Height adjusted for mobile visibility: h-[28rem] (448px)
                                            <div className="group relative isolate flex h-[28rem] flex-col items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 p-6 text-center md:h-[500px] md:p-8">
                                                {/* Confetti Background */}
                                                <div className="pointer-events-none absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
                                                {confetti.map((item, i) => (
                                                        <div
                                                            key={i}
                                                            className="absolute h-3 w-3 animate-pulse rounded-full bg-white"
                                                            style={{
                                                                left: item.left,
                                                                top: item.top,
                                                                animationDelay: item.animationDelay,
                                                            }}
                                                        />
                                                    ))}

                                                <div className="relative z-20 w-full">
                                                    <div className="mb-4 inline-flex animate-bounce items-center justify-center rounded-full bg-white p-3 shadow-2xl md:mb-6 md:p-4">
                                                        <PartyPopper className="h-8 w-8 text-amber-600 md:h-12 md:w-12" />
                                                    </div>
                                                    <h2 className="mb-2 text-3xl font-black tracking-widest text-white uppercase drop-shadow-lg sm:text-4xl md:text-5xl">
                                                        {language === 'en'
                                                            ? 'Winner!'
                                                            : 'አሸናፊ!'}
                                                    </h2>
                                                    <p className="mb-6 text-lg font-bold tracking-widest text-amber-100 uppercase md:mb-8 md:text-xl">
                                                        Cycle {settings.cycle}
                                                    </p>

                                                    <div className="mx-auto w-full max-w-sm transform rounded-2xl border border-white/30 bg-white/10 p-4 shadow-2xl backdrop-blur-xl transition-transform duration-500 hover:scale-105 md:p-6">
                                                        <div className="mb-1 text-sm font-medium tracking-widest text-amber-200 uppercase md:mb-2 md:text-lg">
                                                            Winning Ticket
                                                        </div>
                                                        <div className="mb-3 text-5xl font-black tracking-tighter text-white drop-shadow-md sm:text-6xl md:mb-4 md:text-7xl">
                                                            #
                                                            {
                                                                settings
                                                                    .currentWinner
                                                                    .ticketNumber
                                                            }
                                                        </div>
                                                        <div className="truncate text-xl font-bold text-amber-50 md:text-3xl">
                                                            {
                                                                settings
                                                                    .currentWinner
                                                                    .userName
                                                            }
                                                        </div>
                                                        <div className="mt-3 border-t border-white/20 pt-3 md:mt-4 md:pt-4">
                                                            <div className="inline-block rounded-lg bg-black/30 px-3 py-1.5 text-xs font-bold text-white shadow-inner md:px-4 md:py-2 md:text-sm">
                                                                Prize:{' '}
                                                                {
                                                                    settings
                                                                        .currentWinner
                                                                        .prizeName
                                                                }
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            // --- STANDARD PRIZE CAROUSEL ---
                                            <div className="group relative isolate overflow-hidden rounded-xl bg-stone-800/50">
                                                <div className="relative flex h-64 items-center justify-center overflow-hidden rounded-t-xl bg-stone-700 md:h-80">
                                                    <div className="absolute inset-0 bg-emerald-900/20 transition-colors group-hover:bg-emerald-900/10"></div>

                                                    {/* Ribbon Overlay */}
                                                    <div className="pointer-events-none absolute inset-0 z-10 opacity-100">
                                                        {/* Bow Image */}
                                                        <div className="absolute top-52 left-52 z-20 flex h-64 w-64 -translate-x-24 -translate-y-24 items-center justify-center">
                                                            <img
                                                                src="https://i.postimg.cc/hvkdcQC4/rebbon-final.png"
                                                                alt="Ribbon"
                                                                className="h-full w-full scale-[2] object-contain drop-shadow-2xl"
                                                            />
                                                        </div>
                                                    </div>

                                                    {/* Carousel Images */}
                                                    {displayImages.map(
                                                        (img, index) => (
                                                            <img
                                                                key={index}
                                                                src={img}
                                                                alt={`${settings.prizeName} view ${index + 1}`}
                                                                className={`absolute inset-0 z-0 h-full w-full rounded-t-xl object-cover transition-opacity duration-1000 ease-in-out ${index === currentImageIndex ? 'opacity-100' : 'opacity-0'}`}
                                                            />
                                                        ),
                                                    )}

                                                    <div className="absolute inset-0 z-20 flex items-end justify-end p-4">
                                                        <span className="rotate-[-2deg] transform rounded-lg border border-dashed border-stone-500/50 bg-stone-900/80 px-3 py-1 text-sm font-bold text-stone-100 shadow-xl backdrop-blur-md md:text-base">
                                                            {settings.prizeName}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="p-6">
                                                    <div className="flex items-end justify-between">
                                                        <div>
                                                            <p className="mb-1 text-sm font-bold tracking-wider text-amber-500 uppercase">
                                                                {
                                                                    t.hero
                                                                        .prize_label
                                                                }
                                                            </p>
                                                            <h3 className="text-2xl font-bold text-white">
                                                                Luxury Package
                                                            </h3>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-xs text-stone-400">
                                                                {
                                                                    t.hero
                                                                        .prize_value
                                                                }
                                                            </p>
                                                            <p className="text-xl font-bold text-white">
                                                                {
                                                                    settings.prizeValue
                                                                }
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Ticket Status Bar - TABLE BOARD DISPLAY */}
                        <div className="relative z-20 -mt-8 bg-amber-900 py-12 text-white shadow-xl">
                            <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
                                {/* SEARCH BOX CONTAINER (DASHBOARD STYLE) */}
                                <div className="overflow-hidden rounded-2xl bg-white p-6 text-stone-800 shadow-2xl md:p-8">
                                    <div className="mb-6 flex flex-col items-center justify-between md:flex-row">
                                        <div>
                                            <h3 className="flex items-center text-xl font-bold text-stone-900">
                                                <Search className="mr-2 h-5 w-5 text-emerald-600" />
                                                {language === 'en'
                                                    ? 'Check Lucky Number'
                                                    : 'እድለኛ ቁጥር ይፈልጉ'}
                                            </h3>
                                            <p className="mt-1 text-sm text-stone-500">
                                                {language === 'en'
                                                    ? 'Search for available numbers in the current cycle.'
                                                    : 'በዚህ ዙር ያሉትን ክፍት ቁጥሮች ይፈልጉ።'}
                                            </p>
                                        </div>
                                        <div className="mt-4 flex space-x-4 rounded-lg bg-stone-100 p-2 text-xs font-bold md:mt-0">
                                            <div className="flex items-center">
                                                <span className="mr-2 h-3 w-3 rounded bg-emerald-500"></span>
                                                <span className="text-emerald-700">
                                                    {t.stats.lucky}
                                                </span>
                                            </div>
                                            <div className="flex items-center">
                                                <span className="mr-2 h-3 w-3 rounded bg-stone-300"></span>
                                                <span className="text-stone-500">
                                                    {t.stats.taken}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* SEARCH INPUT */}
                                    <div className="relative mb-6">
                                        <input
                                            type="number"
                                            disabled={
                                                !settings.ticketSelectionEnabled
                                            }
                                            value={luckySearch}
                                            onChange={(e) =>
                                                setLuckySearch(e.target.value)
                                            }
                                            onFocus={() => loadInitialTickets()}
                                            placeholder={
                                                !settings.ticketSelectionEnabled
                                                    ? language === 'en'
                                                        ? 'Selection Closed'
                                                        : 'ምርጫ ተዘግቷል'
                                                    : language === 'en'
                                                      ? 'Enter lucky number (e.g. 104)'
                                                      : 'እድለኛ ቁጥር ያስገቡ (ለምሳሌ 104)'
                                            }
                                            className={`w-full rounded-xl border-2 py-4 pr-12 pl-5 text-lg transition-all outline-none ${
                                                !settings.ticketSelectionEnabled
                                                    ? 'cursor-not-allowed border-stone-200 bg-stone-100 text-stone-400'
                                                    : luckyStatus ===
                                                        'AVAILABLE'
                                                      ? 'border-emerald-500 bg-emerald-50/30 ring-4 ring-emerald-500/10'
                                                      : luckyStatus === 'TAKEN'
                                                        ? 'border-red-300 bg-red-50/30 ring-4 ring-red-200'
                                                        : 'border-stone-200 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10'
                                            }`}
                                        />
                                        <div className="absolute top-1/2 right-4 -translate-y-1/2">
                                            {!settings.ticketSelectionEnabled && (
                                                <Lock className="h-6 w-6 text-stone-400" />
                                            )}
                                            {settings.ticketSelectionEnabled &&
                                                luckyStatus === 'AVAILABLE' && (
                                                    <CheckCircle className="h-8 w-8 animate-bounce text-emerald-500" />
                                                )}
                                            {settings.ticketSelectionEnabled &&
                                                luckyStatus === 'TAKEN' && (
                                                    <XCircle className="h-8 w-8 text-red-500" />
                                                )}
                                            {settings.ticketSelectionEnabled &&
                                                luckyStatus === 'IDLE' && (
                                                    <Search className="h-6 w-6 text-stone-300" />
                                                )}
                                        </div>
                                    </div>

                                    {/* STATUS MESSAGES */}
                                    {luckyStatus === 'AVAILABLE' &&
                                        settings.ticketSelectionEnabled && (
                                            <div className="animate-fade-in-down mb-8">
                                                <div className="flex items-center justify-between rounded-xl border border-emerald-100 bg-emerald-50 p-4">
                                                    <div className="flex items-center">
                                                        <CheckCircle className="mr-3 h-6 w-6 text-emerald-600" />
                                                        <div>
                                                            <p className="text-lg font-bold text-emerald-800">
                                                                #{luckySearch}{' '}
                                                                {language ===
                                                                'en'
                                                                    ? 'is Available!'
                                                                    : 'ክፍት ነው!'}
                                                            </p>
                                                            <p className="text-sm text-emerald-600">
                                                                {language ===
                                                                'en'
                                                                    ? 'Register now to secure this number.'
                                                                    : 'ይህንን ቁጥር ለመያዝ አሁኑኑ ይመዝገቡ።'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <Link
                                                        href={register().url}
                                                        className="rounded-lg bg-red-900 px-4 py-2 font-bold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:bg-red-800"
                                                        prefetch
                                                    >
                                                        {t.hero.cta}
                                                    </Link>
                                                </div>
                                            </div>
                                        )}

                                    {luckyStatus === 'TAKEN' &&
                                        settings.ticketSelectionEnabled && (
                                            <div className="animate-fade-in-down mb-8">
                                                <div className="flex items-center rounded-xl border border-red-100 bg-red-50 p-4">
                                                    <XCircle className="mr-3 h-6 w-6 text-red-500" />
                                                    <p className="font-bold text-red-700">
                                                        #{luckySearch}{' '}
                                                        {language === 'en'
                                                            ? 'is already taken.'
                                                            : 'ተይዟል።'}
                                                    </p>
                                                </div>
                                            </div>
                                        )}

                                    {/* GRID */}
                                    <div className="relative">
                                        <div className="mb-3 flex items-center justify-between">
                                            <h4 className="text-xs font-bold tracking-wider text-stone-400 uppercase">
                                                {language === 'en'
                                                    ? 'Live Availability Board'
                                                    : 'የእጣ ቁጥሮች ሰሌዳ'}
                                            </h4>
                                            {!settings.ticketSelectionEnabled && (
                                                <span className="rounded border border-amber-200 bg-amber-100 px-2 py-1 text-[10px] font-bold text-amber-800">
                                                    {language === 'en'
                                                        ? 'TICKET SELECTION PAUSED'
                                                        : 'የቲኬት ምርጫ ለጊዜው ተቋርጧል'}
                                                </span>
                                            )}
                                        </div>
                                        <div
                                            data-ticket-board-scroll-container="true"
                                            className={`custom-scrollbar relative grid max-h-[400px] grid-cols-8 gap-2 overflow-y-auto rounded-xl border border-stone-100 bg-stone-50 p-4 sm:grid-cols-10 md:grid-cols-12 ${!settings.ticketSelectionEnabled ? 'pointer-events-none opacity-60 grayscale' : ''}`}
                                        >
                                            {!hasLoadedTicketsOnce ? (
                                                <div className="col-span-full flex flex-col items-center justify-center py-8">
                                                    <button
                                                        type="button"
                                                        onClick={() => loadInitialTickets()}
                                                        disabled={!settings.ticketSelectionEnabled || isLoadingTickets}
                                                        className="rounded-lg bg-red-900 px-4 py-2 text-sm font-bold text-white shadow transition-all hover:-translate-y-0.5 hover:bg-red-800 disabled:cursor-not-allowed disabled:bg-stone-300"
                                                    >
                                                        {language === 'en'
                                                            ? 'Show available tickets'
                                                            : 'ክፍት ቲኬቶችን አሳይ'}
                                                    </button>
                                                </div>
                                            ) : (
                                                tickets.map((ticket) => (
                                                    <button
                                                        key={ticket.number}
                                                        type="button"
                                                        disabled={
                                                            ticket.taken ||
                                                            !settings.ticketSelectionEnabled
                                                        }
                                                        onClick={() => {
                                                            if (!settings.ticketSelectionEnabled) {
                                                                return;
                                                            }

                                                            setLuckySearch(String(ticket.number));
                                                            setLuckyStatus(ticket.taken ? 'TAKEN' : 'AVAILABLE');
                                                        }}
                                                        className={`flex aspect-square items-center justify-center rounded-lg text-sm font-bold transition-all duration-300 md:text-base ${
                                                            ticket.taken
                                                                ? 'cursor-not-allowed border border-stone-200 bg-stone-200 text-stone-400'
                                                                : 'border border-emerald-200 bg-white text-emerald-600 shadow-sm hover:z-10 hover:scale-110 hover:border-emerald-500 hover:bg-emerald-500 hover:text-white hover:shadow-md'
                                                        } ${luckySearch === String(ticket.number) ? 'z-20 scale-110 ring-4 ring-amber-400' : ''}`}
                                                    >
                                                        {ticket.number}
                                                    </button>
                                                ))
                                            )}
                                        </div>
                                        {!settings.ticketSelectionEnabled && (
                                            <div className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center">
                                                <div className="flex items-center rounded-full bg-stone-900/80 px-6 py-3 font-bold text-white shadow-2xl backdrop-blur-sm">
                                                    <Lock className="mr-2 h-5 w-5" />
                                                    {language === 'en'
                                                        ? 'Selection Currently Closed'
                                                        : 'ምርጫ ለጊዜው ተዘግቷል'}
                                                </div>
                                            </div>
                                        )}
                                        <p className="mt-3 text-center text-[10px] text-stone-400">
                                            {language === 'en'
                                                ? 'Click on any green number to select it.'
                                                : 'ማንኛውንም አረንጓዴ ቁጥር በመጫን ይምረጡ።'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Features language={language} />
                        <SocialProofSection language={language} />


                        <section
                            id="waitlist-section"
                            className="relative overflow-hidden bg-gradient-to-b from-stone-50 to-white py-24"
                        >
                            <div className="mx-auto max-w-4xl px-4">
                                <h2 className="mb-6 text-3xl font-bold text-emerald-900">
                                    {t.cta_section.heading}
                                </h2>
                                {t.cta_section.desc && (
                                    <p className="mb-8 text-stone-600">
                                        {t.cta_section.desc}
                                    </p>
                                )}
                                <Link
                                    href="/register"
                                    prefetch
                                    className="transform rounded-full bg-red-900 px-10 py-4 text-xl font-bold text-white shadow-xl transition-transform hover:scale-105 hover:bg-red-800"
                                >
                                    {t.cta_section.btn}
                                </Link>
                            </div>
                        </section>

                        <section className="relative overflow-hidden bg-gradient-to-b from-emerald-950 via-emerald-900 to-stone-50 py-24">
                            <div className="pointer-events-none absolute inset-0 opacity-20">
                                <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-amber-400 blur-3xl" />
                                <div className="absolute -right-24 bottom-10 h-72 w-72 rounded-full bg-emerald-300 blur-3xl" />
                            </div>

                            <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 lg:grid-cols-2">
                                <div>
                                    <div className="inline-flex items-center rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold tracking-wide text-white backdrop-blur">
                                        {language === 'en' ? 'Story' : 'ታሪክ'}
                                    </div>

                                    <h2 className="mt-5 text-3xl font-extrabold leading-tight text-white sm:text-4xl">
                                        {language === 'en'
                                            ? 'Powered by Blessed Transformation'
                                            : 'በብለስድ ትራንስፎርሜሽን የተደገፈ'}
                                    </h2>

                                    <p className="mt-6 max-w-xl text-sm leading-relaxed text-emerald-100/80">
                                        {language === 'en'
                                            ? 'Blessed has gained knowledge by transforming our members body in the past, and now we has come beyond our body to bring blessings to the fortunate.'
                                            : 'ብለስድ ከዚህ በፊት ሰዉነት በመቀየር እዉቆናን ያተረፈ ሲሆን አሁን ደግሞ ከሰዉነት ባሻገር ለእድለኞች በረከትን ይዞላቹ መቷል።'}
                                    </p>
                                </div>

                                <div className="group relative">
                                    <div className="absolute -inset-1 rounded-[2rem] bg-gradient-to-r from-amber-400/35 via-white/10 to-emerald-400/35 blur-2xl" />
                                    <div className="relative overflow-hidden rounded-[2rem] border border-white/15 bg-emerald-950/40 shadow-2xl backdrop-blur">
                                        <div className="pointer-events-none absolute inset-0">
                                            <div className="absolute -left-24 top-10 h-56 w-56 rounded-full bg-amber-400/25 blur-3xl" />
                                            <div className="absolute -right-24 bottom-10 h-56 w-56 rounded-full bg-emerald-300/20 blur-3xl" />
                                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.18),transparent_55%)]" />
                                        </div>

                                        <div className="relative aspect-video">
                                            <video
                                                className="h-full w-full object-cover"
                                                src="/transformation.MP4"
                                                autoPlay
                                                loop
                                                muted
                                                playsInline
                                                controls={false}
                                                preload="metadata"
                                            />

                                            <div className="pointer-events-none absolute inset-0">
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
                                                <div className="absolute -left-1/3 top-0 h-full w-2/3 -skew-x-12 bg-white/5 opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
                                            </div>

                                            {/* <div className="pointer-events-none absolute bottom-0 left-0 right-0 p-5">
                                                <div className="inline-flex max-w-full flex-col gap-1 rounded-2xl border border-white/15 bg-black/25 px-5 py-4 text-white backdrop-blur">
                                                    <div className="text-sm font-semibold">
                                                        {language === 'en'
                                                            ? 'Powered by Blessed Transformation'
                                                            : 'በብለስድ ትራንስፎርሜሽን የተደገፈ'}
                                                    </div>
                                                    <div className="text-xs text-white/75">
                                                        {language === 'en'
                                                            ? 'A short glimpse of the story behind our mission.'
                                                            : 'ከተልዕኮታችን ጀርባ ያለው የለውጥ ታሪክ አጭር ማሳያ።'}
                                                    </div>
                                                </div>
                                            </div> */}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <Footer language={language} />
                    </main>
                </div>
                {/* <div className="hidden h-14.5 lg:block"></div> */}
            </div>
        </>
    );
}
