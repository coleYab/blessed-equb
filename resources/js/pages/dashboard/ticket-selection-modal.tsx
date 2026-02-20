import { Ticket, X, ArrowRight } from 'lucide-react';

type TicketBoardItem = { number: number; taken: boolean };

export default function TicketSelectionModal({
    isOpen,
    tickets,
    selectedTicket,
    onSelectTicket,
    onClose,
    onConfirm,
    formatTicket,
    title,
    subtitle,
    instruction,
    myTicketLabel,
    confirmLabel,
}: {
    isOpen: boolean;
    tickets: TicketBoardItem[];
    selectedTicket: number | null;
    onSelectTicket: (ticketNumber: number) => void;
    onClose: () => void;
    onConfirm: () => void;
    formatTicket: (num: number) => string;
    title: string;
    subtitle: string;
    instruction: string;
    myTicketLabel: string;
    confirmLabel: string;
}) {
    if (!isOpen) {
        return null;
    }

    return (
        <div className="animate-fade-in-down fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
            <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">
                <div className="flex items-center justify-between border-b border-stone-100 bg-emerald-900 p-6 text-white">
                    <div>
                        <h3 className="flex items-center text-xl font-bold">
                            <Ticket className="mr-2 h-5 w-5" />
                            {title}
                        </h3>
                        <p className="mt-1 text-xs text-emerald-200">{subtitle}</p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-emerald-200 transition-colors hover:text-white"
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <div className="p-6">
                    <p className="mb-4 text-sm text-stone-500">{instruction}</p>
                    <div className="mb-6 grid max-h-80 grid-cols-5 gap-3 overflow-y-auto p-2 sm:grid-cols-6">
                        {tickets.map((ticket) => (
                            <button
                                type="button"
                                key={ticket.number}
                                disabled={ticket.taken}
                                onClick={() => onSelectTicket(ticket.number)}
                                className={`flex aspect-square items-center justify-center rounded-xl text-2xl font-black shadow-sm transition-all ${
                                    ticket.taken
                                        ? 'cursor-not-allowed bg-stone-100 text-stone-300 opacity-50'
                                        : selectedTicket === ticket.number
                                          ? 'scale-110 bg-amber-500 text-white shadow-xl ring-4 ring-amber-200'
                                          : 'bg-emerald-50 text-emerald-800 hover:scale-105 hover:bg-emerald-600 hover:text-white active:scale-95'
                                } `}
                            >
                                {formatTicket(ticket.number)}
                            </button>
                        ))}
                    </div>

                    <div className="mb-6 flex items-center justify-between rounded-2xl border border-emerald-100 bg-emerald-50 p-5">
                        <span className="font-bold text-emerald-900">{myTicketLabel}:</span>
                        <span className="text-5xl font-black tracking-tighter text-emerald-700">
                            {selectedTicket ? `#${formatTicket(selectedTicket)}` : '-'}
                        </span>
                    </div>

                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={!selectedTicket}
                        className="flex w-full items-center justify-center rounded-xl bg-emerald-900 py-4 text-lg font-bold text-white shadow-xl transition-all hover:bg-emerald-800 active:scale-95 disabled:cursor-not-allowed disabled:bg-stone-300"
                    >
                        {confirmLabel}
                        <ArrowRight className="ml-2 h-5 w-5" />
                    </button>
                </div>
            </div>
        </div>
    );
}
