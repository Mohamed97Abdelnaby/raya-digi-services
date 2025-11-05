import { Card } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface ServiceCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  onClick: () => void;
}

export const ServiceCard = ({ icon: Icon, title, description, onClick }: ServiceCardProps) => {
  return (
    <Card
      onClick={onClick}
      className="group cursor-pointer overflow-hidden border-2 transition-all duration-300 hover:shadow-[var(--shadow-hover)] hover:scale-[1.02] hover:border-primary"
      style={{ boxShadow: 'var(--shadow-card)' }}
    >
      <div className="p-8">
        <div className="mb-4 flex justify-center">
          <div className="rounded-full bg-primary/10 p-4 transition-all duration-300 group-hover:bg-primary/20">
            <Icon className="h-8 w-8 text-primary transition-transform duration-300 group-hover:scale-110" />
          </div>
        </div>
        <h3 className="mb-3 text-center text-xl font-bold text-foreground">
          {title}
        </h3>
        <p className="text-center text-sm text-muted-foreground leading-relaxed">
          {description}
        </p>
      </div>
    </Card>
  );
};
