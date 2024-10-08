import React, { useState, useEffect } from "react";
import useInfoStore from "../../stores/infos";
import "./styles/TestAnalyze.css";
import GradeAnalyzeBox from "./GradeAnalyzeBox";
import useGradeStore from "../../stores/grade";
import useSubjectStore from "../../stores/subjectStore";
import ScoreRegist from "../ScoreRegist/ScoreRegist"; // ScoreRegist 컴포넌트 가져오기
import UserGradeImage from "../GradeImg/GradeImg";
import { Switch, Typography, Stack } from "@mui/material";

const TestAnalyze = () => {
  const { userInfo, updateUserPublicStatus } = useInfoStore(); // updateUserPublicStatus 추가
  const { selectedSubject, setSelectedSubject } = useGradeStore();
  const { subjects, fetchSubjects } = useSubjectStore();

  const [showScoreRegistModal, setShowScoreRegistModal] = useState(false); // 모달을 열고 닫는 상태

  useEffect(() => {
    fetchSubjects();
  }, [fetchSubjects]);


  // 유저 성적 공개여부 감시
  useEffect(() => {
  }, [userInfo.userPublic]);

  const handleSubjectChange = (subjectCode) => {
    // 이미 선택된 과목이 다시 선택되었을 때 처리
    if (selectedSubject === subjectCode) {
      setSelectedSubject(""); // 일시적으로 선택을 해제
      setTimeout(() => setSelectedSubject(subjectCode), 0); // 바로 다시 선택된 과목으로 설정
    } else {
      setSelectedSubject(subjectCode);
    }
  };

  const openModal = () => {
    setShowScoreRegistModal(true);
  };

  const closeModal = () => {
    setShowScoreRegistModal(false);
  };

  const handleScoreSubmit = (registeredSubjectCode) => {
    closeModal(); // 모달을 닫고
    handleSubjectChange(registeredSubjectCode); // 방금 등록한 과목으로 새로고침
  };

  const handlePublicToggle = () => {
    const newPublicStatus = !userInfo.userPublic; // 현재 공개여부를 반전시킴
    updateUserPublicStatus(newPublicStatus);
  };

  return (
    <div className="analyzeTotalContainer">
      <div className="analyzeHeader">
        <div className="analyzeUserCheck">
          <h1>내 성적분석 페이지</h1>
        </div>

        <div className="analyzeSideNav">
          {/* 공개/비공개 스위치 적용 */}
          <Stack direction="row" spacing={0.5} alignItems="center">
            <Typography>{userInfo.userPublic ? "공개" : "비공개"}</Typography>
            <Switch
              size="medium"
              color="success"
              checked={Boolean(userInfo.userPublic)}
              onChange={handlePublicToggle}
            />
          </Stack>

          {/* 성적 등록 버튼 */}
          <button className="analyzeScoreRegistButton" onClick={openModal}>
            성적 등록
          </button>

          <div className="gradeSubjectSelect">
            <select
              name="subject"
              onChange={(e) => handleSubjectChange(e.target.value)}
              value={selectedSubject}
              className="form-control ml-2"
            >
              <option value="" disabled hidden>
                과목 선택
              </option>
              {subjects.map((subject) => (
                <option key={subject.subCode} value={subject.subCode}>
                  {subject.subName}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <div className="analyzeBody">
        <div className="analyzeCowStatus">
          <UserGradeImage />
        </div>
        <div className="analyzeGradeStatus">
          {selectedSubject ? (
            <GradeAnalyzeBox subject={selectedSubject} />
          ) : (
            <div className="unSelectSubject">
              <p>우선 과목을 선택하소</p>
            </div>
          )}
        </div>
      </div>

      {/* 모달 영역 */}
      {showScoreRegistModal && (
        <div className="analyzeModal-overlay">
          <div className="analyzeModal-content">
            <ScoreRegist
              onCancel={closeModal}
              onSubmit={handleScoreSubmit} // onSubmit으로 handleScoreSubmit을 전달
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default TestAnalyze;
