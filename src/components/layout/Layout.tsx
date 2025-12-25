import { ReactNode } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Global gradient background */}
      <div className="fixed inset-0 bg-gradient-hero -z-10" />
      <div className="fixed top-0 left-0 w-full h-full -z-10">
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-peach/15 rounded-full blur-[150px]" />
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-lavender/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[700px] h-[700px] bg-violet/20 rounded-full blur-[180px]" />
      </div>
      
      <Header />
      <main className="flex-1 pt-20">
        {children}
      </main>
      <Footer />
    </div>
  );
}
