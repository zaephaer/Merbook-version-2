"use client"

import { Button } from "@/components/ui/button";
import { ChevronRight, CheckCircle2, MousePointer2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { cn } from "@/lib/utils";

const Logo = () => (
  <div className="flex items-center gap-2 group">
    <div className="h-10 w-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
      <MousePointer2 className="h-5 w-5 text-accent rotate-12" />
    </div>
    <div className="flex flex-col -space-y-1">
      <span className="text-3xl font-black tracking-tighter text-primary uppercase leading-none">
        MER<span className="text-accent">BOOK</span>
      </span>
      <span className="text-[8px] font-black uppercase tracking-[0.2em] text-muted-foreground/50 pl-0.5">
        Meeting Room Booking
      </span>
    </div>
  </div>
);

export default function LandingPage() {
  const heroImage = PlaceHolderImages.find(img => img.id === 'hero-image');

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="px-4 lg:px-8 h-20 flex items-center bg-white border-b">
        <Link className="flex items-center" href="/">
          <Logo />
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Button asChild variant="ghost" className="font-bold">
            <Link href="/dashboard">Login</Link>
          </Button>
          <Button asChild className="bg-primary font-bold">
            <Link href="/dashboard">Dashboard</Link>
          </Button>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6 mx-auto max-w-7xl">
            <div className="grid gap-12 lg:grid-cols-2 items-center">
              <div className="flex flex-col justify-center space-y-8">
                <div className="space-y-6">
                  <h1 className="text-5xl font-bold tracking-tight sm:text-7xl text-primary leading-[1.1]">
                    Smarter Room <br /> <span className="text-accent">Booking Starts Here</span>
                  </h1>
                  
                  <div className="flex flex-col gap-4">
                    <div className="inline-flex items-center self-start gap-2 py-1.5 px-4 rounded-full bg-primary/10 text-primary border border-primary/20">
                      <span className="flex h-2 w-2 rounded-full bg-accent animate-pulse" />
                      <span className="text-xs font-black uppercase tracking-widest">
                        MERBOOK — Meeting Room Booking application
                      </span>
                    </div>

                    <p className="max-w-[600px] text-muted-foreground md:text-xl font-medium leading-relaxed">
                      Eliminate scheduling conflicts and manual bookings. Check real-time room availability and reserve your meeting space in seconds.
                    </p>
                  </div>
                </div>
                
                <div className="flex flex-col gap-3 min-[400px]:flex-row">
                  <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground px-8 h-14 rounded-xl text-lg font-bold shadow-xl shadow-accent/20 transition-transform hover:scale-105">
                    <Link href="/dashboard" className="flex items-center">
                      Get Started <ChevronRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center text-sm font-bold text-primary/70">
                    <CheckCircle2 className="h-5 w-5 text-accent mr-2 shrink-0" /> Real-time status
                  </div>
                  <div className="flex items-center text-sm font-bold text-primary/70">
                    <CheckCircle2 className="h-5 w-5 text-accent mr-2 shrink-0" /> Zero conflicts
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="relative overflow-hidden rounded-[2.5rem] shadow-2xl bg-white ring-1 ring-border/50">
                  {heroImage && (
                    <Image
                      alt={heroImage.description}
                      className="w-full aspect-[4/3] object-cover"
                      height={600}
                      src={heroImage.imageUrl}
                      width={800}
                      priority
                      data-ai-hint={heroImage.imageHint}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-4 sm:flex-row py-8 w-full items-center px-4 md:px-12 border-t bg-white">
        <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">© 2026 MERBOOK by PIJ Property Development.</p>
        <p className="sm:ml-auto text-xs font-bold text-primary/40 uppercase tracking-widest">
          Efficiency through Innovation
        </p>
      </footer>
    </div>
  );
}
