import React, { useEffect } from "react";
import { IconButton, Tooltip } from '@mui/material';
import { Settings, VolumeUp, VolumeOff, Videocam, VideocamOff, MusicNote, MusicOff, Mic, MicOff } from '@mui/icons-material';
import useRoomStore from "../../stores/OpenVidu.js";
import './styles/RoomSidebar.css';

function RoomSidebar({ bgmOn, onOpenAudioModal, onOpenSettingsModal }) {
  const {
    isMike, 
    isCamera, 
    isSpeaker,
    setIsMike, 
    setIsCamera, 
    setIsSpeaker, 
    publisher,
    subscribers,
  } = useRoomStore(state => ({
    isMike: state.isMike,
    isCamera: state.isCamera,
    isSpeaker: state.isSpeaker,
    setIsMike: state.setIsMike,
    setIsCamera: state.setIsCamera,
    setIsSpeaker: state.setIsSpeaker,
    publisher: state.publisher,
    subscribers: state.subscribers,
  }));

  useEffect(() => {
    if (publisher) {
      publisher.publishVideo(isCamera);
      publisher.publishAudio(isMike);
    }
  }, [isCamera, isMike, publisher]);

  useEffect(() => {
    subscribers.forEach((subscriber) => {
      subscriber.subscribeToAudio(isSpeaker);
    });
  }, [isSpeaker, subscribers]);

  return (
    <div className="StudySideContainer">
      <div className="StudySideButtonContainer">
        <Tooltip title={isCamera ? "카메라 끄기" : "카메라 켜기"}>
          <IconButton onClick={() => setIsCamera(isCamera)}>
            {isCamera ? <Videocam className="studySideCameraIcon" /> : <VideocamOff className="studySideCameraOffIcon"/>}
          </IconButton>
        </Tooltip>
        <Tooltip title={isSpeaker ? "사운드 끄기" : "사운드 켜기"}>
          <IconButton onClick={() => setIsSpeaker(isSpeaker)}>
            {isSpeaker ? <VolumeUp className="studySideSpeakerIcon"/> : <VolumeOff className="studySideSpeakerOffIcon"/>}
          </IconButton>
        </Tooltip>
        <Tooltip title={isMike ? "마이크 끄기" : "마이크 켜기"}>
          <IconButton onClick={() => setIsMike(isMike)}>
            {isMike ? <Mic className="studySideMicIcon"/> : <MicOff className="studySideMicOffIcon"/>}
          </IconButton>
        </Tooltip>
        <Tooltip title="배경음악 설정">
          <IconButton onClick={onOpenAudioModal}>
            {bgmOn ? <MusicNote className="studySideMusicIcon"/> : <MusicOff className="studySideMusicOffIcon"/>}
          </IconButton>
        </Tooltip>
      </div>
      <div className="studySideSettingButtonContainer">
        <Tooltip title="설정 변경">
          <IconButton onClick={onOpenSettingsModal}>
            <Settings className="studySideSettingsIcon"/>
          </IconButton>
        </Tooltip>
      </div>
    </div>
  );
}

export default RoomSidebar;
