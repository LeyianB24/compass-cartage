// src/app/services/[slug]/page.tsx
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import CallToAction from "@/components/CallToAction";
import { SERVICE_DETAILS, ServiceDetail } from "@/lib/serviceDetails";
import { IMAGES } from "@/lib/images";
import { CheckCircle2, ArrowRight, ShieldCheck, HelpCircle } from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return Object.keys(SERVICE_DETAILS).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = SERVICE_DETAILS[slug];
  if (!service) return { title: "Service Not Found" };

  return {
    title: `${service.title} | Compass Cartage Edmonton`,
    description: service.metaDescription,
    openGraph: {
      title: service.metaTitle,
      description: service.metaDescription,
      url: `https://www.compasscartage.com/services/${service.slug}`,
    },
  };
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const service = SERVICE_DETAILS[slug];

  if (!service) {
    notFound();
  }

  const heroImage = IMAGES[service.imageKey] || IMAGES.heroMovers;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    description: service.metaDescription,
    provider: {
      "@type": "MovingCompany",
      name: "Compass Cartage",
      telephone: "+1-587-501-7519",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Edmonton",
        addressRegion: "AB",
        addressCountry: "CA",
      },
    },
    areaServed: {
      "@type": "AdministrativeArea",
      name: "Alberta, Canada",
    },
  };

  return (
    <>
      {/* Structured SEO Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="relative w-full overflow-hidden">
        {/* Hero Section */}
        <PageHero
          image={heroImage}
          eyebrow={service.eyebrow}
          title={service.title}
          lead={service.tagline}
        />

        {/* Section 1: Overview & What's Included */}
        <section className="border-b border-hairline bg-paper py-16 md:py-24 dark:bg-[#121212]">
          <div className="section-padding mx-auto max-w-content">
            <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
              <div>
                <span className="eyebrow text-navy dark:text-[#00a3e0]">Service Overview</span>
                <h2 className="font-display mt-2 text-3xl font-semibold tracking-tight text-navy-deep dark:text-white sm:text-4xl">
                  {service.subtitle}
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-slate dark:text-gray-300 md:text-base">
                  {service.overview}
                </p>

                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <Link
                    href={`/quote?moveSize=${service.slug}`}
                    className="flex items-center gap-2 rounded-sm bg-navy px-6 py-3.5 text-xs font-bold text-white shadow-md transition-all hover:bg-navy-deep dark:bg-[#00a3e0] dark:text-[#092634] dark:hover:bg-[#38bdf8]"
                  >
                    <span>Get a Free {service.eyebrow} Quote</span>
                    <ArrowRight size={15} />
                  </Link>

                  <Link
                    href="/calculator"
                    className="flex items-center gap-2 rounded-sm border border-hairline bg-paper-muted px-5 py-3.5 text-xs font-bold text-navy-deep transition-all hover:border-navy dark:border-white/15 dark:bg-[#1e1e1e] dark:text-white dark:hover:border-[#00a3e0]"
                  >
                    <span>Estimate Moving Cost</span>
                  </Link>
                </div>
              </div>

              {/* Inclusions Card */}
              <div className="rounded-card border border-hairline bg-paper-muted p-6 shadow-xl dark:border-white/10 dark:bg-[#1e1e1e] sm:p-8">
                <div className="flex items-center gap-2.5 border-b border-hairline pb-4 dark:border-white/10">
                  <ShieldCheck size={20} className="text-navy dark:text-[#00a3e0]" />
                  <h3 className="font-display text-lg font-semibold text-navy-deep dark:text-white">
                    What&rsquo;s Included Every Move
                  </h3>
                </div>

                <ul className="mt-5 space-y-3.5">
                  {service.inclusions.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-xs leading-relaxed text-navy-deep dark:text-gray-200">
                      <CheckCircle2 size={16} className="shrink-0 text-emerald-600 dark:text-[#00a3e0]" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Transparent Pricing Guide */}
        <section className="border-b border-hairline bg-paper-muted py-16 md:py-24 dark:bg-[#181818]">
          <div className="section-padding mx-auto max-w-content">
            <div className="text-center">
              <span className="eyebrow text-navy dark:text-[#00a3e0]">Transparent Pricing</span>
              <h2 className="font-display mt-2 text-3xl font-semibold tracking-tight text-navy-deep dark:text-white sm:text-4xl">
                Clear Rates with Zero Hidden Fees
              </h2>
              <p className="mx-auto mt-2 max-w-lg text-xs leading-relaxed text-slate dark:text-gray-400">
                All packages include standard cargo insurance, protective moving blankets, and door-to-door transit.
              </p>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {service.pricingGuide.map((pkg, idx) => (
                <div
                  key={idx}
                  className="flex flex-col justify-between rounded-card border border-hairline bg-paper p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl dark:border-white/10 dark:bg-[#121212]"
                >
                  <div>
                    {pkg.badge && (
                      <span className="mb-3 inline-block rounded-full bg-navy/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-navy dark:bg-[#00a3e0]/20 dark:text-[#38bdf8]">
                        {pkg.badge}
                      </span>
                    )}
                    <h3 className="font-display text-xl font-semibold text-navy-deep dark:text-white">
                      {pkg.title}
                    </h3>
                    <p className="font-display mt-3 text-2xl font-bold text-navy dark:text-[#00a3e0]">
                      {pkg.rate}
                    </p>
                    <p className="mt-2 text-xs leading-relaxed text-slate dark:text-gray-400">
                      {pkg.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-hairline dark:border-white/10">
                    <Link
                      href={`/quote?moveSize=${service.slug}`}
                      className="flex w-full items-center justify-center gap-1.5 rounded-sm bg-navy py-2.5 text-xs font-bold text-white transition-all hover:bg-navy-deep dark:bg-[#00a3e0] dark:text-[#092634] dark:hover:bg-[#38bdf8]"
                    >
                      <span>Select Option</span>
                      <ArrowRight size={13} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 3: Process Workflow */}
        <section className="border-b border-hairline bg-navy-deep py-16 text-white dark:bg-[#0c0c0c] md:py-24">
          <div className="section-padding mx-auto max-w-content">
            <div className="text-center">
              <span className="eyebrow text-gold-soft dark:text-[#00a3e0]">Execution Plan</span>
              <h2 className="font-display mt-2 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                How We Execute Your Move
              </h2>
            </div>

            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {service.process.map((step, idx) => (
                <div
                  key={idx}
                  className="rounded-card border border-white/10 bg-white/5 p-6 backdrop-blur dark:border-white/5 dark:bg-[#141414]"
                >
                  <span className="font-display text-2xl font-bold text-gold-soft dark:text-[#00a3e0]">
                    {step.step}
                  </span>
                  <h3 className="font-display mt-4 text-base font-semibold text-white">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-white/75 dark:text-gray-400">
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 4: Service Specific FAQs */}
        {service.faqs && service.faqs.length > 0 && (
          <section className="border-b border-hairline bg-paper py-16 md:py-20 dark:bg-[#121212]">
            <div className="section-padding mx-auto max-w-3xl">
              <div className="flex items-center gap-2.5 text-navy dark:text-[#00a3e0]">
                <HelpCircle size={20} />
                <span className="eyebrow">Frequently Asked Questions</span>
              </div>
              <h2 className="font-display mt-2 text-2xl font-semibold text-navy-deep dark:text-white sm:text-3xl">
                Common Questions About {service.eyebrow}
              </h2>

              <div className="mt-8 space-y-4">
                {service.faqs.map((faq, idx) => (
                  <div
                    key={idx}
                    className="rounded-card border border-hairline bg-paper-muted p-5 shadow-xs dark:border-white/10 dark:bg-[#1e1e1e]"
                  >
                    <h3 className="text-sm font-semibold text-navy-deep dark:text-white">
                      {faq.question}
                    </h3>
                    <p className="mt-2 text-xs leading-relaxed text-slate dark:text-gray-300">
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Dynamic Contextual Call-To-Action */}
        <CallToAction
          heading={`Ready to schedule your ${service.eyebrow.toLowerCase()}?`}
          subtext="Lock in your preferred move date with a binding, itemized quote today."
        />
      </main>
    </>
  );
}
