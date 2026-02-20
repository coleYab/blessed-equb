
import { Head } from '@inertiajs/react';
import {
    Award,
    Calendar,
    ChevronRight,
    ExternalLink,
    MapPin,
    Play,
    Sparkles,
    Trophy,
    Users,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { DEFAULT_SETTINGS } from '@/constants';
import AppLayout from '@/layouts/app-layout';
import { mywinnings } from '@/routes/user';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'MyWinnings',
        href: mywinnings().url,
    },
];

const TRANSLATIONS = {
    en: {
        pageTitle: 'My Winnings',
        subtitle: 'Your winning history, highlights, and delivery details.',
        language: 'Language',
        featured: 'Featured winning',
        cycle: 'Cycle',
        awardedCar: 'To Award car',
        prize: 'Prize',
        winners: 'Winners',
        participants: 'Participants',
        drawDate: 'Draw date',
        deliveredOn: 'Delivered on',
        livestream: 'Livestream',
        watchReplay: 'Watch replay',
        viewDetails: 'View details',
        yourWin: 'Your win',
        location: 'Location',
        ticket: 'Ticket',
        close: 'Close',
        empty: {
            title: "You haven't won yet",
            desc: 'Join this round and you could be the next winner. Buy tickets and stay active in the current cycle.',
            currentCycle: 'Current cycle',
            highlight: 'Every ticket is a chance to win big.',
        },
    },
    am: {
        pageTitle: 'የእኔ ሽልማቶች',
        subtitle: 'የአሸናፊነት ታሪክዎን፣ ማጠቃለያ እና የማስረከብ ዝርዝሮችን ይመልከቱ።',
        language: 'ቋንቋ',
        featured: 'የተመረጠ ድል',
        cycle: 'ዙር',
        awardedCar: 'የተሸለመው መኪና',
        prize: 'ሽልማት',
        winners: 'አሸናፊዎች',
        participants: 'ተሳታፊዎች',
        drawDate: 'የመርጫ ቀን',
        deliveredOn: 'የተሰጠበት ቀን',
        livestream: 'ላይቭ ስትሪም',
        watchReplay: 'መመለሻ ይመልከቱ',
        viewDetails: 'ዝርዝር ይመልከቱ',
        yourWin: 'የእርስዎ ድል',
        location: 'ቦታ',
        ticket: 'ቲኬት',
        close: 'ዝጋ',
        empty: {
            title: 'እስካሁን አላሸነፉም',
            desc: 'በዚህ ዙር ይቀላቀሉ እና የሚቀጥለው አሸናፊ ሊሆኑ ይችላሉ። ቲኬቶችን ይግዙ እና በአሁኑ ዙር ንቁ ይሁኑ።',
            currentCycle: 'የአሁኑ ዙር',
            highlight: 'እያንዳንዱ ቲኬት ለትልቅ ድል እድል ነው።',
        },
    },
} as const;

type Language = keyof typeof TRANSLATIONS;

type WinnerMedia = {
    avatarUrl: string;
    photoUrls: string[];
};

type WinningCycle = {
    id: string;
    cycleNumber: number;
    title: string;
    drawDate: string;
    deliveredOn: string;
    participantsCount: number;
    livestreamUrl: string;
    prize: {
        name: string;
        year?: string;
        value?: string;
        badge?: string;
        imageUrl: string;
    };
    yourWinner: {
        fullName: string;
        city: string;
        ticketNumber: number;
        media: WinnerMedia;
    };
    galleryUrls: string[];
    highlight: {
        headline: string;
        subline: string;
    };
};

const DEMO_WINS: WinningCycle[] = [
    {
        id: 'win_cycle_003',
        cycleNumber: 3,
        title: 'Member Spotlight Draw',
        drawDate: '2025-10-15',
        deliveredOn: '2025-10-20',
        participantsCount: 1870,
        livestreamUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        prize: {
            name: 'BYD E2 Luxury',
            year: '2025',
            value: 'ETB 4.2M',
            badge: 'Electric',
            imageUrl:
                'https://images.unsplash.com/photo-1621993202323-f438eec934ff?auto=format&fit=crop&w=1600&q=80',
        },
        yourWinner: {
            fullName: 'Rahul Sharma',
            city: 'Addis Ababa',
            ticketNumber: 12,
            media: {
                avatarUrl:
                    'https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&w=300&q=80',
                photoUrls: [
                    'https://images.unsplash.com/photo-1542281286-9e0a16bb7366?auto=format&fit=crop&w=1400&q=80',
                    'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1400&q=80',
                ],
            },
        },
        galleryUrls: [
            'https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?auto=format&fit=crop&w=1600&q=80',
            'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=80',
        ],
        highlight: {
            headline: 'A win worth celebrating.',
            subline: 'Your delivery moments and replay link — all in one place.',
        },
    },
];

