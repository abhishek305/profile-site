import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { isPageId } from '@/data/pages';
import type { PageId } from '@/types';

interface TabsState {
  openTabs: PageId[];
  activeTab: PageId | null;
  activePage: PageId;
}

// Seed from the URL rather than letting useHashRoute dispatch on mount: an
// effect would read a stale activeTab and clobber the incoming hash.
const hash = window.location.hash.slice(1);
const landing: PageId = isPageId(hash) ? hash : 'home';

const initialState: TabsState = {
  openTabs: [landing],
  activeTab: landing,
  activePage: landing,
};

const tabsSlice = createSlice({
  name: 'tabs',
  initialState,
  reducers: {
    openTab: (state, action: PayloadAction<PageId>) => {
      const pageId = action.payload;
      if (!state.openTabs.includes(pageId)) {
        state.openTabs.push(pageId);
      }
      state.activeTab = pageId;
      state.activePage = pageId;
    },
    setActiveTab: (state, action: PayloadAction<PageId | null>) => {
      state.activeTab = action.payload;
      if (action.payload) {
        state.activePage = action.payload;
      }
    },
    closeTab: (state, action: PayloadAction<PageId>) => {
      const tabId = action.payload;
      const index = state.openTabs.indexOf(tabId);
      
      if (index === -1) return;
      
      state.openTabs.splice(index, 1);
      
      // If we closed the active tab, find a new one
      if (state.activeTab === tabId) {
        const newActiveTab = state.openTabs[index - 1] || state.openTabs[0] || null;
        state.activeTab = newActiveTab;
        if (newActiveTab) {
          state.activePage = newActiveTab;
        }
      }
    },
  },
});

export const { openTab, setActiveTab, closeTab } = tabsSlice.actions;
export default tabsSlice.reducer;

