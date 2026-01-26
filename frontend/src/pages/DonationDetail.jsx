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
    useColorModeValue,
    useToast,
    IconButton,
    Grid,
    Divider,
    Spinner,
    Center,
    Icon,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Stepper,
    Step,
    StepIndicator,
    StepStatus,
    StepIcon,
    StepNumber,
    StepTitle,
    StepDescription,
    StepSeparator,
    Flex,
} from '@chakra-ui/react';
import {
    FiArrowLeft,
    FiPackage,
    FiUser,
    FiMapPin,
    FiCalendar,
    FiCheckCircle,
    FiXCircle,
    FiClock,
    FiTruck,
    FiCpu,
} from 'react-icons/fi';
import { useNavigate, useParams } from 'react-router-dom';
import { donationAPI, donationItemAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { FoodTipsCard, ThankYouCard } from '../components/ai';

const DonationDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const toast = useToast();

    // Color mode values
    const cardBg = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.100', 'gray.700');
    const textColor = useColorModeValue('gray.600', 'gray.400');
    const headingColor = useColorModeValue('gray.800', 'white');
    const gradientBg = useColorModeValue(
        'linear(to-br, brand.400, teal.400, blue.400)',
        'linear(to-br, brand.500, teal.500, blue.500)'
    );

    const [donation, setDonation] = useState(null);
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);

    const isStaffOrAdmin = user?.role === 'ROLE_STAFF' || user?.role === 'ROLE_ADMIN';

    useEffect(() => {
        fetchDonation();
    }, [id]);

    const fetchDonation = async () => {
        try {
            setLoading(true);
            const response = await donationAPI.getById(id);
            const donationData = response.data;
            setDonation(donationData);

            // Use items from donation response if available
            if (donationData.donationItems && donationData.donationItems.length > 0) {
                setItems(donationData.donationItems);
            } else {
                // Fallback: Fetch items separately if not included in donation
                try {
                    const itemsResponse = await donationItemAPI.getAll();
                    const donationItems = itemsResponse.data.filter(item => item.donationId === parseInt(id));
                    setItems(donationItems);
                } catch (e) {
                    console.log('Could not fetch items:', e);
                }
            }
        } catch (error) {
            console.error('Error fetching donation:', error);
            toast({
                title: 'Error',
                description: 'Failed to load donation details',
                status: 'error',
                duration: 3000,
            });
            navigate(-1);
        } finally {
            setLoading(false);
        }
    };

    const handleAccept = async () => {
        setActionLoading(true);
        try {
            await donationAPI.accept(id);
            toast({
                title: 'Donation Accepted',
                description: 'Donation has been marked as collected',
                status: 'success',
                duration: 3000,
            });
            await fetchDonation();
        } catch (error) {
            toast({
                title: 'Error',
                description: error.response?.data?.message || 'Failed to accept donation',
                status: 'error',
                duration: 3000,
            });
        } finally {
            setActionLoading(false);
        }
    };

    const handleReject = async () => {
        setActionLoading(true);
        try {
            await donationAPI.reject(id);
            toast({
                title: 'Donation Rejected',
                status: 'info',
                duration: 3000,
            });
            await fetchDonation();
        } catch (error) {
            toast({
                title: 'Error',
                description: error.response?.data?.message || 'Failed to reject donation',
                status: 'error',
                duration: 3000,
            });
        } finally {
            setActionLoading(false);
        }
    };

    const handleUpdateStatus = async (newStatus) => {
        setActionLoading(true);
        try {
            await donationAPI.updateStatus(id, newStatus);
            toast({
                title: 'Status Updated',
                description: `Donation marked as ${newStatus}`,
                status: 'success',
                duration: 3000,
            });
            await fetchDonation();
        } catch (error) {
            toast({
                title: 'Error',
                description: error.response?.data?.message || 'Failed to update status',
                status: 'error',
                duration: 3000,
            });
        } finally {
            setActionLoading(false);
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

    const getStatusStep = (status) => {
        const steps = ['PENDING', 'COLLECTED', 'DELIVERED', 'PROCESSED'];
        if (status === 'REJECTED') return -1;
        return steps.indexOf(status);
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    if (loading) {
        return (
            <Center h="400px">
                <VStack spacing={4}>
                    <Spinner size="xl" color="brand.500" thickness="4px" />
                    <Text color={textColor}>Loading donation details...</Text>
                </VStack>
            </Center>
        );
    }

    if (!donation) {
        return (
            <Center h="400px">
                <VStack spacing={4}>
                    <Icon as={FiPackage} boxSize={12} color={textColor} />
                    <Text color={headingColor} fontWeight="600">Donation not found</Text>
                    <Button onClick={() => navigate(-1)} borderRadius="xl">Go Back</Button>
                </VStack>
            </Center>
        );
    }

    const statusSteps = [
        { title: 'Pending', description: 'Awaiting approval', icon: FiClock },
        { title: 'Collected', description: 'Staff accepted', icon: FiCheckCircle },
        { title: 'Delivered', description: 'In transit', icon: FiTruck },
        { title: 'Processed', description: 'Completed', icon: FiPackage },
    ];

    return (
        <VStack spacing={6} align="stretch">
            {/* Header */}
            <Card
                bg={cardBg}
                borderRadius="2xl"
                border="1px"
                borderColor={borderColor}
                boxShadow={useColorModeValue('lg', 'dark-lg')}
                overflow="hidden"
            >
                <Box h="4px" bgGradient={gradientBg} />
                <CardBody p={6}>
                    <Flex align="center" gap={4} flexWrap="wrap">
                        <IconButton
                            icon={<FiArrowLeft />}
                            variant="ghost"
                            onClick={() => navigate(-1)}
                            aria-label="Go back"
                            borderRadius="xl"
                            size="lg"
                        />
                        <Box flex={1}>
                            <Badge colorScheme="brand" borderRadius="full" px={3} py={1} mb={2}>
                                DONATION #{donation.id}
                            </Badge>
                            <Heading size="lg" color={headingColor}>{donation.name || 'Unnamed Donation'}</Heading>
                        </Box>
                        <Badge
                            colorScheme={getStatusColor(donation.status)}
                            fontSize="md"
                            px={4}
                            py={2}
                            borderRadius="full"
                        >
                            {donation.status}
                        </Badge>
                    </Flex>
                </CardBody>
            </Card>

            {/* Status Progress */}
            {donation.status !== 'REJECTED' && (
                <Card
                    bg={cardBg}
                    border="1px"
                    borderColor={borderColor}
                    borderRadius="2xl"
                    boxShadow={useColorModeValue('lg', 'dark-lg')}
                >
                    <CardBody p={6}>
                        <Heading size="md" mb={6} color={headingColor}>Status Progress</Heading>
                        <Stepper index={getStatusStep(donation.status)} colorScheme="brand" size="lg">
                            {statusSteps.map((step, index) => (
                                <Step key={index}>
                                    <StepIndicator>
                                        <StepStatus
                                            complete={<StepIcon />}
                                            incomplete={<StepNumber />}
                                            active={<StepNumber />}
                                        />
                                    </StepIndicator>
                                    <Box flexShrink={0}>
                                        <StepTitle>{step.title}</StepTitle>
                                        <StepDescription>{step.description}</StepDescription>
                                    </Box>
                                    <StepSeparator />
                                </Step>
                            ))}
                        </Stepper>
                    </CardBody>
                </Card>
            )}

            {/* Rejected Banner */}
            {donation.status === 'REJECTED' && (
                <Card
                    bg={useColorModeValue('red.50', 'red.900')}
                    border="1px"
                    borderColor={useColorModeValue('red.200', 'red.700')}
                    borderRadius="2xl"
                >
                    <CardBody p={6}>
                        <HStack>
                            <Icon as={FiXCircle} color={useColorModeValue('red.500', 'red.300')} boxSize={6} />
                            <Box>
                                <Text fontWeight="bold" color={useColorModeValue('red.700', 'red.200')}>
                                    Donation Rejected
                                </Text>
                                <Text color={useColorModeValue('red.600', 'red.300')}>
                                    This donation was rejected by the collection center.
                                </Text>
                            </Box>
                        </HStack>
                    </CardBody>
                </Card>
            )}

            {/* Details Grid */}
            <Grid templateColumns={{ base: '1fr', lg: '2fr 1fr' }} gap={6}>
                {/* Main Details */}
                <VStack spacing={6} align="stretch">
                    <Card
                        bg={cardBg}
                        border="1px"
                        borderColor={borderColor}
                        borderRadius="2xl"
                        boxShadow={useColorModeValue('lg', 'dark-lg')}
                    >
                        <CardBody p={6}>
                            <Heading size="md" mb={6} color={headingColor}>Donation Details</Heading>
                            <VStack align="stretch" spacing={4}>
                                <HStack>
                                    <Box
                                        bg={useColorModeValue('brand.100', 'brand.900')}
                                        p={2}
                                        borderRadius="lg"
                                    >
                                        <Icon as={FiUser} color={useColorModeValue('brand.600', 'brand.300')} />
                                    </Box>
                                    <Box>
                                        <Text fontSize="sm" color={textColor}>Donor</Text>
                                        <Text fontWeight="600" color={headingColor}>
                                            {donation.donor?.name || 'Unknown'}
                                        </Text>
                                    </Box>
                                </HStack>
                                <HStack>
                                    <Box
                                        bg={useColorModeValue('blue.100', 'blue.900')}
                                        p={2}
                                        borderRadius="lg"
                                    >
                                        <Icon as={FiCalendar} color={useColorModeValue('blue.600', 'blue.300')} />
                                    </Box>
                                    <Box>
                                        <Text fontSize="sm" color={textColor}>Date</Text>
                                        <Text fontWeight="600" color={headingColor}>
                                            {formatDate(donation.donationDate)}
                                        </Text>
                                    </Box>
                                </HStack>
                                <HStack>
                                    <Box
                                        bg={useColorModeValue('purple.100', 'purple.900')}
                                        p={2}
                                        borderRadius="lg"
                                    >
                                        <Icon as={FiMapPin} color={useColorModeValue('purple.600', 'purple.300')} />
                                    </Box>
                                    <Box>
                                        <Text fontSize="sm" color={textColor}>Collection Center</Text>
                                        <Text fontWeight="600" color={headingColor}>
                                            {donation.collectionCenter?.name || 'Not assigned'}
                                        </Text>
                                        {donation.collectionCenter?.location && (
                                            <Text fontSize="sm" color={textColor}>
                                                {donation.collectionCenter.location}
                                            </Text>
                                        )}
                                    </Box>
                                </HStack>
                            </VStack>

                            {/* Items Table */}
                            {items.length > 0 && (
                                <>
                                    <Divider my={6} borderColor={borderColor} />
                                    <Heading size="md" mb={4} color={headingColor}>Donation Items</Heading>
                                    <Box overflowX="auto">
                                        <Table variant="simple" size="sm">
                                            <Thead bg={useColorModeValue('gray.50', 'gray.900')}>
                                                <Tr>
                                                    <Th borderColor={borderColor}>Item Name</Th>
                                                    <Th borderColor={borderColor}>Quantity</Th>
                                                    <Th borderColor={borderColor}>Unit</Th>
                                                    <Th borderColor={borderColor}>Type</Th>
                                                </Tr>
                                            </Thead>
                                            <Tbody>
                                                {items.map((item) => (
                                                    <Tr key={item.id}>
                                                        <Td borderColor={borderColor} fontWeight="500">
                                                            {item.itemName}
                                                        </Td>
                                                        <Td borderColor={borderColor}>{item.quantity}</Td>
                                                        <Td borderColor={borderColor}>{item.unit}</Td>
                                                        <Td borderColor={borderColor}>
                                                            <Badge colorScheme="gray" borderRadius="full">
                                                                {item.type || '-'}
                                                            </Badge>
                                                        </Td>
                                                    </Tr>
                                                ))}
                                            </Tbody>
                                        </Table>
                                    </Box>
                                </>
                            )}
                        </CardBody>
                    </Card>

                    {/* AI Food Tips Card */}
                    {items.length > 0 && (
                        <FoodTipsCard donationId={donation.id} items={items} />
                    )}

                    {/* AI Thank You Card - Staff can generate, donors can view */}
                    {items.length > 0 && (
                        <ThankYouCard
                            donationId={donation.id}
                            donorName={donation.donor?.name}
                            items={items}
                            date={formatDate(donation.donationDate)}
                        />
                    )}
                </VStack>

                {/* Actions Card */}
                <Card
                    bg={cardBg}
                    border="1px"
                    borderColor={borderColor}
                    borderRadius="2xl"
                    boxShadow={useColorModeValue('lg', 'dark-lg')}
                    h="fit-content"
                >
                    <CardBody p={6}>
                        <Heading size="md" mb={6} color={headingColor}>Actions</Heading>
                        <VStack spacing={3} align="stretch">
                            {isStaffOrAdmin && donation.status === 'PENDING' && (
                                <>
                                    <Button
                                        colorScheme="green"
                                        leftIcon={<FiCheckCircle />}
                                        onClick={handleAccept}
                                        isLoading={actionLoading}
                                        borderRadius="xl"
                                        size="lg"
                                    >
                                        Accept Donation
                                    </Button>
                                    <Button
                                        colorScheme="red"
                                        variant="outline"
                                        leftIcon={<FiXCircle />}
                                        onClick={handleReject}
                                        isLoading={actionLoading}
                                        borderRadius="xl"
                                        size="lg"
                                    >
                                        Reject Donation
                                    </Button>
                                </>
                            )}
                            {isStaffOrAdmin && donation.status === 'COLLECTED' && (
                                <Button
                                    colorScheme="blue"
                                    leftIcon={<FiTruck />}
                                    onClick={() => handleUpdateStatus('DELIVERED')}
                                    isLoading={actionLoading}
                                    borderRadius="xl"
                                    size="lg"
                                >
                                    Mark as Delivered
                                </Button>
                            )}
                            {isStaffOrAdmin && donation.status === 'DELIVERED' && (
                                <Button
                                    colorScheme="purple"
                                    leftIcon={<FiPackage />}
                                    onClick={() => handleUpdateStatus('PROCESSED')}
                                    isLoading={actionLoading}
                                    borderRadius="xl"
                                    size="lg"
                                >
                                    Mark as Processed
                                </Button>
                            )}
                            {!isStaffOrAdmin && donation.status === 'PENDING' && (
                                <Box
                                    bg={useColorModeValue('yellow.50', 'yellow.900')}
                                    p={4}
                                    borderRadius="xl"
                                    textAlign="center"
                                >
                                    <Icon as={FiClock} color="yellow.500" boxSize={6} mb={2} />
                                    <Text color={useColorModeValue('yellow.700', 'yellow.200')} fontWeight="500">
                                        Waiting for approval
                                    </Text>
                                    <Text fontSize="sm" color={textColor}>
                                        The collection center will review your donation
                                    </Text>
                                </Box>
                            )}
                            {donation.status === 'PROCESSED' && (
                                <Box
                                    bg={useColorModeValue('green.50', 'green.900')}
                                    p={6}
                                    borderRadius="xl"
                                    textAlign="center"
                                >
                                    <Icon as={FiCheckCircle} color="green.500" boxSize={10} mb={2} />
                                    <Text color={useColorModeValue('green.700', 'green.200')} fontWeight="bold" fontSize="lg">
                                        Completed!
                                    </Text>
                                    <Text fontSize="sm" color={textColor}>
                                        This donation has been processed
                                    </Text>
                                </Box>
                            )}
                            {donation.status === 'REJECTED' && (
                                <Box
                                    bg={useColorModeValue('gray.50', 'gray.700')}
                                    p={4}
                                    borderRadius="xl"
                                    textAlign="center"
                                >
                                    <Text color={textColor}>
                                        No actions available
                                    </Text>
                                </Box>
                            )}
                        </VStack>

                        {/* AI Info Badge */}
                        <Divider my={6} borderColor={borderColor} />
                        <Box
                            bg={useColorModeValue('purple.50', 'purple.900')}
                            p={4}
                            borderRadius="xl"
                            border="1px"
                            borderColor={useColorModeValue('purple.200', 'purple.700')}
                        >
                            <HStack spacing={3}>
                                <Icon as={FiCpu} color={useColorModeValue('purple.600', 'purple.300')} />
                                <Box>
                                    <Text fontSize="sm" fontWeight="600" color={useColorModeValue('purple.700', 'purple.200')}>
                                        AI-Powered Features
                                    </Text>
                                    <Text fontSize="xs" color={textColor}>
                                        Get food handling tips and thank you messages
                                    </Text>
                                </Box>
                            </HStack>
                        </Box>
                    </CardBody>
                </Card>
            </Grid>
        </VStack>
    );
};

export default DonationDetail;
