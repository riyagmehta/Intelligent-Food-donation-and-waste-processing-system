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
    useColorMode,
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
    Flex,
    Badge,
    ScaleFade,
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon, MoonIcon, SunIcon } from '@chakra-ui/icons';
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
    const { colorMode, toggleColorMode } = useColorMode();

    const bgColor = useColorModeValue('white', 'gray.800');
    const pageBg = useColorModeValue('gray.50', 'gray.900');
    const borderColor = useColorModeValue('gray.200', 'gray.700');
    const cardBg = useColorModeValue('white', 'gray.800');
    const selectedBg = useColorModeValue('brand.50', 'brand.900');
    const selectedBorder = useColorModeValue('brand.500', 'brand.400');
    const gradientBg = useColorModeValue(
        'linear(to-br, brand.400, teal.400)',
        'linear(to-br, brand.500, teal.500)'
    );

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

    const roleConfig = {
        DONOR: {
            icon: FiHeart,
            title: 'Donor',
            description: 'Donate surplus food from your home, restaurant, or business',
            color: 'green',
        },
        STAFF: {
            icon: FiMapPin,
            title: 'Collection Center',
            description: 'Register your center to collect and distribute donations',
            color: 'blue',
        },
        DRIVER: {
            icon: FiTruck,
            title: 'Delivery Partner',
            description: 'Deliver food donations to recipients in need',
            color: 'orange',
        },
    };

    // Step 1: Role Selection
    const renderStep1 = () => (
        <ScaleFade in={step === 1} initialScale={0.95}>
            <Stack spacing={6}>
                <Text color={useColorModeValue('gray.600', 'gray.400')} textAlign="center">
                    Choose how you want to contribute to reducing food waste
                </Text>

                <RadioGroup value={formData.role} onChange={handleRoleChange}>
                    <Stack spacing={4}>
                        {Object.entries(roleConfig).map(([key, config]) => (
                            <Card
                                key={key}
                                cursor="pointer"
                                onClick={() => handleRoleChange(key)}
                                bg={formData.role === key ? selectedBg : cardBg}
                                border="2px"
                                borderColor={formData.role === key ? selectedBorder : borderColor}
                                _hover={{
                                    borderColor: `${config.color}.300`,
                                    transform: 'translateY(-2px)',
                                    boxShadow: 'md',
                                }}
                                transition="all 0.2s"
                                borderRadius="xl"
                            >
                                <CardBody>
                                    <HStack spacing={4}>
                                        <Box
                                            bg={formData.role === key ? `${config.color}.500` : useColorModeValue('gray.100', 'gray.700')}
                                            p={4}
                                            borderRadius="xl"
                                            transition="all 0.2s"
                                        >
                                            <Icon
                                                as={config.icon}
                                                boxSize={6}
                                                color={formData.role === key ? 'white' : useColorModeValue('gray.500', 'gray.400')}
                                            />
                                        </Box>
                                        <Box flex={1}>
                                            <HStack justify="space-between">
                                                <HStack>
                                                    <Text fontWeight="bold" fontSize="lg">{config.title}</Text>
                                                    {formData.role === key && (
                                                        <Badge colorScheme={config.color} borderRadius="full">
                                                            Selected
                                                        </Badge>
                                                    )}
                                                </HStack>
                                                <Radio value={key} colorScheme={config.color} />
                                            </HStack>
                                            <Text color={useColorModeValue('gray.600', 'gray.400')} fontSize="sm" mt={1}>
                                                {config.description}
                                            </Text>
                                        </Box>
                                    </HStack>
                                </CardBody>
                            </Card>
                        ))}
                    </Stack>
                </RadioGroup>

                <Button
                    size="lg"
                    rightIcon={<FiArrowRight />}
                    onClick={nextStep}
                    isDisabled={!formData.role}
                    bgGradient={gradientBg}
                    color="white"
                    borderRadius="xl"
                    _hover={{
                        transform: 'translateY(-2px)',
                        boxShadow: 'lg',
                    }}
                    transition="all 0.2s"
                >
                    Continue
                </Button>
            </Stack>
        </ScaleFade>
    );

    // Step 2: User Info
    const renderStep2 = () => (
        <ScaleFade in={step === 2} initialScale={0.95}>
            <Stack spacing={5}>
                <Box
                    bg={useColorModeValue(`${roleConfig[formData.role]?.color}.50`, `${roleConfig[formData.role]?.color}.900`)}
                    p={3}
                    borderRadius="xl"
                    mb={2}
                >
                    <HStack>
                        <Icon as={roleConfig[formData.role]?.icon} color={`${roleConfig[formData.role]?.color}.500`} />
                        <Text fontSize="sm" color={useColorModeValue(`${roleConfig[formData.role]?.color}.700`, `${roleConfig[formData.role]?.color}.200`)}>
                            Creating {roleConfig[formData.role]?.title} account
                        </Text>
                    </HStack>
                </Box>

                <FormControl isRequired>
                    <FormLabel fontWeight="600">Username</FormLabel>
                    <Input
                        name="username"
                        type="text"
                        placeholder="Choose a username"
                        value={formData.username}
                        onChange={handleChange}
                        size="lg"
                        borderRadius="xl"
                    />
                </FormControl>

                <FormControl isRequired>
                    <FormLabel fontWeight="600">Email</FormLabel>
                    <Input
                        name="email"
                        type="email"
                        placeholder="Enter your email"
                        value={formData.email}
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
                            placeholder="Create a password"
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
                    <FormHelperText>At least 6 characters</FormHelperText>
                </FormControl>

                <FormControl isRequired>
                    <FormLabel fontWeight="600">Confirm Password</FormLabel>
                    <Input
                        name="confirmPassword"
                        type="password"
                        placeholder="Confirm your password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        size="lg"
                        borderRadius="xl"
                    />
                </FormControl>

                <HStack spacing={4} pt={4}>
                    <Button
                        variant="outline"
                        size="lg"
                        leftIcon={<FiArrowLeft />}
                        onClick={prevStep}
                        flex={1}
                        borderRadius="xl"
                    >
                        Back
                    </Button>
                    <Button
                        size="lg"
                        rightIcon={formData.role === 'DONOR' ? <FiCheck /> : <FiArrowRight />}
                        onClick={nextStep}
                        isLoading={formData.role === 'DONOR' && loading}
                        loadingText="Creating account..."
                        flex={1}
                        bgGradient={gradientBg}
                        color="white"
                        borderRadius="xl"
                        _hover={{
                            transform: 'translateY(-2px)',
                            boxShadow: 'lg',
                        }}
                    >
                        {formData.role === 'DONOR' ? 'Create Account' : 'Continue'}
                    </Button>
                </HStack>
            </Stack>
        </ScaleFade>
    );

    // Step 3: Collection Center Info (for Staff only)
    const renderStep3Staff = () => (
        <ScaleFade in={step === 3} initialScale={0.95}>
            <form onSubmit={handleSubmit}>
                <Stack spacing={5}>
                    <Box bg={useColorModeValue('blue.50', 'blue.900')} p={3} borderRadius="xl" mb={2}>
                        <HStack>
                            <Icon as={FiMapPin} color="blue.500" />
                            <Text fontSize="sm" color={useColorModeValue('blue.700', 'blue.200')}>
                                Set up your Collection Center details
                            </Text>
                        </HStack>
                    </Box>

                    <FormControl isRequired>
                        <FormLabel fontWeight="600">Center Name</FormLabel>
                        <Input
                            name="centerName"
                            type="text"
                            placeholder="e.g., Downtown Food Bank"
                            value={formData.centerName}
                            onChange={handleChange}
                            size="lg"
                            borderRadius="xl"
                        />
                    </FormControl>

                    <FormControl isRequired>
                        <FormLabel fontWeight="600">Location / Address</FormLabel>
                        <Textarea
                            name="centerLocation"
                            placeholder="Enter the full address of your collection center"
                            value={formData.centerLocation}
                            onChange={handleChange}
                            size="lg"
                            rows={3}
                            borderRadius="xl"
                        />
                    </FormControl>

                    <FormControl isRequired>
                        <FormLabel fontWeight="600">Maximum Capacity (units)</FormLabel>
                        <NumberInput
                            value={formData.maxCapacity}
                            onChange={handleCapacityChange}
                            min={1}
                            max={10000}
                            size="lg"
                        >
                            <NumberInputField placeholder="How many donation units can you store?" borderRadius="xl" />
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
                            borderRadius="xl"
                        >
                            Back
                        </Button>
                        <Button
                            type="submit"
                            size="lg"
                            rightIcon={<FiCheck />}
                            isLoading={loading}
                            loadingText="Creating account..."
                            flex={1}
                            bgGradient={gradientBg}
                            color="white"
                            borderRadius="xl"
                            _hover={{
                                transform: 'translateY(-2px)',
                                boxShadow: 'lg',
                            }}
                        >
                            Create Account
                        </Button>
                    </HStack>
                </Stack>
            </form>
        </ScaleFade>
    );

    // Step 3: Driver Info (for Driver only)
    const renderStep3Driver = () => (
        <ScaleFade in={step === 3} initialScale={0.95}>
            <form onSubmit={handleSubmit}>
                <Stack spacing={5}>
                    <Box bg={useColorModeValue('orange.50', 'orange.900')} p={3} borderRadius="xl" mb={2}>
                        <HStack>
                            <Icon as={FiTruck} color="orange.500" />
                            <Text fontSize="sm" color={useColorModeValue('orange.700', 'orange.200')}>
                                Set up your Delivery Partner profile
                            </Text>
                        </HStack>
                    </Box>

                    <FormControl isRequired>
                        <FormLabel fontWeight="600">Full Name</FormLabel>
                        <Input
                            name="driverName"
                            type="text"
                            placeholder="Enter your full name"
                            value={formData.driverName}
                            onChange={handleChange}
                            size="lg"
                            borderRadius="xl"
                        />
                    </FormControl>

                    <FormControl isRequired>
                        <FormLabel fontWeight="600">Phone Number</FormLabel>
                        <Input
                            name="driverPhone"
                            type="tel"
                            placeholder="Enter your phone number"
                            value={formData.driverPhone}
                            onChange={handleChange}
                            size="lg"
                            borderRadius="xl"
                        />
                        <FormHelperText>
                            Collection centers will contact you for deliveries
                        </FormHelperText>
                    </FormControl>

                    <FormControl>
                        <FormLabel fontWeight="600">Vehicle Number (Optional)</FormLabel>
                        <Input
                            name="vehicleNumber"
                            type="text"
                            placeholder="e.g., MH12AB1234"
                            value={formData.vehicleNumber}
                            onChange={handleChange}
                            size="lg"
                            borderRadius="xl"
                        />
                    </FormControl>

                    <FormControl>
                        <FormLabel fontWeight="600">Vehicle Type (Optional)</FormLabel>
                        <Input
                            name="vehicleType"
                            type="text"
                            placeholder="e.g., Bike, Car, Van, Truck"
                            value={formData.vehicleType}
                            onChange={handleChange}
                            size="lg"
                            borderRadius="xl"
                        />
                    </FormControl>

                    <HStack spacing={4} pt={4}>
                        <Button
                            variant="outline"
                            size="lg"
                            leftIcon={<FiArrowLeft />}
                            onClick={prevStep}
                            flex={1}
                            borderRadius="xl"
                        >
                            Back
                        </Button>
                        <Button
                            type="submit"
                            size="lg"
                            rightIcon={<FiCheck />}
                            isLoading={loading}
                            loadingText="Creating account..."
                            flex={1}
                            bgGradient={gradientBg}
                            color="white"
                            borderRadius="xl"
                            _hover={{
                                transform: 'translateY(-2px)',
                                boxShadow: 'lg',
                            }}
                        >
                            Create Account
                        </Button>
                    </HStack>
                </Stack>
            </form>
        </ScaleFade>
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
        <Flex minH="100vh" bg={pageBg}>
            {/* Left Side - Branding (Desktop) */}
            <Box
                display={{ base: 'none', lg: 'flex' }}
                w="45%"
                bgGradient={gradientBg}
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                p={12}
                position="relative"
                overflow="hidden"
            >
                {/* Decorative elements */}
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
                        Join DonateWise
                    </Heading>
                    <Text color="whiteAlpha.900" fontSize="xl" maxW="400px">
                        Be part of the movement to reduce food waste and help those in need
                    </Text>
                </VStack>
            </Box>

            {/* Right Side - Form */}
            <Flex
                w={{ base: '100%', lg: '55%' }}
                justify="center"
                align="center"
                p={{ base: 4, md: 8 }}
            >
                <Container maxW="lg">
                    {/* Dark mode toggle */}
                    <Flex justify="flex-end" mb={4}>
                        <IconButton
                            icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
                            onClick={toggleColorMode}
                            variant="ghost"
                            aria-label="Toggle color mode"
                            borderRadius="xl"
                            color={useColorModeValue('gray.600', 'yellow.400')}
                        />
                    </Flex>

                    <VStack spacing={6} align="stretch">
                        {/* Mobile Logo */}
                        <VStack spacing={3} display={{ base: 'flex', lg: 'none' }}>
                            <Box bgGradient={gradientBg} p={3} borderRadius="2xl">
                                <FiHeart color="white" size={36} />
                            </Box>
                        </VStack>

                        {/* Header */}
                        <VStack spacing={2} align="center">
                            <Heading size="xl" fontWeight="700">
                                {getStepTitle()}
                            </Heading>
                            <Text color={useColorModeValue('gray.600', 'gray.400')} textAlign="center">
                                Step {step} of {getTotalSteps()}
                            </Text>
                        </VStack>

                        {/* Progress Bar */}
                        <Box>
                            <Progress
                                value={getProgress()}
                                size="sm"
                                colorScheme="brand"
                                borderRadius="full"
                                bg={useColorModeValue('gray.200', 'gray.700')}
                            />
                        </Box>

                        {/* Form Card */}
                        <Box
                            bg={bgColor}
                            p={{ base: 6, md: 8 }}
                            borderRadius="2xl"
                            boxShadow={useColorModeValue('xl', 'dark-lg')}
                            border="1px"
                            borderColor={borderColor}
                        >
                            {step === 1 && renderStep1()}
                            {step === 2 && renderStep2()}
                            {step === 3 && formData.role === 'STAFF' && renderStep3Staff()}
                            {step === 3 && formData.role === 'DRIVER' && renderStep3Driver()}
                        </Box>

                        {/* Login link */}
                        <HStack justify="center">
                            <Text color={useColorModeValue('gray.600', 'gray.400')}>Already have an account?</Text>
                            <Link
                                as={RouterLink}
                                to="/login"
                                color="brand.500"
                                fontWeight="600"
                                _hover={{ color: 'brand.600', textDecoration: 'underline' }}
                            >
                                Login
                            </Link>
                        </HStack>
                    </VStack>
                </Container>
            </Flex>
        </Flex>
    );
};

export default Signup;
