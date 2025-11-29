import { useState } from 'react';
import layoutsData from '../data/layouts.json';

export const useLayouts = () => {
  const [layouts] = useState(layoutsData);
  const [isLoaded] = useState(true);

  return { layouts, isLoaded };
};