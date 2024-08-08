export const getSender = (user, users) => {
    // console.log("getSender called. Returning: ", users[0]._id === user._id ? users[1].name : users[0].name);
    return users[0]._id === user._id ? users[1].name : users[0].name;
};

export const getSenderId = (loggedUser, users) => {
//   console.log("getSender called. Returning: ", users[0]._id === loggedUser._id ? users[1]._id : users[0]._id);
  return users[0]._id === loggedUser._id ? users[1]._id : users[0]._id;
};

export const getSenderFull = (user, users) => {
  // console.log("getSender called. Returning: ", users[0]._id === user._id ? users[1].name : users[0].name);
  return users[0]._id === user._id ? users[1] : users[0];
};
