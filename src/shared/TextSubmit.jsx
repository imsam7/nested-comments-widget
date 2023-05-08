import React, { useState } from "react";
import { Input, Button } from 'antd';
import { getUniqueId } from "./../utils";
import { commentActions } from '../constants';

const TextSubmit = (props) => {
    const { action, placeholder, setVisibility, parentComment, setCommentsDetails } = props;
    const [textValue, setTextValue] = useState(() => action === "EDIT" ? parentComment.text : "");

    const onChange = (e) => {
        setTextValue(e.target.value);
    };

    const handleAction = () => {
        switch (action) {
            case commentActions.EDIT_COMMENT:
                editReply();
                break;
            case commentActions.REPLY_COMMENT:
                addReply();
                break;
            case commentActions.ADD_COMMENT:
                addComment();
                break;
            default:
                break;
        }
    }

    const editReply = () => {
        if (textValue) {
            setCommentsDetails((prevList) => {
                const updatedParentComment = {
                    ...{ ...parentComment, ...{ text: textValue, timeStamp: new Date().getTime() } },
                };
                return {
                    ...prevList,
                    [parentComment.id]: updatedParentComment,
                };
            });
            setTextValue("");
            setVisibility(false);
        }
    };

    const addReply = () => {
        if (textValue) {
            const newComment = {
                id: getUniqueId(),
                text: textValue,
                children: [],
                parentId: parentComment.id,
                timeStamp: new Date().getTime()
            };
            setCommentsDetails((prevList) => {
                const updatedParentComment = {
                    ...parentComment,
                    children: parentComment.children.concat(newComment.id),
                };
                return {
                    ...prevList,
                    [parentComment.id]: updatedParentComment,
                    [newComment.id]: newComment,
                };
            });
            setTextValue("");
            setVisibility(false);
        }
    };

    const addComment = () => {
        const newId = getUniqueId();
        const newComment = {
            id: newId,
            text: textValue,
            children: [],
            parentId: null,
            timeStamp: new Date()
        };
        setCommentsDetails((prevList) => ({
            ...prevList,
            firstLevelIds: prevList.firstLevelIds ? prevList.firstLevelIds.concat(newId) : [newId],
            [newId]: newComment,
        }));
        setTextValue("");
    };

    return (
        <div className="mt-6">
            <Input placeholder={placeholder}
                onChange={onChange}
                value={textValue}
                className="mr-2 w-[300px]"
                maxLength={16}
            />
            <Button disabled={!textValue}
                onClick={handleAction}>{action}</Button>
        </div>
    );
}

export default TextSubmit;
