import type { AppSettings } from "@/types/app";

export const TRANSLATIONS = {
  en: {
    nav: { home: "Home", how: "How It Works", prizes: "Prizes", join: "Join Now", login: "Login", register: "Register", logout: "Logout", dashboard: "Dashboard", secure: "Secure Session", profile: "Profile" },
    hero: { subtitle: "TO DRAW THIS CYCLES PRIZE:", subtitle_today: "TODAY ONE LUCKY PERSON WILL TAKE THE CAR", title1: "Drive Your Dream.", title2: "Secure Your Future.", desc: "Experience the future of saving with Ethiopia's premier digital Equb. We combine tradition with technology to turn your monthly contributions into the car of your dreams.", cta: "Claim Your Lucky Number Today", watch: "Watch Video", prize_label: "This Month's Prize", prize_value: "Value", prize_name: "BYD E2 Luxury 2025" },
    stats: { members: "Active Members", cars: "Cars Delivered", pot: "Total Pot Value", trust: "Trust Score", taken: "Taken Numbers", lucky: "Lucky Numbers" },
    features: {
        heading_sub: "How It Works",
        heading_main: "Three Steps to Your",
        heading_highlight: "New Car",
        desc: "We've digitized the traditional Equb system to make it secure, transparent, and easy to access from anywhere.",
        step1_title: "Register & Verify",
        step1_desc: "Create your secure account using your phone number.",
        step2_title: "Claim your lucky number",
        step2_desc: "Choose your ticket after your payments easily via Telebirr or CBE.",
        step3_title: "Win & Drive",
        step3_desc: "Participate in our transparent monthly live draw."
    },
    social_proof: {
        heading: "Built on Trust",
        subheading: "Join a community built on trust, transparency, and shared prosperity.",
        winner_badge: "Win"
    },
    cta_section: {
        heading: "Ready to Drive Your Dream Car?",
        desc: "",
        btn: "Join the Waitlist"
    },
    prizes_page: {
          nav: { home: "Home", how: "How It Works", prizes: "Prizes", join: "Join Now", login: "Login", register: "Register", logout: "Logout", dashboard: "Dashboard", secure: "Secure Session", profile: "Profile" },
        title: "Monthly Grand Prizes",
        subtitle: "Every month, one lucky member drives away in a brand new car.",
        current_prize: "This Month's Grand Prize",
        value: "Value",
        draw_date: "Draw Date",
        past_winners: "Recent Winners",
        upcoming: "Upcoming Prizes",
        cta_title: "Want to be next?",
        cta_btn: "Join the Equb Now"
    },
    login: {
        heading: "Member Access",
        heading_login: "Welcome Back",
        heading_register: "Create Account",
        subheading: "Enter your details to access your dashboard",
        subheading_register: "Join the community to start winning",
        auth_layout_title_login: "Log in to your account",
        auth_layout_description_login: "Enter your email and password below to log in",
        auth_layout_title_register: "Create an account",
        auth_layout_description_register: "Enter your details below to create your account",
        head_login: "Log in",
        head_register: "Register",
        label_email: "Email address",
        placeholder_email: "email@example.com",
        label_password: "Password",
        placeholder_password: "Password",
        label_remember: "Remember me",
        link_forgot_password: "Forgot password?",
        label_name: "Name",
        placeholder_name: "Full name",
        label_confirm_password: "Confirm password",
        placeholder_confirm_password: "Confirm password",
        btn_login_action: "Log in",
        btn_register_action: "Create account",
        register_prompt: "Don't have an account?",
        login_prompt: "Already have an account?",
        btn_register: "Sign up",
        name_notice: "Important: Name must match your Kebele ID",
        label_phone: "Phone Number",
        placeholder_phone: "0912345678",
        label_tier: "Monthly Contribution",
        tier_1: "Standard - 5,000 ETB",
        tier_2: "Standard - 10,000 ETB",
        tier_3: "Premium - 25,000 ETB",
        terms_agree: "I agree to the",
        terms_link: "Terms & Conditions",
        btn_login: "Secure Login",
        btn_processing: "Processing...",
        back: "Back to Home",
        btn_login_link: "Login Here"
    },
    dashboard: {
        welcome: "Welcome back,",
        status_pending: "Payment Pending",
        status_verified: "Verified Member",
        contribution: "My Contribution",
        contribution_sub: "this month",
        pot: "Group Pot",
        pot_sub: "Current Cycle Total",
        pot_users: "Contributing",
        upload: "Upload Receipt",
        pay_telebirr: "Pay with Telebirr",
        pay_cbe: "Pay with CBE",
        history: "Recent Activity",
        next_draw: "TO DRAW THIS CYCLES PRIZE: 14 DAYS",
        next_draw_today: "TODAY ONE LUCKY PERSON WILL TAKE THE CAR",
        win_title: "Win a BYD E2 Luxury",
        win_desc: "Make your contribution today to enter the draw. Verified members only.",
        btn_paid: "Contribution Paid",
        live_activity: "Live Activity",
        hall_of_fame: "Hall of Fame",
        action_verified: "Verified Payment",
        action_joined: "Joined the Equb",
        status_card_title: "My Status",
        payment_due: "Payment Due",
        btn_processing: "Processing...",
        select_ticket: "Select Lucky Number",
        select_ticket_desc: "Choose a number for the next draw.",
        confirm_ticket: "Confirm Number",
        my_ticket: "My Number",
        ticket_saved: "Lucky Number Claimed!",
        ticket_instruction: "Green numbers are available.",
        change_method: "Change Method",
        confirm_paid: "I Have Paid",
        account_no: "Account Number",
        merchant_id: "Merchant ID",
        acc_name: "Account Name",
        winner_congrats: "CONGRATULATIONS!",
        winner_desc: "You are the winner of this cycle's Grand Prize!",
        winner_ticket: "Winning Ticket",
        claim_prize: "Claim Prize"
    },
    terms_page: {
        title: "Terms and Conditions",
        last_updated: "Last Updated: March 2024",
        sections: [
            {
                heading: "1. Service Agreement",
                content: "By using the Blessed Digital Equb application, you agree to be bound by the terms and obligations outlined in this agreement."
            },
            {
                heading: "2. Eligibility",
                content: "You must be at least 18 years old and a resident of Ethiopia to participate in draws and Equb cycles. Valid ID is required to claim prizes."
            },
            {
                heading: "3. Lucky Numbers & Claims",
                content: "Members agree to make monthly payments according to their selected tier. Contributions are non-refundable once a cycle begins. Failure to pay may result in suspension."
            },
            {
                heading: "4. Draw Process",
                content: "Winners are selected through a transparent, random draw process. Results are final. Winners must claim their prize within 30 days."
            },
            {
                heading: "5. Privacy",
                content: "We value your privacy. Your personal information, including phone number and payment details, is encrypted and used solely for service delivery and verification."
            }
        ]
    },
    footer: {
        desc: "We have transformed the traditional Ethiopian Equb into a modern digital asset.",
        contact: "Contact",
        social: "Social Media",
        rights: "Blessed Digital Equb.",
        terms: "Terms & Conditions",
        privacy: "Privacy Policy"
    }
  },
  am: {
    nav: { home: "መነሻ", how: "እንዴት ይሰራል", prizes: "ሽልማቶች", join: "ይመዝገቡ", login: "ይግቡ", register: "ይመዝገቡ", logout: "ውጣ", dashboard: "ዳሽቦርድ", secure: "ደህንነቱ የተጠበቀ", profile: "ፕሮፋይል" },
    hero: { subtitle: "የዚህ ዙር እጣ ሊወጣ የቀረው ጊዜ:", subtitle_today: "ዛሬ አንድ እድለኛ ሰው መኪናውን ይረከባል", title1: "ህልምዎን ይንዱ።", title2: "ነገዎን ያረጋግጡ።", desc: "የቁጠባ ባህልን ከዘመናዊ ቴክኖሎጂ ጋር በማጣመር የህልም መኪናዎን ባለቤት የሚያደርግዎ የኢትዮጵያ ቀዳሚ ዲጂታል እቁብ።", cta: "የእድለኛ ቁጥርዎን ዛሬ ይያዙ", watch: "ቪዲዮ ይመልከቱ", prize_label: "የዚህ ወር ሽልማት", prize_value: "ዋጋ", prize_name: "BYD E2 Luxury 2025" },
    stats: { members: "ንቁ አባላት", cars: "የተሰጡ መኪኖች", pot: "ጠቅላላ የገንዘብ መጠን", trust: "የታማኝነት ነጥብ", taken: "የተያዙ ቁጥሮች", lucky: "እድለኛ ቁጥሮች" },
    features: {
        heading_sub: "እንዴት ይሰራል",
        heading_main: "ወደ አዲሱ መኪናዎ የሚወስዱ",
        heading_highlight: "ሶስት ደረጃዎች",
        desc: "ባህላዊውን የእቁብ ስርዓት ደህንነቱ የተጠበቀ፣ ግልጽ እና ከየትኛውም ቦታ ሆነው በቀላሉ የሚሳተፉበት አድርገን ዘምነነዋል።",
        step1_title: "ይመዝገቡ እና ያረጋግጡ",
        step1_desc: "ስልክ ቁጥርዎን በመጠቀም ደህንነቱ የተጠበቀ መለያ ይፍጠሩ።",
        step2_title: "እድለኛ ቁጥርዎን ይምረጡ",
        step2_desc: "ክፍያዎን በቀላሉ በቴሌቢር ወይም በ CBE በኩል ከፈጸሙ በኋላ ቲኬትዎን ይምረጡ።",
        step3_title: "ያሸንፉ እና ይንዱ",
        step3_desc: "በየወሩ በሚካሄደው ግልጽ የእጣ አወጣጥ ላይ ይሳተፉ።"
    },
    social_proof: {
        heading: "በታማኝነት የተገነባ",
        subheading: "በታማኝነት፣ በግልፅነት እና በጋራ ተጠቃሚነት የተገነባውን ማህበረሰብ ይቀላቀሉ።",
        winner_badge: "አሸናፊ"
    },
    cta_section: {
        heading: "የህልም መኪናዎን ለመንዳት ዝግጁ ነዎት?",
        desc: "",
        btn: "አሁኑኑ ይመዝገቡ"
    },
    prizes_page: {
          nav: { home: "መነሻ", how: "እንዴት ይሰራል", prizes: "ሽልማቶች", join: "ይመዝገቡ", login: "ይግቡ", register: "ይመዝገቡ", logout: "ውጣ", dashboard: "ዳሽቦርድ", secure: "ደህንነቱ የተጠበቀ", profile: "ፕሮፋይል" },
        title: "ወራዊ ታላላቅ ሽልማቶች",
        subtitle: "በየወሩ አንድ እድለኛ አባል አዲስ መኪና ይዞ ወደ ቤቱ ይሄዳል።",
        current_prize: "የዚህ ወር ታላቅ ሽልማት",
        value: "ዋጋ",
        draw_date: "የእጣ ቀን",
        past_winners: "የቅርብ ጊዜ አሸናፊዎች",
        upcoming: "ቀጣይ ሽልማቶች",
        cta_title: "ቀጣዩ አሸናፊ እርስዎ መሆን ይፈልጋሉ?",
        cta_btn: "እቁቡን አሁኑኑ ይቀላቀሉ"
    },
    login: {
        heading: "የአባላት መግቢያ",
        heading_login: "እንኳን ደህና መጡ",
        heading_register: "መለያ ይፍጠሩ",
        subheading: "ወደ ዳሽቦርድ ለመግባት መረጃዎን ያስገቡ",
        subheading_register: "ማህበረሰቡን ተቀላቅለው ማሸነፍ ይጀምሩ",
        auth_layout_title_login: "ወደ መለያዎ ይግቡ",
        auth_layout_description_login: "ለመግባት ኢሜይልዎን እና የይለፍ ቃልዎን ከታች ያስገቡ",
        auth_layout_title_register: "መለያ ይፍጠሩ",
        auth_layout_description_register: "መለያ ለመፍጠር መረጃዎን ከታች ያስገቡ",
        head_login: "ግባ",
        head_register: "ይመዝገቡ",
        label_email: "ኢሜይል አድራሻ",
        placeholder_email: "email@example.com",
        label_password: "የይለፍ ቃል",
        placeholder_password: "የይለፍ ቃል",
        label_remember: "አስታውሰኝ",
        link_forgot_password: "የይለፍ ቃል ረሱ?",
        label_name: "ስም",
        placeholder_name: "ሙሉ ስም",
        label_confirm_password: "የይለፍ ቃል አረጋግጥ",
        placeholder_confirm_password: "የይለፍ ቃል አረጋግጥ",
        btn_login_action: "ግባ",
        btn_register_action: "መለያ ፍጠር",
        register_prompt: "መለያ የለዎትም?",
        login_prompt: "መለያ አለዎት?",
        btn_register: "ይመዝገቡ",
        name_notice: "ማሳሰቢያ: ስምዎ በመታወቂያ ላይ ካለው ጋር መመሳሰል አለበት",
        label_phone: "ስልክ ቁጥር",
        placeholder_phone: "0912345678",
        label_tier: "ወራዊ ክፍያ",
        tier_1: "መደበኛ - 5,000 ብር",
        tier_2: "መደበኛ - 10,000 ብር",
        tier_3: "ፕሪሚየም - 25,000 ብር",
        terms_agree: "በ",
        terms_link: "ውሎች እና ሁኔታዎች እስማማለሁ",
        btn_login: "ይግቡ",
        btn_processing: "በማስኬድ ላይ...",
        back: "ወደ መነሻ ተመለስ",
        btn_login_link: "እዚህ ይግቡ"
    },
    dashboard: {
        welcome: "እንኳን ደህና መጡ፣",
        status_pending: "ክፍያ ይጠበቃል",
        status_verified: "የተረጋገጠ አባል",
        contribution: "የእኔ ቁጠባ",
        contribution_sub: "በዚህ ወር",
        pot: "የቡድን እቁብ",
        pot_sub: "የአሁን ዙር ጠቅላላ",
        pot_users: "አባላት",
        upload: "ደረሰኝ ላክ",
        pay_telebirr: "በቴሌብር ይክፈሉ",
        pay_cbe: "በንግድ ባንክ ይክፈሉ",
        history: "የቅርብ ጊዜ እንቅስቃሴዎች",
        next_draw: "ለዚህ ዙር እጣ የቀረው ጊዜ: 14 ቀናት",
        next_draw_today: "ዛሬ አንድ እድለኛ ሰው መኪናውን ይረከባል",
        win_title: "BYD E2 Luxury ያሸንፉ",
        win_desc: "በእጣው ለመሳተፍ ክፍያዎን ዛሬውኑ ይፈጽሙ። የተረጋገጡ አባላት ብቻ።",
        btn_paid: "ክፍያ ተፈጽሟል",
        live_activity: "የቀጥታ እንቅስቃሴ",
        hall_of_fame: "የዝና አዳራሽ",
        action_verified: "ክፍያ ተረጋግጧል",
        action_joined: "እቁቡን ተቀላቅለዋል",
        status_card_title: "የኔ ሁኔታ",
        payment_due: "የክፍያ ቀን",
        btn_processing: "በማስኬድ ላይ...",
        select_ticket: "እድለኛ ቁጥር ይምረጡ",
        select_ticket_desc: "ለቀጣዩ እጣ የሚሆን ቁጥር ይምረጡ።",
        confirm_ticket: "ቁጥሩን አረጋግጥ",
        my_ticket: "የእኔ ቁጥር",
        ticket_saved: "የእድለኛ ቁጥር ተያዙ!",
        ticket_instruction: "አረንጓዴ ቁጥሮች ክፍት ናቸው።",
        change_method: "ዘዴ ቀይር",
        confirm_paid: "ክፍያ ፈጽሚያለሁ",
        account_no: "የሂሳብ ቁጥር",
        merchant_id: "የንግድ መለያ",
        acc_name: "የሂሳብ ስም",
        winner_congrats: "እንኳን ደስ አለዎት!",
        winner_desc: "የዚህ ዙር ታላቅ ሽልማት አሸናፊ እርስዎ ነዎት!",
        winner_ticket: "አሸናፊ ቲኬት",
        claim_prize: "ሽልማቱን ይቀበሉ"
    },
    terms_page: {
        title: "ውሎች እና ሁኔታዎች",
        last_updated: "ለመጨረሻ ጊዜ የተሻሻለው: መጋቢት 2016",
        sections: [
            {
                heading: "1. የአገልግሎት ስምምነት",
                content: "የብለስድ ዲጂታል እቁብ መተግበሪያን ሲጠቀሙ፣ በዚህ ስምምነት ላይ በተገለጹት ውሎች እና ግዴታዎች ለመገዛት ይስማማሉ።"
            },
            {
                heading: "2. መስፈርቶች",
                content: "በእጣው እና በእቁብ ዙሮች ለመሳተፍ እድሜዎ ቢያንስ 18 ዓመት እና የኢትዮጵያ ነዋሪ መሆን አለብዎት። ሽልማቶችን ለመቀበል የሚሰራ መታወቂያ ያስፈልጋል።"
            },
            {
                heading: "3. የእድለኛ ቁጥሮች እና ያርግቶች",
                content: "አባላት በተመረጠው እርከን መሰረት ወራዊ ክፍያ ለመፈጸም ይስማማሉ። የወር እቁብ ዑደቱ ከተጀመረ በኋላ የተከፈለ ገንዘብ ተመላሽ አይደረግም። ክፍያ አለመፈጸም ከአገልግሎት ሊያግድ ይችላል።"
            },
            {
                heading: "4. የእጣ አወጣጥ",
                content: "አሸናፊዎች ግልጽ በሆነ እና በዘፈቀደ የእጣ አወጣጥ ሂደት ይመረጣሉ። ውጤቱ የመጨረሻ ነው። አሸናፊዎች ሽልማታቸውን በ30 ቀናት ውስጥ መቀበል አለባቸው።"
            },
            {
                heading: "5. ግላዊነት",
                content: "የእርስዎን ግላዊነት እናከብራለን። የግል መረጃዎ፣ ስልክ ቁጥር እና የክፍያ ዝርዝሮችን ጨምሮ፣ የተመሰጠረ እና ለአገልግሎት አሰጣጥ እና ማረጋገጫ ብቻ የሚውል ነው።"
            }
        ]
    },
    footer: {
        desc: "ባህላዊውን የኢትዮጵያ እቁብ ወደ ዘመናዊ ዲጂታል ንብረትነት ቀይረነዋል።",
        contact: "አድራሻ",
        social: "ማህበራዊ ሚዲያ",
        rights: "ብለስድ ዲጂታል እቁብ።",
        terms: "ውሎች እና ሁኔታዎች",
        privacy: "የግላዊነት መመሪያ"
    }
  }
};

