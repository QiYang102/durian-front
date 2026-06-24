import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/Button';
import { setUserProperty, trackEvent } from '@/lib/analytics';
import { CommonEvents } from '@ttm/api/types/tracker';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import { Globe } from "lucide-react";

interface LanguageSelectorProps {
  isCollapsed?: boolean;
}

const LanguageSelector = ({ isCollapsed = false }: LanguageSelectorProps) => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    trackEvent(CommonEvents.LANGUAGE_CHANGED);

    setUserProperty({ preferred_language: lng });
    
    i18n.changeLanguage(lng);
  };

  if (isCollapsed) {
    return (
      <div className="grid gap-1 px-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="inline-flex items-center justify-center transition-colors rounded-md ring-offset-background focus-visible:ring-ring dark:hover:bg-primary h-9 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer hover:bg-accent">
              <Globe className="h-4 w-4" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="center">
            <DropdownMenuItem
              onClick={() => changeLanguage("en")}
              className={i18n.language === "en" ? "bg-accent" : ""}
            >
              English
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => changeLanguage("zh")}
              className={i18n.language === "zh" ? "bg-accent" : ""}
            >
              中文
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  }

  return (
    <div className="grid gap-1 px-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="inline-flex items-center transition-colors rounded-md ring-offset-background focus-visible:ring-ring dark:hover:bg-primary h-9 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 justify-start px-3 cursor-pointer hover:bg-accent">
            <Globe className="h-4 w-4 mr-2" />
            <span className="text-sm">Language</span>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem
            onClick={() => changeLanguage("en")}
            className={i18n.language === "en" ? "bg-accent" : ""}
          >
            English
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => changeLanguage("zh")}
            className={i18n.language === "zh" ? "bg-accent" : ""}
          >
            中文
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default LanguageSelector;