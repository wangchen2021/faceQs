import React from 'react';
import MySider from '../components/Aside';
import Header from "@/components/Header"
import { Layout } from 'antd';
import { Outlet } from "react-router-dom"

const { Content } = Layout;

const Main: React.FC = () => {
    return (
        <Layout className='main-container'>
            <MySider />
            <Layout className="site-layout">
                <Header />
                <Content
                    className="site-layout-background"
                    style={{
                        margin: '24px 16px',
                        padding: 24,
                        minHeight: 280,
                        backgroundColor: "rgba(252, 252, 252, 1)"
                    }}
                >
                    <Outlet></Outlet>
                </Content>
            </Layout>
        </Layout>
    );
};

export default Main;