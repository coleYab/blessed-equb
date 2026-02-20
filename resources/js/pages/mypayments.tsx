import { Head, usePage } from '@inertiajs/react';
import { Banknote, CheckCircle, Clock, XCircle } from 'lucide-react';
import { useMemo } from 'react';
import type { ReactElement } from 'react';
import AppLayout from '@/layouts/app-layout';
import { mypayments } from '@/routes';
import type { BreadcrumbItem } from '@/types';
import type { AppSettings, PaymentRequest } from '@/types/app';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'MyPayments',
        href: mypayments().url,
    },
];

const TRANSLATIONS = {
    en: {
        pageTitle: 'My Payments',
        subtitle: 'Review your payment history for the current cycle',
        cycle: 'Cycle',
        currentCycle: 'Current cycle',
        summary: {
            total: 'Total',
            approved: 'Approved',
            pending: 'Pending',
            rejected: 'Rejected',
        },
        table: {
            date: 'Date',
            amount: 'Amount',
            status: 'Status',
            receipt: 'Receipt',
        },
        receipt: {
            view: 'View',
            missing: '—',
        },
        empty: {
            title: 'No payments in this cycle',
            desc: 'Try selecting another cycle.',
        },
    },
    am: {
        pageTitle: 'የእኔ ክፍያዎች',
        subtitle: 'የክፍያ ታሪክዎን በዙር ይመልከቱ',
        cycle: 'ዙር',
        currentCycle: 'የአሁኑ ዙር',
        summary: {
            total: 'ጠቅላላ',
            approved: 'የተፈቀደ',
            pending: 'በመጠባበቅ ላይ',
            rejected: 'ውድቅ',
        },
        table: {
            date: 'ቀን',
            amount: 'መጠን',
            status: 'ሁኔታ',
            receipt: 'ደረሰኝ',
        },
        receipt: {
            view: 'አሳይ',
            missing: '—',
        },
        empty: {
            title: 'በዚህ ዙር ምንም ክፍያ የለም',
            desc: 'ሌላ ዙር ይምረጡ።',
        },
    },
} as const;

type Language = keyof typeof TRANSLATIONS;

const statusStyles: Record<PaymentRequest['status'], { className: string; icon: ReactElement }> = {
    APPROVED: {
        className: 'border-emerald-200 bg-emerald-50 text-emerald-700',
        icon: <CheckCircle className="h-4 w-4" />,
    },
    PENDING: {
        className: 'border-amber-200 bg-amber-50 text-amber-700',
        icon: <Clock className="h-4 w-4" />,
    },
    REJECTED: {
        className: 'border-red-200 bg-red-50 text-red-700',
        icon: <XCircle className="h-4 w-4" />,
    },
};

interface PageProps {
    payments: PaymentRequest[]
}

