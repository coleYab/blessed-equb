import { Head, usePage } from '@inertiajs/react';
import { Calendar, Plus, Save, Ticket, Trophy,  X } from 'lucide-react';
import { useState } from 'react';
import { ADMIN_TRANSLATIONS, PRIZE_IMAGES } from '@/constants';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import type {  AppSettings } from '@/types/app';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Cycle Management',
        href: '/admin/settings',
    },
];

const ETHIOPIAN_MONTHS = [
    { val: 1, name: 'Meskerem (Sep-Oct)' },
    { val: 2, name: 'Tikimt (Oct-Nov)' },
    { val: 3, name: 'Hidar (Nov-Dec)' },
    { val: 4, name: 'Tahsas (Dec-Jan)' },
    { val: 5, name: 'Tir (Jan-Feb)' },
    { val: 6, name: 'Yekatit (Feb-Mar)' },
    { val: 7, name: 'Megabit (Mar-Apr)' },
    { val: 8, name: 'Miyazia (Apr-May)' },
    { val: 9, name: 'Ginbot (May-Jun)' },
    { val: 10, name: 'Sene (Jun-Jul)' },
    { val: 11, name: 'Hamle (Jul-Aug)' },
    { val: 12, name: 'Nehase (Aug-Sep)' },
    { val: 13, name: 'Pagume (Sep)' },
];

interface Ticket {
    id: number;
    ticketNumber: number;
    userId: number | null;
    paymentId: number | null;
    status: 'AVAILABLE' | 'RESERVED' | 'SOLD';
    reservedAt: Date;
}

interface PageProps {
    tickets: Ticket[];
}

