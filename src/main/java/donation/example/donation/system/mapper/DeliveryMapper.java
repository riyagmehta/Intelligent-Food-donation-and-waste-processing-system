package donation.example.donation.system.mapper;

import donation.example.donation.system.dto.DeliveryDTO;
import donation.example.donation.system.dto.UserDTO;
import donation.example.donation.system.model.entity.Delivery;
import donation.example.donation.system.model.entity.User;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface DeliveryMapper {
    DeliveryDTO toDTO(Delivery delivery);
    Delivery toEntity(DeliveryDTO deliveryDTO);
}
