import toast from "react-hot-toast";
import { useMutation , useQueryClient, useQueryClient } from "@tanstack/react-query";

const useFollow = () => {
     const queryClient = useQueryClient();

     const {mutate:follow, isPending} = useMutation({
        mutationFn: async(userId) =>{
            try {
                const res = await fetch(`/api/users/follow/${userId}`,{
                    method: "POST",
                })
                const data = res.json();
                if(!res.ok){
                    throw new Error(data.error || "Wrong");
                }
                return data;
            } catch (error) {
                throw new Error(error);
            }

        },
        onSuccess: () =>{
            toast.success(`You followed ${data.fullName}`);
            Promise.all([
                queryClient.invalidateQueries({queryKey: ['suggestedUsers']}), //dobara render ho who to follow so jis ko kia vo ab na dhike
                queryClient.invalidateQueries({queryKey: ['authUser']})
            ])
            
        },
        onError:(error) =>{
            toast.error(error.message);
        }
     });
     return {follow, isPending};
}

export default useFollow;