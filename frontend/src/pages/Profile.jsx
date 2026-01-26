import { useEffect, useState } from 'react';
import {
    Box,
    Button,
    Heading,
    Text,
    VStack,
    HStack,
    Card,
    CardBody,
    FormControl,
    FormLabel,
    Input,
    useColorModeValue,
    useToast,
    Avatar,
    Badge,
    Divider,
    Grid,
    Spinner,
    Center,
    Icon,
} from '@chakra-ui/react';
import { FiUser, FiMail, FiMapPin, FiPhone, FiEdit2, FiSave } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { donorAPI, centerAPI } from '../services/api';

const Profile = () => {
    const { user } = useAuth();
    const toast = useToast();
    const cardBg = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.700');

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [profile, setProfile] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        contact: '',
        location: '',
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            setLoading(true);

            if (user?.role === 'ROLE_DONOR') {
                const response = await donorAPI.getMyProfile();
                setProfile(response.data);
                setFormData({
                    name: response.data.name || '',
                    contact: response.data.contact || '',
                    location: response.data.location || '',
                });
            } else if (user?.role === 'ROLE_STAFF') {
                const response = await centerAPI.getMyCenter();
                setProfile(response.data);
                setFormData({
                    name: response.data.name || '',
                    contact: '',
                    location: response.data.location || '',
                });
            }
        } catch (error) {
            console.log('Profile not found or error:', error);
            // Profile might not exist yet
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            if (user?.role === 'ROLE_DONOR' && profile?.id) {
                await donorAPI.update(profile.id, {
                    name: formData.name,
                    contact: formData.contact,
                    location: formData.location,
                });
                toast({
                    title: 'Profile Updated',
                    status: 'success',
                    duration: 3000,
                });
            } else if (user?.role === 'ROLE_STAFF' && profile?.id) {
                await centerAPI.update(profile.id, {
                    name: formData.name,
                    location: formData.location,
                    maxCapacity: profile.maxCapacity,
                });
                toast({
                    title: 'Center Updated',
                    status: 'success',
                    duration: 3000,
                });
            }
            setIsEditing(false);
            await fetchProfile();
        } catch (error) {
            console.error('Error updating profile:', error);
            toast({
                title: 'Error',
                description: 'Failed to update profile',
                status: 'error',
                duration: 3000,
            });
        } finally {
            setSaving(false);
        }
    };

    const getRoleBadge = (role) => {
        const roleConfig = {
            ROLE_DONOR: { color: 'green', label: 'Donor' },
            ROLE_STAFF: { color: 'blue', label: 'Staff' },
            ROLE_ADMIN: { color: 'purple', label: 'Admin' },
        };
        const config = roleConfig[role] || { color: 'gray', label: role };
        return <Badge colorScheme={config.color} fontSize="md" px={3} py={1}>{config.label}</Badge>;
    };

    if (loading) {
        return (
            <Center h="400px">
                <Spinner size="xl" color="teal.500" />
            </Center>
        );
    }

    return (
        <VStack spacing={6} align="stretch">
            {/* Header */}
            <Box>
                <Heading size="lg" mb={1}>My Profile</Heading>
                <Text color="gray.600">Manage your account information</Text>
            </Box>

            {/* Profile Card */}
            <Card bg={cardBg} border="1px" borderColor={borderColor} boxShadow="sm">
                <CardBody>
                    <VStack spacing={6} align="stretch">
                        {/* Avatar and Basic Info */}
                        <HStack spacing={6} flexWrap="wrap">
                            <Avatar
                                size="2xl"
                                name={user?.username}
                                bg="teal.500"
                            />
                            <VStack align="start" spacing={2}>
                                <Heading size="lg">{user?.username}</Heading>
                                <HStack>
                                    <Icon as={FiMail} color="gray.500" />
                                    <Text color="gray.600">{user?.email || 'No email set'}</Text>
                                </HStack>
                                {getRoleBadge(user?.role)}
                            </VStack>
                        </HStack>

                        <Divider />

                        {/* Profile Details */}
                        {profile ? (
                            <>
                                <HStack justify="space-between">
                                    <Heading size="md">
                                        {user?.role === 'ROLE_DONOR' ? 'Donor Information' : 'Center Information'}
                                    </Heading>
                                    {!isEditing ? (
                                        <Button
                                            leftIcon={<FiEdit2 />}
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setIsEditing(true)}
                                        >
                                            Edit
                                        </Button>
                                    ) : (
                                        <HStack>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => {
                                                    setIsEditing(false);
                                                    fetchProfile();
                                                }}
                                            >
                                                Cancel
                                            </Button>
                                            <Button
                                                leftIcon={<FiSave />}
                                                colorScheme="teal"
                                                size="sm"
                                                onClick={handleSave}
                                                isLoading={saving}
                                            >
                                                Save
                                            </Button>
                                        </HStack>
                                    )}
                                </HStack>

                                <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={6}>
                                    <FormControl>
                                        <FormLabel>
                                            <HStack>
                                                <Icon as={FiUser} />
                                                <Text>{user?.role === 'ROLE_DONOR' ? 'Name' : 'Center Name'}</Text>
                                            </HStack>
                                        </FormLabel>
                                        {isEditing ? (
                                            <Input
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            />
                                        ) : (
                                            <Text fontSize="lg">{profile.name || 'Not set'}</Text>
                                        )}
                                    </FormControl>

                                    {user?.role === 'ROLE_DONOR' && (
                                        <FormControl>
                                            <FormLabel>
                                                <HStack>
                                                    <Icon as={FiPhone} />
                                                    <Text>Contact</Text>
                                                </HStack>
                                            </FormLabel>
                                            {isEditing ? (
                                                <Input
                                                    value={formData.contact}
                                                    onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                                                />
                                            ) : (
                                                <Text fontSize="lg">{profile.contact || 'Not set'}</Text>
                                            )}
                                        </FormControl>
                                    )}

                                    <FormControl>
                                        <FormLabel>
                                            <HStack>
                                                <Icon as={FiMapPin} />
                                                <Text>Location</Text>
                                            </HStack>
                                        </FormLabel>
                                        {isEditing ? (
                                            <Input
                                                value={formData.location}
                                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                            />
                                        ) : (
                                            <Text fontSize="lg">{profile.location || 'Not set'}</Text>
                                        )}
                                    </FormControl>

                                    {user?.role === 'ROLE_STAFF' && profile.maxCapacity && (
                                        <FormControl>
                                            <FormLabel>Max Capacity</FormLabel>
                                            <Text fontSize="lg">{profile.maxCapacity} units</Text>
                                        </FormControl>
                                    )}
                                </Grid>
                            </>
                        ) : (
                            <Box textAlign="center" py={8}>
                                <Text color="gray.500" mb={4}>
                                    {user?.role === 'ROLE_DONOR'
                                        ? 'No donor profile found. Create one to start donating!'
                                        : 'No center assigned to your account.'}
                                </Text>
                                {user?.role === 'ROLE_DONOR' && (
                                    <Button colorScheme="teal">Create Donor Profile</Button>
                                )}
                            </Box>
                        )}
                    </VStack>
                </CardBody>
            </Card>

            {/* Account Info Card */}
            <Card bg={cardBg} border="1px" borderColor={borderColor} boxShadow="sm">
                <CardBody>
                    <Heading size="md" mb={4}>Account Information</Heading>
                    <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={6}>
                        <FormControl>
                            <FormLabel>Username</FormLabel>
                            <Text fontSize="lg">{user?.username}</Text>
                        </FormControl>
                        <FormControl>
                            <FormLabel>Role</FormLabel>
                            {getRoleBadge(user?.role)}
                        </FormControl>
                    </Grid>
                </CardBody>
            </Card>
        </VStack>
    );
};

export default Profile;
