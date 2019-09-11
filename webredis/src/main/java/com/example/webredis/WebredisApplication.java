package com.example.webredis;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@MapperScan("com.example.webredis.data")
public class WebredisApplication {

    public static void main(String[] args) {
        SpringApplication.run(WebredisApplication.class, args);
    }

}
