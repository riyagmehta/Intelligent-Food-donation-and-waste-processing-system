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
    Icon,
    Badge,
    Flex,
    Progress,
} from '@chakra-ui/react';
import { FiPlus, FiTrash2, FiArrowLeft, FiPackage, FiMapPin, FiCheckCircle, FiInfo, FiSend } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { donationAPI, centerAPI, donationItemAPI } from '../../services/api';

const NewDonation = () => {
    const navigate = useNavigate();
    const toast = useToast();

    // Color mode values
    const cardBg = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.100', 'gray.700');
    const textColor = useColorModeValue('gray.600', 'gray.400');
    const headingColor = useColorModeValue('gray.800', 'white');
    const hoverBg = useColorModeValue('gray.50', 'gray.700');
    const gradientBg = useColorModeValue(
        'linear(to-br, brand.400, teal.400, blue.400)',
        'linear(to-br, brand.500, teal.500, blue.500)'
    );

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
            id: Date.now(),
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
            const donationData = {
                name: formData.name,
                collectionCenterId: parseInt(formData.collectionCenterId),
            };

            const donationResponse = await donationAPI.createMyDonation(donationData);
            const createdDonation = donationResponse.data;

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

    // Calculate completion progress
    const getCompletionProgress = () => {
        let completed = 0;
        if (formData.name.trim()) completed += 33;
        if (formData.collectionCenterId) completed += 33;
        if (items.every(item => item.name.trim() && item.quantity)) completed += 34;
        return completed;
    };

    if (centersLoading) {
        return (
            <Center h="400px">
                <VStack spacing={4}>
                    <Spinner size="xl" color="brand.500" thickness="4px" />
                    <Text color={textColor}>Loading collection centers...</Text>
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
                <Box h="4px" bgGradient={gradientBg} />
                <CardBody p={6}>
                    <Flex align="center" gap={4} flexWrap="wrap">
                        <IconButton
                            icon={<FiArrowLeft />}
                            variant="ghost"
                            onClick={() => navigate('/donations')}
                            aria-label="Go back"
                            borderRadius="xl"
                            size="lg"
                        />
                        <Box flex={1}>
                            <Badge colorScheme="brand" borderRadius="full" px={3} py={1} mb={2}>
                                NEW DONATION
                            </Badge>
                            <Heading size="lg" color={headingColor}>Create New Donation</Heading>
                            <Text color={textColor} mt={1}>Fill in the details of your donation</Text>
                        </Box>
                        <Box textAlign="right" display={{ base: 'none', md: 'block' }}>
                            <Text fontSize="sm" color={textColor} mb={1}>Completion</Text>
                            <HStack spacing={2}>
                                <Progress
                                    value={getCompletionProgress()}
                                    size="sm"
                                    w="100px"
                                    borderRadius="full"
                                    colorScheme="brand"
                                    bg={useColorModeValue('gray.100', 'gray.700')}
                                />
                                <Text fontWeight="bold" color={headingColor}>{getCompletionProgress()}%</Text>
                            </HStack>
                        </Box>
                    </Flex>
                </CardBody>
            </Card>

            {centers.length === 0 && (
                <Alert status="warning" borderRadius="xl">
                    <AlertIcon />
                    No collection centers available. Please contact admin to add centers.
                </Alert>
            )}

            <form onSubmit={handleSubmit}>
                {/* Basic Information */}
                <Card
                    bg={cardBg}
                    border="1px"
                    borderColor={borderColor}
                    borderRadius="2xl"
                    boxShadow={useColorModeValue('lg', 'dark-lg')}
                    mb={6}
                    overflow="hidden"
                >
                    <CardBody p={0}>
                        <Flex p={6} pb={4} align="center" gap={3}>
                            <Box
                                bgGradient={gradientBg}
                                p={3}
                                borderRadius="xl"
                            >
                                <Icon as={FiPackage} color="white" boxSize={5} />
                            </Box>
                            <Heading size="md" color={headingColor}>Basic Information</Heading>
                        </Flex>
                        <Divider borderColor={borderColor} />
                        <VStack spacing={5} align="stretch" p={6}>
                            <FormControl isRequired>
                                <FormLabel fontWeight="600" color={headingColor}>Donation Name</FormLabel>
                                <Input
                                    name="name"
                                    placeholder="e.g., Fresh Vegetables, Canned Foods"
                                    value={formData.name}
                                    onChange={handleChange}
                                    size="lg"
                                    borderRadius="xl"
                                    _focus={{ borderColor: 'brand.400', boxShadow: '0 0 0 1px var(--chakra-colors-brand-400)' }}
                                />
                            </FormControl>

                            <FormControl isRequired>
                                <FormLabel fontWeight="600" color={headingColor}>Collection Center</FormLabel>
                                <Select
                                    name="collectionCenterId"
                                    placeholder="Select a collection center"
                                    value={formData.collectionCenterId}
                                    onChange={handleChange}
                                    size="lg"
                                    borderRadius="xl"
                                    icon={<FiMapPin />}
                                >
                                    {centers.map((center) => (
                                        <option key={center.id} value={center.id}>
                                            {center.name} - {center.location}
                                        </option>
                                    ))}
                                </Select>
                                <Text fontSize="sm" color={textColor} mt={2}>
                                    Your donation will be sent to this center for approval
                                </Text>
                            </FormControl>

                            <FormControl>
                                <FormLabel fontWeight="600" color={headingColor}>Description (Optional)</FormLabel>
                                <Textarea
                                    name="description"
                                    placeholder="Add any additional details about this donation..."
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows={3}
                                    borderRadius="xl"
                                />
                            </FormControl>
                        </VStack>
                    </CardBody>
                </Card>

                {/* Donation Items */}
                <Card
                    bg={cardBg}
                    border="1px"
                    borderColor={borderColor}
                    borderRadius="2xl"
                    boxShadow={useColorModeValue('lg', 'dark-lg')}
                    mb={6}
                    overflow="hidden"
                >
                    <CardBody p={0}>
                        <Flex p={6} pb={4} justify="space-between" align="center">
                            <HStack spacing={3}>
                                <Box
                                    bgGradient="linear(to-br, purple.400, pink.400)"
                                    p={3}
                                    borderRadius="xl"
                                >
                                    <Icon as={FiPackage} color="white" boxSize={5} />
                                </Box>
                                <Box>
                                    <Heading size="md" color={headingColor}>Donation Items</Heading>
                                    <Text fontSize="sm" color={textColor}>{items.length} item(s) added</Text>
                                </Box>
                            </HStack>
                            <Button
                                leftIcon={<FiPlus />}
                                colorScheme="brand"
                                variant="outline"
                                size="sm"
                                onClick={addItem}
                                borderRadius="lg"
                            >
                                Add Item
                            </Button>
                        </Flex>
                        <Divider borderColor={borderColor} />

                        <VStack spacing={0} align="stretch">
                            {items.map((item, index) => (
                                <Box key={item.id}>
                                    {index > 0 && <Divider borderColor={borderColor} />}
                                    <Box
                                        p={6}
                                        _hover={{ bg: hoverBg }}
                                        transition="all 0.2s"
                                    >
                                        <Grid templateColumns={{ base: '1fr', md: 'repeat(12, 1fr)' }} gap={4} alignItems="end">
                                            <GridItem colSpan={{ base: 12, md: 5 }}>
                                                <FormControl isRequired>
                                                    <FormLabel fontSize="sm" fontWeight="600" color={headingColor}>
                                                        Item Name
                                                    </FormLabel>
                                                    <Input
                                                        placeholder="e.g., Rice, Apples, Milk"
                                                        value={item.name}
                                                        onChange={(e) =>
                                                            handleItemChange(item.id, 'name', e.target.value)
                                                        }
                                                        borderRadius="xl"
                                                    />
                                                </FormControl>
                                            </GridItem>

                                            <GridItem colSpan={{ base: 6, md: 2 }}>
                                                <FormControl isRequired>
                                                    <FormLabel fontSize="sm" fontWeight="600" color={headingColor}>
                                                        Quantity
                                                    </FormLabel>
                                                    <Input
                                                        type="number"
                                                        placeholder="0"
                                                        min="1"
                                                        value={item.quantity}
                                                        onChange={(e) =>
                                                            handleItemChange(item.id, 'quantity', e.target.value)
                                                        }
                                                        borderRadius="xl"
                                                    />
                                                </FormControl>
                                            </GridItem>

                                            <GridItem colSpan={{ base: 6, md: 2 }}>
                                                <FormControl isRequired>
                                                    <FormLabel fontSize="sm" fontWeight="600" color={headingColor}>
                                                        Unit
                                                    </FormLabel>
                                                    <Select
                                                        value={item.unit}
                                                        onChange={(e) =>
                                                            handleItemChange(item.id, 'unit', e.target.value)
                                                        }
                                                        borderRadius="xl"
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
                                                    <FormLabel fontSize="sm" fontWeight="600" color={headingColor}>
                                                        Type
                                                    </FormLabel>
                                                    <Select
                                                        value={item.type}
                                                        onChange={(e) =>
                                                            handleItemChange(item.id, 'type', e.target.value)
                                                        }
                                                        borderRadius="xl"
                                                    >
                                                        <option value="FOOD">Food</option>
                                                        <option value="GROCERY">Grocery</option>
                                                        <option value="HOUSEHOLD_SUPPLIES">Household</option>
                                                        <option value="OTHER">Other</option>
                                                    </Select>
                                                </FormControl>
                                            </GridItem>

                                            <GridItem colSpan={{ base: 2, md: 1 }}>
                                                <IconButton
                                                    icon={<FiTrash2 />}
                                                    colorScheme="red"
                                                    variant="ghost"
                                                    onClick={() => removeItem(item.id)}
                                                    aria-label="Remove item"
                                                    isDisabled={items.length === 1}
                                                    borderRadius="xl"
                                                    size="lg"
                                                />
                                            </GridItem>
                                        </Grid>
                                    </Box>
                                </Box>
                            ))}
                        </VStack>
                    </CardBody>
                </Card>

                {/* Info Box */}
                <Card
                    bg={useColorModeValue('blue.50', 'blue.900')}
                    border="1px"
                    borderColor={useColorModeValue('blue.200', 'blue.700')}
                    borderRadius="2xl"
                    mb={6}
                >
                    <CardBody p={6}>
                        <HStack spacing={4} align="flex-start">
                            <Box
                                bg={useColorModeValue('blue.100', 'blue.800')}
                                p={3}
                                borderRadius="xl"
                            >
                                <Icon as={FiInfo} color={useColorModeValue('blue.600', 'blue.300')} boxSize={5} />
                            </Box>
                            <Box>
                                <Text fontWeight="700" color={useColorModeValue('blue.800', 'blue.100')}>
                                    What happens next?
                                </Text>
                                <Text fontSize="sm" color={useColorModeValue('blue.700', 'blue.200')} mt={1}>
                                    After you submit, the collection center staff will review and either accept or reject your donation.
                                    You can track the status in your donations list.
                                </Text>
                            </Box>
                        </HStack>
                    </CardBody>
                </Card>

                {/* Submit Buttons */}
                <Flex gap={4} justify="flex-end" flexWrap="wrap">
                    <Button
                        variant="outline"
                        size="lg"
                        onClick={() => navigate('/donations')}
                        borderRadius="xl"
                        px={8}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        size="lg"
                        bgGradient={gradientBg}
                        color="white"
                        isLoading={loading}
                        loadingText="Creating..."
                        isDisabled={centers.length === 0}
                        borderRadius="xl"
                        px={8}
                        rightIcon={<FiSend />}
                        _hover={{
                            bgGradient: 'linear(to-r, brand.500, teal.500, blue.500)',
                            transform: 'translateY(-2px)',
                            boxShadow: 'lg',
                        }}
                        transition="all 0.2s"
                    >
                        Create Donation
                    </Button>
                </Flex>
            </form>
        </VStack>
    );
};

export default NewDonation;
