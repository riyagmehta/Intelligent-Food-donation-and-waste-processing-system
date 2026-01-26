package donation.example.donation.system.mapper;

import donation.example.donation.system.dto.DeliveryDTO;
import donation.example.donation.system.model.entity.Delivery;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface DeliveryMapper {

    @Mapping(source = "donation.id", target = "donationId")
    @Mapping(source = "donation.name", target = "donationName")
    @Mapping(source = "fromCenter.id", target = "fromCenterId")
    @Mapping(source = "fromCenter.name", target = "fromCenterName")
    @Mapping(source = "driver.id", target = "driverId")
    @Mapping(source = "driver.name", target = "driverName")
    @Mapping(source = "driver.phone", target = "driverPhone")
    @Mapping(source = "recipient.id", target = "recipientId")
    @Mapping(source = "recipient.name", target = "recipientName")
    @Mapping(source = "recipient.address", target = "recipientAddress")
    DeliveryDTO toDTO(Delivery delivery);

    @Mapping(target = "donation", ignore = true)
    @Mapping(target = "fromCenter", ignore = true)
    @Mapping(target = "driver", ignore = true)
    @Mapping(target = "recipient", ignore = true)
    Delivery toEntity(DeliveryDTO deliveryDTO);
}
