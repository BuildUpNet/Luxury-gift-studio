import React from 'react';

// FontAwesome icon mapper helper
// Maps Lucide icon names to exact Font Awesome 6 classes
const FA_MAP = {
  AlertCircle: 'fa-solid fa-circle-exclamation',
  AlertTriangle: 'fa-solid fa-triangle-exclamation',
  ArrowDown: 'fa-solid fa-arrow-down',
  ArrowLeft: 'fa-solid fa-arrow-left',
  ArrowRight: 'fa-solid fa-arrow-right',
  ArrowUp: 'fa-solid fa-arrow-up',
  ArrowUpDown: 'fa-solid fa-up-down',
  Bell: 'fa-solid fa-bell',
  Building: 'fa-solid fa-building',
  Calendar: 'fa-solid fa-calendar',
  CalendarHeart: 'fa-solid fa-calendar-check',
  Check: 'fa-solid fa-check',
  CheckCircle2: 'fa-solid fa-circle-check',
  ChevronDown: 'fa-solid fa-chevron-down',
  ChevronLeft: 'fa-solid fa-chevron-left',
  ChevronRight: 'fa-solid fa-chevron-right',
  ChevronUp: 'fa-solid fa-chevron-up',
  Clock: 'fa-solid fa-clock',
  Edit2: 'fa-solid fa-pen-to-square',
  Edit3: 'fa-solid fa-pen',
  ExternalLink: 'fa-solid fa-arrow-up-right-from-square',
  Eye: 'fa-solid fa-eye',
  EyeOff: 'fa-solid fa-eye-slash',
  Filter: 'fa-solid fa-filter',
  FolderTree: 'fa-solid fa-folder-tree',
  Gift: 'fa-solid fa-gift',
  Globe: 'fa-solid fa-globe',
  Grid: 'fa-solid fa-table-cells-large',
  HelpCircle: 'fa-solid fa-circle-question',
  Image: 'fa-solid fa-image',
  Images: 'fa-solid fa-images',
  LayoutDashboard: 'fa-solid fa-chart-line',
  Link: 'fa-solid fa-link',
  Loader2: 'fa-solid fa-spinner fa-spin',
  Lock: 'fa-solid fa-lock',
  LogOut: 'fa-solid fa-right-from-bracket',
  Mail: 'fa-solid fa-envelope',
  MapPin: 'fa-solid fa-location-dot',
  Menu: 'fa-solid fa-bars',
  MessageCircle: 'fa-solid fa-comment-dots',
  MessageSquare: 'fa-solid fa-comment',
  Package: 'fa-solid fa-box-open',
  PackageX: 'fa-solid fa-box-archive',
  Phone: 'fa-solid fa-phone',
  Plus: 'fa-solid fa-plus',
  Power: 'fa-solid fa-power-off',
  Quote: 'fa-solid fa-quote-left',
  RefreshCw: 'fa-solid fa-arrows-rotate',
  RotateCcw: 'fa-solid fa-rotate-left',
  Save: 'fa-solid fa-floppy-disk',
  Search: 'fa-solid fa-magnifying-glass',
  Send: 'fa-solid fa-paper-plane',
  Settings: 'fa-solid fa-gear',
  Share2: 'fa-solid fa-share-nodes',
  ShieldCheck: 'fa-solid fa-shield-halved',
  ShoppingBag: 'fa-solid fa-bag-shopping',
  SlidersHorizontal: 'fa-solid fa-sliders',
  Sparkles: 'fa-solid fa-wand-magic-sparkles',
  Star: 'fa-solid fa-star',
  Trash2: 'fa-solid fa-trash-can',
  Truck: 'fa-solid fa-truck-fast',
  Upload: 'fa-solid fa-arrow-up-from-bracket',
  X: 'fa-solid fa-xmark'
};

function createFaIcon(name) {
  const IconComponent = ({ className = '', style, onClick, ...props }) => {
    const faClass = FA_MAP[name] || 'fa-solid fa-icons';
    return (
      <i
        className={`${faClass} ${className}`.trim()}
        style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', ...style }}
        onClick={onClick}
        aria-hidden="true"
        {...props}
      />
    );
  };
  IconComponent.displayName = `FaIcon_${name}`;
  return IconComponent;
}

export const AlertCircle = createFaIcon('AlertCircle');
export const AlertTriangle = createFaIcon('AlertTriangle');
export const ArrowDown = createFaIcon('ArrowDown');
export const ArrowLeft = createFaIcon('ArrowLeft');
export const ArrowRight = createFaIcon('ArrowRight');
export const ArrowUp = createFaIcon('ArrowUp');
export const ArrowUpDown = createFaIcon('ArrowUpDown');
export const Bell = createFaIcon('Bell');
export const Building = createFaIcon('Building');
export const Calendar = createFaIcon('Calendar');
export const CalendarHeart = createFaIcon('CalendarHeart');
export const Check = createFaIcon('Check');
export const CheckCircle2 = createFaIcon('CheckCircle2');
export const ChevronDown = createFaIcon('ChevronDown');
export const ChevronLeft = createFaIcon('ChevronLeft');
export const ChevronRight = createFaIcon('ChevronRight');
export const ChevronUp = createFaIcon('ChevronUp');
export const Clock = createFaIcon('Clock');
export const Edit2 = createFaIcon('Edit2');
export const Edit3 = createFaIcon('Edit3');
export const ExternalLink = createFaIcon('ExternalLink');
export const Eye = createFaIcon('Eye');
export const EyeOff = createFaIcon('EyeOff');
export const Filter = createFaIcon('Filter');
export const FolderTree = createFaIcon('FolderTree');
export const Gift = createFaIcon('Gift');
export const Globe = createFaIcon('Globe');
export const Grid = createFaIcon('Grid');
export const HelpCircle = createFaIcon('HelpCircle');
export const Image = createFaIcon('Image');
export const Images = createFaIcon('Images');
export const LayoutDashboard = createFaIcon('LayoutDashboard');
export const Link = createFaIcon('Link');
export const LinkIcon = createFaIcon('Link');
export const Loader2 = createFaIcon('Loader2');
export const Lock = createFaIcon('Lock');
export const LogOut = createFaIcon('LogOut');
export const Mail = createFaIcon('Mail');
export const MapPin = createFaIcon('MapPin');
export const Menu = createFaIcon('Menu');
export const MessageCircle = createFaIcon('MessageCircle');
export const MessageSquare = createFaIcon('MessageSquare');
export const Package = createFaIcon('Package');
export const PackageX = createFaIcon('PackageX');
export const Phone = createFaIcon('Phone');
export const Plus = createFaIcon('Plus');
export const Power = createFaIcon('Power');
export const Quote = createFaIcon('Quote');
export const RefreshCw = createFaIcon('RefreshCw');
export const RotateCcw = createFaIcon('RotateCcw');
export const Save = createFaIcon('Save');
export const Search = createFaIcon('Search');
export const Send = createFaIcon('Send');
export const Settings = createFaIcon('Settings');
export const Share2 = createFaIcon('Share2');
export const ShieldCheck = createFaIcon('ShieldCheck');
export const ShoppingBag = createFaIcon('ShoppingBag');
export const SlidersHorizontal = createFaIcon('SlidersHorizontal');
export const Sparkles = createFaIcon('Sparkles');
export const Star = createFaIcon('Star');
export const Trash2 = createFaIcon('Trash2');
export const Truck = createFaIcon('Truck');
export const Upload = createFaIcon('Upload');
export const X = createFaIcon('X');

export default FA_MAP;
