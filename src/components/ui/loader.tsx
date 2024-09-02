// components/ui/loader.tsx
import { ProgressSpinner } from 'primereact/progressspinner';
import React from 'react';

export const Loader: React.FC = () => (
  <ProgressSpinner style={{width: '50px', height: '50px', margin:0}} strokeWidth="4" fill="var(--surface-ground)" animationDuration=".5s" />
);

export default Loader;
