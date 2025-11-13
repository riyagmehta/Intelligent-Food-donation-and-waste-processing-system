import {
    Box,
    VStack,
    HStack,
    Text,
    Icon,
    useColorModeValue,
    Flex,
} from '@chakra-ui/react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import {
    FiHome,
    FiGrid,
    FiPackage,
    FiUsers,
    FiMapPin,
    FiBarChart,
    FiSettings,
} from 'react-icons/fi';

const Sidebar = ({ role = 'DONOR' }) => {
    const location = useLocation();
    const bgColor = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.700');
    const hoverBg = useColorModeValue('teal.50', 'gray.700');
    const activeBg = useColorModeValue('teal.100', 'teal.900');
    const activeColor = useColorModeValue('teal.600', 'teal.200');

    // Menu items based on role
    const menuItems = {
        ROLE_DONOR: [
            { name: 'Dashboard', icon: FiHome, path: '/dashboard' },
            { name: 'My Donations', icon: FiPackage, path: '/donations' },
            { name: 'New Donation', icon: FiGrid, path: '/donations/new' },
            { name: 'Centers', icon: FiMapPin, path: '/centers' },
            { name: 'Profile', icon: FiSettings, path: '/profile' },
        ],
        ROLE_STAFF: [
            { name: 'Dashboard', icon: FiHome, path: '/dashboard' },
            { name: 'All Donations', icon: FiPackage, path: '/donations/all' },
            { name: 'Donors', icon: FiUsers, path: '/donors' },
            { name: 'Centers', icon: FiMapPin, path: '/centers' },
            { name: 'Items', icon: FiGrid, path: '/items' },
            { name: 'Analytics', icon: FiBarChart, path: '/analytics' },
        ],
        ROLE_ADMIN: [
            { name: 'Dashboard', icon: FiHome, path: '/dashboard' },
            { name: 'All Donations', icon: FiPackage, path: '/donations/all' },
            { name: 'Donors', icon: FiUsers, path: '/donors' },
            { name: 'Centers', icon: FiMapPin, path: '/centers' },
            { name: 'Items', icon: FiGrid, path: '/items' },
            { name: 'Analytics', icon: FiBarChart, path: '/analytics' },
            { name: 'Settings', icon: FiSettings, path: '/settings' },
        ],
    };

    const items = menuItems[role] || menuItems.ROLE_DONOR;

    const SidebarLink = ({ item }) => {
        const isActive = location.pathname === item.path;

        return (
            <Box
                as={RouterLink}
                to={item.path}
                w="full"
                px={4}
                py={3}
                borderRadius="md"
                bg={isActive ? activeBg : 'transparent'}
                color={isActive ? activeColor : 'inherit'}
                _hover={{
                    bg: isActive ? activeBg : hoverBg,
                    textDecoration: 'none',
                }}
                transition="all 0.2s"
            >
                <HStack spacing={3}>
                    <Icon as={item.icon} boxSize={5} />
                    <Text fontWeight={isActive ? 'semibold' : 'medium'}>
                        {item.name}
                    </Text>
                </HStack>
            </Box>
        );
    };

    return (
        <Box
            w="250px"
            h="calc(100vh - 64px)"
            bg={bgColor}
            borderRight="1px"
            borderColor={borderColor}
            position="fixed"
            left={0}
            top="64px"
            overflowY="auto"
            display={{ base: 'none', md: 'block' }}
            py={4}
        >
            <VStack spacing={1} align="stretch">
                {items.map((item, index) => (
                    <SidebarLink key={index} item={item} />
                ))}
            </VStack>
        </Box>
    );
};

export default Sidebar;