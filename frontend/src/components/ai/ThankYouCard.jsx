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
    Flex,
    useToast,
    Spinner,
    Badge,
} from '@chakra-ui/react';
import { FiCpu, FiHeart, FiCopy, FiCheck, FiUser, FiCalendar } from 'react-icons/fi';
import { aiAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const ThankYouCard = ({ donationId, donorName, items = [], date }) => {
    const toast = useToast();
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [message, setMessage] = useState(null);
    const [savedContent, setSavedContent] = useState(null);
    const [copied, setCopied] = useState(false);
    const [error, setError] = useState(null);

    const isStaffOrAdmin = user?.role === 'ROLE_STAFF' || user?.role === 'ROLE_ADMIN';
    const isDonor = user?.role === 'ROLE_DONOR';

    const cardBg = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.100', 'gray.700');
    const textColor = useColorModeValue('gray.600', 'gray.400');
    const headingColor = useColorModeValue('gray.800', 'white');
    const aiGradient = useColorModeValue(
        'linear(to-r, pink.400, red.400)',
        'linear(to-r, pink.500, red.500)'
    );
    const messageBg = useColorModeValue('pink.50', 'pink.900');
    const messageBorder = useColorModeValue('pink.200', 'pink.700');

    // Load saved thank you message on mount
    useEffect(() => {
        if (donationId) {
            loadSavedMessage();
        } else {
            setInitialLoading(false);
        }
    }, [donationId]);

    const loadSavedMessage = async () => {
        try {
            setInitialLoading(true);
            const response = await aiAPI.getSavedThankYou(donationId);
            if (response.data.exists) {
                setSavedContent(response.data);
                setMessage(response.data.content);
            }
        } catch (err) {
            console.error('Error loading saved message:', err);
        } finally {
            setInitialLoading(false);
        }
    };

    const generateMessage = async () => {
        if (!donorName || items.length === 0 || !donationId) return;

        setLoading(true);
        setError(null);

        try {
            const itemNames = items.map(item =>
                typeof item === 'string' ? item : item.itemName || item.name
            );

            // Use the save endpoint for staff
            const response = await aiAPI.generateAndSaveThankYou(
                donationId,
                donorName,
                itemNames,
                date || 'today'
            );

            if (response.data.success) {
                setMessage(response.data.content);
                // Reload to get the saved content details
                loadSavedMessage();
                toast({
                    title: 'Success!',
                    description: 'Thank you message generated and sent to donor',
                    status: 'success',
                    duration: 3000,
                });
            } else {
                throw new Error(response.data.error);
            }
        } catch (err) {
            console.error('Error generating thank you message:', err);
            setError('Failed to generate thank you message');
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = async () => {
        if (!message) return;

        try {
            await navigator.clipboard.writeText(message);
            setCopied(true);
            toast({
                title: 'Copied!',
                description: 'Thank you message copied to clipboard',
                status: 'success',
                duration: 2000,
            });
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            toast({
                title: 'Copy failed',
                description: 'Could not copy to clipboard',
                status: 'error',
                duration: 2000,
            });
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

    // Don't render if no donation ID or items
    if (!donationId || items.length === 0) return null;

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
                        <Spinner size="md" color="pink.500" />
                    </Flex>
                </CardBody>
            </Card>
        );
    }

    // For donors - only show if message exists
    if (isDonor && !message) {
        return null;
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
                <Flex justify="space-between" align="center" mb={message ? 4 : 0}>
                    <HStack spacing={3}>
                        <Box
                            bgGradient={aiGradient}
                            p={2}
                            borderRadius="lg"
                        >
                            <Icon as={FiHeart} color="white" boxSize={5} />
                        </Box>
                        <Box>
                            <Heading size="sm" color={headingColor}>
                                {isDonor ? 'Thank You Message' : 'AI Thank You Message'}
                            </Heading>
                            <Text fontSize="xs" color={textColor}>
                                {isDonor ? 'From the collection center' : 'Personalized with Gemini AI'}
                            </Text>
                        </Box>
                    </HStack>

                    {/* Only Staff/Admin can generate */}
                    {isStaffOrAdmin && !message && (
                        <Button
                            size="sm"
                            bgGradient={aiGradient}
                            color="white"
                            leftIcon={<FiHeart />}
                            onClick={generateMessage}
                            isLoading={loading}
                            loadingText="Creating..."
                            _hover={{
                                bgGradient: 'linear(to-r, pink.500, red.500)',
                            }}
                            borderRadius="lg"
                        >
                            Generate & Send
                        </Button>
                    )}

                    {message && savedContent && (
                        <Badge colorScheme="green" borderRadius="full" px={3} py={1}>
                            Sent
                        </Badge>
                    )}
                </Flex>

                {error && (
                    <Text color="red.500" fontSize="sm" mt={2}>{error}</Text>
                )}

                {message && (
                    <VStack align="stretch" spacing={4}>
                        <Box
                            bg={messageBg}
                            p={5}
                            borderRadius="xl"
                            border="1px"
                            borderColor={messageBorder}
                            position="relative"
                        >
                            <Text
                                fontSize="md"
                                color={useColorModeValue('pink.800', 'pink.100')}
                                fontStyle="italic"
                                lineHeight="tall"
                            >
                                "{message}"
                            </Text>

                            <Button
                                position="absolute"
                                top={2}
                                right={2}
                                size="xs"
                                variant="ghost"
                                colorScheme="pink"
                                leftIcon={copied ? <FiCheck /> : <FiCopy />}
                                onClick={copyToClipboard}
                            >
                                {copied ? 'Copied' : 'Copy'}
                            </Button>
                        </Box>

                        {savedContent && (
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
                                <HStack spacing={2}>
                                    <Icon as={FiCpu} color={textColor} boxSize={3} />
                                    <Text fontSize="xs" color={textColor}>
                                        Generated by Gemini AI
                                    </Text>
                                </HStack>
                            </HStack>
                        )}
                    </VStack>
                )}

                {/* Info for staff when message not yet generated */}
                {isStaffOrAdmin && !message && (
                    <Text fontSize="sm" color={textColor} mt={4}>
                        Generate a personalized thank you message to send to the donor.
                        The message will be visible on the donor's dashboard.
                    </Text>
                )}
            </CardBody>
        </Card>
    );
};

export default ThankYouCard;
