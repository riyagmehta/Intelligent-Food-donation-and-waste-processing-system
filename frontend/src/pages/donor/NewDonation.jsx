import { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Heading,
    Text,
    VStack,
    HStack,
    Card,
    CardBody,
    FormControl,
    FormLabel,
    Input,
    Select,
    Textarea,
    useColorModeValue,
    useToast,
    IconButton,
    Grid,
    GridItem,
    Divider,
    Spinner,
    Center,
    Alert,
    AlertIcon,
} from '@chakra-ui/react';
import { FiPlus, FiTrash2, FiArrowLeft } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { donationAPI, centerAPI, donationItemAPI } from '../../services/api';

const NewDonation = () => {
    const navigate = useNavigate();
    const toast = useToast();
    const cardBg = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.700');

    const [loading, setLoading] = useState(false);
    const [centersLoading, setCentersLoading] = useState(true);
    const [centers, setCenters] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        collectionCenterId: '',
    });

    const [items, setItems] = useState([
        {
            id: 1,
            name: '',
            quantity: '',
            unit: 'KG',
            type: 'FOOD',
        },
    ]);

    useEffect(() => {
        fetchCenters();
    }, []);

    const fetchCenters = async () => {
        try {
            setCentersLoading(true);
            const response = await centerAPI.getAll();
            setCenters(response.data);
        } catch (error) {
            console.error('Error fetching centers:', error);
            toast({
                title: 'Error',
                description: 'Failed to load collection centers',
                status: 'error',
                duration: 3000,
            });
        } finally {
            setCentersLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleItemChange = (id, field, value) => {
        setItems(
            items.map((item) =>
                item.id === id ? { ...item, [field]: value } : item
            )
        );
    };

    const addItem = () => {
        const newItem = {
            id: Date.now(), // Use timestamp for unique ID
            name: '',
            quantity: '',
            unit: 'KG',
            type: 'FOOD',
        };
        setItems([...items, newItem]);
    };

    const removeItem = (id) => {
        if (items.length > 1) {
            setItems(items.filter((item) => item.id !== id));
        } else {
            toast({
                title: 'Cannot remove',
                description: 'At least one item is required',
                status: 'warning',
                duration: 2000,
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Validate
        if (!formData.name.trim()) {
            toast({
                title: 'Validation Error',
                description: 'Please enter a donation name',
                status: 'error',
                duration: 3000,
            });
            setLoading(false);
            return;
        }

        if (!formData.collectionCenterId) {
            toast({
                title: 'Validation Error',
                description: 'Please select a collection center',
                status: 'error',
                duration: 3000,
            });
            setLoading(false);
            return;
        }

        const hasEmptyItem = items.some(
            (item) => !item.name.trim() || !item.quantity
        );
        if (hasEmptyItem) {
            toast({
                title: 'Validation Error',
                description: 'Please fill in all item details',
                status: 'error',
                duration: 3000,
            });
            setLoading(false);
            return;
        }

        try {
            // Step 1: Create donation using the new /my endpoint
            const donationData = {
                name: formData.name,
                collectionCenterId: parseInt(formData.collectionCenterId),
            };

            const donationResponse = await donationAPI.createMyDonation(donationData);
            const createdDonation = donationResponse.data;

            // Step 2: Create donation items
            const itemPromises = items.map(item =>
                donationItemAPI.create({
                    itemName: item.name,
                    quantity: parseInt(item.quantity),
                    unit: item.unit,
                    type: item.type,
                    donationId: createdDonation.id,
                    collectionCenterId: parseInt(formData.collectionCenterId),
                })
            );

            await Promise.all(itemPromises);

            toast({
                title: 'Donation Created',
                description: 'Your donation has been submitted and is pending approval',
                status: 'success',
                duration: 3000,
            });

            navigate('/donations');
        } catch (error) {
            console.error('Error creating donation:', error);
            toast({
                title: 'Error',
                description: error.response?.data?.message || 'Failed to create donation. Make sure you have a donor profile.',
                status: 'error',
                duration: 5000,
            });
        } finally {
            setLoading(false);
        }
    };

    if (centersLoading) {
        return (
            <Center h="400px">
                <Spinner size="xl" color="teal.500" />
            </Center>
        );
    }

    return (
        <VStack spacing={6} align="stretch">
            {/* Header */}
            <HStack spacing={4}>
                <IconButton
                    icon={<FiArrowLeft />}
                    variant="ghost"
                    onClick={() => navigate('/donations')}
                    aria-label="Go back"
                />
                <Box>
                    <Heading size="lg">Create New Donation</Heading>
                    <Text color="gray.600">Fill in the details of your donation</Text>
                </Box>
            </HStack>

            {centers.length === 0 && (
                <Alert status="warning">
                    <AlertIcon />
                    No collection centers available. Please contact admin to add centers.
                </Alert>
            )}

            <form onSubmit={handleSubmit}>
                {/* Basic Information */}
                <Card bg={cardBg} border="1px" borderColor={borderColor} boxShadow="sm" mb={6}>
                    <CardBody>
                        <VStack spacing={4} align="stretch">
                            <Heading size="md" mb={2}>
                                Basic Information
                            </Heading>

                            <FormControl isRequired>
                                <FormLabel>Donation Name</FormLabel>
                                <Input
                                    name="name"
                                    placeholder="e.g., Fresh Vegetables, Canned Foods"
                                    value={formData.name}
                                    onChange={handleChange}
                                    size="lg"
                                />
                            </FormControl>

                            <FormControl isRequired>
                                <FormLabel>Collection Center</FormLabel>
                                <Select
                                    name="collectionCenterId"
                                    placeholder="Select a collection center"
                                    value={formData.collectionCenterId}
                                    onChange={handleChange}
                                    size="lg"
                                >
                                    {centers.map((center) => (
                                        <option key={center.id} value={center.id}>
                                            {center.name} - {center.location}
                                        </option>
                                    ))}
                                </Select>
                                <Text fontSize="sm" color="gray.500" mt={1}>
                                    Your donation will be sent to this center for approval
                                </Text>
                            </FormControl>

                            <FormControl>
                                <FormLabel>Description (Optional)</FormLabel>
                                <Textarea
                                    name="description"
                                    placeholder="Add any additional details about this donation..."
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows={3}
                                />
                            </FormControl>
                        </VStack>
                    </CardBody>
                </Card>

                {/* Donation Items */}
                <Card bg={cardBg} border="1px" borderColor={borderColor} boxShadow="sm" mb={6}>
                    <CardBody>
                        <HStack justify="space-between" mb={4}>
                            <Heading size="md">Donation Items</Heading>
                            <Button
                                leftIcon={<FiPlus />}
                                colorScheme="teal"
                                variant="outline"
                                size="sm"
                                onClick={addItem}
                            >
                                Add Item
                            </Button>
                        </HStack>

                        <VStack spacing={4} align="stretch">
                            {items.map((item, index) => (
                                <Box key={item.id}>
                                    {index > 0 && <Divider my={4} />}
                                    <Grid templateColumns={{ base: '1fr', md: 'repeat(12, 1fr)' }} gap={4}>
                                        <GridItem colSpan={{ base: 12, md: 5 }}>
                                            <FormControl isRequired>
                                                <FormLabel fontSize="sm">Item Name</FormLabel>
                                                <Input
                                                    placeholder="e.g., Rice, Apples, Milk"
                                                    value={item.name}
                                                    onChange={(e) =>
                                                        handleItemChange(item.id, 'name', e.target.value)
                                                    }
                                                />
                                            </FormControl>
                                        </GridItem>

                                        <GridItem colSpan={{ base: 6, md: 2 }}>
                                            <FormControl isRequired>
                                                <FormLabel fontSize="sm">Quantity</FormLabel>
                                                <Input
                                                    type="number"
                                                    placeholder="0"
                                                    min="1"
                                                    value={item.quantity}
                                                    onChange={(e) =>
                                                        handleItemChange(item.id, 'quantity', e.target.value)
                                                    }
                                                />
                                            </FormControl>
                                        </GridItem>

                                        <GridItem colSpan={{ base: 6, md: 2 }}>
                                            <FormControl isRequired>
                                                <FormLabel fontSize="sm">Unit</FormLabel>
                                                <Select
                                                    value={item.unit}
                                                    onChange={(e) =>
                                                        handleItemChange(item.id, 'unit', e.target.value)
                                                    }
                                                >
                                                    <option value="KG">KG</option>
                                                    <option value="LITERS">Liters</option>
                                                    <option value="PIECES">Pieces</option>
                                                    <option value="BOXES">Boxes</option>
                                                </Select>
                                            </FormControl>
                                        </GridItem>

                                        <GridItem colSpan={{ base: 10, md: 2 }}>
                                            <FormControl isRequired>
                                                <FormLabel fontSize="sm">Type</FormLabel>
                                                <Select
                                                    value={item.type}
                                                    onChange={(e) =>
                                                        handleItemChange(item.id, 'type', e.target.value)
                                                    }
                                                >
                                                    <option value="FOOD">Food</option>
                                                    <option value="GROCERY">Grocery</option>
                                                    <option value="HOUSEHOLD_SUPPLIES">Household</option>
                                                    <option value="OTHER">Other</option>
                                                </Select>
                                            </FormControl>
                                        </GridItem>

                                        <GridItem colSpan={{ base: 2, md: 1 }} display="flex" alignItems="flex-end">
                                            <IconButton
                                                icon={<FiTrash2 />}
                                                colorScheme="red"
                                                variant="ghost"
                                                onClick={() => removeItem(item.id)}
                                                aria-label="Remove item"
                                                isDisabled={items.length === 1}
                                            />
                                        </GridItem>
                                    </Grid>
                                </Box>
                            ))}
                        </VStack>
                    </CardBody>
                </Card>

                {/* Info Box */}
                <Alert status="info" mb={6} borderRadius="md">
                    <AlertIcon />
                    <Box>
                        <Text fontWeight="bold">What happens next?</Text>
                        <Text fontSize="sm">
                            After you submit, the collection center staff will review and either accept or reject your donation.
                            You can track the status in your donations list.
                        </Text>
                    </Box>
                </Alert>

                {/* Submit Buttons */}
                <HStack spacing={4} justify="flex-end">
                    <Button
                        variant="outline"
                        size="lg"
                        onClick={() => navigate('/donations')}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        colorScheme="teal"
                        size="lg"
                        isLoading={loading}
                        loadingText="Creating..."
                        isDisabled={centers.length === 0}
                    >
                        Create Donation
                    </Button>
                </HStack>
            </form>
        </VStack>
    );
};

export default NewDonation;
