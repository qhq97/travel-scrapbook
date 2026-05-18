"use client";

import { tabs, type TabId } from "@/lib/constants";
import { classNames } from "@/lib/utils";

export function BottomNav({
  activeTab,
  setActiveTab,
}: {
  activeTab: TabId;
  setActiveTab: (tab: TabId) => void;
}) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200 bg-white/95 px-3 pb-3 pt-2 backdrop-blur-xl">
      <div className="mx-auto grid max-w-md grid-cols-4 gap-1 rounded-[1.5rem] bg-slate-100 p-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={classNames(
                "flex flex-col items-center justify-center gap-1 rounded-[1.2rem] py-2 text-xs font-bold transition",
                active ? "bg-white text-slate-950 shadow-sm" : "text-slate-500"
              )}
            >
              <Icon size={19} />
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}