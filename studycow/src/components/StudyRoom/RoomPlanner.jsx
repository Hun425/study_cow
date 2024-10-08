import React, { useState, useEffect } from "react";
import usePlanStore from "../../stores/plan.js";
import './styles/RoomPlanner.css';

function RoomPlanner() {
  const { todayPlans, getTodayPlanRequest, updateTodayPlanStatus, changePlanStatus } = usePlanStore();

  useEffect(() => {
    const fetchTodayPlans = async () => {
      await getTodayPlanRequest();
    };

    fetchTodayPlans();
  }, [getTodayPlanRequest]);

  const formatPlanStudyTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return String(hours).padStart(2, '0') + ':' + String(remainingMinutes).padStart(2, '0');
  };

  const handleCheckboxChange = async (planId) => {
    await changePlanStatus(planId);
    updateTodayPlanStatus(planId); // 스토어에 상태 업데이트 요청
  };

  return (
    <div className="singleTodayPlanBox">
      <div className="todayPlanTitle">
        <p>오늘의 플랜</p>
      </div>
      {todayPlans.length > 0 ? (
        todayPlans.map((plan) => (
          <div key={plan.planId} className={`singleTodayPlanContent ${plan.planStatus ? 'completed' : ''}`}>
            <label>
              <input
                type="checkbox"
                checked={plan.planStatus === 1}
                onChange={() => handleCheckboxChange(plan.planId)}
              />
            </label>
            <p>
              {`${formatPlanStudyTime(plan.planStudyTime)}`} &nbsp; {`${plan.planContent}`}
            </p>
          </div>
        ))
      ) : (
        <div className="singleTodayPlanNoContent">
          <p>등록된 플랜이 없습니다.</p>
        </div>
      )}
    </div>
  );
}

export default RoomPlanner;
