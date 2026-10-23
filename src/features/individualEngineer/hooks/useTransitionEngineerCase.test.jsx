import { configureStore } from "@reduxjs/toolkit";
import { act, renderHook } from "@testing-library/react";
import { Provider } from "react-redux";
import { describe, expect, it, vi } from "vitest";
import engineerTaskReducer from "@/features/individualEngineer/slice/engineerTaskSlice";
import transitionEngineerCase from "@/features/individualEngineer/services/transitionEngineerCase";
import useTransitionEngineerCase from "@/features/individualEngineer/hooks/useTransitionEngineerCase";

vi.mock(
  "@/features/individualEngineer/services/transitionEngineerCase",
  () => ({
    default: vi.fn(),
  }),
);

vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

describe("useTransitionEngineerCase", () => {
  it("sends the selected code and updates the matching task", async () => {
    const caseId = "case-1";
    const updatedStatus = { code: "visit_schedule", name: "visit schedule" };
    vi.mocked(transitionEngineerCase).mockResolvedValue({
      message: "Case moved to visit schedule",
      data: { status: updatedStatus },
    });
    const store = configureStore({
      reducer: { engineerTask: engineerTaskReducer },
      preloadedState: {
        engineerTask: {
          ...engineerTaskReducer(undefined, { type: "@@INIT" }),
          engineerTaskData: [
            { task_id: "task-1", case_id: caseId, status: { code: "open" } },
          ],
        },
      },
    });
    const wrapper = ({ children }) => (
      <Provider store={store}>{children}</Provider>
    );
    const { result } = renderHook(() => useTransitionEngineerCase(), {
      wrapper,
    });

    await act(async () => {
      await result.current.transition(caseId, updatedStatus);
    });

    expect(transitionEngineerCase).toHaveBeenCalledWith(
      caseId,
      "visit_schedule",
    );
    expect(store.getState().engineerTask.engineerTaskData[0].status).toEqual(
      updatedStatus,
    );
    expect(result.current.updatingCaseId).toBeNull();
  });
});
