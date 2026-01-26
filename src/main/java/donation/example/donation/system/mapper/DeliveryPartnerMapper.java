package donation.example.donation.system.mapper;

import donation.example.donation.system.dto.DeliveryPartnerDTO;
import donation.example.donation.system.model.entity.DeliveryPartner;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = {UserMapper.class})
public interface DeliveryPartnerMapper {

    @Mapping(source = "collectionCenter.id", target = "collectionCenterId")
    @Mapping(source = "collectionCenter.name", target = "collectionCenterName")
    DeliveryPartnerDTO toDTO(DeliveryPartner deliveryPartner);

    @Mapping(target = "collectionCenter", ignore = true)
    @Mapping(target = "deliveries", ignore = true)
    DeliveryPartner toEntity(DeliveryPartnerDTO dto);
}
