import { Head, Link } from '@inertiajs/react';
import Footer from '@/components/landing/footer';
import { TRANSLATIONS } from '@/constants';
import { useLanguage } from '@/hooks/use-language';
import { home } from '@/routes';


export default function Privacy() {
    const { language } = useLanguage();
    const common = TRANSLATIONS[language].common;
    const privacy = TRANSLATIONS[language].privacy_page;
    const footerT = TRANSLATIONS[language].footer;

    type PolicySection = {
        heading: string;
        content: string;
    };

    return (
        <>
            <Head title={footerT.privacy} />

            <div className="min-h-screen bg-stone-50 text-stone-900">
                <header className="border-b border-stone-200 bg-white">
                    <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
                        <Link
                            href={home().url}
                            className="text-sm font-semibold text-stone-800 hover:underline"
                            prefetch
                        >
                            {common.back}
                        </Link>
                    </div>
                </header>

                <main className="mx-auto w-full max-w-4xl px-4 py-10">
                    <h1 className="text-3xl font-bold tracking-tight text-stone-900">
                        {footerT.privacy}
                    </h1>

                    <p className="mt-2 text-sm text-stone-500">{privacy.last_updated}</p>

                    <div className="mt-8 space-y-6">
                        {(privacy.sections as PolicySection[]).map((section: PolicySection) => (
                            <section
                                key={section.heading}
                                className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm"
                            >
                                <h2 className="text-lg font-bold text-stone-900">
                                    {section.heading}
                                </h2>
                                <div className="mt-2 space-y-3 text-sm leading-relaxed text-stone-600">
                                    {section.content
                                        .split('\n\n')
                                        .filter(Boolean)
                                        .map((paragraph: string) => (
                                            <p key={paragraph}>{paragraph}</p>
                                        ))}
                                </div>
                            </section>
                        ))}
                    </div>
                </main>

                <Footer language={language} />
            </div>
        </>
    );
}
