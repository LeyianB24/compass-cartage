// src/app/admin/layout.tsx

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-paper dark:bg-[#070c14]">
      {children}
    </div>
  );
}