export default function Competition({ tickets } : PageProps) {
    const settings = usePage().props.settings as AppSettings;
    // eslint-disable-next-line react-hooks/immutability
    settings.prizeImages = PRIZE_IMAGES;
    const [localSettings, setLocalSettings] =
    useState<AppSettings>(settings);
    const [compSubTab, setCompSubTab] =
    useState<'settings' | 'tickets'>('settings');
    const [ticketSearch, setTicketSearch] = useState('');
    const [newImageUrl, setNewImageUrl] = useState('');

    const [ethDate, setEthDate] = useState({
        year: new Date().getFullYear(),
        month: 1,
        day: 1,
    });

    const showAlert = (
        title: string,
        message: string,
    ) => {
        alert(`${title}\n\n${message}`);
    };

    const handleEthDateChange = (
        field: 'year' | 'month' | 'day',
        value: number,
    ) => {
        const updated = { ...ethDate, [field]: value };
        setEthDate(updated);

        const monthName = ETHIOPIAN_MONTHS.find((m) => m.val === updated.month)?.name || '';

        const englishDate = `${monthName.split(' ')[0]} ${updated.day}, ${updated.year}`;

        const amharicDate = `${updated.year}/${updated.month}/${updated.day}`;

        setLocalSettings((prev) => ({
            ...prev,
            nextDrawDateEn: englishDate,
            nextDrawDateAm: amharicDate,
        }));
    };

    const handleRemoveImage = (index: number) => {
        setLocalSettings((prev) => ({
            ...prev,
            prizeImages: prev.prizeImages.filter((_, i) => i !== index),
        }));
    };


    const t = ADMIN_TRANSLATIONS['en']
    const handleExportTickets = () => {
        const headers = 'Ticket ID,Lucky Number,User ID,Cycle\n';
        const rows = tickets.map((t)=>`${t.id},${t.ticketNumber},"${t.userId}",${1}`).join('\n');
        const csvContent = 'data:text/csv;charset=utf-8,' + headers + rows;
        const encodedUri = encodeURI(csvContent);

        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute(
            'download',
            `lucky_numbers_cycle_${settings.cycle}.csv`,
        );

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        showAlert(
            'Export Successful',
            'CSV exported successfully.',
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Cycle Management" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="animate-fade-in-up space-y-6">
                    <div className="mb-6 flex flex-col items-end justify-between md:flex-row md:items-center">
                        <h1 className="mb-4 text-2xl font-bold text-stone-800 md:mb-0">
                            {t.competition.title}
                        </h1>
                        <div className="flex rounded-xl border border-stone-200 bg-white p-1 shadow-sm">
                            <button
                                onClick={() => setCompSubTab('settings')}
                                className={`rounded-lg px-4 py-2 text-sm font-bold transition-all ${ compSubTab === 'settings' ? 'bg-stone-800 text-white shadow-md' : 'text-stone-500 hover:bg-stone-50' }`}
                            >
                                {t.competition.general}
                            </button>
                            <button
                                onClick={() => setCompSubTab('tickets')}
                                className={`flex items-center rounded-lg px-4 py-2 text-sm font-bold transition-all ${ compSubTab === 'tickets' ? 'bg-emerald-600 text-white shadow-md' : 'text-stone-500 hover:bg-stone-50' }`}
                            >
                                <Ticket className="mr-2 h-4 w-4" />{' '}
                                {t.competition.tickets}
                            </button>
                        </div>
                    </div>

                    {compSubTab === 'settings' && (
                        <div className="animate-fade-in-down space-y-6">
                            {/* ... Draw Schedule ... */}
                            <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
                                <h2 className="mb-6 flex items-center border-b border-stone-100 pb-2 text-lg font-bold text-stone-800">
                                    <Calendar className="mr-2 h-5 w-5 text-emerald-600" />{' '}
                                    {t.competition.drawSchedule}
                                </h2>
                                <div className="grid gap-8 md:grid-cols-2">
                                    <div className="space-y-4">
                                        <label className="block text-sm font-bold text-stone-700">
                                            {t.competition.setNextDraw}
                                        </label>
                                        <div className="flex space-x-2">
                                            <select
                                                value={ethDate.month}
                                                onChange={(e) =>
                                                    handleEthDateChange(
                                                        'month',
                                                        parseInt(
                                                            e.target.value,
                                                        ),
                                                    )
                                                }
                                                className="flex-1 rounded-lg border border-stone-300 p-2"
                                            >
                                                {ETHIOPIAN_MONTHS.map((m) => (
                                                    <option
                                                        key={m.val}
                                                        value={m.val}
                                                    >
                                                        {m.name}
                                                    </option>
                                                ))}
                                            </select>
                                            <select
                                                value={ethDate.day}
                                                onChange={(e) =>
                                                    handleEthDateChange(
                                                        'day',
                                                        parseInt(
                                                            e.target.value,
                                                        ),
                                                    )
                                                }
                                                className="w-20 rounded-lg border border-stone-300 p-2"
                                            >
                                                {[...Array(30)].map((_, i) => (
                                                    <option
                                                        key={i + 1}
                                                        value={i + 1}
                                                    >
                                                        {i + 1}
                                                    </option>
                                                ))}
                                            </select>
                                            <input
                                                type="number"
                                                value={ethDate.year}
                                                onChange={(e) =>
                                                    handleEthDateChange(
                                                        'year',
                                                        parseInt(
                                                            e.target.value,
                                                        ),
                                                    )
                                                }
                                                className="w-24 rounded-lg border border-stone-300 p-2"
                                            />
                                        </div>
                                    </div>
                                    <div className="rounded-lg border border-stone-200 bg-stone-50 p-4">
                                        <h3 className="mb-2 text-sm font-bold text-stone-500 uppercase">
                                            {t.competition.preview}
                                        </h3>
                                        <div className="space-y-2">
                                            <div className="flex justify-between">
                                                <span className="text-stone-600">
                                                    English:
                                                </span>
                                                <span className="font-bold text-stone-800">
                                                    {
                                                        localSettings.nextDrawDateEn
                                                    }
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-stone-600">
                                                    Amharic:
                                                </span>
                                                <span className="font-bold text-stone-800">
                                                    {
                                                        localSettings.nextDrawDateAm
                                                    }
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-6 flex justify-end border-t border-stone-100 pt-4">
                                    <button
                                        onClick={() => {}
                                            // handleSaveSection('Draw Schedule')
                                        }
                                        className="flex items-center rounded-lg bg-emerald-900 px-4 py-2 font-bold text-white shadow transition-colors hover:bg-emerald-800"
                                    >
                                        <Save className="mr-2 h-4 w-4" />{' '}
                                        {t.competition.save}
                                    </button>
                                </div>
                            </div>

                            <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
                                <h2 className="mb-6 flex items-center border-b border-stone-100 pb-2 text-lg font-bold text-stone-800">
                                    <Trophy className="mr-2 h-5 w-5 text-amber-500" />{' '}
                                    {t.competition.currentPrize}
                                </h2>
                                <div className="grid gap-6 md:grid-cols-2">
                                    <div className="space-y-4">
                                        <div>
                                            <label className="mb-1 block text-sm font-bold text-stone-700">
                                                {t.competition.prizeName}
                                            </label>
                                            <input
                                                type="text"
                                                value={localSettings.prizeName}
                                                onChange={(e) => {}}
                                                className="w-full rounded-lg border border-stone-300 p-2"
                                            />
                                        </div>
                                        <div>
                                            <label className="mb-1 block text-sm font-bold text-stone-700">
                                                {t.competition.prizeValue}
                                            </label>
                                            <input
                                                type="text"
                                                value={localSettings.prizeValue}
                                                onChange={(e) =>
                                                    setLocalSettings(
                                                        (prev) => ({
                                                            ...prev,
                                                            prizeValue:
                                                            e.target.value,
                                                        }),
                                                    )
                                                }
                                                className="w-full rounded-lg border border-stone-300 p-2"
                                            />
                                        </div>
                                        {/* Image Inputs */}
                                        <div>
                                            <label className="mb-1 block text-sm font-bold text-stone-700">
                                                {t.competition.prizeImages}
                                            </label>
                                            <div className="mb-2 flex gap-2">
                                                <input
                                                    type="text"
                                                    value={newImageUrl}
                                                    onChange={(e) => {}}
                                                    placeholder="Image URL"
                                                    className="flex-1 rounded-lg border border-stone-300 p-2 text-sm"
                                                />
                                                <button
                                                    className="rounded-lg bg-stone-800 px-4 text-white"
                                                >
                                                    <Plus className="h-4 w-4" />
                                                </button>
                                            </div>
                                            <div className="flex gap-2 overflow-x-auto pb-2">
                                                {(
                                                    localSettings.prizeImages ||
                                                        []
                                                ).map((url, i) => (
                                                        <div
                                                            key={i}
                                                            className="relative h-12 w-12 flex-shrink-0"
                                                        >
                                                            <img
                                                                src={url}
                                                                className="h-full w-full rounded object-cover"
                                                            />
                                                            <button
                                                                onClick={() =>
                                                                    handleRemoveImage(
                                                                        i,
                                                                    )
                                                                }
                                                                className="absolute -top-1 -right-1 rounded-full bg-red-500 p-0.5 text-white"
                                                            >
                                                                <X className="h-3 w-3" />
                                                            </button>
                                                        </div>
                                                    ))}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex h-full flex-col">
                                        <label className="mb-1 block text-sm font-bold text-stone-700">
                                            {t.competition.preview}
                                        </label>
                                        <div className="relative min-h-[150px] flex-grow overflow-hidden rounded-lg border border-stone-200 bg-stone-100">
                                            <img
                                                src={
                                                    localSettings.prizeImages &&
                                                        localSettings.prizeImages
                                                            .length > 0
                                                        ? localSettings
                                                        .prizeImages[0]
                                                        : ''
                                                }
                                                className="absolute inset-0 h-full w-full object-cover"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-6 flex justify-end border-t border-stone-100 pt-4">
                                    <button
                                        onClick={() => {}
                                            // handleSaveSection('Current Prize')
                                        }
                                        className="flex items-center rounded-lg bg-emerald-900 px-4 py-2 font-bold text-white shadow transition-colors hover:bg-emerald-800"
                                    >
                                        <Save className="mr-2 h-4 w-4" />{' '}
                                        {t.competition.save}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                    {compSubTab === 'tickets' && (
                        <div className="animate-fade-in-down space-y-6">
                            {/* Table Actions */}
                            <div className="flex flex-col items-center justify-between gap-4 rounded-xl border border-stone-200 bg-white p-4 shadow-sm sm:flex-row">
                                <div className="relative flex-grow md:w-64">
                                    <input
                                        type="text"
                                        placeholder="Search by name or ticket number..."
                                        value={ticketSearch}
                                        onChange={(e) =>
                                            setTicketSearch(e.target.value)
                                        }
                                        className="w-full rounded-lg border border-stone-300 py-2 pr-4 pl-4"
                                    />
                                </div>
                                <button
                                    onClick={handleExportTickets}
                                    className="rounded-lg bg-emerald-100 px-4 py-2 font-bold text-emerald-800 transition-colors hover:bg-emerald-200"
                                >
                                    Export CSV
                                </button>
                            </div>

                            <div className="overflow-hidden rounded-xl border border-stone-200 bg-white shadow-sm">
                                <div className="max-h-[600px] overflow-y-auto">
                                    <table className="w-full text-left whitespace-nowrap">
                                        <thead className="sticky top-0 z-10 bg-stone-50 text-xs text-stone-500 uppercase shadow-sm">
                                            <tr>
                                                <th className="px-6 py-3">
                                                    {t.users.ticket}
                                                </th>
                                                <th className="px-6 py-3">
                                                    {t.dashboard.user}
                                                </th>
                                                <th className="px-6 py-3">
                                                    {t.users.status}
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-stone-100">
                                            {tickets.length > 0 ? (
                                                tickets.map((t) => (
                                                    <tr key={t.id}>
                                                        <td className="px-6 py-4 font-mono font-bold">
                                                            #{t.ticketNumber}
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            {t.userId || 10}
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <span
                                                                className={`rounded px-2 py-1 text-xs font-bold ${ t.status === 'AVAILABLE' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800' }`} >
                                                                {t.status}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                    <tr>
                                                        <td
                                                            colSpan={3}
                                                            className="px-6 py-8 text-center text-stone-500"
                                                        >
                                                            No verified tickets
                                                            found in this cycle.
                                                        </td>
                                                    </tr>
                                                )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
