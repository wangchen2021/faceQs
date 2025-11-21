// src/components/MyTable.tsx
import React, { useEffect, useImperativeHandle, forwardRef } from 'react';
import { Table, type TableProps, type TableColumnType } from 'antd';

// 1. 定义暴露给父组件的方法类型（关键）
export interface MyTableHandle {
    getTableData: () => void;
}

// 2. 定义组件 props 类型
interface MyTableProps<T> extends Omit<TableProps<T>, 'columns'> {
    columns: Array<{
        key: string;
        title: string;
        dataIndex: string;
        render?: (text: any, record: T) => React.ReactNode;
    }>;
    getUrl: string;
    onUpdate: () => void
}

// 3. 使用 forwardRef 转发 ref，并通过 useImperativeHandle 暴露方法
const MyTable = forwardRef<MyTableHandle, MyTableProps<object>>(
    ({ columns, dataSource, bordered = true, getUrl, onUpdate, ...rest }, ref) => {
        // 内部方法
        const getTableData = () => {
            console.log("getTableData" + getUrl);
            onUpdate()
        };

        // 暴露方法给父组件
        useImperativeHandle(ref, () => ({
            getTableData, // 暴露 getTableData 方法
        }));

        useEffect(() => {
            getTableData();
        }, []);

        const antdColumns = columns.map(col => ({
            ...col,
        })) as TableColumnType<object>[];

        return (
            <Table
                {...rest}
                columns={antdColumns}
                dataSource={dataSource}
                bordered={bordered}
                rowKey="id"
            />
        );
    }
);

export default MyTable;