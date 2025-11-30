import { useState } from 'react';
import assetsData from '../data/assets.json';
import layoutsData from '../data/layouts.json';

const prependBasePath = (obj: any): any => {
  const basePath = import.meta.env.BASE_URL || '/';
  
  if (typeof obj === 'string') {
    // Prepend base path to asset strings
    return basePath + obj;
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => prependBasePath(item));
  }
  
  if (typeof obj === 'object' && obj !== null) {
    const result: any = {};
    for (const key in obj) {
      result[key] = prependBasePath(obj[key]);
    }
    return result;
  }
  
  return obj;
};

export const useAssets = () => {
  const [assets] = useState(prependBasePath(assetsData));
  const [layouts] = useState(layoutsData); // ← ADD THIS
  const [isLoaded] = useState(true);

  return { assets, layouts, isLoaded }; // ← ADD layouts here
};