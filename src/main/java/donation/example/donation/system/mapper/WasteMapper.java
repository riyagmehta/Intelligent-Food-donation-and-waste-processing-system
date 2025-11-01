package donation.example.donation.system.mapper;

import donation.example.donation.system.dto.DonationDTO;
import donation.example.donation.system.dto.WasteDTO;
import donation.example.donation.system.model.entity.Donation;
import donation.example.donation.system.model.entity.Waste;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface WasteMapper {

    WasteDTO toDTO(Waste donation);
    Waste toEntity(WasteDTO donationDTO);
}
