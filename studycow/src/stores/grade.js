import { create } from "zustand";
import useInfoStore from "./infos";
import axios from "axios";
import Notiflix from "notiflix";

const API_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/studycow/";

const useGradeStore = create((set) => ({
  selectedSubject: "", // ""이 아닌 null, 0을 사용할 경우 기본값('과목 선택')이 제대로 작동하지 않음
  subjectGrades: {}, // 변환된 데이터를 저장할 상태 변수
  weaknessParts: {}, // 틀린 문제 유형에 대한 정보 담을 변수
  weaknessTop3: {}, // 가장 많이 틀린 문제 유형 상위 3개와 틀린 개수 담을 변수

  // 선택된 과목을 설정하고, subjectGrades를 초기화하는 함수
  setSelectedSubject: (subject) =>
    set({
      selectedSubject: subject,
      subjectGrades: {}, // 선택된 과목이 바뀌면 subjectGrades 초기화
      weaknessTop3: {}, // 선택된 과목이 바뀌면 weaknessTop3 초기화
    }),

  // 성적 데이터를 가져와서 subjectGrades를 업데이트하는 함수
  fetchSelectedSubjectGrade: async (userId, subCode) => {
    const { token } = useInfoStore.getState(); // 토큰 가져오기

    try {
      const response = await axios.get(
        API_URL + `score/${userId}/list/${subCode}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // 인증 헤더 추가
          },
        }
      );

      // 응답 데이터를 변환하여 {testDate: {testScore, scoreDetails}} 형식으로 저장
      const grades = response.data.scores.reduce((acc, score) => {
        acc[score.testDate] = {
          scoreId: score.scoreId,
          subCode: score.subCode, // 과목 코드 추가
          testScore: score.testScore,
          testGrade: score.testGrade, // 등급 추가
          testDate: score.testDate, // 시험 일자 추가
          scoreDetails: score.scoreDetails,
        };
        return acc;
      }, {});

      set({ subjectGrades: grades }); // 변환된 데이터를 상태에 저장
    } catch (error) {
      Notiflix.Notify.failure("성적 데이터를 불러오지 못했소..."); // 에러 로그 출력
    }
  },

  fetchWeaknessPart: async (userId, subCode) => {
    const { token } = useInfoStore.getState();

    try {
      const response = await axios.get(
        API_URL + `score/${userId}/list/${subCode}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // 인증 헤더 추가
          },
        }
      );

      // detailStats 데이터 추출
      const detailStats = response.data.detailStats;

      // wrongCnt를 기준으로 내림차순 정렬
      const sortedStats = detailStats.sort((a, b) => b.wrongCnt - a.wrongCnt);

      // 틀린 유형에 대한 정보 업데이트
      const weaknessParts = sortedStats.reduce((acc, item) => {
        acc[item.catName] = item.wrongCnt;
        return acc;
      }, {});

      // 상위 3개 항목 선택
      const top3 = sortedStats.slice(0, 3);

      // weaknessTop3 객체 생성
      const weaknessTop3 = top3.reduce((acc, item) => {
        acc[item.catName] = item.wrongCnt;
        return acc;
      }, {});

      // 상태 업데이트
      set({ weaknessParts, weaknessTop3 });
    } catch (error) {
      Notiflix.Notify.failure("취약한 부분에 대한 정보들을 불러오지 못했소...");
    }
  },
}));

export default useGradeStore;
