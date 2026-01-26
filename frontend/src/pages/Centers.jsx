import { useEffect, useState } from 'react';
import {
    Box,
    Button,
    Heading,
    Text,
    VStack,
    HStack,
    Card,
    CardBody,
    Badge,
    useColorModeValue,
    Flex,
    Input,
    Grid,
    Icon,
    Progress,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    FormControl,
    FormLabel,
    useToast,
    IconButton,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    Spinner,
    Center,
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogOverlay,
} from '@chakra-ui/react';
import {
    FiMapPin,
    FiPlus,
    FiPackage,
    FiEdit,
    FiTrash2,
    FiMoreVertical,
} from 'react-icons/fi';
import { useRef } from 'react';
import { centerAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Centers = () => {
    const { user } = useAuth();
    const isAdmin = user?.role === 'ROLE_ADMIN' || user?.role === 'ROLE_STAFF';

    const cardBg = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.700');
    const toast = useToast();
    const cancelRef = useRef();

    const { isOpen, onOpen, onClose } = useDisclosure();
    const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
    const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();

    const [centers, setCenters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCenter, setSelectedCenter] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        location: '',
        maxCapacity: '',
    });

    useEffect(() => {
        fetchCenters();
    }, []);

    const fetchCenters = async () => {
        try {
            setLoading(true);
            const response = await centerAPI.getAll();
            setCenters(response.data);
        } catch (error) {
            console.error('Error fetching centers:', error);
            toast({
                title: 'Error',
                description: 'Failed to load collection centers',
                status: 'error',
                duration: 3000,
            });
        } finally {
            setLoading(false);
        }
    };

    const filteredCenters = centers.filter((center) =>
        (center.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (center.location || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getCapacityColor = (percentage) => {
        if (percentage >= 90) return 'red';
        if (percentage >= 70) return 'yellow';
        return 'green';
    };

    const getCapacityPercentage = (center) => {
        if (!center.maxCapacity) return 0;
        return Math.round(((center.currentLoad || 0) / center.maxCapacity) * 100);
    };

    const handleCreateCenter = () => {
        setFormData({ name: '', location: '', maxCapacity: '' });
        onOpen();
    };

    const handleEditCenter = (center) => {
        setSelectedCenter(center);
        setFormData({
            name: center.name,
            location: center.location,
            maxCapacity: center.maxCapacity?.toString() || '',
        });
        onEditOpen();
    };

    const handleDeleteClick = (center) => {
        setSelectedCenter(center);
        onDeleteOpen();
    };

    const handleSubmit = async () => {
        if (!formData.name || !formData.location || !formData.maxCapacity) {
            toast({
                title: 'Please fill all fields',
                status: 'warning',
                duration: 2000,
            });
            return;
        }

        setActionLoading(true);
        try {
            await centerAPI.create({
                name: formData.name,
                location: formData.location,
                maxCapacity: parseInt(formData.maxCapacity),
                currentLoad: 0,
            });
            toast({
                title: 'Center Created',
                description: `${formData.name} has been created successfully`,
                status: 'success',
                duration: 3000,
            });
            onClose();
            await fetchCenters();
        } catch (error) {
            console.error('Error creating center:', error);
            toast({
                title: 'Error',
                description: error.response?.data?.message || 'Failed to create center',
                status: 'error',
                duration: 3000,
            });
        } finally {
            setActionLoading(false);
        }
    };

    const handleUpdate = async () => {
        if (!formData.name || !formData.location || !formData.maxCapacity) {
            toast({
                title: 'Please fill all fields',
                status: 'warning',
                duration: 2000,
            });
            return;
        }

        setActionLoading(true);
        try {
            await centerAPI.update(selectedCenter.id, {
                name: formData.name,
                location: formData.location,
                maxCapacity: parseInt(formData.maxCapacity),
            });
            toast({
                title: 'Center Updated',
                description: `${formData.name} has been updated successfully`,
                status: 'success',
                duration: 3000,
            });
            onEditClose();
            await fetchCenters();
        } catch (error) {
            console.error('Error updating center:', error);
            toast({
                title: 'Error',
                description: error.response?.data?.message || 'Failed to update center',
                status: 'error',
                duration: 3000,
            });
        } finally {
            setActionLoading(false);
        }
    };

    const handleDelete = async () => {
        setActionLoading(true);
        try {
            await centerAPI.delete(selectedCenter.id);
            toast({
                title: 'Center Deleted',
                description: 'The collection center has been removed',
                status: 'success',
                duration: 3000,
            });
            onDeleteClose();
            await fetchCenters();
        } catch (error) {
            console.error('Error deleting center:', error);
            toast({
                title: 'Error',
                description: error.response?.data?.message || 'Failed to delete center',
                status: 'error',
                duration: 3000,
            });
        } finally {
            setActionLoading(false);
        }
    };

    const totalCapacity = centers.reduce((sum, c) => sum + (c.maxCapacity || 0), 0);
    const avgUtilization = centers.length > 0
        ? Math.round(centers.reduce((sum, c) => sum + getCapacityPercentage(c), 0) / centers.length)
        : 0;

    const CenterCard = ({ center }) => {
        const percentage = getCapacityPercentage(center);

        return (
            <Card
                bg={cardBg}
                border="1px"
                borderColor={borderColor}
                boxShadow="sm"
                _hover={{ boxShadow: 'md' }}
                transition="all 0.2s"
            >
                <CardBody>
                    <Flex justify="space-between" align="start" mb={3}>
                        <HStack spacing={3}>
                            <Box bg="teal.100" p={2} borderRadius="lg">
                                <Icon as={FiMapPin} color="teal.600" boxSize={5} />
                            </Box>
                            <Box>
                                <Heading size="sm" mb={1}>
                                    {center.name}
                                </Heading>
                                <Text fontSize="sm" color="gray.600">
                                    {center.location}
                                </Text>
                            </Box>
                        </HStack>
                        {isAdmin && (
                            <Menu>
                                <MenuButton
                                    as={IconButton}
                                    icon={<FiMoreVertical />}
                                    variant="ghost"
                                    size="sm"
                                />
                                <MenuList>
                                    <MenuItem icon={<FiEdit />} onClick={() => handleEditCenter(center)}>
                                        Edit
                                    </MenuItem>
                                    <MenuItem
                                        icon={<FiTrash2 />}
                                        color="red.500"
                                        onClick={() => handleDeleteClick(center)}
                                    >
                                        Delete
                                    </MenuItem>
                                </MenuList>
                            </Menu>
                        )}
                    </Flex>

                    <VStack spacing={3} align="stretch">
                        {/* Capacity */}
                        <Box>
                            <Flex justify="space-between" mb={2}>
                                <Text fontSize="sm" fontWeight="medium">
                                    Capacity
                                </Text>
                                <HStack spacing={2}>
                                    <Text fontSize="sm" color="gray.600">
                                        {center.currentLoad || 0}/{center.maxCapacity || 0} units
                                    </Text>
                                    <Badge colorScheme={getCapacityColor(percentage)} fontSize="xs">
                                        {percentage}%
                                    </Badge>
                                </HStack>
                            </Flex>
                            <Progress
                                value={percentage}
                                colorScheme={getCapacityColor(percentage)}
                                size="sm"
                                borderRadius="full"
                            />
                        </Box>

                        {/* Stats */}
                        <Flex justify="space-between" pt={2} borderTop="1px" borderColor={borderColor}>
                            <HStack spacing={2}>
                                <Icon as={FiPackage} color="gray.500" boxSize={4} />
                                <Text fontSize="sm" color="gray.600">
                                    {center.user?.username || 'No staff assigned'}
                                </Text>
                            </HStack>
                            <Badge colorScheme="green" fontSize="xs">
                                Active
                            </Badge>
                        </Flex>
                    </VStack>
                </CardBody>
            </Card>
        );
    };

    if (loading) {
        return (
            <Center h="400px">
                <Spinner size="xl" color="teal.500" />
            </Center>
        );
    }

    return (
        <VStack spacing={6} align="stretch">
            {/* Header */}
            <Flex justify="space-between" align="center" flexWrap="wrap" gap={4}>
                <Box>
                    <Heading size="lg" mb={1}>
                        Collection Centers
                    </Heading>
                    <Text color="gray.600">
                        {isAdmin ? 'Manage collection centers' : 'Find nearby donation centers'}
                    </Text>
                </Box>
                {isAdmin && (
                    <Button
                        leftIcon={<FiPlus />}
                        colorScheme="teal"
                        size="lg"
                        onClick={handleCreateCenter}
                    >
                        Add Center
                    </Button>
                )}
            </Flex>

            {/* Search */}
            <Card bg={cardBg} border="1px" borderColor={borderColor} boxShadow="sm">
                <CardBody>
                    <Input
                        placeholder="Search centers by name or location..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        size="md"
                    />
                </CardBody>
            </Card>

            {/* Stats */}
            <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={4}>
                <Card bg={cardBg} border="1px" borderColor={borderColor}>
                    <CardBody>
                        <Text fontSize="sm" color="gray.600">
                            Total Centers
                        </Text>
                        <Text fontSize="2xl" fontWeight="bold">
                            {centers.length}
                        </Text>
                    </CardBody>
                </Card>
                <Card bg={cardBg} border="1px" borderColor={borderColor}>
                    <CardBody>
                        <Text fontSize="sm" color="gray.600">
                            Total Capacity
                        </Text>
                        <Text fontSize="2xl" fontWeight="bold">
                            {totalCapacity} units
                        </Text>
                    </CardBody>
                </Card>
                <Card bg={cardBg} border="1px" borderColor={borderColor}>
                    <CardBody>
                        <Text fontSize="sm" color="gray.600">
                            Average Utilization
                        </Text>
                        <Text fontSize="2xl" fontWeight="bold">
                            {avgUtilization}%
                        </Text>
                    </CardBody>
                </Card>
            </Grid>

            {/* Centers Grid */}
            {filteredCenters.length > 0 ? (
                <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={6}>
                    {filteredCenters.map((center) => (
                        <CenterCard key={center.id} center={center} />
                    ))}
                </Grid>
            ) : (
                <Box textAlign="center" py={8}>
                    <Text color="gray.500">No centers found</Text>
                    {isAdmin && (
                        <Button mt={4} colorScheme="teal" onClick={handleCreateCenter}>
                            Add Your First Center
                        </Button>
                    )}
                </Box>
            )}

            {/* Create Center Modal */}
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Add New Collection Center</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <VStack spacing={4}>
                            <FormControl isRequired>
                                <FormLabel>Center Name</FormLabel>
                                <Input
                                    placeholder="e.g., Downtown Center"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </FormControl>
                            <FormControl isRequired>
                                <FormLabel>Location</FormLabel>
                                <Input
                                    placeholder="e.g., 123 Main St, Downtown"
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                />
                            </FormControl>
                            <FormControl isRequired>
                                <FormLabel>Maximum Capacity (units)</FormLabel>
                                <Input
                                    type="number"
                                    placeholder="500"
                                    value={formData.maxCapacity}
                                    onChange={(e) => setFormData({ ...formData, maxCapacity: e.target.value })}
                                />
                            </FormControl>
                        </VStack>
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="ghost" mr={3} onClick={onClose}>
                            Cancel
                        </Button>
                        <Button colorScheme="teal" onClick={handleSubmit} isLoading={actionLoading}>
                            Create Center
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            {/* Edit Center Modal */}
            <Modal isOpen={isEditOpen} onClose={onEditClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Edit Collection Center</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <VStack spacing={4}>
                            <FormControl isRequired>
                                <FormLabel>Center Name</FormLabel>
                                <Input
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </FormControl>
                            <FormControl isRequired>
                                <FormLabel>Location</FormLabel>
                                <Input
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                />
                            </FormControl>
                            <FormControl isRequired>
                                <FormLabel>Maximum Capacity (units)</FormLabel>
                                <Input
                                    type="number"
                                    value={formData.maxCapacity}
                                    onChange={(e) => setFormData({ ...formData, maxCapacity: e.target.value })}
                                />
                            </FormControl>
                        </VStack>
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="ghost" mr={3} onClick={onEditClose}>
                            Cancel
                        </Button>
                        <Button colorScheme="teal" onClick={handleUpdate} isLoading={actionLoading}>
                            Update Center
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            {/* Delete Confirmation Dialog */}
            <AlertDialog
                isOpen={isDeleteOpen}
                leastDestructiveRef={cancelRef}
                onClose={onDeleteClose}
            >
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize="lg" fontWeight="bold">
                            Delete Center
                        </AlertDialogHeader>

                        <AlertDialogBody>
                            Are you sure you want to delete "{selectedCenter?.name}"? This action cannot be undone.
                        </AlertDialogBody>

                        <AlertDialogFooter>
                            <Button ref={cancelRef} onClick={onDeleteClose}>
                                Cancel
                            </Button>
                            <Button colorScheme="red" onClick={handleDelete} ml={3} isLoading={actionLoading}>
                                Delete
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </VStack>
    );
};

export default Centers;
