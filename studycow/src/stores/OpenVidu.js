import { create } from 'zustand';
import { OpenVidu } from 'openvidu-browser';
import axios from 'axios';

// 로컬 미디어 서버 주소
const OPENVIDU_SERVER_URL = "https://i11c202.p.ssafy.io:8444";
const OPENVIDU_SERVER_SECRET = "1emdgkrhthajrwk";

// Zustand 스토어 정의
const useRoomStore = create((set) => ({
  mySessionId: null,
  myUserName: null,
  session: undefined,
  mainStreamManager: undefined,
  publisher: undefined,
  subscribers: [],
  isMike: true,
  isCamera: true,
  isSpeaker: true,
  
  setSession: (session) => set({ session }),
  setMainStreamManager: (stream) => set({ mainStreamManager: stream }),
  setPublisher: (publisher) => set({ publisher }),
  setSubscribers: (subscribers) => set({ subscribers }),
  setIsMike: (isMike) => set({ isMike: !isMike }),
  setIsCamera: (isCamera) => set({ isCamera: !isCamera }),
  setIsSpeaker: (isSpeaker) => set({ isSpeaker: !isSpeaker }),
  setMySessionId: (sessionId) => set({ mySessionId: sessionId }),
  setMyUserName: (userName) => set({ myUserName: userName }),
  
  leaveSession: () => {
    const state = useRoomStore.getState();
    if (state.session) {
      state.session.disconnect();
    }

    set({
      session: undefined,
      subscribers: [],
      mySessionId: null,
      myUserName: null,
      mainStreamManager: undefined,
      publisher: undefined,
    });
  },

  getToken: async (sessionId) => {
    try {
      const sessionIdResult = await createSession(sessionId);
      const token = await createToken(sessionIdResult);
      return token;
    } catch (error) {
      console.error("Error while creating token:", error);
      throw error;
    }
  },

  joinSession: async () => {
    const state = useRoomStore.getState();
    const OV = new OpenVidu();
    
    OV.setAdvancedConfiguration({
      publisherSpeakingEventsOptions: {
        interval: 50,
        threshold: -75,
      },
    });

    const mySession = OV.initSession();
    set({ session: mySession });

    mySession.on("streamCreated", async (e) => {
      try {
        const subscriber = await mySession.subscribeAsync(e.stream, undefined);
        set((state) => ({
          subscribers: [...state.subscribers, subscriber]
        }));
      } catch (error) {
        console.error("Error subscribing to stream:", error);
      }
    });

    mySession.on("streamDestroyed", (e) => {
      set((state) => {
        const updatedSubscribers = state.subscribers.filter(sub => sub !== e.stream.streamManager);
        console.log("Subscriber removed:", e.stream.streamManager.stream.connection.connectionId);
        return { subscribers: updatedSubscribers };
      });
    });

    mySession.on("exception", (exception) => {
      console.warn(exception);
    });

    mySession.on("publisherStartSpeaking", (event) => {
      // UI 업데이트 로직
    });

    mySession.on("publisherStopSpeaking", (event) => {
      // UI 업데이트 로직
    });

    try {
      const token = await state.getToken(state.mySessionId);
      await mySession.connect(token, { 
        clientData: state.myUserName
      });

      const publisher = await OV.initPublisherAsync(undefined, {
        audioSource: true, // or specific device id
        videoSource: true, // or specific device id
        publishAudio: true,
        publishVideo: true,
        resolution: "640x480",
        frameRate: 30,
        insertMode: "APPEND",
        mirror: "false",
      });

      mySession.publish(publisher);
      set({
        mainStreamManager: publisher,
        publisher: publisher,
      });
    } catch (error) {
      console.log("세션 연결 오류", error.code, error.message);
    }
  }
}));

// 세션 생성
const createSession = async (sessionId) => {
  try {
    const data = JSON.stringify({ customSessionId: sessionId });
    const response = await axios.post(
      `${OPENVIDU_SERVER_URL}/openvidu/api/sessions`,
      data,
      {
        headers: {
          Authorization: `Basic ${btoa(`OPENVIDUAPP:${OPENVIDU_SERVER_SECRET}`)}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data.id;
  } catch (error) {
    if (error.response?.status === 409) {
      console.log("Session already exists. Attempting to connect...");
      return sessionId;
    } else {
      const userConfirmed = window.confirm(
        `No connection to OpenVidu Server. This may be a certificate error at "${OPENVIDU_SERVER_URL}"\n\nClick OK to navigate and accept it. If no certificate warning is shown, then check that your OpenVidu Server is up and running at "${OPENVIDU_SERVER_URL}"`
      );
      if (userConfirmed) {
        window.location.assign(`${OPENVIDU_SERVER_URL}/accept-certificate`);
      }
      throw error;
    }
  }
};

// 토큰 생성
const createToken = async (sessionId) => {
  try {
    const data = {};
    const response = await axios.post(
      `${OPENVIDU_SERVER_URL}/openvidu/api/sessions/${sessionId}/connection`,
      data,
      {
        headers: {
          Authorization: `Basic ${btoa(`OPENVIDUAPP:${OPENVIDU_SERVER_SECRET}`)}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data.token;
  } catch (error) {
    console.error("Error creating token:", error.response?.data || error.message);
    throw error;
  }
};

export default useRoomStore;
