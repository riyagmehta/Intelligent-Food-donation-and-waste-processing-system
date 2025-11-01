package donation.example.donation.system.mapper;

import donation.example.donation.system.dto.DonorDTO;
import donation.example.donation.system.model.entity.Donor;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface DonorMapper {
    DonorMapper INSTANCE = Mappers.getMapper(DonorMapper.class);

    DonorDTO donorToDonorDTO(Donor donor);
    Donor donorDTOToDonor(DonorDTO donorDTO);
}
