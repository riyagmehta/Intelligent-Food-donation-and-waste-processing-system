import {
    Box,
    VStack,
    HStack,
    Text,
    Icon,
    useColorModeValue,
    Divider,
    Badge,
    Flex,
} from '@chakra-ui/react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import {
    FiHome,
    FiGrid,
    FiPackage,
    FiUsers,
    FiMapPin,
    FiUser,
    FiCheckCircle,
    FiTruck,
    FiPlusCircle,
    FiHelpCircle,
} from 'react-icons/fi';

const Sidebar = ({ role = 'DONOR' }) => {
    const location = useLocation();

    const bgColor = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.100', 'gray.700');
    const hoverBg = useColorModeValue('brand.50', 'whiteAlpha.100');
    const activeBg = useColorModeValue('brand.100', 'brand.900');
    const activeColor = useColorModeValue('brand.700', 'brand.200');
    const textColor = useColorModeValue('gray.600', 'gray.400');
    const activeTextColor = useColorModeValue('brand.700', 'white');

    // Menu items based on role
    const menuItems = {
        ROLE_DONOR: [
            { name: 'Dashboard', icon: FiHome, path: '/dashboard' },
            { name: 'My Donations', icon: FiPackage, path: '/donations' },
            { name: 'New Donation', icon: FiPlusCircle, path: '/donations/new', highlight: true },
            { name: 'Centers', icon: FiMapPin, path: '/centers' },
            { name: 'Profile', icon: FiUser, path: '/profile' },
        ],
        ROLE_STAFF: [
            { name: 'Dashboard', icon: FiHome, path: '/staff/dashboard' },
            { name: 'Pending Donations', icon: FiCheckCircle, path: '/staff/dashboard', badge: 'Review' },
            { name: 'All Donations', icon: FiPackage, path: '/donations/all' },
            { name: 'My Center', icon: FiMapPin, path: '/centers' },
            { name: 'Deliveries', icon: FiTruck, path: '/staff/deliveries' },
            { name: 'Recipients', icon: FiUsers, path: '/staff/recipients' },
            { name: 'Profile', icon: FiUser, path: '/profile' },
        ],
        ROLE_DRIVER: [
            { name: 'Dashboard', icon: FiHome, path: '/driver/dashboard' },
            { name: 'My Deliveries', icon: FiTruck, path: '/driver/deliveries' },
            { name: 'Profile', icon: FiUser, path: '/profile' },
        ],
        ROLE_ADMIN: [
            { name: 'Dashboard', icon: FiHome, path: '/admin/dashboard' },
            { name: 'All Donations', icon: FiPackage, path: '/donations/all' },
            { name: 'Donors', icon: FiUsers, path: '/donors' },
            { name: 'Centers', icon: FiMapPin, path: '/centers' },
            { name: 'Profile', icon: FiUser, path: '/profile' },
        ],
    };

    const items = menuItems[role] || menuItems.ROLE_DONOR;

    const getRoleLabel = (role) => {
        const labels = {
            ROLE_DONOR: { label: 'Donor Portal', color: 'green' },
            ROLE_STAFF: { label: 'Staff Portal', color: 'blue' },
            ROLE_DRIVER: { label: 'Driver Portal', color: 'orange' },
            ROLE_ADMIN: { label: 'Admin Portal', color: 'purple' },
        };
        return labels[role] || { label: 'Portal', color: 'gray' };
    };

    const SidebarLink = ({ item }) => {
        const isActive = location.pathname === item.path ||
            (item.path !== '/' && item.path !== '/staff/dashboard' && location.pathname.startsWith(item.path));

        return (
            <Box
                as={RouterLink}
                to={item.path}
                w="full"
                px={4}
                py={3}
                borderRadius="xl"
                bg={isActive ? activeBg : 'transparent'}
                color={isActive ? activeTextColor : textColor}
                position="relative"
                _hover={{
                    bg: isActive ? activeBg : hoverBg,
                    textDecoration: 'none',
                    transform: 'translateX(4px)',
                    color: isActive ? activeTextColor : activeColor,
                }}
                transition="all 0.2s ease"
                _before={isActive ? {
                    content: '""',
                    position: 'absolute',
                    left: 0,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '4px',
                    height: '60%',
                    bg: 'brand.500',
                    borderRadius: 'full',
                } : {}}
            >
                <HStack spacing={3} justify="space-between">
                    <HStack spacing={3}>
                        <Box
                            p={2}
                            borderRadius="lg"
                            bg={isActive ? useColorModeValue('brand.500', 'brand.400') : 'transparent'}
                            color={isActive ? 'white' : 'inherit'}
                            transition="all 0.2s"
                        >
                            <Icon as={item.icon} boxSize={4} />
                        </Box>
                        <Text fontWeight={isActive ? '600' : '500'} fontSize="sm">
                            {item.name}
                        </Text>
                    </HStack>
                    {item.badge && (
                        <Badge
                            colorScheme="orange"
                            fontSize="2xs"
                            borderRadius="full"
                            px={2}
                        >
                            {item.badge}
                        </Badge>
                    )}
                    {item.highlight && !isActive && (
                        <Box
                            w={2}
                            h={2}
                            borderRadius="full"
                            bg="brand.500"
                        />
                    )}
                </HStack>
            </Box>
        );
    };

    return (
        <Flex
            direction="column"
            w="260px"
            h="calc(100vh - 64px)"
            bg={bgColor}
            borderRight="1px"
            borderColor={borderColor}
            position="fixed"
            left={0}
            top="64px"
            display={{ base: 'none', md: 'flex' }}
            py={6}
            px={3}
            css={{
                '&::-webkit-scrollbar': {
                    width: '4px',
                },
                '&::-webkit-scrollbar-track': {
                    background: 'transparent',
                },
                '&::-webkit-scrollbar-thumb': {
                    background: useColorModeValue('#CBD5E0', '#4A5568'),
                    borderRadius: '4px',
                },
            }}
        >
            {/* Portal Label */}
            <Box px={4} mb={6}>
                <Badge
                    colorScheme={getRoleLabel(role).color}
                    px={3}
                    py={1}
                    borderRadius="full"
                    fontSize="xs"
                    fontWeight="600"
                    textTransform="uppercase"
                    letterSpacing="0.5px"
                >
                    {getRoleLabel(role).label}
                </Badge>
            </Box>

            {/* Navigation - Scrollable area */}
            <Box flex={1} overflowY="auto">
                <VStack spacing={1} align="stretch">
                    {items.map((item, index) => (
                        <Box key={index}>
                            {item.name === 'Profile' && (
                                <Divider my={4} borderColor={borderColor} />
                            )}
                            <SidebarLink item={item} />
                        </Box>
                    ))}
                </VStack>
            </Box>

            {/* Footer - Fixed at bottom */}
            <Box pt={4} px={1} mt="auto">
                <Box
                    p={4}
                    borderRadius="xl"
                    bgGradient={useColorModeValue(
                        'linear(to-br, brand.50, teal.50)',
                        'linear(to-br, brand.900, teal.900)'
                    )}
                    border="1px"
                    borderColor={useColorModeValue('brand.100', 'brand.800')}
                >
                    <HStack spacing={3}>
                        <Icon as={FiHelpCircle} color={useColorModeValue('brand.600', 'brand.300')} />
                        <Box>
                            <Text fontSize="xs" fontWeight="600" color={useColorModeValue('brand.700', 'brand.200')}>
                                Need Help?
                            </Text>
                            <Text fontSize="xs" color={textColor}>
                                Contact support
                            </Text>
                        </Box>
                    </HStack>
                </Box>
            </Box>
        </Flex>
    );
};

export default Sidebar;
