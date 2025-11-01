package donation.example.donation.system.mapper;

import donation.example.donation.system.dto.DonationItemDTO;
import donation.example.donation.system.model.entity.DonationItem;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface DonationItemMapper {

    DonationItemDTO toDTO(DonationItem donation);
    DonationItem toEntity(DonationItemDTO donationDTO);
}