export default function MyPayments({ payments } : PageProps) {
    const DEFAULT_SETTINGS = usePage().props.settings as AppSettings;
    const language: Language = 'en';
    const t = TRANSLATIONS[language];
    const paymentsForCycle = payments;

    const counts = useMemo(() => {
        const base = {
            total: paymentsForCycle.length,
            APPROVED: 0,
            PENDING: 0,
            REJECTED: 0,
        };

        for (const payment of paymentsForCycle) {
            base[payment.status] += 1;
        }

        return base;
    }, [paymentsForCycle]);

    const totalAmount = useMemo(() => {
        return paymentsForCycle.reduce((sum, p) => sum + p.amount, 0);
    }, [paymentsForCycle]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t.pageTitle} />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-emerald-900">{t.pageTitle}</h1>
                            <p className="mt-1 text-sm text-stone-500">{t.subtitle}</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3 md:grid-cols-5 md:gap-6">
                    <div className="rounded-xl border border-stone-200 bg-white p-4 shadow-sm">
                        <div className="text-[10px] font-bold tracking-wider text-stone-400 uppercase">
                            {t.summary.total}
                        </div>
                        <div className="mt-2 text-2xl font-black text-stone-800">
                            {counts.total}
                        </div>
                    </div>

                    <div className="rounded-xl border border-emerald-200 bg-emerald-50/40 p-4 shadow-sm">
                        <div className="text-[10px] font-bold tracking-wider text-emerald-700 uppercase">
                            {t.summary.approved}
                        </div>
                        <div className="mt-2 text-2xl font-black text-emerald-800">
                            {counts.APPROVED}
                        </div>
                    </div>

                    <div className="rounded-xl border border-amber-200 bg-amber-50/40 p-4 shadow-sm">
                        <div className="text-[10px] font-bold tracking-wider text-amber-700 uppercase">
                            {t.summary.pending}
                        </div>
                        <div className="mt-2 text-2xl font-black text-amber-800">
                            {counts.PENDING}
                        </div>
                    </div>

                    <div className="rounded-xl border border-red-200 bg-red-50/40 p-4 shadow-sm">
                        <div className="text-[10px] font-bold tracking-wider text-red-700 uppercase">
                            {t.summary.rejected}
                        </div>
                        <div className="mt-2 text-2xl font-black text-red-800">
                            {counts.REJECTED}
                        </div>
                    </div>

                    <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4 shadow-sm">
                        <div className="text-[10px] font-bold tracking-wider text-emerald-700 uppercase">
                            {t.table.amount}
                        </div>
                        <div className="mt-2 text-2xl font-black text-emerald-900">
                            {totalAmount.toLocaleString()}
                            <span className="ml-1 text-xs font-bold text-emerald-700">ETB</span>
                        </div>
                    </div>
                </div>

                <div className="rounded-2xl border border-stone-200 bg-white shadow-sm">
                    <div className="border-b border-stone-100 p-5">
                        <div className="flex items-center justify-between">
                            <h2 className="flex items-center text-sm font-bold text-stone-800">
                                <Banknote className="mr-2 h-4 w-4 text-emerald-600" />
                                {t.pageTitle}
                            </h2>
                            <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-bold text-stone-600">
                                {t.cycle} {DEFAULT_SETTINGS.cycle}
                            </span>
                        </div>
                    </div>

                    {paymentsForCycle.length === 0 ? (
                        <div className="p-10 text-center">
                            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-stone-100">
                                <Banknote className="h-6 w-6 text-stone-500" />
                            </div>
                            <div className="text-sm font-bold text-stone-800">{t.empty.title}</div>
                            <div className="mt-1 text-xs text-stone-500">{t.empty.desc}</div>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full">
                                <thead>
                                    <tr className="bg-stone-50 text-left">
                                        <th className="px-5 py-3 text-xs font-bold tracking-wider text-stone-500 uppercase">
                                            {t.table.date}
                                        </th>
                                        <th className="px-5 py-3 text-xs font-bold tracking-wider text-stone-500 uppercase">
                                            {t.table.amount}
                                        </th>
                                        <th className="px-5 py-3 text-xs font-bold tracking-wider text-stone-500 uppercase">
                                            {t.table.status}
                                        </th>
                                        <th className="px-5 py-3 text-xs font-bold tracking-wider text-stone-500 uppercase">
                                            {t.table.receipt}
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paymentsForCycle.map((payment) => {
                                        const meta = statusStyles[payment.status];
                                        return (
                                            <tr key={payment.id} className="border-t border-stone-100">
                                                <td className="px-5 py-4 text-sm text-stone-700">
                                                    <span className="font-mono text-xs text-stone-600">
                                                        {payment.date}
                                                    </span>
                                                </td>
                                                <td className="px-5 py-4">
                                                    <span className="inline-flex items-center rounded-lg bg-emerald-50 px-2.5 py-1 text-sm font-black text-emerald-800">
                                                        {payment.amount.toLocaleString()} ETB
                                                    </span>
                                                </td>
                                                <td className="px-5 py-4">
                                                    <span
                                                        className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold ${meta.className}`}
                                                    >
                                                        {meta.icon}
                                                        {payment.status}
                                                    </span>
                                                </td>
                                                <td className="px-5 py-4">
                                                    {payment.receiptUrl ? (
                                                        <a
                                                            href={payment.receiptUrl}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="rounded-full bg-stone-100 px-3 py-1 text-xs font-bold text-stone-700 transition-colors hover:bg-stone-200"
                                                        >
                                                            {t.receipt.view}
                                                        </a>
                                                    ) : (
                                                        <span className="text-xs text-stone-400">
                                                            {t.receipt.missing}
                                                        </span>
                                                    )}
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
