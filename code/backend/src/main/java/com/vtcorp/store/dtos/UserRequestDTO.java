package com.vtcorp.store.dtos;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserRequestDTO {

    private String username;
    private String password;
    private String name;
    private String mail;
    private String phone;
    private String city;
    private String district;
    private String ward;
    private String street;
    private String role;
}
