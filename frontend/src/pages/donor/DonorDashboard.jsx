import {
    Box,
    Button,
    Heading,
    Text,
    VStack,
    HStack,
    Grid,
    GridItem,
    Card,
    CardBody,
    Stat,
    StatLabel,
    StatNumber,
    StatHelpText,
    Badge,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Icon,
    useColorModeValue,
    Flex,
} from '@chakra-ui/react';
import { FiPackage, FiClock, FiCheckCircle, FiTrendingUp, FiPlus } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const DonorDashboard = () => {
    const navigate = useNavigate();
    const cardBg = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.700');

    // Mock data - will be replaced with API calls
    const stats = {
        totalDonations: 24,
        pending: 5,
        completed: 19,
        thisMonth: 8,
    };

    const recentDonations = [
        {
            id: 1,
            name: 'Fresh Vegetables',
            date: '2024-01-10',
            status: 'PENDING',
            center: 'Downtown Center',
        },
        {
            id: 2,
            name: 'Canned Foods',
            date: '2024-01-08',
            status: 'COLLECTED',
            center: 'North Center',
        },
        {
            id: 3,
            name: 'Bread & Pastries',
            date: '2024-01-05',
            status: 'DELIVERED',
            center: 'South Center',
        },
        {
            id: 4,
            name: 'Dairy Products',
            date: '2024-01-03',
            status: 'DELIVERED',
            center: 'Downtown Center',
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

    const StatCard = ({ icon, label, value, helpText, color }) => (
        <Card bg={cardBg} border="1px" borderColor={borderColor} boxShadow="sm">
            <CardBody>
                <Flex justify="space-between" align="start">
                    <Stat>
                        <StatLabel color="gray.600" fontSize="sm">
                            {label}
                        </StatLabel>
                        <StatNumber fontSize="3xl" fontWeight="bold" color={color}>
                            {value}
                        </StatNumber>
                        <StatHelpText fontSize="sm">{helpText}</StatHelpText>
                    </Stat>
                    <Box bg={`${color}.100`} p={3} borderRadius="lg">
                        <Icon as={icon} boxSize={6} color={`${color}.600`} />
                    </Box>
                </Flex>
            </CardBody>
        </Card>
    );

    return (
        <VStack spacing={6} align="stretch">
            {/* Header */}
            <Flex justify="space-between" align="center" flexWrap="wrap" gap={4}>
                <Box>
                    <Heading size="lg" mb={1}>
                        Welcome back! 👋
                    </Heading>
                    <Text color="gray.600">Here's what's happening with your donations</Text>
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

            {/* Stats Cards */}
            <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }} gap={6}>
                <StatCard
                    icon={FiPackage}
                    label="Total Donations"
                    value={stats.totalDonations}
                    helpText="All time"
                    color="teal"
                />
                <StatCard
                    icon={FiClock}
                    label="Pending"
                    value={stats.pending}
                    helpText="Awaiting collection"
                    color="yellow"
                />
                <StatCard
                    icon={FiCheckCircle}
                    label="Completed"
                    value={stats.completed}
                    helpText="Successfully delivered"
                    color="green"
                />
                <StatCard
                    icon={FiTrendingUp}
                    label="This Month"
                    value={stats.thisMonth}
                    helpText="January 2024"
                    color="blue"
                />
            </Grid>

            {/* Recent Donations Table */}
            <Card bg={cardBg} border="1px" borderColor={borderColor} boxShadow="sm">
                <CardBody>
                    <Flex justify="space-between" align="center" mb={4}>
                        <Heading size="md">Recent Donations</Heading>
                        <Button
                            variant="link"
                            colorScheme="teal"
                            onClick={() => navigate('/donations')}
                        >
                            View All
                        </Button>
                    </Flex>

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
                                {recentDonations.map((donation) => (
                                    <Tr key={donation.id}>
                                        <Td fontWeight="medium">{donation.name}</Td>
                                        <Td color="gray.600">{donation.date}</Td>
                                        <Td color="gray.600">{donation.center}</Td>
                                        <Td>
                                            <Badge colorScheme={getStatusColor(donation.status)} fontSize="xs">
                                                {donation.status}
                                            </Badge>
                                        </Td>
                                        <Td>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                colorScheme="teal"
                                                onClick={() => navigate(`/donations/${donation.id}`)}
                                            >
                                                View Details
                                            </Button>
                                        </Td>
                                    </Tr>
                                ))}
                            </Tbody>
                        </Table>
                    </Box>
                </CardBody>
            </Card>

            {/* Quick Actions */}
            <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={6}>
                <Card
                    bg={cardBg}
                    border="1px"
                    borderColor={borderColor}
                    boxShadow="sm"
                    _hover={{ boxShadow: 'md', cursor: 'pointer' }}
                    onClick={() => navigate('/donations/new')}
                >
                    <CardBody>
                        <HStack spacing={4}>
                            <Box bg="teal.100" p={3} borderRadius="lg">
                                <Icon as={FiPlus} boxSize={6} color="teal.600" />
                            </Box>
                            <Box>
                                <Heading size="sm" mb={1}>
                                    Create New Donation
                                </Heading>
                                <Text fontSize="sm" color="gray.600">
                                    Start a new food donation request
                                </Text>
                            </Box>
                        </HStack>
                    </CardBody>
                </Card>

                <Card
                    bg={cardBg}
                    border="1px"
                    borderColor={borderColor}
                    boxShadow="sm"
                    _hover={{ boxShadow: 'md', cursor: 'pointer' }}
                    onClick={() => navigate('/centers')}
                >
                    <CardBody>
                        <HStack spacing={4}>
                            <Box bg="blue.100" p={3} borderRadius="lg">
                                <Icon as={FiPackage} boxSize={6} color="blue.600" />
                            </Box>
                            <Box>
                                <Heading size="sm" mb={1}>
                                    View Collection Centers
                                </Heading>
                                <Text fontSize="sm" color="gray.600">
                                    Find nearby donation centers
                                </Text>
                            </Box>
                        </HStack>
                    </CardBody>
                </Card>
            </Grid>
        </VStack>
    );
};

export default DonorDashboard;