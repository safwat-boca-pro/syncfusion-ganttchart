# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
npm run dev      # Start development server (Vite)
npm run build    # TypeScript check + production build
npm run lint     # Run ESLint
npm run preview  # Preview production build locally
```

## Architecture Overview

This is a React-based Gantt chart application using Syncfusion components with a custom service worker for API integration.

### Key Components

1. **Service Worker** (`/public/ganttServiceWorker.js`)
   - Intercepts all requests to `/projects`
   - Handles expand/collapse actions by parsing `$expand` and `$filter` parameters
   - Manages pagination via `$top` and `$skip` parameters
   - Fetches from external APIs with authorization headers
   - Returns only the specific project data needed (not all projects) to prevent duplication

2. **GanttChartSandBox** (`/src/components/GanttChartSandBox/`)
   - Main production component using service worker
   - Uses `CustomGanttAdaptor` for data processing
   - Implements load-on-demand for performance
   - Maps API response through `transformApiResponse()`

3. **Data Transformation** (`/src/utils/ganttDataMapper.ts`)
   - Converts API response to Syncfusion's expected format
   - Maps projects/tasks to `GanttTask` interface
   - Calculates progress based on workflow states (0, 20, 40, 60, 80)
   - Handles `IsExpanded` state preservation

### API Integration

- **Projects API**: Fetches paginated project data
- **Tasks API**: Fetches tasks for specific project IDs
- **Authentication**: Bearer token passed in headers
- **Data Format**: Projects have UUIDs as IDs, tasks link to projects via `relationships.projects.data[0].id`

### Important Implementation Details

- When expanding a project: Return only that project (with `IsExpanded: true`) and its tasks
- When collapsing a project: Return only that project (with `IsExpanded: false`)
- Initial load returns all projects with `IsExpanded: false`
- The service worker maintains expand/collapse state in the response data