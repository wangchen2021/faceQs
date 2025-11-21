import React, { useRef } from 'react'
import { Col, Row, Card, Form, Divider, Button } from "antd"
import './index.less'
import UserAvatar from "@/components/UserAvatar"
import { useCount } from "@/hooks"
import MyTable, { type MyTableHandle } from '@/components/MyTable'

const home: React.FC = () => {
  // const { count, increment } = useCount();
  const MyTableRef = useRef<MyTableHandle>(null)
  const getTableData = () => {
    MyTableRef.current?.getTableData()
  }
  const tableUpdate = () => {
    console.log("table update");
  }
  return (
    <>
      {/* <Row className='home'>
        <Col span={8}>
          <Card onClick={increment} hoverable>
            <div className='user-info'>
              <div className='user-info-l1'>
                <UserAvatar width='150px' height='150px'></UserAvatar>
                <div className='user-info-l1-words'>
                  <div style={{ fontSize: "30px", fontWeight: "bold" }}>王晨</div>
                  <div style={{ fontSize: "15px", marginTop: "15px" }}>超级管理员{count}</div>
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
      </Row> */}
      <Button onClick={getTableData} type='primary'>获取数据</Button>
      <MyTable onUpdate={tableUpdate} ref={MyTableRef} columns={[]} getUrl='getUrl'></MyTable>
    </>
  )
}

export default home