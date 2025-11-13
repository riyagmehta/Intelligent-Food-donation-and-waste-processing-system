import { Box, Container } from '@chakra-ui/react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const Layout = ({ children, user, onLogout, showSidebar = false, role = 'ROLE_DONOR' }) => {
    return (
        <Box minH="100vh" bg="gray.50">
            <Navbar user={user} onLogout={onLogout} />

            <Box display="flex">
                {showSidebar && <Sidebar role={role} />}

                <Box
                    flex={1}
                    ml={{ base: 0, md: showSidebar ? '250px' : 0 }}
                    p={6}
                    transition="margin 0.3s"
                >
                    <Container maxW="container.xl">
                        {children}
                    </Container>
                </Box>
            </Box>
        </Box>
    );
};

export default Layout;