package donation.example.donation.system.mapper;

import donation.example.donation.system.dto.UserDTO;
import donation.example.donation.system.model.entity.User;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserMapper {
    UserDTO userToUserDTO(User user);
    User userDTOtoUser(UserDTO userDTO);
}
