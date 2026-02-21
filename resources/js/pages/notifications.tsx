
import { Head } from '@inertiajs/react';
import {
    Bell,
    Calendar,
    CheckCircle,
    Clock,
    CreditCard,
    ExternalLink,
    Sparkles,
    Ticket,
    UserPlus,
    XCircle,
} from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { DEFAULT_SETTINGS } from '@/constants';
import { useLanguage } from '@/hooks/use-language';
import AppLayout from '@/layouts/app-layout';
import { mynotifications } from '@/routes/user';
import type { BreadcrumbItem } from '@/types';
import type { AppNotification } from '@/types/app';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Notifications',
        href: mynotifications().url,
    },
];

const TRANSLATIONS = {
    en: {
        pageTitle: 'Notifications',
        subtitle: 'System updates and your recent activities.',
        language: 'Language',
        systemNotifications: 'System notifications',
        recentActivities: 'Recent activities',
        filters: {
            all: 'All',
            unread: 'Unread',
            urgent: 'Urgent',
        },
        actions: {
            markAllRead: 'Mark all as read',
        },
        empty: {
            notifications: {
                title: 'No notifications',
                desc: "You're all caught up.",
            },
            activities: {
                title: 'No recent activity',
                desc: 'Your account activity will appear here.',
            },
        },
        meta: {
            cycle: 'Cycle',
            currentCycle: 'Current cycle',
        },
        activity: {
            subscribed: 'Subscribed',
            boughtTicket: 'Bought ticket',
            paymentSubmitted: 'Payment submitted',
            paymentApproved: 'Payment approved',
            paymentRejected: 'Payment rejected',
            system: 'System',
            view: 'View',
        },
    },
    am: {
        pageTitle: 'ማሳወቂያዎች',
        subtitle: 'የስርዓት ዝመናዎች እና የቅርብ ጊዜ እንቅስቃሴዎችዎ።',
        language: 'ቋንቋ',
        systemNotifications: 'የስርዓት ማሳወቂያዎች',
        recentActivities: 'የቅርብ ጊዜ እንቅስቃሴዎች',
        filters: {
            all: 'ሁሉም',
            unread: 'ያልተነበበ',
            urgent: 'አስቸኳይ',
        },
        actions: {
            markAllRead: 'ሁሉንም እንዳነበብኩ ቁጠር',
        },
        empty: {
            notifications: {
                title: 'ማሳወቂያ የለም',
                desc: 'ሁሉንም ተከታትለዋል።',
            },
            activities: {
                title: 'የቅርብ ጊዜ እንቅስቃሴ የለም',
                desc: 'የመለያዎ እንቅስቃሴ እዚህ ይታያል።',
            },
        },
        meta: {
            cycle: 'ዙር',
            currentCycle: 'የአሁኑ ዙር',
        },
        activity: {
            subscribed: 'ተመዝግቧል',
            boughtTicket: 'ቲኬት ገዝቷል',
            paymentSubmitted: 'ክፍያ ተልኳል',
            paymentApproved: 'ክፍያ ጸድቋል',
            paymentRejected: 'ክፍያ ተቀባይነት አላገኘም',
            system: 'ስርዓት',
            view: 'ይመልከቱ',
        },
    },
} as const;

type ActivityType =
    | 'JOINED'
    | 'SUBSCRIBED'
    | 'BOUGHT_TICKET'
    | 'PAYMENT_SUBMITTED'
    | 'PAYMENT_APPROVED'
    | 'PAYMENT_REJECTED';

type ActivityItem = {
    id: string;
    type: ActivityType;
    title: { en: string; am: string };
    desc: { en: string; am: string };
    time: string;
    link?: string;
    cycle?: number;
};

type ServerNotification = {
    id: number | string;
    title: { en: string; am: string };
    desc: { en: string; am: string };
    time: string | null;
    urgent: boolean;
    read?: boolean;
    link?: string | null;
};

type ActivitiesResponse = {
    data: ActivityItem[];
    next_cursor: string | null;
};

function formatTime(value: Date): string {
    try {
        return value.toLocaleString(undefined, {
            month: 'short',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
        });
    } catch {
        return String(value);
    }
}

type PageProps = {
    notifications?: ServerNotification[];
};

function getCsrfToken(): string {
    return document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') ?? '';
}

