// src/components/Button.tsx

import React from 'react';
import { Link } from 'react-router-dom';

interface ButtonProps {
  to: string;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ to, children }) => (
  <Link
    to={to}
    className="bg-accent text-white px-6 py-3 rounded-full shadow-lg hover:bg-orange-500 transition duration-300"
  >
    {children}
  </Link>
);

export default Button;
