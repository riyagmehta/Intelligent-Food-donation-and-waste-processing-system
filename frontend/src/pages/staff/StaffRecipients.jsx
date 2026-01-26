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
    IconButton,
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogOverlay,
} from '@chakra-ui/react';
import {
    FiPlus,
    FiMapPin,
    FiPhone,
    FiMail,
    FiUser,
    FiEdit2,
    FiTrash2,
} from 'react-icons/fi';
import { recipientAPI } from '../../services/api';
import { useRef } from 'react';

const RECIPIENT_TYPES = [
    'SHELTER',
    'FOOD_BANK',
    'COMMUNITY_CENTER',
    'NGO',
    'ORPHANAGE',
    'OLD_AGE_HOME',
    'OTHER',
];

const StaffRecipients = () => {
    const toast = useToast();
    const cardBg = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.700');

    const [recipients, setRecipients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [typeFilter, setTypeFilter] = useState('ALL');

    // Create/Edit Modal
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        id: null,
        name: '',
        type: 'SHELTER',
        address: '',
        contactPerson: '',
        phone: '',
        email: '',
    });

    // Delete dialog
    const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
    const [deleteRecipient, setDeleteRecipient] = useState(null);
    const cancelRef = useRef();

    useEffect(() => {
        fetchRecipients();
    }, []);

    const fetchRecipients = async () => {
        try {
            setLoading(true);
            const response = await recipientAPI.getAll();
            setRecipients(response.data);
        } catch (error) {
            console.error('Error fetching recipients:', error);
            toast({
                title: 'Error',
                description: 'Failed to load recipients',
                status: 'error',
                duration: 3000,
            });
        } finally {
            setLoading(false);
        }
    };

    const handleOpenCreate = () => {
        setIsEditing(false);
        setFormData({
            id: null,
            name: '',
            type: 'SHELTER',
            address: '',
            contactPerson: '',
            phone: '',
            email: '',
        });
        onOpen();
    };

    const handleOpenEdit = (recipient) => {
        setIsEditing(true);
        setFormData({
            id: recipient.id,
            name: recipient.name,
            type: recipient.type,
            address: recipient.address,
            contactPerson: recipient.contactPerson || '',
            phone: recipient.phone || '',
            email: recipient.email || '',
        });
        onOpen();
    };

    const handleSubmit = async () => {
        if (!formData.name || !formData.type || !formData.address) {
            toast({
                title: 'Missing Information',
                description: 'Name, type, and address are required',
                status: 'warning',
                duration: 3000,
            });
            return;
        }

        setSubmitLoading(true);
        try {
            if (isEditing) {
                await recipientAPI.update(formData.id, formData);
                toast({
                    title: 'Recipient Updated',
                    status: 'success',
                    duration: 2000,
                });
            } else {
                await recipientAPI.create(formData);
                toast({
                    title: 'Recipient Created',
                    status: 'success',
                    duration: 2000,
                });
            }

            onClose();
            await fetchRecipients();
        } catch (error) {
            console.error('Error saving recipient:', error);
            toast({
                title: 'Error',
                description: error.response?.data?.message || 'Failed to save recipient',
                status: 'error',
                duration: 3000,
            });
        } finally {
            setSubmitLoading(false);
        }
    };

    const handleOpenDelete = (recipient) => {
        setDeleteRecipient(recipient);
        onDeleteOpen();
    };

    const handleDelete = async () => {
        if (!deleteRecipient) return;

        try {
            await recipientAPI.delete(deleteRecipient.id);
            toast({
                title: 'Recipient Deactivated',
                status: 'success',
                duration: 2000,
            });
            onDeleteClose();
            await fetchRecipients();
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to delete recipient',
                status: 'error',
                duration: 3000,
            });
        }
    };

    const getTypeColor = (type) => {
        const colors = {
            SHELTER: 'blue',
            FOOD_BANK: 'green',
            COMMUNITY_CENTER: 'purple',
            NGO: 'orange',
            ORPHANAGE: 'pink',
            OLD_AGE_HOME: 'cyan',
            OTHER: 'gray',
        };
        return colors[type] || 'gray';
    };

    const formatType = (type) => {
        return type.replace(/_/g, ' ');
    };

    const filteredRecipients = typeFilter === 'ALL'
        ? recipients
        : recipients.filter(r => r.type === typeFilter);

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
                        Recipients
                    </Heading>
                    <Text color="gray.600">
                        Manage food donation recipients
                    </Text>
                </Box>
                <HStack spacing={4}>
                    <Select
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                        w="200px"
                    >
                        <option value="ALL">All Types</option>
                        {RECIPIENT_TYPES.map((type) => (
                            <option key={type} value={type}>
                                {formatType(type)}
                            </option>
                        ))}
                    </Select>
                    <Button
                        colorScheme="teal"
                        leftIcon={<FiPlus />}
                        onClick={handleOpenCreate}
                    >
                        Add Recipient
                    </Button>
                </HStack>
            </Flex>

            {/* Recipients Table */}
            <Card bg={cardBg} border="1px" borderColor={borderColor} boxShadow="sm">
                <CardBody>
                    {filteredRecipients.length > 0 ? (
                        <Box overflowX="auto">
                            <Table variant="simple">
                                <Thead>
                                    <Tr>
                                        <Th>Name</Th>
                                        <Th>Type</Th>
                                        <Th>Address</Th>
                                        <Th>Contact</Th>
                                        <Th>Status</Th>
                                        <Th>Actions</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {filteredRecipients.map((recipient) => (
                                        <Tr key={recipient.id} opacity={recipient.isActive ? 1 : 0.6}>
                                            <Td>
                                                <Text fontWeight="medium">{recipient.name}</Text>
                                            </Td>
                                            <Td>
                                                <Badge colorScheme={getTypeColor(recipient.type)}>
                                                    {formatType(recipient.type)}
                                                </Badge>
                                            </Td>
                                            <Td>
                                                <HStack>
                                                    <Icon as={FiMapPin} color="gray.500" boxSize={3} />
                                                    <Text fontSize="sm">{recipient.address}</Text>
                                                </HStack>
                                            </Td>
                                            <Td>
                                                <VStack align="start" spacing={0}>
                                                    {recipient.contactPerson && (
                                                        <HStack>
                                                            <Icon as={FiUser} color="gray.500" boxSize={3} />
                                                            <Text fontSize="sm">{recipient.contactPerson}</Text>
                                                        </HStack>
                                                    )}
                                                    {recipient.phone && (
                                                        <HStack>
                                                            <Icon as={FiPhone} color="gray.500" boxSize={3} />
                                                            <Text fontSize="sm">{recipient.phone}</Text>
                                                        </HStack>
                                                    )}
                                                    {recipient.email && (
                                                        <HStack>
                                                            <Icon as={FiMail} color="gray.500" boxSize={3} />
                                                            <Text fontSize="sm">{recipient.email}</Text>
                                                        </HStack>
                                                    )}
                                                </VStack>
                                            </Td>
                                            <Td>
                                                <Badge colorScheme={recipient.isActive ? 'green' : 'gray'}>
                                                    {recipient.isActive ? 'Active' : 'Inactive'}
                                                </Badge>
                                            </Td>
                                            <Td>
                                                <HStack spacing={2}>
                                                    <IconButton
                                                        aria-label="Edit"
                                                        icon={<FiEdit2 />}
                                                        size="sm"
                                                        variant="ghost"
                                                        colorScheme="blue"
                                                        onClick={() => handleOpenEdit(recipient)}
                                                    />
                                                    {recipient.isActive && (
                                                        <IconButton
                                                            aria-label="Delete"
                                                            icon={<FiTrash2 />}
                                                            size="sm"
                                                            variant="ghost"
                                                            colorScheme="red"
                                                            onClick={() => handleOpenDelete(recipient)}
                                                        />
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
                            <Icon as={FiMapPin} boxSize={16} color="gray.300" mb={4} />
                            <Heading size="md" color="gray.500" mb={2}>
                                No recipients found
                            </Heading>
                            <Text color="gray.400">
                                {typeFilter === 'ALL'
                                    ? 'Add recipients to start assigning deliveries'
                                    : `No recipients of type "${formatType(typeFilter)}"`}
                            </Text>
                            {typeFilter === 'ALL' && (
                                <Button
                                    mt={4}
                                    colorScheme="teal"
                                    leftIcon={<FiPlus />}
                                    onClick={handleOpenCreate}
                                >
                                    Add First Recipient
                                </Button>
                            )}
                        </Box>
                    )}
                </CardBody>
            </Card>

            {/* Create/Edit Modal */}
            <Modal isOpen={isOpen} onClose={onClose} size="lg">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>{isEditing ? 'Edit Recipient' : 'Add New Recipient'}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <VStack spacing={4}>
                            <FormControl isRequired>
                                <FormLabel>Name</FormLabel>
                                <Input
                                    placeholder="Organization name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </FormControl>

                            <FormControl isRequired>
                                <FormLabel>Type</FormLabel>
                                <Select
                                    value={formData.type}
                                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                >
                                    {RECIPIENT_TYPES.map((type) => (
                                        <option key={type} value={type}>
                                            {formatType(type)}
                                        </option>
                                    ))}
                                </Select>
                            </FormControl>

                            <FormControl isRequired>
                                <FormLabel>Address</FormLabel>
                                <Textarea
                                    placeholder="Full address"
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                />
                            </FormControl>

                            <FormControl>
                                <FormLabel>Contact Person</FormLabel>
                                <Input
                                    placeholder="Name of contact person"
                                    value={formData.contactPerson}
                                    onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                                />
                            </FormControl>

                            <FormControl>
                                <FormLabel>Phone</FormLabel>
                                <Input
                                    placeholder="Phone number"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                />
                            </FormControl>

                            <FormControl>
                                <FormLabel>Email</FormLabel>
                                <Input
                                    type="email"
                                    placeholder="Email address"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                            onClick={handleSubmit}
                            isLoading={submitLoading}
                            isDisabled={!formData.name || !formData.type || !formData.address}
                        >
                            {isEditing ? 'Update' : 'Create'}
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            {/* Delete Confirmation Dialog */}
            <AlertDialog
                isOpen={isDeleteOpen}
                leastDestructiveRef={cancelRef}
                onClose={onDeleteClose}
            >
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize="lg" fontWeight="bold">
                            Deactivate Recipient
                        </AlertDialogHeader>

                        <AlertDialogBody>
                            Are you sure you want to deactivate "{deleteRecipient?.name}"?
                            They will no longer be available for new deliveries.
                        </AlertDialogBody>

                        <AlertDialogFooter>
                            <Button ref={cancelRef} onClick={onDeleteClose}>
                                Cancel
                            </Button>
                            <Button colorScheme="red" onClick={handleDelete} ml={3}>
                                Deactivate
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </VStack>
    );
};

export default StaffRecipients;
