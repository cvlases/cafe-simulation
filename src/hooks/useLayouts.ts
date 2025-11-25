import { useState, useEffect } from 'react';
import layoutsData from '../data/layouts.json';

export const useLayouts = () => {
  const [layouts, setLayouts] = useState(layoutsData);
  const [isLoaded, setIsLoaded] = useState(true);

  return { layouts, isLoaded };
};