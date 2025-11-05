import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { LucideIcon } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface ServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  icon: LucideIcon;
  title: string;
  description: string;
  details: string;
}

export const ServiceModal = ({
  isOpen,
  onClose,
  icon: Icon,
  title,
  description,
  details,
}: ServiceModalProps) => {
  const { t } = useLanguage();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="mb-4 flex justify-center">
            <div className="rounded-full bg-primary/10 p-4">
              <Icon className="h-10 w-10 text-primary" />
            </div>
          </div>
          <DialogTitle className="text-center text-2xl font-bold">
            {title}
          </DialogTitle>
          <DialogDescription className="text-center text-base pt-2">
            {description}
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4">
          <p className="text-sm text-muted-foreground leading-relaxed">
            {details}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
