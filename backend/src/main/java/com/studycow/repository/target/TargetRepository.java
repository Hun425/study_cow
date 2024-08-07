package com.studycow.repository.target;


import com.studycow.dto.common.SubjectCodeDto;
import com.studycow.dto.score.*;
import com.studycow.dto.target.RequestTargetDto;
import com.studycow.dto.target.ScoreTargetDto;
import jakarta.persistence.PersistenceException;

import java.time.LocalDate;
import java.util.List;

/**
 * <pre>
 *      목표 관리 레포지토리 인터페이스
 * </pre>
 * @author 노명환
 * @since JDK17
 */

public interface TargetRepository {
    /** 성적 목표 등록 */
    void saveScoreTarget(RequestTargetDto requestTargetDto, int userId) throws PersistenceException;

    /** 성적 목표 조회 */
    List<ScoreTargetDto> targetList(int userId, int myId) throws PersistenceException;

    /** 성적 목표 삭제 */
    void deleteScoreTarget(int userId, Long targetId) throws PersistenceException;

    /** 성적 목표 수정 */
    void modifyScoreTarget(RequestTargetDto requestTargetDto, int userId, Long targetId) throws PersistenceException;

    /** 목표 미설정 과목 조회 */
    List<SubjectCodeDto> subjectList(int userId) throws PersistenceException;
}
