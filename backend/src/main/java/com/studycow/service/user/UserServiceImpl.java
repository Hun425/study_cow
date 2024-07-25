package com.studycow.service.user;

import com.studycow.config.jwt.JwtUtil;
import com.studycow.domain.User;
import com.studycow.domain.UserGrade;
import com.studycow.dto.user.*;
import com.studycow.repository.user.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestHeader;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;
    private final ModelMapper modelMapper;
    private final UserGradeRepository userGradeRepository;

    @Override
    @Transactional
    public String login(LoginRequestDto loginRequestDto){
        String userEmail = loginRequestDto.getUserEmail();
        String userPassword = loginRequestDto.getPassword();
        User user = userRepository.findByUserEmail(userEmail);

        if(user ==null || !passwordEncoder.matches(userPassword, user.getUserPassword())){
            throw new BadCredentialsException("아이디 또는 비밀번호가 일치하지 않습니다.");
        }

        CustomUserInfoDto info = modelMapper.map(user, CustomUserInfoDto.class);

        String accessToken = jwtUtil.createAccessToken(info);
        return accessToken;
    }

    @Transactional
    public void register(RegisterRequestDto signUpRequestDto){

        Optional<UserGrade> optionalUserGrade = userGradeRepository.findById(1);

        if(optionalUserGrade.isPresent()){
            signUpRequestDto.setUserGrade(optionalUserGrade.get());
        }else throw new RuntimeException("존재하지 않는 등급입니다.");

        String password = signUpRequestDto.getUserPassword();

        signUpRequestDto.setUserPassword(passwordEncoder.encode(password));

        User user = modelMapper.map(signUpRequestDto, User.class);
        userRepository.save(user);

    }

    @Transactional
    @Override
    public UserInfoDto getUserInfo( Long userId){

        Optional<User> user = userRepository.findById(userId);


        if(user.isPresent()  ){
            return modelMapper.map(user.get(), UserInfoDto.class);
        }

        return null;
    }

    @Transactional
    @Override
    public void updateUserInfo(UserUpdateDto userUpdateDto, CustomUserDetails customUserDetails){

        CustomUserInfoDto CurrentUser = customUserDetails.getUser();
        Optional<User>user = userRepository.findById((long)CurrentUser.getUserId());

        int currentId = customUserDetails.getUser().getUserId();
        log.info("currnetId: {}"+currentId);

        // 유저가 존재하고, 요청한 유저와 업데이트 유저의 정보가 같으면 수행
        if(user.isPresent()){

            User newuser = user.get();
            newuser.setUserEmail(userUpdateDto.getUserEmail());
            newuser.setUserBirthday(userUpdateDto.getUserBirthday());
            newuser.setUserThumb(userUpdateDto.getUserThumb());
            newuser.setUserNickname(userUpdateDto.getUserNickname());
            newuser.setUserPublic(userUpdateDto.getUserPublic());

            userRepository.save(newuser);
        }
    }

    @Transactional
    @Override
    public UserInfoDto getUserInfoByNickName(String nickName){
        return userRepository.findByUserNickname(nickName)
                .map(user -> modelMapper.map(user,UserInfoDto.class))
                .orElseThrow(()->new EntityNotFoundException("해당하는 유저가 없습니다"));
    }
}
