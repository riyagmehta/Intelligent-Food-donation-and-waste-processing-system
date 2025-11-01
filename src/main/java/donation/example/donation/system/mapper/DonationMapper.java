package donation.example.donation.system.mapper;

import donation.example.donation.system.dto.DonationDTO;
import donation.example.donation.system.dto.DonorDTO;
import donation.example.donation.system.dto.UserDTO;
import donation.example.donation.system.model.entity.Donation;
import donation.example.donation.system.model.entity.Donor;
import donation.example.donation.system.model.entity.User;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring", uses = {DonorMapper.class, CollectionMapper.class})
public interface DonationMapper {

    DonationDTO donationToDonationDTO(Donation donation);
    Donation donationDTOtoDonation(DonationDTO donationDTO);
}
