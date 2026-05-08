
"use client"

import { useState, useEffect, useMemo } from "react";
import { Navbar } from "@/components/navbar";
import { mockBookings } from "@/lib/mock-data";
import { Booking } from "@/lib/types";
import { format, isPast, parseISO, getMonth, getYear } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Clock, MapPin, Trash2, LayoutList, FilterX, Calendar, Users, MessageSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function MyBookings() {
  const [isMounted, setIsMounted] = useState(false);
  const [userBookings, setUserBookings] = useState<Booking[]>(mockBookings.filter(b => b.userId === 'user1'));
  const [selectedMonth, setSelectedMonth] = useState<string>("all");
  const [selectedYear, setSelectedYear] = useState<string>("all");
  const { toast } = useToast();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleCancelBooking = (bookingId: string) => {
    setUserBookings(prev => prev.filter(b => b.id !== bookingId));
    toast({
      title: "Booking Cancelled",
      description: "The room reservation has been successfully removed.",
    });
  };

  const isFutureBooking = (date: string, endTime: string) => {
    const bookingDate = parseISO(`${date}T${endTime}`);
    return !isPast(bookingDate);
  };

  const filteredBookings = useMemo(() => {
    return userBookings.filter(b => {
      const bookingDate = parseISO(b.date);
      const monthMatch = selectedMonth === "all" || (getMonth(bookingDate) + 1).toString().padStart(2, '0') === selectedMonth;
      const yearMatch = selectedYear === "all" || getYear(bookingDate).toString() === selectedYear;
      return monthMatch && yearMatch;
    }).sort((a,b) => b.date.localeCompare(a.date));
  }, [userBookings, selectedMonth, selectedYear]);

  const years = useMemo(() => {
    const yearsSet = new Set(userBookings.map(b => getYear(parseISO(b.date)).toString()));
    return Array.from(yearsSet).sort().reverse();
  }, [userBookings]);

  const months = [
    { value: "01", label: "January" },
    { value: "02", label: "February" },
    { value: "03", label: "March" },
    { value: "04", label: "April" },
    { value: "05", label: "May" },
    { value: "06", label: "June" },
    { value: "07", label: "July" },
    { value: "08", label: "August" },
    { value: "09", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
  ];

  const resetFilters = () => {
    setSelectedMonth("all");
    setSelectedYear("all");
  };

  if (!isMounted) return null;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary">My Bookings</h1>
          <p className="text-muted-foreground font-medium mt-1">Manage your upcoming and past meeting room bookings.</p>
        </div>

        <Card className="rounded-2xl border-none shadow-sm overflow-hidden">
          <CardHeader className="bg-white p-6 border-b flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <LayoutList className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-bold">All Bookings</h2>
            </div>
            
            <div className="flex items-center gap-3 w-full md:w-auto">
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger className="h-9 rounded-lg w-[140px] font-medium">
                  <SelectValue placeholder="Month" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Months</SelectItem>
                  {months.map(m => (
                    <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger className="h-9 rounded-lg w-[120px] font-medium">
                  <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Years</SelectItem>
                  {years.map(y => (
                    <SelectItem key={y} value={y}>{y}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button 
                variant="ghost" 
                size="icon" 
                className="h-9 w-9 rounded-lg"
                onClick={resetFilters}
                title="Reset Filters"
              >
                <FilterX className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {filteredBookings.length > 0 ? (
              <Table>
                <TableHeader className="bg-primary hover:bg-primary">
                  <TableRow className="border-none">
                    <TableHead className="pl-6 w-16 text-primary-foreground font-bold uppercase text-[10px] tracking-widest">No.</TableHead>
                    <TableHead className="text-primary-foreground font-bold uppercase text-[10px] tracking-widest">Date & Time</TableHead>
                    <TableHead className="text-primary-foreground font-bold uppercase text-[10px] tracking-widest">Room & Meeting</TableHead>
                    <TableHead className="text-primary-foreground font-bold uppercase text-[10px] tracking-widest">Pax</TableHead>
                    <TableHead className="text-primary-foreground font-bold uppercase text-[10px] tracking-widest">Special Requests</TableHead>
                    <TableHead className="text-primary-foreground font-bold uppercase text-[10px] tracking-widest">Status</TableHead>
                    <TableHead className="text-right pr-6 text-primary-foreground font-bold uppercase text-[10px] tracking-widest">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBookings.map((booking, index) => {
                    const future = isFutureBooking(booking.date, booking.endTime);
                    return (
                      <TableRow key={booking.id} className="group hover:bg-muted/50 transition-colors">
                        <TableCell className="pl-6 py-4 font-medium text-muted-foreground">
                          {index + 1}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-bold text-primary">{format(parseISO(booking.date), "MMM d, yyyy")}</span>
                            <div className="flex items-center text-xs font-medium text-muted-foreground mt-0.5">
                              <Clock className="h-3 w-3 mr-1" />
                              {booking.startTime} - {booking.endTime}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                              <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                              <span className="font-bold">{booking.roomName}</span>
                            </div>
                            <span className="text-xs font-medium text-muted-foreground mt-0.5 truncate max-w-[200px]">
                              {booking.title}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1.5 font-bold text-primary">
                            <Users className="h-3.5 w-3.5 text-muted-foreground" />
                            {booking.pax}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1.5 max-w-[200px]">
                            {booking.specialRequest ? (
                              <>
                                <MessageSquare className="h-3.5 w-3.5 text-accent shrink-0" />
                                <span className="text-xs text-muted-foreground truncate">{booking.specialRequest}</span>
                              </>
                            ) : (
                              <span className="text-[10px] text-muted-foreground/40 italic">No requests</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {future ? (
                            <Badge className="bg-green-50 text-green-700 border-green-100 font-bold text-[10px] uppercase">Upcoming</Badge>
                          ) : (
                            <Badge variant="secondary" className="bg-muted text-muted-foreground font-bold text-[10px] uppercase">Completed</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right pr-6">
                          {future && (
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="sm" className="text-destructive hover:bg-destructive/10 font-bold h-8 px-3">
                                  <Trash2 className="h-3.5 w-3.5 mr-1.5" /> Cancel
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent className="rounded-2xl">
                                <AlertDialogHeader>
                                  <AlertDialogTitle className="font-bold">Cancel Reservation?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to cancel your meeting in <span className="text-primary font-bold">{booking.roomName}</span>? This will free up the space for others.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel className="rounded-lg font-bold">Keep it</AlertDialogCancel>
                                  <AlertDialogAction 
                                    className="bg-destructive hover:bg-destructive/90 rounded-lg font-bold"
                                    onClick={() => handleCancelBooking(booking.id)}
                                  >
                                    Confirm Cancellation
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            ) : (
              <div className="py-20 text-center flex flex-col items-center">
                <div className="bg-muted p-4 rounded-full mb-4">
                  <Calendar className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-bold text-primary">No Bookings Found</h3>
                <p className="text-muted-foreground text-sm mt-1 mb-6">You haven't made any bookings that match these filters.</p>
                <Button asChild className="bg-primary rounded-lg font-bold px-6">
                  <Link href="/dashboard">Book a Room</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
