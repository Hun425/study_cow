package com.studycow.web.user;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;

@Tag(name = "User", description = "회원 관리")
@RestController
@RequestMapping("/user")
@CrossOrigin("*")
public class UserController {

    @Operation(summary="회원", description = "회원")
    @GetMapping("")
    public void getUser() {

        return;
    }


}
