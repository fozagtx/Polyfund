import { ReactNode } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { EtheralShadow } from '@/components/ui/etheral-shadow';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Ethereal Shadow Background Effect */}
      <EtheralShadow
        color="rgba(58, 42, 106, 0.8)"
        animation={{ scale: 30, speed: 15 }}
        noise={{ opacity: 0.03, scale: 1 }}
        className="-z-10"
      />
      
      {/* Gradient overlays */}
      <div className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none">
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
