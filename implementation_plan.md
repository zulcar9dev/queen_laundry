# Implementation Plan: Queen Laundry MVP

## Goal

Build a touch-optimized web application for UMKM laundry management with fast order input, Kanban-style status tracking, and rack management.

## Tech Stack

| Layer | Technology | Rationale |
|---|---|---|
| Framework | **Next.js** (App Router) | React-based, SSR-ready, file-based routing |
| Styling | **Tailwind CSS** | Utility-first, rapid UI development |
| Components | **shadcn/ui** | Accessible, customizable React components |
| Font | Inter (Google Fonts via `next/font`) | Clean, modern, built-in Next.js optimization |
| Persistence | **localStorage** (MVP) | Zero-setup, offline-capable |
| ID Generation | `crypto.randomUUID()` | Native UUID |
| Drag & Drop | `@dnd-kit/core` | React-native DnD for Kanban |

> [!NOTE]
> For MVP, all data is stored in localStorage scoped by `tenant_id`. Migration to a real backend (Supabase, etc.) is a future step.

## Proposed Changes

### Core Setup

#### [NEW] Next.js Project Scaffolding
- `npx create-next-app@latest ./ --yes` (TypeScript, Tailwind CSS, ESLint, App Router)
- `npx shadcn@latest init` → configure shadcn/ui
- `npx shadcn@latest add button card dialog input label badge tabs toggle-group`
- `npm install @dnd-kit/core @dnd-kit/sortable`

---

### Design System & Layout

#### [NEW] [tailwind.config.ts](file:///c:/Users/zulka/Documents/My%20Project/queen_laundry/tailwind.config.ts)
- Extend default theme with custom color tokens (primary, success, warning, danger, etc.)
- Touch-target sizing utilities

#### [MODIFY] [src/app/globals.css](file:///c:/Users/zulka/Documents/My%20Project/queen_laundry/src/app/globals.css)
- CSS custom properties for shadcn/ui theming
- Custom utility classes for laundry-specific components (chips, steppers)

#### [MODIFY] [src/app/layout.tsx](file:///c:/Users/zulka/Documents/My%20Project/queen_laundry/src/app/layout.tsx)
- Root layout with Inter font (`next/font/google`), metadata, viewport config
- Bottom navigation component wrapper
- Mobile-optimized viewport meta

---

### Data Layer

#### [NEW] [src/lib/store.ts](file:///c:/Users/zulka/Documents/My%20Project/queen_laundry/src/lib/store.ts)
- localStorage-backed data store with `tenant_id` scoping
- CRUD: customers, orders, order_items, status_logs, racks
- Order number generator (`QL-YYMMDD-NNN`)
- Customer autocomplete search, rack availability helpers

#### [NEW] [src/lib/types.ts](file:///c:/Users/zulka/Documents/My%20Project/queen_laundry/src/lib/types.ts)
- TypeScript interfaces: `Tenant`, `Customer`, `Order`, `OrderItem`, `StatusLog`, `Rack`
- Enums: `ServiceType`, `OrderStatus`, `ClothingType`, `DominantColor`

#### [NEW] [src/hooks/useStore.ts](file:///c:/Users/zulka/Documents/My%20Project/queen_laundry/src/hooks/useStore.ts)
- React hook wrapper around store for state reactivity
- `useOrders()`, `useCustomers()`, `useRacks()` with real-time sync

---

### Shared Components

#### [NEW] [src/components/bottom-nav.tsx](file:///c:/Users/zulka/Documents/My%20Project/queen_laundry/src/components/bottom-nav.tsx)
- 3-tab navigation (Dashboard, Status, Rak) with icons and active state
- Fixed bottom, 64px height, large touch targets

#### [NEW] [src/components/order-card.tsx](file:///c:/Users/zulka/Documents/My%20Project/queen_laundry/src/components/order-card.tsx)
- Reusable card showing order summary (name, number, service, weight, time)
- Status badge with color coding

#### [NEW] [src/components/rack-selector-modal.tsx](file:///c:/Users/zulka/Documents/My%20Project/queen_laundry/src/components/rack-selector-modal.tsx)
- Grid of racks using shadcn Dialog, color-coded (green=empty, red=occupied)
- Triggered when order moves to "Packing/Rak" status

#### [NEW] [src/components/toast-provider.tsx](file:///c:/Users/zulka/Documents/My%20Project/queen_laundry/src/components/toast-provider.tsx)
- shadcn Toast for success/error notifications

---

### Page: Dashboard (Order Input)

#### [NEW] [src/app/page.tsx](file:///c:/Users/zulka/Documents/My%20Project/queen_laundry/src/app/page.tsx)
- Daily summary cards (total orders, total kg, pending orders)
- "Order Baru" large CTA button
- Recent orders list

#### [NEW] [src/app/order/page.tsx](file:///c:/Users/zulka/Documents/My%20Project/queen_laundry/src/app/order/page.tsx)
- Multi-step form with step indicator (3 steps)
- **Step 1**: Customer name (autocomplete) + WhatsApp number
- **Step 2**: Service type toggle, weight/pcs stepper, clothing grid chips, color chips, notes
- **Step 3**: Review card + "SIMPAN ORDER" CTA
- Success animation with order number

---

### Page: Status Board (Kanban)

#### [NEW] [src/app/status/page.tsx](file:///c:/Users/zulka/Documents/My%20Project/queen_laundry/src/app/status/page.tsx)
- Kanban columns (5 statuses) for tablet, list view for mobile
- Order cards with "Pindah Status →" button
- Drag & drop via `@dnd-kit` (tablet)
- Filter tabs: Semua / Hari Ini / Search
- Rack selection modal on "Packing" transition

---

### Page: Rack Management

#### [NEW] [src/app/racks/page.tsx](file:///c:/Users/zulka/Documents/My%20Project/queen_laundry/src/app/racks/page.tsx)
- Visual grid of racks (color-coded)
- Search by customer name → highlight matching rack
- Tap occupied rack → order detail → "Diambil" action
- Rack configuration modal (rows × columns)

---

## Implementation Order

| Step | Task | Key Files |
|---|---|---|
| 1 | Project scaffolding + shadcn/ui setup | config files |
| 2 | Design system (Tailwind config + globals) | `tailwind.config.ts`, `globals.css` |
| 3 | Data layer (types, store, hooks) | `types.ts`, `store.ts`, `useStore.ts` |
| 4 | App shell (layout, bottom nav) | `layout.tsx`, `bottom-nav.tsx` |
| 5 | Dashboard + Order Form | `page.tsx`, `order/page.tsx` |
| 6 | Status Board (Kanban) | `status/page.tsx`, `order-card.tsx` |
| 7 | Rack Management | `racks/page.tsx`, `rack-selector-modal.tsx` |
| 8 | Polish (animations, responsive, edge cases) | All files |

## Verification Plan

### Browser Testing
- Launch with `npm run dev`, test on **mobile viewport (390×844px)**
- End-to-end flow:
  1. Create a new order via Dashboard
  2. Verify order appears on Status Board as "Timbang Masuk"
  3. Move order through all statuses
  4. At "Packing", verify rack selection modal works
  5. On Rack page, verify occupied racks are visible
  6. Mark "Diambil" and verify rack is freed

### Manual Verification (User)
- Test on real Android tablet/phone via network URL
- Confirm touch targets and readability
