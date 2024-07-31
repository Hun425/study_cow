package com.studycow.web.file;

import com.studycow.service.file.FileService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

/**
 * <pre>
 *     GCS 파일 관리 컨트롤러 클래스
 * </pre>
 *
 * @author 박봉균
 * @since JDK17
 */
@Tag(name = "File", description = "GCS 파일 관리")
@RestController
@RequestMapping("/file")
@CrossOrigin("*")
@RequiredArgsConstructor
public class FileController {
    private final FileService fileService;

    @Operation(
            summary = "파일 업로드",
            description = "Google Cloud Storage 버킷에 파일을 업로드하고 링크를 반환합니다.<br>링크로 어디서나 파일에 접근할 수 있습니다.")
    @PostMapping("/upload")

    public ResponseEntity<?> uploadFile(MultipartFile file) {
        try {
            String fileLink = fileService.uploadFile(file);
            return new ResponseEntity<>(fileLink, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("파일 업로드 실패 : " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

}
