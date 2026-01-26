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
    Progress,
    Card,
    CardBody,
    Icon,
    Textarea,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { FiHeart, FiUser, FiMapPin, FiArrowRight, FiArrowLeft, FiCheck, FiTruck } from 'react-icons/fi';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

const Signup = ({ onSignup }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        // User info
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: '',
        // Collection Center info (for staff)
        centerName: '',
        centerLocation: '',
        maxCapacity: 100,
        // Driver info (for driver)
        driverName: '',
        driverPhone: '',
        vehicleNumber: '',
        vehicleType: '',
    });

    const toast = useToast();
    const navigate = useNavigate();
    const bgColor = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.700');
    const selectedBg = useColorModeValue('teal.50', 'teal.900');
    const selectedBorder = useColorModeValue('teal.500', 'teal.400');

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

    const handleCapacityChange = (value) => {
        setFormData({
            ...formData,
            maxCapacity: parseInt(value) || 0,
        });
    };

    const validateStep1 = () => {
        if (!formData.role) {
            toast({
                title: 'Please select an account type',
                status: 'warning',
                duration: 3000,
                isClosable: true,
            });
            return false;
        }
        return true;
    };

    const validateStep2 = () => {
        if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
            toast({
                title: 'All fields are required',
                status: 'warning',
                duration: 3000,
                isClosable: true,
            });
            return false;
        }

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

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            toast({
                title: 'Invalid email',
                description: 'Please enter a valid email address',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
            return false;
        }

        return true;
    };

    const validateStep3Staff = () => {
        if (!formData.centerName || !formData.centerLocation) {
            toast({
                title: 'All fields are required',
                status: 'warning',
                duration: 3000,
                isClosable: true,
            });
            return false;
        }

        if (formData.maxCapacity < 1) {
            toast({
                title: 'Invalid capacity',
                description: 'Maximum capacity must be at least 1',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
            return false;
        }

        return true;
    };

    const validateStep3Driver = () => {
        if (!formData.driverName || !formData.driverPhone) {
            toast({
                title: 'Name and phone are required',
                status: 'warning',
                duration: 3000,
                isClosable: true,
            });
            return false;
        }

        const phoneRegex = /^[0-9]{10}$/;
        if (!phoneRegex.test(formData.driverPhone.replace(/[\s-]/g, ''))) {
            toast({
                title: 'Invalid phone number',
                description: 'Please enter a valid 10-digit phone number',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
            return false;
        }

        return true;
    };

    const nextStep = () => {
        if (step === 1 && !validateStep1()) return;
        if (step === 2 && !validateStep2()) return;

        // If donor, skip step 3 and submit directly
        if (step === 2 && formData.role === 'DONOR') {
            handleSubmit();
            return;
        }

        // Staff and Driver need step 3
        if (step === 2 && (formData.role === 'STAFF' || formData.role === 'DRIVER')) {
            setStep(step + 1);
            return;
        }

        setStep(step + 1);
    };

    const prevStep = () => {
        setStep(step - 1);
    };

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();

        // Final validation based on role
        if (formData.role === 'STAFF' && !validateStep3Staff()) return;
        if (formData.role === 'DRIVER' && !validateStep3Driver()) return;

        setLoading(true);

        try {
            const signupData = {
                username: formData.username,
                email: formData.email,
                password: formData.password,
                role: formData.role,
            };

            // Add collection center info for staff
            if (formData.role === 'STAFF') {
                signupData.collectionCenter = {
                    name: formData.centerName,
                    location: formData.centerLocation,
                    maxCapacity: formData.maxCapacity,
                };
            }

            // Add driver info for driver
            if (formData.role === 'DRIVER') {
                signupData.driverInfo = {
                    name: formData.driverName,
                    phone: formData.driverPhone,
                    vehicleNumber: formData.vehicleNumber || null,
                    vehicleType: formData.vehicleType || null,
                };
            }

            const result = await onSignup(signupData);

            if (result.success) {
                toast({
                    title: 'Account created successfully',
                    description: formData.role === 'STAFF'
                        ? 'Welcome! Your collection center has been set up.'
                        : formData.role === 'DRIVER'
                            ? 'Welcome! You can now accept delivery assignments.'
                            : 'Welcome to DonateWise!',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                });

                // Redirect based on role
                if (formData.role === 'STAFF') {
                    navigate('/staff/dashboard');
                } else if (formData.role === 'DRIVER') {
                    navigate('/driver/dashboard');
                } else {
                    navigate('/dashboard');
                }
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

    const getTotalSteps = () => (formData.role === 'STAFF' || formData.role === 'DRIVER') ? 3 : 2;
    const getProgress = () => (step / getTotalSteps()) * 100;

    // Step 1: Role Selection
    const renderStep1 = () => (
        <Stack spacing={6}>
            <Text color="gray.600" textAlign="center">
                Choose how you want to contribute to reducing food waste
            </Text>

            <RadioGroup value={formData.role} onChange={handleRoleChange}>
                <Stack spacing={4}>
                    <Card
                        cursor="pointer"
                        onClick={() => handleRoleChange('DONOR')}
                        bg={formData.role === 'DONOR' ? selectedBg : bgColor}
                        border="2px"
                        borderColor={formData.role === 'DONOR' ? selectedBorder : borderColor}
                        _hover={{ borderColor: 'teal.300' }}
                        transition="all 0.2s"
                    >
                        <CardBody>
                            <HStack spacing={4}>
                                <Box
                                    bg={formData.role === 'DONOR' ? 'teal.500' : 'gray.100'}
                                    p={3}
                                    borderRadius="lg"
                                >
                                    <Icon
                                        as={FiHeart}
                                        boxSize={6}
                                        color={formData.role === 'DONOR' ? 'white' : 'gray.500'}
                                    />
                                </Box>
                                <Box flex={1}>
                                    <HStack justify="space-between">
                                        <Text fontWeight="bold" fontSize="lg">Donor</Text>
                                        <Radio value="DONOR" />
                                    </HStack>
                                    <Text color="gray.600" fontSize="sm">
                                        Donate surplus food from your home, restaurant, or business
                                    </Text>
                                </Box>
                            </HStack>
                        </CardBody>
                    </Card>

                    <Card
                        cursor="pointer"
                        onClick={() => handleRoleChange('STAFF')}
                        bg={formData.role === 'STAFF' ? selectedBg : bgColor}
                        border="2px"
                        borderColor={formData.role === 'STAFF' ? selectedBorder : borderColor}
                        _hover={{ borderColor: 'teal.300' }}
                        transition="all 0.2s"
                    >
                        <CardBody>
                            <HStack spacing={4}>
                                <Box
                                    bg={formData.role === 'STAFF' ? 'teal.500' : 'gray.100'}
                                    p={3}
                                    borderRadius="lg"
                                >
                                    <Icon
                                        as={FiMapPin}
                                        boxSize={6}
                                        color={formData.role === 'STAFF' ? 'white' : 'gray.500'}
                                    />
                                </Box>
                                <Box flex={1}>
                                    <HStack justify="space-between">
                                        <Text fontWeight="bold" fontSize="lg">Collection Center</Text>
                                        <Radio value="STAFF" />
                                    </HStack>
                                    <Text color="gray.600" fontSize="sm">
                                        Register your center to collect and distribute donations
                                    </Text>
                                </Box>
                            </HStack>
                        </CardBody>
                    </Card>

                    <Card
                        cursor="pointer"
                        onClick={() => handleRoleChange('DRIVER')}
                        bg={formData.role === 'DRIVER' ? selectedBg : bgColor}
                        border="2px"
                        borderColor={formData.role === 'DRIVER' ? selectedBorder : borderColor}
                        _hover={{ borderColor: 'teal.300' }}
                        transition="all 0.2s"
                    >
                        <CardBody>
                            <HStack spacing={4}>
                                <Box
                                    bg={formData.role === 'DRIVER' ? 'teal.500' : 'gray.100'}
                                    p={3}
                                    borderRadius="lg"
                                >
                                    <Icon
                                        as={FiTruck}
                                        boxSize={6}
                                        color={formData.role === 'DRIVER' ? 'white' : 'gray.500'}
                                    />
                                </Box>
                                <Box flex={1}>
                                    <HStack justify="space-between">
                                        <Text fontWeight="bold" fontSize="lg">Delivery Partner</Text>
                                        <Radio value="DRIVER" />
                                    </HStack>
                                    <Text color="gray.600" fontSize="sm">
                                        Deliver food donations to recipients in need
                                    </Text>
                                </Box>
                            </HStack>
                        </CardBody>
                    </Card>
                </Stack>
            </RadioGroup>

            <Button
                colorScheme="teal"
                size="lg"
                rightIcon={<FiArrowRight />}
                onClick={nextStep}
                isDisabled={!formData.role}
            >
                Continue
            </Button>
        </Stack>
    );

    // Step 2: User Info
    const renderStep2 = () => (
        <Stack spacing={4}>
            <Box bg="teal.50" p={3} borderRadius="md" mb={2}>
                <HStack>
                    <Icon as={formData.role === 'DONOR' ? FiHeart : formData.role === 'DRIVER' ? FiTruck : FiMapPin} color="teal.600" />
                    <Text fontSize="sm" color="teal.700">
                        Creating {formData.role === 'DONOR' ? 'Donor' : formData.role === 'DRIVER' ? 'Delivery Partner' : 'Collection Center Staff'} account
                    </Text>
                </HStack>
            </Box>

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

            <HStack spacing={4} pt={4}>
                <Button
                    variant="outline"
                    size="lg"
                    leftIcon={<FiArrowLeft />}
                    onClick={prevStep}
                    flex={1}
                >
                    Back
                </Button>
                <Button
                    colorScheme="teal"
                    size="lg"
                    rightIcon={formData.role === 'DONOR' ? <FiCheck /> : <FiArrowRight />}
                    onClick={nextStep}
                    isLoading={formData.role === 'DONOR' && loading}
                    loadingText="Creating account..."
                    flex={1}
                >
                    {formData.role === 'DONOR' ? 'Create Account' : 'Continue'}
                </Button>
            </HStack>
        </Stack>
    );

    // Step 3: Collection Center Info (for Staff only)
    const renderStep3Staff = () => (
        <form onSubmit={handleSubmit}>
            <Stack spacing={4}>
                <Box bg="blue.50" p={3} borderRadius="md" mb={2}>
                    <HStack>
                        <Icon as={FiMapPin} color="blue.600" />
                        <Text fontSize="sm" color="blue.700">
                            Set up your Collection Center details
                        </Text>
                    </HStack>
                </Box>

                <FormControl isRequired>
                    <FormLabel>Center Name</FormLabel>
                    <Input
                        name="centerName"
                        type="text"
                        placeholder="e.g., Downtown Food Bank"
                        value={formData.centerName}
                        onChange={handleChange}
                        size="lg"
                    />
                </FormControl>

                <FormControl isRequired>
                    <FormLabel>Location / Address</FormLabel>
                    <Textarea
                        name="centerLocation"
                        placeholder="Enter the full address of your collection center"
                        value={formData.centerLocation}
                        onChange={handleChange}
                        size="lg"
                        rows={3}
                    />
                </FormControl>

                <FormControl isRequired>
                    <FormLabel>Maximum Capacity (units)</FormLabel>
                    <NumberInput
                        value={formData.maxCapacity}
                        onChange={handleCapacityChange}
                        min={1}
                        max={10000}
                        size="lg"
                    >
                        <NumberInputField placeholder="How many donation units can you store?" />
                        <NumberInputStepper>
                            <NumberIncrementStepper />
                            <NumberDecrementStepper />
                        </NumberInputStepper>
                    </NumberInput>
                    <FormHelperText>
                        This helps donors know your availability
                    </FormHelperText>
                </FormControl>

                <HStack spacing={4} pt={4}>
                    <Button
                        variant="outline"
                        size="lg"
                        leftIcon={<FiArrowLeft />}
                        onClick={prevStep}
                        flex={1}
                    >
                        Back
                    </Button>
                    <Button
                        type="submit"
                        colorScheme="teal"
                        size="lg"
                        rightIcon={<FiCheck />}
                        isLoading={loading}
                        loadingText="Creating account..."
                        flex={1}
                    >
                        Create Account
                    </Button>
                </HStack>
            </Stack>
        </form>
    );

    // Step 3: Driver Info (for Driver only)
    const renderStep3Driver = () => (
        <form onSubmit={handleSubmit}>
            <Stack spacing={4}>
                <Box bg="blue.50" p={3} borderRadius="md" mb={2}>
                    <HStack>
                        <Icon as={FiTruck} color="blue.600" />
                        <Text fontSize="sm" color="blue.700">
                            Set up your Delivery Partner profile
                        </Text>
                    </HStack>
                </Box>

                <FormControl isRequired>
                    <FormLabel>Full Name</FormLabel>
                    <Input
                        name="driverName"
                        type="text"
                        placeholder="Enter your full name"
                        value={formData.driverName}
                        onChange={handleChange}
                        size="lg"
                    />
                </FormControl>

                <FormControl isRequired>
                    <FormLabel>Phone Number</FormLabel>
                    <Input
                        name="driverPhone"
                        type="tel"
                        placeholder="Enter your phone number"
                        value={formData.driverPhone}
                        onChange={handleChange}
                        size="lg"
                    />
                    <FormHelperText>
                        Collection centers will contact you for deliveries
                    </FormHelperText>
                </FormControl>

                <FormControl>
                    <FormLabel>Vehicle Number (Optional)</FormLabel>
                    <Input
                        name="vehicleNumber"
                        type="text"
                        placeholder="e.g., MH12AB1234"
                        value={formData.vehicleNumber}
                        onChange={handleChange}
                        size="lg"
                    />
                </FormControl>

                <FormControl>
                    <FormLabel>Vehicle Type (Optional)</FormLabel>
                    <Input
                        name="vehicleType"
                        type="text"
                        placeholder="e.g., Bike, Car, Van, Truck"
                        value={formData.vehicleType}
                        onChange={handleChange}
                        size="lg"
                    />
                </FormControl>

                <HStack spacing={4} pt={4}>
                    <Button
                        variant="outline"
                        size="lg"
                        leftIcon={<FiArrowLeft />}
                        onClick={prevStep}
                        flex={1}
                    >
                        Back
                    </Button>
                    <Button
                        type="submit"
                        colorScheme="teal"
                        size="lg"
                        rightIcon={<FiCheck />}
                        isLoading={loading}
                        loadingText="Creating account..."
                        flex={1}
                    >
                        Create Account
                    </Button>
                </HStack>
            </Stack>
        </form>
    );

    const getStepTitle = () => {
        switch (step) {
            case 1: return 'Choose Account Type';
            case 2: return 'Your Information';
            case 3: return formData.role === 'DRIVER' ? 'Driver Details' : 'Collection Center Details';
            default: return 'Sign Up';
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
                            {getStepTitle()}
                        </Heading>
                        <Text color="gray.600" textAlign="center">
                            Join DonateWise and make a difference
                        </Text>
                    </VStack>

                    {/* Progress Bar */}
                    <Box w="full">
                        <HStack justify="space-between" mb={2}>
                            <Text fontSize="sm" color="gray.600">
                                Step {step} of {getTotalSteps()}
                            </Text>
                            <Text fontSize="sm" color="gray.600">
                                {Math.round(getProgress())}% complete
                            </Text>
                        </HStack>
                        <Progress
                            value={getProgress()}
                            size="sm"
                            colorScheme="teal"
                            borderRadius="full"
                        />
                    </Box>

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
                        {step === 1 && renderStep1()}
                        {step === 2 && renderStep2()}
                        {step === 3 && formData.role === 'STAFF' && renderStep3Staff()}
                        {step === 3 && formData.role === 'DRIVER' && renderStep3Driver()}

                        <HStack justify="center" mt={6}>
                            <Text color="gray.600">Already have an account?</Text>
                            <Link as={RouterLink} to="/login" color="teal.500" fontWeight="semibold">
                                Login
                            </Link>
                        </HStack>
                    </Box>
                </VStack>
            </Container>
        </Box>
    );
};

export default Signup;
