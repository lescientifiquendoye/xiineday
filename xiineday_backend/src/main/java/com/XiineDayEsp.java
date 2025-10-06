package com;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@ComponentScan({"com.example.project", "com.esp.xiineday"})
@EnableJpaRepositories("com.esp.xiineday.repository")
@EntityScan("com.esp.xiineday.model")

public class XiineDayEsp {

	public static void main(String[] args) {
		SpringApplication.run(XiineDayEsp.class, args);
	}

}
