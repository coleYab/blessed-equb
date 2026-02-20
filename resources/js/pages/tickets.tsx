import { Head, usePage } from '@inertiajs/react';
import { CheckCircle, Clock, Ticket as TicketIcon, XCircle, AlertCircle } from 'lucide-react';
import { useMemo } from 'react';
import type { ReactElement } from 'react';
import AppLayout from '@/layouts/app-layout';
import { mytickets } from '@/routes/user';
import type { BreadcrumbItem } from '@/types';
import type { AppSettings, Language } from '@/types/app';

// 1. Unified Status Types to match your backend/props
type TicketStatus = 'AVAILABLE' | 'PENDING' | 'RESERVED' | 'VOID';

interface Ticket {
    id: number;
    ticketNumber: string | number;
    status: TicketStatus;
    reservedAt: string; // Dates usually come as strings over the wire in Inertia
    paymentId?: number | null;
}

interface PageProps {
    tickets: Ticket[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Tickets',
        href: mytickets().url,
    },
];

const TRANSLATIONS = {
    en: {
        pageTitle: 'Tickets',
        subtitle: 'View your tickets for the current cycle',
        cycle: 'Cycle',
        allTickets: 'All',
        activeTickets: 'Active',
        pendingTickets: 'Pending',
        reservedTickets: 'Reserved',
        voidTickets: 'Void',
        table: {
            ticketNumber: 'Ticket #',
            status: 'Status',
            assignedDate: 'Assigned',
            assignedBy: 'Method',
        },
        empty: {
            title: 'No tickets found',
            desc: 'You don’t have any tickets assigned for this period.',
        },
    },
    am: {
        pageTitle: 'ቲኬቶች',
        subtitle: 'ቲኬቶችዎን በዙር ይመልከቱ',
        cycle: 'ዙር',
        allTickets: 'ሁሉም',
        activeTickets: 'ንቁ',
        pendingTickets: 'በመጠባበቅ ላይ',
        reservedTickets: 'የተያዘ',
        voidTickets: 'የተሰረዘ',
        table: {
            ticketNumber: 'ቲኬት #',
            status: 'ሁኔታ',
            assignedDate: 'የተሰጠበት ቀን',
            assignedBy: 'መንገድ',
        },
        empty: {
            title: 'በዚህ ዙር ምንም ቲኬት የለም',
            desc: 'ምንም አይነት ቲኬት አልተገኘም::',
        },
    },
} as const;

const statusStyles: Record<TicketStatus, { label: string; className: string; icon: ReactElement }> = {
    AVAILABLE: {
        label: 'AVAILABLE',
        className: 'border-emerald-200 bg-emerald-50 text-emerald-700',
        icon: <CheckCircle className="h-4 w-4" />,
    },
    PENDING: {
        label: 'PENDING',
        className: 'border-amber-200 bg-amber-50 text-amber-700',
        icon: <Clock className="h-4 w-4" />,
    },
    RESERVED: {
        label: 'RESERVED',
        className: 'border-blue-200 bg-blue-50 text-blue-700',
        icon: <TicketIcon className="h-4 w-4" />,
    },
    VOID: {
        label: 'VOID',
        className: 'border-stone-200 bg-stone-50 text-stone-600',
        icon: <XCircle className="h-4 w-4" />,
    },
};

