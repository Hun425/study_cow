import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";
import useInfoStore from "./infos";
import useGradeStore from "./grade"; // grade.js에서 상태 가져오기
import Notiflix from "notiflix";

const API_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/studycow/";

// Zustand 스토어 생성
const FriendStatusStore = create(
  persist(
    (set) => ({
      subjectInfo: null, // 과목 정보를 저장할 상태

      // 과목 정보를 가져오는 함수
      fetchSubjectInfo: async (userId) => {
        const { token } = useInfoStore.getState();

        // grade.js에서 selectedSubject 가져오기
        const { selectedSubject } = useGradeStore.getState();

        if (!token || !userId) {
          Notiflix.Notify.failure("제대로 로그인이 되었는지 확인해보소!");
          set({ error: "로그인이 필요합니다." });
          return;
        }

        if (!selectedSubject) {
          Notiflix.Notify.failure("과목을 선택했는지 확인해보소!");
          set({ error: "과목을 선택하세요." });
          return;
        }

        // 요청 헤더 설정
        const headers = {
          Authorization: `Bearer ${token}`,
        };

        // URL 구성
        const url = `${API_URL}score/${userId}/list/${selectedSubject}`;

        try {
          // GET 요청을 통해 과목 데이터 가져오기
          const response = await axios.get(url, {
            headers,
          });

          // 요청이 성공하면 데이터를 상태로 설정
          if (response.status === 200) {
            set({ subjectInfo: response.data, error: null });
          } else {
            // 요청 실패 시 오류 메시지 설정
            set({ error: "정보 불러오기 에러" });
          }
        } catch (error) {
          Notiflix.Notify.failure("친구의 학습 정보를 불러오지 못했소...");
          set({ error: "API 요청 중 오류 발생" });
        }
      },
    }),
    {
      name: "friend-learning-status-storage",
    }
  )
);

export default FriendStatusStore;
