import React from 'react'
import { Layout, Menu } from 'antd';
import * as Icon from '@ant-design/icons';
import { MenuConfig } from "@/config"
import type { ItemType } from 'antd/es/menu/interface';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store';
import { useCount } from "@/hooks"

const { Sider } = Layout;

const ASide: React.FC = () => {
    const collapsed = useSelector((state: RootState) => state.tabSlice.collapsed)
    const { count, decrement } = useCount();

    //动态获取ICON
    const iconToElement = (name: string) => {
        const IconObj = Icon as any
        return React.createElement(IconObj[name])
    }

    const createMenuItems = (config: typeof MenuConfig | undefined): ItemType[] | undefined => {
        if (!config) return undefined
        const res = []
        for (let item of config) {
            res.push({
                key: item.path,
                icon: iconToElement(item.icon),
                label: item.label,
                children: createMenuItems(item.children as any)
            })
        }
        return res
    }

    //处理菜单数据
    const items = createMenuItems(MenuConfig)

    return (
        <Sider trigger={null} collapsible collapsed={collapsed}>
            <h3 onClick={decrement} className='app-name'>晨测试{count}</h3>
            <Menu
                theme="dark"
                mode="inline"
                defaultSelectedKeys={['1']}
                items={items}
            />
        </Sider>
    )
}

export default ASide