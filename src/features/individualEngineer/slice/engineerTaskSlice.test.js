import { describe, expect, it } from "vitest";
import engineerTaskReducer, {
  clearEngineerTasks,
  fetchEngineerTasks,
  updateEngineerTaskStatus,
} from "@/features/individualEngineer/slice/engineerTaskSlice";
import { logout } from "@/features/auth/slice/authSlice";

const loadedState = () => {
  const pending = engineerTaskReducer(undefined, {
    type: fetchEngineerTasks.pending.type,
    meta: { requestId: "request-1" },
  });

  return engineerTaskReducer(pending, {
    type: fetchEngineerTasks.fulfilled.type,
    payload: { data: [{ task_id: "task-1" }], totalCount: 1 },
    meta: { requestId: "request-1", arg: {} },
  });
};

describe("engineerTaskSlice", () => {
  it("stores fetched tasks and pagination metadata", () => {
    const state = engineerTaskReducer(
      engineerTaskReducer(undefined, {
        type: fetchEngineerTasks.pending.type,
        meta: { requestId: "request-1" },
      }),
      {
        type: fetchEngineerTasks.fulfilled.type,
        payload: {
          data: [{ task_id: "task-1" }],
          taskFirstId: "task-1",
          taskLastId: "task-1",
          taskLength: 1,
          hasNextPage: true,
          totalCount: 3,
          totalActiveCount: 2,
        },
        meta: {
          requestId: "request-1",
          arg: { direction: "next" },
        },
      },
    );

    expect(state.engineerTaskData).toEqual([{ task_id: "task-1" }]);
    expect(state.taskFirstId).toBe("task-1");
    expect(state.hasNextPage).toBe(true);
    expect(state.totalCount).toBe(3);
    expect(state.loading).toBe(false);
    expect(state.success).toBe(true);
  });

  it("clears persisted task data on logout", () => {
    const loaded = loadedState();

    expect(engineerTaskReducer(loaded, logout())).toEqual(
      engineerTaskReducer(undefined, { type: "@@INIT" }),
    );
  });

  it("clears task rows and pagination explicitly", () => {
    const loaded = loadedState();
    const state = engineerTaskReducer(loaded, clearEngineerTasks());

    expect(state.engineerTaskData).toEqual([]);
    expect(state.taskFirstId).toBeNull();
    expect(state.taskLastId).toBeNull();
    expect(state.loading).toBe(false);
  });

  it("updates the status for the matching case task", () => {
    const state = engineerTaskReducer(
      {
        ...loadedState(),
        engineerTaskData: [
          { task_id: "task-1", case_id: "case-1", status: { code: "open" } },
          { task_id: "task-2", case_id: "case-2", status: { code: "open" } },
        ],
      },
      updateEngineerTaskStatus({
        caseId: "case-2",
        status: { code: "visit_schedule" },
      }),
    );

    expect(state.engineerTaskData[0].status.code).toBe("open");
    expect(state.engineerTaskData[1].status.code).toBe("visit_schedule");
  });
});
