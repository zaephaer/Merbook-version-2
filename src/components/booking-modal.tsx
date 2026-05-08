
"use client"

import { useState, useMemo, useEffect } from "react";
import { format, parse, differenceInMinutes, isToday, addMinutes, startOfDay } from "date-fns";
import { Room, Booking } from "@/lib/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Clock, Users, Info, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface BookingModalProps {
  room: Room | null;
  selectedDate: Date;
  existingBookings: Booking[];
  isOpen: boolean;
  onClose: () => void;
  onBook: (booking: Omit<Booking, "id" | "createdAt">) => void;
}

export function BookingModal({
  room,
  selectedDate,
  existingBookings,
  isOpen,
  onClose,
  onBook,
}: BookingModalProps) {
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("10:00");
  const [title, setTitle] = useState("");
  const [pax, setPax] = useState<string>("1");
  const [specialRequest, setSpecialRequest] = useState("");
  const [currentTime, setCurrentTime] = useState("");
  const { toast } = useToast();

  const OFFICE_START = "08:00";
  const OFFICE_END = "17:00";

  // Generate 15-minute interval time slots
  const timeSlots = useMemo(() => {
    const slots = [];
    const baseDate = startOfDay(new Date());
    let current = parse(OFFICE_START, "HH:mm", baseDate);
    const stop = parse(OFFICE_END, "HH:mm", baseDate);
    
    while (current <= stop) {
      slots.push({
        value: format(current, "HH:mm"),
        label: format(current, "hh:mm a")
      });
      current = addMinutes(current, 15);
    }
    return slots;
  }, []);

  // Sync initial times when modal opens
  useEffect(() => {
    if (isOpen) {
      const now = format(new Date(), "HH:mm");
      setCurrentTime(now);

      if (isToday(selectedDate)) {
        // Find first available slot after now
        const nextSlot = timeSlots.find(s => s.value > now);
        if (nextSlot) {
          setStartTime(nextSlot.value);
          // Default to 1 hour later or last slot
          const startIndex = timeSlots.findIndex(s => s.value === nextSlot.value);
          const endIndex = Math.min(startIndex + 4, timeSlots.length - 1);
          setEndTime(timeSlots[endIndex].value);
        }
      } else {
        setStartTime("09:00");
        setEndTime("10:00");
      }
    }
  }, [isOpen, selectedDate, timeSlots]);

  const duration = useMemo(() => {
    try {
      const baseDate = new Date(2000, 0, 1);
      const start = parse(startTime, "HH:mm", baseDate);
      let end = parse(endTime, "HH:mm", baseDate);
      
      let durationMins = differenceInMinutes(end, start);
      return durationMins > 0 ? durationMins : 0;
    } catch (e) {
      return 0;
    }
  }, [startTime, endTime]);

  if (!room) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast({
        title: "Title Required",
        description: "Please provide a title for your meeting.",
        variant: "destructive",
      });
      return;
    }

    const paxNum = parseInt(pax);
    if (isNaN(paxNum) || paxNum <= 0) {
      toast({
        title: "Invalid Pax",
        description: "Please enter a valid number of participants.",
        variant: "destructive",
      });
      return;
    }

    if (paxNum > room.capacity) {
      toast({
        title: "Capacity Exceeded",
        description: `This room only fits ${room.capacity} people.`,
        variant: "destructive",
      });
      return;
    }

    // Double check time validation for today
    if (isToday(selectedDate)) {
      const now = format(new Date(), "HH:mm");
      if (startTime <= now) {
        toast({
          title: "Invalid Time",
          description: "You cannot book a room for a time that has already passed today.",
          variant: "destructive",
        });
        return;
      }
    }

    if (startTime >= endTime) {
      toast({
        title: "Invalid Range",
        description: "Start time must be before end time.",
        variant: "destructive",
      });
      return;
    }

    // Check for overlap
    const hasOverlap = existingBookings.some((b) => {
      if (b.roomId !== room.id || b.date !== format(selectedDate, "yyyy-MM-dd")) return false;
      return startTime < b.endTime && endTime > b.startTime;
    });

    if (hasOverlap) {
      toast({
        title: "Conflict Detected",
        description: "This room is already booked for the selected time slot.",
        variant: "destructive",
      });
      return;
    }

    onBook({
      roomId: room.id,
      roomName: room.name,
      userId: "user1", 
      userName: "John Doe",
      date: format(selectedDate, "yyyy-MM-dd"),
      startTime,
      endTime,
      title,
      pax: paxNum,
      specialRequest,
    });
    
    setTitle("");
    setPax("1");
    setSpecialRequest("");
    onClose();
  };

  const formatDuration = (mins: number) => {
    if (mins <= 0) return "Invalid duration";
    const hours = Math.floor(mins / 60);
    const m = mins % 60;
    if (hours > 0) {
      return `${hours}h ${m > 0 ? `${m}m` : ""}`;
    }
    return `${m}m`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={(val) => !val && onClose()}>
      <DialogContent className="sm:max-w-[425px] rounded-[2rem] border-none shadow-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black flex items-center gap-2">
            Book <span className="text-primary">{room.name}</span>
          </DialogTitle>
          <DialogDescription className="font-bold text-muted-foreground/60">
            {format(selectedDate, "MMMM do, yyyy")}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="bg-blue-50 p-4 rounded-2xl flex items-start gap-3 border border-blue-100">
            <Info className="h-5 w-5 text-blue-500 mt-0.5" />
            <div className="flex flex-col">
              <span className="text-xs font-black text-blue-700 uppercase tracking-wider">Office Hours</span>
              <span className="text-xs font-bold text-blue-600">8:00 AM — 5:00 PM (Weekdays Only)</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2 space-y-2">
              <Label htmlFor="title" className="text-xs font-black uppercase tracking-widest text-primary/50">Meeting Title</Label>
              <Input
                id="title"
                placeholder="e.g., Team Sync"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="h-12 rounded-2xl border-border/50 bg-secondary/30 focus-visible:ring-accent font-bold"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pax" className="text-xs font-black uppercase tracking-widest text-primary/50">No. of Pax</Label>
              <Input
                id="pax"
                type="number"
                min="1"
                max={room.capacity}
                value={pax}
                onChange={(e) => setPax(e.target.value)}
                className="h-12 rounded-2xl border-border/50 bg-secondary/30 focus-visible:ring-accent font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label className="text-xs font-black uppercase tracking-widest text-primary/50">Start Time</Label>
              <Select value={startTime} onValueChange={setStartTime}>
                <SelectTrigger className="h-12 rounded-2xl border-border/50 bg-secondary/30 font-bold">
                  <SelectValue placeholder="Start Time" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  {timeSlots.slice(0, -1).map((slot) => {
                    const isPast = isToday(selectedDate) && slot.value <= currentTime;
                    return (
                      <SelectItem key={slot.value} value={slot.value} disabled={isPast} className="font-bold rounded-lg">
                        {slot.label}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label className="text-xs font-black uppercase tracking-widest text-primary/50">End Time</Label>
              <Select value={endTime} onValueChange={setEndTime}>
                <SelectTrigger className="h-12 rounded-2xl border-border/50 bg-secondary/30 font-bold">
                  <SelectValue placeholder="End Time" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  {timeSlots.map((slot) => {
                    const isPast = isToday(selectedDate) && slot.value <= currentTime;
                    const isBeforeStart = slot.value <= startTime;
                    return (
                      <SelectItem key={slot.value} value={slot.value} className="font-bold rounded-lg" disabled={isPast || isBeforeStart}>
                        {slot.label}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="p-4 rounded-2xl flex items-center justify-between transition-colors bg-primary/5 text-primary">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span className="text-xs font-black uppercase tracking-widest">Total Duration</span>
            </div>
            <span className="font-black">{formatDuration(duration)}</span>
          </div>

          <div className="space-y-2">
            <Label htmlFor="requests" className="text-xs font-black uppercase tracking-widest text-primary/50 flex items-center gap-2">
              <MessageSquare className="h-3 w-3" /> Special Requests
            </Label>
            <Textarea
              id="requests"
              placeholder="e.g., Need coffee/tea, HDMI connectivity, specific room layout..."
              value={specialRequest}
              onChange={(e) => setSpecialRequest(e.target.value)}
              className="min-h-[100px] rounded-2xl border-border/50 bg-secondary/30 focus-visible:ring-accent font-bold resize-none"
            />
          </div>

          <DialogFooter className="gap-2 sm:gap-0 pt-2">
            <Button type="button" variant="ghost" onClick={onClose} className="rounded-2xl font-bold h-12">
              Cancel
            </Button>
            <Button type="submit" className="bg-primary hover:bg-primary/90 text-white font-black h-12 rounded-2xl px-8 shadow-lg shadow-primary/20">
              Confirm Booking
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