export const PRIZE_IMAGES = [
  "https://i.postimg.cc/TYMZqt8J/byd_e2_front.png",
  "https://i.postimg.cc/YqKJfdcX/byd_e2_rear.png",
  "https://i.postimg.cc/gkFfqg94/byd_e2_right.png",
  "https://i.postimg.cc/ZYyGd1QP/BYD_E2_405km_Luxury_2025_20.jpg"
];

export const DEFAULT_SETTINGS : AppSettings = {
  nextDrawDateEn: 'Yekatit 21, 2018',
  nextDrawDateAm: 'የካቲት 21፣ 2018',
  potValue: 50450000,
  totalMembers: 2150,
  cycle: 1,
  daysRemaining: 14,
  drawDate: new Date(new Date().setDate(new Date().getDate() + 14)).toISOString().split('T')[0],
  carsDelivered: 142,
  trustScore: 100,
  prizeName: 'BYD E2 Luxury 2025',
  prizeValue: 'ETB 4.2M',
  prizeImage: PRIZE_IMAGES[0],
  prizeImages: PRIZE_IMAGES, // Initialize with constant values
  liveStreamUrl: '',
  isLive: false,
  registrationEnabled: true,
  adminPassword: 'admin123',
  ticketSelectionEnabled: true, // Default to enabled
  winnerAnnouncementMode: false, // Default to disabled
  recentWinners: [
    {
      id: 1,
      name: "Dawit M.",
      nameAm: "ዳዊት መ.",
      prize: "Toyota Vitz",
      prizeAm: "ቶዮታ ቪትዝ",
      cycle: "Tir (Jan)",
      cycleAm: "ጥር",
      location: "Addis Ababa",
      locationAm: "አዲስ አበባ"
    },
    {
      id: 2,
      name: "Sara T.",
      nameAm: "ሳራ ት.",
      prize: "Hyundai i10",
      prizeAm: "ሂዩንዳይ i10",
      cycle: "Tahsas (Dec)",
      cycleAm: "ታህሳስ",
      location: "Adama",
      locationAm: "አዳማ"
    }
  ]
};

