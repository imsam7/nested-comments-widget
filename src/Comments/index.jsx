import React, { useState, useEffect } from "react";
import Comment from "./Comment";
import TextSubmit from '../shared/TextSubmit'
import { commentActions } from '../constants';

const Comments = () => {
  const initialCommentsDetails = {
    firstLevelIds: null,
  }

  const [commentsDetails, setCommentsDetails] = useState(initialCommentsDetails);

  useEffect(() => {
    const commentsDetailsStorage = localStorage.getItem("commentsDetails")
    if (commentsDetailsStorage !== null)
      setCommentsDetails(JSON.parse(commentsDetailsStorage))
    else persistCommentsDetails(initialCommentsDetails)
  }, [])

  useEffect(() => {
    console.log(commentsDetails)
    if (commentsDetails.firstLevelIds)
      persistCommentsDetails(commentsDetails)
  }, [commentsDetails])

  const persistCommentsDetails = (commentsData) => {
    localStorage.setItem("commentsDetails", JSON.stringify(commentsData))
  }

  return (
    <div>
      <TextSubmit
        action={commentActions.ADD_COMMENT}
        placeholder="Enter your comment here"
        setCommentsDetails={setCommentsDetails}
      />
      {commentsDetails.firstLevelIds?.map((id) => {
        return (
          <div key={id} className="my-6 pl-8 flex flex-col">
            <Comment
              commentId={id}
              commentsDetails={commentsDetails}
              setCommentsDetails={setCommentsDetails}
            />
          </div>
        );
      })}
    </div>
  );
};

export default Comments;
