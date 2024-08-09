import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IconButton, Tooltip } from '@mui/material';
import { Chat } from '@mui/icons-material';
import ListIcon from '@mui/icons-material/Checklist';
import RankIcon from '@mui/icons-material/MilitaryTech';
import ExitIcon from '@mui/icons-material/Close';
import useStudyStore from "../../stores/study.js";
import usePlanStore from "../../stores/plan.js";
import Logo from '../../assets/logo.png';
import "./styles/RoomNav.css";

function RoomNav() {
  const navigate = useNavigate();
  const { today, getTodayPlanRequest } = usePlanStore((state) => ({
    today: state.today,
    getTodayPlanRequest: state.getTodayPlanRequest,
  }));
  const setNavigate = useStudyStore((state) => state.setNavigate);
  const goStudyBack = useStudyStore((state) => state.goStudyBack);
  const toggleChat = useStudyStore((state) => state.toggleChat);
  const toggleList = useStudyStore((state) => state.toggleList);
  const toggleLank = useStudyStore((state) => state.toggleLank);

  useEffect(() => {
    getTodayPlanRequest(today);
    setNavigate(navigate);
  }, [navigate, setNavigate, today, getTodayPlanRequest]);

  return (
    <div className="StudyNavContainer">
      <div className="StudyNavLogoContainer">
        <IconButton>
          <img src={Logo} alt="Logo" style={{ height: '60px' }} />
        </IconButton>
      </div>
      <div className="studyNavButtonContainer">
        <div className="utilButton">
          <Tooltip title="랭킹">
            <IconButton onClick={toggleLank}>
                <RankIcon sx={{ color: '#C3C5C5', fontSize: '32px' }}/>
            </IconButton>            
          </Tooltip>
          <Tooltip title="스터디플랜">
            <IconButton onClick={toggleList} >
              <ListIcon sx={{ color: '#C3C5C5', fontSize: '35px' }}/>
            </IconButton>
          </Tooltip>
          <Tooltip title="라이브챗">
            <IconButton onClick={toggleChat} >
              <Chat sx={{ color: '#C3C5C5', fontSize: '28px' }}/>
            </IconButton>  
          </Tooltip>
          <Tooltip title="나가기">
            <IconButton onClick={goStudyBack} >
              <ExitIcon sx={{ color: '#C3C5C5', fontSize: '40px', marginRight: "10px" }}/>
            </IconButton>            
          </Tooltip>  
        </div>
      </div>
    </div>
  );
}

export default RoomNav;
