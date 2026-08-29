import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setActiveTab, closeTab } from "@/store/slices/tabsSlice";
import { pages } from "@/data/pages";
import type { PageId } from "@/types";

const TabsBar = () => {
  const dispatch = useAppDispatch();
  const { openTabs, activeTab } = useAppSelector((state) => state.tabs);

  if (openTabs.length === 0) return null;

  return (
    <div className="tabs-container w-full h-10 flex-shrink-0 overflow-x-auto">
      <div className="flex h-full w-max">
        {openTabs.map((tabId: PageId) => {
          const page = pages[tabId];
          if (!page) return null;

          const isActive = tabId === activeTab;

          return (
            // Two sibling buttons, not a nested one — a button inside a button is
            // invalid HTML and the close control is unreachable by keyboard.
            <div key={tabId} className={`tab ${isActive ? "active" : ""} flex items-center pr-2`}>
              <button onClick={() => dispatch(setActiveTab(tabId))} className="py-2 pl-4 pr-2 font-mono text-sm whitespace-nowrap" aria-current={isActive ? "page" : undefined}>
                {page.title}
              </button>
              <button onClick={() => dispatch(closeTab(tabId))} className="tab-close-icon" aria-label={`Close ${page.title}`} title={`Close ${page.title}`}>
                &times;
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TabsBar;
