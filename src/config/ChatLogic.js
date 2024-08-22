export const getSender = (user, users) => {
  // console.log("getSender called. Returning: ", users[0]._id === user._id ? users[1].name : users[0].name);
  return users[0]?._id === user?._id ? users[1]?.name : users[0]?.name;
};

export const getRecieverPic = (user, users) => {
  // console.log("users", users);
  // console.log("user", user);
  // console.log("getSender called. Returning: ", users[0]._id === user._id ? users[1].name : users[0].name);
  return users[0]?._id === user._id ? users[1]?.pic : users[0]?.pic;
};

export const getSenderId = (loggedUser, users) => {
  //   console.log("getSender called. Returning: ", users[0]._id === loggedUser._id ? users[1]._id : users[0]._id);
  return users[0]._id === loggedUser._id ? users[1]._id : users[0]._id;
};

export const getSenderFull = (user, users) => {
  // console.log("getSender called. Returning: ", users[0]._id === user._id ? users[1].name : users[0].name);
  return users[0]?._id === user._id ? users[1] : users[0];
};

export const isSameSender = (messages, m, i, userId) => {
  return (
    i < messages.length - 1 &&
    (messages[i + 1].sender._id !== m.sender._id ||
      messages[i + 1].sender._id === undefined) &&
    messages[i].sender._id !== userId
  );
};

export const isLastMessage = (messages, i, userId) => {
  return (
    i === messages.length - 1 &&
    messages[messages.length - 1].sender._id !== userId &&
    messages[messages.length - 1].sender._id
  );
};

export const isSameSenderMargin = (messages, m, i, userId) => {
  // console.log("messages[i + 1].sender._id: ", messages[i + 1].sender._id);
  // console.log("m.sender._id", m.sender._id);
  // console.log("messages[i].sender._id: ", messages[i].sender._id);
  // console.log("userId", userId);
  if (
    i < messages.length - 1 &&
    messages[i + 1].sender._id === m.sender._id &&
    messages[i].sender._id !== userId
  ) {
    console.log("returning 33 for ", m ," of ", i);
    return 33;
  } else if (
    (i < messages.length - 1 &&
      messages[i + 1].sender._id !== m.sender._id &&
      messages[i].sender._id !== userId) ||
    (messages.length - 1 === i && messages[i].sender._id !== userId)
  ) {
    console.log("returning 0 for ", m, " of ", i);
    return 0;
  } else {
    console.log("returning auto for ", m, " of ", i);
    return "auto";
  }
};

export const isSameUser = (messages, m, i) => {
  return i > 0 && messages[i - 1].sender._id === m.sender._id;
};
