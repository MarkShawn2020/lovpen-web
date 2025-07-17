'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

// Types for persistent tabs
type TabState = {
  activeTab: string;
  tabHistory: string[];
  lastAccessed: Record<string, number>;
};

type PersistentTabsContextValue = {
  activeTab: string;
  setActiveTab: (value: string) => void;
  tabHistory: string[];
  getTabAccessTime: (tabId: string) => number;
  isTabRecentlyAccessed: (tabId: string, withinMinutes?: number) => boolean;
};

const PersistentTabsContext = React.createContext<PersistentTabsContextValue | undefined>(undefined);

const usePersistentTabsContext = () => {
  const context = React.use(PersistentTabsContext);
  if (!context) {
    throw new Error('Persistent tabs components must be used within a PersistentTabs provider');
  }
  return context;
};

// Custom hook for tab state persistence
function useInternalTabState(tabsId: string, defaultValue: string) {
  const storageKey = `tabs_${tabsId}`;

  const [tabState, setTabState] = React.useState<TabState>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          return {
            activeTab: parsed.activeTab || defaultValue,
            tabHistory: parsed.tabHistory || [defaultValue],
            lastAccessed: parsed.lastAccessed || {[defaultValue]: Date.now()},
          };
        } catch {
          // Fallback to default if parsing fails
        }
      }
    }

    return {
      activeTab: defaultValue,
      tabHistory: [defaultValue],
      lastAccessed: {[defaultValue]: Date.now()},
    };
  });

  const updateTabState = React.useCallback((newState: Partial<TabState>) => {
    const updatedState = {...tabState, ...newState};
    setTabState(updatedState);

    // Persist to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem(storageKey, JSON.stringify(updatedState));
    }
  }, [tabState, storageKey]);

  const setActiveTab = React.useCallback((tabId: string) => {
    const newHistory = [tabId, ...tabState.tabHistory.filter(id => id !== tabId)].slice(0, 10);
    const newLastAccessed = {
      ...tabState.lastAccessed,
      [tabId]: Date.now(),
    };

    updateTabState({
      activeTab: tabId,
      tabHistory: newHistory,
      lastAccessed: newLastAccessed,
    });
  }, [tabState, updateTabState]);

  const getTabAccessTime = React.useCallback((tabId: string) => {
    return tabState?.lastAccessed[tabId] || 0;
  }, [tabState]);

  const isTabRecentlyAccessed = React.useCallback((tabId: string, withinMinutes = 30) => {
    const accessTime = getTabAccessTime(tabId);
    return accessTime > 0 && (Date.now() - accessTime) < (withinMinutes * 60 * 1000);
  }, [getTabAccessTime]);

  return {
    activeTab: tabState.activeTab,
    tabHistory: tabState.tabHistory,
    setActiveTab,
    getTabAccessTime,
    isTabRecentlyAccessed,
  };
}

export type PersistentTabsProps = {
  id: string; // Unique identifier for persistence
  defaultValue: string;
  onTabChange?: (tabId: string) => void;
  restoreOnMount?: boolean;
} & React.HTMLAttributes<HTMLDivElement>

const PersistentTabs = ({ ref, id, defaultValue, className, children, onTabChange, restoreOnMount: _restoreOnMount = true, ...props }: PersistentTabsProps & { ref?: React.RefObject<HTMLDivElement | null> }) => {
    const tabState = useInternalTabState(id, defaultValue);

    React.useEffect(() => {
      if (onTabChange) {
        onTabChange(tabState.activeTab);
      }
    }, [tabState.activeTab, onTabChange]);

    const contextValue = React.useMemo(() => ({
      activeTab: tabState.activeTab,
      setActiveTab: tabState.setActiveTab,
      tabHistory: tabState.tabHistory,
      getTabAccessTime: tabState.getTabAccessTime,
      isTabRecentlyAccessed: tabState.isTabRecentlyAccessed,
    }), [tabState]);

    return (
      <PersistentTabsContext value={contextValue}>
        <div ref={ref} className={cn('persistent-tabs', className)} {...props}>
          {children}
        </div>
      </PersistentTabsContext>
    );
  };

PersistentTabs.displayName = 'PersistentTabs';

export type PersistentTabsListProps = {
  showHistory?: boolean;
  historyLimit?: number;
} & React.HTMLAttributes<HTMLDivElement>

const PersistentTabsList = ({ ref, className, children, showHistory = false, historyLimit = 5, ...props }: PersistentTabsListProps & { ref?: React.RefObject<HTMLDivElement | null> }) => {
    const { tabHistory } = usePersistentTabsContext();

    return (
      <div
        ref={ref}
        className={cn(
          'flex playground-x-2 border-b border-border-default',
          className,
        )}
        {...props}
      >
        {children}
        {showHistory && tabHistory.length > 1 && (
          <div className="flex items-center space-x-1 ml-4 text-xs text-gray-500">
            <span>Recent:</span>
            {tabHistory.slice(1, historyLimit + 1).map(tabId => (
              <span key={tabId} className="px-2 py-1 bg-gray-100 rounded">
                {tabId}
              </span>
            ))}
          </div>
        )}
      </div>
    );
  };

PersistentTabsList.displayName = 'PersistentTabsList';

export type PersistentTabsTriggerProps = {
  value: string;
  badge?: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>

const PersistentTabsTrigger = ({ ref, value, className, children, badge, disabled = false, ...props }: PersistentTabsTriggerProps & { ref?: React.RefObject<HTMLButtonElement | null> }) => {
    const { activeTab, setActiveTab, isTabRecentlyAccessed } = usePersistentTabsContext();
    const isActive = activeTab === value;
    const isRecent = isTabRecentlyAccessed(value);

    return (
      <button
        type="button"
        ref={ref}
        disabled={disabled}
        onClick={() => !disabled && setActiveTab(value)}
        className={cn(
          'relative px-4 py-2 font-medium text-sm transition-colors border-b-2 flex items-center playground-x-2',
          isActive
            ? 'text-text-main border-primary'
            : 'text-text-faded border-transparent hover:border-gray-300 hover:text-text-main',
          isRecent && !isActive && 'bg-blue-50',
          disabled && 'opacity-50 cursor-not-allowed',
          className,
        )}
        {...props}
      >
        <span>{children}</span>
        {badge && <span className="ml-2">{badge}</span>}
        {isRecent && !isActive && (
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full"></div>
        )}
      </button>
    );
  };

PersistentTabsTrigger.displayName = 'PersistentTabsTrigger';

export type PersistentTabsContentProps = {
  value: string;
  lazy?: boolean;
} & React.HTMLAttributes<HTMLDivElement>

const PersistentTabsContent = ({ ref, value, className, children, lazy = false, ...props }: PersistentTabsContentProps & { ref?: React.RefObject<HTMLDivElement | null> }) => {
    const { activeTab, getTabAccessTime } = usePersistentTabsContext();
    const isActive = activeTab === value;
    const hasBeenAccessed = getTabAccessTime(value) > 0;

    // If lazy loading is enabled and tab hasn't been accessed, don't render content
    if (lazy && !hasBeenAccessed) {
      return null;
    }

    return (
      <div
        ref={ref}
        className={cn(
          'mt-4 persistent-tab-content',
          !isActive && 'hidden',
          className,
        )}
        data-tab-id={value}
        data-active={isActive}
        {...props}
      >
        {children}
      </div>
    );
  };

PersistentTabsContent.displayName = 'PersistentTabsContent';

export { PersistentTabs, PersistentTabsContent, PersistentTabsList, PersistentTabsTrigger, usePersistentTabsContext };
