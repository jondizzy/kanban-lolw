# Sales Kanban Frontend

This project is a Kanban-style sales pipeline frontend built with Vite, React, TypeScript, Material UI, and Redux Toolkit.

It supports:

- Fetching card data from a backend API
- Creating new lead cards
- Editing card details and line items
- Dragging cards between pipeline stages
- Filtering the board by division and search text
- Showing different columns depending on the logged-in user's role

## Tech Stack

- React 19
- TypeScript
- Vite
- Material UI
- Redux Toolkit
- Axios
- `@hello-pangea/dnd` for drag and drop

## Project Structure

```text
src/
  api/
    axiosApi.tsx                 Shared Axios instance for backend requests
  features/kanban/
    components/
      AddCardDialog.tsx         Create-card dialog
      CardDetailDialog.tsx      Edit-card dialog
      CardPreview.tsx           Small draggable card UI
      KanbanBoard.tsx           Drag/drop board container
      KanbanColumn.tsx          Individual pipeline column
    pages/
      KanbanPage.tsx            Main page that wires dialogs + board + auth
    utils/
      cardDivision.tsx          Division fallback logic from card code
      columnColors.tsx          Column color map
      currencyFormatter.tsx     Rupiah formatting helper
      roleColumn.tsx            Visible columns for each role
  store/
    hooks.tsx                   Typed Redux hooks
    kanbanSlice.tsx             Main Kanban state and async thunks
    kanbanTypes.tsx             Shared project types
    store.tsx                   Redux store setup
```

## How The App Works

### 1. Session and role resolution

`KanbanPage` tries to load the current user from `GET auth/me`.

The role is used to:

- decide whether the user can switch divisions manually
- choose which columns are visible
- choose the default department for new cards

If the session request fails, the page falls back to values stored in local or session storage.

### 2. Card loading

On page load, `fetchCards` in [`src/store/kanbanSlice.tsx`](./src/store/kanbanSlice.tsx) requests `GET /cards`.

The API response is normalized into:

- `tasks`: a lookup table keyed by card id
- `columns`: each column contains an ordered `taskIds` array
- `columnOrder`: the display order of pipeline columns

This normalized state makes drag/drop and updates easier to manage.

### 3. Card creation

`AddCardDialog` lets the user select:

- department
- transaction type
- lead title

Before creation, it requests `GET /cards/next-number` to preview the next running number for the selected department and transaction type.

Submitting the dialog dispatches `createTask`, which posts to `POST /cards`.

### 4. Card editing

Clicking a card opens `CardDetailDialog`.

This dialog edits:

- title and description
- customer data
- owner
- activity notes
- item rows

The line-item total is recalculated in `KanbanPage`, and saving dispatches `saveCardData`, which sends the payload to `PUT /cards/:id`.

### 5. Drag and drop

`KanbanBoard` uses `@hello-pangea/dnd`.

When a card is moved:

1. the UI is updated optimistically with `moveTask`
2. the new status is persisted with `updateCardStatus`
3. if the request fails, the move is rolled back locally

## Column Model

The board currently uses these status ids:

- `new_leads`
- `ag_qualify`
- `ag_interest`
- `ag_hot`
- `fd_food`
- `fd_long`
- `bm_bid`
- `won`
- `lost`

Visible columns are restricted by role in [`src/features/kanban/utils/roleColumn.tsx`](./src/features/kanban/utils/roleColumn.tsx).

## API Endpoints Expected By The Frontend

The frontend currently expects these routes to exist on the backend:

- `GET /auth/me`
- `GET /cards`
- `POST /cards`
- `PUT /cards/:id`
- `DELETE /cards/:id`
- `GET /cards/next-number`

## Local Development

Install dependencies:

```bash
npm install
```

Start the dev server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Lint the code:

```bash
npm run lint
```

## Configuration Notes

- The Axios instance is defined in [`src/api/axiosApi.tsx`](./src/api/axiosApi.tsx).
- The current base URL is `/`, which means requests are made relative to the host serving the frontend.
- `withCredentials: true` is enabled, so cookie-based auth/session flows are supported.

If you need to point the frontend to another backend during development, update the Axios base URL or use a Vite proxy.

## Maintenance Notes

- API responses are defensive because backend fields may arrive in multiple naming formats such as `id`, `ID`, or `Id`.
- Department codes are normalized before the board filters cards by division.
- Card totals are derived from line items, so changing quantity or price updates subtotal and total-related UI.

## Suggested Next Documentation Improvements

- Add screenshots or a short workflow GIF
- Document the backend payload contract more formally
- Add JSDoc/type comments for reusable utility functions
