// src/app/page.tsx
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Hero from "@/components/Hero";
import ServiceCard from "@/components/ServiceCard";
import StatsCounter from "@/components/StatsCounter";
import Testimonials from "@/components/Testimonials";
import CallToAction from "@/components/CallToAction";
import { SERVICES } from "@/lib/constants";

export default function HomePage() {
  return (
    <>
      <Hero />

      {/* Services preview */}
      <section className="bg-paper">
        <div className="section-padding mx-auto max-w-content py-20">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="eyebrow mb-3">What We Do</p>
              <h2 className="font-display text-3xl font-semibold text-navy-deep">
                Every kind of move, one trusted crew
              </h2>
            </div>
            <Link
              href="/services"
              className="flex items-center gap-1.5 text-sm font-semibold text-navy-deep hover:text-gold"
            >
              View all services
              <ArrowRight size={15} />
            </Link>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICES.slice(0, 3).map((service, i) => (
              <ServiceCard
                key={service.title}
                title={service.title}
                description={service.description}
                index={i}
              />
            ))}
          </div>
        </div>
      </section>

      <StatsCounter />

      <Testimonials />
      <CallToAction />
    </>
  );
}