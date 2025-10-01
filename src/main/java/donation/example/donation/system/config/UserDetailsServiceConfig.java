package donation.example.donation.system.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@Configuration
public class UserDetailsServiceConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public UserDetailsService userDetailsService(PasswordEncoder encoder) {
        UserDetails donor = User.builder()
                .username("donorUser")
                .password(encoder.encode("donor123"))
                .roles("DONOR")
                .build();

        UserDetails staff = User.builder()
                .username("staffUser")
                .password(encoder.encode("staff123"))
                .roles("STAFF")
                .build();

        UserDetails admin = User.builder()
                .username("adminUser")
                .password(encoder.encode("admin123"))
                .roles("ADMIN")
                .build();

        return new InMemoryUserDetailsManager(donor, staff, admin);
    }
}
