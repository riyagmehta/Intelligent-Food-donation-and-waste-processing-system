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
    Radio,
    RadioGroup,
    useColorModeValue,
    FormHelperText,
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { FiHeart } from 'react-icons/fi';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

const Signup = ({ onSignup }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'DONOR',
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

    const handleRoleChange = (value) => {
        setFormData({
            ...formData,
            role: value,
        });
    };

    const validateForm = () => {
        if (formData.password !== formData.confirmPassword) {
            toast({
                title: 'Passwords do not match',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
            return false;
        }

        if (formData.password.length < 6) {
            toast({
                title: 'Password too short',
                description: 'Password must be at least 6 characters',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setLoading(true);

        try {
            const result = await onSignup({
                username: formData.username,
                email: formData.email,
                password: formData.password,
                role: formData.role,
            });

            if (result.success) {
                toast({
                    title: 'Account created successfully',
                    description: 'Welcome to DonateWise!',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                });
                navigate('/dashboard');
            } else {
                toast({
                    title: 'Signup failed',
                    description: result.error || 'Could not create account',
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
                            Create Account
                        </Heading>
                        <Text color="gray.600" textAlign="center">
                            Join DonateWise and make a difference
                        </Text>
                    </VStack>

                    {/* Signup Form */}
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
                                        placeholder="Choose a username"
                                        value={formData.username}
                                        onChange={handleChange}
                                        size="lg"
                                    />
                                </FormControl>

                                <FormControl isRequired>
                                    <FormLabel>Email</FormLabel>
                                    <Input
                                        name="email"
                                        type="email"
                                        placeholder="Enter your email"
                                        value={formData.email}
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
                                            placeholder="Create a password"
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
                                    <FormHelperText>At least 6 characters</FormHelperText>
                                </FormControl>

                                <FormControl isRequired>
                                    <FormLabel>Confirm Password</FormLabel>
                                    <Input
                                        name="confirmPassword"
                                        type="password"
                                        placeholder="Confirm your password"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        size="lg"
                                    />
                                </FormControl>

                                {/* Hidden role field - always DONOR for public signup */}
                                <Box
                                    bg="teal.50"
                                    p={4}
                                    borderRadius="md"
                                    border="1px"
                                    borderColor="teal.200"
                                >
                                    <Text fontSize="sm" color="teal.700">
                                        You're signing up as a <strong>Donor</strong>. Staff and Admin accounts are created by administrators.
                                    </Text>
                                </Box>

                                <Button
                                    type="submit"
                                    colorScheme="teal"
                                    size="lg"
                                    fontSize="md"
                                    isLoading={loading}
                                    loadingText="Creating account..."
                                >
                                    Sign Up
                                </Button>

                                <HStack justify="center">
                                    <Text color="gray.600">Already have an account?</Text>
                                    <Link as={RouterLink} to="/login" color="teal.500" fontWeight="semibold">
                                        Login
                                    </Link>
                                </HStack>
                            </Stack>
                        </form>
                    </Box>
                </VStack>
            </Container>
        </Box>
    );
};

export default Signup;