export default function Notifications({ notifications }: PageProps) {
    const { language } = useLanguage();
    const t = TRANSLATIONS[language];

    const [filter, setFilter] = useState<'ALL' | 'UNREAD' | 'URGENT'>('ALL');
    const [items, setItems] = useState<AppNotification[]>(() => {
        const serverItems = notifications ?? [];

        return serverItems.map((n) => ({
            id: n.id,
            title: n.title,
            desc: n.desc,
            time: n.time ? new Date(n.time) : new Date(),
            urgent: n.urgent,
            read: n.read ?? false,
        }));
    });

    const filteredNotifications = useMemo(() => {
        if (filter === 'UNREAD') {
            return items.filter((n) => !n.read);
        }

        if (filter === 'URGENT') {
            return items.filter((n) => n.urgent);
        }

        return items;
    }, [filter, items]);

    const unreadCount = useMemo(() => {
        return items.filter((n) => !n.read).length;
    }, [items]);

    const markAllAsRead = async (): Promise<void> => {
        setItems((prev) => prev.map((n) => ({ ...n, read: true })));

        const token = getCsrfToken();
        await fetch('/notifications/read-all', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                ...(token ? { 'X-CSRF-TOKEN': token } : {}),
            },
        }).catch(() => null);
    };

    const markOneAsRead = async (notificationId: string | number): Promise<void> => {
        setItems((prev) =>
            prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n)),
        );

        const token = getCsrfToken();
        await fetch(`/notifications/${encodeURIComponent(String(notificationId))}/read`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                ...(token ? { 'X-CSRF-TOKEN': token } : {}),
            },
        }).catch(() => null);
    };

    const activitiesContainerRef = useRef<HTMLDivElement | null>(null);
    const [activities, setActivities] = useState<ActivityItem[]>([]);
    const [activitiesNextCursor, setActivitiesNextCursor] = useState<string | null>(null);
    const [activitiesLoading, setActivitiesLoading] = useState<boolean>(false);
    const [activitiesBootstrapped, setActivitiesBootstrapped] = useState<boolean>(false);

    const loadActivities = async (options?: { cursor?: string | null }): Promise<void> => {
        if (activitiesLoading) {
            return;
        }

        setActivitiesLoading(true);

        try {
            const params = new URLSearchParams();
            params.set('limit', '10');

            const cursor = options?.cursor;
            if (cursor) {
                params.set('cursor', cursor);
            }

            const response = await fetch(`/recent-activities?${params.toString()}`, {
                headers: {
                    Accept: 'application/json',
                },
            });

            if (!response.ok) {
                return;
            }

            const payload = (await response.json()) as ActivitiesResponse;

            setActivities((prev) => {
                const seen = new Set(prev.map((item) => item.id));
                const incoming = payload.data.filter((item) => !seen.has(item.id));
                return [...prev, ...incoming];
            });
            setActivitiesNextCursor(payload.next_cursor);
            setActivitiesBootstrapped(true);
        } finally {
            setActivitiesLoading(false);
        }
    };

    useEffect(() => {
        void loadActivities({ cursor: null });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const maybeLoadMoreActivities = (): void => {
        const container = activitiesContainerRef.current;
        if (!container) {
            return;
        }

        if (!activitiesNextCursor || activitiesLoading) {
            return;
        }

        const remaining = container.scrollHeight - container.scrollTop - container.clientHeight;
        if (remaining <= 40) {
            void loadActivities({ cursor: activitiesNextCursor });
        }
    };

    const activityMeta: Partial<
        Record<
            ActivityType,
            {
                icon: typeof Bell;
                className: string;
            }
        >
    > = {
        JOINED: {
            icon: UserPlus,
            className: 'border-emerald-200 bg-emerald-50 text-emerald-800',
        },
        SUBSCRIBED: {
            icon: UserPlus,
            className: 'border-emerald-200 bg-emerald-50 text-emerald-800',
        },
        BOUGHT_TICKET: {
            icon: Ticket,
            className: 'border-amber-200 bg-amber-50 text-amber-800',
        },
        PAYMENT_SUBMITTED: {
            icon: CreditCard,
            className: 'border-blue-200 bg-blue-50 text-blue-800',
        },
        PAYMENT_APPROVED: {
            icon: CheckCircle,
            className: 'border-emerald-200 bg-emerald-50 text-emerald-800',
        },
        PAYMENT_REJECTED: {
            icon: XCircle,
            className: 'border-red-200 bg-red-50 text-red-800',
        },
    };

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
                                    {t.meta.currentCycle}: {t.meta.cycle} {DEFAULT_SETTINGS.cycle}
                                </p>
                            </div>

                            <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                                <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4">
                                    <div className="flex items-center gap-2 text-xs font-bold tracking-wider text-white/70 uppercase">
                                        <Bell className="h-4 w-4" />
                                        {t.filters.unread}
                                    </div>
                                    <div className="mt-2 text-2xl font-black">
                                        {unreadCount}
                                    </div>
                                </div>
                                <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4">
                                    <div className="flex items-center gap-2 text-xs font-bold tracking-wider text-red/70 uppercase">
                                        <Bell className="h-4 w-4" />
                                        {t.filters.urgent}
                                    </div>
                                    <div className="mt-2 text-2xl font-black">
                                        {unreadCount}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid gap-4 lg:grid-cols-12">
                    <div className="rounded-2xl border border-stone-200 bg-white shadow-sm lg:col-span-7">
                        <div className="border-b border-stone-100 p-5">
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                <h2 className="flex items-center text-sm font-black text-stone-900">
                                    <Bell className="mr-2 h-4 w-4 text-emerald-600" />
                                    {t.systemNotifications}
                                </h2>
                                <div className="flex flex-wrap items-center gap-2">
                                    <div className="flex items-center gap-2 rounded-2xl border border-stone-200 bg-stone-50 p-1">
                                        <button
                                            type="button"
                                            onClick={() => setFilter('ALL')}
                                            className={`rounded-xl px-3 py-2 text-xs font-bold ${
                                                filter === 'ALL'
                                                    ? 'bg-white text-stone-900 shadow-sm'
                                                    : 'text-stone-600 hover:text-stone-900'
                                            }`}
                                        >
                                            {t.filters.all}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setFilter('UNREAD')}
                                            className={`rounded-xl px-3 py-2 text-xs font-bold ${
                                                filter === 'UNREAD'
                                                    ? 'bg-white text-stone-900 shadow-sm'
                                                    : 'text-stone-600 hover:text-stone-900'
                                            }`}
                                        >
                                            {t.filters.unread}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setFilter('URGENT')}
                                            className={`rounded-xl px-3 py-2 text-xs font-bold ${
                                                filter === 'URGENT'
                                                    ? 'bg-white text-stone-900 shadow-sm'
                                                    : 'text-stone-600 hover:text-stone-900'
                                            }`}
                                        >
                                            {t.filters.urgent}
                                        </button>
                                    </div>

                                    <Button
                                        variant="secondary"
                                        className="rounded-2xl"
                                        onClick={markAllAsRead}
                                        disabled={items.length === 0 || unreadCount === 0}
                                    >
                                        {t.actions.markAllRead}
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <div className="max-h-[520px] overflow-y-auto">
                            {filteredNotifications.length === 0 ? (
                                <div className="p-10 text-center">
                                    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-stone-100">
                                        <Bell className="h-6 w-6 text-stone-500" />
                                    </div>
                                    <div className="text-sm font-black text-stone-800">
                                        {t.empty.notifications.title}
                                    </div>
                                    <div className="mt-1 text-xs text-stone-500">
                                        {t.empty.notifications.desc}
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    {filteredNotifications
                                        .slice()
                                        .sort((a, b) => (a.time < b.time ? 1 : -1))
                                        .map((note) => (
                                            <button
                                                type="button"
                                                key={note.id}
                                                onClick={() => void markOneAsRead(note.id)}
                                                className={`w-full border-b border-stone-100 p-5 text-left transition-colors hover:bg-stone-50 ${
                                                    note.urgent ? 'bg-amber-50/40' : ''
                                                } ${!note.read ? 'bg-emerald-50/20' : ''}`}
                                            >
                                                <div className="mb-2 flex items-start justify-between gap-3">
                                                    <div className="min-w-0">
                                                        <div className="flex items-center gap-2">
                                                            {!note.read ? (
                                                                <span className="h-2 w-2 shrink-0 rounded-full bg-emerald-500" />
                                                            ) : null}
                                                            <h3
                                                                className={`truncate text-sm font-black ${
                                                                    note.urgent
                                                                        ? 'text-amber-800'
                                                                        : 'text-stone-900'
                                                                }`}
                                                            >
                                                                {language === 'en'
                                                                    ? note.title.en
                                                                    : note.title.am}
                                                            </h3>
                                                        </div>
                                                        <p className="mt-1 text-xs leading-relaxed text-stone-600">
                                                            {language === 'en'
                                                                ? note.desc.en
                                                                : note.desc.am}
                                                        </p>
                                                    </div>

                                                    <div className="shrink-0 text-[10px] font-bold tracking-wider text-stone-400 uppercase">
                                                        <span className="inline-flex items-center gap-1">
                                                            <Clock className="h-3 w-3" />
                                                            {formatTime(note.time)}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    {note.urgent ? (
                                                        <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-[10px] font-black tracking-wider text-amber-700 uppercase">
                                                            {t.filters.urgent}
                                                        </span>
                                                    ) : (
                                                        <span className="rounded-full border border-stone-200 bg-stone-50 px-3 py-1 text-[10px] font-black tracking-wider text-stone-600 uppercase">
                                                            {t.activity.system}
                                                        </span>
                                                    )}
                                                    {!note.read ? (
                                                        <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[10px] font-black tracking-wider text-emerald-700 uppercase">
                                                            {t.filters.unread}
                                                        </span>
                                                    ) : null}
                                                </div>
                                            </button>
                                        ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="rounded-2xl border border-stone-200 bg-white shadow-sm lg:col-span-5">
                        <div className="border-b border-stone-100 p-5">
                            <h2 className="flex items-center text-sm font-black text-stone-900">
                                <Calendar className="mr-2 h-4 w-4 text-emerald-600" />
                                {t.recentActivities}
                            </h2>
                        </div>

                        {activities.length === 0 && activitiesBootstrapped ? (
                            <div className="p-10 text-center">
                                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-stone-100">
                                    <Calendar className="h-6 w-6 text-stone-500" />
                                </div>
                                <div className="text-sm font-black text-stone-800">
                                    {t.empty.activities.title}
                                </div>
                                <div className="mt-1 text-xs text-stone-500">
                                    {t.empty.activities.desc}
                                </div>
                            </div>
                        ) : (
                            <div
                                ref={activitiesContainerRef}
                                onScroll={maybeLoadMoreActivities}
                                className="max-h-[520px] overflow-y-auto p-5"
                            >
                                <div className="space-y-4">
                                    {activities.map((act) => {
                                        const meta =
                                            activityMeta[act.type] ??
                                            ({
                                                icon: Calendar,
                                                className:
                                                    'border-stone-200 bg-stone-50 text-stone-700',
                                            } satisfies {
                                                icon: typeof Bell;
                                                className: string;
                                            });
                                        const Icon = meta.icon;

                                        return (
                                            <div
                                                key={act.id}
                                                className="relative overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm"
                                            >
                                                <div className="p-5">
                                                    <div className="flex items-start justify-between gap-3">
                                                        <div className="flex items-start gap-3">
                                                            <div
                                                                className={`flex h-11 w-11 items-center justify-center rounded-2xl border ${meta.className}`}
                                                            >
                                                                <Icon className="h-5 w-5" />
                                                            </div>
                                                            <div className="min-w-0">
                                                                <div className="text-sm font-black text-stone-900">
                                                                    {language === 'en'
                                                                        ? act.title.en
                                                                        : act.title.am}
                                                                </div>
                                                                <div className="mt-1 text-xs text-stone-600">
                                                                    {language === 'en'
                                                                        ? act.desc.en
                                                                        : act.desc.am}
                                                                </div>

                                                                <div className="mt-3 flex flex-wrap items-center gap-2">
                                                                    <span className="inline-flex items-center gap-1 rounded-full bg-stone-100 px-3 py-1 text-[10px] font-black tracking-wider text-stone-600 uppercase">
                                                                        <Clock className="h-3 w-3" />
                                                                        {formatTime(new Date(act.time))}
                                                                    </span>
                                                                    {typeof act.cycle === 'number' ? (
                                                                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-black tracking-wider text-emerald-700 uppercase">
                                                                            {t.meta.cycle} {act.cycle}
                                                                        </span>
                                                                    ) : null}
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {act.link ? (
                                                            <a
                                                                href={act.link}
                                                                target="_blank"
                                                                rel="noreferrer"
                                                                className="inline-flex items-center gap-1 rounded-2xl border border-stone-200 bg-stone-50 px-3 py-2 text-xs font-black text-stone-700 hover:bg-stone-100"
                                                            >
                                                                {t.activity.view}
                                                                <ExternalLink className="h-4 w-4" />
                                                            </a>
                                                        ) : null}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {activitiesLoading ? (
                                    <div className="py-4 text-center text-xs font-bold text-stone-500">
                                        Loading...
                                    </div>
                                ) : null}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
