package com.studycow.service.score;

import com.studycow.dto.ScoreDto;
import jakarta.persistence.PersistenceException;

import java.util.List;
import java.util.Map;

/**
 * <pre>
 *      성적 관리 서비스 인터페이스
 * </pre>
 * @author 노명환
 * @since JDK17
 */
public interface ScoreService {
    /** 유저 과목별 성적 리스트 조회 */
    List<ScoreDto> listScores(int userId, int subCode) throws Exception;

    /** 단일 성적 조회 */
    ScoreDto scoreDetail(Long scoreId) throws Exception;

    /** 유저 성적 입력 */
    void saveScore(Map<String, Object> scoreMap) throws Exception;

}
