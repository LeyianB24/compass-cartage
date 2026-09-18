// src/app/admin/layout.tsx

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen bg-paper text-navy-deep dark:bg-[#070c14] dark:text-white">
      {/* Industrial Drafting Grid Ambient Background */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 bg-[linear-gradient(to_right,rgba(197,168,128,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(197,168,128,0.03)_1px,transparent_1px)] bg-[size:3rem_3rem]"
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}