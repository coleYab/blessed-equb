import { Link, usePage } from '@inertiajs/react';
import { Banknote, Bell, DollarSign, Gift, LayoutGrid, Settings, Ticket, Trophy, Users, UsersRoundIcon } from 'lucide-react';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useLanguage } from '@/hooks/use-language';
import { dashboard } from '@/routes';
import { mypayments } from '@/routes';
import { settings as adminSettings, notifications as adminNotifications, payments as adminPayments, prize as adminPrize, users, dashboard as adminDashboard, cycle } from '@/routes/admin';
import { mytickets, mycycle, mynotifications, mywinnings } from '@/routes/user';
import type { NavItem } from '@/types';
import AppLogo from './app-logo';

const mainNavLabels = {
    en: {
        dashboard: 'Dashboard',
        myTickets: 'My Tickets',
        myPayments: 'My Payments',
        pastCycles: 'Past Cycles',
        myWinnings: 'My Winnings',
        notifications: 'Notifications',
    },
    am: {
        dashboard: 'ዳሽቦርድ',
        myTickets: 'ቲኬቴ',
        myPayments: 'ክፍያዎቼ',
        pastCycles: 'ያለፉ ዙሮች',
        myWinnings: 'የእኔ አሸናፊነቶች',
        notifications: 'ማሳወቂያዎች',
    },
} as const;

const adminNavLabels = {
    en: {
        adminDashboard: 'Admin Dashboard',
        cycleManagement: 'Cycle Management',
        prizeManagement: 'Prize Management',
        userManagement: 'User Management',
        validatePayments: 'Validate Payments',
        adminNotifications: 'Admin Notifications',
        appSettings: 'App Settings',
    },
    am: {
        adminDashboard: 'የአስተዳዳሪ ዳሽቦርድ',
        cycleManagement: 'የዙር አስተዳደር',
        prizeManagement: 'የሽልማት አስተዳደር',
        userManagement: 'የተጠቃሚ አስተዳደር',
        validatePayments: 'ክፍያ ማረጋገጫ',
        adminNotifications: 'የአስተዳዳሪ ማሳወቂያዎች',
        appSettings: 'የመተግበሪያ ቅንብሮች',
    },
} as const;

export function AppSidebar() {
    const { language } = useLanguage();
    const labels = mainNavLabels[language];
    const adminLabels = adminNavLabels[language];

    const mainNavItems: NavItem[] = [
        {
            title: labels.dashboard,
            href: dashboard(),
            icon: LayoutGrid,
        },
        {
            title: labels.myTickets,
            href: mytickets(),
            icon: Ticket,
        },
        {
            title: labels.myPayments,
            href: mypayments(),
            icon: Banknote,
        },
        {
            title: labels.pastCycles,
            href: mycycle(),
            icon: UsersRoundIcon,
        },
        {
            title: labels.myWinnings,
            href: mywinnings(),
            icon: Trophy,
        },
        {
            title: labels.notifications,
            href: mynotifications(),
            icon: Bell,
        },
    ];

    const footerNavItems: NavItem[] = [
        {
            title: adminLabels.adminDashboard,
            href: adminDashboard(),
            icon: LayoutGrid,
        },
        {
            title: adminLabels.cycleManagement,
            href: cycle(),
            icon: Trophy,
        },
        {
            title: adminLabels.prizeManagement,
            href: adminPrize(),
            icon: Gift,
        },
        {
            title: adminLabels.userManagement,
            href: users(),
            icon: Users,
        },
        {
            title: adminLabels.validatePayments,
            href: adminPayments(),
            icon: DollarSign,
        },
        {
            title: adminLabels.adminNotifications,
            href: adminNotifications(),
            icon: Bell,
        },
        {
            title: adminLabels.appSettings,
            href: adminSettings(),
            icon: Settings,
        },
    ];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                {(usePage().props.auth.user.is_admin) ?
                    <NavFooter items={footerNavItems} className="mt-auto" />
                    : null
                }
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
