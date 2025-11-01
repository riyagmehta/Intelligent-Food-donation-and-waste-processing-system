package donation.example.donation.system.mapper;

import donation.example.donation.system.dto.DonationDTO;
import donation.example.donation.system.model.entity.Donation;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring", uses = {DonorMapper.class, CollectionMapper.class, DonationItemMapper.class})
public interface DonationMapper {

    DonationDTO donationToDonationDTO(Donation donation);
    Donation donationDTOtoDonation(DonationDTO donationDTO);
}
