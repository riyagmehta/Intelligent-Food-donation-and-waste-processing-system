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
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogOverlay,
    useDisclosure,
} from '@chakra-ui/react';
import {
    FiTruck,
    FiMapPin,
    FiPhone,
    FiPackage,
    FiCheckCircle,
    FiPlay,
    FiX,
} from 'react-icons/fi';
import { deliveryAPI } from '../../services/api';
import { useRef } from 'react';

const DriverDeliveries = () => {
    const toast = useToast();
    const cardBg = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.700');

    const [deliveries, setDeliveries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);
    const [statusFilter, setStatusFilter] = useState('ALL');

    // Alert dialog state
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [selectedDelivery, setSelectedDelivery] = useState(null);
    const [actionType, setActionType] = useState(null);
    const cancelRef = useRef();

    useEffect(() => {
        fetchDeliveries();
    }, []);

    const fetchDeliveries = async () => {
        try {
            setLoading(true);
            const response = await deliveryAPI.getMyDeliveries();
            setDeliveries(response.data);
        } catch (error) {
            console.error('Error fetching deliveries:', error);
            toast({
                title: 'Error',
                description: 'Failed to load deliveries',
                status: 'error',
                duration: 3000,
            });
        } finally {
            setLoading(false);
        }
    };

    const handleAction = (delivery, action) => {
        setSelectedDelivery(delivery);
        setActionType(action);
        onOpen();
    };

    const confirmAction = async () => {
        if (!selectedDelivery || !actionType) return;

        setActionLoading(selectedDelivery.id);
        try {
            let message = '';
            switch (actionType) {
                case 'pickup':
                    await deliveryAPI.pickup(selectedDelivery.id);
                    message = 'Delivery picked up successfully';
                    break;
                case 'transit':
                    await deliveryAPI.markInTransit(selectedDelivery.id);
                    message = 'Marked as in transit';
                    break;
                case 'complete':
                    await deliveryAPI.complete(selectedDelivery.id);
                    message = 'Delivery completed successfully';
                    break;
                case 'cancel':
                    await deliveryAPI.cancel(selectedDelivery.id);
                    message = 'Delivery cancelled';
                    break;
                default:
                    break;
            }

            toast({
                title: 'Success',
                description: message,
                status: 'success',
                duration: 3000,
            });

            await fetchDeliveries();
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
            setSelectedDelivery(null);
            setActionType(null);
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

    const getActionButtons = (delivery) => {
        const buttons = [];

        switch (delivery.status) {
            case 'ASSIGNED':
                buttons.push(
                    <Button
                        key="pickup"
                        size="sm"
                        colorScheme="blue"
                        leftIcon={<FiPackage />}
                        onClick={() => handleAction(delivery, 'pickup')}
                        isLoading={actionLoading === delivery.id}
                    >
                        Pick Up
                    </Button>
                );
                buttons.push(
                    <Button
                        key="cancel"
                        size="sm"
                        colorScheme="red"
                        variant="outline"
                        leftIcon={<FiX />}
                        onClick={() => handleAction(delivery, 'cancel')}
                        isLoading={actionLoading === delivery.id}
                    >
                        Cancel
                    </Button>
                );
                break;
            case 'PICKED_UP':
                buttons.push(
                    <Button
                        key="transit"
                        size="sm"
                        colorScheme="purple"
                        leftIcon={<FiTruck />}
                        onClick={() => handleAction(delivery, 'transit')}
                        isLoading={actionLoading === delivery.id}
                    >
                        Start Delivery
                    </Button>
                );
                break;
            case 'IN_TRANSIT':
                buttons.push(
                    <Button
                        key="complete"
                        size="sm"
                        colorScheme="green"
                        leftIcon={<FiCheckCircle />}
                        onClick={() => handleAction(delivery, 'complete')}
                        isLoading={actionLoading === delivery.id}
                    >
                        Complete
                    </Button>
                );
                break;
            default:
                break;
        }

        return buttons;
    };

    const getActionDialogContent = () => {
        const actions = {
            pickup: {
                title: 'Pick Up Delivery',
                message: `Are you sure you want to pick up the delivery for "${selectedDelivery?.donationName}"?`,
                buttonText: 'Pick Up',
                buttonColor: 'blue',
            },
            transit: {
                title: 'Start Delivery',
                message: `Are you sure you want to start the delivery for "${selectedDelivery?.donationName}"?`,
                buttonText: 'Start',
                buttonColor: 'purple',
            },
            complete: {
                title: 'Complete Delivery',
                message: `Are you sure you want to mark the delivery for "${selectedDelivery?.donationName}" as completed?`,
                buttonText: 'Complete',
                buttonColor: 'green',
            },
            cancel: {
                title: 'Cancel Delivery',
                message: `Are you sure you want to cancel the delivery for "${selectedDelivery?.donationName}"? This action cannot be undone.`,
                buttonText: 'Cancel Delivery',
                buttonColor: 'red',
            },
        };
        return actions[actionType] || {};
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
                        My Deliveries
                    </Heading>
                    <Text color="gray.600">
                        Manage your assigned deliveries
                    </Text>
                </Box>
                <HStack>
                    <Select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        w="200px"
                    >
                        <option value="ALL">All Statuses</option>
                        <option value="ASSIGNED">Assigned</option>
                        <option value="PICKED_UP">Picked Up</option>
                        <option value="IN_TRANSIT">In Transit</option>
                        <option value="DELIVERED">Delivered</option>
                        <option value="CANCELLED">Cancelled</option>
                    </Select>
                </HStack>
            </Flex>

            {/* Deliveries List */}
            <Card bg={cardBg} border="1px" borderColor={borderColor} boxShadow="sm">
                <CardBody>
                    {filteredDeliveries.length > 0 ? (
                        <Box overflowX="auto">
                            <Table variant="simple">
                                <Thead>
                                    <Tr>
                                        <Th>Donation</Th>
                                        <Th>From Center</Th>
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
                                                    <HStack>
                                                        <Icon as={FiMapPin} color="gray.500" boxSize={3} />
                                                        <Text fontSize="sm">{delivery.fromCenterName}</Text>
                                                    </HStack>
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
                                                    {getActionButtons(delivery)}
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
                                    ? 'You have no deliveries assigned yet'
                                    : `No deliveries with status "${statusFilter}"`}
                            </Text>
                        </Box>
                    )}
                </CardBody>
            </Card>

            {/* Confirmation Dialog */}
            <AlertDialog
                isOpen={isOpen}
                leastDestructiveRef={cancelRef}
                onClose={onClose}
            >
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize="lg" fontWeight="bold">
                            {getActionDialogContent().title}
                        </AlertDialogHeader>

                        <AlertDialogBody>
                            {getActionDialogContent().message}
                        </AlertDialogBody>

                        <AlertDialogFooter>
                            <Button ref={cancelRef} onClick={onClose}>
                                Cancel
                            </Button>
                            <Button
                                colorScheme={getActionDialogContent().buttonColor}
                                onClick={confirmAction}
                                ml={3}
                                isLoading={actionLoading === selectedDelivery?.id}
                            >
                                {getActionDialogContent().buttonText}
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </VStack>
    );
};

export default DriverDeliveries;
