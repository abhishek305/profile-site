import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { openTab } from '@/store/slices/tabsSlice';
import { isPageId } from '@/data/pages';

/**
 * Keeps location.hash in step with the active tab, so every page is a shareable
 * link and the back button walks through visited tabs.
 *
 * The *initial* hash is consumed in tabsSlice, not here — dispatching it from an
 * effect would race the write-back below, which still sees the pre-dispatch tab.
 */
export const useHashRoute = () => {
  const dispatch = useAppDispatch();
  const activeTab = useAppSelector((state) => state.tabs.activeTab);

  // Hash -> state, for back/forward and hand-edited URLs.
  useEffect(() => {
    const applyHash = () => {
      const id = window.location.hash.slice(1);
      if (isPageId(id)) dispatch(openTab(id));
    };
    window.addEventListener('hashchange', applyHash);
    return () => window.removeEventListener('hashchange', applyHash);
  }, [dispatch]);

  // State -> hash. The guard keeps this from ping-ponging with the listener.
  useEffect(() => {
    if (activeTab && window.location.hash.slice(1) !== activeTab) {
      window.location.hash = activeTab;
    }
  }, [activeTab]);
};
