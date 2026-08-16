package com.handmadecrafts.backend;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest(properties = {
    "spring.datasource.url=jdbc:h2:mem:testdb;DB_CLOSE_DELAY=-1;MODE=MySQL",
    "spring.datasource.driver-class-name=org.h2.Driver",
    "spring.jpa.database-platform=org.hibernate.dialect.H2Dialect",
    "razorpay.key.id=dummy",
    "razorpay.key.secret=dummy",
    "huggingface.api.token=dummy",
    "jwt.secret=dummysecretkeydummysecretkeydummysecretkeydummysecretkey",
    "app.mail.from=dummy@example.com",
    "BREVO_API_KEY=dummy"
})
class BackendApplicationTests {

	@Test
	void contextLoads() {
	}

}
