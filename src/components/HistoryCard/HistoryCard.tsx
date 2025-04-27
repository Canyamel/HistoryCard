"use client"

import "./HistoryCard.css";
import React from "react";
import { Button, Modal, Timeline, Card, Flex } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../app/stores.ts";
import { handleOk, handleCancel } from "../../app/stores/historySlice.ts";

export default function HistoryCard() {
    const dispatch = useDispatch();
    const { data, open } = useSelector((state:RootState) => state.history);

    const timelineItems = data.map(data => ({
        key:data.id,
        dot:<div className={`dot ${data.last ? "dot-blue" :"dot-grey"}`} />,
        children:(
            <Card size="small" style={{
                    boxShadow:"0px 2px 8px rgba(0, 0, 0, 0.1)",
                    width:"250px",
                    fontSize:"14px"
                }}
            >
                <span className={`tag ${data.last ? "tag-blue" :"tag-grey"}`}>
                    {data.last === true ? "Последнее изменение" : "Обновлён"}
                </span>
                <time dateTime={data.date}>{new Date(data.date).toLocaleDateString()}</time>
                <p>
                    Bethesda {data.class.index === 0? "I": data.class.index === 1? "II": data.class.index === 2? "III": data.class.index === 3? "IV": data.class.index === 4? "V": "VI"}
                </p>
                {data.link && (
                    <a
                        href={data.link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        {data.link.text}
                    </a>
                )}
            </Card>
        ),
    }));

    const modalTitle = (
        <div className="title">
            История изменений
        </div>
    );

    const modalFooter = ([
        <Button
            className="button button-cancel"
            onClick={() => dispatch(handleCancel())}
        >
            ОТМЕНА
        </Button>,
        <Button
            className="button button-ok"
            onClick={() => dispatch(handleOk())}
        >
            КОРРЕКТИРОВКА
        </Button>
    ]);

    return(
        <>
            <Modal
                className="timeline-container modal"
                title={modalTitle}
                open={open}
                onOk={() => dispatch(handleOk())}
                onCancel={() => dispatch(handleCancel())}
                width={600}
                footer={modalFooter}
            >
                <Flex className="flex" justify="center" style={{marginBottom:"30px"}}>
                    <Timeline items={timelineItems} />
                </Flex>
            </Modal>
        </>
    );
};