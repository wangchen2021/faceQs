import React from 'react'
import ReactSvg from "@/assets/react.svg"
import { Avatar, Dropdown, type MenuProps } from 'antd'

interface UserAvatarProps {
    showMenu?: true | false
    width?: string
    height?: string
}

const index: React.FC<UserAvatarProps> = ({ showMenu, width = "15px", height = "15px" }) => {
    const logout = () => {
        alert("注销成功")
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