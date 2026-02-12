package com.example.demo;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;

@RestController
// @CrossOrigin permite que Angular (puerto 4200) hable con Spring (puerto 8080)
@CrossOrigin(origins = "http://localhost:4200") 
public class TestController {

    @GetMapping("/api/saludo")
    public String saludar() {
        return "¡Hola desde Spring Boot!";
    }
}