import PublicLayoutWrapper from "@/components/PublicLayoutWrapper/PublicLayoutWrapper";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PublicLayoutWrapper>{children}</PublicLayoutWrapper>;
}
