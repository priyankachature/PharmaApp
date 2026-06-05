package com.pharma.model;

import org.springframework.context.annotation.Bean;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "tbl_users")
@Data
@NoArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Integer userId;

    @Column(name = "username", nullable = false, unique = true, length = 50)
    private String username;

    @Column(name = "pwd_hash", nullable = false, length = 255)
    private String pwdHash;

    @Column(name = "full_name", nullable = false, length = 100)
    private String fullName;

    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false)
    private Role role;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;

    public enum Role {
        Admin, Viewer
    }

	public String getUsername() {
		// TODO Auto-generated method stub
		return null;
	}

	public String getPwdHash() {
		// TODO Auto-generated method stub
		return null;
	}

	public Bean getRole() {
		// TODO Auto-generated method stub
		return null;
	}

	public Object getFullName() {
		// TODO Auto-generated method stub
		return null;
	}
}
