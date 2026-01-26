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
    useToast,
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogOverlay,
    useDisclosure,
    Progress,
    Avatar,
    Tooltip,
    CircularProgress,
    CircularProgressLabel,
} from '@chakra-ui/react';
import {
    FiPackage,
    FiClock,
    FiCheckCircle,
    FiXCircle,
    FiTruck,
    FiMapPin,
    FiArrowRight,
    FiUsers,
    FiAlertCircle,
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { donationAPI, centerAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useRef } from 'react';

const StaffDashboard = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const toast = useToast();

    // Color mode values
    const cardBg = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.100', 'gray.700');
    const textColor = useColorModeValue('gray.600', 'gray.400');
    const headingColor = useColorModeValue('gray.800', 'white');
    const hoverBg = useColorModeValue('gray.50', 'gray.700');
    const tableBg = useColorModeValue('gray.50', 'gray.900');
    const gradientBg = useColorModeValue(
        'linear(to-br, blue.400, purple.500, pink.400)',
        'linear(to-br, blue.500, purple.600, pink.500)'
    );

    const [pendingDonations, setPendingDonations] = useState([]);
    const [allDonations, setAllDonations] = useState([]);
    const [myCenter, setMyCenter] = useState(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);
    const [stats, setStats] = useState({
        pending: 0,
        collected: 0,
        delivered: 0,
        rejected: 0,
    });

    const { isOpen, onOpen, onClose } = useDisclosure();
    const [selectedDonation, setSelectedDonation] = useState(null);
    const [actionType, setActionType] = useState(null);
    const cancelRef = useRef();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);

            try {
                const centerResponse = await centerAPI.getMyCenter();
                setMyCenter(centerResponse.data);
            } catch (error) {
                console.log('No center assigned to this user');
            }

            try {
                const pendingResponse = await donationAPI.getCenterPending();
                setPendingDonations(pendingResponse.data);
            } catch (error) {
                console.log('Error fetching pending donations:', error);
            }

            try {
                const allResponse = await donationAPI.getCenterAll();
                const donations = allResponse.data;
                setAllDonations(donations);

                setStats({
                    pending: donations.filter(d => d.status === 'PENDING').length,
                    collected: donations.filter(d => d.status === 'COLLECTED').length,
                    delivered: donations.filter(d => d.status === 'DELIVERED').length,
                    rejected: donations.filter(d => d.status === 'REJECTED').length,
                });
            } catch (error) {
                console.log('Error fetching all donations:', error);
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

    const handleAction = (donation, action) => {
        setSelectedDonation(donation);
        setActionType(action);
        onOpen();
    };

    const confirmAction = async () => {
        if (!selectedDonation || !actionType) return;

        setActionLoading(selectedDonation.id);
        try {
            if (actionType === 'accept') {
                await donationAPI.accept(selectedDonation.id);
                toast({
                    title: 'Donation Accepted',
                    description: `Donation "${selectedDonation.name}" has been accepted and marked as collected.`,
                    status: 'success',
                    duration: 3000,
                });
            } else {
                await donationAPI.reject(selectedDonation.id);
                toast({
                    title: 'Donation Rejected',
                    description: `Donation "${selectedDonation.name}" has been rejected.`,
                    status: 'info',
                    duration: 3000,
                });
            }
            await fetchData();
        } catch (error) {
            console.error('Error performing action:', error);
            toast({
                title: 'Error',
                description: error.response?.data?.message || 'Failed to perform action',
                status: 'error',
                duration: 3000,
            });
        } finally {
            setActionLoading(null);
            onClose();
            setSelectedDonation(null);
            setActionType(null);
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

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const StatCard = ({ icon, label, value, helpText, color, isUrgent }) => (
        <Card
            bg={cardBg}
            border="1px"
            borderColor={isUrgent && value > 0 ? `${color}.300` : borderColor}
            borderRadius="2xl"
            boxShadow={useColorModeValue('lg', 'dark-lg')}
            overflow="hidden"
            position="relative"
            _hover={{ transform: 'translateY(-4px)', boxShadow: '2xl' }}
            transition="all 0.3s ease"
        >
            {isUrgent && value > 0 && (
                <Box
                    position="absolute"
                    top={0}
                    left={0}
                    right={0}
                    h="4px"
                    bg={`${color}.400`}
                />
            )}
            <CardBody p={6}>
                <Flex justify="space-between" align="start">
                    <Box>
                        <Text
                            fontSize="sm"
                            fontWeight="600"
                            color={textColor}
                            textTransform="uppercase"
                            letterSpacing="wide"
                        >
                            {label}
                        </Text>
                        <Text
                            fontSize="4xl"
                            fontWeight="800"
                            color={useColorModeValue(`${color}.500`, `${color}.300`)}
                            lineHeight="1.2"
                            mt={1}
                        >
                            {value}
                        </Text>
                        <Text fontSize="sm" color={textColor} mt={1}>
                            {helpText}
                        </Text>
                    </Box>
                    <Box
                        bg={useColorModeValue(`${color}.100`, `${color}.900`)}
                        p={3}
                        borderRadius="xl"
                    >
                        <Icon
                            as={icon}
                            boxSize={6}
                            color={useColorModeValue(`${color}.600`, `${color}.300`)}
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
                    <Spinner size="xl" color="blue.500" thickness="4px" />
                    <Text color={textColor}>Loading staff dashboard...</Text>
                </VStack>
            </Center>
        );
    }

    const capacityPercentage = myCenter?.maxCapacity
        ? ((myCenter.currentLoad || 0) / myCenter.maxCapacity) * 100
        : 0;

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
                        {/* Left - Gradient Panel */}
                        <Box
                            bgGradient={gradientBg}
                            p={8}
                            w={{ base: '100%', lg: '300px' }}
                            minH="200px"
                            display="flex"
                            flexDirection="column"
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
                            <VStack align="flex-start" spacing={4} position="relative">
                                <Badge
                                    colorScheme="whiteAlpha"
                                    bg="whiteAlpha.200"
                                    color="white"
                                    px={3}
                                    py={1}
                                    borderRadius="full"
                                    fontSize="xs"
                                    fontWeight="600"
                                >
                                    STAFF PORTAL
                                </Badge>
                                <Heading color="white" size="xl" fontWeight="800">
                                    Staff Dashboard
                                </Heading>
                                <Text color="whiteAlpha.900" fontSize="md">
                                    {myCenter ? myCenter.name : 'Welcome, Staff Member'}
                                </Text>
                            </VStack>
                        </Box>

                        {/* Right - Center Info */}
                        <Flex flex={1} p={8} direction="column" justify="center">
                            {myCenter ? (
                                <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={6}>
                                    {/* Location */}
                                    <VStack align="flex-start" spacing={2}>
                                        <HStack color={textColor}>
                                            <Icon as={FiMapPin} />
                                            <Text fontSize="sm" fontWeight="500">Location</Text>
                                        </HStack>
                                        <Text fontWeight="600" color={headingColor}>
                                            {myCenter.location}
                                        </Text>
                                    </VStack>

                                    {/* Capacity */}
                                    <VStack align="center" spacing={2}>
                                        <CircularProgress
                                            value={capacityPercentage}
                                            size="80px"
                                            thickness="8px"
                                            color={
                                                capacityPercentage >= 90 ? 'red.400' :
                                                capacityPercentage >= 70 ? 'yellow.400' : 'green.400'
                                            }
                                            trackColor={useColorModeValue('gray.100', 'gray.700')}
                                        >
                                            <CircularProgressLabel fontWeight="bold" color={headingColor}>
                                                {Math.round(capacityPercentage)}%
                                            </CircularProgressLabel>
                                        </CircularProgress>
                                        <Text fontSize="sm" color={textColor}>
                                            {myCenter.currentLoad || 0} / {myCenter.maxCapacity || 0} units
                                        </Text>
                                    </VStack>

                                    {/* Quick Actions */}
                                    <VStack align="flex-end" spacing={3}>
                                        <Button
                                            size="sm"
                                            colorScheme="blue"
                                            variant="outline"
                                            leftIcon={<FiTruck />}
                                            onClick={() => navigate('/staff/deliveries')}
                                            borderRadius="lg"
                                        >
                                            Deliveries
                                        </Button>
                                        <Button
                                            size="sm"
                                            colorScheme="purple"
                                            variant="outline"
                                            leftIcon={<FiUsers />}
                                            onClick={() => navigate('/staff/recipients')}
                                            borderRadius="lg"
                                        >
                                            Recipients
                                        </Button>
                                    </VStack>
                                </Grid>
                            ) : (
                                <VStack spacing={4}>
                                    <Icon as={FiAlertCircle} boxSize={12} color="yellow.400" />
                                    <Text color={textColor} textAlign="center">
                                        You haven't been assigned to a collection center yet.
                                        Please contact an administrator.
                                    </Text>
                                </VStack>
                            )}
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
                    helpText="Awaiting your review"
                    color="yellow"
                    isUrgent={true}
                />
                <StatCard
                    icon={FiCheckCircle}
                    label="Collected"
                    value={stats.collected}
                    helpText="Accepted donations"
                    color="blue"
                />
                <StatCard
                    icon={FiTruck}
                    label="Delivered"
                    value={stats.delivered}
                    helpText="Completed deliveries"
                    color="green"
                />
                <StatCard
                    icon={FiXCircle}
                    label="Rejected"
                    value={stats.rejected}
                    helpText="Declined donations"
                    color="red"
                />
            </Grid>

            {/* Pending Donations - Action Required */}
            <Card
                bg={cardBg}
                border="1px"
                borderColor={pendingDonations.length > 0 ? 'yellow.300' : borderColor}
                borderRadius="2xl"
                boxShadow={useColorModeValue('lg', 'dark-lg')}
                overflow="hidden"
            >
                {pendingDonations.length > 0 && (
                    <Box h="4px" bgGradient="linear(to-r, yellow.400, orange.400)" />
                )}
                <CardBody p={0}>
                    <Flex justify="space-between" align="center" p={6} pb={4}>
                        <HStack spacing={3}>
                            <Heading size="md" color={headingColor}>Pending Donations</Heading>
                            {pendingDonations.length > 0 && (
                                <Badge
                                    colorScheme="yellow"
                                    borderRadius="full"
                                    px={3}
                                    py={1}
                                    fontSize="sm"
                                    fontWeight="600"
                                >
                                    {pendingDonations.length} requires action
                                </Badge>
                            )}
                        </HStack>
                    </Flex>

                    {pendingDonations.length > 0 ? (
                        <Box overflowX="auto">
                            <Table variant="simple">
                                <Thead bg={tableBg}>
                                    <Tr>
                                        <Th borderColor={borderColor} py={4}>Donation</Th>
                                        <Th borderColor={borderColor}>Donor</Th>
                                        <Th borderColor={borderColor}>Date</Th>
                                        <Th borderColor={borderColor}>Status</Th>
                                        <Th borderColor={borderColor}>Actions</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {pendingDonations.map((donation) => (
                                        <Tr key={donation.id} _hover={{ bg: hoverBg }}>
                                            <Td borderColor={borderColor} py={4}>
                                                <HStack>
                                                    <Box
                                                        bg={useColorModeValue('yellow.100', 'yellow.900')}
                                                        p={2}
                                                        borderRadius="lg"
                                                    >
                                                        <Icon as={FiPackage} color={useColorModeValue('yellow.600', 'yellow.300')} />
                                                    </Box>
                                                    <Text fontWeight="600" color={headingColor}>
                                                        {donation.name || 'Unnamed Donation'}
                                                    </Text>
                                                </HStack>
                                            </Td>
                                            <Td borderColor={borderColor}>
                                                <HStack>
                                                    <Avatar size="xs" name={donation.donor?.name} />
                                                    <Text color={textColor}>{donation.donor?.name || 'Unknown'}</Text>
                                                </HStack>
                                            </Td>
                                            <Td borderColor={borderColor} color={textColor}>
                                                {formatDate(donation.donationDate)}
                                            </Td>
                                            <Td borderColor={borderColor}>
                                                <Badge
                                                    colorScheme={getStatusColor(donation.status)}
                                                    borderRadius="full"
                                                    px={3}
                                                    py={1}
                                                    fontSize="xs"
                                                >
                                                    {donation.status}
                                                </Badge>
                                            </Td>
                                            <Td borderColor={borderColor}>
                                                <HStack spacing={2}>
                                                    <Tooltip label="Accept donation" hasArrow>
                                                        <Button
                                                            size="sm"
                                                            colorScheme="green"
                                                            leftIcon={<FiCheckCircle />}
                                                            onClick={() => handleAction(donation, 'accept')}
                                                            isLoading={actionLoading === donation.id}
                                                            borderRadius="lg"
                                                        >
                                                            Accept
                                                        </Button>
                                                    </Tooltip>
                                                    <Tooltip label="Reject donation" hasArrow>
                                                        <Button
                                                            size="sm"
                                                            colorScheme="red"
                                                            variant="outline"
                                                            leftIcon={<FiXCircle />}
                                                            onClick={() => handleAction(donation, 'reject')}
                                                            isLoading={actionLoading === donation.id}
                                                            borderRadius="lg"
                                                        >
                                                            Reject
                                                        </Button>
                                                    </Tooltip>
                                                </HStack>
                                            </Td>
                                        </Tr>
                                    ))}
                                </Tbody>
                            </Table>
                        </Box>
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
                            <Heading size="md" color={headingColor} mb={2}>All caught up!</Heading>
                            <Text color={textColor}>
                                No pending donations to review
                            </Text>
                        </Box>
                    )}
                </CardBody>
            </Card>

            {/* Recent Activity */}
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
                        <Heading size="md" color={headingColor}>Recent Activity</Heading>
                        <Button
                            variant="ghost"
                            colorScheme="blue"
                            rightIcon={<FiArrowRight />}
                            onClick={() => navigate('/donations/all')}
                            borderRadius="xl"
                        >
                            View All
                        </Button>
                    </Flex>

                    {allDonations.length > 0 ? (
                        <VStack spacing={0} align="stretch" px={6} pb={6}>
                            {allDonations.slice(0, 5).map((donation, index) => (
                                <Box
                                    key={donation.id}
                                    p={4}
                                    borderRadius="xl"
                                    border="1px"
                                    borderColor={borderColor}
                                    mb={index < 4 ? 3 : 0}
                                    _hover={{ bg: hoverBg, borderColor: 'blue.300' }}
                                    cursor="pointer"
                                    onClick={() => navigate(`/donations/${donation.id}`)}
                                    transition="all 0.2s"
                                >
                                    <Flex justify="space-between" align="center">
                                        <HStack spacing={4}>
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
                                            <Box>
                                                <Text fontWeight="600" color={headingColor}>
                                                    {donation.name || 'Unnamed Donation'}
                                                </Text>
                                                <Text fontSize="sm" color={textColor}>
                                                    by {donation.donor?.name || 'Unknown'} - {formatDate(donation.donationDate)}
                                                </Text>
                                            </Box>
                                        </HStack>
                                        <HStack spacing={3}>
                                            <Badge
                                                colorScheme={getStatusColor(donation.status)}
                                                borderRadius="full"
                                                px={3}
                                                py={1}
                                                fontSize="xs"
                                            >
                                                {donation.status}
                                            </Badge>
                                            <Icon as={FiArrowRight} color={textColor} />
                                        </HStack>
                                    </Flex>
                                </Box>
                            ))}
                        </VStack>
                    ) : (
                        <Box textAlign="center" py={12} px={6}>
                            <Icon as={FiPackage} boxSize={12} color={textColor} mb={4} />
                            <Text color={textColor}>No donations yet</Text>
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
                        borderColor: 'blue.300',
                    }}
                    cursor="pointer"
                    onClick={() => navigate('/staff/deliveries')}
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
                        bgGradient="linear(to-r, blue.400, cyan.400)"
                    />
                    <CardBody p={6}>
                        <HStack spacing={4}>
                            <Box
                                bgGradient="linear(to-br, blue.400, cyan.400)"
                                p={4}
                                borderRadius="xl"
                            >
                                <Icon as={FiTruck} boxSize={6} color="white" />
                            </Box>
                            <Box flex={1}>
                                <Heading size="sm" color={headingColor} mb={1}>
                                    Manage Deliveries
                                </Heading>
                                <Text fontSize="sm" color={textColor}>
                                    Create and track deliveries to recipients
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
                    onClick={() => navigate('/staff/recipients')}
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
                                <Icon as={FiUsers} boxSize={6} color="white" />
                            </Box>
                            <Box flex={1}>
                                <Heading size="sm" color={headingColor} mb={1}>
                                    Manage Recipients
                                </Heading>
                                <Text fontSize="sm" color={textColor}>
                                    Add and manage recipient organizations
                                </Text>
                            </Box>
                            <Icon as={FiArrowRight} color={textColor} />
                        </HStack>
                    </CardBody>
                </Card>
            </Grid>

            {/* Confirmation Dialog */}
            <AlertDialog
                isOpen={isOpen}
                leastDestructiveRef={cancelRef}
                onClose={onClose}
            >
                <AlertDialogOverlay backdropFilter="blur(4px)">
                    <AlertDialogContent borderRadius="2xl" mx={4}>
                        <AlertDialogHeader fontSize="lg" fontWeight="bold" pt={6}>
                            {actionType === 'accept' ? 'Accept Donation' : 'Reject Donation'}
                        </AlertDialogHeader>

                        <AlertDialogBody>
                            {actionType === 'accept'
                                ? `Are you sure you want to accept "${selectedDonation?.name}"? This will mark it as collected.`
                                : `Are you sure you want to reject "${selectedDonation?.name}"? This action cannot be undone.`
                            }
                        </AlertDialogBody>

                        <AlertDialogFooter pb={6}>
                            <Button
                                ref={cancelRef}
                                onClick={onClose}
                                borderRadius="xl"
                            >
                                Cancel
                            </Button>
                            <Button
                                colorScheme={actionType === 'accept' ? 'green' : 'red'}
                                onClick={confirmAction}
                                ml={3}
                                isLoading={actionLoading === selectedDonation?.id}
                                borderRadius="xl"
                            >
                                {actionType === 'accept' ? 'Accept' : 'Reject'}
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </VStack>
    );
};

export default StaffDashboard;
