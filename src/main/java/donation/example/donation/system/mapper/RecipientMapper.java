package donation.example.donation.system.mapper;

import donation.example.donation.system.dto.RecipientDTO;
import donation.example.donation.system.model.entity.Recipient;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface RecipientMapper {

    RecipientDTO toDTO(Recipient recipient);

    @Mapping(target = "deliveries", ignore = true)
    Recipient toEntity(RecipientDTO dto);
}
