import React, { forwardRef, useImperativeHandle, useRef } from "react";
import { useParams } from "react-router-dom";
import Header1 from "@/features/individualEngineer/components/sheet/step1/header1";
import Header2 from "@/features/individualEngineer/components/sheet/step1/header2";
import Section1 from "@/features/individualEngineer/components/sheet/step1/section1";
import { useSelector } from "react-redux";
const Step1 = forwardRef(
  (
    { initialData = {}, task: taskOverride, showInitiationAddress = false },
    ref,
  ) => {
    const { id } = useParams();
    const section1Ref = useRef(null);

    useImperativeHandle(ref, () => ({
      getData: () => section1Ref.current?.getData(),
    }));

    const taskFromStore = useSelector((state) =>
      state.engineerTask?.engineerTaskData?.find(
        (item) => item.task_id === id || item.case_id === id,
      ),
    );
    const task = taskOverride ?? taskFromStore;
    const user = useSelector((state) => state.auth?.user);

    return (
      <div className="space-y-4">
        <Header1 task={task} user={user} />
        <Header2 task={task} />
        <Section1
          key={task?.task_id ?? id}
          ref={section1Ref}
          task={task}
          initialData={initialData}
          showInitiationAddress={showInitiationAddress}
        />
      </div>
    );
  },
);

Step1.displayName = "Step1";

export default Step1;
