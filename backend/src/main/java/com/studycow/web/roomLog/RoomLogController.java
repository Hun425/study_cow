package com.studycow.web.roomLog;


import com.studycow.dto.roomLog.StudyRoomLogDto;
import com.studycow.dto.roomLog.SessionRankDto;
import com.studycow.dto.roomLog.LogRequestDto;
import com.studycow.dto.user.CustomUserDetails;
import com.studycow.service.roomLog.RoomLogService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

/**
 * <pre>
 *     방 로그 컨트롤러
 * </pre>
 * @author 노명환
 * @since JDK17
 */

@Tag(name = "RoomLog", description = "방 내부 활동")
@RestController
@RequestMapping("/roomLog")
@CrossOrigin("*")
@RequiredArgsConstructor
public class RoomLogController {

    private final RoomLogService roomLogService;

    @Operation(summary = "방 입장", description="방 입장 후 로그id 및 금일 공부한 시간을 받아옵니다.")
    @PostMapping("/enter/{roomId}")
    public ResponseEntity<?> enterRoom(
            @PathVariable Long roomId,
            @AuthenticationPrincipal CustomUserDetails userDetails
    )throws Exception {
        int userId = userDetails.getUser().getUserId();
        StudyRoomLogDto studyRoomLogDto = roomLogService.enterRoom(roomId, userId);
        return ResponseEntity.ok(studyRoomLogDto);
    }

    @Operation(summary = "공부시간 갱신", description="지금까지 공부한 시간을 갱신합니다.")
    @PatchMapping("/record")
    public ResponseEntity<?> modifyStudyTime(
            @RequestBody @Valid LogRequestDto logRequestDto,
            @AuthenticationPrincipal CustomUserDetails userDetails
    )throws Exception {
        int userId = userDetails.getUser().getUserId();
        StudyRoomLogDto studyRoomLogDto = roomLogService.modifyStudyTime(logRequestDto, userId);
        return ResponseEntity.ok(studyRoomLogDto);
    }

    @Operation(summary = "랭크 조회", description="현재 방의 공부시간 랭킹을 조회합니다.")
    @GetMapping("/rank/{roomId}")
    public ResponseEntity<?> roomRank(
            @PathVariable Long roomId,
            @AuthenticationPrincipal CustomUserDetails userDetails
    )throws Exception {
        LocalDate studyDate = LocalDateTime.now().minusHours(6).toLocalDate();
        List<SessionRankDto> rankDtoList = roomLogService.roomRank(roomId, studyDate);
        return ResponseEntity.ok(rankDtoList);
    }

    @Operation(summary = "방 퇴장", description="방 퇴장 시 및 지금까지 공부한 시간을 갱신합니다.")
    @PatchMapping("/exit")
    public ResponseEntity<?> exitRoom(
            @RequestBody @Valid LogRequestDto logRequestDto,
            @AuthenticationPrincipal CustomUserDetails userDetails
    )throws Exception {
        int userId = userDetails.getUser().getUserId();
        StudyRoomLogDto studyRoomLogDto = roomLogService.exitRoom(logRequestDto, userId);
        return ResponseEntity.ok(studyRoomLogDto);
    }
}
