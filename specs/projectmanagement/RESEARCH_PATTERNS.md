# Project Management Research Patterns

> Research gathered from modern PM systems (Linear, Notion, Asana) and key libraries for Ozean Licht PM MVP.

**Generated:** 2025-12-02
**Sources:** Firecrawl (Linear best practices), Context7 (@dnd-kit, react-hook-form)

---

## 1. Modern PM UI/UX Patterns (from Linear)

### Key Differentiators of Linear

1. **Keyboard-first navigation** - Nearly every action without touching mouse
   - `Cmd+K` - Global command menu
   - `/` - Filter menu
   - `C` - Create issue
   - `E` - Edit issue
   - `T` - Change status
   - `A` - Assign issue
   - `L` - Add labels

2. **Opinionated workflow** - Reduces decision fatigue
   - Default statuses: Triage → Backlog → In Progress → In Review → Done
   - Custom statuses optional: `Ready for QA`, `Blocked`, `Waiting on Design`

3. **Speed and performance** - Feels snappy even with thousands of issues

4. **Built-in Cycles (Sprints)** - First-class feature
   - Set length, start day, auto-rollover
   - Tracks carryover and completion automatically

### Core Concepts to Implement

| Concept | Linear Term | Our Implementation |
|---------|-------------|-------------------|
| Tasks | Issues | Tasks (existing) |
| Initiatives | Projects | Projects (existing) |
| Sprints | Cycles | Need to add |
| Dashboards | Views | Custom Views (need) |
| Updates | Project Updates | Activity Log (partial) |

### Best Practices from Linear

1. **Issue Titles**: Start with action verb
   - `Fix calendar loading bug`
   - `Implement Stripe webhook`
   - `Design onboarding screen`

2. **Labels**: Group by function/priority
   - Type: `Bug`, `Feature`, `Chore`, `Spike`
   - Priority: `Urgent`, `High`, `Medium`, `Low`
   - Component: `API`, `UI`, `Payments`, `Mobile`

3. **Projects**: Structure around outcomes, not features
   - `Improve trial conversion` instead of `Pricing page revamp`

4. **Cycles**: 1-2 weeks, consistent cadence

5. **Templates**: For repeatable tasks
   - Bug reports
   - Feature specs
   - QA requests

### Linear vs Our Current State

| Feature | Linear | Ozean Licht PM |
|---------|--------|----------------|
| Keyboard shortcuts | Extensive | None |
| Real-time sync | Yes | Partial (API fetch) |
| Cycles/Sprints | Built-in | Not implemented |
| Custom Views | Saved filters | Not implemented |
| Activity tracking | Real-time | Placeholder |
| Drag-and-drop | Kanban columns | Mock data only |
| Templates | Issue templates | ProcessTemplates exist |

---

## 2. Drag-and-Drop Implementation (@dnd-kit)

### Recommended Library: @dnd-kit

**Why @dnd-kit over alternatives:**
- Lightweight and modular
- Built for React
- Supports multiple input methods (mouse, touch, keyboard)
- Accessibility-first
- High performance

### Core Concepts

```tsx
// 1. DndContext - Provider for drag operations
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';

// 2. SortableContext - Wrapper for sortable lists
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';

// 3. useSortable - Hook for individual items
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
```

### Implementation Patterns

#### Basic Sortable List (Task List)

```tsx
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { SortableItem } from './SortableItem';

function TaskList() {
  const [items, setItems] = useState(['task-1', 'task-2', 'task-3']);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event) {
    const { active, over } = event;

    if (active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.indexOf(active.id);
        const newIndex = items.indexOf(over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        {items.map((id) => (
          <SortableItem key={id} id={id} />
        ))}
      </SortableContext>
    </DndContext>
  );
}
```

#### Sortable Item Component

```tsx
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

function SortableItem({ id, children }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {children}
    </div>
  );
}
```

#### Multi-Column Kanban (Tasks across statuses)

```tsx
import { DragDropProvider } from '@dnd-kit/react';
import { move } from '@dnd-kit/helpers';

function KanbanBoard() {
  const [items, setItems] = useState({
    backlog: ['task-1', 'task-2'],
    in_progress: ['task-3'],
    done: ['task-4'],
  });

  return (
    <DragDropProvider
      onDragOver={(event) => {
        const { source } = event.operation;
        if (source.type === 'column') return; // Don't move columns
        setItems((items) => move(items, event));
      }}
    >
      {Object.entries(items).map(([column, tasks], index) => (
        <Column key={column} id={column} index={index}>
          {tasks.map((id, index) => (
            <TaskCard key={id} id={id} index={index} column={column} />
          ))}
        </Column>
      ))}
    </DragDropProvider>
  );
}
```

### Key Considerations

1. **Sensors**: Use PointerSensor + KeyboardSensor for accessibility
2. **Collision Detection**: `closestCenter` for lists, `rectIntersection` for grids
3. **Strategies**: `verticalListSortingStrategy` for task lists
4. **API Update**: Call backend after `onDragEnd` to persist order

---

## 3. Form Handling (react-hook-form + Zod)

### Why react-hook-form + Zod

- **Performance**: Minimal re-renders
- **TypeScript**: Full type inference from Zod schema
- **Validation**: Server and client with same schema
- **Integration**: Works with any UI library

