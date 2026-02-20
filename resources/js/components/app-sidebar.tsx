import { Link } from '@inertiajs/react';
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
import { dashboard } from '@/routes';
import { mypayments } from '@/routes';
import { settings as adminSettings, notifications as adminNotifications, payments as adminPayments, prize as adminPrize, users, dashboard as adminDashboard, cycle } from '@/routes/admin';
import { mytickets, mycycle, mynotifications, mywinnings } from '@/routes/user';
import type { NavItem } from '@/types';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'My Tickets',
        href: mytickets(),
        icon: Ticket,
    },
    {
        title: 'My Payments',
        href: mypayments(),
        icon: Banknote,
    },
    {
        title: 'Past Cycles',
        href: mycycle(),
        icon: UsersRoundIcon,
    },
    {
        title: 'My Winnings',
        href: mywinnings(),
        icon: Trophy,
    },
    {
        title: 'Notifications',
        href: mynotifications(),
        icon: Bell,
    }
];

const footerNavItems: NavItem[] = [
    {
        title: 'Admin Dashbord',
        href: adminDashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Cycle Management',
        href: cycle(),
        icon: Trophy,
    },
    {
        title: 'Prize Management',
        href: adminPrize(),
        icon: Gift,
    },
    {
        title: 'User Management',
        href: users(),
        icon: Users,
    },
    {
        title: 'Validate Payments',
        href: adminPayments(),
        icon: DollarSign,
    },
    {
        title: 'Admin Notifications',
        href: adminNotifications(),
        icon: Bell,
    },
    {
        title: 'App Settings',
        href: adminSettings(),
        icon: Settings,
    }
];

export function AppSidebar() {
    // const { auth } = usePage().props;
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
               {/* { true || auth.user.is_admin && */}
                    <NavFooter items={footerNavItems} className="mt-auto" />
                {/* } */}
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
