import { useState } from 'react';
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
} from '@chakra-ui/react';
import { FiPlus, FiTrash2, FiArrowLeft } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { donationAPI, donorAPI, donationItemAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const NewDonation = () => {
    const navigate = useNavigate();
    const toast = useToast();
    const { user } = useAuth();
    const cardBg = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.700');

    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
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
            id: items.length + 1,
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
                isClosable: true,
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
                isClosable: true,
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
                isClosable: true,
            });
            setLoading(false);
            return;
        }

        try {
            // Step 1: Get or create donor
            const donorsResponse = await donorAPI.getAll();
            let donor = donorsResponse.data.find(d => d.user?.username === user.username);

            if (!donor) {
                // Create donor if doesn't exist
                const donorData = {
                    name: user.username,
                    contact: 'N/A',
                    location: 'N/A',
                    user: {
                        username: user.username,
                    }
                };
                const createDonorResponse = await donorAPI.create(donorData);
                donor = createDonorResponse.data;
            }

            // Step 2: Create donation
            const donationData = {
                name: formData.name,
                status: 'PENDING',
            };

            const donationResponse = await donationAPI.create(donor.id, donationData);
            const createdDonation = donationResponse.data;

            // Step 3: Create donation items
            // Note: You might need to add an endpoint to create items or include them in donation creation
            // For now, we'll just create the donation

            toast({
                title: 'Donation Created',
                description: 'Your donation has been submitted successfully',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });

            navigate('/donations');
        } catch (error) {
            console.error('Error creating donation:', error);
            toast({
                title: 'Error',
                description: error.response?.data?.message || 'Failed to create donation',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setLoading(false);
        }
    };

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
                    >
                        Create Donation
                    </Button>
                </HStack>
            </form>
        </VStack>
    );
};

export default NewDonation;