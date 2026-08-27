export default function AdminLayout({ children }: { children: React.ReactNode }) {
  // Auth protection is handled by middleware — layout just renders children
  return <>{children}</>
}
