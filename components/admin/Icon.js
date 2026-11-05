import {
  Settings, Menu, PanelBottom, Home, Mail, HandCoins, Newspaper, File, PenSquare, Info, Palette, Phone,
  Megaphone, Search, Building2, SlidersHorizontal, Link, Map, LayoutList, Type, FormInput, HelpCircle,
  PanelTop, ListChecks, FileText, Tags, Monitor, ShoppingCart, LayoutGrid, FolderTree, ScrollText, Image,
  Images, BarChart3, MessageSquareQuote, BadgeCheck, PlayCircle, Contact, Circle,
} from "lucide-react";

const ICONS = {
  Settings, Menu, PanelBottom, Home, Mail, HandCoins, Newspaper, File, PenSquare, Info, Palette, Phone,
  Megaphone, Search, Building2, SlidersHorizontal, Link, Map, LayoutList, Type, FormInput, HelpCircle,
  PanelTop, ListChecks, FileText, Tags, Monitor, ShoppingCart, LayoutGrid, FolderTree, ScrollText, Image,
  Images, BarChart3, MessageSquareQuote, BadgeCheck, PlayCircle, Contact,
};

/** Renders a lucide icon by the name used in lib/admin/config.js. */
export default function Icon({ name, className = "w-4 h-4" }) {
  const Component = ICONS[name] || Circle;
  return <Component className={className} aria-hidden="true" />;
}
