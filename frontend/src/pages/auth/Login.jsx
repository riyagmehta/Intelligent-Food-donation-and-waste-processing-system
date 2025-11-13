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
    Divider,
    useColorModeValue,
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { FiHeart } from 'react-icons/fi';
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
    const bgColor = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.700');

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
            // This will be connected to your API later
            const result = await onLogin(formData);

            if (result.success) {
                toast({
                    title: 'Login successful',
                    description: 'Welcome back!',
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
        <Box minH="100vh" bg="gray.50" py={12}>
            <Container maxW="md">
                <VStack spacing={8}>
                    {/* Logo and Header */}
                    <VStack spacing={3}>
                        <Box bg="teal.500" p={3} borderRadius="xl">
                            <FiHeart color="white" size={40} />
                        </Box>
                        <Heading size="xl" color="teal.600">
                            Welcome Back
                        </Heading>
                        <Text color="gray.600" textAlign="center">
                            Login to your DonateWise account
                        </Text>
                    </VStack>

                    {/* Login Form */}
                    <Box
                        w="full"
                        bg={bgColor}
                        p={8}
                        borderRadius="xl"
                        boxShadow="lg"
                        border="1px"
                        borderColor={borderColor}
                    >
                        <form onSubmit={handleSubmit}>
                            <Stack spacing={4}>
                                <FormControl isRequired>
                                    <FormLabel>Username</FormLabel>
                                    <Input
                                        name="username"
                                        type="text"
                                        placeholder="Enter your username"
                                        value={formData.username}
                                        onChange={handleChange}
                                        size="lg"
                                    />
                                </FormControl>

                                <FormControl isRequired>
                                    <FormLabel>Password</FormLabel>
                                    <InputGroup size="lg">
                                        <Input
                                            name="password"
                                            type={showPassword ? 'text' : 'password'}
                                            placeholder="Enter your password"
                                            value={formData.password}
                                            onChange={handleChange}
                                        />
                                        <InputRightElement>
                                            <IconButton
                                                variant="ghost"
                                                icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                                                onClick={() => setShowPassword(!showPassword)}
                                                aria-label={showPassword ? 'Hide password' : 'Show password'}
                                            />
                                        </InputRightElement>
                                    </InputGroup>
                                </FormControl>

                                <Button
                                    type="submit"
                                    colorScheme="teal"
                                    size="lg"
                                    fontSize="md"
                                    isLoading={loading}
                                    loadingText="Logging in..."
                                >
                                    Login
                                </Button>

                                <HStack justify="center">
                                    <Text color="gray.600">Don't have an account?</Text>
                                    <Link as={RouterLink} to="/signup" color="teal.500" fontWeight="semibold">
                                        Sign up
                                    </Link>
                                </HStack>
                            </Stack>
                        </form>
                    </Box>

                    {/* Demo Credentials */}
                    <Box
                        w="full"
                        bg="blue.50"
                        p={4}
                        borderRadius="md"
                        border="1px"
                        borderColor="blue.200"
                    >
                        <Text fontSize="sm" fontWeight="semibold" color="blue.700" mb={2}>
                            Demo Credentials:
                        </Text>
                        <VStack align="start" spacing={1} fontSize="sm" color="blue.600">
                            <Text>• Donor: donor / password</Text>
                            <Text>• Staff: staff / password</Text>
                            <Text>• Admin: admin / password</Text>
                        </VStack>
                    </Box>
                </VStack>
            </Container>
        </Box>
    );
};

export default Login;