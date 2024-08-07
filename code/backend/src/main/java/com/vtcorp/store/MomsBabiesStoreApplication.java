package com.vtcorp.store;

import com.vtcorp.store.config.RsaKeyProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableConfigurationProperties(RsaKeyProperties.class)
@EnableScheduling
@SpringBootApplication
public class MomsBabiesStoreApplication {

    public static void main(String[] args) {
        SpringApplication.run(MomsBabiesStoreApplication.class, args);
    }

}
