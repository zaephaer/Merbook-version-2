
"use client"

import { useState, useEffect } from "react";
import { Navbar } from "@/components/navbar";
import { mockRooms, mockBookings } from "@/lib/mock-data";
import { Room, Booking } from "@/lib/types";
import { format, addDays, startOfDay, isWeekend, isBefore } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar as CalendarIcon, Users, MapPin, Plus, ChevronLeft, ChevronRight, Clock, Target, CalendarDays } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { BookingModal } from "@/components/booking-modal";
import { useToast } from "@/hooks/use-toast";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

export default function Dashboard() {
  const [isMounted, setIsMounted] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [bookings, setBookings] = useState<Booking[]>(mockBookings);
  const [rooms, setRooms] = useState<Room[]>(mockRooms);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    let today = startOfDay(new Date());
    while (isWeekend(today)) {
      today = addDays(today, 1);
    }
    setSelectedDate(today);
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-12 max-w-7xl animate-pulse">
           <div className="h-64 bg-slate-200 rounded-[2rem] mb-12" />
           <div className="h-8 w-64 bg-slate-200 rounded-lg mb-8" />
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map(i => <div key={i} className="h-96 bg-slate-200 rounded-[2rem]" />)}
           </div>
        </main>
      </div>
    );
  }

  const today = startOfDay(new Date());
  const isPastDate = isBefore(selectedDate, today);

  const handleNextDay = () => {
    setSelectedDate(prev => {
      let next = addDays(prev, 1);
      while (isWeekend(next)) {
        next = addDays(next, 1);
      }
      return next;
    });
  };

  const handlePrevDay = () => {
    setSelectedDate(prev => {
      let prevDay = addDays(prev, -1);
      while (isWeekend(prevDay)) {
        prevDay = addDays(prevDay, -1);
      }
      return prevDay;
    });
  };

  const handleOpenBooking = (room: Room) => {
    if (isPastDate) {
      toast({
        title: "Booking Unavailable",
        description: "You cannot book a room for a past date.",
        variant: "destructive",
      });
      return;
    }
    setSelectedRoom(room);
    setIsModalOpen(true);
  };

  const handleNewBooking = (newBookingData: Omit<Booking, "id" | "createdAt">) => {
    const newBooking: Booking = {
      ...newBookingData,
      id: `b-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setBookings(prev => [...prev, newBooking]);
    toast({
      title: "Booking Confirmed",
      description: `You have successfully reserved ${newBooking.roomName}.`,
    });
  };

  const getRoomAvailabilityStatus = (room: Room) => {
    const dateStr = format(selectedDate, "yyyy-MM-dd");
    const roomBookings = bookings.filter(b => b.roomId === room.id && b.date === dateStr);
    
    if (isPastDate) return { label: "Expired", color: "bg-slate-200 text-slate-500 shadow-none" };
    
    if (roomBookings.length === 0) {
      return { 
        label: "Available", 
        color: "bg-gradient-to-r from-orange-300 to-orange-200 text-black shadow-lg shadow-orange-300/40 border-none" 
      };
    }
    
    const now = new Date();
    const currentTimeStr = format(now, "HH:mm");
    const isCurrentlyBooked = roomBookings.some(b => currentTimeStr >= b.startTime && currentTimeStr <= b.endTime && dateStr === format(now, "yyyy-MM-dd"));

    if (isCurrentlyBooked) {
      return { 
        label: "Busy Now", 
        color: "bg-gradient-to-r from-orange-700 to-orange-600 text-white shadow-lg shadow-orange-600/40 border-none" 
      };
    }
    
    return { 
      label: `${roomBookings.length} Bookings`, 
      color: "bg-gradient-to-r from-orange-600 to-orange-500 text-white shadow-lg shadow-orange-500/40 border-none" 
    };
  };

  const isBookingInPast = (booking: Booking) => {
    const dateStr = format(selectedDate, "yyyy-MM-dd");
    const now = new Date();
    const todayStr = format(now, "yyyy-MM-dd");
    
    if (dateStr < todayStr) return true;
    if (dateStr > todayStr) return false;
    
    const currentTimeStr = format(now, "HH:mm");
    return booking.endTime < currentTimeStr;
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-12 max-w-7xl">
        <div className="mb-12">
          <div className="bg-primary rounded-[2rem] p-8 text-white flex flex-col md:flex-row justify-between items-center gap-8 shadow-2xl overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl" />
            <div className="relative z-10 flex flex-col space-y-2 text-center md:text-left">
              <h1 className="text-3xl font-headline font-bold">Let's book your space</h1>
              <p className="text-white/70 font-medium">Plan your day and stay productive.</p>
            </div>
            
            <div className="flex flex-col items-center gap-1 relative z-10">
              <div className="flex items-center gap-2 bg-white/10 p-2 rounded-2xl backdrop-blur-md border border-white/10 min-w-[320px]">
                <Button variant="ghost" size="icon" onClick={handlePrevDay} className="text-white hover:bg-white/20 rounded-xl">
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" className="flex-1 h-auto flex flex-col items-center px-4 py-1 hover:bg-white/10 rounded-xl text-white">
                      <span className="text-sm font-bold uppercase tracking-[0.2em] text-white/50 mb-0.5">
                        {format(selectedDate, "EEEE").toUpperCase()}
                      </span>
                      <span className="text-xl font-black whitespace-nowrap flex items-center gap-2">
                        {format(selectedDate, "d MMM yyyy")}
                        <CalendarDays className="h-5 w-5 text-accent" />
                      </span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 rounded-3xl overflow-hidden bg-white" align="center">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={(date) => date && setSelectedDate(date)}
                      disabled={(date) => isWeekend(date)}
                      initialFocus
                      className="bg-white"
                    />
                  </PopoverContent>
                </Popover>

                <Button variant="ghost" size="icon" onClick={handleNextDay} className="text-white hover:bg-white/20 rounded-xl">
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </div>
              
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] font-black text-white/50 uppercase tracking-[0.25em]">
                  Office Hours: 8 AM - 5 PM
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {rooms.map((room) => {
            const status = getRoomAvailabilityStatus(room);
            const dateStr = format(selectedDate, "yyyy-MM-dd");
            const roomDayBookings = bookings
              .filter(b => b.roomId === room.id && b.date === dateStr)
              .sort((a, b) => a.startTime.localeCompare(b.startTime));

            return (
              <Card key={room.id} className={cn(
                "group overflow-hidden rounded-[2rem] border-none shadow-lg hover:shadow-2xl transition-all duration-500 bg-white",
                !isPastDate && "hover:-translate-y-2"
              )}>
                <div className="relative h-56 w-full">
                  <img 
                    src={room.imageUrl} 
                    alt={room.name} 
                    className={cn(
                      "w-full h-full object-cover transition-transform duration-700",
                      !isPastDate && "group-hover:scale-110",
                      isPastDate && "grayscale brightness-75"
                    )}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent" />
                  <div className="absolute top-4 right-4">
                    <Badge className={cn("px-4 py-1.5 rounded-full font-black text-xs uppercase transition-all duration-300", status.color)}>
                      {status.label}
                    </Badge>
                  </div>
                  <div className="absolute bottom-6 left-6 text-white">
                    <h3 className="text-2xl font-black">{room.name}</h3>
                  </div>
                </div>
                
                <CardContent className="p-8">
                  <div className="flex flex-wrap gap-2 mb-6">
                    {[...room.facilities].sort().slice(0, 3).map(f => (
                      <Badge key={f} className="rounded-full bg-accent hover:bg-accent/90 text-white border-none font-black text-[10px] px-3 shadow-sm">
                        {f}
                      </Badge>
                    ))}
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-black text-muted-foreground uppercase tracking-widest">Schedule</p>
                      {roomDayBookings.length > 0 && <span className="text-[10px] font-bold text-accent uppercase">Active today</span>}
                    </div>
                    
                    {roomDayBookings.length > 0 ? (
                      <div className="space-y-3">
                        {roomDayBookings.slice(0, 2).map(b => {
                          const isPast = isBookingInPast(b);
                          return (
                            <div key={b.id} className={cn(
                              "flex flex-col gap-1 p-3 rounded-2xl border transition-all",
                              isPast ? "bg-slate-50 border-slate-100 opacity-60" : "bg-background border-border/50"
                            )}>
                              <div className="flex items-center gap-3">
                                <div className={cn(
                                  "h-8 w-8 rounded-lg flex items-center justify-center shrink-0",
                                  isPast ? "bg-slate-200/50 text-slate-400" : "bg-primary/5 text-primary"
                                )}>
                                  <Clock className="h-4 w-4" />
                                </div>
                                <div className="flex flex-col flex-1 min-w-0">
                                  <span className={cn(
                                    "text-sm font-black",
                                    isPast ? "text-slate-400 line-through" : "text-primary"
                                  )}>
                                    {b.startTime} - {b.endTime}
                                  </span>
                                  <span className={cn(
                                    "text-sm font-bold truncate",
                                    isPast ? "text-slate-400 line-through" : "text-primary"
                                  )}>
                                    {b.title}
                                  </span>
                                </div>
                              </div>
                              <div className="pl-11">
                                <span className={cn(
                                  "text-[10px] font-bold uppercase tracking-tighter",
                                  isPast ? "text-slate-400" : "text-muted-foreground"
                                )}>
                                  Booked by: <span className={cn(isPast ? "text-slate-400" : "text-accent")}>{b.userName}</span>
                                </span>
                              </div>
                            </div>
                          );
                        })}
                        {roomDayBookings.length > 2 && (
                          <p className="text-center text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">
                            + {roomDayBookings.length - 2} more bookings today
                          </p>
                        )}
                      </div>
                    ) : (
                      <div className="py-8 text-center bg-secondary/30 rounded-[1.5rem] border border-dashed border-primary/10">
                        <p className="text-sm font-bold text-primary/40">Open for reservations</p>
                      </div>
                    )}
                  </div>
                </CardContent>
                
                <CardFooter className="px-8 pb-8 pt-0">
                  <Button 
                    disabled={isPastDate}
                    className={cn(
                      "w-full font-black h-12 rounded-2xl shadow-lg transition-all",
                      isPastDate 
                        ? "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none" 
                        : "bg-accent hover:bg-accent/90 text-accent-foreground shadow-accent/20 group-hover:scale-[1.02]"
                    )}
                    onClick={() => handleOpenBooking(room)}
                  >
                    <Plus className="h-5 w-5 mr-2" /> {isPastDate ? "Booking Closed" : "Book Space"}
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </main>

      <BookingModal
        room={selectedRoom}
        selectedDate={selectedDate}
        existingBookings={bookings}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onBook={handleNewBooking}
      />
    </div>
  );
}
