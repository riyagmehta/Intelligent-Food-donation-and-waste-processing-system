import {
    Box,
    Flex,
    Text,
    Button,
    Stack,
    useColorModeValue,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
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
} from '@chakra-ui/react';
import { HamburgerIcon } from '@chakra-ui/icons';
import { FiHeart, FiUser, FiLogOut } from 'react-icons/fi';
import { Link as RouterLink } from 'react-router-dom';

const Navbar = ({ user, onLogout }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const bgColor = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.700');

    const NavLinks = () => (
        <>
            <Button
                as={RouterLink}
                to="/"
                variant="ghost"
                colorScheme="teal"
                fontWeight="medium"
            >
                Home
            </Button>
            <Button
                as={RouterLink}
                to="/about"
                variant="ghost"
                colorScheme="teal"
                fontWeight="medium"
            >
                About
            </Button>
            <Button
                as={RouterLink}
                to="/centers"
                variant="ghost"
                colorScheme="teal"
                fontWeight="medium"
            >
                Centers
            </Button>
        </>
    );

    return (
        <Box
            bg={bgColor}
            px={4}
            borderBottom="1px"
            borderColor={borderColor}
            position="sticky"
            top={0}
            zIndex={10}
            boxShadow="sm"
        >
            <Flex h={16} alignItems="center" justifyContent="space-between">
                {/* Logo */}
                <HStack spacing={3}>
                    <IconButton
                        display={{ base: 'flex', md: 'none' }}
                        icon={<HamburgerIcon />}
                        variant="ghost"
                        onClick={onOpen}
                        aria-label="Open menu"
                    />
                    <Flex alignItems="center" as={RouterLink} to="/" _hover={{ textDecoration: 'none' }}>
                        <Box
                            bg="teal.500"
                            p={2}
                            borderRadius="md"
                            mr={2}
                        >
                            <FiHeart color="white" size={24} />
                        </Box>
                        <Text fontSize="xl" fontWeight="bold" color="teal.600">
                            DonateWise
                        </Text>
                    </Flex>
                </HStack>

                {/* Desktop Navigation */}
                <HStack spacing={4} display={{ base: 'none', md: 'flex' }}>
                    <NavLinks />
                </HStack>

                {/* Right side - Auth buttons or User menu */}
                <Flex alignItems="center">
                    {user ? (
                        <Menu>
                            <MenuButton
                                as={Button}
                                rounded="full"
                                variant="link"
                                cursor="pointer"
                                minW={0}
                            >
                                <HStack spacing={2}>
                                    <Avatar size="sm" name={user.username} bg="teal.500" />
                                    <Text display={{ base: 'none', md: 'block' }} fontSize="sm">
                                        {user.username}
                                    </Text>
                                </HStack>
                            </MenuButton>
                            <MenuList>
                                <MenuItem icon={<FiUser />} as={RouterLink} to="/dashboard">
                                    Dashboard
                                </MenuItem>
                                <MenuItem icon={<FiUser />} as={RouterLink} to="/profile">
                                    Profile
                                </MenuItem>
                                <MenuItem icon={<FiLogOut />} onClick={onLogout}>
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
                                colorScheme="teal"
                            >
                                Login
                            </Button>
                            <Button
                                as={RouterLink}
                                to="/signup"
                                colorScheme="teal"
                            >
                                Sign Up
                            </Button>
                        </Stack>
                    )}
                </Flex>
            </Flex>

            {/* Mobile Drawer */}
            <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerCloseButton />
                    <DrawerHeader borderBottomWidth="1px">Menu</DrawerHeader>
                    <DrawerBody>
                        <Stack spacing={4} mt={4}>
                            <NavLinks />
                        </Stack>
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </Box>
    );
};

export default Navbar;