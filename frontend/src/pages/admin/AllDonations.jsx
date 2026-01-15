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
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    useColorModeValue,
    Flex,
    Input,
    Select,
    IconButton,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    useToast,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
} from '@chakra-ui/react';
import { FiSearch, FiMoreVertical, FiEye, FiCheckCircle, FiTruck, FiXCircle } from 'react-icons/fi';
import { useState } from 'react';

const AllDonations = () => {
    const cardBg = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.700');
    const toast = useToast();
    const { isOpen, onOpen, onClose } = useDisclosure();

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [selectedDonation, setSelectedDonation] = useState(null);
    const [selectedCenter, setSelectedCenter] = useState('');

    // Mock data
    const donations = [
        {
            id: 1,
            donor: 'John Doe',
            name: 'Fresh Vegetables',
            date: '2024-01-13',
            status: 'PENDING',
            items: 3,
            center: null,
        },
        {
            id: 2,
            donor: 'Jane Smith',
            name: 'Canned Foods',
            date: '2024-01-13',
            status: 'COLLECTED',
            items: 5,
            center: 'Downtown Center',
        },
        {
            id: 3,
            donor: 'Bob Wilson',
            name: 'Dairy Products',
            date: '2024-01-12',
            status: 'PENDING',
            items: 4,
            center: null,
        },
        {
            id: 4,
            donor: 'Alice Brown',
            name: 'Bread & Pastries',
            date: '2024-01-12',
            status: 'DELIVERED',
            items: 2,
            center: 'North Center',
        },
        {
            id: 5,
            donor: 'Charlie Davis',
            name: 'Rice & Grains',
            date: '2024-01-11',
            status: 'COLLECTED',
            items: 6,
            center: 'South Center',
        },
    ];

    const centers = [
        { id: 1, name: 'Downtown Center' },
        { id: 2, name: 'North Center' },
        { id: 3, name: 'South Center' },
        { id: 4, name: 'East Center' },
    ];

    const getStatusColor = (status) => {
        const colors = {
            PENDING: 'yellow',
            COLLECTED: 'blue',
            DELIVERED: 'green',
            CANCELLED: 'red',
        };
        return colors[status] || 'gray';
    };

    const filteredDonations = donations.filter((donation) => {
        const matchesSearch =
            donation.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            donation.donor.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'ALL' || donation.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const handleAssignCenter = (donation) => {
        setSelectedDonation(donation);
        onOpen();
    };

    const confirmAssign = () => {
        if (!selectedCenter) {
            toast({
                title: 'Please select a center',
                status: 'warning',
                duration: 2000,
                isClosable: true,
            });
            return;
        }

        toast({
            title: 'Donation Assigned',
            description: `Assigned to ${selectedCenter}`,
            status: 'success',
            duration: 3000,
            isClosable: true,
        });
        onClose();
        setSelectedCenter('');
    };

    const handleUpdateStatus = (id, newStatus) => {
        toast({
            title: 'Status Updated',
            description: `Donation status changed to ${newStatus}`,
            status: 'success',
            duration: 3000,
            isClosable: true,
        });
    };

    return (
        <VStack spacing={6} align="stretch">
            {/* Header */}
            <Box>
                <Heading size="lg" mb={1}>
                    All Donations
                </Heading>
                <Text color="gray.600">Manage and track all donation requests</Text>
            </Box>

            {/* Filters */}
            <Card bg={cardBg} border="1px" borderColor={borderColor} boxShadow="sm">
                <CardBody>
                    <Flex gap={4} flexWrap="wrap">
                        <Box flex={{ base: '1 1 100%', md: '1 1 auto' }}>
                            <Input
                                placeholder="Search by name or donor..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                size="md"
                            />
                        </Box>
                        <Select
                            placeholder="All Status"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            maxW={{ base: 'full', md: '200px' }}
                            size="md"
                        >
                            <option value="ALL">All Status</option>
                            <option value="PENDING">Pending</option>
                            <option value="COLLECTED">Collected</option>
                            <option value="DELIVERED">Delivered</option>
                            <option value="CANCELLED">Cancelled</option>
                        </Select>
                    </Flex>
                </CardBody>
            </Card>

            {/* Statistics */}
            <HStack spacing={4}>
                <Card bg={cardBg} border="1px" borderColor={borderColor} flex={1}>
                    <CardBody>
                        <Text fontSize="sm" color="gray.600">
                            Total
                        </Text>
                        <Text fontSize="2xl" fontWeight="bold">
                            {donations.length}
                        </Text>
                    </CardBody>
                </Card>
                <Card bg={cardBg} border="1px" borderColor={borderColor} flex={1}>
                    <CardBody>
                        <Text fontSize="sm" color="gray.600">
                            Pending
                        </Text>
                        <Text fontSize="2xl" fontWeight="bold" color="yellow.500">
                            {donations.filter((d) => d.status === 'PENDING').length}
                        </Text>
                    </CardBody>
                </Card>
                <Card bg={cardBg} border="1px" borderColor={borderColor} flex={1}>
                    <CardBody>
                        <Text fontSize="sm" color="gray.600">
                            Completed
                        </Text>
                        <Text fontSize="2xl" fontWeight="bold" color="green.500">
                            {donations.filter((d) => d.status === 'DELIVERED').length}
                        </Text>
                    </CardBody>
                </Card>
            </HStack>

            {/* Donations Table */}
            <Card bg={cardBg} border="1px" borderColor={borderColor} boxShadow="sm">
                <CardBody>
                    <Box overflowX="auto">
                        <Table variant="simple">
                            <Thead>
                                <Tr>
                                    <Th>Donor</Th>
                                    <Th>Donation Name</Th>
                                    <Th>Date</Th>
                                    <Th>Items</Th>
                                    <Th>Center</Th>
                                    <Th>Status</Th>
                                    <Th>Actions</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {filteredDonations.length > 0 ? (
                                    filteredDonations.map((donation) => (
                                        <Tr key={donation.id}>
                                            <Td fontWeight="medium">{donation.donor}</Td>
                                            <Td>{donation.name}</Td>
                                            <Td color="gray.600">{donation.date}</Td>
                                            <Td color="gray.600">{donation.items} items</Td>
                                            <Td color="gray.600">{donation.center || '-'}</Td>
                                            <Td>
                                                <Badge colorScheme={getStatusColor(donation.status)} fontSize="xs">
                                                    {donation.status}
                                                </Badge>
                                            </Td>
                                            <Td>
                                                <Menu>
                                                    <MenuButton
                                                        as={IconButton}
                                                        icon={<FiMoreVertical />}
                                                        variant="ghost"
                                                        size="sm"
                                                    />
                                                    <MenuList>
                                                        <MenuItem icon={<FiEye />}>View Details</MenuItem>
                                                        {donation.status === 'PENDING' && (
                                                            <>
                                                                <MenuItem
                                                                    icon={<FiTruck />}
                                                                    onClick={() => handleAssignCenter(donation)}
                                                                >
                                                                    Assign to Center
                                                                </MenuItem>
                                                                <MenuItem
                                                                    icon={<FiCheckCircle />}
                                                                    onClick={() => handleUpdateStatus(donation.id, 'COLLECTED')}
                                                                >
                                                                    Mark as Collected
                                                                </MenuItem>
                                                            </>
                                                        )}
                                                        {donation.status === 'COLLECTED' && (
                                                            <MenuItem
                                                                icon={<FiCheckCircle />}
                                                                onClick={() => handleUpdateStatus(donation.id, 'DELIVERED')}
                                                            >
                                                                Mark as Delivered
                                                            </MenuItem>
                                                        )}
                                                        {donation.status !== 'DELIVERED' && (
                                                            <MenuItem
                                                                icon={<FiXCircle />}
                                                                color="red.500"
                                                                onClick={() => handleUpdateStatus(donation.id, 'CANCELLED')}
                                                            >
                                                                Cancel
                                                            </MenuItem>
                                                        )}
                                                    </MenuList>
                                                </Menu>
                                            </Td>
                                        </Tr>
                                    ))
                                ) : (
                                    <Tr>
                                        <Td colSpan={7} textAlign="center" py={8}>
                                            <Text color="gray.500">No donations found</Text>
                                        </Td>
                                    </Tr>
                                )}
                            </Tbody>
                        </Table>
                    </Box>
                </CardBody>
            </Card>

            {/* Assign Center Modal */}
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Assign to Collection Center</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <VStack spacing={4} align="stretch">
                            <Text fontSize="sm" color="gray.600">
                                Donation: <strong>{selectedDonation?.name}</strong>
                            </Text>
                            <Select
                                placeholder="Select a center"
                                value={selectedCenter}
                                onChange={(e) => setSelectedCenter(e.target.value)}
                            >
                                {centers.map((center) => (
                                    <option key={center.id} value={center.name}>
                                        {center.name}
                                    </option>
                                ))}
                            </Select>
                        </VStack>
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="ghost" mr={3} onClick={onClose}>
                            Cancel
                        </Button>
                        <Button colorScheme="teal" onClick={confirmAssign}>
                            Assign
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </VStack>
    );
};

export default AllDonations;