import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Identity } from '@dfinity/agent';

// 定义 IdentityContext 的类型
interface IdentityContextType {
  identity: Identity | null;
  setIdentity: (identity: Identity | null) => void;
}

// 创建 IdentityContext
const IdentityContext = createContext<IdentityContextType | undefined>(undefined);

// 创建 IdentityProvider 组件
export const IdentityProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [identity, setIdentity] = useState<Identity | null>(null);

  return (
    <IdentityContext.Provider value={{ identity, setIdentity }}>
      {children}
    </IdentityContext.Provider>
  );
};

// 创建 useIdentity 钩子
export const useIdentity = (): IdentityContextType => {
  const context = useContext(IdentityContext);
  if (!context) {
    throw new Error('useIdentity must be used within an IdentityProvider');
  }
  return context;
};
