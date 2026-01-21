import client from "../api/client";

export interface IPage {
    _id: string;
    title: string;
    slug: string;
    content: string;
    status: number; // 0: Deleted, 1: Active, 2: Inactive
    createdAt: string;
    updatedAt: string;
}

export type CreatePageData = Pick<IPage, 'title' | 'slug' | 'content' | 'status'>;
export type UpdatePageData = Partial<CreatePageData>;

export interface IPageResponse {
    docs: IPage[];
    totalDocs: number;
    limit: number;
    totalPages: number;
    page: number;
    pagingCounter: number;
    hasPrevPage: boolean;
    hasNextPage: boolean;
    prevPage: number | null;
    nextPage: number | null;
}

export interface PageQueryParams {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
}

export const pageServices = {
    // Admin: Create Page
    create: async (data: CreatePageData) => {
        const response = await client.post<IPage>('/pages', data);
        return response.data;
    },

    // Admin: Get All Pages (Paginated)
    getAll: async (params?: PageQueryParams) => {
        const response = await client.get<IPageResponse>('/pages', { params });
        return response.data;
    },

    // Public: Get Page by Slug
    getBySlug: async (slug: string) => {
        const response = await client.get<IPage>(`/pages/${slug}`);
        return response.data;
    },

    // Admin: Get Page by Slug (All statuses)
    getAdminBySlug: async (slug: string) => {
        const response = await client.get<IPage>(`/pages/admin/${slug}`);
        return response.data;
    },

    // Admin: Update Page
    update: async (id: string, data: UpdatePageData) => {
        const response = await client.put<IPage>(`/pages/${id}`, data);
        return response.data;
    },

    // Admin: Delete Page
    delete: async (id: string) => {
        const response = await client.delete(`/pages/${id}`);
        return response.data;
    }
};
