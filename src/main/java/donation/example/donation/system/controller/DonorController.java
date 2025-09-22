package donation.example.donation.system.controller;
import donation.example.donation.system.model.Donor;
import donation.example.donation.system.repository.DonorRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/donors")
public class DonorController {

    private final DonorRepository donorRepository;

    public DonorController(DonorRepository donorRepository) {
        this.donorRepository = donorRepository;
    }

    @GetMapping
    public List<Donor> getAllDonors() {
        return donorRepository.findAll();
    }

    @PostMapping
    public Donor createDonor(@RequestBody Donor donor) {
        return donorRepository.save(donor);
    }
}
