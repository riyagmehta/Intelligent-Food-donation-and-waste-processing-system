import {
    Box,
    Flex,
    Text,
    Button,
    Stack,
    useColorMode,
    useColorModeValue,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    MenuDivider,
    Avatar,
    HStack,
    IconButton,
    useDisclosure,
    Drawer,
    DrawerBody,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    Badge,
    Tooltip,
} from '@chakra-ui/react';
import { HamburgerIcon, MoonIcon, SunIcon } from '@chakra-ui/icons';
import { FiHeart, FiUser, FiLogOut, FiSettings, FiGrid } from 'react-icons/fi';
import { Link as RouterLink } from 'react-router-dom';

const Navbar = ({ user, onLogout }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { colorMode, toggleColorMode } = useColorMode();

    const bgColor = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.100', 'gray.700');
    const logoGradient = useColorModeValue(
        'linear(to-r, brand.500, teal.400)',
        'linear(to-r, brand.300, teal.300)'
    );

    const getRoleBadge = (role) => {
        const roleConfig = {
            ROLE_ADMIN: { color: 'purple', label: 'Admin' },
            ROLE_STAFF: { color: 'blue', label: 'Staff' },
            ROLE_DRIVER: { color: 'orange', label: 'Driver' },
            ROLE_DONOR: { color: 'green', label: 'Donor' },
        };
        return roleConfig[role] || { color: 'gray', label: 'User' };
    };

    const getDashboardPath = (role) => {
        if (role === 'ROLE_ADMIN') return '/admin/dashboard';
        if (role === 'ROLE_STAFF') return '/staff/dashboard';
        if (role === 'ROLE_DRIVER') return '/driver/dashboard';
        return '/dashboard';
    };

    return (
        <Box
            bg={bgColor}
            px={6}
            borderBottom="1px"
            borderColor={borderColor}
            position="sticky"
            top={0}
            zIndex={1000}
            backdropFilter="blur(10px)"
            backgroundColor={useColorModeValue('rgba(255,255,255,0.9)', 'rgba(26,32,44,0.9)')}
        >
            <Flex h={16} alignItems="center" justifyContent="space-between" maxW="1400px" mx="auto">
                {/* Logo */}
                <HStack spacing={3}>
                    <IconButton
                        display={{ base: 'flex', md: 'none' }}
                        icon={<HamburgerIcon />}
                        variant="ghost"
                        onClick={onOpen}
                        aria-label="Open menu"
                        size="lg"
                    />
                    <Flex
                        alignItems="center"
                        as={RouterLink}
                        to={user ? getDashboardPath(user.role) : '/'}
                        _hover={{ textDecoration: 'none', transform: 'scale(1.02)' }}
                        transition="all 0.2s"
                    >
                        <Box
                            bgGradient={logoGradient}
                            p={2.5}
                            borderRadius="xl"
                            mr={3}
                            boxShadow="md"
                        >
                            <FiHeart color="white" size={22} />
                        </Box>
                        <Text
                            fontSize="xl"
                            fontWeight="800"
                            bgGradient={logoGradient}
                            bgClip="text"
                            letterSpacing="-0.5px"
                        >
                            DonateWise
                        </Text>
                    </Flex>
                </HStack>

                {/* Right side */}
                <HStack spacing={3}>
                    {/* Dark Mode Toggle */}
                    <Tooltip label={colorMode === 'light' ? 'Dark mode' : 'Light mode'} hasArrow>
                        <IconButton
                            icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
                            onClick={toggleColorMode}
                            variant="ghost"
                            aria-label="Toggle color mode"
                            size="lg"
                            borderRadius="xl"
                            color={useColorModeValue('gray.600', 'yellow.400')}
                            _hover={{
                                bg: useColorModeValue('gray.100', 'gray.700'),
                                transform: 'rotate(20deg)',
                            }}
                            transition="all 0.3s"
                        />
                    </Tooltip>

                    {user ? (
                        <Menu>
                            <MenuButton
                                as={Button}
                                variant="ghost"
                                rounded="xl"
                                px={2}
                                py={1}
                                _hover={{ bg: useColorModeValue('gray.100', 'gray.700') }}
                            >
                                <HStack spacing={3}>
                                    <Avatar
                                        size="sm"
                                        name={user.username}
                                        bg={useColorModeValue('brand.500', 'brand.400')}
                                        color="white"
                                        fontWeight="bold"
                                    />
                                    <Box display={{ base: 'none', md: 'block' }} textAlign="left">
                                        <Text fontSize="sm" fontWeight="600">
                                            {user.username}
                                        </Text>
                                        <Badge
                                            colorScheme={getRoleBadge(user.role).color}
                                            fontSize="2xs"
                                            borderRadius="full"
                                        >
                                            {getRoleBadge(user.role).label}
                                        </Badge>
                                    </Box>
                                </HStack>
                            </MenuButton>
                            <MenuList
                                shadow="xl"
                                borderRadius="xl"
                                border="1px"
                                borderColor={borderColor}
                                py={2}
                            >
                                <Box px={4} py={2} display={{ base: 'block', md: 'none' }}>
                                    <Text fontWeight="600">{user.username}</Text>
                                    <Badge colorScheme={getRoleBadge(user.role).color} fontSize="xs">
                                        {getRoleBadge(user.role).label}
                                    </Badge>
                                </Box>
                                <MenuDivider display={{ base: 'block', md: 'none' }} />
                                <MenuItem
                                    icon={<FiGrid />}
                                    as={RouterLink}
                                    to={getDashboardPath(user.role)}
                                    borderRadius="md"
                                    mx={2}
                                    _hover={{ bg: useColorModeValue('brand.50', 'brand.900') }}
                                >
                                    Dashboard
                                </MenuItem>
                                <MenuItem
                                    icon={<FiUser />}
                                    as={RouterLink}
                                    to="/profile"
                                    borderRadius="md"
                                    mx={2}
                                    _hover={{ bg: useColorModeValue('brand.50', 'brand.900') }}
                                >
                                    Profile
                                </MenuItem>
                                <MenuItem
                                    icon={<FiSettings />}
                                    as={RouterLink}
                                    to="/settings"
                                    borderRadius="md"
                                    mx={2}
                                    _hover={{ bg: useColorModeValue('brand.50', 'brand.900') }}
                                >
                                    Settings
                                </MenuItem>
                                <MenuDivider />
                                <MenuItem
                                    icon={<FiLogOut />}
                                    onClick={onLogout}
                                    borderRadius="md"
                                    mx={2}
                                    color="red.500"
                                    _hover={{ bg: 'red.50', color: 'red.600' }}
                                >
                                    Logout
                                </MenuItem>
                            </MenuList>
                        </Menu>
                    ) : (
                        <Stack direction="row" spacing={3}>
                            <Button
                                as={RouterLink}
                                to="/login"
                                variant="ghost"
                                fontWeight="600"
                                borderRadius="xl"
                            >
                                Login
                            </Button>
                            <Button
                                as={RouterLink}
                                to="/signup"
                                bgGradient={logoGradient}
                                color="white"
                                fontWeight="600"
                                borderRadius="xl"
                                _hover={{
                                    bgGradient: 'linear(to-r, brand.600, teal.500)',
                                    transform: 'translateY(-2px)',
                                    boxShadow: 'lg',
                                }}
                                transition="all 0.2s"
                            >
                                Get Started
                            </Button>
                        </Stack>
                    )}
                </HStack>
            </Flex>

            {/* Mobile Drawer */}
            <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
                <DrawerOverlay backdropFilter="blur(4px)" />
                <DrawerContent>
                    <DrawerCloseButton />
                    <DrawerHeader borderBottomWidth="1px">
                        <HStack>
                            <Box bgGradient={logoGradient} p={2} borderRadius="lg">
                                <FiHeart color="white" size={18} />
                            </Box>
                            <Text fontWeight="700" bgGradient={logoGradient} bgClip="text">
                                DonateWise
                            </Text>
                        </HStack>
                    </DrawerHeader>
                    <DrawerBody>
                        <Stack spacing={4} mt={4}>
                            <Button
                                as={RouterLink}
                                to="/"
                                variant="ghost"
                                justifyContent="flex-start"
                                onClick={onClose}
                            >
                                Home
                            </Button>
                            <Button
                                as={RouterLink}
                                to="/centers"
                                variant="ghost"
                                justifyContent="flex-start"
                                onClick={onClose}
                            >
                                Centers
                            </Button>
                        </Stack>
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </Box>
    );
};

export default Navbar;
