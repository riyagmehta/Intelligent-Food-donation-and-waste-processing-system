import { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Card,
    CardBody,
    Heading,
    Text,
    VStack,
    HStack,
    Icon,
    useColorModeValue,
    Spinner,
    Divider,
    Collapse,
    useDisclosure,
    Flex,
} from '@chakra-ui/react';
import { FiCpu, FiZap, FiThermometer, FiClock, FiAlertTriangle, FiInfo, FiChevronDown, FiChevronUp, FiUser, FiCalendar } from 'react-icons/fi';
import { aiAPI } from '../../services/api';

const FoodTipsCard = ({ donationId, items = [] }) => {
    const { isOpen, onToggle } = useDisclosure();
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [tips, setTips] = useState(null);
    const [savedContent, setSavedContent] = useState(null);
    const [error, setError] = useState(null);

    const cardBg = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.100', 'gray.700');
    const textColor = useColorModeValue('gray.600', 'gray.400');
    const headingColor = useColorModeValue('gray.800', 'white');
    const aiGradient = useColorModeValue(
        'linear(to-r, green.400, teal.400)',
        'linear(to-r, green.500, teal.500)'
    );

    // Load saved tips on mount
    useEffect(() => {
        if (donationId) {
            loadSavedTips();
        } else {
            setInitialLoading(false);
        }
    }, [donationId]);

    const loadSavedTips = async () => {
        try {
            setInitialLoading(true);
            const response = await aiAPI.getSavedFoodTips(donationId);
            if (response.data.exists) {
                setSavedContent(response.data);
                // Parse the saved content
                try {
                    const parsedTips = JSON.parse(response.data.content);
                    setTips(parsedTips);
                } catch {
                    setTips({
                        summary: response.data.content,
                        storageTips: '',
                        shelfLife: '',
                        spoilageSigns: '',
                        handlingTips: ''
                    });
                }
                // Auto-open if tips exist
                if (!isOpen) onToggle();
            }
        } catch (err) {
            console.error('Error loading saved tips:', err);
        } finally {
            setInitialLoading(false);
        }
    };

    const fetchTips = async () => {
        if (items.length === 0) return;

        setLoading(true);
        setError(null);

        try {
            const itemNames = items.map(item =>
                typeof item === 'string' ? item : item.itemName || item.name
            );

            // Use the save endpoint if donationId is available
            let response;
            if (donationId) {
                response = await aiAPI.generateAndSaveFoodTips(donationId, itemNames);
            } else {
                response = await aiAPI.getFoodTips(itemNames);
            }

            if (response.data.success) {
                // Parse JSON response
                try {
                    const parsedTips = JSON.parse(response.data.content);
                    setTips(parsedTips);
                } catch {
                    // If not valid JSON, create a simple structure
                    setTips({
                        summary: response.data.content,
                        storageTips: '',
                        shelfLife: '',
                        spoilageSigns: '',
                        handlingTips: ''
                    });
                }
                // Reload to get saved content details if donationId exists
                if (donationId) {
                    loadSavedTips();
                }
                if (!isOpen) onToggle();
            } else {
                throw new Error(response.data.error);
            }
        } catch (err) {
            console.error('Error fetching food tips:', err);
            setError('Failed to get food handling tips');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const TipItem = ({ icon, label, value, color }) => {
        if (!value) return null;
        return (
            <HStack align="flex-start" spacing={3}>
                <Box
                    bg={useColorModeValue(`${color}.100`, `${color}.900`)}
                    p={2}
                    borderRadius="lg"
                    mt={1}
                >
                    <Icon as={icon} color={useColorModeValue(`${color}.600`, `${color}.300`)} boxSize={4} />
                </Box>
                <Box flex={1}>
                    <Text fontSize="sm" fontWeight="600" color={headingColor}>{label}</Text>
                    <Text fontSize="sm" color={textColor}>{value}</Text>
                </Box>
            </HStack>
        );
    };

    if (items.length === 0) return null;

    // Show loading state
    if (initialLoading) {
        return (
            <Card
                bg={cardBg}
                border="1px"
                borderColor={borderColor}
                borderRadius="2xl"
                boxShadow={useColorModeValue('lg', 'dark-lg')}
                overflow="hidden"
            >
                <Box h="4px" bgGradient={aiGradient} />
                <CardBody p={6}>
                    <Flex justify="center" align="center" py={4}>
                        <Spinner size="md" color="green.500" />
                    </Flex>
                </CardBody>
            </Card>
        );
    }

    return (
        <Card
            bg={cardBg}
            border="1px"
            borderColor={borderColor}
            borderRadius="2xl"
            boxShadow={useColorModeValue('lg', 'dark-lg')}
            overflow="hidden"
        >
            <Box h="4px" bgGradient={aiGradient} />
            <CardBody p={6}>
                <Flex justify="space-between" align="center" mb={tips ? 4 : 0}>
                    <HStack spacing={3}>
                        <Box
                            bgGradient={aiGradient}
                            p={2}
                            borderRadius="lg"
                        >
                            <Icon as={FiCpu} color="white" boxSize={5} />
                        </Box>
                        <Box>
                            <Heading size="sm" color={headingColor}>AI Food Handling Tips</Heading>
                            <Text fontSize="xs" color={textColor}>Powered by Gemini AI</Text>
                        </Box>
                    </HStack>

                    {!tips && (
                        <Button
                            size="sm"
                            bgGradient={aiGradient}
                            color="white"
                            leftIcon={<FiZap />}
                            onClick={fetchTips}
                            isLoading={loading}
                            loadingText="Analyzing..."
                            _hover={{
                                bgGradient: 'linear(to-r, green.500, teal.500)',
                            }}
                            borderRadius="lg"
                        >
                            Get Tips
                        </Button>
                    )}

                    {tips && (
                        <Button
                            size="sm"
                            variant="ghost"
                            onClick={onToggle}
                            rightIcon={isOpen ? <FiChevronUp /> : <FiChevronDown />}
                        >
                            {isOpen ? 'Hide' : 'Show'}
                        </Button>
                    )}
                </Flex>

                {error && (
                    <Text color="red.500" fontSize="sm" mt={2}>{error}</Text>
                )}

                <Collapse in={isOpen} animateOpacity>
                    {tips && (
                        <VStack align="stretch" spacing={4} mt={4}>
                            {tips.summary && (
                                <Box
                                    bg={useColorModeValue('green.50', 'green.900')}
                                    p={4}
                                    borderRadius="xl"
                                    border="1px"
                                    borderColor={useColorModeValue('green.200', 'green.700')}
                                >
                                    <Text fontSize="sm" color={useColorModeValue('green.800', 'green.100')} fontWeight="500">
                                        {tips.summary}
                                    </Text>
                                </Box>
                            )}

                            <Divider borderColor={borderColor} />

                            <TipItem
                                icon={FiThermometer}
                                label="Storage Tips"
                                value={tips.storageTips}
                                color="blue"
                            />

                            <TipItem
                                icon={FiClock}
                                label="Shelf Life"
                                value={tips.shelfLife}
                                color="purple"
                            />

                            <TipItem
                                icon={FiAlertTriangle}
                                label="Spoilage Signs"
                                value={tips.spoilageSigns}
                                color="orange"
                            />

                            <TipItem
                                icon={FiInfo}
                                label="Handling Tips"
                                value={tips.handlingTips}
                                color="teal"
                            />

                            {savedContent && (
                                <>
                                    <Divider borderColor={borderColor} />
                                    <HStack justify="space-between" wrap="wrap" spacing={4}>
                                        <HStack spacing={2}>
                                            <Icon as={FiUser} color={textColor} boxSize={3} />
                                            <Text fontSize="xs" color={textColor}>
                                                By: {savedContent.generatedByUsername}
                                            </Text>
                                        </HStack>
                                        <HStack spacing={2}>
                                            <Icon as={FiCalendar} color={textColor} boxSize={3} />
                                            <Text fontSize="xs" color={textColor}>
                                                {formatDate(savedContent.generatedAt)}
                                            </Text>
                                        </HStack>
                                    </HStack>
                                </>
                            )}
                        </VStack>
                    )}
                </Collapse>
            </CardBody>
        </Card>
    );
};

export default FoodTipsCard;
