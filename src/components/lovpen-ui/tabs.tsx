'use client';

import * as React from 'react';
import { createContext, use, useMemo, useState } from 'react';
import { cn } from '@/lib/utils';

type TabsContextValue = {
  activeTab: string;
  setActiveTab: (value: string) => void;
};

const TabsContext = createContext<TabsContextValue | undefined>(undefined);

const useTabsContext = () => {
  const context = use(TabsContext);
  if (!context) {
    throw new Error('Tabs components must be used within a Tabs provider');
  }
  return context;
};

export type TabsProps = {
  defaultValue: string;
} & React.HTMLAttributes<HTMLDivElement>

const Tabs = ({ ref, defaultValue, className, children, ...props }: TabsProps & { ref?: React.RefObject<HTMLDivElement | null> }) => {
    const [activeTab, setActiveTab] = useState(defaultValue);

    const contextValue = useMemo(() => ({
      activeTab,
      setActiveTab,
    }), [activeTab]);

    return (
      <TabsContext value={contextValue}>
        <div ref={ref} className={cn('', className)} {...props}>
          {children}
        </div>
      </TabsContext>
    );
  };

Tabs.displayName = 'Tabs';

export type TabsListProps = {} & React.HTMLAttributes<HTMLDivElement>

const TabsList = ({ ref, className, ...props }: TabsListProps & { ref?: React.RefObject<HTMLDivElement | null> }) => (
    <div
      ref={ref}
      className={cn(
        'flex space-x-2 border-b border-border-default',
        className
      )}
      {...props}
    />
  );

TabsList.displayName = 'TabsList';

export type TabsTriggerProps = {
  value: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>

const TabsTrigger = ({ ref, value, className, children, ...props }: TabsTriggerProps & { ref?: React.RefObject<HTMLButtonElement | null> }) => {
    const { activeTab, setActiveTab } = useTabsContext();
    const isActive = activeTab === value;

    return (
      <button
        type="button"
        ref={ref}
        onClick={() => setActiveTab(value)}
        className={cn(
          'px-4 py-2 font-medium text-sm transition-colors border-b-2',
          isActive
            ? 'text-text-main border-primary'
            : 'text-text-faded border-transparent hover:border-gray-300 hover:text-text-main',
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  };

TabsTrigger.displayName = 'TabsTrigger';

export type TabsContentProps = {
  value: string;
} & React.HTMLAttributes<HTMLDivElement>

const TabsContent = ({ ref, value, className, children, ...props }: TabsContentProps & { ref?: React.RefObject<HTMLDivElement | null> }) => {
    const { activeTab } = useTabsContext();

    if (activeTab !== value) {
      return null;
    }

    return (
      <div
        ref={ref}
        className={cn('mt-4', className)}
        {...props}
      >
        {children}
      </div>
    );
  };

TabsContent.displayName = 'TabsContent';

export { Tabs, TabsContent, TabsList, TabsTrigger };
