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
    Avatar,
    Progress,
    Tooltip,
} from '@chakra-ui/react';
import { FiPackage, FiClock, FiCheckCircle, FiTrendingUp, FiPlus, FiArrowRight, FiMapPin, FiCalendar, FiGift } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { donationAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const DonorDashboard = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

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
            const response = await donationAPI.getMyDonations();
            const allDonations = response.data;

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
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const StatCard = ({ icon, label, value, helpText, color, gradient }) => (
        <Card
            bg={gradient ? 'transparent' : cardBg}
            bgGradient={gradient ? gradientBg : undefined}
            border="1px"
            borderColor={gradient ? 'transparent' : borderColor}
            borderRadius="2xl"
            boxShadow={useColorModeValue('lg', 'dark-lg')}
            overflow="hidden"
            position="relative"
            _hover={{ transform: 'translateY(-4px)', boxShadow: '2xl' }}
            transition="all 0.3s ease"
        >
            {gradient && (
                <>
                    <Box
                        position="absolute"
                        top="-20%"
                        right="-10%"
                        w="120px"
                        h="120px"
                        borderRadius="full"
                        bg="whiteAlpha.200"
                    />
                    <Box
                        position="absolute"
                        bottom="-30%"
                        left="-10%"
                        w="100px"
                        h="100px"
                        borderRadius="full"
                        bg="whiteAlpha.100"
                    />
                </>
            )}
            <CardBody p={6} position="relative">
                <Flex justify="space-between" align="start">
                    <Box>
                        <Text
                            fontSize="sm"
                            fontWeight="600"
                            color={gradient ? 'whiteAlpha.800' : textColor}
                            textTransform="uppercase"
                            letterSpacing="wide"
                        >
                            {label}
                        </Text>
                        <Text
                            fontSize="4xl"
                            fontWeight="800"
                            color={gradient ? 'white' : `${color}.500`}
                            lineHeight="1.2"
                            mt={1}
                        >
                            {value}
                        </Text>
                        <Text
                            fontSize="sm"
                            color={gradient ? 'whiteAlpha.800' : textColor}
                            mt={1}
                        >
                            {helpText}
                        </Text>
                    </Box>
                    <Box
                        bg={gradient ? 'whiteAlpha.200' : useColorModeValue(`${color}.100`, `${color}.900`)}
                        p={3}
                        borderRadius="xl"
                        backdropFilter={gradient ? 'blur(10px)' : undefined}
                    >
                        <Icon
                            as={icon}
                            boxSize={6}
                            color={gradient ? 'white' : useColorModeValue(`${color}.600`, `${color}.300`)}
                        />
                    </Box>
                </Flex>
            </CardBody>
        </Card>
    );

    if (loading) {
        return (
            <Center h="400px">
                <VStack spacing={4}>
                    <Spinner size="xl" color="brand.500" thickness="4px" />
                    <Text color={textColor}>Loading your dashboard...</Text>
                </VStack>
            </Center>
        );
    }

    return (
        <VStack spacing={8} align="stretch">
            {/* Welcome Header */}
            <Card
                bg={cardBg}
                borderRadius="2xl"
                border="1px"
                borderColor={borderColor}
                boxShadow={useColorModeValue('lg', 'dark-lg')}
                overflow="hidden"
            >
                <CardBody p={0}>
                    <Flex direction={{ base: 'column', md: 'row' }} align="center">
                        {/* Left - Gradient Background */}
                        <Box
                            bgGradient={gradientBg}
                            p={8}
                            w={{ base: '100%', md: '200px' }}
                            minH={{ base: 'auto', md: '160px' }}
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
                            <Avatar
                                size="xl"
                                name={user?.username}
                                bg="whiteAlpha.300"
                                color="white"
                                fontWeight="bold"
                                fontSize="2xl"
                            />
                        </Box>

                        {/* Right - Info */}
                        <Flex
                            flex={1}
                            p={8}
                            justify="space-between"
                            align="center"
                            flexWrap="wrap"
                            gap={4}
                        >
                            <Box>
                                <Text fontSize="sm" color={textColor} fontWeight="500">
                                    Welcome back
                                </Text>
                                <Heading size="xl" color={headingColor} fontWeight="800">
                                    {user?.username}!
                                </Heading>
                                <Text color={textColor} mt={2}>
                                    Here's what's happening with your donations
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

            {/* Stats Cards */}
            <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }} gap={6}>
                <StatCard
                    icon={FiPackage}
                    label="Total Donations"
                    value={stats.totalDonations}
                    helpText="All time"
                    color="brand"
                    gradient={true}
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

            {/* Impact Summary */}
            {stats.totalDonations > 0 && (
                <Card
                    bg={cardBg}
                    border="1px"
                    borderColor={borderColor}
                    borderRadius="2xl"
                    boxShadow={useColorModeValue('lg', 'dark-lg')}
                >
                    <CardBody p={6}>
                        <HStack justify="space-between" mb={4}>
                            <Heading size="md" color={headingColor}>Your Impact</Heading>
                            <Badge colorScheme="green" borderRadius="full" px={3} py={1}>
                                Active Donor
                            </Badge>
                        </HStack>
                        <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={6}>
                            <Box>
                                <Text fontSize="sm" color={textColor} mb={1}>Completion Rate</Text>
                                <Progress
                                    value={stats.totalDonations > 0 ? (stats.completed / stats.totalDonations) * 100 : 0}
                                    colorScheme="green"
                                    borderRadius="full"
                                    size="lg"
                                    bg={useColorModeValue('gray.100', 'gray.700')}
                                />
                                <Text fontSize="sm" color={textColor} mt={1}>
                                    {stats.totalDonations > 0 ? Math.round((stats.completed / stats.totalDonations) * 100) : 0}% delivered
                                </Text>
                            </Box>
                            <Box textAlign="center">
                                <Icon as={FiGift} boxSize={8} color="brand.500" mb={2} />
                                <Text fontSize="2xl" fontWeight="bold" color={headingColor}>{stats.completed}</Text>
                                <Text fontSize="sm" color={textColor}>Lives Impacted</Text>
                            </Box>
                            <Box textAlign="center">
                                <Icon as={FiCalendar} boxSize={8} color="blue.500" mb={2} />
                                <Text fontSize="2xl" fontWeight="bold" color={headingColor}>{stats.thisMonth}</Text>
                                <Text fontSize="sm" color={textColor}>This Month</Text>
                            </Box>
                        </Grid>
                    </CardBody>
                </Card>
            )}

            {/* Recent Donations Table */}
            <Card
                bg={cardBg}
                border="1px"
                borderColor={borderColor}
                borderRadius="2xl"
                boxShadow={useColorModeValue('lg', 'dark-lg')}
                overflow="hidden"
            >
                <CardBody p={0}>
                    <Flex justify="space-between" align="center" p={6} pb={4}>
                        <Heading size="md" color={headingColor}>Recent Donations</Heading>
                        <Button
                            variant="ghost"
                            colorScheme="brand"
                            rightIcon={<FiArrowRight />}
                            onClick={() => navigate('/donations')}
                            borderRadius="xl"
                        >
                            View All
                        </Button>
                    </Flex>

                    {donations.length > 0 ? (
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
                                    {donations.map((donation) => (
                                        <Tr
                                            key={donation.id}
                                            _hover={{ bg: hoverBg }}
                                            cursor="pointer"
                                            onClick={() => navigate(`/donations/${donation.id}`)}
                                            transition="all 0.2s"
                                        >
                                            <Td borderColor={borderColor} py={4}>
                                                <HStack>
                                                    <Box
                                                        bg={useColorModeValue('brand.100', 'brand.900')}
                                                        p={2}
                                                        borderRadius="lg"
                                                    >
                                                        <Icon as={FiPackage} color={useColorModeValue('brand.600', 'brand.300')} />
                                                    </Box>
                                                    <Text fontWeight="600" color={headingColor}>
                                                        {donation.name || 'Unnamed Donation'}
                                                    </Text>
                                                </HStack>
                                            </Td>
                                            <Td borderColor={borderColor}>
                                                <HStack color={textColor}>
                                                    <Icon as={FiCalendar} />
                                                    <Text>{formatDate(donation.donationDate)}</Text>
                                                </HStack>
                                            </Td>
                                            <Td borderColor={borderColor}>
                                                <HStack color={textColor}>
                                                    <Icon as={FiMapPin} />
                                                    <Text>{donation.collectionCenter?.name || 'Not assigned'}</Text>
                                                </HStack>
                                            </Td>
                                            <Td borderColor={borderColor}>
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
                                                <Tooltip label="View Details" hasArrow>
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        colorScheme="brand"
                                                        borderRadius="lg"
                                                    >
                                                        <Icon as={FiArrowRight} />
                                                    </Button>
                                                </Tooltip>
                                            </Td>
                                        </Tr>
                                    ))}
                                </Tbody>
                            </Table>
                        </Box>
                    ) : (
                        <Box textAlign="center" py={12} px={6}>
                            <Box
                                bg={useColorModeValue('gray.100', 'gray.700')}
                                p={6}
                                borderRadius="full"
                                display="inline-block"
                                mb={4}
                            >
                                <Icon as={FiPackage} boxSize={10} color={textColor} />
                            </Box>
                            <Heading size="md" color={headingColor} mb={2}>No donations yet</Heading>
                            <Text color={textColor} mb={6}>
                                Start making a difference today by creating your first donation
                            </Text>
                            <Button
                                bgGradient={gradientBg}
                                color="white"
                                size="lg"
                                borderRadius="xl"
                                leftIcon={<FiPlus />}
                                _hover={{
                                    bgGradient: 'linear(to-r, brand.500, teal.500, blue.500)',
                                    transform: 'translateY(-2px)',
                                }}
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
                    borderRadius="2xl"
                    boxShadow={useColorModeValue('lg', 'dark-lg')}
                    _hover={{
                        transform: 'translateY(-4px)',
                        boxShadow: '2xl',
                        borderColor: 'brand.300',
                    }}
                    cursor="pointer"
                    onClick={() => navigate('/donations/new')}
                    transition="all 0.3s ease"
                    overflow="hidden"
                    position="relative"
                >
                    <Box
                        position="absolute"
                        top={0}
                        left={0}
                        right={0}
                        h="4px"
                        bgGradient={gradientBg}
                    />
                    <CardBody p={6}>
                        <HStack spacing={4}>
                            <Box
                                bgGradient={gradientBg}
                                p={4}
                                borderRadius="xl"
                            >
                                <Icon as={FiPlus} boxSize={6} color="white" />
                            </Box>
                            <Box flex={1}>
                                <Heading size="sm" color={headingColor} mb={1}>
                                    Create New Donation
                                </Heading>
                                <Text fontSize="sm" color={textColor}>
                                    Start a new food donation request
                                </Text>
                            </Box>
                            <Icon as={FiArrowRight} color={textColor} />
                        </HStack>
                    </CardBody>
                </Card>

                <Card
                    bg={cardBg}
                    border="1px"
                    borderColor={borderColor}
                    borderRadius="2xl"
                    boxShadow={useColorModeValue('lg', 'dark-lg')}
                    _hover={{
                        transform: 'translateY(-4px)',
                        boxShadow: '2xl',
                        borderColor: 'blue.300',
                    }}
                    cursor="pointer"
                    onClick={() => navigate('/centers')}
                    transition="all 0.3s ease"
                    overflow="hidden"
                    position="relative"
                >
                    <Box
                        position="absolute"
                        top={0}
                        left={0}
                        right={0}
                        h="4px"
                        bgGradient="linear(to-r, blue.400, purple.400)"
                    />
                    <CardBody p={6}>
                        <HStack spacing={4}>
                            <Box
                                bgGradient="linear(to-br, blue.400, purple.400)"
                                p={4}
                                borderRadius="xl"
                            >
                                <Icon as={FiMapPin} boxSize={6} color="white" />
                            </Box>
                            <Box flex={1}>
                                <Heading size="sm" color={headingColor} mb={1}>
                                    View Collection Centers
                                </Heading>
                                <Text fontSize="sm" color={textColor}>
                                    Find nearby donation centers
                                </Text>
                            </Box>
                            <Icon as={FiArrowRight} color={textColor} />
                        </HStack>
                    </CardBody>
                </Card>
            </Grid>
        </VStack>
    );
};

export default DonorDashboard;
