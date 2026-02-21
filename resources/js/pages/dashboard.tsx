import { Head, router, usePage } from '@inertiajs/react';
import { Link } from '@inertiajs/react';
import { Clock, CheckCircle, Bell, Video, ExternalLink, Upload, PlusCircle, Building, ChevronRight, Smartphone, ArrowLeft, Copy, PartyPopper, Search, XCircle, Lock, History, Trophy, Ticket } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { ChangeEvent } from 'react';
import { PRIZE_IMAGES, TRANSLATIONS } from '@/constants';
import AppLayout from '@/layouts/app-layout';
import ActivityTimeline, { type RecentActivityItem } from '@/pages/dashboard/activity-timeline';
import TicketSelectionModal from '@/pages/dashboard/ticket-selection-modal';
import WinnerCelebrationModal from '@/pages/dashboard/winner-celebration-modal';
import { dashboard } from '@/routes';
import { mynotifications } from '@/routes/user';
import type { BreadcrumbItem } from '@/types';
import type { AppNotification, AppSettings } from '@/types/app';

const TICKET_BOARD_URL = '/dashboard/ticket-board';
const CHECK_AVAILABILITY_URL = '/tickets/check-availability';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

type UserSummary = {
    id: number | string;
    name: string;
    phone: string;
    status: 'PENDING' | 'VERIFIED';
    contribution: number;
    joinedDate?: string;
};

type TicketBoardItem = { number: number; taken: boolean };

type TicketBoardPayload = {
    data: TicketBoardItem[];
    nextCursor: string | null;
};

type PaymentStep =
    | 'IDLE'
    | 'METHOD'
    | 'DETAILS'
    | 'UPLOAD'
    | 'PROCESSING'
    | 'SUCCESS';


type ServerNotification = {
    id: number | string;
    title: { en: string; am: string };
    desc: { en: string; am: string };
    time: string | null;
    urgent: boolean;
    link?: string | null;
};

