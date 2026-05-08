
"use client"

import { useState, useRef } from "react";
import { Navbar } from "@/components/navbar";
import { mockRooms } from "@/lib/mock-data";
import { Room } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Plus, Pencil, Trash2, ShieldCheck, Users, Settings2, Image as ImageIcon, Upload, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

const AVAILABLE_FACILITIES = [
  "AC",
  "Audio System",
  "Coffee",
  "HDMI Connectivity",
  "Hybrid-Ready",
  "Notebook/PC",
  "Physical only",
  "Projector",
  "Smart Camera",
  "TV",
  "Whiteboard",
  "Wi-Fi"
].sort();

interface RoomFormData {
  id?: string;
  name: string;
  capacity: string;
  imageUrl: string;
  facilities: string[];
}

interface RoomFormFieldsProps {
  formData: RoomFormData;
  setFormData: React.Dispatch<React.SetStateAction<RoomFormData>>;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleFacilityToggle: (facility: string) => void;
}

const RoomFormFields = ({ 
  formData, 
  setFormData, 
  fileInputRef, 
  handleFileChange, 
  handleFacilityToggle 
}: RoomFormFieldsProps) => (
  <div className="space-y-4">
    <div className="space-y-2">
      <Label className="text-xs font-black uppercase tracking-widest text-primary/50">Room Name</Label>
      <Input 
        placeholder="e.g., Innovation Lab" 
        className="h-12 rounded-2xl bg-slate-50 border-none font-bold focus-visible:ring-accent"
        value={formData.name}
        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
      />
    </div>
    <div className="space-y-2">
      <Label className="text-xs font-black uppercase tracking-widest text-primary/50">Capacity</Label>
      <Input 
        type="number" 
        placeholder="e.g., 10" 
        className="h-12 rounded-2xl bg-slate-50 border-none font-bold focus-visible:ring-accent"
        value={formData.capacity}
        onChange={(e) => setFormData(prev => ({ ...prev, capacity: e.target.value }))}
      />
    </div>
    <div className="space-y-2">
      <Label className="text-xs font-black uppercase tracking-widest text-primary/50">Room Photo</Label>
      <div className="space-y-3">
        {formData.imageUrl && (
          <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-slate-100 group">
            <img src={formData.imageUrl} className="w-full h-full object-cover" alt="Preview" />
            <Button 
              type="button" 
              variant="destructive" 
              size="icon" 
              className="absolute top-2 right-2 h-8 w-8 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => setFormData(prev => ({ ...prev, imageUrl: "" }))}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input 
              placeholder="Paste Image URL..." 
              className="h-12 pl-10 rounded-2xl bg-slate-50 border-none font-bold focus-visible:ring-accent text-xs"
              value={formData.imageUrl}
              onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
            />
          </div>
          <div className="relative">
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
            />
            <Button 
              type="button" 
              variant="secondary" 
              className="h-12 rounded-2xl font-bold bg-slate-100 hover:bg-slate-200"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-4 w-4 mr-2" /> Upload
            </Button>
          </div>
        </div>
      </div>
    </div>
    <div className="space-y-3">
      <Label className="text-xs font-black uppercase tracking-widest text-primary/50">Facilities</Label>
      <div className="grid grid-cols-2 gap-3 bg-slate-50 p-4 rounded-2xl">
        {AVAILABLE_FACILITIES.map(facility => (
          <div key={facility} className="flex items-center space-x-2">
            <Checkbox 
              id={`field-${facility}`} 
              checked={formData.facilities.includes(facility)}
              onCheckedChange={() => handleFacilityToggle(facility)}
            />
            <Label htmlFor={`field-${facility}`} className="text-sm font-bold cursor-pointer">{facility}</Label>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default function ManageRooms() {
  const [rooms, setRooms] = useState<Room[]>(mockRooms);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  // Form States
  const [formData, setFormData] = useState<RoomFormData>({ name: "", capacity: "", imageUrl: "", facilities: [] });

  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select an image smaller than 2MB.",
          variant: "destructive"
        });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, imageUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleRoomStatus = (roomId: string) => {
    setRooms(prev => prev.map(r => r.id === roomId ? { ...r, isActive: !r.isActive } : r));
    const room = rooms.find(r => r.id === roomId);
    toast({
      title: room?.isActive ? "Room Deactivated" : "Room Activated",
      description: `${room?.name} is now ${!room?.isActive ? 'online' : 'offline'}.`,
    });
  };

  const deleteRoom = (roomId: string) => {
    setRooms(prev => prev.filter(r => r.id !== roomId));
    toast({
      title: "Room Deleted",
      description: "The meeting room has been permanently removed.",
    });
  };

  const resetForm = () => {
    setFormData({ name: "", capacity: "", imageUrl: "", facilities: [] });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleFacilityToggle = (facility: string) => {
    setFormData(prev => ({
      ...prev,
      facilities: prev.facilities.includes(facility)
        ? prev.facilities.filter(f => f !== facility)
        : [...prev.facilities, facility]
    }));
  };

  const handleAddRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.capacity) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    const room: Room = {
      id: `room-${Date.now()}`,
      name: formData.name,
      capacity: parseInt(formData.capacity),
      description: "Custom office space",
      facilities: [...formData.facilities].sort(),
      isActive: true,
      color: "#000",
      imageUrl: formData.imageUrl || "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&q=80&w=1080"
    };

    setRooms(prev => [...prev, room]);
    setIsAddModalOpen(false);
    resetForm();
    toast({
      title: "Room Added",
      description: `${room.name} has been created.`,
    });
  };

  const handleOpenEdit = (room: Room) => {
    setFormData({
      id: room.id,
      name: room.name,
      capacity: room.capacity.toString(),
      imageUrl: room.imageUrl || "",
      facilities: room.facilities
    });
    setIsEditModalOpen(true);
  };

  const handleEditRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.capacity || !formData.id) return;

    setRooms(prev => prev.map(r => 
      r.id === formData.id 
        ? { 
            ...r, 
            name: formData.name, 
            capacity: parseInt(formData.capacity), 
            imageUrl: formData.imageUrl,
            facilities: [...formData.facilities].sort() 
          } 
        : r
    ));
    
    setIsEditModalOpen(false);
    resetForm();
    toast({
      title: "Room Updated",
      description: "The changes have been saved successfully.",
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-12 max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary rounded-xl shadow-lg shadow-primary/20">
                <ShieldCheck className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-3xl font-headline font-black text-primary uppercase tracking-tight">Room Management</h1>
            </div>
            <p className="text-muted-foreground font-bold pl-11">Configure and monitor your office meeting spaces.</p>
          </div>
          
          <Dialog open={isAddModalOpen} onOpenChange={(val) => { setIsAddModalOpen(val); if(!val) resetForm(); }}>
            <DialogTrigger asChild>
              <Button className="flex-1 md:flex-none bg-accent text-accent-foreground hover:bg-accent/90 shadow-xl shadow-accent/20 px-8 h-12 rounded-2xl font-black transition-all hover:scale-105">
                <Plus className="h-5 w-5 mr-2" /> New Room
              </Button>
            </DialogTrigger>
            <DialogContent className="rounded-[2rem] border-none shadow-2xl max-w-md max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-2xl font-black">Add New Room</DialogTitle>
                <DialogDescription className="font-bold text-muted-foreground/60">Define the details for a new meeting area.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddRoom} className="space-y-6 py-4">
                <RoomFormFields 
                  formData={formData} 
                  setFormData={setFormData}
                  fileInputRef={fileInputRef}
                  handleFileChange={handleFileChange}
                  handleFacilityToggle={handleFacilityToggle}
                />
                <DialogFooter>
                  <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white font-black h-12 rounded-2xl shadow-lg shadow-primary/20">
                    Create Room
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {rooms.map((room) => (
            <Card key={room.id} className={cn(
              "group overflow-hidden rounded-[2rem] border-none shadow-lg transition-all duration-500 bg-white",
              !room.isActive && "opacity-70 grayscale-[0.8]"
            )}>
              <div className="relative h-48 w-full">
                <img 
                  src={room.imageUrl || "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&q=80&w=1080"} 
                  alt={room.name} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute top-4 right-4">
                  <Badge className={cn(
                    "border-none shadow-md px-4 py-1.5 rounded-full font-black text-[10px] uppercase",
                    room.isActive ? "bg-green-500 text-white" : "bg-slate-500 text-white"
                  )}>
                    {room.isActive ? "Active" : "Disabled"}
                  </Badge>
                </div>
                <div className="absolute bottom-6 left-6 text-white">
                  <h3 className="text-xl font-black">{room.name}</h3>
                  <div className="flex items-center gap-2 text-white/80 text-xs font-bold">
                    <Users className="h-3 w-3" />
                    <span>Capacity: {room.capacity}</span>
                  </div>
                </div>
              </div>
              
              <CardContent className="p-8">
                <div className="flex flex-wrap gap-2 mb-8 min-h-[40px]">
                  {room.facilities.length > 0 ? (
                    [...room.facilities].sort().map(f => (
                      <Badge key={f} className="rounded-full bg-accent hover:bg-accent/90 text-white border-none font-black text-[10px] px-3 shadow-sm">
                        {f}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-xs text-muted-foreground font-bold">No facilities listed</span>
                  )}
                </div>
                
                <div className="flex items-center justify-between p-5 bg-secondary/30 rounded-2xl border border-primary/5">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Visibility</span>
                    <span className="text-sm font-black text-primary">{room.isActive ? "Visible to Users" : "Hidden from Users"}</span>
                  </div>
                  <Switch 
                    checked={room.isActive} 
                    onCheckedChange={() => toggleRoomStatus(room.id)}
                    className="data-[state=checked]:bg-green-500"
                  />
                </div>
              </CardContent>

              <div className="bg-slate-50/50 border-t px-8 py-6 flex justify-end gap-3">
                <Button 
                  variant="ghost" 
                  className="h-10 rounded-xl font-bold text-primary hover:bg-white hover:shadow-sm"
                  onClick={() => handleOpenEdit(room)}
                >
                  <Pencil className="h-4 w-4 mr-2" /> Edit Details
                </Button>
                <Button 
                  variant="ghost" 
                  className="h-10 rounded-xl font-bold text-destructive hover:bg-destructive/5" 
                  onClick={() => deleteRoom(room.id)}
                >
                  <Trash2 className="h-4 w-4 mr-2" /> Delete
                </Button>
              </div>
            </Card>
          ))}
          
          {rooms.length === 0 && (
            <div className="col-span-full py-24 text-center bg-white rounded-[3rem] border-4 border-dashed border-secondary flex flex-col items-center">
              <div className="bg-secondary/50 p-6 rounded-full mb-4">
                <Settings2 className="h-12 w-12 text-primary/20" />
              </div>
              <h3 className="text-xl font-black text-primary">No rooms available</h3>
              <p className="text-muted-foreground font-bold mt-2">Get started by adding your first meeting room.</p>
            </div>
          )}
        </div>
      </main>

      {/* Edit Dialog */}
      <Dialog open={isEditModalOpen} onOpenChange={(val) => { setIsEditModalOpen(val); if(!val) resetForm(); }}>
        <DialogContent className="rounded-[2rem] border-none shadow-2xl max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black">Edit Room</DialogTitle>
            <DialogDescription className="font-bold text-muted-foreground/60">Update the configuration for this meeting space.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditRoom} className="space-y-6 py-4">
            <RoomFormFields 
              formData={formData} 
              setFormData={setFormData}
              fileInputRef={fileInputRef}
              handleFileChange={handleFileChange}
              handleFacilityToggle={handleFacilityToggle}
            />
            <DialogFooter>
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white font-black h-12 rounded-2xl shadow-lg shadow-primary/20">
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