### Implementation Pattern

```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// 1. Define schema
const taskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().optional(),
  status: z.enum(['backlog', 'todo', 'in_progress', 'review', 'done']),
  priority: z.enum(['low', 'medium', 'high', 'urgent']),
  assigneeId: z.string().optional(),
  dueDate: z.string().optional(),
  projectId: z.string().optional(),
});

type TaskFormData = z.infer<typeof taskSchema>;

// 2. Use in component
function TaskForm({ onSubmit, defaultValues }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('title')} placeholder="Task title" />
      {errors.title && <span>{errors.title.message}</span>}

      <textarea {...register('description')} placeholder="Description" />

      <select {...register('status')}>
        <option value="backlog">Backlog</option>
        <option value="todo">To Do</option>
        <option value="in_progress">In Progress</option>
        <option value="review">Review</option>
        <option value="done">Done</option>
      </select>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Saving...' : 'Save Task'}
      </button>
    </form>
  );
}
```

### Schema Definitions for Our Entities

```tsx
// Task Creation Schema
export const createTaskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().max(5000).optional(),
  status: z.enum(['backlog', 'todo', 'in_progress', 'review', 'done', 'blocked']).default('todo'),
  priority: z.enum(['low', 'medium', 'high', 'urgent', 'critical']).default('medium'),
  taskType: z.enum(['task', 'bug', 'feature', 'improvement', 'documentation', 'research']).default('task'),
  projectId: z.string().uuid().optional(),
  assigneeId: z.string().uuid().optional(),
  dueDate: z.string().datetime().optional(),
  startDate: z.string().datetime().optional(),
  estimatedHours: z.number().min(0).max(1000).optional(),
  tags: z.array(z.string()).optional(),
  labels: z.array(z.string()).optional(),
});

// Project Update Schema
export const updateProjectSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(5000).optional(),
  status: z.enum(['planning', 'active', 'completed', 'paused', 'cancelled']).optional(),
  startDate: z.string().datetime().optional(),
  targetDate: z.string().datetime().optional(),
  projectType: z.string().optional(),
});
```

---

## 4. Recommended Architecture Changes

### New Dependencies to Add

```json
{
  "dependencies": {
    "@dnd-kit/core": "^6.1.0",
    "@dnd-kit/sortable": "^8.0.0",
    "@dnd-kit/utilities": "^3.2.2",
    "@hookform/resolvers": "^3.3.2",
    "react-hook-form": "^7.48.0",
    "zod": "^3.22.4"
  }
}
```

### New Components Needed

| Component | Purpose | Priority |
|-----------|---------|----------|
| `TaskFormModal.tsx` | Create/edit task dialog | Critical |
| `ProjectFormModal.tsx` | Create/edit project dialog | Critical |
| `SortableTaskCard.tsx` | Draggable task card | Critical |
| `KanbanColumn.tsx` | Droppable column wrapper | Critical |
| `AssigneePicker.tsx` | User selection combobox | High |
| `DatePickerField.tsx` | Date selection with calendar | High |
| `PrioritySelect.tsx` | Priority dropdown | Medium |
| `StatusSelect.tsx` | Status dropdown | Medium |
| `LabelManager.tsx` | Tag/label management | Nice-to-have |

### API Endpoints to Add

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/tasks/reorder` | POST | Persist task order changes |
| `/api/projects/[id]/tasks/reorder` | POST | Reorder within project |
| `/api/admin-users` | GET | List users for assignee picker |
| `/api/labels` | GET, POST, DELETE | Label management |

---

## 5. Implementation Priorities

### Phase 1: Critical Path (Week 1)
1. Task creation modal (react-hook-form + zod)
2. Connect TasksKanban to real API (replace mock data)
3. Basic drag-and-drop within columns (@dnd-kit)

### Phase 2: Core Features (Week 2)
4. Drag-and-drop between columns (status change)
5. Assignee picker component
6. Date picker integration
7. Project edit modal

### Phase 3: Polish (Week 3)
8. Activity log with real events
9. Keyboard shortcuts (at least Cmd+K)
10. Custom views (saved filters)

### Phase 4: Advanced (Week 4+)
11. Cycles/Sprints
12. Sprint planning view
13. Project templates
14. Time tracking

---

## 6. Design System Alignment

All new components must follow `/design-system.md`:

```css
/* Glass morphism for modals */
.modal-glass {
  background: rgba(0, 17, 26, 0.8);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(14, 166, 193, 0.3);
}

/* Primary button */
.btn-primary {
  background: #0ec2bc;
  color: white;
}

/* Form inputs */
.input-field {
  background: #00111A;
  border: 1px solid #0E282E;
  color: #C4C8D4;
}

/* Focus states */
.input-field:focus {
  border-color: #0ec2bc;
  ring: 2px solid rgba(14, 166, 193, 0.5);
}
```

---

## References

- [Linear Best Practices](https://www.morgen.so/blog-posts/how-to-use-linear-setup-best-practices-and-hidden-features)
- [@dnd-kit Documentation](https://dndkit.com)
- [react-hook-form Documentation](https://react-hook-form.com)
- [Zod Documentation](https://zod.dev)
