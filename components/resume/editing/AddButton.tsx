import React from 'react';

interface AddButtonProps {
  label: string;
  onClick: () => void;
}

export const AddButton: React.FC<AddButtonProps> = ({ label, onClick }) => {
  return (
    <button
      className="w-full p-2 border-2 border-dashed rounded-md text-gray-700 hover:border-gray-400 hover:text-gray-900"
      onClick={onClick}
    >
      + {label}
    </button>
  );
};
