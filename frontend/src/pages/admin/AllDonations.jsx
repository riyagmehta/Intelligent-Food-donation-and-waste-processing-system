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
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    useColorModeValue,
    Flex,
    Input,
    Select,
    IconButton,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    useToast,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    Spinner,
    Center,
} from '@chakra-ui/react';
import { FiMoreVertical, FiEye, FiCheckCircle, FiTruck, FiXCircle } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { donationAPI, centerAPI } from '../../services/api';

const AllDonations = () => {
    const navigate = useNavigate();
    const cardBg = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.700');
    const toast = useToast();
    const { isOpen, onOpen, onClose } = useDisclosure();

    const [donations, setDonations] = useState([]);
    const [centers, setCenters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [selectedDonation, setSelectedDonation] = useState(null);
    const [selectedCenterId, setSelectedCenterId] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [donationsRes, centersRes] = await Promise.all([
                donationAPI.getAll(),
                centerAPI.getAll(),
            ]);
            setDonations(donationsRes.data);
            setCenters(centersRes.data);
        } catch (error) {
            console.error('Error fetching data:', error);
            toast({
                title: 'Error',
                description: 'Failed to load donations',
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

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString();
    };

    const filteredDonations = donations.filter((donation) => {
        const donationName = donation.name || '';
        const donorName = donation.donor?.name || '';
        const matchesSearch =
            donationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            donorName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'ALL' || donation.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const handleAssignCenter = (donation) => {
        setSelectedDonation(donation);
        setSelectedCenterId('');
        onOpen();
    };

    const confirmAssign = async () => {
        if (!selectedCenterId) {
            toast({
                title: 'Please select a center',
                status: 'warning',
                duration: 2000,
            });
            return;
        }

        setActionLoading(true);
        try {
            await centerAPI.assignDonation(selectedCenterId, selectedDonation.id);
            toast({
                title: 'Donation Assigned',
                description: 'Donation has been assigned to the center',
                status: 'success',
                duration: 3000,
            });
            onClose();
            await fetchData(); // Refresh data
        } catch (error) {
            console.error('Error assigning donation:', error);
            toast({
                title: 'Error',
                description: error.response?.data?.message || 'Failed to assign donation',
                status: 'error',
                duration: 3000,
            });
        } finally {
            setActionLoading(false);
        }
    };

    const handleUpdateStatus = async (id, newStatus) => {
        setActionLoading(true);
        try {
            await donationAPI.updateStatus(id, newStatus);
            toast({
                title: 'Status Updated',
                description: `Donation status changed to ${newStatus}`,
                status: 'success',
                duration: 3000,
            });
            await fetchData(); // Refresh data
        } catch (error) {
            console.error('Error updating status:', error);
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

    const handleAccept = async (id) => {
        setActionLoading(true);
        try {
            await donationAPI.accept(id);
            toast({
                title: 'Donation Accepted',
                description: 'Donation has been accepted and marked as collected',
                status: 'success',
                duration: 3000,
            });
            await fetchData();
        } catch (error) {
            console.error('Error accepting donation:', error);
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

    const handleReject = async (id) => {
        setActionLoading(true);
        try {
            await donationAPI.reject(id);
            toast({
                title: 'Donation Rejected',
                description: 'Donation has been rejected',
                status: 'info',
                duration: 3000,
            });
            await fetchData();
        } catch (error) {
            console.error('Error rejecting donation:', error);
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

    const stats = {
        total: donations.length,
        pending: donations.filter(d => d.status === 'PENDING').length,
        collected: donations.filter(d => d.status === 'COLLECTED').length,
        delivered: donations.filter(d => d.status === 'DELIVERED').length,
        rejected: donations.filter(d => d.status === 'REJECTED').length,
    };

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
                    All Donations
                </Heading>
                <Text color="gray.600">Manage and track all donation requests</Text>
            </Box>

            {/* Filters */}
            <Card bg={cardBg} border="1px" borderColor={borderColor} boxShadow="sm">
                <CardBody>
                    <Flex gap={4} flexWrap="wrap">
                        <Box flex={{ base: '1 1 100%', md: '1 1 auto' }}>
                            <Input
                                placeholder="Search by name or donor..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                size="md"
                            />
                        </Box>
                        <Select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            maxW={{ base: 'full', md: '200px' }}
                            size="md"
                        >
                            <option value="ALL">All Status</option>
                            <option value="PENDING">Pending</option>
                            <option value="COLLECTED">Collected</option>
                            <option value="DELIVERED">Delivered</option>
                            <option value="REJECTED">Rejected</option>
                            <option value="PROCESSED">Processed</option>
                        </Select>
                    </Flex>
                </CardBody>
            </Card>

            {/* Statistics */}
            <Flex gap={4} flexWrap="wrap">
                <Card bg={cardBg} border="1px" borderColor={borderColor} flex="1" minW="120px">
                    <CardBody py={3}>
                        <Text fontSize="sm" color="gray.600">Total</Text>
                        <Text fontSize="2xl" fontWeight="bold">{stats.total}</Text>
                    </CardBody>
                </Card>
                <Card bg={cardBg} border="1px" borderColor={borderColor} flex="1" minW="120px">
                    <CardBody py={3}>
                        <Text fontSize="sm" color="gray.600">Pending</Text>
                        <Text fontSize="2xl" fontWeight="bold" color="yellow.500">{stats.pending}</Text>
                    </CardBody>
                </Card>
                <Card bg={cardBg} border="1px" borderColor={borderColor} flex="1" minW="120px">
                    <CardBody py={3}>
                        <Text fontSize="sm" color="gray.600">Collected</Text>
                        <Text fontSize="2xl" fontWeight="bold" color="blue.500">{stats.collected}</Text>
                    </CardBody>
                </Card>
                <Card bg={cardBg} border="1px" borderColor={borderColor} flex="1" minW="120px">
                    <CardBody py={3}>
                        <Text fontSize="sm" color="gray.600">Delivered</Text>
                        <Text fontSize="2xl" fontWeight="bold" color="green.500">{stats.delivered}</Text>
                    </CardBody>
                </Card>
                <Card bg={cardBg} border="1px" borderColor={borderColor} flex="1" minW="120px">
                    <CardBody py={3}>
                        <Text fontSize="sm" color="gray.600">Rejected</Text>
                        <Text fontSize="2xl" fontWeight="bold" color="red.500">{stats.rejected}</Text>
                    </CardBody>
                </Card>
            </Flex>

            {/* Donations Table */}
            <Card bg={cardBg} border="1px" borderColor={borderColor} boxShadow="sm">
                <CardBody>
                    <Box overflowX="auto">
                        <Table variant="simple">
                            <Thead>
                                <Tr>
                                    <Th>Donor</Th>
                                    <Th>Donation Name</Th>
                                    <Th>Date</Th>
                                    <Th>Center</Th>
                                    <Th>Status</Th>
                                    <Th>Actions</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {filteredDonations.length > 0 ? (
                                    filteredDonations.map((donation) => (
                                        <Tr key={donation.id}>
                                            <Td fontWeight="medium">{donation.donor?.name || 'Unknown'}</Td>
                                            <Td>{donation.name || 'Unnamed'}</Td>
                                            <Td color="gray.600">{formatDate(donation.donationDate)}</Td>
                                            <Td color="gray.600">{donation.collectionCenter?.name || '-'}</Td>
                                            <Td>
                                                <Badge colorScheme={getStatusColor(donation.status)} fontSize="xs">
                                                    {donation.status}
                                                </Badge>
                                            </Td>
                                            <Td>
                                                <Menu>
                                                    <MenuButton
                                                        as={IconButton}
                                                        icon={<FiMoreVertical />}
                                                        variant="ghost"
                                                        size="sm"
                                                        isDisabled={actionLoading}
                                                    />
                                                    <MenuList>
                                                        <MenuItem
                                                            icon={<FiEye />}
                                                            onClick={() => navigate(`/donations/${donation.id}`)}
                                                        >
                                                            View Details
                                                        </MenuItem>
                                                        {donation.status === 'PENDING' && (
                                                            <>
                                                                <MenuItem
                                                                    icon={<FiTruck />}
                                                                    onClick={() => handleAssignCenter(donation)}
                                                                >
                                                                    Assign to Center
                                                                </MenuItem>
                                                                <MenuItem
                                                                    icon={<FiCheckCircle />}
                                                                    color="green.500"
                                                                    onClick={() => handleAccept(donation.id)}
                                                                >
                                                                    Accept (Collect)
                                                                </MenuItem>
                                                                <MenuItem
                                                                    icon={<FiXCircle />}
                                                                    color="red.500"
                                                                    onClick={() => handleReject(donation.id)}
                                                                >
                                                                    Reject
                                                                </MenuItem>
                                                            </>
                                                        )}
                                                        {donation.status === 'COLLECTED' && (
                                                            <MenuItem
                                                                icon={<FiCheckCircle />}
                                                                onClick={() => handleUpdateStatus(donation.id, 'DELIVERED')}
                                                            >
                                                                Mark as Delivered
                                                            </MenuItem>
                                                        )}
                                                        {donation.status === 'DELIVERED' && (
                                                            <MenuItem
                                                                icon={<FiCheckCircle />}
                                                                onClick={() => handleUpdateStatus(donation.id, 'PROCESSED')}
                                                            >
                                                                Mark as Processed
                                                            </MenuItem>
                                                        )}
                                                    </MenuList>
                                                </Menu>
                                            </Td>
                                        </Tr>
                                    ))
                                ) : (
                                    <Tr>
                                        <Td colSpan={6} textAlign="center" py={8}>
                                            <Text color="gray.500">No donations found</Text>
                                        </Td>
                                    </Tr>
                                )}
                            </Tbody>
                        </Table>
                    </Box>
                </CardBody>
            </Card>

            {/* Assign Center Modal */}
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Assign to Collection Center</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <VStack spacing={4} align="stretch">
                            <Text fontSize="sm" color="gray.600">
                                Donation: <strong>{selectedDonation?.name || 'Unnamed'}</strong>
                            </Text>
                            <Text fontSize="sm" color="gray.600">
                                Donor: <strong>{selectedDonation?.donor?.name || 'Unknown'}</strong>
                            </Text>
                            <Select
                                placeholder="Select a center"
                                value={selectedCenterId}
                                onChange={(e) => setSelectedCenterId(e.target.value)}
                            >
                                {centers.map((center) => (
                                    <option key={center.id} value={center.id}>
                                        {center.name} - {center.location}
                                    </option>
                                ))}
                            </Select>
                        </VStack>
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="ghost" mr={3} onClick={onClose}>
                            Cancel
                        </Button>
                        <Button
                            colorScheme="teal"
                            onClick={confirmAssign}
                            isLoading={actionLoading}
                        >
                            Assign
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </VStack>
    );
};

export default AllDonations;
