import { useMemo } from 'react';
import assetsData from '../data/assets.json';
import layoutsData from '../data/layouts.json';

export const useAssets = () => {
  const assets = useMemo(() => assetsData, []);
  const layouts = useMemo(() => layoutsData, []);

  return { assets, layouts };
};