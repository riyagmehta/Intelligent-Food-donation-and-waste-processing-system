import { useState, useEffect } from 'react';
import {
    Box,
    Card,
    CardBody,
    Heading,
    Text,
    VStack,
    HStack,
    Icon,
    useColorModeValue,
    Flex,
    Spinner,
    Badge,
    Divider,
} from '@chakra-ui/react';
import { FiHeart, FiMapPin, FiPackage, FiCalendar } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { aiAPI } from '../../services/api';

const RecentThankYouMessages = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [messages, setMessages] = useState([]);

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
    const hoverBg = useColorModeValue('gray.50', 'gray.700');

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        try {
            setLoading(true);
            const response = await aiAPI.getMyThankYouMessages();
            setMessages(response.data);
        } catch (err) {
            console.error('Error fetching thank you messages:', err);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    // Don't show if loading or no messages
    if (loading) {
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

    if (messages.length === 0) {
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
                <Flex justify="space-between" align="center" mb={4}>
                    <HStack spacing={3}>
                        <Box
                            bgGradient={aiGradient}
                            p={2}
                            borderRadius="lg"
                        >
                            <Icon as={FiHeart} color="white" boxSize={5} />
                        </Box>
                        <Box>
                            <Heading size="sm" color={headingColor}>Thank You Messages</Heading>
                            <Text fontSize="xs" color={textColor}>From collection centers</Text>
                        </Box>
                    </HStack>
                    <Badge colorScheme="pink" borderRadius="full" px={3} py={1}>
                        {messages.length} new
                    </Badge>
                </Flex>

                <VStack align="stretch" spacing={4}>
                    {messages.map((msg, index) => (
                        <Box key={msg.id}>
                            {index > 0 && <Divider borderColor={borderColor} mb={4} />}
                            <Box
                                bg={messageBg}
                                p={4}
                                borderRadius="xl"
                                border="1px"
                                borderColor={messageBorder}
                                cursor="pointer"
                                _hover={{ bg: hoverBg }}
                                transition="all 0.2s"
                                onClick={() => navigate(`/donations/${msg.donationId}`)}
                            >
                                <HStack justify="space-between" mb={2} flexWrap="wrap">
                                    <HStack spacing={2}>
                                        <Icon as={FiMapPin} color="pink.500" boxSize={4} />
                                        <Text fontSize="sm" fontWeight="600" color={headingColor}>
                                            {msg.centerName || 'Collection Center'}
                                        </Text>
                                    </HStack>
                                    <HStack spacing={2}>
                                        <Icon as={FiCalendar} color={textColor} boxSize={3} />
                                        <Text fontSize="xs" color={textColor}>
                                            {formatDate(msg.generatedAt)}
                                        </Text>
                                    </HStack>
                                </HStack>

                                <Text
                                    fontSize="sm"
                                    color={useColorModeValue('pink.800', 'pink.100')}
                                    fontStyle="italic"
                                    lineHeight="tall"
                                    noOfLines={3}
                                >
                                    "{msg.content}"
                                </Text>

                                <HStack mt={3} spacing={2}>
                                    <Icon as={FiPackage} color={textColor} boxSize={3} />
                                    <Text fontSize="xs" color={textColor}>
                                        For: {msg.donationName || `Donation #${msg.donationId}`}
                                    </Text>
                                </HStack>
                            </Box>
                        </Box>
                    ))}
                </VStack>
            </CardBody>
        </Card>
    );
};

export default RecentThankYouMessages;
