import React from 'react'
import ReactSvg from "@/assets/react.svg"
import { Avatar, Dropdown, type MenuProps } from 'antd'
import { postAction } from "@/request"
import { useNavigate } from "react-router-dom"

interface UserAvatarProps {
    showMenu?: true | false
    width?: string
    height?: string
}

const index: React.FC<UserAvatarProps> = ({ showMenu, width = "15px", height = "15px" }) => {
    const navigate = useNavigate();
    const logout = () => {
        // fechRequest({
        //     url: "http://localhost:3000/testPost",
        //     method: "POST",
        //     data: { test: "testdata" },
        //     headers: { 'Content-Type': 'application/json' }
        // })
        //     .then((res) => {
        //         console.log(res);
        //     })
        postAction({
            url: "/testPost",
            data: { test: "testdata" },
        }).then((res) => {
            console.log(res.data);
            navigate("/login");
        })
    }

    const items: MenuProps['items'] = [
        {
            key: '1',
            label: (
                <a>个人中心</a>
            ),
        },
        {
            key: '2',
            label: (
                <a onClick={logout}>退出</a>
            ),
        },
    ]

    return showMenu ? (
        <Dropdown placement='bottom' menu={{ items }}>
            <Avatar className='avatar' src={<img className='avatar-img' src={ReactSvg}></img>}></Avatar>
        </Dropdown>
    ) : (
        <Avatar style={{ height, width }} src={<img style={{ cursor: showMenu ? "pointer" : "" }} className='avatar-img' src={ReactSvg}></img>}></Avatar>
    )
}

export default index