import React, { createContext, useContext, useState } from 'react';
import TopBanner, { TopBannerProps } from '../components/TopBanner';

type ShowBannerFn = (opts: Omit<TopBannerProps, 'children'> & {
  children: React.ReactNode;
  duration?: number;
}) => void;

const BannerContext = createContext<ShowBannerFn | undefined>(undefined);

export function BannerProvider({ children }: { children: React.ReactNode }) {
  const [banners, setBanners] = useState<
    Array<Omit<TopBannerProps, 'children'> & {
      children: React.ReactNode;
      id: string;
    }>
  >([]);

  const showBanner: ShowBannerFn = ({ icon, children, onPress, duration = 5000 }) => {
    const id = Date.now().toString();
    setBanners(bs => [...bs, { id, icon, children, onPress }]);
    setTimeout(() => {
      setBanners(bs => bs.filter(b => b.id !== id));
    }, duration);
  };

  return (
    <BannerContext.Provider value={showBanner}>
      {children}
      {banners.map(b => (
        <TopBanner
          key={b.id}
          icon={b.icon}
          onPress={b.onPress}
        >
          {b.children}
        </TopBanner>
      ))}
    </BannerContext.Provider>
  );
}

export function useBanner() {
  const ctx = useContext(BannerContext);
  if (!ctx) throw new Error('useBanner debe usarse dentro de BannerProvider');
  return ctx;
}
