import React, { useState } from "react";

interface OTPInputProps {
  name: string;
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  length?: number;
}

const OTPInput: React.FC<OTPInputProps> = ({
  name,
  value,
  onChange,
  onBlur,
  length = 6,
}) => {
  const [otp, setOtp] = useState<string[]>(new Array(length).fill(""));

  const handleChange = (index: number, val: string) => {
    if (/^[0-9]?$/.test(val)) {
      const newOtp = [...otp];
      newOtp[index] = val;
      setOtp(newOtp);
      onChange(newOtp.join(""));
      // Move focus to next input
      if (val && index < length - 1) {
        document.getElementById(`${name}-${index + 1}`)?.focus();
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace') {
      e.preventDefault();
      if (otp[index]) {
        const newOtp = [...otp];
        newOtp[index] = '';
        setOtp(newOtp);
        onChange(newOtp.join(''));
      } else if (index > 0) {
        document.getElementById(`${name}-${index - 1}`)?.focus();
      }
    }
  };

  return (
    <div className="flex space-x-2">
      {otp.map((_, index) => (
        <input
          key={index}
          id={`${name}-${index}`}
          type="text"
          maxLength={1}
          value={otp[index]}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onBlur={onBlur}
          className="w-10 h-10 text-center border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      ))}
    </div>
  );
};

export default OTPInput;