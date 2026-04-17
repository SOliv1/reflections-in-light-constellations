import { useEffect, useMemo, useState } from "react";
import "./Drawer.css";
import "../styles/DrawerUnified.css";

export default function UnifiedDrawer({
  isOpen,
  onClose,
  children,
  tabs = [],
  activeTab,
  onTabChange,
  persistKey = "unifiedDrawerActiveTab",
}) {
  const isControlled = activeTab !== undefined;
  const [localActiveTab, setLocalActiveTab] = useState(() => {
    if (isControlled || typeof window === "undefined" || !persistKey) return tabs[0]?.id || "";
    try {
      const stored = window.localStorage.getItem(persistKey);
      return stored || tabs[0]?.id || "";
    } catch {
      return tabs[0]?.id || "";
    }
  });

  const hasTabs = tabs.length > 0;
  const currentTab = activeTab ?? localActiveTab;

  useEffect(() => {
    if (!hasTabs) return;
    if (!currentTab && tabs[0]?.id) {
      setLocalActiveTab(tabs[0].id);
    }
  }, [currentTab, hasTabs, tabs]);

  useEffect(() => {
    if (isControlled || !hasTabs || !currentTab || typeof window === "undefined" || !persistKey) return;
    try {
      window.localStorage.setItem(persistKey, currentTab);
    } catch {
      // Ignore persistence errors in restricted environments.
    }
  }, [currentTab, hasTabs, isControlled, persistKey]);

  const activePanel = useMemo(() => {
    if (!hasTabs) return null;
    return tabs.find((tab) => tab.id === currentTab) || tabs[0];
  }, [currentTab, hasTabs, tabs]);

  const handleTabChange = (nextTab) => {
    if (onTabChange) {
      onTabChange(nextTab);
      return;
    }
    setLocalActiveTab(nextTab);
  };

  return (
    <div
      className={`drawer-overlay unified-drawer-overlay ${isOpen ? "open" : ""}`}
      aria-hidden={!isOpen}
    >
      <div className="drawer-panel unified-drawer-panel" role="dialog" aria-modal="true">
        <button className="drawer-close unified-drawer-close" onClick={onClose} aria-label="Close drawer">
          x
        </button>
        {hasTabs ? (
          <div className="unified-drawer-tabs-wrap">
            <div className="unified-drawer-tabs" role="tablist" aria-label="Drawer panels">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  id={`drawer-tab-${tab.id}`}
                  className={`unified-drawer-tab ${currentTab === tab.id ? "active" : ""}`}
                  aria-selected={currentTab === tab.id}
                  aria-controls={`drawer-tabpanel-${tab.id}`}
                  onClick={() => handleTabChange(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <div
              key={activePanel?.id}
              id={activePanel?.id ? `drawer-tabpanel-${activePanel.id}` : undefined}
              role="tabpanel"
              aria-labelledby={activePanel?.id ? `drawer-tab-${activePanel.id}` : undefined}
              className={`unified-drawer-panel-body panel-transition ${activePanel?.id ? `panel-${activePanel.id}` : ""}`}
            >
              {activePanel?.content}
            </div>
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );
}
