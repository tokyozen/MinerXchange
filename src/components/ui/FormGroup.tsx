import React from 'react';

interface FormGroupProps {
  children: React.ReactNode;
  className?: string;
}

export default function FormGroup({ children, className = '' }: FormGroupProps) {
  return (
    <div className={`space-y-6 ${className}`}>
      {children}
    </div>
  );
}