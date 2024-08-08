import {
  Avatar,
  Box,
  Button,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Text,
} from "@chakra-ui/react";
import logo from "../../assets/chatlogominus.png";
import "./Header.css";
import ProfileModal from "../ProfileModal/ProfileModal";
import { ChatState } from "../Context/ChatProvider";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";

const Header = () => {
  const { user } = ChatState();
  // console.log(user?.name);

  const logoutHandler = () => {

    localStorage.removeItem("userInfo");
    window.location.reload();
  };

  return (
    <div className="header">
      <Box
        w={"5%"}
        h={"100%"}
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"}
        // border={"1px solid Gray"}
      >
        <img src={logo} alt="logo" />
      </Box>

      <Box
        w={"85%"}
        h={"100%"}
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"}
        // border={"1px solid Gray"}
      >
        <Text>Chai-N-Chat</Text>
      </Box>
      <Box
        w={"9%"}
        h={"100%"}
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"}
        // border={"1px solid Gray"}
      >
        <Menu>
          <MenuButton p={1}>
            <BellIcon fontSize={"2xl"} m={1} />
          </MenuButton>
          <MenuList>
            <MenuItem onClick={logoutHandler}>Notification 1</MenuItem>
            <MenuItem>Notification 2</MenuItem>
            <MenuItem>Notification 3</MenuItem>
          </MenuList>
        </Menu>
        <Menu>
          <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
            <Avatar
              size={"sm"}
              cursor={"pointer"}
              name={user?.name}
              src="https://cdn-icons-png.flaticon.com/512/147/147144.png"
            />
          </MenuButton>
            <MenuList>
              <ProfileModal user={user}>
                <MenuItem>My Profile</MenuItem>
              </ProfileModal>
              <MenuDivider />
              <MenuItem onClick={logoutHandler}>Log Out</MenuItem>
            </MenuList>
        </Menu>
      </Box>
    </div>
  );
};

export default Header;
