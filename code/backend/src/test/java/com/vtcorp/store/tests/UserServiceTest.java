package com.vtcorp.store.tests;

import com.vtcorp.store.dtos.ChangePasswordDTO;
import com.vtcorp.store.dtos.ForgotPasswordDTO;
import com.vtcorp.store.dtos.LoginDTO;
import com.vtcorp.store.dtos.UserDTO;
import com.vtcorp.store.dtos.UserRequestDTO;
import com.vtcorp.store.entities.User;
import com.vtcorp.store.repositories.UserRepository;
import com.vtcorp.store.services.UserService;
import jakarta.validation.constraints.NotNull;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.when;

@SpringBootTest
public class UserServiceTest {

    @Autowired
    private UserService userService;

    @MockBean
    private UserRepository userRepository;

    @BeforeEach
    void setup() {
        User user = new User();
        user.setUsername("Tris");
        user.setPassword("hello1234");
        user.setCity("Ho Chi Minh");
        user.setMail("hello@gmail.com");
        user.setRole("ROLE_CUSTOMER");
        Optional<User> testUser = Optional.of(user);
        when(userRepository.findById("Tris")).thenReturn(testUser);
        when(userRepository.existsByMail("hello@gmail.com")).thenReturn(true);
        when(userRepository.findByUsernameAndPassword("Tris", "hello1234")).thenReturn(testUser);
        //cau lenh tao object fake
        //chi can set mot vai field thoi, ko can set het field
        //field nao de ay con hinh anh/image thi bo qua
    }

    @Test
    public void testLogin() {
        LoginDTO loginDTO = new LoginDTO("Tris", "hello1234");
        assertNotNull(userService.loginV2(loginDTO));
    }

    @Test
    public void testForgotPassword() {
        ForgotPasswordDTO forgotPasswordDTO = new ForgotPasswordDTO("hello@gmail.com");

        String passwordRecoveryNoti = userService.forgotPassword(forgotPasswordDTO);
        assertEquals("Check your email to recover password", passwordRecoveryNoti);
    }

    @Test
    public void testUpdateUser() {
        String newCity = "Ha Noi";

        UserRequestDTO userDTO = new UserRequestDTO();
        userDTO.setUsername("Tris");
        userDTO.setPassword("hello1234");
        userDTO.setCity(newCity);
        userDTO.setMail("hello@gmail.com");
        userDTO.setRole("ROLE_CUSTOMER");

        User updatedUser = userService.updateUser(userDTO);
        //Trong ham updateUser co goi lenh findById("Tris"), nen se tao ra object fake
        //tren ham setup do cau lenh when()...

        assertEquals(newCity, updatedUser.getCity());
    }

    @Test
    public void testRegisterUser() {
        UserDTO newUser = new UserDTO();
        newUser.setUsername("newuser");
        newUser.setPassword("newpassword123");
        newUser.setCity("Ha Noi");
        newUser.setMail("newuser@gmail.com");

        String registeredUser = userService.register(newUser);

        assertEquals("User registered successfully", registeredUser);
    }
}
