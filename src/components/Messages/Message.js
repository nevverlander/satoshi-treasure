import React from "react";
import moment from "moment";
import { Comment, Image } from "semantic-ui-react";

const isOwnMessage = (message, user) => {
  return message.user.id === user.uid ? "message__self" : "";
};

const isImage = message => {
  return message.hasOwnProperty("image") && !message.hasOwnProperty("content");
};

const parseTime = timestamp => {
  if (timestamp) {
    let timeAgo = moment
      .unix(timestamp.seconds)
      .utc()
      .fromNow();
    return timeAgo;
  }
  return "";
};

const Message = ({ message, user }) => (
  <Comment>
    <Comment.Avatar src={message.user.avatar} />
    <Comment.Content className={isOwnMessage(message, user)}>
      <Comment.Author as="a">{message.user.name}</Comment.Author>
      <Comment.Metadata>{parseTime(message.timestamp)}</Comment.Metadata>
      {isImage(message) ? (
        <Image src={message.image} className="message__image" />
      ) : (
        <Comment.Text className="message__text">{message.content}</Comment.Text>
      )}
    </Comment.Content>
  </Comment>
);

export default Message;
