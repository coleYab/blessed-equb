
import { Head, usePage } from '@inertiajs/react';
import {
    Award,
    Calendar,
    Camera,
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
import AppLayout from '@/layouts/app-layout';
import { mycycle } from '@/routes/user';
import type { BreadcrumbItem } from '@/types';
import type { AppSettings } from '@/types/app';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Past Cycles',
        href: mycycle().url,
    },
];

const TRANSLATIONS = {
    en: {
        pageTitle: 'Featured Cycles',
        subtitle:
            'Explore winners, awarded cars, and livestream replays from previous cycles.',
        language: 'Language',
        featured: 'Featured cycle',
        allCycles: 'All past cycles',
        cycle: 'Cycle',
        awardedCar: 'Awarded car',
        winners: 'Winners',
        participants: 'Participants',
        livestream: 'Livestream',
        watchReplay: 'Watch replay',
        viewDetails: 'View details',
        gallery: 'Gallery',
        winnerDetails: 'Winner details',
        winner: 'Winner',
        location: 'Location',
        ticket: 'Ticket',
        prize: 'Prize',
        drawDate: 'Drawing date',
        deliveredOn: 'To Be Delivered on',
        close: 'Close',
        empty: {
            title: 'No cycle history yet',
            desc: 'Once cycles are completed, they will appear here.',
        },
    },
    am: {
        pageTitle: 'ያለፉ ዙሮች',
        subtitle: 'የቀድሞ ዙሮች አሸናፊዎች፣ የተሸለመው መኪና እና የላይቭ ስትሪም መመለሻዎችን ይመልከቱ።',
        language: 'ቋንቋ',
        featured: 'የተመረጠ ዙር',
        allCycles: 'ሁሉም ያለፉ ዙሮች',
        cycle: 'ዙር',
        awardedCar: 'የተሸለመው መኪና',
        winners: 'አሸናፊዎች',
        participants: 'ተሳታፊዎች',
        livestream: 'ላይቭ ስትሪም',
        watchReplay: 'መመለሻ ይመልከቱ',
        viewDetails: 'ዝርዝር ይመልከቱ',
        gallery: 'ማሳያ',
        winnerDetails: 'የአሸናፊ ዝርዝሮች',
        winner: 'አሸናፊ',
        location: 'ቦታ',
        ticket: 'ቲኬት',
        prize: 'ሽልማት',
        drawDate: 'የመርጫ ቀን',
        deliveredOn: 'የተሰጠበት ቀን',
        close: 'ዝጋ',
        empty: {
            title: 'እስካሁን የተጠናቀቀ ዙር የለም',
            desc: 'ዙሮች ሲጠናቀቁ እዚህ ይታያሉ።',
        },
    },
} as const;

type Language = keyof typeof TRANSLATIONS;

type CycleWinner = {
    id: string;
    fullName: string;
    city: string;
    ticketNumber: number;
    avatarUrl: string;
    photoUrls: string[];
};

type CycleCar = {
    name: string;
    year?: string;
    value?: string;
    badge?: string;
    imageUrl: string;
};

type PastCycle = {
    id: string;
    cycleNumber: number;
    title: string;
    drawDate: string;
    deliveredOn: string;
    participantsCount: number;
    livestreamUrl: string;
    car: CycleCar;
    winners: CycleWinner[];
    galleryUrls: string[];
    highlight: {
        headline: string;
        subline: string;
    };
};

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