export default function Tickets({ tickets }: PageProps) {
    // Accessing shared settings from Inertia
    const settings  = usePage().props.settings as AppSettings;
    const language: Language = 'en';
    const t = TRANSLATIONS[language];

    console.log(tickets);


    // Calculate counts dynamically from props
    const counts = useMemo(() => {
        return tickets.reduce(
            (acc, ticket) => {
                acc.all++;
                if (acc[ticket.status] !== undefined) {
                    acc[ticket.status]++;
                }
                return acc;
            },
            { all: 0, AVAILABLE: 0, PENDING: 0, RESERVED: 0, VOID: 0 }
        );
    }, [tickets]);


    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t.pageTitle} />
            
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                {/* Header Section */}
                <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-emerald-900">{t.pageTitle}</h1>
                            <p className="mt-1 text-sm text-stone-500">{t.subtitle}</p>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-3 md:grid-cols-5 md:gap-4">
                    <StatCard label={t.allTickets} count={counts.all} color="stone" />
                    <StatCard label={t.activeTickets} count={counts.AVAILABLE} color="emerald" />
                    <StatCard label={t.pendingTickets} count={counts.PENDING} color="amber" />
                    <StatCard label={t.reservedTickets} count={counts.RESERVED} color="blue" />
                    <StatCard label={t.voidTickets} count={counts.VOID} color="stone" />
                </div>

                {/* Table Section */}
                <div className="rounded-2xl border border-stone-200 bg-white shadow-sm overflow-hidden">
                    <div className="border-b border-stone-100 p-5">
                        <div className="flex items-center justify-between">
                            <h2 className="flex items-center text-sm font-bold text-stone-800">
                                <TicketIcon className="mr-2 h-4 w-4 text-emerald-600" />
                                {t.pageTitle}
                            </h2>
                            <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-bold text-stone-600">
                                {t.cycle} {settings?.cycle || 'N/A'}
                            </span>
                        </div>
                    </div>

                    {tickets.length === 0 ? (
                        <div className="p-16 text-center">
                            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-stone-50">
                                <AlertCircle className="h-6 w-6 text-stone-300" />
                            </div>
                            <div className="text-sm font-bold text-stone-800">{t.empty.title}</div>
                            <div className="mt-1 text-xs text-stone-50">{t.empty.desc}</div>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full">
                                <thead>
                                    <tr className="bg-stone-50/50 text-left">
                                        <th className="px-6 py-4 text-xs font-bold tracking-wider text-stone-500 uppercase">{t.table.ticketNumber}</th>
                                        <th className="px-6 py-4 text-xs font-bold tracking-wider text-stone-500 uppercase">{t.table.status}</th>
                                        <th className="px-6 py-4 text-xs font-bold tracking-wider text-stone-500 uppercase">{t.table.assignedDate}</th>
                                        <th className="px-6 py-4 text-xs font-bold tracking-wider text-stone-500 uppercase hidden md:table-cell">{t.table.assignedBy}</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-stone-100">
                                    {tickets.map((ticket) => {
                                        const meta = statusStyles[ticket.status] || statusStyles.VOID;
                                        return (
                                            <tr key={ticket.id} className="hover:bg-stone-50/30 transition-colors">
                                                <td className="px-6 py-4">
                                                    <span className="inline-flex items-center rounded-lg bg-emerald-50 px-2.5 py-1 text-sm font-black text-emerald-800">
                                                        #{ticket.ticketNumber}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold ${meta.className}`}>
                                                        {meta.icon}
                                                        {meta.label}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="font-mono text-xs text-stone-600">
                                                        {new Date(ticket.reservedAt).toLocaleDateString()}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 hidden md:table-cell">
                                                    <span className="rounded-full bg-stone-100 px-2.5 py-1 text-[10px] font-bold text-stone-600 uppercase">
                                                        {ticket.paymentId ? 'PURCHASED' : 'SYSTEM ASSIGNED'}
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}

// Helper component for the stats to keep things clean
function StatCard({ label, count, color }: { label: string; count: number; color: 'emerald' | 'amber' | 'blue' | 'stone' }) {
    const variants = {
        emerald: 'border-emerald-200 bg-emerald-50/40 text-emerald-700',
        amber: 'border-amber-200 bg-amber-50/40 text-amber-700',
        blue: 'border-blue-200 bg-blue-50/40 text-blue-700',
        stone: 'border-stone-200 bg-white text-stone-500',
    };

    return (
        <div className={`rounded-xl border p-4 shadow-sm ${variants[color]}`}>
            <div className="text-[10px] font-bold tracking-wider uppercase opacity-80">
                {label}
            </div>
            <div className={`mt-2 text-2xl font-black ${color === 'stone' ? 'text-stone-800' : ''}`}>
                {count}
            </div>
        </div>
    );
}