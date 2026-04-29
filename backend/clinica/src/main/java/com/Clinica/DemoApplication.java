package com.Clinica;

import java.util.TimeZone;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.scheduling.annotation.EnableScheduling;

import jakarta.annotation.PostConstruct;

@SpringBootApplication
@EnableScheduling
public class DemoApplication {

	public static void main(String[] args) {
		SpringApplication.run(DemoApplication.class, args);
	}
    public void init() {
        // Obligamos a todo el backend a usar la hora de Perú
        TimeZone.setDefault(TimeZone.getTimeZone("America/Lima"));
        System.out.println("Hora del sistema configurada a: " + java.time.LocalDateTime.now());
    }
}
