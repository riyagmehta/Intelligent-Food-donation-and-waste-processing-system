package donation.example.donation.system.mapper;

import donation.example.donation.system.dto.DonorDTO;
import donation.example.donation.system.dto.UserDTO;
import donation.example.donation.system.model.entity.Donor;
import donation.example.donation.system.model.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring", uses = {UserMapper.class})
public interface DonorMapper {

    DonorDTO donorToDonorDTO(Donor donor);
    Donor donorDTOToDonor(DonorDTO donorDTO);
}
