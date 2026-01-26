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
    Icon,
    InputGroup,
    InputLeftElement,
    Tooltip,
    Grid,
} from '@chakra-ui/react';
import { FiPlus, FiSearch, FiMoreVertical, FiEye, FiEdit, FiTrash2, FiPackage, FiCalendar, FiMapPin, FiArrowRight, FiFilter } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { donationAPI } from '../../services/api';

const MyDonations = () => {
    const navigate = useNavigate();
    const toast = useToast();

    // Color mode values
    const cardBg = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.100', 'gray.700');
    const textColor = useColorModeValue('gray.600', 'gray.400');
    const headingColor = useColorModeValue('gray.800', 'white');
    const hoverBg = useColorModeValue('gray.50', 'gray.700');
    const tableBg = useColorModeValue('gray.50', 'gray.900');
    const gradientBg = useColorModeValue(
        'linear(to-br, brand.400, teal.400, blue.400)',
        'linear(to-br, brand.500, teal.500, blue.500)'
    );

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
            const response = await donationAPI.getMyDonations();
            setDonations(response.data);
        } catch (error) {
            console.error('Error fetching donations:', error);
            toast({
                title: 'Error',
                description: 'Failed to load donations',
                status: 'error',
                duration: 3000,
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
            fetchDonations();
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
            REJECTED: 'red',
            COLLECTED: 'blue',
            DELIVERED: 'green',
            PROCESSED: 'purple',
        };
        return colors[status] || 'gray';
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const filteredDonations = donations.filter((donation) => {
        const matchesSearch = (donation.name || '').toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'ALL' || donation.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    // Stats calculation
    const stats = {
        total: donations.length,
        pending: donations.filter(d => d.status === 'PENDING').length,
        completed: donations.filter(d => d.status === 'DELIVERED').length,
    };

    if (loading) {
        return (
            <Center h="400px">
                <VStack spacing={4}>
                    <Spinner size="xl" color="brand.500" thickness="4px" />
                    <Text color={textColor}>Loading your donations...</Text>
                </VStack>
            </Center>
        );
    }

    return (
        <VStack spacing={8} align="stretch">
            {/* Header */}
            <Card
                bg={cardBg}
                borderRadius="2xl"
                border="1px"
                borderColor={borderColor}
                boxShadow={useColorModeValue('lg', 'dark-lg')}
                overflow="hidden"
            >
                <CardBody p={0}>
                    <Flex direction={{ base: 'column', md: 'row' }}>
                        {/* Left - Gradient Panel */}
                        <Box
                            bgGradient={gradientBg}
                            p={8}
                            w={{ base: '100%', md: '200px' }}
                            minH={{ base: 'auto', md: '150px' }}
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            position="relative"
                            overflow="hidden"
                        >
                            <Box
                                position="absolute"
                                top="-20%"
                                right="-20%"
                                w="100px"
                                h="100px"
                                borderRadius="full"
                                bg="whiteAlpha.200"
                            />
                            <Icon as={FiPackage} color="white" boxSize={12} />
                        </Box>

                        {/* Right - Info */}
                        <Flex flex={1} p={8} justify="space-between" align="center" flexWrap="wrap" gap={4}>
                            <Box>
                                <Heading size="xl" color={headingColor} fontWeight="800">
                                    My Donations
                                </Heading>
                                <Text color={textColor} mt={2}>
                                    Track and manage your donation history
                                </Text>
                            </Box>
                            <Button
                                leftIcon={<FiPlus />}
                                rightIcon={<FiArrowRight />}
                                bgGradient={gradientBg}
                                color="white"
                                size="lg"
                                borderRadius="xl"
                                px={8}
                                _hover={{
                                    bgGradient: 'linear(to-r, brand.500, teal.500, blue.500)',
                                    transform: 'translateY(-2px)',
                                    boxShadow: 'lg',
                                }}
                                transition="all 0.2s"
                                onClick={() => navigate('/donations/new')}
                            >
                                New Donation
                            </Button>
                        </Flex>
                    </Flex>
                </CardBody>
            </Card>

            {/* Quick Stats */}
            <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={6}>
                <Card
                    bg={cardBg}
                    border="1px"
                    borderColor={borderColor}
                    borderRadius="2xl"
                    boxShadow={useColorModeValue('lg', 'dark-lg')}
                >
                    <CardBody p={6}>
                        <HStack justify="space-between">
                            <Box>
                                <Text fontSize="sm" color={textColor} textTransform="uppercase" fontWeight="600">
                                    Total
                                </Text>
                                <Text fontSize="3xl" fontWeight="800" color={headingColor}>
                                    {stats.total}
                                </Text>
                            </Box>
                            <Box bg={useColorModeValue('brand.100', 'brand.900')} p={3} borderRadius="xl">
                                <Icon as={FiPackage} color={useColorModeValue('brand.600', 'brand.300')} boxSize={6} />
                            </Box>
                        </HStack>
                    </CardBody>
                </Card>

                <Card
                    bg={cardBg}
                    border="1px"
                    borderColor={borderColor}
                    borderRadius="2xl"
                    boxShadow={useColorModeValue('lg', 'dark-lg')}
                >
                    <CardBody p={6}>
                        <HStack justify="space-between">
                            <Box>
                                <Text fontSize="sm" color={textColor} textTransform="uppercase" fontWeight="600">
                                    Pending
                                </Text>
                                <Text fontSize="3xl" fontWeight="800" color={useColorModeValue('yellow.500', 'yellow.300')}>
                                    {stats.pending}
                                </Text>
                            </Box>
                            <Box bg={useColorModeValue('yellow.100', 'yellow.900')} p={3} borderRadius="xl">
                                <Icon as={FiCalendar} color={useColorModeValue('yellow.600', 'yellow.300')} boxSize={6} />
                            </Box>
                        </HStack>
                    </CardBody>
                </Card>

                <Card
                    bg={cardBg}
                    border="1px"
                    borderColor={borderColor}
                    borderRadius="2xl"
                    boxShadow={useColorModeValue('lg', 'dark-lg')}
                >
                    <CardBody p={6}>
                        <HStack justify="space-between">
                            <Box>
                                <Text fontSize="sm" color={textColor} textTransform="uppercase" fontWeight="600">
                                    Delivered
                                </Text>
                                <Text fontSize="3xl" fontWeight="800" color={useColorModeValue('green.500', 'green.300')}>
                                    {stats.completed}
                                </Text>
                            </Box>
                            <Box bg={useColorModeValue('green.100', 'green.900')} p={3} borderRadius="xl">
                                <Icon as={FiMapPin} color={useColorModeValue('green.600', 'green.300')} boxSize={6} />
                            </Box>
                        </HStack>
                    </CardBody>
                </Card>
            </Grid>

            {/* Filters and Search */}
            <Card
                bg={cardBg}
                border="1px"
                borderColor={borderColor}
                borderRadius="2xl"
                boxShadow={useColorModeValue('lg', 'dark-lg')}
            >
                <CardBody p={6}>
                    <Flex gap={4} flexWrap="wrap" align="center">
                        <InputGroup flex={{ base: '1 1 100%', md: '1 1 auto' }} maxW={{ md: '400px' }}>
                            <InputLeftElement pointerEvents="none">
                                <Icon as={FiSearch} color={textColor} />
                            </InputLeftElement>
                            <Input
                                placeholder="Search donations..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                borderRadius="xl"
                            />
                        </InputGroup>
                        <HStack spacing={2}>
                            <Icon as={FiFilter} color={textColor} />
                            <Select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                w="180px"
                                borderRadius="xl"
                            >
                                <option value="ALL">All Status</option>
                                <option value="PENDING">Pending</option>
                                <option value="REJECTED">Rejected</option>
                                <option value="COLLECTED">Collected</option>
                                <option value="DELIVERED">Delivered</option>
                                <option value="PROCESSED">Processed</option>
                            </Select>
                        </HStack>
                        <Text fontSize="sm" color={textColor} ml="auto">
                            Showing {filteredDonations.length} of {donations.length}
                        </Text>
                    </Flex>
                </CardBody>
            </Card>

            {/* Donations Table */}
            <Card
                bg={cardBg}
                border="1px"
                borderColor={borderColor}
                borderRadius="2xl"
                boxShadow={useColorModeValue('lg', 'dark-lg')}
                overflow="hidden"
            >
                <CardBody p={0}>
                    <Box overflowX="auto">
                        <Table variant="simple">
                            <Thead bg={tableBg}>
                                <Tr>
                                    <Th borderColor={borderColor} py={4}>Donation</Th>
                                    <Th borderColor={borderColor}>Date</Th>
                                    <Th borderColor={borderColor}>Center</Th>
                                    <Th borderColor={borderColor}>Status</Th>
                                    <Th borderColor={borderColor}></Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {filteredDonations.length > 0 ? (
                                    filteredDonations.map((donation) => (
                                        <Tr
                                            key={donation.id}
                                            _hover={{ bg: hoverBg }}
                                            cursor="pointer"
                                            transition="all 0.2s"
                                        >
                                            <Td
                                                borderColor={borderColor}
                                                py={4}
                                                onClick={() => navigate(`/donations/${donation.id}`)}
                                            >
                                                <HStack spacing={3}>
                                                    <Box
                                                        bg={useColorModeValue(`${getStatusColor(donation.status)}.100`, `${getStatusColor(donation.status)}.900`)}
                                                        p={2}
                                                        borderRadius="lg"
                                                    >
                                                        <Icon
                                                            as={FiPackage}
                                                            color={useColorModeValue(`${getStatusColor(donation.status)}.600`, `${getStatusColor(donation.status)}.300`)}
                                                        />
                                                    </Box>
                                                    <Text fontWeight="600" color={headingColor}>
                                                        {donation.name || `Donation from ${donation.donor?.name || 'Unknown'}` || 'Unnamed Donation'}
                                                    </Text>
                                                </HStack>
                                            </Td>
                                            <Td
                                                borderColor={borderColor}
                                                onClick={() => navigate(`/donations/${donation.id}`)}
                                            >
                                                <HStack color={textColor}>
                                                    <Icon as={FiCalendar} />
                                                    <Text>{formatDate(donation.donationDate)}</Text>
                                                </HStack>
                                            </Td>
                                            <Td
                                                borderColor={borderColor}
                                                onClick={() => navigate(`/donations/${donation.id}`)}
                                            >
                                                <HStack color={textColor}>
                                                    <Icon as={FiMapPin} />
                                                    <Text>{donation.collectionCenter?.name || 'Not assigned'}</Text>
                                                </HStack>
                                            </Td>
                                            <Td
                                                borderColor={borderColor}
                                                onClick={() => navigate(`/donations/${donation.id}`)}
                                            >
                                                <Badge
                                                    colorScheme={getStatusColor(donation.status)}
                                                    borderRadius="full"
                                                    px={3}
                                                    py={1}
                                                    fontSize="xs"
                                                    fontWeight="600"
                                                >
                                                    {donation.status}
                                                </Badge>
                                            </Td>
                                            <Td borderColor={borderColor}>
                                                <Menu>
                                                    <MenuButton
                                                        as={IconButton}
                                                        icon={<FiMoreVertical />}
                                                        variant="ghost"
                                                        size="sm"
                                                        borderRadius="lg"
                                                    />
                                                    <MenuList
                                                        shadow="xl"
                                                        borderRadius="xl"
                                                        border="1px"
                                                        borderColor={borderColor}
                                                    >
                                                        <MenuItem
                                                            icon={<FiEye />}
                                                            onClick={() => navigate(`/donations/${donation.id}`)}
                                                            borderRadius="md"
                                                            mx={2}
                                                        >
                                                            View Details
                                                        </MenuItem>
                                                        {donation.status === 'PENDING' && (
                                                            <>
                                                                <MenuItem
                                                                    icon={<FiEdit />}
                                                                    onClick={() => navigate(`/donations/${donation.id}/edit`)}
                                                                    borderRadius="md"
                                                                    mx={2}
                                                                >
                                                                    Edit
                                                                </MenuItem>
                                                                <MenuItem
                                                                    icon={<FiTrash2 />}
                                                                    color="red.500"
                                                                    onClick={() => handleDelete(donation.id)}
                                                                    borderRadius="md"
                                                                    mx={2}
                                                                    _hover={{ bg: 'red.50' }}
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
                                        <Td colSpan={5} borderColor={borderColor}>
                                            <Box textAlign="center" py={12}>
                                                <Box
                                                    bg={useColorModeValue('gray.100', 'gray.700')}
                                                    p={4}
                                                    borderRadius="full"
                                                    display="inline-block"
                                                    mb={4}
                                                >
                                                    <Icon as={FiPackage} boxSize={8} color={textColor} />
                                                </Box>
                                                <Heading size="md" color={headingColor} mb={2}>
                                                    No donations found
                                                </Heading>
                                                <Text color={textColor} mb={6}>
                                                    {searchTerm || statusFilter !== 'ALL'
                                                        ? 'Try adjusting your filters'
                                                        : 'Start by creating your first donation'}
                                                </Text>
                                                {!searchTerm && statusFilter === 'ALL' && (
                                                    <Button
                                                        bgGradient={gradientBg}
                                                        color="white"
                                                        leftIcon={<FiPlus />}
                                                        onClick={() => navigate('/donations/new')}
                                                        borderRadius="xl"
                                                        _hover={{
                                                            bgGradient: 'linear(to-r, brand.500, teal.500, blue.500)',
                                                            transform: 'translateY(-2px)',
                                                        }}
                                                    >
                                                        Create Donation
                                                    </Button>
                                                )}
                                            </Box>
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
