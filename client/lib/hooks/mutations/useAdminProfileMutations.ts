import { adminProfileServices } from '@/lib/services/adminProfileServices';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/api/queryClient';
import toast from 'react-hot-toast';

export const useAdminProfileMutations = () => {
    const queryClient = useQueryClient();

    const useUpdateProfileImage = () => {
        return useMutation({
            mutationFn: (file: File) => adminProfileServices.updateProfileImage(file),
            onSuccess: async (data) => {
                console.log('Mutation success, data:', data);
                // Update cache immediately
                queryClient.setQueryData([queryKeys.admin.me], (old: any) => {
                    if (!old) {
                        console.log('No old data found in cache for adminMe');
                        return old;
                    }
                    console.log('Updating cache with new image:', data.profileImage);
                    return {
                        ...old,
                        admin: {
                            ...old.admin,
                            profileImage: data.profileImage
                        }
                    };
                });
                // Force refetch to ensure data is synced
                await queryClient.refetchQueries({ queryKey: [queryKeys.admin.me] });
                toast.success('Profile image updated successfully');
            },
            onError: (error: any) => {
                toast.error(error?.response?.data?.message || 'Failed to update profile image');
            }
        });
    };

    const useDeleteProfileImage = () => {
        return useMutation({
            mutationFn: () => adminProfileServices.deleteProfileImage(),
            onSuccess: async () => {
                // Update cache immediately
                queryClient.setQueryData([queryKeys.admin.me], (old: any) => {
                    if (!old) return old;
                    return {
                        ...old,
                        admin: {
                            ...old.admin,
                            profileImage: ''
                        }
                    };
                });
                await queryClient.refetchQueries({ queryKey: [queryKeys.admin.me] });
                toast.success('Profile image deleted successfully');
            },
            onError: (error: any) => {
                toast.error(error?.response?.data?.message || 'Failed to delete profile image');
            }
        });
    };

    return {
        useUpdateProfileImage,
        useDeleteProfileImage
    };
};
