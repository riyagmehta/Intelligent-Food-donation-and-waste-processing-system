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
    StatArrow,
    Badge,
    Icon,
    useColorModeValue,
    Flex,
    Progress,
    Spinner,
    Center,
    useToast,
} from '@chakra-ui/react';
import {
    FiPackage,
    FiUsers,
    FiMapPin,
    FiAlertCircle,
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { donationAPI, donorAPI, centerAPI } from '../../services/api';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const toast = useToast();
    const cardBg = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.700');

    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalDonations: 0,
        totalDonors: 0,
        totalCenters: 0,
        pendingDonations: 0,
        thisMonthGrowth: 0,
    });
    const [recentDonations, setRecentDonations] = useState([]);
    const [centers, setCenters] = useState([]);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);

            // Fetch all data in parallel
            const [donationsRes, donorsRes, centersRes] = await Promise.all([
                donationAPI.getAll(),
                donorAPI.getAll(),
                centerAPI.getAll(),
            ]);

            const donations = donationsRes.data;
            const donors = donorsRes.data;
            const centersData = centersRes.data;

            // Calculate this month's donations
            const now = new Date();
            const thisMonthDonations = donations.filter(d => {
                const donationDate = new Date(d.donationDate);
                return donationDate.getMonth() === now.getMonth() &&
                    donationDate.getFullYear() === now.getFullYear();
            }).length;

            // Calculate last month's donations for growth
            const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
            const lastMonthDonations = donations.filter(d => {
                const donationDate = new Date(d.donationDate);
                return donationDate.getMonth() === lastMonth.getMonth() &&
                    donationDate.getFullYear() === lastMonth.getFullYear();
            }).length;

            const growth = lastMonthDonations > 0
                ? ((thisMonthDonations - lastMonthDonations) / lastMonthDonations * 100).toFixed(1)
                : thisMonthDonations > 0 ? 100 : 0;

            setStats({
                totalDonations: donations.length,
                totalDonors: donors.length,
                totalCenters: centersData.length,
                pendingDonations: donations.filter(d => d.status === 'PENDING').length,
                thisMonthGrowth: parseFloat(growth),
            });

            // Get recent donations (last 5)
            const sortedDonations = [...donations].sort((a, b) =>
                new Date(b.donationDate) - new Date(a.donationDate)
            );
            setRecentDonations(sortedDonations.slice(0, 5));

            // Set centers with capacity info
            setCenters(centersData);

        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            toast({
                title: 'Error',
                description: 'Failed to load dashboard data',
                status: 'error',
                duration: 3000,
            });
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            PENDING: 'yellow',
            COLLECTED: 'blue',
            DELIVERED: 'green',
            REJECTED: 'red',
            PROCESSED: 'purple',
        };
        return colors[status] || 'gray';
    };

    const getCapacityColor = (percentage) => {
        if (percentage >= 90) return 'red';
        if (percentage >= 70) return 'yellow';
        return 'green';
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString();
    };

    const StatCard = ({ icon, label, value, helpText, trend, color }) => (
        <Card bg={cardBg} border="1px" borderColor={borderColor} boxShadow="sm">
            <CardBody>
                <Flex justify="space-between" align="start">
                    <Stat>
                        <StatLabel color="gray.600" fontSize="sm">
                            {label}
                        </StatLabel>
                        <StatNumber fontSize="3xl" fontWeight="bold" color={`${color}.500`}>
                            {value}
                        </StatNumber>
                        {helpText && (
                            <StatHelpText fontSize="sm">
                                {trend !== undefined && trend !== 0 && (
                                    <StatArrow type={trend > 0 ? 'increase' : 'decrease'} />
                                )}
                                {helpText}
                            </StatHelpText>
                        )}
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
            <Box>
                <Heading size="lg" mb={1}>
                    System Overview
                </Heading>
                <Text color="gray.600">Monitor and manage the entire donation system</Text>
            </Box>

            {/* Stats Cards */}
            <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }} gap={6}>
                <StatCard
                    icon={FiPackage}
                    label="Total Donations"
                    value={stats.totalDonations}
                    helpText={`${stats.thisMonthGrowth >= 0 ? '+' : ''}${stats.thisMonthGrowth}% this month`}
                    trend={stats.thisMonthGrowth}
                    color="teal"
                />
                <StatCard
                    icon={FiUsers}
                    label="Active Donors"
                    value={stats.totalDonors}
                    helpText="Registered users"
                    color="blue"
                />
                <StatCard
                    icon={FiMapPin}
                    label="Collection Centers"
                    value={stats.totalCenters}
                    helpText="Across all locations"
                    color="purple"
                />
                <StatCard
                    icon={FiAlertCircle}
                    label="Pending Donations"
                    value={stats.pendingDonations}
                    helpText="Needs attention"
                    color="yellow"
                />
            </Grid>

            {/* Main Content Grid */}
            <Grid templateColumns={{ base: '1fr', lg: 'repeat(2, 1fr)' }} gap={6}>
                {/* Recent Donations */}
                <Card bg={cardBg} border="1px" borderColor={borderColor} boxShadow="sm">
                    <CardBody>
                        <Flex justify="space-between" align="center" mb={4}>
                            <Heading size="md">Recent Donations</Heading>
                            <Button
                                variant="link"
                                colorScheme="teal"
                                onClick={() => navigate('/donations/all')}
                            >
                                View All
                            </Button>
                        </Flex>

                        {recentDonations.length > 0 ? (
                            <VStack spacing={3} align="stretch">
                                {recentDonations.map((donation) => (
                                    <Box
                                        key={donation.id}
                                        p={3}
                                        borderRadius="md"
                                        border="1px"
                                        borderColor={borderColor}
                                        _hover={{ bg: 'gray.50', cursor: 'pointer' }}
                                        onClick={() => navigate(`/donations/${donation.id}`)}
                                    >
                                        <Flex justify="space-between" align="start" mb={2}>
                                            <Box>
                                                <Text fontWeight="semibold">{donation.name || 'Unnamed Donation'}</Text>
                                                <Text fontSize="sm" color="gray.600">
                                                    by {donation.donor?.name || 'Unknown Donor'}
                                                </Text>
                                            </Box>
                                            <Badge colorScheme={getStatusColor(donation.status)} fontSize="xs">
                                                {donation.status}
                                            </Badge>
                                        </Flex>
                                        <HStack spacing={4} fontSize="sm" color="gray.600">
                                            <Text>{formatDate(donation.donationDate)}</Text>
                                            <Text>{donation.collectionCenter?.name || 'No center assigned'}</Text>
                                        </HStack>
                                    </Box>
                                ))}
                            </VStack>
                        ) : (
                            <Box textAlign="center" py={8}>
                                <Text color="gray.500">No donations yet</Text>
                            </Box>
                        )}
                    </CardBody>
                </Card>

                {/* Center Capacity */}
                <Card bg={cardBg} border="1px" borderColor={borderColor} boxShadow="sm">
                    <CardBody>
                        <Flex justify="space-between" align="center" mb={4}>
                            <Heading size="md">Center Capacity</Heading>
                            <Button
                                variant="link"
                                colorScheme="teal"
                                onClick={() => navigate('/centers')}
                            >
                                Manage Centers
                            </Button>
                        </Flex>

                        {centers.length > 0 ? (
                            <VStack spacing={4} align="stretch">
                                {centers.slice(0, 4).map((center) => {
                                    const percentage = center.maxCapacity
                                        ? Math.round((center.currentLoad || 0) / center.maxCapacity * 100)
                                        : 0;
                                    return (
                                        <Box key={center.id}>
                                            <Flex justify="space-between" mb={2}>
                                                <Text fontWeight="medium" fontSize="sm">
                                                    {center.name}
                                                </Text>
                                                <HStack spacing={2}>
                                                    <Text fontSize="sm" color="gray.600">
                                                        {center.currentLoad || 0}/{center.maxCapacity || 0}
                                                    </Text>
                                                    <Badge
                                                        colorScheme={getCapacityColor(percentage)}
                                                        fontSize="xs"
                                                    >
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
                                    );
                                })}
                            </VStack>
                        ) : (
                            <Box textAlign="center" py={8}>
                                <Text color="gray.500">No centers registered</Text>
                                <Button
                                    mt={4}
                                    colorScheme="teal"
                                    size="sm"
                                    onClick={() => navigate('/centers')}
                                >
                                    Add Center
                                </Button>
                            </Box>
                        )}
                    </CardBody>
                </Card>
            </Grid>

            {/* Quick Actions */}
            <Card bg={cardBg} border="1px" borderColor={borderColor} boxShadow="sm">
                <CardBody>
                    <Heading size="md" mb={4}>
                        Quick Actions
                    </Heading>
                    <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={4}>
                        <Button
                            leftIcon={<FiPackage />}
                            colorScheme="teal"
                            variant="outline"
                            size="lg"
                            onClick={() => navigate('/donations/all')}
                        >
                            Manage Donations
                        </Button>
                        <Button
                            leftIcon={<FiUsers />}
                            colorScheme="blue"
                            variant="outline"
                            size="lg"
                            onClick={() => navigate('/donors')}
                        >
                            Manage Donors
                        </Button>
                        <Button
                            leftIcon={<FiMapPin />}
                            colorScheme="purple"
                            variant="outline"
                            size="lg"
                            onClick={() => navigate('/centers')}
                        >
                            Manage Centers
                        </Button>
                    </Grid>
                </CardBody>
            </Card>
        </VStack>
    );
};

export default AdminDashboard;
