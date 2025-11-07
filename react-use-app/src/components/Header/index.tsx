import React from 'react'
import "./index.less"
import { Layout, Avatar, Dropdown, type MenuProps } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import ReactSvg from "@/assets/react.svg"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from '@/store';
import { collapseMenu } from '@/store/reducers/tab';
const { Header } = Layout;
const index: React.FC = () => {
  const collapsed = useSelector((state: RootState) => state.tabSlice.collapsed)
  const dispatch = useDispatch<AppDispatch>()

  const logout = () => {
    alert("注销成功")
  }

  const setCollapse = () => {
    dispatch(collapseMenu())
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
  return (
    <Header className="header" style={{ padding: 0 }}>
      {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
        className: 'trigger',
        onClick: () => setCollapse(),
      })}
      <Dropdown placement='bottom' menu={{ items }}>
        <Avatar size='small' className='avatar' src={<img className='avatar-img' src={ReactSvg}></img>}></Avatar>
      </Dropdown>
    </Header>
  )
}

export default index