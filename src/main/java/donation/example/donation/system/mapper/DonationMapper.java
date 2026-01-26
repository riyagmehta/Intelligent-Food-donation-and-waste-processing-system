package donation.example.donation.system.mapper;

import donation.example.donation.system.dto.DonationDTO;
import donation.example.donation.system.model.entity.Donation;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = {DonorMapper.class, CollectionMapper.class, DonationItemMapper.class})
public interface DonationMapper {

    @Mapping(source = "donationItems", target = "donationItems")
    DonationDTO donationToDonationDTO(Donation donation);

    @Mapping(target = "donationItems", ignore = true)
    @Mapping(target = "delivery", ignore = true)
    Donation donationDTOtoDonation(DonationDTO donationDTO);
}
