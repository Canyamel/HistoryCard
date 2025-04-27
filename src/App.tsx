import "./App.css";

import React, { useEffect } from "react";
import axios from "axios";
import { Button } from "antd";
import HistoryCard from "./components/HistoryCard/HistoryCard.tsx"
import { useDispatch, useSelector } from "react-redux";
import { RootState } from './app/stores.ts';
import { getHistory, handleShow } from "./app/stores/historySlice.ts";

function App() {
    const dispatch = useDispatch();
    const { status, error } = useSelector((state: RootState) => state.history);

    useEffect(() => {
        const formData = new FormData();
        formData.append("email", "admin@admin.ad"); ////////////////////////
        formData.append("password", "admin"); ////////////////////////
        axios.post( "http://109.73.201.164:8000/api/v3/auth/login/", formData)
            .then((response) => {
                localStorage.setItem("access", response.data.access)
            }
        );
        dispatch(getHistory("1")); ////////////////////////
    }, [dispatch]);

    return (
        <div className="App">
            <header className="App-header">
            {status === "succeeded" ? (
                <>
                    <Button
                        size="large"
                        color="primary"
                        variant="outlined"
                        onClick={() => dispatch(handleShow())}
                    >
                        {"История изменений"}
                    </Button>
                    <HistoryCard />
                </>
            ) : status === "failed" ? (
                <div style={{marginTop:"50px", color:"red"}}>
                    Ошибка загрузки данных: {error || "Неизвестная ошибка"}
                </div>
            ) : (
                <div style={{marginTop:"50px"}}>Загрузка...</div>
            )}
            </header>
        </div>
    );
}

export default App;