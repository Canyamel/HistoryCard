import axios from "axios";

export const BASE_URL = "http://109.73.201.164:8000/api/v3/";
axios.defaults.headers.common["Authorization"] = `Bearer ${localStorage.getItem("access")}`

const useRestAPI = (url:string) => {
    return {
        get: async ({params, headers}) => {
            const response = await axios({
                method:"get",
                url:`${BASE_URL}${url}${params ? "?" + new URLSearchParams(params).toString() : ""}`,
                headers:headers
            });
            return response;
        },
        post: async ({body, headers}) => {
            const response = await axios({
                method:"post",
                url:BASE_URL + url,
                data:body,
                headers:headers
            });
            return response;
        },
        patch: async ({body, headers}) => {
            const response = await axios({
                method:"patch",
                url: BASE_URL + url,
                data:body,
                headers:headers
            });
            return response;
        }
    };
};

export default useRestAPI;
