import { Head } from '@inertiajs/react';
import {
    Ban,
    CheckCircle,
    Clock,
    Edit,
    Plus,
    Search,
    Trash2,
    UserX,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ADMIN_TRANSLATIONS } from '@/constants';
import AppLayout from '@/layouts/app-layout';
import { settings as appSettings } from '@/routes/admin';
import type { BreadcrumbItem } from '@/types';
import type { AdminUser as User } from '@/types/app';
import type { Language } from '@/types/app';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Users',
        href: appSettings().url,
    },
];

type UserRow = User & {
    banned: boolean;
};

interface PageProps {
    users: UserRow[];
}

export default function Users({
    users
}: PageProps) {
    const language: Language = 'en';
    const t = ADMIN_TRANSLATIONS[language];

    const demoUsers: UserRow[] = useMemo(() => {
        return [
            {
                id: 1,
                name: 'Rahul Sharma',
                phone: '+251 911 000 001',
                status: 'VERIFIED',
                contribution: 5000,
                prizeNumber: 12,
                joinedDate: '2026-02-01',
                banned: false,
            },
            {
                id: 2,
                name: 'Sara Tadesse',
                phone: '+251 911 000 002',
                status: 'VERIFIED',
                contribution: 5000,
                joinedDate: '2026-02-03',
                banned: false,
            },
            {
                id: 3,
                name: 'Dawit Mekonnen',
                phone: '+251 911 000 003',
                status: 'VERIFIED',
                contribution: 10000,
                prizeNumber: 7,
                joinedDate: '2026-02-06',
                banned: true,
            },
            {
                id: 4,
                name: 'Hana Tesfaye',
                phone: '+251 911 000 004',
                status: 'VERIFIED',
                contribution: 25000,
                joinedDate: '2026-02-08',
                banned: false,
            },
        ];
    }, []);

    const [tab, setTab] = useState<'ALL' | 'VERIFIED' | 'PENDING' | 'BANNED'>('ALL');
    const [searchTerm, setSearchTerm] = useState('');

    const [userDialogOpen, setUserDialogOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<Partial<UserRow>>({
        status: 'PENDING',
        contribution: 0,
        banned: false,
    });

    const [confirmOpen, setConfirmOpen] = useState(false);
    const [confirmType, setConfirmType] = useState<'DELETE' | 'BAN' | 'UNBAN'>('BAN');
    const [selectedUser, setSelectedUser] = useState<UserRow | null>(null);

    const filteredUsers = useMemo(() => {
        const normalized = searchTerm.trim().toLowerCase();

        return users
            .filter((u) => {
                if (tab === 'ALL') {
                    return true;
                }

                if (tab === 'BANNED') {
                    return u.banned;
                }

                return u.status === tab;
            })
            .filter((u) => {
                if (!normalized) {
                    return true;
                }

                return (
                    u.name.toLowerCase().includes(normalized) ||
                    u.phone.toLowerCase().includes(normalized) ||
                    String(u.id ?? '').toLowerCase().includes(normalized)
                );
            })
            .sort((a, b) => {
                const aDate = new Date(a.joinedDate ?? 0).getTime();
                const bDate = new Date(b.joinedDate ?? 0).getTime();
                return bDate - aDate;
            });
    }, [users, tab, searchTerm]);

    const stats = useMemo(() => {
        return {
            total: users.length,
            verified: users.filter((u) => u.status === 'VERIFIED' && !u.banned).length,
            pending: users.filter((u) => u.status === 'PENDING' && !u.banned).length,
            banned: users.filter((u) => u.banned).length,
        };
    }, [users]);

    const openAddUser = () => {
        setEditingUser({
            name: '',
            phone: '',
            status: 'PENDING',
            contribution: 0,
            prizeNumber: undefined,
            joinedDate: new Date().toISOString().slice(0, 10),
            banned: false,
        });
        setUserDialogOpen(true);
    };

    const openEditUser = (user: UserRow) => {
        setEditingUser({ ...user });
        setUserDialogOpen(true);
    };

    const saveUser = (e: React.FormEvent) => {
        e.preventDefault();

        if (!editingUser.name || !editingUser.phone) {
            return;
        }

        setUsers((prev) => {
            if (editingUser.id) {
                return prev.map((u) => {
                    if (u.id !== editingUser.id) {
                        return u;
                    }

                    return {
                        ...u,
                        name: editingUser.name ?? u.name,
                        phone: editingUser.phone ?? u.phone,
                        status: (editingUser.status as UserRow['status']) ?? u.status,
                        contribution: editingUser.contribution ?? u.contribution,
                        prizeNumber: editingUser.prizeNumber,
                        joinedDate: editingUser.joinedDate ?? u.joinedDate,
                    };
                });
            }

            const maxId = prev.reduce((acc, u) => {
                const id = typeof u.id === 'number' ? u.id : 0;
                return Math.max(acc, id);
            }, 0);

            const newUser: UserRow = {
                id: maxId + 1,
                name: editingUser.name,
                phone: editingUser.phone,
                status: (editingUser.status as UserRow['status']) ?? 'PENDING',
                contribution: editingUser.contribution ?? 0,
                prizeNumber: editingUser.prizeNumber,
                joinedDate: editingUser.joinedDate ?? new Date().toISOString().slice(0, 10),
                banned: false,
            };

            return [newUser, ...prev];
        });

        setUserDialogOpen(false);
    };

    const openConfirm = (type: 'DELETE' | 'BAN' | 'UNBAN', user: UserRow) => {
        setConfirmType(type);
        setSelectedUser(user);
        setConfirmOpen(true);
    };

    const applyConfirmAction = () => {
        if (!selectedUser) {
            return;
        }

        setConfirmOpen(false);
        setSelectedUser(null);
    };

    const statusBadge = (user: UserRow) => {
        if (user.banned) {
            return <Badge variant="destructive">BANNED</Badge>;
        }

        if (user.status === 'VERIFIED') {
            return <Badge className="bg-emerald-600">VERIFIED</Badge>;
        }

        return <Badge variant="outline">PENDING</Badge>;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Users" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="animate-fade-in-up space-y-6">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-stone-800">{t.users.title}</h1>
                            <p className="text-sm text-stone-500">This page is running in demo mode.</p>
                        </div>

                        <div className="grid grid-cols-4 gap-2 sm:flex sm:gap-3">
                            <div className="rounded-xl border border-stone-200 bg-white px-4 py-3 shadow-sm">
                                <div className="text-[10px] font-bold tracking-wider text-stone-500 uppercase">Total</div>
                                <div className="mt-1 text-xl font-black text-stone-900">{stats.total}</div>
                            </div>
                            <div className="rounded-xl border border-stone-200 bg-white px-4 py-3 shadow-sm">
                                <div className="text-[10px] font-bold tracking-wider text-stone-500 uppercase">Verified</div>
                                <div className="mt-1 text-xl font-black text-stone-900">{stats.verified}</div>
                            </div>
                            <div className="rounded-xl border border-stone-200 bg-white px-4 py-3 shadow-sm">
                                <div className="text-[10px] font-bold tracking-wider text-stone-500 uppercase">Pending</div>
                                <div className="mt-1 text-xl font-black text-stone-900">{stats.pending}</div>
                            </div>
                            <div className="rounded-xl border border-stone-200 bg-white px-4 py-3 shadow-sm">
                                <div className="text-[10px] font-bold tracking-wider text-stone-500 uppercase">Banned</div>
                                <div className="mt-1 text-xl font-black text-stone-900">{stats.banned}</div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <Tabs value={tab} onValueChange={(value) => setTab(value as typeof tab)} className="w-full space-y-3">
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                <TabsList className="h-11 w-full justify-start rounded-xl border border-stone-200 bg-white p-1 sm:w-auto">
                                    <TabsTrigger value="ALL" className="rounded-lg">All</TabsTrigger>
                                    <TabsTrigger value="VERIFIED" className="rounded-lg">{t.users.verified}</TabsTrigger>
                                    <TabsTrigger value="PENDING" className="rounded-lg">{t.users.verified}</TabsTrigger>
                                    <TabsTrigger value="BANNED" className="rounded-lg">Banned</TabsTrigger>
                                </TabsList>

                                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
                                    <div className="relative w-full sm:w-80">
                                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
                                        <Input
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            placeholder={t.users.search}
                                            className="h-11 rounded-xl border-stone-200 bg-white pl-9"
                                        />
                                    </div>

                                    <Button className="h-11 rounded-xl" onClick={openAddUser}>
                                        <Plus className="mr-2 h-4 w-4" />
                                        {t.users.addNew}
                                    </Button>
                                </div>
                            </div>

                            <TabsContent value={tab} className="space-y-4">
                                {filteredUsers.length === 0 ? (
                                    <div className="rounded-2xl border border-stone-200 bg-white p-12 text-center shadow-sm">
                                        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-stone-50">
                                            <Search className="h-7 w-7 text-stone-300" />
                                        </div>
                                        <h3 className="text-lg font-bold text-stone-900">No users found</h3>
                                        <p className="mt-2 text-sm text-stone-500">Try adjusting your search or filters.</p>
                                        <Button
                                            variant="secondary"
                                            className="mt-4 rounded-xl"
                                            onClick={() => setSearchTerm('')}
                                        >
                                            Clear search
                                        </Button>
                                    </div>
                                ) : (
                                    <>
                                        <div className="hidden overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm md:block">
                                            <Table>
                                                <TableHeader className="bg-stone-50">
                                                    <TableRow>
                                                        <TableHead className="px-4 py-3">{t.dashboard.user}</TableHead>
                                                        <TableHead className="px-4 py-3">{t.users.phone}</TableHead>
                                                        <TableHead className="px-4 py-3">{t.users.status}</TableHead>
                                                        <TableHead className="px-4 py-3">{t.users.contrib}</TableHead>
                                                        <TableHead className="px-4 py-3">{t.users.ticket}</TableHead>
                                                        <TableHead className="px-4 py-3 text-right">{t.users.actions}</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {filteredUsers.map((user) => (
                                                        <TableRow key={String(user.id)}>
                                                            <TableCell className="px-4 py-3">
                                                                <div className="font-semibold text-stone-900">{user.name}</div>
                                                                <div className="text-xs text-stone-400">Joined: {user.joinedDate ?? 'N/A'}</div>
                                                            </TableCell>
                                                            <TableCell className="px-4 py-3 font-mono text-sm text-stone-600">{user.phone}</TableCell>
                                                            <TableCell className="px-4 py-3">
                                                                <div className="flex items-center gap-2">
                                                                    {statusBadge(user)}
                                                                    {!user.banned ? (
                                                                        user.status === 'VERIFIED' ? (
                                                                            <CheckCircle className="h-4 w-4 text-emerald-500" />
                                                                        ) : (
                                                                            <Clock className="h-4 w-4 text-amber-500" />
                                                                        )
                                                                    ) : (
                                                                        <UserX className="h-4 w-4 text-red-500" />
                                                                    )}
                                                                </div>
                                                            </TableCell>
                                                            <TableCell className="px-4 py-3 font-bold text-stone-700">{user.contribution.toLocaleString()} ETB</TableCell>
                                                            <TableCell className="px-4 py-3">
                                                                {user.prizeNumber ? (
                                                                    <span className="inline-flex rounded-lg border border-stone-200 bg-stone-50 px-2 py-1 text-xs font-bold text-stone-700">
                                                                        #{user.prizeNumber}
                                                                    </span>
                                                                ) : (
                                                                    <span className="text-xs text-stone-400">-</span>
                                                                )}
                                                            </TableCell>
                                                            <TableCell className="px-4 py-3 text-right">
                                                                <div className="flex items-center justify-end gap-2">


                                                                    <Button
                                                                        variant="destructive"
                                                                        className="rounded-xl"
                                                                        onClick={() => openConfirm('DELETE', user)}
                                                                    >
                                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                                        Delete
                                                                    </Button>
                                                                </div>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>

                                            <div className="flex items-center justify-between border-t border-stone-200 bg-stone-50 px-6 py-3 text-xs font-medium text-stone-500">
                                                <span>
                                                    {t.users.showing} {filteredUsers.length} users
                                                </span>
                                                <span>
                                                    {t.users.total}: {users.length}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 gap-4 md:hidden">
                                            {filteredUsers.map((user) => (
                                                <Card key={String(user.id)} className="overflow-hidden border-stone-200 shadow-sm">
                                                    <CardHeader className="space-y-1 bg-stone-50/60">
                                                        <div className="flex items-start justify-between gap-3">
                                                            <div>
                                                                <CardTitle className="text-base text-stone-900">{user.name}</CardTitle>
                                                                <CardDescription className="text-xs">{user.phone}</CardDescription>
                                                                <div className="mt-1 text-[11px] text-stone-400">Joined: {user.joinedDate ?? 'N/A'}</div>
                                                            </div>
                                                            {statusBadge(user)}
                                                        </div>
                                                    </CardHeader>
                                                    <CardContent className="space-y-3 p-4">
                                                        <div className="flex items-center justify-between">
                                                            <div className="text-xs font-bold tracking-wider text-stone-500 uppercase">Contribution</div>
                                                            <div className="text-sm font-black text-stone-900">{user.contribution.toLocaleString()} ETB</div>
                                                        </div>

                                                        <div className="flex items-center justify-between">
                                                            <div className="text-xs font-bold tracking-wider text-stone-500 uppercase">Ticket</div>
                                                            <div className="text-sm font-black text-stone-900">{user.prizeNumber ? `#${user.prizeNumber}` : '-'}</div>
                                                        </div>
                                                    </CardContent>
                                                    <CardFooter className="flex flex-col gap-2 border-t bg-white p-4">
                                                        <Button
                                                            variant="outline"
                                                            className="w-full rounded-xl"
                                                            onClick={() => openEditUser(user)}
                                                        >
                                                            <Edit className="mr-2 h-4 w-4" />
                                                            Edit user
                                                        </Button>

                                                        {user.banned ? (
                                                            <Button
                                                                variant="secondary"
                                                                className="w-full rounded-xl"
                                                                onClick={() => openConfirm('UNBAN', user)}
                                                            >
                                                                Unban user
                                                            </Button>
                                                        ) : (
                                                            <Button
                                                                variant="destructive"
                                                                className="w-full rounded-xl"
                                                                onClick={() => openConfirm('BAN', user)}
                                                            >
                                                                <Ban className="mr-2 h-4 w-4" />
                                                                Ban user
                                                            </Button>
                                                        )}

                                                        <Button
                                                            variant="destructive"
                                                            className="w-full rounded-xl"
                                                            onClick={() => openConfirm('DELETE', user)}
                                                        >
                                                            <Trash2 className="mr-2 h-4 w-4" />
                                                            Delete user
                                                        </Button>
                                                    </CardFooter>
                                                </Card>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </TabsContent>
                        </Tabs>
                    </div>

                    <Dialog open={userDialogOpen} onOpenChange={(open) => !open && setUserDialogOpen(false)}>
                        <DialogContent className="sm:max-w-lg">
                            <DialogHeader>
                                <DialogTitle>
                                    {editingUser.id ? 'Edit user' : t.users.addNew}
                                </DialogTitle>
                                <DialogDescription>
                                    Update details in demo mode. No backend integration.
                                </DialogDescription>
                            </DialogHeader>

                            <form onSubmit={saveUser} className="space-y-4">
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div className="space-y-2 sm:col-span-2">
                                        <Label htmlFor="user-name">Full name</Label>
                                        <Input
                                            id="user-name"
                                            value={editingUser.name ?? ''}
                                            onChange={(e) => setEditingUser((prev) => ({ ...prev, name: e.target.value }))}
                                            className="rounded-xl"
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="user-phone">{t.users.phone}</Label>
                                        <Input
                                            id="user-phone"
                                            value={editingUser.phone ?? ''}
                                            onChange={(e) => setEditingUser((prev) => ({ ...prev, phone: e.target.value }))}
                                            className="rounded-xl"
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="user-status">{t.users.status}</Label>
                                        <select
                                            id="user-status"
                                            value={(editingUser.status as UserRow['status']) ?? 'PENDING'}
                                            onChange={(e) => setEditingUser((prev) => ({ ...prev, status: e.target.value as UserRow['status'] }))}
                                            className="h-11 w-full rounded-xl border border-stone-200 bg-white px-3 text-sm font-medium shadow-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                                        >
                                            <option value="PENDING">{t.users.pending}</option>
                                            <option value="VERIFIED">{t.users.verified}</option>
                                        </select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="user-contribution">Total contribution (ETB)</Label>
                                        <Input
                                            id="user-contribution"
                                            type="number"
                                            value={editingUser.contribution ?? 0}
                                            onChange={(e) =>
                                                setEditingUser((prev) => ({
                                                    ...prev,
                                                    contribution: Number.parseInt(e.target.value || '0', 10) || 0,
                                                }))
                                            }
                                            className="rounded-xl"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="user-ticket">Ticket number (optional)</Label>
                                        <Input
                                            id="user-ticket"
                                            type="number"
                                            value={editingUser.prizeNumber ?? ''}
                                            onChange={(e) =>
                                                setEditingUser((prev) => ({
                                                    ...prev,
                                                    prizeNumber: e.target.value ? Number.parseInt(e.target.value, 10) : undefined,
                                                }))
                                            }
                                            className="rounded-xl"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="user-joined">Joined date</Label>
                                        <Input
                                            id="user-joined"
                                            type="date"
                                            value={editingUser.joinedDate ?? ''}
                                            onChange={(e) => setEditingUser((prev) => ({ ...prev, joinedDate: e.target.value }))}
                                            className="rounded-xl"
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        className="rounded-xl"
                                        onClick={() => setUserDialogOpen(false)}
                                    >
                                        Cancel
                                    </Button>
                                    <Button type="submit" className="rounded-xl bg-emerald-600 text-white hover:bg-emerald-500">
                                        Save
                                    </Button>
                                </div>
                            </form>
                        </DialogContent>
                    </Dialog>

                    <Dialog open={confirmOpen} onOpenChange={(open) => !open && setConfirmOpen(false)}>
                        <DialogContent className="sm:max-w-lg">
                            <DialogHeader>
                                <DialogTitle>
                                    {confirmType === 'DELETE'
                                        ? 'Delete user'
                                        : confirmType === 'BAN'
                                            ? 'Ban user'
                                            : 'Unban user'}
                                </DialogTitle>
                                <DialogDescription>
                                    {selectedUser
                                        ? `${selectedUser.name} (${selectedUser.phone})`
                                        : ''}
                                </DialogDescription>
                            </DialogHeader>

                            <div className="rounded-xl border border-stone-200 bg-stone-50 p-4 text-sm text-stone-700">
                                {confirmType === 'DELETE'
                                    ? 'This will remove the user from the database.'
                                    : confirmType === 'BAN'
                                        ? 'Banned users are marked as BANNED and can be filtered. (Demo only)'
                                        : 'This will remove the banned flag from the user. (Demo only)'}
                            </div>

                            <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                                <Button
                                    type="button"
                                    variant="secondary"
                                    className="rounded-xl"
                                    onClick={() => {
                                        setConfirmOpen(false);
                                        setSelectedUser(null);
                                    }}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="button"
                                    variant={confirmType === 'UNBAN' ? 'default' : 'destructive'}
                                    className={confirmType === 'UNBAN' ? 'rounded-xl' : 'rounded-xl'}
                                    onClick={applyConfirmAction}
                                    disabled={!selectedUser}
                                >
                                    {confirmType === 'DELETE'
                                        ? 'Delete'
                                        : confirmType === 'BAN'
                                            ? 'Ban'
                                            : 'Unban'}
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
        </AppLayout>
    );
}
