import { useState } from 'react';
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
} from '@chakra-ui/react';
import { FiCpu, FiHeart, FiCopy, FiCheck, FiRefreshCw } from 'react-icons/fi';
import { aiAPI } from '../../services/api';

const ThankYouCard = ({ donorName, items = [], date }) => {
    const toast = useToast();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [copied, setCopied] = useState(false);
    const [error, setError] = useState(null);

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

    const generateMessage = async () => {
        if (!donorName || items.length === 0) return;

        setLoading(true);
        setError(null);

        try {
            const itemNames = items.map(item =>
                typeof item === 'string' ? item : item.itemName || item.name
            );

            const response = await aiAPI.generateThankYou(donorName, itemNames, date || 'today');

            if (response.data.success) {
                setMessage(response.data.content);
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

    if (!donorName || items.length === 0) return null;

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
                            <Heading size="sm" color={headingColor}>AI Thank You Message</Heading>
                            <Text fontSize="xs" color={textColor}>Personalized with Gemini AI</Text>
                        </Box>
                    </HStack>

                    <HStack spacing={2}>
                        {message && (
                            <Button
                                size="sm"
                                variant="outline"
                                colorScheme="pink"
                                leftIcon={<FiRefreshCw />}
                                onClick={generateMessage}
                                isLoading={loading}
                                borderRadius="lg"
                            >
                                Regenerate
                            </Button>
                        )}
                        {!message && (
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
                                Generate
                            </Button>
                        )}
                    </HStack>
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

                        <HStack justify="center" spacing={2}>
                            <Icon as={FiCpu} color={textColor} boxSize={3} />
                            <Text fontSize="xs" color={textColor}>
                                Generated by Gemini AI
                            </Text>
                        </HStack>
                    </VStack>
                )}
            </CardBody>
        </Card>
    );
};

export default ThankYouCard;
