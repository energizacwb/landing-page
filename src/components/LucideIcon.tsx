import React from 'react';
import * as Icons from 'lucide-react';

interface LucideIconProps {
  name: string;
  className?: string;
  size?: number;
}

export default function LucideIcon({ name, className = '', size = 24 }: LucideIconProps) {
  // Safe fallback if icon doesn't exist in lucide-react
  const IconComponent = (Icons as any)[name];

  if (!IconComponent) {
    // Return a default fallback icon
    return <Icons.HelpCircle className={className} size={size} />;
  }

  return <IconComponent className={className} size={size} />;
}
