// src/components/ServiceCard.tsx
type ServiceCardProps = {
  title: string;
  description: string;
  index: number;
};

export default function ServiceCard({ title, description, index }: ServiceCardProps) {
  return (
    <div className="group relative border border-hairline bg-white p-7 transition-colors hover:border-navy-deep">
      <span className="font-display text-sm text-gold">
        {String(index + 1).padStart(2, "0")}
      </span>
      <h3 className="mt-3 font-display text-xl font-semibold text-navy-deep">
        {title}
      </h3>
      <p className="mt-3 text-sm leading-relaxed text-slate">{description}</p>
    </div>
  );
}