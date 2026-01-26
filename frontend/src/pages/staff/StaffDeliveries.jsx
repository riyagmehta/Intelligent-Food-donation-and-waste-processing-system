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
    Icon,
    useColorModeValue,
    Flex,
    Spinner,
    Center,
    useToast,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Select,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    FormControl,
    FormLabel,
    Input,
    Textarea,
} from '@chakra-ui/react';
import {
    FiTruck,
    FiPlus,
    FiMapPin,
    FiUser,
    FiPackage,
} from 'react-icons/fi';
import { deliveryAPI, driverAPI, recipientAPI, donationAPI, centerAPI } from '../../services/api';

const StaffDeliveries = () => {
    const toast = useToast();
    const cardBg = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.700');

    const [deliveries, setDeliveries] = useState([]);
    const [collectedDonations, setCollectedDonations] = useState([]);
    const [availableDrivers, setAvailableDrivers] = useState([]);
    const [activeRecipients, setActiveRecipients] = useState([]);
    const [myCenter, setMyCenter] = useState(null);
    const [loading, setLoading] = useState(true);
    const [createLoading, setCreateLoading] = useState(false);
    const [statusFilter, setStatusFilter] = useState('ALL');

    // Modal state
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [newDelivery, setNewDelivery] = useState({
        donationId: '',
        driverId: '',
        recipientId: '',
        scheduledPickupTime: '',
        notes: '',
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);

            // Fetch center info
            try {
                const centerResponse = await centerAPI.getMyCenter();
                setMyCenter(centerResponse.data);

                // Fetch deliveries for this center
                if (centerResponse.data?.id) {
                    const deliveriesResponse = await deliveryAPI.getByCenter(centerResponse.data.id);
                    setDeliveries(deliveriesResponse.data);
                }
            } catch (error) {
                console.log('Error fetching center data:', error);
            }

            // Fetch all available drivers (not just for this center)
            try {
                const driversResponse = await driverAPI.getAll();
                console.log('Drivers response:', driversResponse.data);
                // Filter to only show available drivers
                const available = driversResponse.data.filter(d => d.isAvailable);
                console.log('Available drivers:', available);
                setAvailableDrivers(available);
            } catch (error) {
                console.error('Error fetching drivers:', error);
                toast({
                    title: 'Error loading drivers',
                    description: error.response?.status === 403 ? 'Access denied' : 'Failed to fetch drivers',
                    status: 'error',
                    duration: 3000,
                });
            }

            // Fetch collected donations (ready for delivery)
            try {
                const donationsResponse = await donationAPI.getCenterAll();
                const collected = donationsResponse.data.filter(d => d.status === 'COLLECTED');
                setCollectedDonations(collected);
            } catch (error) {
                console.log('Error fetching donations:', error);
            }

            // Fetch active recipients
            try {
                const recipientsResponse = await recipientAPI.getActive();
                setActiveRecipients(recipientsResponse.data);
            } catch (error) {
                console.log('Error fetching recipients:', error);
            }

        } catch (error) {
            console.error('Error fetching data:', error);
            toast({
                title: 'Error',
                description: 'Failed to load data',
                status: 'error',
                duration: 3000,
            });
        } finally {
            setLoading(false);
        }
    };

    const handleCreateDelivery = async () => {
        if (!newDelivery.donationId || !newDelivery.driverId || !newDelivery.recipientId) {
            toast({
                title: 'Missing Information',
                description: 'Please select donation, driver, and recipient',
                status: 'warning',
                duration: 3000,
            });
            return;
        }

        setCreateLoading(true);
        try {
            await deliveryAPI.create({
                donationId: parseInt(newDelivery.donationId),
                driverId: parseInt(newDelivery.driverId),
                recipientId: parseInt(newDelivery.recipientId),
                scheduledPickupTime: newDelivery.scheduledPickupTime || null,
                notes: newDelivery.notes || null,
            });

            toast({
                title: 'Success',
                description: 'Delivery created successfully',
                status: 'success',
                duration: 3000,
            });

            onClose();
            setNewDelivery({
                donationId: '',
                driverId: '',
                recipientId: '',
                scheduledPickupTime: '',
                notes: '',
            });
            await fetchData();
        } catch (error) {
            console.error('Error creating delivery:', error);
            toast({
                title: 'Error',
                description: error.response?.data?.message || 'Failed to create delivery',
                status: 'error',
                duration: 3000,
            });
        } finally {
            setCreateLoading(false);
        }
    };

    const handleCancelDelivery = async (deliveryId) => {
        try {
            await deliveryAPI.cancel(deliveryId);
            toast({
                title: 'Delivery Cancelled',
                status: 'success',
                duration: 2000,
            });
            await fetchData();
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to cancel delivery',
                status: 'error',
                duration: 3000,
            });
        }
    };

    const handleDeleteDelivery = async (deliveryId) => {
        try {
            await deliveryAPI.delete(deliveryId);
            toast({
                title: 'Delivery Deleted',
                status: 'success',
                duration: 2000,
            });
            await fetchData();
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to delete delivery',
                status: 'error',
                duration: 3000,
            });
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

    const formatDateTime = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleString();
    };

    const filteredDeliveries = statusFilter === 'ALL'
        ? deliveries
        : deliveries.filter(d => d.status === statusFilter);

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
                        Deliveries
                    </Heading>
                    <Text color="gray.600">
                        {myCenter ? `Managing deliveries for: ${myCenter.name}` : 'Manage deliveries'}
                    </Text>
                </Box>
                <HStack spacing={4}>
                    <Select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        w="180px"
                    >
                        <option value="ALL">All Statuses</option>
                        <option value="ASSIGNED">Assigned</option>
                        <option value="PICKED_UP">Picked Up</option>
                        <option value="IN_TRANSIT">In Transit</option>
                        <option value="DELIVERED">Delivered</option>
                        <option value="CANCELLED">Cancelled</option>
                    </Select>
                    <Button
                        colorScheme="teal"
                        leftIcon={<FiPlus />}
                        onClick={onOpen}
                        isDisabled={collectedDonations.length === 0}
                    >
                        Create Delivery
                    </Button>
                </HStack>
            </Flex>

            {/* Info Cards */}
            <HStack spacing={4} flexWrap="wrap">
                <Badge colorScheme="blue" p={2} borderRadius="md">
                    <HStack>
                        <Icon as={FiPackage} />
                        <Text>{collectedDonations.length} donations ready for delivery</Text>
                    </HStack>
                </Badge>
                <Badge colorScheme="green" p={2} borderRadius="md">
                    <HStack>
                        <Icon as={FiUser} />
                        <Text>{availableDrivers.length} drivers available</Text>
                    </HStack>
                </Badge>
                <Badge colorScheme="purple" p={2} borderRadius="md">
                    <HStack>
                        <Icon as={FiMapPin} />
                        <Text>{activeRecipients.length} active recipients</Text>
                    </HStack>
                </Badge>
            </HStack>

            {/* Deliveries Table */}
            <Card bg={cardBg} border="1px" borderColor={borderColor} boxShadow="sm">
                <CardBody>
                    {filteredDeliveries.length > 0 ? (
                        <Box overflowX="auto">
                            <Table variant="simple">
                                <Thead>
                                    <Tr>
                                        <Th>Donation</Th>
                                        <Th>Driver</Th>
                                        <Th>Recipient</Th>
                                        <Th>Status</Th>
                                        <Th>Scheduled</Th>
                                        <Th>Actions</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {filteredDeliveries.map((delivery) => (
                                        <Tr key={delivery.id}>
                                            <Td>
                                                <Text fontWeight="medium">{delivery.donationName || 'Donation'}</Text>
                                            </Td>
                                            <Td>
                                                <VStack align="start" spacing={0}>
                                                    <Text fontWeight="medium">{delivery.driverName}</Text>
                                                    <Text fontSize="sm" color="gray.600">{delivery.driverPhone}</Text>
                                                </VStack>
                                            </Td>
                                            <Td>
                                                <VStack align="start" spacing={0}>
                                                    <Text fontWeight="medium">{delivery.recipientName}</Text>
                                                    <Text fontSize="sm" color="gray.600">{delivery.recipientAddress}</Text>
                                                </VStack>
                                            </Td>
                                            <Td>
                                                <Badge colorScheme={getStatusColor(delivery.status)}>
                                                    {delivery.status}
                                                </Badge>
                                            </Td>
                                            <Td>
                                                <Text fontSize="sm">{formatDateTime(delivery.scheduledPickupTime)}</Text>
                                            </Td>
                                            <Td>
                                                <HStack spacing={2}>
                                                    {delivery.status === 'ASSIGNED' && (
                                                        <Button
                                                            size="sm"
                                                            colorScheme="red"
                                                            variant="outline"
                                                            onClick={() => handleCancelDelivery(delivery.id)}
                                                        >
                                                            Cancel
                                                        </Button>
                                                    )}
                                                    {(delivery.status === 'CANCELLED' || delivery.status === 'DELIVERED') && (
                                                        <Button
                                                            size="sm"
                                                            colorScheme="gray"
                                                            variant="outline"
                                                            onClick={() => handleDeleteDelivery(delivery.id)}
                                                        >
                                                            Delete
                                                        </Button>
                                                    )}
                                                </HStack>
                                            </Td>
                                        </Tr>
                                    ))}
                                </Tbody>
                            </Table>
                        </Box>
                    ) : (
                        <Box textAlign="center" py={12}>
                            <Icon as={FiTruck} boxSize={16} color="gray.300" mb={4} />
                            <Heading size="md" color="gray.500" mb={2}>
                                No deliveries found
                            </Heading>
                            <Text color="gray.400">
                                {statusFilter === 'ALL'
                                    ? 'Create a delivery to get started'
                                    : `No deliveries with status "${statusFilter}"`}
                            </Text>
                            {collectedDonations.length > 0 && statusFilter === 'ALL' && (
                                <Button
                                    mt={4}
                                    colorScheme="teal"
                                    leftIcon={<FiPlus />}
                                    onClick={onOpen}
                                >
                                    Create First Delivery
                                </Button>
                            )}
                        </Box>
                    )}
                </CardBody>
            </Card>

            {/* Create Delivery Modal */}
            <Modal isOpen={isOpen} onClose={onClose} size="lg">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Create New Delivery</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <VStack spacing={4}>
                            <FormControl isRequired>
                                <FormLabel>Select Donation</FormLabel>
                                <Select
                                    placeholder="Choose a donation"
                                    value={newDelivery.donationId}
                                    onChange={(e) => setNewDelivery({ ...newDelivery, donationId: e.target.value })}
                                >
                                    {collectedDonations.map((donation) => (
                                        <option key={donation.id} value={donation.id}>
                                            {donation.name || `Donation #${donation.id}`} - {donation.donor?.name || 'Unknown donor'}
                                        </option>
                                    ))}
                                </Select>
                            </FormControl>

                            <FormControl isRequired>
                                <FormLabel>Assign Driver</FormLabel>
                                <Select
                                    placeholder="Choose a driver"
                                    value={newDelivery.driverId}
                                    onChange={(e) => setNewDelivery({ ...newDelivery, driverId: e.target.value })}
                                >
                                    {availableDrivers.map((driver) => (
                                        <option key={driver.id} value={driver.id}>
                                            {driver.name} - {driver.vehicleType || 'Vehicle'} ({driver.phone})
                                        </option>
                                    ))}
                                </Select>
                                {availableDrivers.length === 0 && (
                                    <Text fontSize="sm" color="red.500" mt={1}>
                                        No drivers available. Ask drivers to set their availability.
                                    </Text>
                                )}
                            </FormControl>

                            <FormControl isRequired>
                                <FormLabel>Select Recipient</FormLabel>
                                <Select
                                    placeholder="Choose a recipient"
                                    value={newDelivery.recipientId}
                                    onChange={(e) => setNewDelivery({ ...newDelivery, recipientId: e.target.value })}
                                >
                                    {activeRecipients.map((recipient) => (
                                        <option key={recipient.id} value={recipient.id}>
                                            {recipient.name} ({recipient.type}) - {recipient.address}
                                        </option>
                                    ))}
                                </Select>
                                {activeRecipients.length === 0 && (
                                    <Text fontSize="sm" color="red.500" mt={1}>
                                        No recipients available. Add recipients first.
                                    </Text>
                                )}
                            </FormControl>

                            <FormControl>
                                <FormLabel>Scheduled Pickup Time</FormLabel>
                                <Input
                                    type="datetime-local"
                                    value={newDelivery.scheduledPickupTime}
                                    onChange={(e) => setNewDelivery({ ...newDelivery, scheduledPickupTime: e.target.value })}
                                />
                            </FormControl>

                            <FormControl>
                                <FormLabel>Notes</FormLabel>
                                <Textarea
                                    placeholder="Any special instructions..."
                                    value={newDelivery.notes}
                                    onChange={(e) => setNewDelivery({ ...newDelivery, notes: e.target.value })}
                                />
                            </FormControl>
                        </VStack>
                    </ModalBody>

                    <ModalFooter>
                        <Button variant="ghost" mr={3} onClick={onClose}>
                            Cancel
                        </Button>
                        <Button
                            colorScheme="teal"
                            onClick={handleCreateDelivery}
                            isLoading={createLoading}
                            isDisabled={!newDelivery.donationId || !newDelivery.driverId || !newDelivery.recipientId}
                        >
                            Create Delivery
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </VStack>
    );
};

export default StaffDeliveries;
