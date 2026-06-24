import { Accordion } from "@radix-ui/react-accordion";
import { Link, useNavigate } from "@tanstack/react-router";
import { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

import { AccordionContent, AccordionItem, AccordionTrigger } from "./Accordion";
import { buttonVariants } from "./Button";
import { Command, CommandGroup, CommandItem } from "./Command";
import { Popover, PopoverContent, PopoverTrigger } from "./Popover";
import { Text } from "./Text";
import { Tooltip, TooltipContent, TooltipTrigger } from "./Tooltip";

interface NavProps {
  isDrawerOpen: boolean;
  links: {
    title: string;
    feature: string;
    label?: string;
    icon: LucideIcon;
    type: "basic" | "collapsible";
    to?: string;
    children?: NavProps["links"];
    onClick?: () => void;
  }[];
}

export function Nav({ links, isDrawerOpen }: NavProps) {
  const navigate = useNavigate();

  if (isDrawerOpen) {
    return (
      <div
        data-collapsed={isDrawerOpen}
        className="group flex flex-col gap-4 py-2 data-[collapsed=true]:py-2"
      >
        <nav className="grid gap-1 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2">
          {links.map((link, index) =>
            link.type === "collapsible" ? (
              <Popover>
                <PopoverTrigger asChild>
                  <div className="flex h-9 flex-1 flex-row items-center justify-center gap-1">
                    <link.icon className="h-4 w-4" />
                    <span className="sr-only">{link.title}</span>
                  </div>
                </PopoverTrigger>
                <PopoverContent align="start" className="flex p-0">
                  <Command>
                    <CommandGroup>
                      {link.children &&
                        link.children.map((item) => (
                          <CommandItem
                            value={item.title}
                            key={`mobile-${item.feature}`}
                            title={item.title}
                            className=" aria-selected:bg-white"
                            onSelect={() => {
                              navigate({ to: item.to });
                            }}
                          >
                            {item.title}
                          </CommandItem>
                        ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
            ) : (
              <Tooltip key={`mobile-${link.feature}`} delayDuration={0}>
                <TooltipTrigger asChild>
                  <Link
                    href="#"
                    preload={false}
                    activeProps={{
                      className: cn(
                        buttonVariants({
                          variant: "default",
                          size: "icon",
                        }),
                        "h-9 w-9",
                        "dark:hover:bg-primary dark:hover:text-white",
                      ),
                    }}
                    inactiveProps={{
                      className: cn(
                        buttonVariants({
                          variant: "ghost",
                          size: "icon",
                        }),
                        "h-9 w-9",
                      ),
                    }}
                    {...(link.to && { to: link.to })}
                    {...(link.onClick && { onClick: link.onClick })}
                  >
                    <link.icon className="h-4 w-4" />
                    <span className="sr-only">{link.title}</span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent
                  side="right"
                  className="flex items-center gap-4"
                >
                  {link.title}
                  {link.label && (
                    <span className="text-muted-foreground ml-auto">
                      {link.label}
                    </span>
                  )}
                </TooltipContent>
              </Tooltip>
            ),
          )}
        </nav>
      </div>
    );
  }

  return (
    <div
      data-collapsed={isDrawerOpen}
      className="group flex flex-col gap-4 py-2 data-[collapsed=true]:py-2"
    >
      <nav className="grid gap-1 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2">
        {links.map((link, index) =>
          link.type === "collapsible" ? (
            <Accordion
              type="single"
              collapsible
              key={`acccordion-${link.feature}`}
            >
              <AccordionItem
                key={index}
                value={link.title}
                className="!hover:underline-offset-0 border-none p-0"
              >
                <AccordionTrigger className="hover:bg-accent group relative flex h-9 justify-between rounded-md px-3 py-0 hover:no-underline">
                  <div className="flex flex-1 flex-row items-center ">
                    <link.icon className="mr-2 h-4 w-4" />
                    <Text variant="caption">{link.title}</Text>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-0 pt-1">
                  <div className="flex flex-col gap-1 pl-3">
                    {link.children &&
                      link.children.map((children, index) => (
                        <Link
                          key={index}
                          href="#"
                          preload={false}
                          activeProps={{
                            className: cn(
                              buttonVariants({
                                variant: "default",
                                size: "sm",
                              }),
                              "justify-start",
                              "dark:hover:bg-primary dark:hover:text-white",
                            ),
                          }}
                          inactiveProps={{
                            className: cn(
                              buttonVariants({
                                variant: "ghost",
                                size: "sm",
                              }),
                              "justify-start",
                            ),
                          }}
                          {...(children.to && { to: children.to })}
                          {...(children.onClick && {
                            onClick: children.onClick,
                          })}
                        >
                          <children.icon className="mr-2 h-4 w-4" />
                          {children.title}
                          {children.label && (
                            <span className={cn("ml-auto")}>
                              {children.label}
                            </span>
                          )}
                        </Link>
                      ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          ) : (
            <Link
              key={`link-${link.feature}`}
              href="#"
              preload={false}
              activeProps={{
                className: cn(
                  buttonVariants({ variant: "default", size: "sm" }),
                  "justify-start",
                  "dark:hover:bg-primary dark:hover:text-white",
                ),
              }}
              inactiveProps={{
                className: cn(
                  buttonVariants({ variant: "ghost", size: "sm" }),
                  "justify-start",
                ),
              }}
              {...(link.to && { to: link.to })}
              {...(link.onClick && { onClick: link.onClick })}
            >
              <link.icon className="mr-2 h-4 w-4" />
              {link.title}
              {link.label && (
                <span className={cn("ml-auto")}>{link.label}</span>
              )}
            </Link>
          ),
        )}
      </nav>
    </div>
  );
}
