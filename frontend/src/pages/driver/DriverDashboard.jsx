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
    Icon,
    useColorModeValue,
    Flex,
    Spinner,
    Center,
    useToast,
    Switch,
    FormControl,
    FormLabel,
    Avatar,
    Tooltip,
    Divider,
} from '@chakra-ui/react';
import {
    FiTruck,
    FiPackage,
    FiCheckCircle,
    FiClock,
    FiMapPin,
    FiPhone,
    FiArrowRight,
    FiNavigation,
    FiUser,
    FiZap,
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { driverAPI, deliveryAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const DriverDashboard = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const toast = useToast();

    // Color mode values
    const cardBg = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.100', 'gray.700');
    const textColor = useColorModeValue('gray.600', 'gray.400');
    const headingColor = useColorModeValue('gray.800', 'white');
    const hoverBg = useColorModeValue('gray.50', 'gray.700');
    const gradientBg = useColorModeValue(
        'linear(to-br, orange.400, red.500, pink.500)',
        'linear(to-br, orange.500, red.600, pink.600)'
    );

    const [driverProfile, setDriverProfile] = useState(null);
    const [deliveries, setDeliveries] = useState([]);
    const [pendingDeliveries, setPendingDeliveries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [availabilityLoading, setAvailabilityLoading] = useState(false);
    const [stats, setStats] = useState({
        pending: 0,
        inTransit: 0,
        completed: 0,
        total: 0,
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);

            try {
                const profileResponse = await driverAPI.getMyProfile();
                setDriverProfile(profileResponse.data);
            } catch (error) {
                console.log('Error fetching driver profile:', error);
            }

            try {
                const deliveriesResponse = await deliveryAPI.getMyDeliveries();
                const allDeliveries = deliveriesResponse.data;
                setDeliveries(allDeliveries);

                setStats({
                    pending: allDeliveries.filter(d => d.status === 'ASSIGNED' || d.status === 'PICKED_UP').length,
                    inTransit: allDeliveries.filter(d => d.status === 'IN_TRANSIT').length,
                    completed: allDeliveries.filter(d => d.status === 'DELIVERED').length,
                    total: allDeliveries.length,
                });
            } catch (error) {
                console.log('Error fetching deliveries:', error);
            }

            try {
                const pendingResponse = await deliveryAPI.getMyPending();
                setPendingDeliveries(pendingResponse.data);
            } catch (error) {
                console.log('Error fetching pending deliveries:', error);
            }

        } catch (error) {
            console.error('Error fetching data:', error);
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

    const handleAvailabilityToggle = async () => {
        if (!driverProfile) return;

        setAvailabilityLoading(true);
        try {
            const newAvailability = !driverProfile.isAvailable;
            await driverAPI.updateMyAvailability(newAvailability);
            setDriverProfile({ ...driverProfile, isAvailable: newAvailability });
            toast({
                title: newAvailability ? 'You are now available' : 'You are now unavailable',
                description: newAvailability
                    ? 'You will receive new delivery assignments'
                    : 'You won\'t receive new assignments',
                status: 'success',
                duration: 2000,
            });
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to update availability',
                status: 'error',
                duration: 3000,
            });
        } finally {
            setAvailabilityLoading(false);
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            ASSIGNED: 'yellow',
            PICKED_UP: 'blue',
            IN_TRANSIT: 'purple',
            DELIVERED: 'green',
            CANCELLED: 'red',
        };
        return colors[status] || 'gray';
    };

    const getStatusIcon = (status) => {
        const icons = {
            ASSIGNED: FiClock,
            PICKED_UP: FiPackage,
            IN_TRANSIT: FiTruck,
            DELIVERED: FiCheckCircle,
        };
        return icons[status] || FiPackage;
    };

    const StatCard = ({ icon, label, value, helpText, color, highlight }) => (
        <Card
            bg={highlight ? 'transparent' : cardBg}
            bgGradient={highlight ? gradientBg : undefined}
            border="1px"
            borderColor={highlight ? 'transparent' : borderColor}
            borderRadius="2xl"
            boxShadow={useColorModeValue('lg', 'dark-lg')}
            overflow="hidden"
            position="relative"
            _hover={{ transform: 'translateY(-4px)', boxShadow: '2xl' }}
            transition="all 0.3s ease"
        >
            {highlight && (
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
                            color={highlight ? 'whiteAlpha.800' : textColor}
                            textTransform="uppercase"
                            letterSpacing="wide"
                        >
                            {label}
                        </Text>
                        <Text
                            fontSize="4xl"
                            fontWeight="800"
                            color={highlight ? 'white' : useColorModeValue(`${color}.500`, `${color}.300`)}
                            lineHeight="1.2"
                            mt={1}
                        >
                            {value}
                        </Text>
                        <Text
                            fontSize="sm"
                            color={highlight ? 'whiteAlpha.800' : textColor}
                            mt={1}
                        >
                            {helpText}
                        </Text>
                    </Box>
                    <Box
                        bg={highlight ? 'whiteAlpha.200' : useColorModeValue(`${color}.100`, `${color}.900`)}
                        p={3}
                        borderRadius="xl"
                        backdropFilter={highlight ? 'blur(10px)' : undefined}
                    >
                        <Icon
                            as={icon}
                            boxSize={6}
                            color={highlight ? 'white' : useColorModeValue(`${color}.600`, `${color}.300`)}
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
                    <Spinner size="xl" color="orange.500" thickness="4px" />
                    <Text color={textColor}>Loading driver dashboard...</Text>
                </VStack>
            </Center>
        );
    }

    return (
        <VStack spacing={8} align="stretch">
            {/* Header Card */}
            <Card
                bg={cardBg}
                borderRadius="2xl"
                border="1px"
                borderColor={borderColor}
                boxShadow={useColorModeValue('lg', 'dark-lg')}
                overflow="hidden"
            >
                <CardBody p={0}>
                    <Flex direction={{ base: 'column', lg: 'row' }}>
                        {/* Left - Gradient Panel with Avatar */}
                        <Box
                            bgGradient={gradientBg}
                            p={8}
                            w={{ base: '100%', lg: '280px' }}
                            minH="220px"
                            display="flex"
                            flexDirection="column"
                            alignItems="center"
                            justifyContent="center"
                            position="relative"
                            overflow="hidden"
                        >
                            <Box
                                position="absolute"
                                top="-30%"
                                right="-20%"
                                w="200px"
                                h="200px"
                                borderRadius="full"
                                bg="whiteAlpha.200"
                            />
                            <Box
                                position="absolute"
                                bottom="-20%"
                                left="-10%"
                                w="150px"
                                h="150px"
                                borderRadius="full"
                                bg="whiteAlpha.100"
                            />
                            <VStack spacing={4} position="relative">
                                <Avatar
                                    size="2xl"
                                    name={driverProfile?.name || user?.username}
                                    bg="whiteAlpha.300"
                                    color="white"
                                    fontWeight="bold"
                                    fontSize="3xl"
                                    border="4px solid"
                                    borderColor="whiteAlpha.400"
                                />
                                <Badge
                                    colorScheme={driverProfile?.isAvailable ? 'green' : 'gray'}
                                    px={4}
                                    py={1}
                                    borderRadius="full"
                                    fontSize="sm"
                                    fontWeight="600"
                                >
                                    {driverProfile?.isAvailable ? 'Available' : 'Unavailable'}
                                </Badge>
                            </VStack>
                        </Box>

                        {/* Right - Driver Info */}
                        <Flex flex={1} p={8} direction="column" justify="space-between">
                            <Box>
                                <HStack justify="space-between" mb={4}>
                                    <Box>
                                        <Badge
                                            colorScheme="orange"
                                            px={3}
                                            py={1}
                                            borderRadius="full"
                                            fontSize="xs"
                                            fontWeight="600"
                                            mb={2}
                                        >
                                            DRIVER PORTAL
                                        </Badge>
                                        <Heading size="xl" color={headingColor} fontWeight="800">
                                            {driverProfile?.name || user?.username}
                                        </Heading>
                                    </Box>
                                    <FormControl display="flex" alignItems="center" w="auto">
                                        <FormLabel htmlFor="availability" mb="0" mr={3} color={textColor}>
                                            Status
                                        </FormLabel>
                                        <Switch
                                            id="availability"
                                            colorScheme="green"
                                            size="lg"
                                            isChecked={driverProfile?.isAvailable || false}
                                            onChange={handleAvailabilityToggle}
                                            isDisabled={availabilityLoading}
                                        />
                                    </FormControl>
                                </HStack>

                                <Divider my={4} borderColor={borderColor} />

                                <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={4}>
                                    <HStack spacing={3}>
                                        <Box
                                            bg={useColorModeValue('orange.100', 'orange.900')}
                                            p={2}
                                            borderRadius="lg"
                                        >
                                            <Icon as={FiPhone} color={useColorModeValue('orange.600', 'orange.300')} />
                                        </Box>
                                        <Box>
                                            <Text fontSize="xs" color={textColor}>Phone</Text>
                                            <Text fontWeight="600" color={headingColor}>
                                                {driverProfile?.phone || 'Not set'}
                                            </Text>
                                        </Box>
                                    </HStack>

                                    <HStack spacing={3}>
                                        <Box
                                            bg={useColorModeValue('blue.100', 'blue.900')}
                                            p={2}
                                            borderRadius="lg"
                                        >
                                            <Icon as={FiTruck} color={useColorModeValue('blue.600', 'blue.300')} />
                                        </Box>
                                        <Box>
                                            <Text fontSize="xs" color={textColor}>Vehicle</Text>
                                            <Text fontWeight="600" color={headingColor}>
                                                {driverProfile?.vehicleType || 'N/A'} - {driverProfile?.vehicleNumber || 'N/A'}
                                            </Text>
                                        </Box>
                                    </HStack>

                                    <HStack spacing={3}>
                                        <Box
                                            bg={useColorModeValue('purple.100', 'purple.900')}
                                            p={2}
                                            borderRadius="lg"
                                        >
                                            <Icon as={FiMapPin} color={useColorModeValue('purple.600', 'purple.300')} />
                                        </Box>
                                        <Box>
                                            <Text fontSize="xs" color={textColor}>Center</Text>
                                            <Text fontWeight="600" color={headingColor}>
                                                {driverProfile?.collectionCenterName || 'Not assigned'}
                                            </Text>
                                        </Box>
                                    </HStack>
                                </Grid>
                            </Box>
                        </Flex>
                    </Flex>
                </CardBody>
            </Card>

            {/* Stats Cards */}
            <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }} gap={6}>
                <StatCard
                    icon={FiClock}
                    label="Pending"
                    value={stats.pending}
                    helpText="Waiting for pickup"
                    color="yellow"
                    highlight={stats.pending > 0}
                />
                <StatCard
                    icon={FiNavigation}
                    label="In Transit"
                    value={stats.inTransit}
                    helpText="Currently delivering"
                    color="purple"
                />
                <StatCard
                    icon={FiCheckCircle}
                    label="Completed"
                    value={stats.completed}
                    helpText="Delivered successfully"
                    color="green"
                />
                <StatCard
                    icon={FiPackage}
                    label="Total"
                    value={stats.total}
                    helpText="All time deliveries"
                    color="blue"
                />
            </Grid>

            {/* Active Deliveries */}
            <Card
                bg={cardBg}
                border="1px"
                borderColor={pendingDeliveries.length > 0 ? 'orange.300' : borderColor}
                borderRadius="2xl"
                boxShadow={useColorModeValue('lg', 'dark-lg')}
                overflow="hidden"
            >
                {pendingDeliveries.length > 0 && (
                    <Box h="4px" bgGradient={gradientBg} />
                )}
                <CardBody p={0}>
                    <Flex justify="space-between" align="center" p={6} pb={4}>
                        <HStack spacing={3}>
                            <Heading size="md" color={headingColor}>Active Deliveries</Heading>
                            {pendingDeliveries.length > 0 && (
                                <Badge
                                    colorScheme="orange"
                                    borderRadius="full"
                                    px={3}
                                    py={1}
                                    fontSize="sm"
                                    fontWeight="600"
                                >
                                    {pendingDeliveries.length} pending
                                </Badge>
                            )}
                        </HStack>
                        <Button
                            size="sm"
                            colorScheme="orange"
                            variant="outline"
                            rightIcon={<FiArrowRight />}
                            onClick={() => navigate('/driver/deliveries')}
                            borderRadius="lg"
                        >
                            View All
                        </Button>
                    </Flex>

                    {pendingDeliveries.length > 0 ? (
                        <VStack spacing={0} align="stretch" px={6} pb={6}>
                            {pendingDeliveries.slice(0, 5).map((delivery, index) => (
                                <Box
                                    key={delivery.id}
                                    p={4}
                                    borderRadius="xl"
                                    border="1px"
                                    borderColor={borderColor}
                                    mb={index < pendingDeliveries.length - 1 ? 3 : 0}
                                    _hover={{ bg: hoverBg, borderColor: 'orange.300' }}
                                    cursor="pointer"
                                    onClick={() => navigate('/driver/deliveries')}
                                    transition="all 0.2s"
                                >
                                    <Flex justify="space-between" align="start" flexWrap="wrap" gap={4}>
                                        <HStack spacing={4} flex={1}>
                                            <Box
                                                bg={useColorModeValue(`${getStatusColor(delivery.status)}.100`, `${getStatusColor(delivery.status)}.900`)}
                                                p={3}
                                                borderRadius="xl"
                                            >
                                                <Icon
                                                    as={getStatusIcon(delivery.status)}
                                                    boxSize={5}
                                                    color={useColorModeValue(`${getStatusColor(delivery.status)}.600`, `${getStatusColor(delivery.status)}.300`)}
                                                />
                                            </Box>
                                            <Box>
                                                <Text fontWeight="700" color={headingColor} fontSize="md">
                                                    {delivery.donationName || 'Donation'}
                                                </Text>
                                                <VStack align="flex-start" spacing={1} mt={2}>
                                                    <HStack spacing={2}>
                                                        <Icon as={FiMapPin} color="green.500" boxSize={3} />
                                                        <Text fontSize="sm" color={textColor}>
                                                            From: {delivery.fromCenterName}
                                                        </Text>
                                                    </HStack>
                                                    <HStack spacing={2}>
                                                        <Icon as={FiNavigation} color="red.500" boxSize={3} />
                                                        <Text fontSize="sm" color={textColor}>
                                                            To: {delivery.recipientName} - {delivery.recipientAddress}
                                                        </Text>
                                                    </HStack>
                                                </VStack>
                                            </Box>
                                        </HStack>
                                        <VStack align="flex-end" spacing={2}>
                                            <Badge
                                                colorScheme={getStatusColor(delivery.status)}
                                                borderRadius="full"
                                                px={3}
                                                py={1}
                                                fontSize="xs"
                                                fontWeight="600"
                                            >
                                                {delivery.status?.replace('_', ' ')}
                                            </Badge>
                                            <Button
                                                size="xs"
                                                colorScheme="orange"
                                                rightIcon={<FiArrowRight />}
                                                borderRadius="lg"
                                            >
                                                Details
                                            </Button>
                                        </VStack>
                                    </Flex>
                                </Box>
                            ))}
                        </VStack>
                    ) : (
                        <Box textAlign="center" py={12} px={6}>
                            <Box
                                bg={useColorModeValue('green.100', 'green.900')}
                                p={4}
                                borderRadius="full"
                                display="inline-block"
                                mb={4}
                            >
                                <Icon as={FiCheckCircle} boxSize={8} color={useColorModeValue('green.500', 'green.300')} />
                            </Box>
                            <Heading size="md" color={headingColor} mb={2}>You're all caught up!</Heading>
                            <Text color={textColor}>
                                No pending deliveries at the moment
                            </Text>
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
                        borderColor: 'orange.300',
                    }}
                    cursor="pointer"
                    onClick={() => navigate('/driver/deliveries')}
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
                                <Icon as={FiTruck} boxSize={6} color="white" />
                            </Box>
                            <Box flex={1}>
                                <Heading size="sm" color={headingColor} mb={1}>
                                    My Deliveries
                                </Heading>
                                <Text fontSize="sm" color={textColor}>
                                    View and manage your deliveries
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
                        borderColor: 'purple.300',
                    }}
                    cursor="pointer"
                    onClick={() => navigate('/profile')}
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
                        bgGradient="linear(to-r, purple.400, pink.400)"
                    />
                    <CardBody p={6}>
                        <HStack spacing={4}>
                            <Box
                                bgGradient="linear(to-br, purple.400, pink.400)"
                                p={4}
                                borderRadius="xl"
                            >
                                <Icon as={FiUser} boxSize={6} color="white" />
                            </Box>
                            <Box flex={1}>
                                <Heading size="sm" color={headingColor} mb={1}>
                                    My Profile
                                </Heading>
                                <Text fontSize="sm" color={textColor}>
                                    Update your profile information
                                </Text>
                            </Box>
                            <Icon as={FiArrowRight} color={textColor} />
                        </HStack>
                    </CardBody>
                </Card>
            </Grid>

            {/* Performance Tip */}
            {driverProfile?.isAvailable && stats.completed > 0 && (
                <Card
                    bg={useColorModeValue('green.50', 'green.900')}
                    border="1px"
                    borderColor={useColorModeValue('green.200', 'green.700')}
                    borderRadius="2xl"
                >
                    <CardBody p={6}>
                        <HStack spacing={4}>
                            <Box
                                bg={useColorModeValue('green.100', 'green.800')}
                                p={3}
                                borderRadius="xl"
                            >
                                <Icon as={FiZap} boxSize={6} color={useColorModeValue('green.600', 'green.300')} />
                            </Box>
                            <Box>
                                <Text fontWeight="700" color={useColorModeValue('green.800', 'green.100')}>
                                    Great job!
                                </Text>
                                <Text fontSize="sm" color={useColorModeValue('green.700', 'green.200')}>
                                    You've completed {stats.completed} deliveries. Keep up the excellent work!
                                </Text>
                            </Box>
                        </HStack>
                    </CardBody>
                </Card>
            )}
        </VStack>
    );
};

export default DriverDashboard;
