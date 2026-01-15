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
} from '@chakra-ui/react';
import { FiPlus, FiSearch, FiMoreVertical, FiEye, FiEdit, FiTrash2 } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const MyDonations = () => {
    const navigate = useNavigate();
    const cardBg = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.700');

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');

    // Mock data - will be replaced with API calls
    const donations = [
        {
            id: 1,
            name: 'Fresh Vegetables',
            date: '2024-01-10',
            status: 'PENDING',
            center: 'Downtown Center',
            items: 3,
        },
        {
            id: 2,
            name: 'Canned Foods',
            date: '2024-01-08',
            status: 'COLLECTED',
            center: 'North Center',
            items: 5,
        },
        {
            id: 3,
            name: 'Bread & Pastries',
            date: '2024-01-05',
            status: 'DELIVERED',
            center: 'South Center',
            items: 2,
        },
        {
            id: 4,
            name: 'Dairy Products',
            date: '2024-01-03',
            status: 'DELIVERED',
            center: 'Downtown Center',
            items: 4,
        },
        {
            id: 5,
            name: 'Rice & Grains',
            date: '2024-01-01',
            status: 'DELIVERED',
            center: 'East Center',
            items: 6,
        },
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
        const matchesSearch = donation.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'ALL' || donation.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    return (
        <VStack spacing={6} align="stretch">
            {/* Header */}
            <Flex justify="space-between" align="center" flexWrap="wrap" gap={4}>
                <Box>
                    <Heading size="lg" mb={1}>
                        My Donations
                    </Heading>
                    <Text color="gray.600">Track and manage your donation history</Text>
                </Box>
                <Button
                    leftIcon={<FiPlus />}
                    colorScheme="teal"
                    size="lg"
                    onClick={() => navigate('/donations/new')}
                >
                    New Donation
                </Button>
            </Flex>

            {/* Filters and Search */}
            <Card bg={cardBg} border="1px" borderColor={borderColor} boxShadow="sm">
                <CardBody>
                    <Flex gap={4} flexWrap="wrap">
                        <Box flex={{ base: '1 1 100%', md: '1 1 auto' }}>
                            <Input
                                placeholder="Search donations..."
                                leftIcon={<FiSearch />}
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

            {/* Donations Table */}
            <Card bg={cardBg} border="1px" borderColor={borderColor} boxShadow="sm">
                <CardBody>
                    <Box overflowX="auto">
                        <Table variant="simple">
                            <Thead>
                                <Tr>
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
                                            <Td fontWeight="medium">{donation.name}</Td>
                                            <Td color="gray.600">{donation.date}</Td>
                                            <Td color="gray.600">{donation.items} items</Td>
                                            <Td color="gray.600">{donation.center}</Td>
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
                                                        <MenuItem
                                                            icon={<FiEye />}
                                                            onClick={() => navigate(`/donations/${donation.id}`)}
                                                        >
                                                            View Details
                                                        </MenuItem>
                                                        {donation.status === 'PENDING' && (
                                                            <>
                                                                <MenuItem
                                                                    icon={<FiEdit />}
                                                                    onClick={() => navigate(`/donations/${donation.id}/edit`)}
                                                                >
                                                                    Edit
                                                                </MenuItem>
                                                                <MenuItem icon={<FiTrash2 />} color="red.500">
                                                                    Cancel
                                                                </MenuItem>
                                                            </>
                                                        )}
                                                    </MenuList>
                                                </Menu>
                                            </Td>
                                        </Tr>
                                    ))
                                ) : (
                                    <Tr>
                                        <Td colSpan={6} textAlign="center" py={8}>
                                            <Text color="gray.500">No donations found</Text>
                                        </Td>
                                    </Tr>
                                )}
                            </Tbody>
                        </Table>
                    </Box>
                </CardBody>
            </Card>
        </VStack>
    );
};

export default MyDonations;