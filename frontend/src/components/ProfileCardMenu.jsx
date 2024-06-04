import {
    Menu,
    MenuHandler,
    MenuList,
    MenuItem,
    Avatar,
    Typography,
  } from "@material-tailwind/react";
  import LogOutBtn from "./LogOutBtn";
  import { useEffect, useState } from "react";
  
  export default function ProfileCardMenu({ handleLogout, version, placement}) {
    const [showMenu, setShowMenu] = useState(false);
    const [compVersion, setCompVersion] = useState('large');
    const ProfileImage = "https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80"
    useEffect(() => {
      //   console.log('version', version)
      //   console.log((version==="large"));
      setCompVersion(version);
    }, [])
  
    return (
      <Menu
        dismiss={{
          click: true,
          scroll: true
        }}
        placement={placement}
      >
        <MenuHandler >
          <Avatar
            variant="circular"
            alt={localStorage.getItem('username') ? String(JSON.parse(localStorage.getItem('username'))) : "tania andrew"}
            className="cursor-pointer outline outline-2 outline-offset-2"
            src={localStorage.getItem('avatar') ? String(JSON.parse(localStorage.getItem('avatar'))) : "https://docs.material-tailwind.com/img/face-2.jpg"}
          />
        </MenuHandler>
        <MenuList className="min-w-0">
          <div className=" flex justify-center bg-white outline-none scale-75">
            <LogOutBtn handleLogout={handleLogout} />
          </div>
        </MenuList>
      </Menu>
    );
  }