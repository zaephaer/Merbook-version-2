"use client"

import { useState, useEffect, useMemo } from "react";
import { Navbar } from "@/components/navbar";
import { mockBookings } from "@/lib/mock-data";
import { Booking } from "@/lib/types";
import { format, isToday, parseISO, getMonth, getYear } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar, Clock, MapPin, Trash2, Search, Activity, Users, BarChart3, FilterX } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
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

export default function BookingDashboard() {
  const [isMounted, setIsMounted] = useState(false);
  const [allBookings, setAllBookings] = useState<Booking[]>(mockBookings);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMonth, setSelectedMonth] = useState<string>("all");
  const [selectedYear, setSelectedYear] = useState<string>("all");
  const { toast } = useToast();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleCancelBooking = (bookingId: string) => {
    setAllBookings(prev => prev.filter(b => b.id !== bookingId));
    toast({
      title: "Booking Terminated",
      description: "Admin action: The reservation has been cancelled.",
    });
  };

  const filteredBookings = useMemo(() => {
    const filtered = allBookings.filter(b => {
      const searchMatch = 
        b.roomName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.title.toLowerCase().includes(searchTerm.toLowerCase());
      
      const bookingDate = parseISO(b.date);
      const monthMatch = selectedMonth === "all" || (getMonth(bookingDate) + 1).toString().padStart(2, '0') === selectedMonth;
      const yearMatch = selectedYear === "all" || getYear(bookingDate).toString() === selectedYear;

      return searchMatch && monthMatch && yearMatch;
    });
    
    return filtered.sort((a,b) => b.date.localeCompare(a.date));
  }, [allBookings, searchTerm, selectedMonth, selectedYear]);

  const todayBookingsCount = allBookings.filter(b => isToday(parseISO(b.date))).length;
  const uniqueUsersCount = new Set(allBookings.map(b => b.userId)).size;

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedMonth("all");
    setSelectedYear("all");
  };

  if (!isMounted) return null;

  const years = Array.from(new Set(allBookings.map(b => getYear(parseISO(b.date)).toString()))).sort().reverse();
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

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-12 max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary rounded-xl shadow-lg shadow-primary/20">
                <Activity className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-3xl font-headline font-black text-primary uppercase tracking-tight">Booking Dashboard</h1>
            </div>
            <p className="text-muted-foreground font-bold pl-11">Real-time oversight of all room reservations.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="rounded-[2rem] border-none shadow-sm bg-white overflow-hidden">
            <CardContent className="p-8 flex items-center gap-6">
              <div className="h-14 w-14 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
                <BarChart3 className="h-7 w-7" />
              </div>
              <div>
                <p className="text-xs font-black text-muted-foreground uppercase tracking-widest">Total Active</p>
                <p className="text-2xl font-black text-primary">{allBookings.length}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="rounded-[2rem] border-none shadow-sm bg-white overflow-hidden">
            <CardContent className="p-8 flex items-center gap-6">
              <div className="h-14 w-14 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-600">
                <Calendar className="h-7 w-7" />
              </div>
              <div>
                <p className="text-xs font-black text-muted-foreground uppercase tracking-widest">Scheduled Today</p>
                <p className="text-2xl font-black text-primary">{todayBookingsCount}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="rounded-[2rem] border-none shadow-sm bg-white overflow-hidden">
            <CardContent className="p-8 flex items-center gap-6">
              <div className="h-14 w-14 rounded-2xl bg-green-50 flex items-center justify-center text-green-600">
                <Users className="h-7 w-7" />
              </div>
              <div>
                <p className="text-xs font-black text-muted-foreground uppercase tracking-widest">Unique Users</p>
                <p className="text-2xl font-black text-primary">{uniqueUsersCount}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col md:flex-row items-end gap-4 mb-8 bg-accent p-6 rounded-[2rem] border-none shadow-xl shadow-accent/20">
          <div className="flex-1 w-full space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-white/90 ml-1">Search Bookings</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary/40" />
              <Input 
                placeholder="Title, user, or room..." 
                className="pl-10 h-11 rounded-xl bg-slate-100 border-none text-primary placeholder:text-slate-400 focus-visible:ring-primary/20 font-bold"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="w-full md:w-48 space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-white/90 ml-1">Month</label>
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger className="h-11 rounded-xl bg-slate-100 border-none text-primary font-bold">
                <SelectValue placeholder="All Months" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="all">All Months</SelectItem>
                {months.map(m => (
                  <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="w-full md:w-40 space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-white/90 ml-1">Year</label>
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="h-11 rounded-xl bg-slate-100 border-none text-primary font-bold">
                <SelectValue placeholder="All Years" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="all">All Years</SelectItem>
                {years.map(y => (
                  <SelectItem key={y} value={y}>{y}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-11 w-11 rounded-xl bg-white/20 hover:bg-white/30 text-white"
            onClick={resetFilters}
            title="Clear Filters"
          >
            <FilterX className="h-5 w-5" />
          </Button>
        </div>

        <Card className="rounded-[2rem] border-none shadow-lg bg-white overflow-hidden">
          <CardHeader className="p-8 border-b bg-slate-50/50 flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-black text-primary">Live Booking Feed</h2>
            </div>
            <Badge variant="outline" className="rounded-full font-black text-[10px] border-slate-200 text-slate-500 px-3">
              {filteredBookings.length} Results
            </Badge>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-primary">
                <TableRow className="hover:bg-transparent border-none">
                  <TableHead className="pl-8 w-16 font-black uppercase text-[10px] tracking-widest text-primary-foreground">No.</TableHead>
                  <TableHead className="font-black uppercase text-[10px] tracking-widest text-primary-foreground">Meeting Title</TableHead>
                  <TableHead className="font-black uppercase text-[10px] tracking-widest text-primary-foreground">User</TableHead>
                  <TableHead className="font-black uppercase text-[10px] tracking-widest text-primary-foreground">Room</TableHead>
                  <TableHead className="font-black uppercase text-[10px] tracking-widest text-primary-foreground">Date & Time</TableHead>
                  <TableHead className="text-right pr-8 font-black uppercase text-[10px] tracking-widest text-primary-foreground">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBookings.length > 0 ? (
                  filteredBookings.map((booking, index) => (
                    <TableRow key={booking.id} className="group border-slate-100">
                      <TableCell className="pl-8 py-6 font-bold text-slate-400">
                        {index + 1}
                      </TableCell>
                      <TableCell>
                        <span className="font-black text-primary block max-w-[200px] truncate">{booking.title}</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-accent/10 flex items-center justify-center text-accent font-black text-xs">
                            {booking.userName.charAt(0)}
                          </div>
                          <span className="font-bold text-slate-700">{booking.userName}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-3 w-3 text-muted-foreground" />
                          <span className="font-bold text-slate-700">{booking.roomName}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-black text-sm text-primary">{format(parseISO(booking.date), "MMM d, yyyy")}</span>
                          <span className="text-xs font-bold text-muted-foreground">{booking.startTime} - {booking.endTime}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right pr-8">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm" className="text-destructive hover:bg-destructive/5 font-bold rounded-xl h-9">
                              <Trash2 className="h-4 w-4 mr-2" /> Cancel
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="rounded-[2rem]">
                            <AlertDialogHeader>
                              <AlertDialogTitle className="font-black text-xl">Administrative Cancellation</AlertDialogTitle>
                              <AlertDialogDescription className="font-bold">
                                You are about to cancel <span className="text-primary">{booking.userName}&apos;s</span> meeting in <span className="text-primary">{booking.roomName}</span>. This will notify the user and free up the space.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter className="gap-2">
                              <AlertDialogCancel className="rounded-xl font-bold">Keep it</AlertDialogCancel>
                              <AlertDialogAction 
                                className="bg-destructive hover:bg-destructive/90 rounded-xl font-black shadow-lg shadow-destructive/20"
                                onClick={() => handleCancelBooking(booking.id)}
                              >
                                Terminate Booking
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="py-24 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <Activity className="h-10 w-10 text-slate-200 mb-2" />
                        <h3 className="text-lg font-black text-primary">No matching logs found</h3>
                        <p className="text-muted-foreground font-bold">Try adjusting your filters or search terms.</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