function formatDate(value: string): string {
    try {
        return new Date(value).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'short',
            day: '2-digit',
        });
    } catch {
        return value;
    }
}

export default function MyWinnings() {
    const [language, setLanguage] = useState<Language>('en');
    const t = TRANSLATIONS[language];

    const hasWon = false;

    const wins = useMemo(() => {
        return [...DEMO_WINS].sort((a, b) => b.cycleNumber - a.cycleNumber);
    }, []);

    const featured = hasWon ? (wins[0] ?? null) : null;
    const currentCycle = DEFAULT_SETTINGS.cycle;

    const [detailsOpen, setDetailsOpen] = useState(false);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t.pageTitle} />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="relative overflow-hidden rounded-3xl border border-stone-200 bg-gradient-to-br from-stone-900 via-stone-900 to-emerald-950 text-white shadow-xl">
                    <div className="absolute inset-0 opacity-40">
                        <div className="absolute -top-24 -right-24 h-80 w-80 rounded-full bg-emerald-500/30 blur-3xl" />
                        <div className="absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-amber-500/25 blur-3xl" />
                    </div>

                    <div className="relative p-6 md:p-10">
                        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                            <div className="max-w-2xl">
                                <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-bold tracking-wider uppercase">
                                    <Sparkles className="h-4 w-4 text-amber-300" />
                                    {t.pageTitle}
                                </div>
                                <h1 className="mt-4 text-3xl font-black tracking-tight md:text-4xl">
                                    {t.subtitle}
                                </h1>
                                <p className="mt-3 text-sm text-white/70 md:text-base">
                                    {featured
                                        ? `${t.featured}: ${t.cycle} ${featured.cycleNumber} — ${featured.title}`
                                        : t.empty.desc}
                                </p>
                            </div>

                            <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                                {/* <div className="flex flex-col gap-2 sm:items-end">
                                    <div className="text-[10px] font-bold tracking-wider text-white/60 uppercase">
                                        {t.language}
                                    </div>
                                    <select
                                        value={language}
                                        onChange={(e) => setLanguage(e.target.value as Language)}
                                        className="h-10 rounded-2xl border border-white/15 bg-white/5 px-3 text-sm font-bold text-white shadow-sm outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-400/10"
                                    >
                                        <option value="en">English</option>
                                        <option value="am">አማርኛ</option>
                                    </select>
                                </div> */}
                                <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4">
                                    <div className="flex items-center gap-2 text-xs font-bold tracking-wider text-white/70 uppercase">
                                        <Trophy className="h-4 w-4" />
                                        {t.yourWin}
                                    </div>
                                    <div className="mt-2 text-2xl font-black">
                                        {featured ? 1 : 0}
                                    </div>
                                </div>
                                <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4">
                                    <div className="flex items-center gap-2 text-xs font-bold tracking-wider text-white/70 uppercase">
                                        <Users className="h-4 w-4" />
                                        {t.participants}
                                    </div>
                                    <div className="mt-2 text-2xl font-black">
                                        {featured ? featured.participantsCount.toLocaleString() : 0}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {featured ? (
                            <div className="mt-8 grid gap-6 lg:grid-cols-12">
                                <div className="lg:col-span-7">
                                    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5">
                                        <div className="absolute inset-0 bg-gradient-to-tr from-black/30 via-transparent to-emerald-500/10" />
                                        <div className="relative p-6">
                                            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                                                <div>
                                                    <div className="flex items-center gap-2 text-xs font-bold tracking-wider text-white/70 uppercase">
                                                        <Award className="h-4 w-4 text-amber-300" />
                                                        {t.prize}
                                                    </div>
                                                    <div className="mt-2 text-2xl font-black">
                                                        {featured.prize.name}{' '}
                                                        {featured.prize.year ? (
                                                            <span className="text-white/70">
                                                                {featured.prize.year}
                                                            </span>
                                                        ) : null}
                                                    </div>
                                                    <div className="mt-2 flex flex-wrap items-center gap-2">
                                                        {featured.prize.badge ? (
                                                            <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-bold">
                                                                {featured.prize.badge}
                                                            </span>
                                                        ) : null}
                                                        {featured.prize.value ? (
                                                            <span className="rounded-full border border-amber-300/20 bg-amber-300/10 px-3 py-1 text-xs font-bold text-amber-100">
                                                                {featured.prize.value}
                                                            </span>
                                                        ) : null}
                                                    </div>
                                                    <div className="mt-5 grid grid-cols-2 gap-3">
                                                        <div className="rounded-2xl border border-white/10 bg-black/10 p-4">
                                                            <div className="flex items-center gap-2 text-[10px] font-bold tracking-wider text-white/60 uppercase">
                                                                <Calendar className="h-4 w-4" />
                                                                {t.drawDate}
                                                            </div>
                                                            <div className="mt-2 text-sm font-bold">
                                                                {formatDate(featured.drawDate)}
                                                            </div>
                                                        </div>
                                                        <div className="rounded-2xl border border-white/10 bg-black/10 p-4">
                                                            <div className="flex items-center gap-2 text-[10px] font-bold tracking-wider text-white/60 uppercase">
                                                                <Trophy className="h-4 w-4" />
                                                                {t.deliveredOn}
                                                            </div>
                                                            <div className="mt-2 text-sm font-bold">
                                                                {formatDate(featured.deliveredOn)}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex flex-col gap-2 sm:flex-row">
                                                    <Button
                                                        variant="secondary"
                                                        className="rounded-2xl"
                                                        asChild
                                                    >
                                                        <a
                                                            href={featured.livestreamUrl}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                        >
                                                            <Play className="mr-2 h-4 w-4" />
                                                            {t.watchReplay}
                                                            <ExternalLink className="ml-2 h-4 w-4 opacity-80" />
                                                        </a>
                                                    </Button>
                                                    <Button
                                                        className="rounded-2xl bg-amber-500 text-stone-900 hover:bg-amber-400"
                                                        onClick={() => setDetailsOpen(true)}
                                                    >
                                                        {t.viewDetails}
                                                        <ChevronRight className="ml-2 h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="lg:col-span-5">
                                    <div className="relative h-full overflow-hidden rounded-3xl border border-white/10 bg-white/5">
                                        <img
                                            src={featured.prize.imageUrl}
                                            alt={featured.prize.name}
                                            className="absolute inset-0 h-full w-full object-cover opacity-80"
                                            loading="lazy"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                                        <div className="relative flex h-full flex-col justify-end p-6">
                                            <div className="text-sm font-bold text-white/80">
                                                {featured.highlight.headline}
                                            </div>
                                            <div className="mt-1 text-xs text-white/60">
                                                {featured.highlight.subline}
                                            </div>
                                            <div className="mt-5 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-3 py-3">
                                                <img
                                                    src={featured.yourWinner.media.avatarUrl}
                                                    alt={featured.yourWinner.fullName}
                                                    className="h-10 w-10 rounded-full object-cover"
                                                    loading="lazy"
                                                />
                                                <div className="min-w-0">
                                                    <div className="truncate text-xs font-black">
                                                        {featured.yourWinner.fullName}
                                                    </div>
                                                    <div className="mt-1 flex items-center gap-2 text-[10px] text-white/60">
                                                        <span className="inline-flex items-center gap-1">
                                                            <MapPin className="h-3 w-3" />
                                                            {featured.yourWinner.city}
                                                        </span>
                                                        <span className="rounded-full bg-white/10 px-2 py-1 text-[10px] font-bold text-white/70">
                                                            {t.ticket} #{featured.yourWinner.ticketNumber}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="mt-8 grid gap-6 lg:grid-cols-12">
                                <div className="lg:col-span-7">
                                    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5">
                                        <div className="absolute inset-0 bg-gradient-to-tr from-black/25 via-transparent to-amber-500/10" />
                                        <div className="relative p-6">
                                            <div className="flex items-start gap-4">
                                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/15 bg-white/5">
                                                    <Trophy className="h-6 w-6 text-amber-300" />
                                                </div>
                                                <div>
                                                    <div className="text-lg font-black">
                                                        {t.empty.title}
                                                    </div>
                                                    <div className="mt-1 text-sm text-white/70">
                                                        {t.empty.desc}
                                                    </div>
                                                    <div className="mt-4 inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-black/10 px-4 py-3 text-sm font-bold text-white/80">
                                                        <Sparkles className="h-4 w-4 text-amber-300" />
                                                        {t.empty.highlight}
                                                    </div>
                                                    <div className="mt-5 grid grid-cols-2 gap-3">
                                                        <div className="rounded-2xl border border-white/10 bg-black/10 p-4">
                                                            <div className="text-[10px] font-bold tracking-wider text-white/60 uppercase">
                                                                {t.empty.currentCycle}
                                                            </div>
                                                            <div className="mt-2 text-sm font-black">
                                                                {t.cycle} {currentCycle}
                                                            </div>
                                                        </div>
                                                        <div className="rounded-2xl border border-white/10 bg-black/10 p-4">
                                                            <div className="text-[10px] font-bold tracking-wider text-white/60 uppercase">
                                                                {t.participants}
                                                            </div>
                                                            <div className="mt-2 text-sm font-black">
                                                                {DEFAULT_SETTINGS.totalMembers.toLocaleString()}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="lg:col-span-5">
                                    <div className="relative h-full overflow-hidden rounded-3xl border border-white/10 bg-white/5">
                                        <img
                                            src={DEFAULT_SETTINGS.prizeImage}
                                            alt={DEFAULT_SETTINGS.prizeName}
                                            className="absolute inset-0 h-full w-full object-cover opacity-80"
                                            loading="lazy"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                                        <div className="relative flex h-full flex-col justify-end p-6">
                                            <div className="text-xs font-bold tracking-wider text-white/70 uppercase">
                                                {t.awardedCar}
                                            </div>
                                            <div className="mt-2 text-xl font-black text-white">
                                                {DEFAULT_SETTINGS.prizeName}
                                            </div>
                                            <div className="mt-1 text-sm font-bold text-amber-200">
                                                {DEFAULT_SETTINGS.prizeValue}
                                            </div>
                                            <div className="mt-5 flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold text-white/80">
                                                <Users className="h-4 w-4" />
                                                {DEFAULT_SETTINGS.totalMembers.toLocaleString()} {t.participants}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <Dialog
                    open={detailsOpen}
                    onOpenChange={(open) => {
                        setDetailsOpen(open);
                    }}
                >
                    <DialogContent className="max-w-4xl overflow-hidden p-0">
                        {featured ? (
                            <div className="grid gap-0 md:grid-cols-5">
                                <div className="relative md:col-span-2">
                                    <img
                                        src={featured.prize.imageUrl}
                                        alt={featured.prize.name}
                                        className="h-64 w-full object-cover md:h-full"
                                        loading="lazy"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                                    <div className="absolute bottom-0 left-0 right-0 p-6">
                                        <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-black tracking-wider text-white uppercase">
                                            {t.cycle} {featured.cycleNumber}
                                        </div>
                                        <div className="mt-3 text-xl font-black text-white">
                                            {featured.prize.name}{' '}
                                            {featured.prize.year ? (
                                                <span className="text-white/70">
                                                    {featured.prize.year}
                                                </span>
                                            ) : null}
                                        </div>
                                        {featured.prize.value ? (
                                            <div className="mt-1 text-sm font-bold text-amber-200">
                                                {featured.prize.value}
                                            </div>
                                        ) : null}
                                    </div>
                                </div>

                                <div className="md:col-span-3">
                                    <div className="max-h-[80vh] overflow-y-auto p-6">
                                        <DialogHeader>
                                            <DialogTitle className="text-stone-900">
                                                {featured.title}
                                            </DialogTitle>
                                            <DialogDescription>
                                                {t.prize}: {featured.prize.name}
                                            </DialogDescription>
                                        </DialogHeader>

                                        <div className="mt-6 grid gap-4 md:grid-cols-3">
                                            <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
                                                <div className="flex items-center gap-2 text-[10px] font-bold tracking-wider text-stone-500 uppercase">
                                                    <Calendar className="h-4 w-4" />
                                                    {t.drawDate}
                                                </div>
                                                <div className="mt-2 text-sm font-bold text-stone-800">
                                                    {formatDate(featured.drawDate)}
                                                </div>
                                            </div>
                                            <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
                                                <div className="flex items-center gap-2 text-[10px] font-bold tracking-wider text-stone-500 uppercase">
                                                    <Trophy className="h-4 w-4" />
                                                    {t.deliveredOn}
                                                </div>
                                                <div className="mt-2 text-sm font-bold text-stone-800">
                                                    {formatDate(featured.deliveredOn)}
                                                </div>
                                            </div>
                                            <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
                                                <div className="flex items-center gap-2 text-[10px] font-bold tracking-wider text-stone-500 uppercase">
                                                    <Users className="h-4 w-4" />
                                                    {t.participants}
                                                </div>
                                                <div className="mt-2 text-sm font-bold text-stone-800">
                                                    {featured.participantsCount.toLocaleString()}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-6 rounded-2xl border border-stone-200 bg-gradient-to-r from-stone-900 to-stone-800 p-5 text-white">
                                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                                <div>
                                                    <div className="text-xs font-bold tracking-wider text-white/70 uppercase">
                                                        {t.livestream}
                                                    </div>
                                                    <div className="mt-1 text-sm font-bold">
                                                        {t.watchReplay}
                                                    </div>
                                                </div>
                                                <Button
                                                    className="rounded-2xl bg-emerald-500 text-stone-900 hover:bg-emerald-400"
                                                    asChild
                                                >
                                                    <a
                                                        href={featured.livestreamUrl}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                    >
                                                        <Play className="mr-2 h-4 w-4" />
                                                        {t.watchReplay}
                                                        <ExternalLink className="ml-2 h-4 w-4 opacity-80" />
                                                    </a>
                                                </Button>
                                            </div>
                                        </div>

                                        <div className="mt-6 overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm">
                                            <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                                                <div className="flex items-center gap-4">
                                                    <img
                                                        src={featured.yourWinner.media.avatarUrl}
                                                        alt={featured.yourWinner.fullName}
                                                        className="h-14 w-14 rounded-2xl object-cover"
                                                        loading="lazy"
                                                    />
                                                    <div>
                                                        <div className="text-sm font-black text-stone-900">
                                                            {featured.yourWinner.fullName}
                                                        </div>
                                                        <div className="mt-1 flex flex-wrap items-center gap-2">
                                                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800">
                                                                <Trophy className="h-4 w-4" />
                                                                {t.yourWin}
                                                            </span>
                                                            <span className="inline-flex items-center gap-1 rounded-full bg-stone-100 px-3 py-1 text-xs font-bold text-stone-700">
                                                                <MapPin className="h-4 w-4" />
                                                                {featured.yourWinner.city}
                                                            </span>
                                                            <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-800">
                                                                <Award className="h-4 w-4" />
                                                                {t.ticket} #{featured.yourWinner.ticketNumber}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {featured.yourWinner.media.photoUrls.length > 0 ? (
                                                <div className="grid grid-cols-2 gap-2 border-t border-stone-100 bg-stone-50 p-4 sm:grid-cols-3">
                                                    {featured.yourWinner.media.photoUrls
                                                        .slice(0, 6)
                                                        .map((url) => (
                                                            <div
                                                                key={url}
                                                                className="relative overflow-hidden rounded-2xl"
                                                            >
                                                                <img
                                                                    src={url}
                                                                    alt={featured.yourWinner.fullName}
                                                                    className="h-24 w-full object-cover sm:h-28"
                                                                    loading="lazy"
                                                                />
                                                            </div>
                                                        ))}
                                                </div>
                                            ) : null}
                                        </div>

                                        <div className="mt-6">
                                            <div className="flex items-center justify-between">
                                                <h3 className="text-sm font-black text-stone-900">
                                                    {t.awardedCar}
                                                </h3>
                                                {featured.prize.value ? (
                                                    <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-800">
                                                        {featured.prize.value}
                                                    </span>
                                                ) : null}
                                            </div>
                                            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
                                                {featured.galleryUrls.slice(0, 9).map((url) => (
                                                    <div
                                                        key={url}
                                                        className="relative overflow-hidden rounded-2xl border border-stone-200"
                                                    >
                                                        <img
                                                            src={url}
                                                            alt={featured.prize.name}
                                                            className="h-28 w-full object-cover sm:h-32"
                                                            loading="lazy"
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="mt-8 flex justify-end">
                                            <Button
                                                variant="secondary"
                                                className="rounded-2xl"
                                                onClick={() => setDetailsOpen(false)}
                                            >
                                                {t.close}
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : null}
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
