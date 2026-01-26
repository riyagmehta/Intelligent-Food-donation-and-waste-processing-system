import { Box, Container, useColorModeValue } from '@chakra-ui/react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const Layout = ({ children, user, onLogout, showSidebar = false, role = 'ROLE_DONOR' }) => {
    const bgColor = useColorModeValue('gray.50', 'gray.900');

    return (
        <Box minH="100vh" bg={bgColor}>
            <Navbar user={user} onLogout={onLogout} />

            <Box display="flex">
                {showSidebar && <Sidebar role={role} />}

                <Box
                    flex={1}
                    ml={{ base: 0, md: showSidebar ? '260px' : 0 }}
                    p={{ base: 4, md: 6, lg: 8 }}
                    transition="margin 0.3s ease"
                    minH="calc(100vh - 64px)"
                >
                    <Container maxW="container.xl" px={{ base: 0, md: 4 }}>
                        {children}
                    </Container>
                </Box>
            </Box>
        </Box>
    );
};

export default Layout;
