import { Head, router } from '@inertiajs/react';
import {
    Bell,
    Link as LinkIcon,
    Send,
    Search,
    Trash2,
    AlertTriangle,
    History,
    FileText,
    Globe,
    Calendar,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import AppSettingsController from '@/actions/App/Http/Controllers/AppSettingsController';
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
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { notifications as adminNotifications } from '@/routes/admin';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Notification',
        href: adminNotifications().url,
    },
];

interface Notification {
    id: number;
    title_en: string;
    message_en: string;
    is_urgent: boolean;
    link?: string;
    created_at: string; 
}

type NotificationRow = Notification & {
    read: boolean;
};

type ComposeFormData = {
    title_en: string;
    title_am: string;
    message_en: string;
    message_am: string;
    link: string;
    is_urgent: boolean;
};

interface PageProps {
    notifications: Notification[];
    status?: string;
}

export default function Notifications({ notifications }: PageProps) {
    const serverNotifications = notifications ?? [];

    const [sNotification, setsNotification] = useState<NotificationRow[]>(
        () => serverNotifications.map((n) => ({ ...n, read: false })),
    );
    const [activeTab, setActiveTab] = useState<'history' | 'compose'>('history');
    const [historyFilter, setHistoryFilter] = useState<'ALL' | 'UNREAD' | 'URGENT'>('ALL');
    const [searchTerm, setSearchTerm] = useState('');
    const [processing, setProcessing] = useState(false);

    const [data, setData] = useState<ComposeFormData>({
        title_en: '',
        title_am: '',
        message_en: '',
        message_am: '',
        link: '',
        is_urgent: false,
    });

    const reset = () => {
        setData({
            title_en: '',
            title_am: '',
            message_en: '',
            message_am: '',
            link: '',
            is_urgent: false,
        });
    };

    const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
    const [selectedNotification, setSelectedNotification] = useState<NotificationRow | null>(null);

    const stats = useMemo(() => {
        const urgent = sNotification.filter((n) => n.is_urgent).length;
        const unread = sNotification.filter((n) => !n.read).length;

        return {
            total: sNotification.length,
            urgent,
            unread,
        };
    }, [sNotification]);

    const notificationData = useMemo(() => {
        const normalized = searchTerm.trim().toLowerCase();

        return sNotification
            .filter((n) => {
                if (historyFilter === 'ALL') {
                    return true;
                }

                if (historyFilter === 'UNREAD') {
                    return !n.read;
                }

                return n.is_urgent;
            })
            .filter((n) => {
                if (!normalized) {
                    return true;
                }

                return (
                    n.title_en.toLowerCase().includes(normalized) ||
                    n.message_en.toLowerCase().includes(normalized) ||
                    String(n.id).includes(normalized)
                );
            });
    }, [sNotification, historyFilter, searchTerm]);

    const toggleRead = (notification: NotificationRow) => {
        setsNotification((prev) =>
            prev.map((n) => (n.id === notification.id ? { ...n, read: !n.read } : n)),
        );
    };

    const openDelete = (notification: NotificationRow) => {
        setSelectedNotification(notification);
        setConfirmDeleteOpen(true);
    };

    const applyDelete = () => {
        if (!selectedNotification) {
            return;
        }

        setsNotification((prev) => prev.filter((n) => n.id !== selectedNotification.id));
        setConfirmDeleteOpen(false);
        setSelectedNotification(null);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!data.title_en.trim() || !data.message_en.trim()) {
            return;
        }

        setProcessing(true);

        router.post(
            AppSettingsController.notificationsStore.url(),
            {
                title_en: data.title_en.trim(),
                title_am: data.title_am.trim(),
                message_en: data.message_en.trim(),
                message_am: data.message_am.trim(),
                link: data.link.trim(),
                is_urgent: data.is_urgent,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    reset();
                    setActiveTab('history');
                },
                onFinish: () => {
                    setProcessing(false);
                },
            },
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Notification Management" />

            <div className="w-full mx-auto p-4 md:p-6 lg:p-8 space-y-8">
                
                {/* Header Section */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center justify-between">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">Notification Center</h1>
                        <p className="text-muted-foreground text-sm md:text-base">
                            Manage system broadcasts and view transmission history.
                        </p>
                    </div>

                    <div className="grid grid-cols-3 gap-2 sm:flex sm:gap-3">
                        <div className="rounded-xl border border-border/40 bg-card px-4 py-3 shadow-sm">
                            <div className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">Total</div>
                            <div className="mt-1 text-xl font-black text-foreground">{stats.total}</div>
                        </div>
                        <div className="rounded-xl border border-border/40 bg-card px-4 py-3 shadow-sm">
                            <div className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">Unread</div>
                            <div className="mt-1 text-xl font-black text-foreground">{stats.unread}</div>
                        </div>
                        <div className="rounded-xl border border-border/40 bg-card px-4 py-3 shadow-sm">
                            <div className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">Urgent</div>
                            <div className="mt-1 text-xl font-black text-foreground">{stats.urgent}</div>
                        </div>
                    </div>
                </div>

                <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as typeof activeTab)} className="space-y-6">
                    {/* Modern Tabs Styling */}
                    <div className="flex items-center justify-between">
                        <TabsList className="bg-muted/60 p-1 h-11 border border-border/40 rounded-lg">
                            <TabsTrigger 
                                value="history" 
                                className="px-4 md:px-6 rounded-md gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-primary"
                            >
                                <History className="h-4 w-4" /> History
                            </TabsTrigger>
                            <TabsTrigger 
                                value="compose" 
                                className="px-4 md:px-6 rounded-md gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-primary"
                            >
                                <Send className="h-4 w-4" /> Compose
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    {/* HISTORY TAB */}
                    <TabsContent value="history" className="space-y-4 animate-in fade-in-50 duration-300">
                        <div className="flex items-center justify-between gap-4 bg-card p-1 rounded-lg">
                            <div className="relative flex-1 max-w-md">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input 
                                    placeholder="Search by title..." 
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-9 bg-background border-muted-foreground/20 focus-visible:ring-offset-0" 
                                />
                            </div>

                            <Tabs value={historyFilter} onValueChange={(value) => setHistoryFilter(value as typeof historyFilter)}>
                                <TabsList className="bg-muted/60 p-1 h-11 border border-border/40 rounded-lg">
                                    <TabsTrigger value="ALL" className="px-3 rounded-md">All</TabsTrigger>
                                    <TabsTrigger value="UNREAD" className="px-3 rounded-md">Unread</TabsTrigger>
                                    <TabsTrigger value="URGENT" className="px-3 rounded-md">Urgent</TabsTrigger>
                                </TabsList>
                            </Tabs>
                        </div>

                        {/* <Card className="border-border/60 shadow-sm overflow-hidden">
                            <div className="relative w-full overflow-auto">
                                <Table>
                                    <TableHeader className="bg-muted/30">
                                        <TableRow className="hover:bg-transparent">
                                            <TableHead className="w-[300px]">Notification Detail</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Date Sent</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {notificationData.length > 0 ? (
                                            notificationData.map((item) => (
                                                <TableRow key={item.id} className="group hover:bg-muted/30 transition-colors">
                                                    <TableCell>
                                                        <div className="flex flex-col gap-1">
                                                            <span className="font-semibold text-foreground">{item.title_en}</span>
                                                            <span className="text-xs text-muted-foreground line-clamp-1">{item.message_en}</span>
                                                            {item.link ? (
                                                                <a href={item.link} target="_blank" className="text-xs text-blue-600 hover:underline flex items-center gap-1 w-fit">
                                                                    <LinkIcon className="h-3 w-3" /> {item.link}
                                                                </a>
                                                            ) : (
                                                                <span className="text-xs text-muted-foreground">No attachment link</span>
                                                            )}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex flex-col gap-2">
                                                            {item.is_urgent ? (
                                                                <Badge variant="destructive" className="gap-1 pl-1.5 pr-2.5 shadow-sm">
                                                                    <AlertCircle className="h-3 w-3" /> Urgent
                                                                </Badge>
                                                            ) : (
                                                                <Badge variant="outline" className="gap-1 pl-1.5 pr-2.5 text-muted-foreground bg-background/50">
                                                                    <Bell className="h-3 w-3" /> Standard
                                                                </Badge>
                                                            )}

                                                            <Badge variant={item.read ? 'secondary' : 'outline'} className="gap-1 pl-1.5 pr-2.5 w-fit">
                                                                {item.read ? <CheckCircle className="h-3 w-3" /> : <Circle className="h-3 w-3" />}
                                                                {item.read ? 'Read' : 'Unread'}
                                                            </Badge>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                            <Calendar className="h-3.5 w-3.5" />
                                                            {item.created_at}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                                                    <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end">
                                                                <DropdownMenuItem
                                                                    className="cursor-pointer"
                                                                    onClick={() => toggleRead(item)}
                                                                >
                                                                    {item.read ? (
                                                                        <Circle className="mr-2 h-4 w-4" />
                                                                    ) : (
                                                                        <CheckCircle className="mr-2 h-4 w-4" />
                                                                    )}
                                                                    {item.read ? 'Mark as unread' : 'Mark as read'}
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem className="text-destructive focus:text-destructive cursor-pointer">
                                                                    <button
                                                                        type="button"
                                                                        className="flex w-full items-center"
                                                                        onClick={() => openDelete(item)}
                                                                    >
                                                                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                                                                    </button>
                                                                </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={4} className="h-48 text-center">
                                                    <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                                                        <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                                                            <Bell className="h-5 w-5" />
                                                        </div>
                                                        <p>No notifications found.</p>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </Card> */}

                        <div className="grid grid-cols-1 gap-4">
                            {notificationData.map((item) => (
                                <Card key={`card-${item.id}`} className="border-border/60 shadow-sm">
                                    <CardHeader className="space-y-1">
                                        <div className="flex items-start justify-between gap-3">
                                            <div>
                                                <CardTitle className="text-base">{item.title_en}</CardTitle>
                                                <CardDescription className="text-xs line-clamp-2">{item.message_en}</CardDescription>
                                            </div>
                                            <div className="flex flex-col items-end gap-2">
                                                {item.is_urgent ? (
                                                    <Badge variant="destructive">Urgent</Badge>
                                                ) : (
                                                    <Badge variant="outline">Standard</Badge>
                                                )}
                                                <Badge variant={item.read ? 'secondary' : 'outline'}>
                                                    {item.read ? 'Read' : 'Unread'}
                                                </Badge>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Calendar className="h-4 w-4" />
                                            {item.created_at}
                                        </div>
                                        {item.link ? (
                                            <a href={item.link} target="_blank" className="text-xs text-blue-600 hover:underline flex items-center gap-1 w-fit">
                                                <LinkIcon className="h-3 w-3" /> {item.link}
                                            </a>
                                        ) : null}
                                    </CardContent>
                                    <CardFooter className="grid grid-cols-2 gap-2">
                                        <Button variant="secondary" onClick={() => toggleRead(item)}>
                                            {item.read ? 'Mark unread' : 'Mark read'}
                                        </Button>
                                        <Button variant="destructive" onClick={() => openDelete(item)}>
                                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                                        </Button>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>

                    {/* COMPOSE TAB */}
                    <TabsContent value="compose" className="animate-in slide-in-from-bottom-2 duration-300">
                        <form onSubmit={handleSubmit} className="mx-auto">
                            <Card className="border-2 border-primary/5 shadow-md">
                                <CardHeader className="bg-muted/10 pb-6 border-b">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <CardTitle className="text-xl flex items-center gap-2">
                                                <Bell className="h-5 w-5 text-primary" />
                                                Create System Broadcast
                                            </CardTitle>
                                            <CardDescription className="mt-1.5">
                                                Compose a message to be sent to all active users.
                                            </CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-6 md:p-8 space-y-8">
                                    
                                    {/* Content Section */}
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                                        {/* English Column */}
                                        <div className="space-y-5">
                                            <div className="flex items-center gap-2 pb-2 border-b">
                                                <Globe className="h-4 w-4 text-blue-500" />
                                                <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">English Content</h3>
                                            </div>
                                            
                                            <div className="space-y-2">
                                                <Label htmlFor="title_en">Notification Title</Label>
                                                <Input 
                                                    id="title_en" 
                                                    placeholder="e.g., System Maintenance" 
                                                    value={data.title_en}
                                                    onChange={(e) => setData((prev) => ({ ...prev, title_en: e.target.value }))}
                                                    className="bg-background"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="msg_en">Message Body</Label>
                                                <Textarea 
                                                    id="msg_en" 
                                                    placeholder="Enter the detailed message..." 
                                                    className="min-h-[140px] resize-y bg-background"
                                                    value={data.message_en}
                                                    onChange={(e) => setData((prev) => ({ ...prev, message_en: e.target.value }))}
                                                />
                                            </div>
                                        </div>

                                        {/* Amharic Column */}
                                        <div className="space-y-5">
                                            <div className="flex items-center gap-2 pb-2 border-b">
                                                <Globe className="h-4 w-4 text-green-600" />
                                                <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Amharic Content</h3>
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="title_am">Notification Title (Amharic)</Label>
                                                <Input 
                                                    id="title_am" 
                                                    placeholder="ለምሳሌ፦ የስርዓት ጥገና" 
                                                    value={data.title_am}
                                                    onChange={(e) => setData((prev) => ({ ...prev, title_am: e.target.value }))}
                                                    className="bg-background"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="msg_am">Message Body (Amharic)</Label>
                                                <Textarea 
                                                    id="msg_am" 
                                                    placeholder="ዝርዝር መልእክቱን እዚህ ያስገቡ..." 
                                                    className="min-h-[140px] resize-y bg-background"
                                                    value={data.message_am}
                                                    onChange={(e) => setData((prev) => ({ ...prev, message_am: e.target.value }))}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Settings Section */}
                                    <div className="bg-muted/20 p-4 md:p-6 rounded-xl border border-border/50 space-y-6">
                                        <div className="flex items-center gap-2 mb-2">
                                            <FileText className="h-4 w-4 text-primary" />
                                            <h3 className="font-semibold text-sm text-foreground">Configuration</h3>
                                        </div>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                                            <div className="space-y-2">
                                                <Label htmlFor="link">Action Link (Optional)</Label>
                                                <div className="relative">
                                                    <LinkIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                                    <Input 
                                                        id="link" 
                                                        placeholder="https://" 
                                                        className="pl-9 bg-background"
                                                        value={data.link}
                                                        onChange={(e) => setData((prev) => ({ ...prev, link: e.target.value }))}
                                                    />
                                                </div>
                                                <p className="text-[0.8rem] text-muted-foreground">
                                                    Users will be redirected here when they click the notification.
                                                </p>
                                            </div>

                                            <div className={`flex items-center justify-between rounded-lg border p-4 transition-all duration-300 ${data.is_urgent ? 'bg-destructive/5 border-destructive/30' : 'bg-background border-border'}`}>
                                                <div className="space-y-0.5">
                                                    <Label htmlFor="urgent-mode" className="text-base font-medium flex items-center gap-2">
                                                        Urgent Broadcast
                                                        {data.is_urgent && <AlertTriangle className="h-4 w-4 text-destructive animate-pulse" />}
                                                    </Label>
                                                    <p className="text-[0.8rem] text-muted-foreground">
                                                        Highlights the notification in red and pins it to top.
                                                    </p>
                                                </div>
                                                <Switch 
                                                    id="urgent-mode"
                                                    checked={data.is_urgent}
                                                    onCheckedChange={(checked) => setData((prev) => ({ ...prev, is_urgent: checked }))}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t bg-muted/10 p-6">
                                    <Button variant="ghost" type="button" onClick={() => reset()} className="w-full sm:w-auto text-muted-foreground hover:text-foreground">
                                        Reset Fields
                                    </Button>
                                    <Button disabled={processing} className="w-full sm:w-auto gap-2 shadow-md">
                                        <Send className="h-4 w-4" />
                                        {processing ? 'Broadcasting...' : 'Send Broadcast'}
                                    </Button>
                                </CardFooter>
                            </Card>
                        </form>
                    </TabsContent>
                </Tabs>

                <Dialog open={confirmDeleteOpen} onOpenChange={(open) => !open && setConfirmDeleteOpen(false)}>
                    <DialogContent className="sm:max-w-lg">
                        <DialogHeader>
                            <DialogTitle>Delete notification</DialogTitle>
                            <DialogDescription>
                                {selectedNotification ? `${selectedNotification.title_en} (#${selectedNotification.id})` : ''}
                            </DialogDescription>
                        </DialogHeader>

                        <div className="rounded-xl border border-border/60 bg-muted/20 p-4 text-sm text-foreground">
                            This will remove the notification from the demo history.
                        </div>

                        <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={() => {
                                    setConfirmDeleteOpen(false);
                                    setSelectedNotification(null);
                                }}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="button"
                                variant="destructive"
                                onClick={applyDelete}
                                disabled={!selectedNotification}
                            >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}