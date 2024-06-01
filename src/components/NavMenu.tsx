"use client";
import React from "react";
import NextLink from "next/link";

import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "./ui/sheet";
import { Button, Link } from "./ui/button";
import { Icon } from "./ui/icon";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "./ui/accordion";

const playgroundMenuElements: { title: string; href: string; description: string }[] = [
  {
    title: "Race results",
    href: "/playground/race-results",
    description:
      "An api endpoint that displays race results based on the year and the location",
  },
  {
    title: "Sprint results",
    href: "/playground/sprint-results",
    description:
      "An api endpoint that displays sprint results based on the year and the location",
  },
  {
    title: "Comparator",
    href: "/playground/compare",
    description:
      "A visual table that displays the various results of the weekend",
  },
];

export function NavMenu() {
  return (
    <div className="flex flex-row items-center">
      <Sheet>
        <SheetTrigger asChild className="md:hidden">
          <Button variant="secondary" className="aspect-square">
            <Icon
              name="menu-burger"
              className={`absolute block transition-all duration-150 ease-out opacity-1 scale-100 delay-75`}
            />
          </Button>
        </SheetTrigger>
        <SheetContent className="md:hidden">
          <SheetHeader className="text-left">
            <SheetTitle>Menu</SheetTitle>
          </SheetHeader>

          <Accordion type="single" collapsible defaultValue="playground">
            <AccordionItem value="playground" >
              <AccordionTrigger>Playground</AccordionTrigger>
              <AccordionContent>
                {playgroundMenuElements.map(({ title, href, description }) => (
                  <SheetClose asChild>
                    <NavItem href={href} title={title}>
                      {description}
                    </NavItem>
                  </SheetClose>
                ))}
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <div className="py-4 flex flex-col gap-2">
            <SheetClose asChild className="w-full">
              <Link
                href="/search"
                variant="secondary"
                className="w-full flex flex-row gap-2"
              >
                <Icon name="search" />
                Search
              </Link>
            </SheetClose>
            <SheetClose asChild className="w-full">
              <Link
                href="/docs"
                variant="outline"
                className="w-full flex flex-row gap-2"
              >
                <Icon name="book" />
                Documentation
              </Link>
            </SheetClose>
            <SheetClose asChild className="w-full">
              <Link
                href="/admin"
                variant="outline"
                className="w-full flex flex-row gap-2"
              >
                <Icon name="lock" />
                Admin
              </Link>
            </SheetClose>
          </div>
        </SheetContent>
      </Sheet>

      <NavigationMenu className="hidden md:block">
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Playground</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                {playgroundMenuElements.map((component) => (
                  <ListItem
                    key={component.title}
                    title={component.title}
                    href={component.href}
                  >
                    {component.description}
                  </ListItem>
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NextLink href="/docs" legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                Documentation
              </NavigationMenuLink>
            </NextLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>((props, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <NavItem {...props} ref={ref} />
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

const NavItem = ({
  ref,
  title,
  className,
  children,
  ...props
}: React.DetailedHTMLProps<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  HTMLAnchorElement
>) => (
  <a
    ref={ref}
    className={cn(
      "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-zinc-800 hover:text-zinc-100 focus:bg-zinc-800 focus:text-zinc-100",
      className
    )}
    {...props}
  >
    <div className="text-sm font-medium leading-none">{title}</div>
    <p className="line-clamp-2 text-sm leading-snug text-zinc-400">
      {children}
    </p>
  </a>
);
