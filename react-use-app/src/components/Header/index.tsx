import React from 'react'
import "./index.less"
import { Layout } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import UserAvatar from '@/components/UserAvatar';
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from '@/store';
import { collapseMenu } from '@/store/reducers/tab';
const { Header } = Layout;
const index: React.FC = () => {
  const collapsed = useSelector((state: RootState) => state.tabSlice.collapsed)
  const dispatch = useDispatch<AppDispatch>()
  const setCollapse = () => {
    dispatch(collapseMenu())
  }
  return (
    <Header className="header" style={{ padding: 0 }}>
      {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
        className: 'trigger',
        onClick: () => setCollapse(),
      })}
      <UserAvatar showMenu={true} />
    </Header>
  )
}

export default index