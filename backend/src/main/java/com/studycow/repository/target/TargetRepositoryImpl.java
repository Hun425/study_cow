package com.studycow.repository.target;

import com.querydsl.core.types.Projections;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.JPAExpressions;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.studycow.domain.*;
import com.studycow.dto.common.SubjectCodeDto;
import com.studycow.dto.score.*;
import com.studycow.dto.target.RequestTargetDto;
import com.studycow.dto.target.ScoreTargetDto;
import com.studycow.exception.CustomException;
import com.studycow.exception.ErrorCode;
import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityNotFoundException;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.PersistenceException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import static com.studycow.domain.QSubjectCode.subjectCode;
import static com.studycow.domain.QUserScoreTarget.userScoreTarget;
import static com.studycow.domain.QUserSubjectScore.userSubjectScore;
import static com.studycow.domain.QWrongProblem.wrongProblem;


/**
 * <pre>
 *      목표 관리 레포지토리 구현
 * </pre>
 * @author 노명환
 * @since JDK17
 */
@Repository
@RequiredArgsConstructor
public class TargetRepositoryImpl implements TargetRepository {

    @PersistenceContext
    private final EntityManager em;
    private final JPAQueryFactory queryFactory;

    /** 성적 목표 등록
     * <pre>
     *      페이지에서 입력한 목표 성적을 입력한다
     * </pre>
     * @param requestTargetDto : 목표 성적 정보
     * @throws PersistenceException : JPA 표준 예외
     */
    @Override
    public void saveScoreTarget(RequestTargetDto requestTargetDto, User user, SubjectCode subjectCode) throws PersistenceException {
        try {

            int targetCnt = queryFactory
                    .selectFrom(userScoreTarget)
                    .where(userScoreTarget.user.eq(user)
                            .and(userScoreTarget.subjectCode.eq(subjectCode)))
                    .fetch().size();

            if(targetCnt > 0){
                throw new CustomException(ErrorCode.DUPLICATE_TARGET);
            }

            int targetScore = requestTargetDto.getTargetScore();
            int targetGrade = requestTargetDto.getTargetGrade();

            UserScoreTarget userScoreTarget = new UserScoreTarget(
                    null, user, subjectCode, targetScore, targetGrade
            );

            em.persist(userScoreTarget);
        }catch(Exception e){
            throw new PersistenceException("목표 등록 중 에러 발생", e);
        }
    }

    /** 성적 목표 리스트 조회
     * <pre>
     *      등록한 성적 목표의 목록을 조회한다
     * </pre>
     * @param userId : 유저 ID
     * @throws PersistenceException : JPA 표준 예외
     */
    @Override
    public List<ScoreTargetDto> targetList(int userId) throws PersistenceException {
        try{
            return queryFactory
                    .select(Projections.constructor(ScoreTargetDto.class,
                            userScoreTarget.id,
                            userScoreTarget.subjectCode.code,
                            userScoreTarget.subjectCode.name,
                            userScoreTarget.targetScore,
                            userScoreTarget.targetGrade,
                            userScoreTarget.subjectCode.maxScore))
                    .from(userScoreTarget)
                    .where(userScoreTarget.user.id.eq(userId))
                    .orderBy(userScoreTarget.subjectCode.code.asc())
                    .fetch();
        }catch(Exception e){
            throw new PersistenceException("목표 조회 중 에러 발생", e);
        }
    }

    /** 성적 목표 삭제
     * <pre>
     *      등록된 성적 목표를 삭제한다
     * </pre>
     * @param targetId : 성적 목표 ID
     * @throws PersistenceException : JPA 표준 예외
     */
    @Override
    public void deleteScoreTarget(User user, Long targetId) throws PersistenceException {
        try{
            UserScoreTarget ut = em.find(UserScoreTarget.class, targetId);
            if(ut != null) {
                if (ut.getUser() != user) {
                    throw new CustomException(ErrorCode.NOT_AUTHENTICAION);
                }
                queryFactory
                        .delete(userScoreTarget)
                        .where(userScoreTarget.id.eq(targetId))
                        .execute();
            }else{
                throw new CustomException(ErrorCode.NOT_FOUND_TARGET_ID);
            }
        }catch(CustomException e) {
            throw e;
        }catch(Exception e){
            throw new PersistenceException("목표 삭제 중 에러 발생", e);
        }
    }

    /** 성적 목표 수정
     * <pre>
     *      등록된 성적 목표를 수정한다
     * </pre>
     * @param requestTargetDto : 성적 목표 정보
     * @throws PersistenceException : JPA 표준 예외
     */
    @Override
    public void modifyScoreTarget(RequestTargetDto requestTargetDto, User user,
                                  SubjectCode subjectCode,Long targetId)
            throws PersistenceException {
        try {
            UserScoreTarget ut = em.find(UserScoreTarget.class, targetId);
            if(ut != null) {
                if (ut.getUser() != user) {
                    throw new CustomException(ErrorCode.NOT_AUTHENTICAION);
                }

                Integer targetScore = requestTargetDto.getTargetScore();
                Integer targetGrade = requestTargetDto.getTargetGrade();

                queryFactory
                        .update(userScoreTarget)
                        .set(userScoreTarget.subjectCode.code, subjectCode.getCode())
                        .set(userScoreTarget.targetScore, targetScore)
                        .set(userScoreTarget.targetGrade, targetGrade)
                        .where(userScoreTarget.id.eq(ut.getId()))
                        .execute();
            }else{
                throw new CustomException(ErrorCode.NOT_FOUND_TARGET_ID);
            }
        }catch(CustomException e) {
            throw e;
        } catch(Exception e) {
            throw new PersistenceException("목표 수정 중 에러 발생", e);
        }
    }

    /** 미등록 목표 과목 조회
     * <pre>
     *      목표 등록 시 아직 등록하지 않은 목표 과목을 조회한다
     * </pre>
     * @param userId : 유저 id
     * @throws PersistenceException : JPA 표준 예외
     */
    @Override
    public List<SubjectCodeDto> subjectList(int userId) throws PersistenceException {
        return queryFactory
                .select(Projections.constructor(SubjectCodeDto.class,
                        subjectCode.code,
                        subjectCode.name,
                        subjectCode.maxScore))
                .from(subjectCode)
                .where(subjectCode.code.notIn(
                        JPAExpressions
                                .select(userScoreTarget.subjectCode.code)
                                .from(userScoreTarget)
                                .where(userScoreTarget.user.id.eq(userId))
                )
                        .and(subjectCode.status.eq(1)))
                .orderBy(subjectCode.code.asc())
                .fetch();
    }
}
