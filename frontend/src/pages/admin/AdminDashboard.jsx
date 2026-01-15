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
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Icon,
    useColorModeValue,
    Flex,
    Progress,
} from '@chakra-ui/react';
import {
    FiPackage,
    FiUsers,
    FiMapPin,
    FiTrendingUp,
    FiAlertCircle,
    FiCheckCircle,
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const cardBg = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.700');

    // Mock data - will be replaced with API calls
    const stats = {
        totalDonations: 156,
        totalDonors: 42,
        totalCenters: 8,
        pendingDonations: 23,
        thisMonthGrowth: 12.5,
    };

    const recentDonations = [
        {
            id: 1,
            donor: 'John Doe',
            name: 'Fresh Vegetables',
            date: '2024-01-13',
            status: 'PENDING',
            items: 3,
        },
        {
            id: 2,
            donor: 'Jane Smith',
            name: 'Canned Foods',
            date: '2024-01-13',
            status: 'COLLECTED',
            items: 5,
        },
        {
            id: 3,
            donor: 'Bob Wilson',
            name: 'Dairy Products',
            date: '2024-01-12',
            status: 'PENDING',
            items: 4,
        },
        {
            id: 4,
            donor: 'Alice Brown',
            name: 'Bread & Pastries',
            date: '2024-01-12',
            status: 'DELIVERED',
            items: 2,
        },
    ];

    const centerCapacity = [
        { name: 'Downtown Center', current: 450, max: 500, percentage: 90 },
        { name: 'North Center', current: 300, max: 500, percentage: 60 },
        { name: 'South Center', current: 420, max: 500, percentage: 84 },
        { name: 'East Center', current: 150, max: 300, percentage: 50 },
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

    const getCapacityColor = (percentage) => {
        if (percentage >= 90) return 'red';
        if (percentage >= 70) return 'yellow';
        return 'green';
    };

    const StatCard = ({ icon, label, value, helpText, trend, color }) => (
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
                        {helpText && (
                            <StatHelpText fontSize="sm">
                                {trend && <StatArrow type={trend > 0 ? 'increase' : 'decrease'} />}
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
                    helpText={`+${stats.thisMonthGrowth}% this month`}
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
                                            <Text fontWeight="semibold">{donation.name}</Text>
                                            <Text fontSize="sm" color="gray.600">
                                                by {donation.donor}
                                            </Text>
                                        </Box>
                                        <Badge colorScheme={getStatusColor(donation.status)} fontSize="xs">
                                            {donation.status}
                                        </Badge>
                                    </Flex>
                                    <HStack spacing={4} fontSize="sm" color="gray.600">
                                        <Text>{donation.date}</Text>
                                        <Text>{donation.items} items</Text>
                                    </HStack>
                                </Box>
                            ))}
                        </VStack>
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

                        <VStack spacing={4} align="stretch">
                            {centerCapacity.map((center, index) => (
                                <Box key={index}>
                                    <Flex justify="space-between" mb={2}>
                                        <Text fontWeight="medium" fontSize="sm">
                                            {center.name}
                                        </Text>
                                        <HStack spacing={2}>
                                            <Text fontSize="sm" color="gray.600">
                                                {center.current}/{center.max}
                                            </Text>
                                            <Badge
                                                colorScheme={getCapacityColor(center.percentage)}
                                                fontSize="xs"
                                            >
                                                {center.percentage}%
                                            </Badge>
                                        </HStack>
                                    </Flex>
                                    <Progress
                                        value={center.percentage}
                                        colorScheme={getCapacityColor(center.percentage)}
                                        size="sm"
                                        borderRadius="full"
                                    />
                                </Box>
                            ))}
                        </VStack>
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