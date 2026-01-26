package donation.example.donation.system.controller;

import donation.example.donation.system.dto.RecipientDTO;
import donation.example.donation.system.mapper.RecipientMapper;
import donation.example.donation.system.model.entity.Recipient;
import donation.example.donation.system.type.RecipientType;
import donation.example.donation.system.repository.RecipientRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/recipients")
public class RecipientController {

    private final RecipientRepository recipientRepository;
    private final RecipientMapper recipientMapper;

    public RecipientController(RecipientRepository recipientRepository,
                               RecipientMapper recipientMapper) {
        this.recipientRepository = recipientRepository;
        this.recipientMapper = recipientMapper;
    }

    // Get all recipients
    @GetMapping
    public List<RecipientDTO> getAllRecipients() {
        return recipientRepository.findAll().stream()
                .map(recipientMapper::toDTO)
                .collect(Collectors.toList());
    }

    // Get active recipients
    @GetMapping("/active")
    public List<RecipientDTO> getActiveRecipients() {
        return recipientRepository.findByIsActiveTrue().stream()
                .map(recipientMapper::toDTO)
                .collect(Collectors.toList());
    }

    // Get recipient by ID
    @GetMapping("/{id}")
    public ResponseEntity<RecipientDTO> getRecipientById(@PathVariable Long id) {
        return recipientRepository.findById(id)
                .map(recipient -> ResponseEntity.ok(recipientMapper.toDTO(recipient)))
                .orElse(ResponseEntity.notFound().build());
    }

    // Get recipients by type
    @GetMapping("/type/{type}")
    public List<RecipientDTO> getRecipientsByType(@PathVariable RecipientType type) {
        return recipientRepository.findByType(type).stream()
                .map(recipientMapper::toDTO)
                .collect(Collectors.toList());
    }

    // Create new recipient
    @PostMapping
    public ResponseEntity<RecipientDTO> createRecipient(@RequestBody RecipientDTO dto) {
        Recipient recipient = new Recipient();
        recipient.setName(dto.getName());
        recipient.setType(dto.getType());
        recipient.setAddress(dto.getAddress());
        recipient.setContactPerson(dto.getContactPerson());
        recipient.setPhone(dto.getPhone());
        recipient.setEmail(dto.getEmail());
        recipient.setIsActive(true);

        Recipient saved = recipientRepository.save(recipient);
        return ResponseEntity.ok(recipientMapper.toDTO(saved));
    }

    // Update recipient
    @PutMapping("/{id}")
    public ResponseEntity<RecipientDTO> updateRecipient(@PathVariable Long id,
                                                        @RequestBody RecipientDTO dto) {
        return recipientRepository.findById(id).map(recipient -> {
            if (dto.getName() != null) recipient.setName(dto.getName());
            if (dto.getType() != null) recipient.setType(dto.getType());
            if (dto.getAddress() != null) recipient.setAddress(dto.getAddress());
            if (dto.getContactPerson() != null) recipient.setContactPerson(dto.getContactPerson());
            if (dto.getPhone() != null) recipient.setPhone(dto.getPhone());
            if (dto.getEmail() != null) recipient.setEmail(dto.getEmail());
            if (dto.getIsActive() != null) recipient.setIsActive(dto.getIsActive());

            Recipient saved = recipientRepository.save(recipient);
            return ResponseEntity.ok(recipientMapper.toDTO(saved));
        }).orElse(ResponseEntity.notFound().build());
    }

    // Delete (deactivate) recipient
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRecipient(@PathVariable Long id) {
        return recipientRepository.findById(id).map(recipient -> {
            recipient.setIsActive(false);
            recipientRepository.save(recipient);
            return ResponseEntity.ok().<Void>build();
        }).orElse(ResponseEntity.notFound().build());
    }
}
