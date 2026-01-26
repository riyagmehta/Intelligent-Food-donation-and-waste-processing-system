package donation.example.donation.system.mapper;

import donation.example.donation.system.dto.DonationItemDTO;
import donation.example.donation.system.model.entity.DonationItem;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface DonationItemMapper {

    @Mapping(source = "name", target = "itemName")
    @Mapping(source = "donation.id", target = "donationId")
    @Mapping(source = "collectionCenter.id", target = "collectionCenterId")
    DonationItemDTO toDTO(DonationItem donationItem);

    @Mapping(source = "itemName", target = "name")
    @Mapping(target = "donation", ignore = true)
    @Mapping(target = "collectionCenter", ignore = true)
    DonationItem toEntity(DonationItemDTO donationDTO);
}
