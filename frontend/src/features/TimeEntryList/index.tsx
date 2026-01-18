import React, { useEffect, useState } from 'react';
import { Table, Card, Typography, Tag, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { TimeEntry } from '../../types';
import { timeEntriesApi } from '../../api/timeEntriesApi';
import dayjs from 'dayjs';

const { Text } = Typography;

interface Props {
  refreshTrigger: number;
}

export const TimeEntryList: React.FC<Props> = ({ refreshTrigger }) => {
  const [data, setData] = useState<TimeEntry[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const entries = await timeEntriesApi.getAll();
      setData(entries);
    } catch (error) {
      console.error(error);
      message.error('Не вдалося завантажити історію');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [refreshTrigger]);

  const totalHours = data.reduce((sum, entry) => sum + entry.hours, 0);

  const columns: ColumnsType<TimeEntry> = [
    {
      title: 'Дата',
      dataIndex: 'date',
      key: 'date',
      render: (date: string) => dayjs(date).format('DD.MM.YYYY'),
      sorter: (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    },
    {
      title: 'Проект',
      dataIndex: 'projectName',
      key: 'projectName',
      render: (text: string) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: 'Години',
      dataIndex: 'hours',
      key: 'hours',
      render: (hours: number) => <Text strong>{hours} год.</Text>,
    },
    {
      title: 'Опис',
      dataIndex: 'description',
      key: 'description',
    },
  ];

  return (
    <Card 
      title={`Історія записів (Всього: ${totalHours} год.)`} 
      variant='borderless'
      loading={loading && data.length === 0}
    >
      <Table 
        dataSource={data} 
        columns={columns} 
        rowKey="id" 
        pagination={{ pageSize: 5 }} 
      />
    </Card>
  );
};