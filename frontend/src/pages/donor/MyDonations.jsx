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
    Spinner,
    Center,
    useToast,
} from '@chakra-ui/react';
import { FiPlus, FiSearch, FiMoreVertical, FiEye, FiEdit, FiTrash2 } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { donationAPI } from '../../services/api';

const MyDonations = () => {
    const navigate = useNavigate();
    const toast = useToast();
    const cardBg = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.700');

    const [donations, setDonations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');

    useEffect(() => {
        fetchDonations();
    }, []);

    const fetchDonations = async () => {
        try {
            setLoading(true);
            const response = await donationAPI.getAll();
            console.log('Fetched donations:', response.data);
            setDonations(response.data);
        } catch (error) {
            console.error('Error fetching donations:', error);
            toast({
                title: 'Error',
                description: 'Failed to load donations',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this donation?')) {
            return;
        }

        try {
            await donationAPI.delete(id);
            toast({
                title: 'Donation deleted',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
            fetchDonations(); // Refresh list
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to delete donation',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            PENDING: 'yellow',
            COLLECTED: 'blue',
            DELIVERED: 'green',
            CANCELLED: 'red',
        };
        return colors[status] || 'gray';
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString();
    };

    const filteredDonations = donations.filter((donation) => {
        const matchesSearch = (donation.name || '').toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'ALL' || donation.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

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
                                    <Th>Center</Th>
                                    <Th>Status</Th>
                                    <Th>Actions</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {filteredDonations.length > 0 ? (
                                    filteredDonations.map((donation) => (
                                        <Tr key={donation.id}>
                                            <Td fontWeight="medium">
                                                {donation.name || `Donation from ${donation.donor?.name || 'Unknown'}` || 'Unnamed Donation'}
                                            </Td>
                                            <Td color="gray.600">{formatDate(donation.donationDate)}</Td>
                                            <Td color="gray.600">{donation.collectionCenter?.name || 'Not assigned'}</Td>
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
                                                                <MenuItem
                                                                    icon={<FiTrash2 />}
                                                                    color="red.500"
                                                                    onClick={() => handleDelete(donation.id)}
                                                                >
                                                                    Delete
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
                                        <Td colSpan={5} textAlign="center" py={8}>
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