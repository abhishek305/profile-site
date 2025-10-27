import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setActiveTab, closeTab } from "@/store/slices/tabsSlice";
import { pageContent } from "@/data/pageContent";
import type { PageId } from "@/types";

const TabsBar = () => {
  const dispatch = useAppDispatch();
  const { openTabs, activeTab } = useAppSelector((state) => state.tabs);

  const handleTabClick = (tabId: PageId) => {
    dispatch(setActiveTab(tabId));
  };

  const handleCloseTab = (e: React.MouseEvent, tabId: PageId) => {
    e.stopPropagation();
    dispatch(closeTab(tabId));
  };

  if (openTabs.length === 0) return null;

  return (
    <div className="tabs-container w-full h-10 flex-shrink-0">
      <div className="flex h-full">
        {openTabs.map((tabId) => {
          const page = pageContent[tabId];
          if (!page) return null;

          const isActive = tabId === activeTab;

          return (
            <button key={tabId} onClick={() => handleTabClick(tabId)} className={`tab ${isActive ? "active" : ""} p-2 px-4 font-mono text-sm inline-flex items-center gap-2`}>
              <span>{page.title}</span>
              <span className="tab-close-icon" onClick={(e) => handleCloseTab(e, tabId)}>
                &times;
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TabsBar;
