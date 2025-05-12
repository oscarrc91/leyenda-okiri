// src/contexts/BannerContext.tsx
import React, { createContext, useContext, useState } from 'react';
import { Banner, BannerProps } from '../components/Banner';

type ShowBannerFn = (b: Omit<BannerProps, 'id'>) => void;
const BannerContext = createContext<ShowBannerFn | undefined>(undefined);

export function BannerProvider({ children }: { children: React.ReactNode }) {
  const [banners, setBanners] = useState<BannerProps[]>([]);

  const show: ShowBannerFn = ({ icon, children, onPress, compact }) => {
    const id = Date.now().toString();
    setBanners(bs => [...bs, { id, icon, children, onPress, compact }]);
    setTimeout(() => setBanners(bs => bs.filter(x => x.id !== id)), 5000);
  };

  return (
    <BannerContext.Provider value={show}>
      {/* No más Views extra aquí, el View de App.tsx es el contenedor */}
      {children}
      {banners.map(b => (
        <Banner key={b.id} {...b} />
      ))}
    </BannerContext.Provider>
  );
}

export function useBanner() {
  const ctx = useContext(BannerContext);
  if (!ctx) throw new Error('useBanner debe usarse dentro de BannerProvider');
  return ctx;
}
