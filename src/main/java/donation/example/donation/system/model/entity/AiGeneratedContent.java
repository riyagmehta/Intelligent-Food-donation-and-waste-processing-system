package donation.example.donation.system.model.entity;

import donation.example.donation.system.type.AiContentType;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "ai_generated_content")
public class AiGeneratedContent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long donationId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AiContentType contentType;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    // For thank you messages - the donor who should see it
    private Long recipientUserId;

    // The user who generated this content (staff for thank you)
    private Long generatedByUserId;

    private String generatedByUsername;

    // Center name for thank you messages
    private String centerName;

    private LocalDateTime generatedAt = LocalDateTime.now();

    // Donation name for reference
    private String donationName;
}
