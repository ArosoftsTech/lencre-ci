import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";

/**
 * PublicLayoutWrapper — L'Encre
 * 
 * Ce composant sert de layout pour toutes les pages publiques (Landing, Catégories, etc.)
 */
export default function PublicLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main id="main-content">{children}</main>
      <Footer />
    </>
  );
}
