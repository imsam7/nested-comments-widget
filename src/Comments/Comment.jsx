import React, { useState } from "react";
import { Button } from 'antd';
import TextSubmit from '../shared/TextSubmit'
import { commentActions } from '../constants';

const Comment = (props) => {
  const { commentId, commentsDetails, setCommentsDetails } = props;
  const [showReply, setVisibility] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  const comment = commentsDetails[commentId];

  const handleDelete = () => {
    setCommentsDetails((prevList) => {
      const updatedComments = prevList;
      const currentId = comment.id;
      const childComments = updatedComments[currentId]?.children;
      const parentId = comment.parentId;
      const parentComment = updatedComments[parentId];

      if (childComments && childComments.length !== 0) {
        childComments.forEach((id) => delete updatedComments[id]);
      }
      delete updatedComments[currentId];

      if (parentId === null) {
        updatedComments.firstLevelIds = prevList.firstLevelIds.filter(
          (id) => id !== currentId
        );
        return { ...updatedComments };
      }
      const updatedParentComment = {
        ...parentComment,
        children: parentComment.children.filter((id) => id !== currentId),
      };
      return {
        ...updatedComments,
        [parentId]: updatedParentComment,
      };
    });
  };

  const handleReply = () => setVisibility(true);

  const handleEdit = () => setShowEdit(true);

  const formatDate = (epoch) => new Date(epoch).toLocaleString()

  return (
    <>
      <div className="relative flex justify-center items-center overflow-hidden gap-2">
        {showEdit ? (
          <TextSubmit
            action={commentActions.EDIT_COMMENT}
            placeholder=""
            setVisibility={setShowEdit}
            parentComment={comment}
            setCommentsDetails={setCommentsDetails}
          />
        ) : <> <div className="max-w-[180px] flex-1 break-words text-bold p-2">
          {comment.text}

        </div>
          {formatDate(comment.timeStamp)}
          <Button
            onClick={handleDelete} danger>DELETE</Button>
          <Button
            onClick={handleReply}>REPLY</Button>
          <Button
            onClick={handleEdit} type="link">EDIT</Button>
        </>
        }
      </div>
      <div className="relative inset-0 left-10">
        {showReply && (
          <TextSubmit
          action={commentActions.REPLY_COMMENT}
          placeholder="Enter your reply here"
            setVisibility={setVisibility}
            parentComment={comment}
            setCommentsDetails={setCommentsDetails}
          />
        )}
        {comment?.children.map((id) => {
          return (
            <div className="my-6" key={id}>
              <Comment
                commentId={id}
                commentsDetails={commentsDetails}
                setCommentsDetails={setCommentsDetails}
              />
            </div>
          );
        })}
      </div>
    </>
  );
};

export default Comment;
