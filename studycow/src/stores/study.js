import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";
import useInfoStore from "./infos";

const API_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/studycow/";

const useStudyStore = create(
  persist(
    (set, get) => ({
      studyRoomData: {},
      rooms: [],
      recentRoom: null,

      setStudyRoomData: (data) => set({ studyRoomData: data }),

      submitStudyRoomData: async () => {
        const { token } = useInfoStore.getState();

        try {
          const { studyRoomData } = get();
          const formData = new FormData();
          formData.append("roomTitle", studyRoomData.roomTitle);
          formData.append("roomMaxPerson", studyRoomData.roomMaxPerson);
          formData.append("roomEndDate", studyRoomData.roomEndDate);
          formData.append("roomContent", studyRoomData.roomContent);
          if (studyRoomData.roomThumb) {
            formData.append("roomThumb", studyRoomData.roomThumb);
          }

          await axios.post(API_URL + `room/create`, formData, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          });
          return true;
        } catch (error) {
          console.error("에러가 발생했습니다:", error);
          return false;
        }
      },

      fetchRooms: async () => {
        const { token } = useInfoStore.getState();

        try {
          const response = await axios.get(API_URL + `room/list`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const rooms = response.data.map((room) => ({
            id: room.id,
            title: room.roomTitle,
            thumb: room.roomThumb,
            maxPerson: room.roomMaxPerson,
            nowPerson: room.roomNowPerson,
          }));
          set({ rooms });
        } catch (error) {
          console.error("방 정보를 가져오는 데 실패했습니다.", error);
        }
      },
      setNavigate: (navigate) => set({ navigate }),

      // 네비게이션바 버튼 함수
      // 채팅창 열기 함수
      showChat: true,
      toggleChat: () =>
        set((state) => {
          const newState = !state.showChat;
          return { showChat: newState };
        }),
      // 플랜 리스트창 열기 함수
      showList: false,
      toggleList: () =>
        set((state) => {
          const newState = !state.showList;
          return { showList: newState };
        }),
      // 랭킹창 열기 함수
      showLank: true,
      toggleLank: () =>
        set((state) => {
          const newState = !state.showLank;
          return { showLank: newState };
        }),

      // 뒤로가기 함수
      goStudyBack: () => {
        const { navigate } = useStudyStore.getState();
        if (navigate) {
          navigate("/study");
        }
      },
      // 사이드바 버튼 함수
      // 캠 켜기/끄기 함수
      showCam: false,
      setCam: () =>
        set((state) => {
          const newState = !state.showCam;
          return { showCam: newState };
        }),
      // 소리 켜기/끄기 함수
      soundOn: false,
      setSound: () =>
        set((state) => {
          const newState = !state.soundOn;
          return { soundOn: newState };
        }),
      // 마이크 켜기/끄기 함수
      micOn: false,
      setMic: () =>
        set((state) => {
          const newState = !state.micOn;
          return { micOn: newState };
        }),
      // bgm 켜기/끄기 함수
      bgmOn: false,
      setBgm: () =>
        set((state) => {
          const newState = !state.bgmOn;
          return { bgmOn: newState };
        }),
      fetchRecentRoom: async () => {
        const { token } = useInfoStore.getState(); // 토큰은 여전히 useInfoStore에서 가져옵니다.

        try {
          const response = await axios.get(API_URL + `room/recent`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (Array.isArray(response.data) && response.data.length > 0) {
            // 첫 번째 항목을 recentRoom으로 설정
            set({ recentRoom: response.data[0] });
            console.log("가장 최근 방이 업데이트되었습니다:", response.data[0]);
          } else {
            console.log("최근 방이 없습니다.");
            set({ recentRoom: null });
          }
        } catch (error) {
          console.error("방 정보를 가져오는 데 실패했습니다.", error);
          set({ recentRoom: null });
        }
      },

      yesterdayRankInfo: [],
      fetchYesterdayRankInfo: async () => {
        const { token } = useInfoStore.getState();

        try {
          const response = await axios.get(API_URL + `room/rank`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          console.log(response.data);
          set({ yesterdayRankInfo: response.data });
        } catch (error) {
          console.log(error);
        }
      },
    }),
    {
      name: "study-storage",
    }
  )
);

export default useStudyStore;