export default function Dashboard() {
    const DEFAULT_SETTINGS = usePage().props.settings as AppSettings;
    const initialTicketBoard = usePage().props.ticketBoard as
        | TicketBoardPayload
        | undefined;

    const user = usePage().props.userSummary as UserSummary;
    const serverNotifications = (usePage().props.notifications ?? []) as ServerNotification[];
    const recentActivities = (usePage().props.recentActivities ?? []) as RecentActivityItem[];
    const serverMyTickets = (usePage().props.myTickets ?? []) as Array<{ ticketNumber: number; status: string; cycle?: number | null }>;

    const [notifications, setNotifications] = useState<AppNotification[]>(() => {
        return serverNotifications.map((n) => ({
            id: n.id,
            title: n.title,
            desc: n.desc,
            time: n.time ? new Date(n.time) : new Date(),
            urgent: n.urgent,
            read: false,
        }));
    });

    const settings = {
        ...DEFAULT_SETTINGS,
    };
    const language = 'en';

    // Payment Flow State
    const [paymentStep, setPaymentStep] = useState<PaymentStep>('IDLE');
    const [showTicketModal, setShowTicketModal] = useState(false);
    const [showWinnerCelebration, setShowWinnerCelebration] = useState(true);
    const [paymentAmount, setPaymentAmount] = useState<number>(user.contribution ?? 0);
    const [paymentReceipt, setPaymentReceipt] = useState<File | null>(null);
    const [paymentError, setPaymentError] = useState<string | null>(null);

    const [selectedTempTicket, setSelectedTempTicket] = useState<number | null>(
        null,
    );
    const [paymentMethod, setPaymentMethod] = useState<
        'CBE' | 'TELEBIRR' | null
    >(null);
    const [copied, setCopied] = useState(false);

    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const [tickets, setTickets] = useState<TicketBoardItem[]>(
        () => initialTicketBoard?.data ?? [],
    );
    const [nextCursor, setNextCursor] = useState<string | null>(
        () => initialTicketBoard?.nextCursor ?? null,
    );
    const [isLoadingMoreTickets, setIsLoadingMoreTickets] = useState(false);

    // Lucky Search State
    const [luckySearch, setLuckySearch] = useState('');
    const [luckyStatus, setLuckyStatus] = useState<
        'IDLE' | 'AVAILABLE' | 'TAKEN' | 'INVALID'
    >('IDLE');

    const t = TRANSLATIONS[language].dashboard;
    const heroT = TRANSLATIONS[language].hero;
    const statsT = TRANSLATIONS[language].stats;

    const displayImages = PRIZE_IMAGES;
        // settings.prizeImages && settings.prizeImages.length > 0
        //     ? settings.prizeImages
        //     : PRIZE_IMAGES;

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prev) => (prev + 1) % displayImages.length);
        }, 10000);
        return () => clearInterval(interval);
    }, [displayImages.length]);

    // useEffect(() => {
    //     // setFeed([generateMockFeed(t), generateMockFeed(t)]);
    //     const interval = setInterval(() => {
    //         setFeed((prev) => [generateMockFeed(t), ...prev.slice(0, 4)]);
    //     }, 4000);
    //     return () => clearInterval(interval);
    // }, [language, t]);

    const handlePayment = async () => {
        if (!selectedTempTicket) {
            setPaymentError('Please select a ticket number.');
            return;
        }

        if (!paymentReceipt) {
            setPaymentError('Please upload a receipt image.');
            return;
        }

        if (!Number.isFinite(paymentAmount) || paymentAmount <= 0) {
            setPaymentError('Please enter a valid amount.');
            return;
        }

        setPaymentError(null);
        setPaymentStep('PROCESSING');

        const formData = new FormData();
        formData.append('amount', String(paymentAmount));
        formData.append('requestedTicket', String(selectedTempTicket));
        formData.append('receipt', paymentReceipt);

        router.post('/payments', formData, {
            forceFormData: true,
            onError: (errors) => {
                setPaymentStep('UPLOAD');
                setPaymentError(
                    errors.receipt ||
                    errors.amount ||
                    errors.requestedTicket ||
                    'Unable to submit payment request.',
                );
            },
        });
    };

    const confirmTicketSelection = () => {
        if (selectedTempTicket && user && user.id) {
            setShowTicketModal(false);
            setPaymentStep('METHOD');
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleLuckySearch = (e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        setLuckySearch(e.target.value);
    };


    useEffect(() => {
        if (!settings.ticketSelectionEnabled) {
            queueMicrotask(() => setLuckyStatus('IDLE'));
            return;
        }

        if (!luckySearch) {
            queueMicrotask(() => setLuckyStatus('IDLE'));
            return;
        }

        const value = Number(luckySearch);
        if (!Number.isInteger(value) || value <= 0) {
            queueMicrotask(() => setLuckyStatus('INVALID'));
            return;
        }

        const ticket = tickets.find((t) => t.number === value);
        if (ticket) {
            queueMicrotask(() => setLuckyStatus(ticket.taken ? 'TAKEN' : 'AVAILABLE'));
            return;
        }

        let cancelled = false;

        const controller = new AbortController();
        fetch(`${CHECK_AVAILABILITY_URL}?number=${encodeURIComponent(value)}`, {
            headers: { Accept: 'application/json' },
            signal: controller.signal,
        })
            .then(async (res) => {
                if (!res.ok) {
                    throw new Error('Request failed');
                }
                return (await res.json()) as {
                    exists: boolean;
                    taken: boolean | null;
                };
            })
            .then((payload) => {
                if (cancelled) {
                    return;
                }

                if (!payload.exists) {
                    queueMicrotask(() => setLuckyStatus('INVALID'));
                    return;
                }

                queueMicrotask(() => setLuckyStatus(payload.taken ? 'TAKEN' : 'AVAILABLE'));
            })
            .catch(() => {
                if (cancelled) {
                    return;
                }
                queueMicrotask(() => setLuckyStatus('INVALID'));
            });

        return () => {
            cancelled = true;
            controller.abort();
        };
    }, [luckySearch, settings.ticketSelectionEnabled, tickets]);

    useEffect(() => {
        if (!settings.ticketSelectionEnabled) {
            return;
        }

        const scrollContainer = document.querySelector(
            '[data-ticket-board-scroll-container="true"]',
        );

        if (!(scrollContainer instanceof HTMLElement)) {
            return;
        }

        const onScroll = () => {
            if (isLoadingMoreTickets || !nextCursor) {
                return;
            }

            const remaining =
                scrollContainer.scrollHeight -
                scrollContainer.scrollTop -
                scrollContainer.clientHeight;

            if (remaining > 80) {
                return;
            }

            setIsLoadingMoreTickets(true);

            router.get(
                TICKET_BOARD_URL,
                { cursor: nextCursor, perPage: 60 },
                {
                    preserveScroll: true,
                    preserveState: true,
                    only: ['ticketBoard'],
                    onSuccess: (page) => {
                        const payload = (page.props as any)
                            .ticketBoard as TicketBoardPayload;

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
                        setIsLoadingMoreTickets(false);
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
    }, [isLoadingMoreTickets, nextCursor, settings.ticketSelectionEnabled]);

    if (!user) return null; // Safety check during transition

    const unreadCount = notifications.filter((n) => !n.read).length;
    const paymentDueDate =
        language === 'en' ? settings.nextDrawDateEn : settings.nextDrawDateAm;
    const cycleText =
        language === 'en' ? `Cycle ${settings.cycle}` : `ዙር ${settings.cycle}`;

    const formatTicket = (num: number) => num.toString();

    const myTickets = serverMyTickets
        .filter((t) => (t.cycle ?? settings.cycle) === settings.cycle)
        .map((t) => t.ticketNumber)
        .sort((a, b) => a - b);

    const rando = 0.4;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="relative min-h-screen bg-stone-50 pt-5 pb-12">
                    {/* WINNER CELEBRATION MODAL */}
                    <WinnerCelebrationModal
                        isOpen={showWinnerCelebration && !!settings.currentWinner}
                        onClose={() => setShowWinnerCelebration(false)}
                        ticketNumber={settings.currentWinner?.ticketNumber ?? 0}
                        prizeName={settings.currentWinner?.prizeName ?? ''}
                        congratsLabel={t.winner_congrats}
                        descriptionLabel={t.winner_desc}
                        ticketLabel={t.winner_ticket}
                        claimLabel={t.claim_prize}
                    />

                    {/* Ticket Selection Modal (Only for initial picking) */}
                    <TicketSelectionModal
                        isOpen={showTicketModal}
                        tickets={tickets}
                        selectedTicket={selectedTempTicket}
                        onSelectTicket={setSelectedTempTicket}
                        onClose={() => setShowTicketModal(false)}
                        onConfirm={confirmTicketSelection}
                        formatTicket={formatTicket}
                        title={t.select_ticket}
                        subtitle={t.select_ticket_desc}
                        instruction={t.ticket_instruction}
                        myTicketLabel={t.my_ticket}
                        confirmLabel={language === 'en' ? 'Pay to Reserve' : 'ክፍያ ፈጽመው ይያዙ'}
                    />

                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        {/* Welcome Header */}
                        <div className="animate-fade-in-down mb-8 flex flex-col justify-between md:flex-row md:items-center">
                            <div>
                                <h1 className="text-2xl font-bold text-emerald-900">
                                    {t.welcome} {user.name}
                                </h1>
                                <p className="text-xs text-stone-500 sm:text-base">
                                    Member ID: #
                                    {user.id?.toString().slice(0, 6)}... •{' '}
                                    {cycleText}
                                </p>
                            </div>
                            <div className="mt-4 flex space-x-3 md:mt-0">
                                <Link
                                    href={mynotifications().url}
                                    className="relative rounded-full bg-white p-2 text-stone-600 shadow transition-transform hover:scale-110 hover:bg-stone-100"
                                    prefetch
                                >

                                    <History className="h-5 w-5" />
                                </Link>
                                <Link
                                    href={mynotifications().url}
                                    className="relative rounded-full bg-white p-2 text-stone-600 shadow transition-transform hover:scale-110 hover:bg-stone-100"
                                    prefetch
                                >
                                    <Bell className="h-5 w-5" />
                                    {unreadCount > 0 && (
                                        <span className="absolute top-0 right-0 h-2.5 w-2.5 animate-pulse rounded-full border-2 border-white bg-red-500"></span>
                                    )}
                                </Link>
                            </div>
                        </div>

                        {settings.recentWinners && settings.recentWinners.length > 0 && (
                            <div className="animate-fade-in-down mb-8">
                                <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
                                    <div className="mb-4 flex items-center justify-between">
                                        <h2 className="flex items-center text-lg font-bold text-stone-800">
                                            <Trophy className="mr-2 h-5 w-5 text-amber-500" />
                                            Recent Winners
                                        </h2>
                                    </div>

                                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                        {settings.recentWinners.slice(0, 6).map((winner) => (
                                            <div
                                                key={winner.id}
                                                className="rounded-xl border border-stone-100 bg-stone-50 p-4"
                                            >
                                                <div className="mb-2 text-xs font-bold tracking-wider text-stone-500 uppercase">
                                                    {winner.cycle}
                                                </div>
                                                <div className="text-base font-bold text-stone-800">
                                                    {winner.name}
                                                </div>
                                                <div className="mt-1 text-sm font-semibold text-emerald-800">
                                                    {winner.prize}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Live Stream Section */}
                        {settings.isLive && (
                            <div className="animate-fade-in-down mb-8">
                                <div className="relative overflow-hidden rounded-2xl border border-stone-800 bg-stone-900 shadow-2xl">
                                    {/* ... Live stream content ... */}
                                    <div className="absolute top-0 left-0 h-1 w-full animate-pulse bg-gradient-to-r from-red-500 via-amber-500 to-red-500"></div>
                                    <div className="flex items-center justify-between bg-stone-800 p-4">
                                        <div className="flex items-center text-white">
                                            <span className="relative mr-3 flex h-3 w-3">
                                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
                                                <span className="relative inline-flex h-3 w-3 rounded-full bg-red-500"></span>
                                            </span>
                                            <h3 className="text-lg font-bold tracking-wide uppercase">
                                                Live Draw Now
                                            </h3>
                                        </div>
                                        <div className="rounded border border-stone-700 bg-black/30 px-2 py-1 text-xs font-bold text-stone-400">
                                            TikTok / Instagram
                                        </div>
                                    </div>

                                    <div className="relative flex aspect-video flex-col items-center justify-center bg-black">
                                        {settings.liveStreamUrl ? (
                                            <iframe
                                                src={settings.liveStreamUrl || "#"}
                                                className="h-full w-full border-0"
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                allowFullScreen
                                            ></iframe>
                                        ) : (
                                            <div className="p-8 text-center">
                                                <Video className="mx-auto mb-4 h-16 w-16 text-stone-700" />
                                                <p className="text-stone-500">
                                                    Connecting to stream...
                                                </p>
                                            </div>
                                        )}

                                        <div className="absolute right-4 bottom-4">
                                            <a
                                                href={settings.liveStreamUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-sm font-bold text-white backdrop-blur-md transition-all hover:bg-white/20"
                                            >
                                                <ExternalLink className="mr-2 h-4 w-4" />{' '}
                                                Open in App
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Dashboard Grid - Status and Contribution Cards Side-by-Side on Mobile */}
                        <div className="mb-8 grid grid-cols-2 gap-3 md:gap-6">
                            {/* Status Card */}
                            <div className="animate-fade-in-up flex flex-col justify-between rounded-xl border-t-4 border-amber-500 bg-white p-4 shadow-md transition-shadow duration-300 hover:shadow-lg md:p-6">
                                <div>
                                    <h3 className="mb-1 text-[10px] leading-tight font-semibold text-stone-400 uppercase md:mb-2 md:text-sm">
                                        {t.status_card_title}
                                    </h3>
                                    <div className="mb-2 flex items-center justify-between">
                                        <span
                                            className={`truncate pr-1 text-base font-bold md:text-2xl ${user.status === 'VERIFIED' ? 'text-emerald-600' : 'text-red-500'}`}
                                        >
                                            {user.status === 'VERIFIED'
                                                ? t.status_verified
                                                : paymentStep !== 'IDLE' &&
                                                    paymentStep !== 'SUCCESS'
                                                  ? language === 'en'
                                                      ? 'Completing Payment'
                                                      : 'ክፍያ በመፈጸም ላይ'
                                                  : t.status_pending}
                                        </span>
                                        {user.status === 'VERIFIED' ? (
                                            <CheckCircle className="h-5 w-5 flex-shrink-0 text-emerald-500 md:h-8 md:w-8" />
                                        ) : (
                                            <Clock className="h-5 w-5 flex-shrink-0 text-red-500 md:h-8 md:w-8" />
                                        )}
                                    </div>
                                </div>

                                {myTickets.length > 0 ? (
                                    <div className="mt-2">
                                        <p className="mb-1 flex items-center justify-between text-xs font-bold text-stone-500">
                                            <span>
                                                My Tickets ({myTickets.length})
                                            </span>
                                            <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] text-emerald-700">
                                                Cycle {settings.cycle}
                                            </span>
                                        </p>
                                        <div className="custom-scrollbar flex max-h-16 flex-wrap gap-1 overflow-y-auto">
                                            {myTickets.map((num) => (
                                                <span
                                                    key={num}
                                                    className="rounded border border-amber-200 bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold text-amber-800 md:px-2 md:text-xs"
                                                >
                                                    #{formatTicket(num)}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="mt-auto">
                                        <div className="mb-1 h-1.5 w-full rounded-full bg-stone-100 md:mb-2 md:h-2">
                                            <div
                                                className={`h-1.5 rounded-full md:h-2 ${user.status === 'VERIFIED' ? 'w-full bg-emerald-500' : 'w-[10%] bg-red-400'}`}
                                            ></div>
                                        </div>

                                        {paymentStep !== 'IDLE' &&
                                        paymentStep !== 'SUCCESS' &&
                                        selectedTempTicket ? (
                                            <p className="animate-pulse truncate text-[10px] font-bold text-amber-600 md:text-xs">
                                                {language === 'en'
                                                    ? `Reserving Ticket #${selectedTempTicket}...`
                                                    : `ቁጥር #${selectedTempTicket} በመያዝ ላይ...`}
                                            </p>
                                        ) : (
                                            <p className="truncate text-[10px] text-stone-400 md:text-xs">
                                                {t.payment_due}:{' '}
                                                {paymentDueDate}
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Contribution Card */}
                            <div className="animate-fade-in-up rounded-xl border-t-4 border-emerald-600 bg-white p-4 shadow-md transition-shadow delay-[100ms] duration-300 hover:shadow-lg md:p-6">
                                <h3 className="mb-1 text-[10px] leading-tight font-semibold text-stone-400 uppercase md:mb-2 md:text-sm">
                                    {t.contribution}
                                </h3>
                                <div className="mb-2 flex items-center justify-between md:mb-4">
                                    <span className="truncate pr-1 text-lg font-bold text-stone-800 md:text-3xl">
                                        {user.contribution.toLocaleString()}{' '}
                                        <span className="text-[10px] font-normal text-stone-400 md:text-sm">
                                            ETB
                                        </span>
                                    </span>
                                    <div className="flex-shrink-0 rounded-lg bg-emerald-100 p-1.5 md:p-2">
                                        <Trophy className="h-4 w-4 text-emerald-600 md:h-6 md:w-6" />
                                    </div>
                                </div>
                                <p className="truncate text-[10px] leading-tight font-medium text-emerald-600 md:text-sm">
                                    {t.contribution_sub}
                                </p>
                            </div>
                        </div>

                        {/* Main Content Area */}
                        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                            <div className="space-y-6 lg:col-span-2">
                                <div className="animate-fade-in-up relative overflow-hidden rounded-2xl bg-gradient-to-r from-stone-800 to-stone-900 p-6 text-white shadow-xl delay-[300ms] md:p-8">
                                    <div className="absolute right-0 bottom-0 -mr-16 -mb-16 h-64 w-64 rounded-full bg-amber-500/10 blur-3xl"></div>
                                    <div className="relative z-10 grid grid-cols-1 items-center gap-8 md:grid-cols-2">
                                        <div className="space-y-6">
                                            <div className="text-center md:text-left">
                                                <div className="mb-3 inline-block animate-pulse rounded border border-red-700 bg-red-900/80 px-3 py-1 text-xs font-bold">
                                                    {settings.daysRemaining ===
                                                    0
                                                        ? t.next_draw_today
                                                        : t.next_draw.replace(
                                                              '14',
                                                              settings.daysRemaining.toString(),
                                                          )}
                                                </div>
                                                <h2 className="mb-2 text-3xl leading-tight font-bold">
                                                    {t.win_title}
                                                </h2>
                                                <p className="text-sm text-stone-300 md:text-base">
                                                    {t.win_desc}
                                                </p>
                                            </div>

                                            <div className="rounded-xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
                                                <div className="mb-4 flex items-center justify-between">
                                                    <h3 className="flex items-center text-sm font-bold tracking-wide text-emerald-300 uppercase">
                                                        {user.status ===
                                                        'VERIFIED' ? (
                                                            <CheckCircle className="mr-2 h-4 w-4" />
                                                        ) : (
                                                            <Upload className="mr-2 h-4 w-4" />
                                                        )}
                                                        {user.status ===
                                                        'VERIFIED'
                                                            ? t.status_verified
                                                            : t.upload}
                                                    </h3>
                                                    <span
                                                        className={`rounded-full px-2 py-0.5 text-xs font-bold ${user.status === 'VERIFIED' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}
                                                    >
                                                        {user.status ===
                                                        'VERIFIED'
                                                            ? 'Active'
                                                            : 'Pending'}
                                                    </span>
                                                </div>

                                                <div className="flex flex-col gap-3">
                                                    {/* --- PAYMENT WIZARD --- */}

                                                    {/* STEP 0: IDLE - Show Select Ticket Button */}
                                                    {paymentStep === 'IDLE' && (
                                                        <button
                                                            onClick={() => {
                                                                if (
                                                                    !settings.ticketSelectionEnabled
                                                                ) {
                                                                    alert(
                                                                        language ===
                                                                            'en'
                                                                            ? 'Ticket selection is currently closed by admin.'
                                                                            : 'የቲኬት ምርጫ ለጊዜው ተዘግቷል።',
                                                                    );
                                                                    return;
                                                                }
                                                                setShowTicketModal(
                                                                    true,
                                                                );
                                                            }}
                                                            disabled={
                                                                !settings.ticketSelectionEnabled
                                                            }
                                                            className={`flex w-full transform items-center justify-center rounded-lg px-4 py-3 font-bold shadow-lg transition-all hover:scale-105 active:scale-95 ${
                                                                !settings.ticketSelectionEnabled
                                                                    ? 'cursor-not-allowed bg-stone-600 text-stone-400'
                                                                    : 'animate-pulse bg-amber-500 text-stone-900 shadow-amber-500/20 hover:bg-amber-400'
                                                            } `}
                                                        >
                                                            {!settings.ticketSelectionEnabled ? (
                                                                <Lock className="mr-2 h-5 w-5" />
                                                            ) : myTickets.length >
                                                              0 ? (
                                                                <PlusCircle className="mr-2 h-5 w-5" />
                                                            ) : (
                                                                <Ticket className="mr-2 h-5 w-5" />
                                                            )}
                                                            {!settings.ticketSelectionEnabled
                                                                ? language ===
                                                                  'en'
                                                                    ? 'Selection Closed'
                                                                    : 'ምርጫ ተዘግቷል'
                                                                : myTickets.length >
                                                                    0
                                                                  ? language ===
                                                                    'en'
                                                                      ? 'Purchase Another Ticket'
                                                                      : 'ሌላ ቲኬት ይግዙ'
                                                                  : t.select_ticket}
                                                        </button>
                                                    )}

                                                    {/* STEP 1: METHOD SELECTION */}
                                                    {paymentStep ===
                                                        'METHOD' && (
                                                        <div className="animate-fade-in-up">
                                                            <div className="mb-3 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-center">
                                                                <p className="mb-1 text-xs font-bold tracking-wider text-amber-400 uppercase">
                                                                    {language ===
                                                                    'en'
                                                                        ? 'Selected Lucky Number'
                                                                        : 'የተመረጠው እድለኛ ቁጥር'}
                                                                </p>
                                                                <p className="text-2xl font-black text-amber-400">
                                                                    #
                                                                    {
                                                                        selectedTempTicket
                                                                    }
                                                                </p>
                                                            </div>
                                                            <div className="flex flex-col gap-2">
                                                                <p className="mb-1 text-center text-xs text-stone-300">
                                                                    Select
                                                                    Payment
                                                                    Method
                                                                </p>
                                                                <button
                                                                    onClick={() => {
                                                                        setPaymentMethod(
                                                                            'CBE',
                                                                        );
                                                                        setPaymentStep(
                                                                            'DETAILS',
                                                                        );
                                                                    }}
                                                                    className="group flex w-full items-center justify-between rounded-lg border border-purple-500/30 bg-purple-900/50 px-4 py-3 text-white transition-all hover:bg-purple-900"
                                                                >
                                                                    <span className="flex items-center">
                                                                        <Building className="mr-3 h-5 w-5 text-purple-300" />{' '}
                                                                        {
                                                                            t.pay_cbe
                                                                        }
                                                                    </span>
                                                                    <ChevronRight className="h-4 w-4 text-purple-300 transition-transform group-hover:translate-x-1" />
                                                                </button>
                                                                <button
                                                                    onClick={() => {
                                                                        setPaymentMethod(
                                                                            'TELEBIRR',
                                                                        );
                                                                        setPaymentStep(
                                                                            'DETAILS',
                                                                        );
                                                                    }}
                                                                    className="group flex w-full items-center justify-between rounded-lg border border-blue-500/30 bg-blue-900/50 px-4 py-3 text-white transition-all hover:bg-blue-900"
                                                                >
                                                                    <span className="flex items-center">
                                                                        <Smartphone className="mr-3 h-5 w-5 text-blue-300" />{' '}
                                                                        {
                                                                            t.pay_telebirr
                                                                        }
                                                                    </span>
                                                                    <ChevronRight className="h-4 w-4 text-blue-300 transition-transform group-hover:translate-x-1" />
                                                                </button>
                                                                <button
                                                                    onClick={() =>
                                                                        setPaymentStep(
                                                                            'IDLE',
                                                                        )
                                                                    }
                                                                    className="mt-2 text-xs text-stone-400 hover:text-white"
                                                                >
                                                                    Cancel
                                                                    Selection
                                                                </button>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* STEP 2: PAYMENT DETAILS */}
                                                    {paymentStep ===
                                                        'DETAILS' && (
                                                        <div className="animate-fade-in-up">
                                                            <button
                                                                onClick={() =>
                                                                    setPaymentStep(
                                                                        'METHOD',
                                                                    )
                                                                }
                                                                className="mb-3 flex items-center text-xs text-stone-400 hover:text-white"
                                                            >
                                                                <ArrowLeft className="mr-1 h-3 w-3" />{' '}
                                                                {
                                                                    t.change_method
                                                                }
                                                            </button>
                                                            {paymentMethod ===
                                                            'CBE' ? (
                                                                <div className="mb-4 rounded-lg border border-white/10 bg-white/10 p-4">
                                                                    <p className="mb-1 text-xs text-stone-400">
                                                                        {
                                                                            t.account_no
                                                                        }
                                                                    </p>
                                                                    <div className="mb-2 flex items-center justify-between">
                                                                        <p className="font-mono text-lg font-bold tracking-wide">
                                                                            1000234567890
                                                                        </p>
                                                                        <button
                                                                            onClick={() =>
                                                                                copyToClipboard(
                                                                                    '1000234567890',
                                                                                )
                                                                            }
                                                                            className="p-1 text-purple-300 hover:text-white"
                                                                        >
                                                                            {copied ? (
                                                                                <CheckCircle className="h-4 w-4" />
                                                                            ) : (
                                                                                <Copy className="h-4 w-4" />
                                                                            )}
                                                                        </button>
                                                                    </div>
                                                                    <p className="text-xs text-stone-400">
                                                                        {
                                                                            t.acc_name
                                                                        }
                                                                        :
                                                                        Blessed
                                                                        Digital
                                                                        Equb
                                                                    </p>
                                                                </div>
                                                            ) : (
                                                                <div className="mb-4 rounded-lg border border-white/10 bg-white/10 p-4">
                                                                    <p className="mb-1 text-xs text-stone-400">
                                                                        {
                                                                            t.merchant_id
                                                                        }
                                                                    </p>
                                                                    <div className="mb-2 flex items-center justify-between">
                                                                        <p className="font-mono text-lg font-bold tracking-wide">
                                                                            707070
                                                                        </p>
                                                                        <button
                                                                            onClick={() =>
                                                                                copyToClipboard(
                                                                                    '707070',
                                                                                )
                                                                            }
                                                                            className="p-1 text-blue-300 hover:text-white"
                                                                        >
                                                                            {copied ? (
                                                                                <CheckCircle className="h-4 w-4" />
                                                                            ) : (
                                                                                <Copy className="h-4 w-4" />
                                                                            )}
                                                                        </button>
                                                                    </div>
                                                                    <p className="text-xs text-stone-400">
                                                                        {
                                                                            t.acc_name
                                                                        }
                                                                        :
                                                                        Blessed
                                                                        Equb
                                                                        Service
                                                                    </p>
                                                                </div>
                                                            )}
                                                            <button
                                                                onClick={() =>
                                                                    (setPaymentError(null),
                                                                    setPaymentStep(
                                                                        'UPLOAD',
                                                                    ))
                                                                }
                                                                className="flex w-full items-center justify-center rounded-lg bg-emerald-600 px-4 py-3 font-bold text-white shadow-lg transition-all hover:bg-emerald-500"
                                                            >
                                                                <CheckCircle className="mr-2 h-5 w-5" />{' '}
                                                                {t.confirm_paid}
                                                            </button>
                                                        </div>
                                                    )}

                                                    {/* STEP 3: UPLOAD & PROCESSING */}
                                                    {(paymentStep ===
                                                        'UPLOAD' ||
                                                        paymentStep ===
                                                            'PROCESSING') && (
                                                        <div className="animate-fade-in-up">
                                                            <button
                                                                onClick={() =>
                                                                    (setPaymentError(null),
                                                                    setPaymentStep(
                                                                        'DETAILS',
                                                                    ))
                                                                }
                                                                disabled={
                                                                    paymentStep ===
                                                                    'PROCESSING'
                                                                }
                                                                className="mb-3 flex items-center text-xs text-stone-400 hover:text-white disabled:opacity-50"
                                                            >
                                                                <ArrowLeft className="mr-1 h-3 w-3" />{' '}
                                                                Back to Details
                                                            </button>

                                                            {paymentError ? (
                                                                <div className="mb-3 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-xs font-bold text-red-200">
                                                                    {paymentError}
                                                                </div>
                                                            ) : null}

                                                            <div className="mb-3 rounded-lg border border-white/10 bg-white/10 p-3">
                                                                <p className="mb-1 text-xs font-bold tracking-wider text-stone-300 uppercase">
                                                                    Amount (ETB)
                                                                </p>
                                                                <input
                                                                    type="number"
                                                                    min={1}
                                                                    inputMode="numeric"
                                                                    value={paymentAmount}
                                                                    onChange={(e) =>
                                                                        setPaymentAmount(
                                                                            Number(
                                                                                e
                                                                                    .target
                                                                                    .value,
                                                                            ),
                                                                        )
                                                                    }
                                                                    disabled={
                                                                        paymentStep ===
                                                                        'PROCESSING'
                                                                    }
                                                                    className="w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm font-bold text-white outline-none ring-0 placeholder:text-stone-500 focus:border-amber-400/60"
                                                                />
                                                            </div>

                                                            <div className="mb-4 rounded-lg border border-dashed border-white/30 bg-white/10 p-4 text-center">
                                                                <Upload className="mx-auto mb-2 h-8 w-8 text-stone-400" />
                                                                <p className="mb-1 text-sm text-stone-300">
                                                                    Upload
                                                                    Receipt
                                                                    Screenshot
                                                                </p>
                                                                <p className="text-xs text-stone-500">
                                                                    For Ticket #
                                                                    {
                                                                        selectedTempTicket
                                                                    }
                                                                </p>
                                                                <input
                                                                    type="file"
                                                                    accept="image/png,image/jpeg,image/jpg"
                                                                    onChange={(e) =>
                                                                        setPaymentReceipt(
                                                                            e.target
                                                                                .files?.[0] ??
                                                                                null,
                                                                        )
                                                                    }
                                                                    disabled={
                                                                        paymentStep ===
                                                                        'PROCESSING'
                                                                    }
                                                                    className="mt-3 block w-full text-xs text-stone-300 file:mr-4 file:rounded-lg file:border-0 file:bg-white/10 file:px-3 file:py-2 file:text-xs file:font-bold file:text-white hover:file:bg-white/20"
                                                                />
                                                                {paymentReceipt ? (
                                                                    <p className="mt-2 truncate text-[11px] font-bold text-emerald-300">
                                                                        {paymentReceipt.name}
                                                                    </p>
                                                                ) : null}
                                                            </div>
                                                            <button
                                                                onClick={
                                                                    handlePayment
                                                                }
                                                                disabled={
                                                                    paymentStep ===
                                                                    'PROCESSING'
                                                                }
                                                                className="flex w-full items-center justify-center rounded-lg bg-amber-600 px-4 py-3 font-bold text-white shadow-lg transition-all hover:bg-amber-500"
                                                            >
                                                                {paymentStep ===
                                                                'PROCESSING' ? (
                                                                    <>
                                                                        <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"></span>{' '}
                                                                        {
                                                                            t.btn_processing
                                                                        }
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <Upload className="mr-2 h-5 w-5" />{' '}
                                                                        {
                                                                            t.upload
                                                                        }
                                                                    </>
                                                                )}
                                                            </button>
                                                        </div>
                                                    )}

                                                    {/* STEP 4: SUCCESS */}
                                                    {paymentStep ===
                                                        'SUCCESS' && (
                                                        <div className="animate-fade-in-up py-2 text-center">
                                                            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/30">
                                                                <CheckCircle className="h-6 w-6 text-white" />
                                                            </div>
                                                            <h3 className="text-lg font-bold text-white">
                                                                Submission
                                                                Received!
                                                            </h3>
                                                            <p className="mb-4 text-xs text-stone-300">
                                                                Ticket #
                                                                {
                                                                    selectedTempTicket
                                                                }{' '}
                                                                is reserved
                                                                pending
                                                                approval.
                                                            </p>
                                                            <button
                                                                onClick={() =>
                                                                    setPaymentStep(
                                                                        'IDLE',
                                                                    )
                                                                }
                                                                className="text-sm font-bold text-amber-400 hover:underline"
                                                            >
                                                                Close
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="relative flex w-full justify-center">
                                            <div className="animate-wiggle-interval relative z-10 w-full max-w-sm rounded-2xl border border-stone-700 bg-gradient-to-br from-stone-800 to-stone-900 p-2 shadow-2xl">
                                                {/* Conditional Rendering: Winner Card vs Prize Carousel */}
                                                {settings.winnerAnnouncementMode &&
                                                settings.currentWinner ? (
                                                    // --- WINNER ANNOUNCEMENT CARD ---
                                                    // Height adjusted: h-[28rem] (mobile) to prevent cramping, md:h-96 (desktop)
                                                    <div className="group relative isolate flex h-[28rem] flex-col items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 p-6 text-center md:h-96">
                                                        {/* Confetti Background */}
                                                        <div className="pointer-events-none absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
                                                        {Array.from({
                                                            length: 20,
                                                        }).map((_, i) => (
                                                            <div
                                                                key={i}
                                                                className="absolute h-2 w-2 animate-pulse rounded-full bg-white"
                                                                style={{
                                                                    left: `${rando * 100}%`,
                                                                    top: `${rando * 100}%`,
                                                                    animationDelay: `${rando * 2}s`,
                                                                }}
                                                            />
                                                        ))}

                                                        <div className="relative z-20 w-full">
                                                            <div className="mb-3 inline-flex animate-bounce items-center justify-center rounded-full bg-white p-3 shadow-xl">
                                                                <PartyPopper className="h-8 w-8 text-amber-600 md:h-10 md:w-10" />
                                                            </div>
                                                            <h2 className="mb-2 text-3xl font-black tracking-wider text-white uppercase drop-shadow-md md:text-5xl">
                                                                {language ===
                                                                'en'
                                                                    ? 'Winner!'
                                                                    : 'አሸናፊ!'}
                                                            </h2>

                                                            <div className="mx-auto mt-2 w-full max-w-xs rounded-xl border border-white/20 bg-white/10 p-4 shadow-lg backdrop-blur-md">
                                                                <div className="mb-2 text-5xl font-black tracking-tighter text-white drop-shadow-sm md:text-7xl">
                                                                    #
                                                                    {
                                                                        settings
                                                                            .currentWinner
                                                                            .ticketNumber
                                                                    }
                                                                </div>
                                                                <div className="truncate text-lg font-bold text-amber-100 md:text-xl">
                                                                    {
                                                                        settings
                                                                            .currentWinner
                                                                            .userName
                                                                    }
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    // --- STANDARD PRIZE CAROUSEL ---
                                                    <div className="group relative isolate overflow-hidden rounded-xl bg-stone-800/50">
                                                        <div className="relative flex h-48 items-center justify-center overflow-hidden rounded-t-xl bg-stone-700">
                                                            <div className="absolute inset-0 bg-emerald-900/20 transition-colors group-hover:bg-emerald-900/10"></div>
                                                            <div className="pointer-events-none absolute inset-0 z-10 opacity-100">
                                                                <div className="absolute top-1/2 left-1/2 z-20 flex h-48 w-48 -translate-x-1/2 -translate-y-1/2 items-center justify-center">
                                                                    <img
                                                                        src="https://i.postimg.cc/hvkdcQC4/rebbon-final.png"
                                                                        alt="Ribbon"
                                                                        className="h-full w-full scale-[1.5] object-contain drop-shadow-2xl"
                                                                    />
                                                                </div>
                                                            </div>

                                                            {/* Carousel Images */}
                                                            {displayImages.map(
                                                                (
                                                                    img,
                                                                    index,
                                                                ) => (
                                                                    <img
                                                                        key={
                                                                            index
                                                                        }
                                                                        src={
                                                                            img
                                                                        }
                                                                        alt={`${settings.prizeName} view ${index + 1}`}
                                                                        className={`absolute inset-0 z-0 h-full w-full rounded-t-xl object-cover transition-opacity duration-1000 ease-in-out ${index === currentImageIndex ? 'opacity-100' : 'opacity-0'}`}
                                                                    />
                                                                ),
                                                            )}

                                                            <div className="absolute inset-0 z-20 flex items-end justify-end p-2">
                                                                <span className="rotate-[-2deg] transform rounded-lg border border-dashed border-stone-500/50 bg-stone-900/80 px-2 py-1 text-xs font-bold text-stone-100 shadow-xl backdrop-blur-md">
                                                                    {
                                                                        settings.prizeName
                                                                    }
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className="p-4">
                                                            <div className="flex items-end justify-between">
                                                                <div>
                                                                    <p className="mb-1 text-xs font-bold tracking-wider text-amber-500 uppercase">
                                                                        {
                                                                            heroT.prize_label
                                                                        }
                                                                    </p>
                                                                    <h3 className="text-lg leading-tight font-bold text-white">
                                                                        Luxury
                                                                        Package
                                                                    </h3>
                                                                </div>
                                                                <div className="text-right">
                                                                    <p className="text-xs text-stone-400">
                                                                        {
                                                                            heroT.prize_value
                                                                        }
                                                                    </p>
                                                                    <p className="text-lg font-bold text-white">
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
                                </div>

                                <ActivityTimeline
                                    items={recentActivities}
                                    viewAllHref={mynotifications().url}
                                    label={t.history}
                                />
                            </div>

                            <div className="space-y-6">
                                <div className="animate-fade-in-up rounded-xl border border-stone-200 bg-white p-6 shadow-sm delay-[450ms]">
                                    {/* SEARCH BOX CONTAINER (LANDING PAGE STYLE) */}
                                    <div className="mb-6 flex flex-col">
                                        <div className="flex items-start justify-between">
                                            <h3 className="mb-1 flex items-center text-lg font-bold text-stone-900">
                                                <Search className="mr-2 h-5 w-5 text-emerald-600" />
                                                {language === 'en'
                                                    ? 'Check Lucky Number'
                                                    : 'እድለኛ ቁጥር ይፈልጉ'}
                                            </h3>
                                            {!settings.ticketSelectionEnabled && (
                                                <span className="rounded bg-red-100 px-2 py-1 text-[10px] font-bold text-red-700">
                                                    CLOSED
                                                </span>
                                            )}
                                        </div>
                                        <div className="mt-2 flex space-x-3 self-start rounded-lg bg-stone-100 p-2 text-[10px] font-bold">
                                            <div className="flex items-center">
                                                <span className="mr-1.5 h-2 w-2 rounded bg-emerald-500"></span>
                                                <span className="text-emerald-700">
                                                    {statsT.lucky}
                                                </span>
                                            </div>
                                            <div className="flex items-center">
                                                <span className="mr-1.5 h-2 w-2 rounded bg-stone-300"></span>
                                                <span className="text-stone-500">
                                                    {statsT.taken}
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
                                            onChange={handleLuckySearch}
                                            placeholder={
                                                !settings.ticketSelectionEnabled
                                                    ? language === 'en'
                                                        ? 'Selection Closed'
                                                        : 'ምርጫ ተዘግቷል'
                                                    : language === 'en'
                                                      ? 'Enter number'
                                                      : 'ቁጥር ያስገቡ'
                                            }
                                            className={`w-full rounded-xl border-2 py-3 pr-10 pl-4 text-lg transition-all outline-none ${
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
                                        <div className="absolute top-1/2 right-3 -translate-y-1/2">
                                            {!settings.ticketSelectionEnabled && (
                                                <Lock className="h-5 w-5 text-stone-400" />
                                            )}
                                            {settings.ticketSelectionEnabled &&
                                                luckyStatus === 'AVAILABLE' && (
                                                    <CheckCircle className="h-6 w-6 animate-bounce text-emerald-500" />
                                                )}
                                            {settings.ticketSelectionEnabled &&
                                                luckyStatus === 'TAKEN' && (
                                                    <XCircle className="h-6 w-6 text-red-500" />
                                                )}
                                            {settings.ticketSelectionEnabled &&
                                                luckyStatus === 'IDLE' && (
                                                    <Search className="h-5 w-5 text-stone-300" />
                                                )}
                                        </div>
                                    </div>

                                    {/* STATUS MESSAGES */}
                                    {luckyStatus === 'AVAILABLE' &&
                                        settings.ticketSelectionEnabled && (
                                            <div className="animate-fade-in-down mb-6">
                                                <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4">
                                                    <div className="mb-3 flex items-center">
                                                        <CheckCircle className="mr-2 h-5 w-5 text-emerald-600" />
                                                        <div>
                                                            <p className="font-bold text-emerald-800">
                                                                #{luckySearch}{' '}
                                                                {language ===
                                                                'en'
                                                                    ? 'is Available!'
                                                                    : 'ክፍት ነው!'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={() => {
                                                            setSelectedTempTicket(
                                                                parseInt(
                                                                    luckySearch,
                                                                ),
                                                            );
                                                            setShowTicketModal(
                                                                true,
                                                            );
                                                        }}
                                                        className="w-full rounded-lg bg-emerald-600 py-2 text-sm font-bold text-white shadow transition-colors hover:bg-emerald-500"
                                                    >
                                                        {language === 'en'
                                                            ? `Select #${luckySearch}`
                                                            : `#${luckySearch} ምረጥ`}
                                                    </button>
                                                </div>
                                            </div>
                                        )}

                                    {luckyStatus === 'TAKEN' &&
                                        settings.ticketSelectionEnabled && (
                                            <div className="animate-fade-in-down mb-6">
                                                <div className="flex items-center rounded-xl border border-red-100 bg-red-50 p-4">
                                                    <XCircle className="mr-2 h-5 w-5 text-red-500" />
                                                    <p className="text-sm font-bold text-red-700">
                                                        #{luckySearch}{' '}
                                                        {language === 'en'
                                                            ? 'is already taken.'
                                                            : 'ተይዟል።'}
                                                    </p>
                                                </div>
                                            </div>
                                        )}

                                    {/* GRID */}
                                    <div className="relative border-t border-stone-100 pt-4">
                                        <h4 className="mb-3 text-[10px] font-bold tracking-wider text-stone-400 uppercase">
                                            {language === 'en'
                                                ? 'Live Availability Board'
                                                : 'የእጣ ቁጥሮች ሰሌዳ'}
                                        </h4>
                                        <div
                                            data-ticket-board-scroll-container="true"
                                            className={`custom-scrollbar relative grid max-h-[300px] grid-cols-6 gap-1.5 overflow-y-auto rounded-xl border border-stone-100 bg-stone-50 p-2 sm:grid-cols-5 md:grid-cols-4 lg:grid-cols-5 ${!settings.ticketSelectionEnabled ? 'pointer-events-none opacity-60 grayscale' : ''}`}
                                        >
                                            {tickets.map((ticket) => (
                                                <button
                                                    key={ticket.number}
                                                    disabled={
                                                        ticket.taken ||
                                                        !settings.ticketSelectionEnabled
                                                    }
                                                    onClick={() => {
                                                        if (
                                                            !settings.ticketSelectionEnabled
                                                        )
                                                            return;

                                                        if (!ticket.taken) {
                                                            setLuckySearch(
                                                                ticket.number.toString(),
                                                            );
                                                            setLuckyStatus(
                                                                'AVAILABLE',
                                                            );
                                                        } else {
                                                            setLuckySearch(
                                                                ticket.number.toString(),
                                                            );
                                                            setLuckyStatus(
                                                                'TAKEN',
                                                            );
                                                        }
                                                    }}
                                                    className={`flex aspect-square items-center justify-center rounded-lg text-xs font-bold transition-all duration-300 ${
                                                        ticket.taken
                                                            ? 'cursor-not-allowed border border-stone-200 bg-stone-200 text-stone-400'
                                                            : 'border border-emerald-200 bg-white text-emerald-600 shadow-sm hover:z-10 hover:scale-110 hover:border-emerald-500 hover:bg-emerald-500 hover:text-white hover:shadow-md'
                                                    } ${luckySearch === ticket.number.toString() ? 'z-20 scale-110 ring-2 ring-amber-400' : ''} `}
                                                >
                                                    {formatTicket(
                                                        ticket.number,
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                        {!settings.ticketSelectionEnabled && (
                                            <div className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center pt-8">
                                                <span className="rounded-full bg-stone-800/80 px-3 py-1 text-xs font-bold text-white backdrop-blur-sm">
                                                    Locked
                                                </span>
                                            </div>
                                        )}
                                        <p className="mt-3 text-center text-[10px] text-stone-400">
                                            {language === 'en'
                                                ? 'Click on any green number to select it.'
                                                : 'ማንኛውንም አረንጓዴ ቁጥር በመጫን ይምረጡ።'}
                                        </p>
                                    </div>
                                </div>

                                <div className="animate-fade-in-up rounded-xl border border-stone-200 bg-white p-6 shadow-sm delay-[500ms]">
                                    <h3 className="mb-4 text-xs font-bold tracking-wider text-stone-400 uppercase">
                                        {t.live_activity}
                                    </h3>
                                    <div className="relative max-h-[300px] space-y-4 overflow-hidden">
                                        <div className="pointer-events-none absolute bottom-0 left-0 z-10 h-12 w-full bg-gradient-to-t from-white to-transparent"></div>
                                        {recentActivities.length === 0 ? (
                                            <p className="text-xs text-stone-400">
                                                No recent activity.
                                            </p>
                                        ) : (
                                            recentActivities.slice(0, 5).map((item) => (
                                                <div
                                                    key={item.id}
                                                    className="animate-fade-in-down flex items-start"
                                                >
                                                    <div className="mt-2 mr-3 h-2 w-2 animate-pulse rounded-full bg-emerald-500"></div>
                                                    <div>
                                                        <p className="text-sm font-medium text-stone-800">
                                                            <span className="font-bold">
                                                                {item.title.en}
                                                            </span>
                                                        </p>
                                                        <p className="text-xs text-stone-400">
                                                            {new Date(item.time).toLocaleString()}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>

                                {/* <div className="animate-fade-in-up rounded-xl border border-amber-100 bg-amber-50 p-6 delay-[600ms]">
                                    <h3 className="mb-2 flex items-center font-bold text-amber-900">
                                        <Trophy className="mr-2 h-4 w-4" />{' '}
                                        {t.hall_of_fame}
                                    </h3>
                                    <div className="mb-3 flex cursor-default items-center space-x-3 rounded-lg p-2 transition-colors hover:bg-amber-100">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-200 font-bold text-amber-800">
                                            D
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-amber-900">
                                                Dawit M.
                                            </p>
                                            <p className="text-xs text-amber-700">
                                                Won Toyota Vitz (Tir)
                                            </p>
                                        </div>
                                    </div>
                                </div> */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
