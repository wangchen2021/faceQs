import React from 'react'
import { Col, Row, Card, Form, Divider } from "antd"
import './index.less'
import UserAvatar from "@/components/UserAvatar"

const home: React.FC = () => {
  return (
    <Row className='home'>
      <Col span={8}>
        <Card hoverable>
          <div className='user-info'>
            <div className='user-info-l1'>
              <UserAvatar width='150px' height='150px'></UserAvatar>
              <div className='user-info-l1-words'>
                <div style={{ fontSize: "30px", fontWeight: "bold" }}>王晨</div>
                <div style={{ fontSize: "15px", marginTop: "15px" }}>超级管理员</div>
              </div>
            </div>
            <Divider></Divider>
            <div className='user-info-l2'>
              <Form>
                <Form.Item label="上次登录时间：">2019-01-01</Form.Item>
                <Form.Item label="上次登录地点：">上海</Form.Item>
              </Form>
            </div>
          </div>
        </Card>
      </Col>
      <Col span={16}></Col>
    </Row>
  )
}

export default home