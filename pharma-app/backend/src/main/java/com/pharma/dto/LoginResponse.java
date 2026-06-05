package com.pharma.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LoginResponse {
    public LoginResponse(String token2, String username2, Object fullName2, String[] name) {
		// TODO Auto-generated constructor stub
	}
	private String token;
    private String username;
    private String fullName;
    private String role;
}
