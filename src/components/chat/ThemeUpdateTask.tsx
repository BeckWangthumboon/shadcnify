import {
  Task,
  TaskContent,
  TaskItem,
  TaskItemFile,
  TaskTrigger,
} from "@/components/ai-elements/task";
import type { ThemeUpdateSummary } from "@/lib/chat/themeUpdates";

export function ThemeUpdateTask({ updates }: { updates: ThemeUpdateSummary[] }) {
  if (!updates.length) {
    return null;
  }

  return (
    <Task defaultOpen className="mt-3">
      <TaskTrigger title="Theme tokens updated" />
      <TaskContent>
        {updates.map((update) => (
          <TaskItem key={update.toolCallId}>
            <p className="text-xs font-medium text-foreground">
              Applied to {update.targetMode} mode
            </p>
            <div className="mt-1 flex flex-wrap gap-1">
              {update.tokens.map((token) => (
                <TaskItemFile key={`${update.toolCallId}-${token}`}>
                  {token}
                </TaskItemFile>
              ))}
            </div>
          </TaskItem>
        ))}
      </TaskContent>
    </Task>
  );
}
