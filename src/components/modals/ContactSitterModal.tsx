
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Mail, Phone } from "lucide-react";

interface ContactSitterModalProps {
  isOpen: boolean;
  onClose: () => void;
  sitterName: string;
  sitterEmail?: string | null;
  sitterPhone?: string | null;
  isSubscribed: boolean;
}

export const ContactSitterModal = ({ 
  isOpen, 
  onClose, 
  sitterName, 
  sitterEmail, 
  sitterPhone, 
  isSubscribed 
}: ContactSitterModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Contact {sitterName}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {isSubscribed ? (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Here's how you can reach {sitterName}:
              </p>
              
              {sitterEmail && (
                <div className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
                  <Mail className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium">Email</p>
                    <p className="text-sm text-muted-foreground">{sitterEmail}</p>
                  </div>
                </div>
              )}
              
              {sitterPhone && (
                <div className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
                  <Phone className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium">Phone</p>
                    <p className="text-sm text-muted-foreground">{sitterPhone}</p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-muted-foreground mb-4">
                Subscribe now to view contact information for this Babysitter and all others!
              </p>
              <Button className="w-full">Subscribe Now</Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
