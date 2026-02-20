import { Head, Link } from '@inertiajs/react';
import Footer from '@/components/landing/footer';
import { TRANSLATIONS } from '@/constants';
import { home } from '@/routes';
import type { Language } from '@/types/app';

interface PrivacyProps {
    language?: Language;
}

export default function Privacy({ language = 'en' }: PrivacyProps) {
    const terms = TRANSLATIONS[language].terms_page;
    const footerT = TRANSLATIONS[language].footer;

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
                            Back
                        </Link>
                    </div>
                </header>

                <main className="mx-auto w-full max-w-4xl px-4 py-10">
                    <h1 className="text-3xl font-bold tracking-tight text-stone-900">
                        {footerT.privacy}
                    </h1>

                    <section className="mt-8 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
                        <h2 className="text-lg font-bold text-stone-900">{terms.sections[4].heading}</h2>
                        <p className="mt-2 text-sm leading-relaxed text-stone-600">
                            {terms.sections[4].content}
                        </p>
                    </section>

                      <section className="mt-8 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
                        <h2 className="text-lg font-bold text-stone-900">{terms.sections[4].heading}</h2>
                        <p className="mt-2 text-sm leading-relaxed text-stone-600">
                            {terms.sections[4].content}
                        </p>
                    </section>

                      <section className="mt-8 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
                        <h2 className="text-lg font-bold text-stone-900">{terms.sections[4].heading}</h2>
                        <p className="mt-2 text-sm leading-relaxed text-stone-600">
                            {terms.sections[4].content}
                        </p>
                    </section>
                </main>

                <Footer language={language} />
            </div>
        </>
    );
}