export const ADMIN_TRANSLATIONS = {
  en: {
    sidebar: {
      title: "Admin Panel",
      dashboard: "Dashboard",
      competition: "Competition",
      prizes: "Prizes",
      users: "User Management",
      payments: "Verify Payments",
      notifications: "Notifications",
      settings: "App Settings",
      exit: "Exit Admin"
    },
    notifications: {
      breadcrumb: "Notifications",
      headTitle: "Notification Management",
      pageTitle: "Notification Center",
      subtitle: "Manage system broadcasts and view transmission history.",
      stats: {
        total: "Total",
        unread: "Unread",
        urgent: "Urgent"
      },
      tabs: {
        history: "History",
        compose: "Compose"
      },
      search: {
        placeholder: "Search by title..."
      },
      filters: {
        all: "All",
        unread: "Unread",
        urgent: "Urgent"
      },
      badges: {
        urgent: "Urgent",
        standard: "Standard",
        read: "Read",
        unread: "Unread"
      },
      actions: {
        markRead: "Mark read",
        markUnread: "Mark unread",
        delete: "Delete",
        cancel: "Cancel"
      },
      compose: {
        title: "Create System Broadcast",
        description: "Compose a message to be sent to all active users.",
        englishContent: "English Content",
        amharicContent: "Amharic Content",
        fields: {
          titleEn: "Notification Title",
          messageEn: "Message Body",
          titleAm: "Notification Title (Amharic)",
          messageAm: "Message Body (Amharic)",
          actionLink: "Action Link (Optional)",
          urgentBroadcast: "Urgent Broadcast"
        },
        placeholders: {
          titleEn: "e.g., System Maintenance",
          messageEn: "Enter the detailed message...",
          titleAm: "ለምሳሌ፦ የስርዓት ጥገና",
          messageAm: "ዝርዝር መልእክቱን እዚህ ያስገቡ...",
          actionLink: "https://"
        },
        configuration: "Configuration",
        actionLinkHint: "Users will be redirected here when they click the notification.",
        urgentHint: "Highlights the notification in red and pins it to top.",
        resetFields: "Reset Fields",
        broadcasting: "Broadcasting...",
        sendBroadcast: "Send Broadcast"
      },
      deleteDialog: {
        title: "Delete notification",
        descriptionPrefix: "This will remove the notification from the demo history."
      }
    },
    dashboard: {
      overview: "Dashboard Overview",
      totalPot: "Total Pot",
      claimedTickets: "Claimed Tickets",
      totalMembers: "Total Members",
      pending: "Pending Verifications",
      cycle: "Current Cycle",
      cycleTitle: "Cycle Management",
      cycleDesc: "Control the current lottery cycle status",
      active: "Active",
      startNew: "Start New Cycle",
      nextDraw: "Next Draw",
      daysRem: "days remaining",
      recentPay: "Recent Payment Requests",
      viewAll: "View All",
      noPending: "No pending payments.",
      user: "User ID",
      amount: "Amount",
      date: "Date",
      action: "Action",
      review: "Review"
    },
    competition: {
      title: "Competition Management",
      general: "General Settings",
      tickets: "Ticket Management",
      drawSchedule: "Draw Schedule",
      setNextDraw: "Set Next Draw Date (Ethiopian Calendar)",
      preview: "Preview",
      save: "Save Changes",
      currentPrize: "Current Prize",
      prizeName: "Prize Name",
      prizeValue: "Prize Value",
      prizeImages: "Prize Images",
      liveStream: "Live Stream",
      liveStatus: "Live Status"
    },
    prizes: {
      title: "Prize Management",
      liveAnnouncer: "Live Draw Announcer",
      liveDesc: "Use this tool during the live event to broadcast the winner to all connected users instantly.",
      winTicket: "Winning Ticket Number",
      verify: "Verify Ticket",
      announce: "ANNOUNCE WINNER LIVE",
      hallOfFame: "Hall of Fame (Past Winners)",
      hallDesc: "Manage the list of winners displayed on the Prizes page.",
      addWinner: "Add Past Winner"
    },
    users: {
      title: "User Management",
      addNew: "Add New User",
      search: "Search by name or phone...",
      allStatus: "All Status",
      verified: "Verified",
      pending: "Pending",
      contrib: "Contribution",
      ticket: "Ticket #",
      actions: "Actions",
      showing: "Showing",
      total: "Total Users",
      status: "Status",
      phone: "Phone"
    },
    payments: {
      title: "Pending Payments",
      allCaughtUp: "All Caught Up!",
      noRequests: "There are no pending payment requests to verify at this time.",
      amount: "Amount Declared",
      reject: "Reject",
      approve: "Approve"
    },
    settings: {
      title: "App Settings",
      general: "General Preferences",
      langTitle: "Admin Dashboard Language",
      langDesc: "Toggle the language settings for the admin dashboard.",
      security: "Account & Security",
      userReg: "User Registration",
      userRegDesc: "Allow new users to create accounts",
      changePass: "Change Admin Password",
      update: "Update",
      save: "Save Changes"
    },
    login: {
      title: "Admin Portal",
      label: "Access Key",
      btn: "Login",
      back: "Back to Site",
      placeholder: "Enter password",
      failed: "Login Failed",
      failedMsg: "The access key you provided is incorrect. Please try again."
    }
  },
  am: {
    sidebar: {
      title: "አድሚን ፓነል",
      dashboard: "ዳሽቦርድ",
      competition: "ውድድር",
      prizes: "ሽልማቶች",
      users: "ተጠቃሚዎች",
      payments: "ክፍያ ማረጋገጫ",
      notifications: "ማሳወቂያዎች",
      settings: "ቅንብሮች",
      exit: "ውጣ"
    },
    notifications: {
      breadcrumb: "ማሳወቂያዎች",
      headTitle: "የማሳወቂያ አስተዳደር",
      pageTitle: "የማሳወቂያ ማዕከል",
      subtitle: "የስርዓት ማስተላለፊያዎችን ያስተዳድሩ እና የተላኩ መልእክቶችን ታሪክ ይመልከቱ።",
      stats: {
        total: "ጠቅላላ",
        unread: "ያልተነበቡ",
        urgent: "አስቸኳይ"
      },
      tabs: {
        history: "ታሪክ",
        compose: "ላክ"
      },
      search: {
        placeholder: "በርዕስ ይፈልጉ..."
      },
      filters: {
        all: "ሁሉም",
        unread: "ያልተነበቡ",
        urgent: "አስቸኳይ"
      },
      badges: {
        urgent: "አስቸኳይ",
        standard: "መደበኛ",
        read: "ተነብቧል",
        unread: "ያልተነበበ"
      },
      actions: {
        markRead: "ተነብቧል አድርግ",
        markUnread: "ያልተነበበ አድርግ",
        delete: "ሰርዝ",
        cancel: "ተው"
      },
      compose: {
        title: "የስርዓት ማስታወቂያ ፍጠር",
        description: "ለሁሉም ንቁ ተጠቃሚዎች የሚላክ መልእክት ያቀናብሩ።",
        englishContent: "የእንግሊዝኛ ይዘት",
        amharicContent: "የአማርኛ ይዘት",
        fields: {
          titleEn: "የማሳወቂያ ርዕስ",
          messageEn: "የመልእክት ይዘት",
          titleAm: "የማሳወቂያ ርዕስ (አማርኛ)",
          messageAm: "የመልእክት ይዘት (አማርኛ)",
          actionLink: "የእርምጃ አገናኝ (አማራጭ)",
          urgentBroadcast: "አስቸኳይ ማስታወቂያ"
        },
        placeholders: {
          titleEn: "ለምሳሌ፦ System Maintenance",
          messageEn: "ዝርዝር መልእክቱን እዚህ ያስገቡ...",
          titleAm: "ለምሳሌ፦ የስርዓት ጥገና",
          messageAm: "ዝርዝር መልእክቱን እዚህ ያስገቡ...",
          actionLink: "https://"
        },
        configuration: "ቅንብር",
        actionLinkHint: "ተጠቃሚዎች ማሳወቂያውን ሲጫኑ ወደዚህ ይመራሉ።",
        urgentHint: "ማሳወቂያውን በቀይ ያሳያል እና ከላይ ያስቀምጣል።",
        resetFields: "መስኮችን አጽዳ",
        broadcasting: "በመላክ ላይ...",
        sendBroadcast: "ማስታወቂያ ላክ"
      },
      deleteDialog: {
        title: "ማሳወቂያ ሰርዝ",
        descriptionPrefix: "ይህ ማሳወቂያውን ከሙከራ ታሪክ ያስወግዳል።"
      }
    },
    dashboard: {
      overview: "የዳሽቦርድ አጠቃላይ እይታ",
      totalPot: "ጠቅላላ ገንዘብ",
      claimedTickets: "የተያዙ ቲኬቶች",
      totalMembers: "ጠቅላላ አባላት",
      pending: "ማረጋገጫ የሚጠብቁ",
      cycle: "የአሁኑ ዙር",
      cycleTitle: "የዙር አስተዳደር",
      cycleDesc: "የአሁኑን የሎተሪ ዙር ሁኔታ ይቆጣጠሩ",
      active: "ንቁ",
      startNew: "አዲስ ዙር ጀምር",
      nextDraw: "ቀጣይ እጣ",
      daysRem: "ቀናት ቀርተዋል",
      recentPay: "የቅርብ ጊዜ የክፍያ ጥያቄዎች",
      viewAll: "ሁሉንም አሳይ",
      noPending: "ምንም በመጠባበቅ ላይ ያሉ ክፍያዎች የሉም።",
      user: "ተጠቃሚ",
      amount: "መጠን",
      date: "ቀን",
      action: "ተግባር",
      review: "ገምግም"
    },
    competition: {
      title: "የውድድር አስተዳደር",
      general: "አጠቃላይ ቅንብሮች",
      tickets: "ቲኬት አስተዳደር",
      drawSchedule: "የእጣ ፕሮግራም",
      setNextDraw: "ቀጣይ የእጣ ቀን ያዘጋጁ (በኢትዮጵያ አቆጣጠር)",
      preview: "ቅድመ እይታ",
      save: "ለውጦችን አስቀምጥ",
      currentPrize: "የአሁኑ ሽልማት",
      prizeName: "የሽልማት ስም",
      prizeValue: "የሽልማት ዋጋ",
      prizeImages: "የሽልማት ምስሎች",
      liveStream: "የቀጥታ ስርጭት",
      liveStatus: "የቀጥታ ሁኔታ"
    },
    prizes: {
      title: "ሽልማት አስተዳደር",
      liveAnnouncer: "የቀጥታ እጣ አወጣጥ",
      liveDesc: "ይህንን መሳሪያ በቀጥታ ስርጭት ወቅት አሸናፊውን ለተጠቃሚዎች ለማሳወቅ ይጠቀሙበት።",
      winTicket: "አሸናፊ የቲኬት ቁጥር",
      verify: "ቲኬት አረጋግጥ",
      announce: "አሸናፊውን አብስር",
      hallOfFame: "የዝና አዳራሽ (ያለፉት አሸናፊዎች)",
      hallDesc: "በሽልማት ገጹ ላይ የሚታዩትን የአሸናፊዎች ዝርዝር ያስተዳድሩ።",
      addWinner: "ያለፈ አሸናፊ ጨምር"
    },
    users: {
      title: "ተጠቃሚ አስተዳደር",
      addNew: "አዲስ ተጠቃሚ ጨምር",
      search: "በስም ወይም ስልክ ይፈልጉ...",
      allStatus: "ሁሉም ሁኔታዎች",
      verified: "የተረጋገጠ",
      pending: "በመጠባበቅ ላይ",
      contrib: "መዋጮ",
      ticket: "ቲኬት #",
      actions: "ተግባራት",
      showing: "በማሳየት ላይ",
      total: "ጠቅላላ ተጠቃሚዎች",
      status: "ሁኔታ",
      phone: "ስልክ"
    },
    payments: {
      title: "ክፍያ ማረጋገጫ",
      allCaughtUp: "ሁሉም ተጠናቋል!",
      noRequests: "በአሁኑ ሰዓት ማረጋገጫ የሚጠብቅ ክፍያ የለም።",
      amount: "የተገለጸው መጠን",
      reject: "ውድቅ አድርግ",
      approve: "አረጋግጥ"
    },
    settings: {
      title: "የመተግበሪያ ቅንብሮች",
      general: "አጠቃላይ ምርጫዎች",
      langTitle: "የአድሚን ቋንቋ",
      langDesc: "የአድሚን ዳሽቦርድ ቋንቋ ይቀይሩ።",
      security: "መለያ እና ደህንነት",
      userReg: "ተጠቃሚ ምዝገባ",
      userRegDesc: "አዳዲስ ተጠቃሚዎች መለያ እንዲፈጥሩ ፍቀድ",
      changePass: "የአድሚን የይለፍ ቃል ቀይር",
      update: "አዘምን",
      save: "ለውጦችን አስቀምጥ"
    },
    login: {
      title: "አድሚን ፓነል",
      label: "የይለፍ ቃል",
      btn: "ግባ",
      back: "ወደ ጣቢያው ተመለስ",
      placeholder: "የይለፍ ቃል ያስገቡ",
      failed: "መግባት አልተሳካም",
      failedMsg: "ያስገቡት የይለፍ ቃል ትክክል አይደለም።"
    }
  }
};

