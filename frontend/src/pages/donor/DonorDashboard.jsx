import { useEffect, useState } from 'react';
import {
    Box,
    Button,
    Heading,
    Text,
    VStack,
    HStack,
    Grid,
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
    Spinner,
    Center,
} from '@chakra-ui/react';
import { FiPackage, FiClock, FiCheckCircle, FiTrendingUp, FiPlus } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { donationAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const DonorDashboard = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const cardBg = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.700');

    const [donations, setDonations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalDonations: 0,
        pending: 0,
        completed: 0,
        thisMonth: 0,
    });

    useEffect(() => {
        fetchDonations();
    }, []);

    const fetchDonations = async () => {
        try {
            setLoading(true);
            // Use getMyDonations to only fetch current user's donations
            const response = await donationAPI.getMyDonations();
            const allDonations = response.data;

            // Calculate stats
            const now = new Date();
            const thisMonth = allDonations.filter(d => {
                const donationDate = new Date(d.donationDate);
                return donationDate.getMonth() === now.getMonth() &&
                    donationDate.getFullYear() === now.getFullYear();
            }).length;

            setStats({
                totalDonations: allDonations.length,
                pending: allDonations.filter(d => d.status === 'PENDING').length,
                completed: allDonations.filter(d => d.status === 'DELIVERED').length,
                thisMonth: thisMonth,
            });

            // Get recent 4 donations
            setDonations(allDonations.slice(0, 4));
        } catch (error) {
            console.error('Error fetching donations:', error);
        } finally {
            setLoading(false);
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
        return new Date(dateString).toLocaleDateString();
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
                        Welcome back, {user?.username}! 👋
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
                    helpText={new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
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

                    {donations.length > 0 ? (
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
                                    {donations.map((donation) => (
                                        <Tr key={donation.id}>
                                            <Td fontWeight="medium">{donation.name || 'Unnamed Donation'}</Td>
                                            <Td color="gray.600">{formatDate(donation.donationDate)}</Td>
                                            <Td color="gray.600">{donation.collectionCenter?.name || 'Not assigned'}</Td>
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
                    ) : (
                        <Box textAlign="center" py={8}>
                            <Text color="gray.500" mb={4}>No donations yet</Text>
                            <Button
                                colorScheme="teal"
                                onClick={() => navigate('/donations/new')}
                            >
                                Create Your First Donation
                            </Button>
                        </Box>
                    )}
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