export default function PastCycles() {
    const [language, setLanguage] = useState<Language>('en');
    const t = TRANSLATIONS[language];

    const settings = usePage().props.settings as AppSettings | null;

    const featured = useMemo<PastCycle | null>(() => {
        if (!settings) {
            return null;
        }

        const drawDate = settings.drawDate ?? '';

        return {
            id: `cycle_current_${settings.cycle}`,
            cycleNumber: settings.cycle,
            title: settings.daysRemaining
                ? `${settings.daysRemaining} days remaining`
                : 'Current cycle',
            drawDate,
            deliveredOn: drawDate,
            participantsCount: settings.totalMembers ?? 0,
            livestreamUrl: settings.liveStreamUrl ?? '',
            car: {
                name: settings.prizeName ?? 'Prize',
                value: settings.prizeValue ?? undefined,
                imageUrl: settings.prizeImage ?? '',
            },
            winners: [],
            galleryUrls: settings.prizeImages ?? [],
            highlight: {
                headline: 'Current cycle',
                subline: settings.nextDrawDateEn ?? '',
            },
        };
    }, [settings]);

    const cycles = useMemo<PastCycle[]>(() => {
        return [];
    }, []);

    const selectableCycles = useMemo<PastCycle[]>(() => {
        return featured ? [featured, ...cycles] : cycles;
    }, [cycles, featured]);

    const [selectedCycleId, setSelectedCycleId] = useState<string | null>(null);
    const selectedCycle = useMemo(() => {
        return selectableCycles.find((c) => c.id === selectedCycleId) ?? null;
    }, [selectableCycles, selectedCycleId]);

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
                                        <Users className="h-4 w-4" />
                                        {t.participants}
                                    </div>
                                    <div className="mt-2 text-2xl font-black">
                                        {featured ? featured.participantsCount.toLocaleString() : 0}
                                    </div>
                                </div>
                                <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4">
                                    <div className="flex items-center gap-2 text-xs font-bold tracking-wider text-white/70 uppercase">
                                        <Trophy className="h-4 w-4" />
                                        {t.winners}
                                    </div>
                                    <div className="mt-2 text-2xl font-black">
                                        {featured ? featured.winners.length : 0}
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
                                                        {t.awardedCar}
                                                    </div>
                                                    <div className="mt-2 text-2xl font-black">
                                                        {featured.car.name}{' '}
                                                        {featured.car.year ? (
                                                            <span className="text-white/70">{featured.car.year}</span>
                                                        ) : null}
                                                    </div>
                                                    <div className="mt-2 flex flex-wrap items-center gap-2">
                                                        {featured.car.badge ? (
                                                            <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-bold">
                                                                {featured.car.badge}
                                                            </span>
                                                        ) : null}
                                                        {featured.car.value ? (
                                                            <span className="rounded-full border border-amber-300/20 bg-amber-300/10 px-3 py-1 text-xs font-bold text-amber-100">
                                                                {featured.car.value}
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

                                                {/* <div className="flex flex-col gap-2 sm:flex-row">
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
                                                        onClick={() => setSelectedCycleId(featured.id)}
                                                    >
                                                        {t.viewDetails}
                                                        <ChevronRight className="ml-2 h-4 w-4" />
                                                    </Button>
                                                </div> */}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="lg:col-span-5">
                                    <div className="relative h-full overflow-hidden rounded-3xl border border-white/10 bg-white/5">
                                        <img
                                            src={featured.car.imageUrl}
                                            alt={featured.car.name}
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
                                            <div className="mt-5 flex items-center gap-3">
                                                {featured.winners.slice(0, 3).map((w) => (
                                                    <div
                                                        key={w.id}
                                                        className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2"
                                                    >
                                                        <img
                                                            src={w.avatarUrl}
                                                            alt={w.fullName}
                                                            className="h-8 w-8 rounded-full object-cover"
                                                            loading="lazy"
                                                        />
                                                        <div className="min-w-0">
                                                            <div className="truncate text-xs font-bold">
                                                                {w.fullName}
                                                            </div>
                                                            <div className="flex items-center gap-1 text-[10px] text-white/60">
                                                                <MapPin className="h-3 w-3" />
                                                                <span className="truncate">{w.city}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : null}
                    </div>
                </div>

                <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
                    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                        <div>
                            <div className="text-xs font-bold tracking-wider text-stone-500 uppercase">
                                {t.allCycles}
                            </div>
                            <h2 className="mt-2 text-2xl font-black text-stone-900">
                                {t.pageTitle}
                            </h2>
                        </div>
                        <div className="flex items-center gap-2 rounded-full border border-stone-200 bg-stone-50 px-4 py-2 text-xs font-bold text-stone-600">
                            <Camera className="h-4 w-4" />
                            {t.gallery}
                        </div>
                    </div>

                    {cycles.length === 0 ? (
                        <div className="p-10 text-center">
                            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-stone-100">
                                <Trophy className="h-6 w-6 text-stone-500" />
                            </div>
                            <div className="text-sm font-bold text-stone-800">
                                {t.empty.title}
                            </div>
                            <div className="mt-1 text-xs text-stone-500">
                                {t.empty.desc}
                            </div>
                        </div>
                    ) : (
                        <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                            {cycles.map((cycle) => (
                                <div
                                    key={cycle.id}
                                    className="group relative overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm transition-shadow duration-300 hover:shadow-xl"
                                >
                                    <div className="relative h-44 overflow-hidden">
                                        <img
                                            src={cycle.car.imageUrl}
                                            alt={cycle.car.name}
                                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                            loading="lazy"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent" />
                                        <div className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-black tracking-wider text-white uppercase">
                                            {t.cycle} {cycle.cycleNumber}
                                        </div>
                                        <div className="absolute bottom-4 left-5 right-5">
                                            <div className="text-lg font-black text-white">
                                                {cycle.car.name}
                                            </div>
                                            <div className="mt-1 flex flex-wrap items-center gap-2">
                                                {cycle.car.value ? (
                                                    <span className="rounded-full bg-amber-500/20 px-3 py-1 text-[10px] font-bold tracking-wider text-amber-100 uppercase">
                                                        {cycle.car.value}
                                                    </span>
                                                ) : null}
                                                {cycle.car.badge ? (
                                                    <span className="rounded-full bg-white/10 px-3 py-1 text-[10px] font-bold tracking-wider text-white uppercase">
                                                        {cycle.car.badge}
                                                    </span>
                                                ) : null}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-5">
                                        <div className="text-xs font-bold tracking-wider text-stone-500 uppercase">
                                            {cycle.title}
                                        </div>

                                        <div className="mt-4 grid grid-cols-2 gap-3">
                                            <div className="rounded-2xl border border-stone-200 bg-stone-50 p-4">
                                                <div className="flex items-center gap-2 text-[10px] font-bold tracking-wider text-stone-500 uppercase">
                                                    <Calendar className="h-4 w-4" />
                                                    {t.drawDate}
                                                </div>
                                                <div className="mt-2 text-sm font-bold text-stone-800">
                                                    {formatDate(cycle.drawDate)}
                                                </div>
                                            </div>
                                            <div className="rounded-2xl border border-stone-200 bg-stone-50 p-4">
                                                <div className="flex items-center gap-2 text-[10px] font-bold tracking-wider text-stone-500 uppercase">
                                                    <Users className="h-4 w-4" />
                                                    {t.participants}
                                                </div>
                                                <div className="mt-2 text-sm font-bold text-stone-800">
                                                    {cycle.participantsCount.toLocaleString()}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-4 flex items-center justify-between">
                                            <div className="flex -space-x-2">
                                                {cycle.winners.slice(0, 4).map((w) => (
                                                    <img
                                                        key={w.id}
                                                        src={w.avatarUrl}
                                                        alt={w.fullName}
                                                        className="h-9 w-9 rounded-full border-2 border-white object-cover"
                                                        loading="lazy"
                                                    />
                                                ))}
                                            </div>

                                            <div className="text-xs font-bold text-stone-600">
                                                {t.winners}: {cycle.winners.length}
                                            </div>
                                        </div>

                                        <div className="mt-5 flex flex-col gap-2 sm:flex-row">
                                            <Button
                                                variant="secondary"
                                                className="w-full rounded-2xl"
                                                asChild
                                            >
                                                <a
                                                    href={cycle.livestreamUrl}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                >
                                                    <Play className="mr-2 h-4 w-4" />
                                                    {t.watchReplay}
                                                    <ExternalLink className="ml-2 h-4 w-4 opacity-70" />
                                                </a>
                                            </Button>
                                            <Button
                                                className="w-full rounded-2xl"
                                                onClick={() => setSelectedCycleId(cycle.id)}
                                            >
                                                {t.viewDetails}
                                                <ChevronRight className="ml-2 h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <Dialog
                    open={selectedCycleId !== null}
                    onOpenChange={(open) => {
                        if (!open) {
                            setSelectedCycleId(null);
                        }
                    }}
                >
                    <DialogContent className="max-w-4xl overflow-hidden p-0">
                        {selectedCycle ? (
                            <div className="grid gap-0 md:grid-cols-5">
                                <div className="relative md:col-span-2">
                                    <img
                                        src={selectedCycle.car.imageUrl}
                                        alt={selectedCycle.car.name}
                                        className="h-64 w-full object-cover md:h-full"
                                        loading="lazy"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                                    <div className="absolute bottom-0 left-0 right-0 p-6">
                                        <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-black tracking-wider text-white uppercase">
                                            {t.cycle} {selectedCycle.cycleNumber}
                                        </div>
                                        <div className="mt-3 text-xl font-black text-white">
                                            {selectedCycle.car.name}{' '}
                                            {selectedCycle.car.year ? (
                                                <span className="text-white/70">
                                                    {selectedCycle.car.year}
                                                </span>
                                            ) : null}
                                        </div>
                                        {selectedCycle.car.value ? (
                                            <div className="mt-1 text-sm font-bold text-amber-200">
                                                {selectedCycle.car.value}
                                            </div>
                                        ) : null}
                                    </div>
                                </div>

                                <div className="md:col-span-3">
                                    <div className="max-h-[80vh] overflow-y-auto p-6">
                                        <DialogHeader>
                                            <DialogTitle className="text-stone-900">
                                                {selectedCycle.title}
                                            </DialogTitle>
                                            <DialogDescription>
                                                {t.awardedCar}: {selectedCycle.car.name}
                                            </DialogDescription>
                                        </DialogHeader>

                                        <div className="mt-6 grid gap-4 md:grid-cols-3">
                                            <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
                                                <div className="flex items-center gap-2 text-[10px] font-bold tracking-wider text-stone-500 uppercase">
                                                    <Calendar className="h-4 w-4" />
                                                    {t.drawDate}
                                                </div>
                                                <div className="mt-2 text-sm font-bold text-stone-800">
                                                    {formatDate(selectedCycle.drawDate)}
                                                </div>
                                            </div>
                                            <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
                                                <div className="flex items-center gap-2 text-[10px] font-bold tracking-wider text-stone-500 uppercase">
                                                    <Trophy className="h-4 w-4" />
                                                    {t.deliveredOn}
                                                </div>
                                                <div className="mt-2 text-sm font-bold text-stone-800">
                                                    {formatDate(selectedCycle.deliveredOn)}
                                                </div>
                                            </div>
                                            <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
                                                <div className="flex items-center gap-2 text-[10px] font-bold tracking-wider text-stone-500 uppercase">
                                                    <Users className="h-4 w-4" />
                                                    {t.participants}
                                                </div>
                                                <div className="mt-2 text-sm font-bold text-stone-800">
                                                    {selectedCycle.participantsCount.toLocaleString()}
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
                                                        href={selectedCycle.livestreamUrl}
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

                                        <div className="mt-6">
                                            <div className="flex items-center justify-between">
                                                <h3 className="text-sm font-black text-stone-900">
                                                    {t.winnerDetails}
                                                </h3>
                                                <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-bold text-stone-600">
                                                    {t.winners}: {selectedCycle.winners.length}
                                                </span>
                                            </div>

                                            <div className="mt-4 grid gap-4">
                                                {selectedCycle.winners.map((w) => (
                                                    <div
                                                        key={w.id}
                                                        className="overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm"
                                                    >
                                                        <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                                                            <div className="flex items-center gap-4">
                                                                <img
                                                                    src={w.avatarUrl}
                                                                    alt={w.fullName}
                                                                    className="h-14 w-14 rounded-2xl object-cover"
                                                                    loading="lazy"
                                                                />
                                                                <div>
                                                                    <div className="text-sm font-black text-stone-900">
                                                                        {w.fullName}
                                                                    </div>
                                                                    <div className="mt-1 flex flex-wrap items-center gap-2">
                                                                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800">
                                                                            <Trophy className="h-4 w-4" />
                                                                            {t.winner}
                                                                        </span>
                                                                        <span className="inline-flex items-center gap-1 rounded-full bg-stone-100 px-3 py-1 text-xs font-bold text-stone-700">
                                                                            <MapPin className="h-4 w-4" />
                                                                            {w.city}
                                                                        </span>
                                                                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-800">
                                                                            <Award className="h-4 w-4" />
                                                                            {t.ticket} #{w.ticketNumber}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="text-xs font-bold text-stone-500">
                                                                {t.prize}: {selectedCycle.car.name}
                                                            </div>
                                                        </div>

                                                        {w.photoUrls.length > 0 ? (
                                                            <div className="grid grid-cols-2 gap-2 border-t border-stone-100 bg-stone-50 p-4 sm:grid-cols-3">
                                                                {w.photoUrls.slice(0, 6).map((url) => (
                                                                    <div
                                                                        key={url}
                                                                        className="relative overflow-hidden rounded-2xl"
                                                                    >
                                                                        <img
                                                                            src={url}
                                                                            alt={w.fullName}
                                                                            className="h-24 w-full object-cover sm:h-28"
                                                                            loading="lazy"
                                                                        />
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        ) : null}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="mt-6">
                                            <div className="flex items-center justify-between">
                                                <h3 className="text-sm font-black text-stone-900">
                                                    {t.gallery}
                                                </h3>
                                                <a
                                                    href={selectedCycle.livestreamUrl}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-800"
                                                >
                                                    {t.watchReplay}
                                                    <ExternalLink className="h-4 w-4" />
                                                </a>
                                            </div>
                                            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
                                                {selectedCycle.galleryUrls.slice(0, 9).map((url) => (
                                                    <div
                                                        key={url}
                                                        className="relative overflow-hidden rounded-2xl border border-stone-200"
                                                    >
                                                        <img
                                                            src={url}
                                                            alt={t.gallery}
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
                                                onClick={() => setSelectedCycleId(null)}
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
