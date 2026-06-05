package com.pharma.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HomeController {

    @GetMapping("/")
    public String home() {
        return "PharmaSys backend is running. Use /api/auth/login to authenticate.";
    }
}
