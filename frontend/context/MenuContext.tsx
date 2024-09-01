"use client"

import { createContext, useContext, useState, ReactNode } from 'react';

interface SidebarContextType {
  isSideNavOpen: boolean;
  toggleSidebar: () => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const SidebarProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isSideNavOpen, setIsSideNavOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSideNavOpen(prevState => !prevState);
  };

  return (
    <SidebarContext.Provider value={{ isSideNavOpen, toggleSidebar }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
};