import { useEffect, useRef } from "react";
import { useTheme } from "@/hooks/useTheme";
import { themes } from "@/constants/themes";
import { CheckIcon } from "../icons";
import type { ThemeId } from "@/types";

const ThemePicker = () => {
  const { currentTheme, isPickerOpen, changeTheme, closePicker } = useTheme();
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (isPickerOpen && pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        const isThemeToggle = (e.target as HTMLElement).closest("#theme-toggle");
        if (!isThemeToggle) {
          closePicker();
        }
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isPickerOpen, closePicker]);

  if (!isPickerOpen) return null;

  const handleThemeClick = (themeId: ThemeId) => {
    changeTheme(themeId);
    closePicker();
  };

  return (
    <div id="theme-picker" ref={pickerRef} onClick={(e) => e.stopPropagation()}>
      {themes.map((theme) => (
        <button key={theme.id} className="theme-item" onClick={() => handleThemeClick(theme.id)}>
          <span>{theme.name}</span>
          <span className={`theme-item-icon ${currentTheme === theme.id ? "" : "hidden"}`}>
            <CheckIcon />
          </span>
        </button>
      ))}
    </div>
  );
};

export default ThemePicker;
