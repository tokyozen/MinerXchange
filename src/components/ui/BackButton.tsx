import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface BackButtonProps {
  to?: string;
  className?: string;
}

export default function BackButton({ to, className = '' }: BackButtonProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (to) {
      navigate(to);
    } else {
      navigate(-1);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-200 ${className}`}
    >
      <ArrowLeft className="h-5 w-5 mr-1" />
      Back
    </button>
  );
}