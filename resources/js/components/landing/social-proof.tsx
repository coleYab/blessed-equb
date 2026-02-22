import { Trophy, Star } from 'lucide-react';

import React from 'react';
import { Button } from '@/components/ui/button';
import { TRANSLATIONS } from '@/constants';
import type { Language } from '@/types/app';

interface SocialProofSectionProps {
  language: Language;
}

const SocialProofSection: React.FC<SocialProofSectionProps> = ({ language }) => {
  const t = TRANSLATIONS[language].social_proof;

  const testimonialsData = {
    en: [
      { name: "Dawit M.", location: "Addis Ababa", quote: "Winning the Vitz was a dream come true. Blessed is transparent!", type: "Winner" },
      { name: "Tigist A.", location: "Hawassa", quote: "I love how easy it is to pay with Telebirr. Very secure.", type: "Member" },
      { name: "Robel K.", location: "Adama", quote: "Customer support is amazing. They helped me verify instantly.", type: "Member" },
      { name: "Hanna S.", location: "Bahir Dar", quote: "The best digital Equb in Ethiopia. Highly recommended.", type: "Member" },
      { name: "Yared B.", location: "Dire Dawa", quote: "Fair lottery system. I watched the draw live!", type: "Member" }
    ],
    am: [
      { name: "ዳዊት መ.", location: "አዲስ አበባ", quote: "ቪትዝ መኪና ማሸነፌ ህልም ነበር። ብለስድ እጅግ ግልጽ የሆነ አሰራር አለው!", type: "Winner" },
      { name: "ትግስት አ.", location: "ሀዋሳ", quote: "በቴሌብር መክፈል መቻሉ በጣም ይመቻል። አስተማማኝ ነው።", type: "Member" },
      { name: "ሮቤል ከ.", location: "አዳማ", quote: "የደንበኞች አገልግሎታቸው ምርጥ ነው። ወዲያውኑ አረጋገጡልኝ።", type: "Member" },
      { name: "ሃና ሰ.", location: "ባህር ዳር", quote: "በኢትዮጵያ ምርጡ ዲጂታል እቁብ። ለሁሉም እመክራለሁ።", type: "Member" },
      { name: "ያሬድ በ.", location: "ድሬዳዋ", quote: "ፍትሃዊ የእጣ አወጣጥ። በቀጥታ ስርጭት ተከታትዬዋለሁ!", type: "Member" }
    ]
  };

  const testimonials = testimonialsData[language];

  return (
    <section className="py-20 bg-emerald-900 text-white overflow-hidden relative">
       {/* Background pattern similar to calculator for consistency */}
       <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
         <div className="w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 mb-12 text-center relative z-10">
        <h2 className="text-3xl font-bold text-white mb-4">{t.heading}</h2>
        <p className="text-emerald-200">{t.subheading}</p>
      </div>

      {/* Marquee Track */}
      <div className="relative w-full overflow-hidden z-10">
        <div className="flex animate-scroll space-x-6 w-max">
           {/* Double the array to create seamless loop */}
           {[...testimonials, ...testimonials].map((item, idx) => (
              <div key={idx} className="w-80 bg-emerald-800/50 backdrop-blur-sm border border-emerald-700/50 p-6 rounded-xl flex-shrink-0 hover:bg-emerald-800 transition-colors">
                 <div className="flex items-center mb-4">
                    <div className="w-10 h-10 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-lg mr-3">
                      {item.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm">{item.name}</h4>
                      <p className="text-xs text-emerald-400">{item.location}</p>
                    </div>
                    {item.type === 'Winner' && (
                      <div className="ml-auto bg-amber-500/20 text-amber-400 text-xs px-2 py-1 rounded-full flex items-center">
                        <Trophy className="w-3 h-3 mr-1" /> {t.winner_badge}
                      </div>
                    )}
                 </div>
                 <p className="text-emerald-100 text-sm italic leading-relaxed">"{item.quote}"</p>
                 <div className="mt-4 flex text-amber-500">
                    {[1,2,3,4,5].map(star => <span key={star}><Star className="w-3 h-3 inline fill-current" /></span>)}
                 </div>
              </div>
           ))}
        </div>
      </div>

      <div className="mx-auto mt-10 max-w-3xl px-4 relative z-10">
        <div className="rounded-2xl border border-emerald-700/50 bg-emerald-950/30 p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-50">
                <span className="inline-flex h-2 w-2 rounded-full bg-amber-400" />
                {t.license_trigger}
              </div>
              <div className="mt-2 text-sm leading-relaxed text-emerald-100">{t.license_description}</div>
              {/* <div className="mt-2 text-xs text-emerald-200/80">{t.license_hint}</div> */}
            </div>

            <Button
              asChild
              variant="secondary"
              className="bg-amber-500/15 text-amber-200 hover:bg-amber-500/25"
            >
              <a
                href="/liscence.pdf"
                target="_blank"
                rel="noreferrer"
              >
                {t.license_view}
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SocialProofSection;
