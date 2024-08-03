import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import axios from "axios";
import { AllUsersResponse, DeleteUserRequest, MessageResponse, UserResponse } from "../../types/api-types";
import { User } from "../../types/types";


export const userAPI = createApi({
    reducerPath: "userApi", 
    baseQuery: fetchBaseQuery({ baseUrl: `${import.meta.env.VITE_SERVER}/api/v1/user/`}),
    tagTypes:["users"],
     endpoints: (builder) => ({
        login: builder.mutation<MessageResponse, User>({ // here, user will be an User type from types.ts and the query we will get from it will be an MessageResponse type from api-types.ts. Used the typescript functionality of defining data type
            query:(user) => ({
            url: `"new"`,
            method: "POST",
            body: user,
        }),
        invalidatesTags:["users"]
    }),
        deleteUser: builder.mutation<MessageResponse, DeleteUserRequest>({ // here, user will be an User type from types.ts and the query we will get from it will be an MessageResponse type from api-types.ts. Used the typescript functionality of defining data type
            query:({userId, adminUserId}) => ({
            url: `${userId}?id=${adminUserId}`,
            method: "DELETE",
        }),
        invalidatesTags:["users"]
    }),
        allUsers:builder.query<AllUsersResponse,string>({
            query:id => `all?id=${id}`,
            providesTags:["users"]  // = tag is used
        })
     }),
    });

export const getUser = async (id: string) => {
    try{
        const { data}:{data : UserResponse} = await axios.get(`${import.meta.env.VITE_SERVER}/api/v1/user/${id}`); // safe id - ocjA0ZRcytdYb8PHLZsAYt6i5DY2
        return data;
    }
    catch(error){
        throw error
    }
}

export const {useLoginMutation, useAllUsersQuery, useDeleteUserMutation } = userAPI;    