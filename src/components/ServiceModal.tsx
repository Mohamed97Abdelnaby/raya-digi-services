import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { LucideIcon } from 'lucide-react';
import { UnifiedServiceForm } from '@/components/UnifiedServiceForm';

type ServiceType = 'kyc' | 'foreign' | 'exchange' | 'statement' | 'chequebook' | 'mobile' | null;

interface ServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceType: ServiceType;
  icon: LucideIcon;
  title: string;
  description: string;
  details: string;
}

export const ServiceModal = ({ isOpen, onClose, icon: Icon, title }: ServiceModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Icon className="h-8 w-8 text-primary" />
          </div>
          <DialogTitle className="text-center text-2xl font-bold">
            {title}
          </DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <UnifiedServiceForm serviceName={title} />
        </div>
      </DialogContent>
    </Dialog>
  );
};
