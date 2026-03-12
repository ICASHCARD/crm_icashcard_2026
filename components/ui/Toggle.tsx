
import React from 'react';

interface ToggleProps {
  enabled: boolean;
  onChange: () => void;
  disabled?: boolean;
}

const Toggle: React.FC<ToggleProps> = ({ enabled, onChange, disabled }) => {
  return (
    <button
      onClick={onChange}
      disabled={disabled}
      className={`relative w-12 h-6 rounded-full transition-all duration-300 outline-none ${
        enabled ? 'bg-blue-600' : 'bg-slate-200 dark:bg-slate-800'
      } ${disabled ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer active:scale-95'}`}
    >
      <div className={`absolute top-[2px] left-[2px] w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-300 transform ${
        enabled ? 'translate-x-6' : 'translate-x-0'
      }`} />
    </button>
  );
};

export default Toggle;
