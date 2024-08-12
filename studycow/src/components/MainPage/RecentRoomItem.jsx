import "./styles/RecentRoomItem.css";
import { useState } from "react";
import StudyEnterModal from "../StudyEnter/StudyEnterModal";

const RecentRoomItem = ({
  roomId,
  title,
  thumb,
  maxPerson,
  nowPerson,
  content,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div
      className="recentRoomContainer"
      style={{ backgroundImage: `url(${thumb})` }}
    >
      <p className="recentRoomTitle">{title}</p>
      <p className="recentRoomCount">
        {nowPerson}/{maxPerson}
      </p>
      <p className="recentRoomContent">{content}</p>
      <button className="recentRoomEnterBtn" onClick={openModal}>
        입장하기
      </button>
      <StudyEnterModal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        roomId={roomId}
      />
    </div>
  );
};

export default RecentRoomItem;
