DELIMITER //
-- 방 입장 log 입력 시 방 참여유저 insert, 방 인원 수 최신화
CREATE TRIGGER TRG_AFTER_INSERT_IN_LOG
AFTER INSERT ON T_IN_LOG
FOR EACH ROW
BEGIN
	DECLARE V_USER_ID INT;
    DECLARE V_ROOM_ID bigint;
    DECLARE V_ROOM_CNT INT;
    
    SET V_USER_ID = NEW.USER_ID;
    SET V_ROOM_ID = NEW.ROOM_ID;
    
	IF NOT EXISTS (
        SELECT 1 
        FROM T_ATTEND 
        WHERE USER_ID = V_USER_ID AND ROOM_ID = V_ROOM_ID
    ) THEN
        INSERT INTO T_ATTEND (USER_ID, ROOM_ID) 
        VALUES (V_USER_ID, V_ROOM_ID);
    END IF;
    
    SELECT COUNT(*) 
    INTO V_ROOM_CNT 
    FROM T_ATTEND 
    WHERE ROOM_ID = V_ROOM_ID;
    
    UPDATE T_ROOM 
    SET ROOM_NOW_PERSON = V_ROOM_CNT,
    ROOM_UPDATE_DATE = NOW()
    WHERE ROOM_ID = NEW.ROOM_ID;
END //


DELIMITER //
-- 방 입장 log 퇴장 시 방 참여유저 delete, 방 인원 수 최신화
CREATE TRIGGER TRG_AFTER_UPDATE_IN_LOG
AFTER UPDATE ON T_IN_LOG
FOR EACH ROW
BEGIN
	DECLARE V_OUT_DATE DATETIME(6);
    DECLARE V_USER_ID INT;
	DECLARE V_ROOM_ID BIGINT;
	DECLARE V_ROOM_CNT INT;
        
    SET V_OUT_DATE = NEW.OUT_DATE;
    
    -- out_date가 업데이트되고 기존 out_date와 현 out_date가 다를 경우 trigger 실행
    IF V_OUT_DATE IS NOT NULL AND (OLD.OUT_DATE IS NULL OR V_OUT_DATE <> OLD.OUT_DATE) THEN
		SET V_USER_ID = OLD.USER_ID;
		SET V_ROOM_ID = OLD.ROOM_ID;
        
        DELETE FROM T_ATTEND
        WHERE USER_ID = V_USER_ID AND ROOM_ID = V_ROOM_ID;
        
		SELECT COUNT(*) 
		INTO V_ROOM_CNT 
		FROM T_ATTEND 
		WHERE ROOM_ID = V_ROOM_ID;
		
		UPDATE T_ROOM 
		SET ROOM_NOW_PERSON = V_ROOM_CNT,
        ROOM_UPDATE_DATE = NOW()
		WHERE ROOM_ID = NEW.ROOM_ID;
    
    END IF;
END //