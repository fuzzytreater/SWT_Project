package com.vtcorp.store;

import com.vtcorp.store.dtos.UserDTO;
import com.vtcorp.store.entities.User;
import com.vtcorp.store.repositories.UserRepository;
import com.vtcorp.store.services.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;

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
        Mockito.when(userRepository.findById("Tris")).thenReturn(testUser);
    }


    @Test
    public void testUpdateUser() {
        String city = "Ha Noi";

        UserDTO userDTO = new UserDTO();
        userDTO.setUsername("Tris");
        userDTO.setPassword("hello1234");
        userDTO.setCity("Ho Chi Minh");
        userDTO.setMail("hello@gmail.com");
        userDTO.setRole("ROLE_CUSTOMER");
        User updatedUser = userService.updateUser(userDTO);
        assertEquals(city, updatedUser.getCity());
    }
}
