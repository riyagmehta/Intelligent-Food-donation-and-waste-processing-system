import { useState } from 'react';
import {
    Box,
    Button,
    Container,
    FormControl,
    FormLabel,
    Input,
    Stack,
    Heading,
    Text,
    useToast,
    InputGroup,
    InputRightElement,
    IconButton,
    Link,
    VStack,
    HStack,
    useColorModeValue,
    useColorMode,
    Flex,
    Icon,
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon, MoonIcon, SunIcon } from '@chakra-ui/icons';
import { FiHeart, FiArrowRight } from 'react-icons/fi';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

const Login = ({ onLogin }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });

    const toast = useToast();
    const navigate = useNavigate();
    const { colorMode, toggleColorMode } = useColorMode();

    const bgColor = useColorModeValue('white', 'gray.800');
    const pageBg = useColorModeValue('gray.50', 'gray.900');
    const borderColor = useColorModeValue('gray.200', 'gray.700');
    const gradientBg = useColorModeValue(
        'linear(to-br, brand.400, teal.400, blue.400)',
        'linear(to-br, brand.600, teal.600, blue.600)'
    );

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const result = await onLogin(formData);

            if (result.success) {
                toast({
                    title: 'Welcome back!',
                    description: 'Login successful',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                });
                navigate('/dashboard');
            } else {
                toast({
                    title: 'Login failed',
                    description: result.error || 'Invalid credentials',
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                });
            }
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Something went wrong. Please try again.',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Flex minH="100vh" bg={pageBg}>
            {/* Left Side - Branding */}
            <Box
                display={{ base: 'none', lg: 'flex' }}
                w="50%"
                bgGradient={gradientBg}
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                p={12}
                position="relative"
                overflow="hidden"
            >
                {/* Decorative circles */}
                <Box
                    position="absolute"
                    top="-10%"
                    right="-10%"
                    w="400px"
                    h="400px"
                    borderRadius="full"
                    bg="whiteAlpha.100"
                />
                <Box
                    position="absolute"
                    bottom="-15%"
                    left="-10%"
                    w="500px"
                    h="500px"
                    borderRadius="full"
                    bg="whiteAlpha.100"
                />

                <VStack spacing={8} zIndex={1} textAlign="center">
                    <Box
                        bg="whiteAlpha.200"
                        p={6}
                        borderRadius="2xl"
                        backdropFilter="blur(10px)"
                    >
                        <FiHeart color="white" size={60} />
                    </Box>
                    <Heading color="white" size="2xl" fontWeight="800">
                        DonateWise
                    </Heading>
                    <Text color="whiteAlpha.900" fontSize="xl" maxW="400px">
                        Join thousands of donors making a difference in their communities
                    </Text>
                    <HStack spacing={8} mt={8}>
                        <VStack>
                            <Text color="white" fontSize="3xl" fontWeight="bold">10K+</Text>
                            <Text color="whiteAlpha.800" fontSize="sm">Donations</Text>
                        </VStack>
                        <Box w="1px" h="50px" bg="whiteAlpha.300" />
                        <VStack>
                            <Text color="white" fontSize="3xl" fontWeight="bold">500+</Text>
                            <Text color="whiteAlpha.800" fontSize="sm">Centers</Text>
                        </VStack>
                        <Box w="1px" h="50px" bg="whiteAlpha.300" />
                        <VStack>
                            <Text color="white" fontSize="3xl" fontWeight="bold">50K+</Text>
                            <Text color="whiteAlpha.800" fontSize="sm">Lives Impacted</Text>
                        </VStack>
                    </HStack>
                </VStack>
            </Box>

            {/* Right Side - Login Form */}
            <Flex
                w={{ base: '100%', lg: '50%' }}
                justify="center"
                align="center"
                p={{ base: 6, md: 12 }}
            >
                <Container maxW="md">
                    {/* Dark mode toggle */}
                    <Flex justify="flex-end" mb={8}>
                        <IconButton
                            icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
                            onClick={toggleColorMode}
                            variant="ghost"
                            aria-label="Toggle color mode"
                            borderRadius="xl"
                            color={useColorModeValue('gray.600', 'yellow.400')}
                        />
                    </Flex>

                    <VStack spacing={8} align="stretch">
                        {/* Header - Mobile only */}
                        <VStack spacing={3} display={{ base: 'flex', lg: 'none' }}>
                            <Box
                                bgGradient={gradientBg}
                                p={4}
                                borderRadius="2xl"
                            >
                                <FiHeart color="white" size={40} />
                            </Box>
                            <Heading
                                size="xl"
                                bgGradient="linear(to-r, brand.500, teal.400)"
                                bgClip="text"
                                fontWeight="800"
                            >
                                DonateWise
                            </Heading>
                        </VStack>

                        {/* Form Header */}
                        <VStack spacing={2} align={{ base: 'center', lg: 'flex-start' }}>
                            <Heading size="xl" fontWeight="700">
                                Welcome back
                            </Heading>
                            <Text color={useColorModeValue('gray.600', 'gray.400')}>
                                Enter your credentials to access your account
                            </Text>
                        </VStack>

                        {/* Login Form */}
                        <Box
                            bg={bgColor}
                            p={{ base: 6, md: 8 }}
                            borderRadius="2xl"
                            boxShadow={useColorModeValue('xl', 'dark-lg')}
                            border="1px"
                            borderColor={borderColor}
                        >
                            <form onSubmit={handleSubmit}>
                                <Stack spacing={5}>
                                    <FormControl isRequired>
                                        <FormLabel fontWeight="600">Username</FormLabel>
                                        <Input
                                            name="username"
                                            type="text"
                                            placeholder="Enter your username"
                                            value={formData.username}
                                            onChange={handleChange}
                                            size="lg"
                                            borderRadius="xl"
                                        />
                                    </FormControl>

                                    <FormControl isRequired>
                                        <FormLabel fontWeight="600">Password</FormLabel>
                                        <InputGroup size="lg">
                                            <Input
                                                name="password"
                                                type={showPassword ? 'text' : 'password'}
                                                placeholder="Enter your password"
                                                value={formData.password}
                                                onChange={handleChange}
                                                borderRadius="xl"
                                            />
                                            <InputRightElement>
                                                <IconButton
                                                    variant="ghost"
                                                    icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                                    borderRadius="xl"
                                                />
                                            </InputRightElement>
                                        </InputGroup>
                                    </FormControl>

                                    <Button
                                        type="submit"
                                        size="lg"
                                        fontSize="md"
                                        isLoading={loading}
                                        loadingText="Signing in..."
                                        bgGradient={gradientBg}
                                        color="white"
                                        borderRadius="xl"
                                        rightIcon={<FiArrowRight />}
                                        _hover={{
                                            bgGradient: 'linear(to-r, brand.500, teal.500, blue.500)',
                                            transform: 'translateY(-2px)',
                                            boxShadow: 'lg',
                                        }}
                                        transition="all 0.2s"
                                    >
                                        Sign In
                                    </Button>
                                </Stack>
                            </form>
                        </Box>

                        {/* Sign up link */}
                        <HStack justify="center" spacing={2}>
                            <Text color={useColorModeValue('gray.600', 'gray.400')}>
                                Don't have an account?
                            </Text>
                            <Link
                                as={RouterLink}
                                to="/signup"
                                color="brand.500"
                                fontWeight="600"
                                _hover={{ color: 'brand.600', textDecoration: 'underline' }}
                            >
                                Sign up
                            </Link>
                        </HStack>

                        {/* Demo Credentials */}
                        <Box
                            bg={useColorModeValue('blue.50', 'blue.900')}
                            p={4}
                            borderRadius="xl"
                            border="1px"
                            borderColor={useColorModeValue('blue.200', 'blue.700')}
                        >
                            <Text fontSize="sm" fontWeight="600" color={useColorModeValue('blue.700', 'blue.200')} mb={2}>
                                Demo Credentials:
                            </Text>
                            <VStack align="start" spacing={1} fontSize="sm" color={useColorModeValue('blue.600', 'blue.300')}>
                                <Text>Donor: donor / donor</Text>
                                <Text>Staff: staff / staff</Text>
                                <Text>Driver: driver / driver</Text>
                            </VStack>
                        </Box>
                    </VStack>
                </Container>
            </Flex>
        </Flex>
    );
};

export default Login;
