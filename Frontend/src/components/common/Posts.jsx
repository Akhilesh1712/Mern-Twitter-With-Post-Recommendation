import Post from "./Post";
import PostSkeleton from "../skeletons/PostSkeleton";
import {useQuery} from "@tanstack/react-query";
import { useEffect } from "react";

const Posts = ({feedPost,username,userId}) => {
	

 
	const getPostEndpoints = () =>{
		switch (feedPost) {
			case "forYou":
				return "/api/posts/all"
				break;
		    case "following":
				return "/api/posts/following";
				break;
			case "posts":
				return `/api/posts/user/${username}`;
			case "likes":
				return `/api/posts/likes/${userId}`;		
			default:
				return "/api/posts/all";
		}
	}

	const POST_ENDPOINT = getPostEndpoints();

	const {data,isLoading , refetch , isRefetching} = useQuery({
            queryKey: ["posts"],
			queryFn: async() => {
				try {
					const res = await fetch(POST_ENDPOINT);
					const data = await res.json();

					if(!res.ok){
						throw new Error(data.error || "Something went wrong in it");
					}

					return data;
				} catch (error) {
					throw new Error(error);
				}
			},
	})

	useEffect(() =>{
		refetch();
	},[feedPost , refetch]); //when ever feestype chages means click to foryou or following is shoud refecth or re re-render it because agar foryuo per pahale to vo switch to for you ke leye chal gya ab ager following per jaye ge to dobara chalena padega

	return (
		<>
			{(isLoading || isRefetching) && (
				<div className='flex flex-col justify-center'>
					<PostSkeleton />
					<PostSkeleton />
					<PostSkeleton />
				</div>
			)}
			{!isLoading && !isRefetching && data?.length === 0 && <p className='text-center my-4'>No posts in this tab. Switch 👻</p>}
			{!isLoading && !isRefetching && data && (
				<div>
					{data.map((post) => (
						<Post key={post._id} post={post} />
					))}
				</div>
			)}
		</>
	);
};
export default Posts;