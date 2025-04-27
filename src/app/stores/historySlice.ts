import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import useRestAPI from "../../fetch/useRestAPI.ts";

interface HistoryItem {
    id:number;
    date:string;
    class:{ index:number };
    link?:{ url:string; text:string };
    last:boolean;
};

interface HistoryState {
    data:HistoryItem[];
    open:boolean;
    status:"idle" | "pending" | "succeeded" | "failed";
    error:string | null;
};

const initialState:HistoryState = {
    data:[],
    open:false,
    status:"idle",
    error:null
};

const scoreMax = (data:any) => {
    const max = Math.max.apply(null, data)
    var i = 0
    for (let item of data) {
        if (item === max) {
            return {
                max:max,
                index:i
            };
        };
        i++;
    };
};

const getHistoryURL = (id:string) => `cytology/history/${id}/`;

export const getHistory = createAsyncThunk(
    "history/getHsitory",
    async (values:string, {dispatch}) => {
        const patientsAPI = useRestAPI(getHistoryURL(values));
        const response = await patientsAPI.get({ params:{}, headers:{} });

        const transformedResponse:HistoryItem[] = response.data.results.map((item:any) => ({
            id:item.id,
            date:item.diagnos_date,
            class:scoreMax(item.details.probs),
            last:item.is_last
        }));

        return transformedResponse;
    }
);

const historySlice = createSlice({
    name:"history",
    initialState,
    reducers: {
        setHistoryData:(state, action:PayloadAction<HistoryItem[]>) => {
            state.data = action.payload;
        },
        handleShow:(state) => {
            state.open = true;
        },
        handleOk:(state) => {
            //Корректировка истории
            state.open = false;
        },
        handleCancel:(state) => {
            state.open = false;
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(getHistory.pending, (state) => {
            state.status = "pending";
            state.error = null;
        })
        .addCase(getHistory.fulfilled, (state, action:PayloadAction<HistoryItem[]>) => {
            state.status = "succeeded";
            state.data = action.payload;
        })
        .addCase(getHistory.rejected, (state, action) => {
            state.status = "failed";
            state.error = action.error.message || "Failed to fetch history data";
        });
    }
});

export const { setHistoryData, handleShow, handleOk, handleCancel } = historySlice.actions;
export const selectHistoryData = (state:{ history:HistoryState }) => state.history.data;

export default historySlice;