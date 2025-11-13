package donation.example.donation.system.mapper;

import donation.example.donation.system.dto.CollectionCenterDTO;
import donation.example.donation.system.model.entity.CollectionCenter;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring", uses = {UserMapper.class})
public interface CollectionMapper {

    CollectionCenterDTO collectionCenterToCollectionCenterDTO(CollectionCenter donor);
    CollectionCenter collectionCenterDTOToCollectionCenter(CollectionCenterDTO donorDTO);
}
