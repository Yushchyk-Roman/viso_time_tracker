import React, { useEffect, useState } from 'react';
import { 
  Table, Card, Typography, Tag, message, Button, Space, Popconfirm, 
  Modal, Form, DatePicker, Select, InputNumber, Input, Statistic, Tooltip 
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { 
  DeleteOutlined, EditOutlined, ClockCircleOutlined, 
  CalendarOutlined, ProjectOutlined 
} from '@ant-design/icons';
import type { TimeEntry } from '../../types';
import { timeEntriesApi } from '../../api/timeEntriesApi';
import { projectsApi, type Project } from '../../api/projectsApi';
import dayjs from 'dayjs';

const { Text } = Typography;

interface Props {
  refreshTrigger: number;
  onUpdate?: () => void;
}

export const TimeEntryList: React.FC<Props> = ({ refreshTrigger, onUpdate }) => {
  const [data, setData] = useState<TimeEntry[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<TimeEntry | null>(null);
  const [form] = Form.useForm();

  const fetchData = async () => {
    setLoading(true);
    try {
      const [entriesData, projectsData] = await Promise.all([
        timeEntriesApi.getAll(),
        projectsApi.getAll()
      ]);
      
      setData(entriesData);
      setProjects(projectsData);
    } catch (error) {
      console.error(error);
      message.error('Не вдалося завантажити дані');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [refreshTrigger]);

  const handleDelete = async (id: number) => {
    try {
      await timeEntriesApi.delete(id);
      message.success('Запис видалено');
      fetchData();
      if (onUpdate) onUpdate();
    } catch (error) {
      message.error('Помилка видалення');
    }
  };

  const handleEditClick = (record: TimeEntry) => {
    setEditingEntry(record);
    form.setFieldsValue({
      ...record,
      date: dayjs(record.date),
    });
    setIsModalOpen(true);
  };

  const handleEditSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (!editingEntry) return;

      await timeEntriesApi.update(editingEntry.id, {
        ...values,
        date: values.date.toISOString(),
      });

      message.success('Запис оновлено!');
      setIsModalOpen(false);
      setEditingEntry(null);
      fetchData();
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Помилка оновлення';
      message.error(msg);
    }
  };

  const totalHours = data.reduce((sum, entry) => sum + entry.hours, 0);

  const columns: ColumnsType<TimeEntry> = [
    {
      title: 'Дата',
      dataIndex: 'date',
      key: 'date',
      width: 130,
      render: (date: string) => (
        <Space>
          <CalendarOutlined style={{ color: '#8c8c8c' }} />
          <Text strong>{dayjs(date).format('DD.MM.YYYY')}</Text>
        </Space>
      ),
      sorter: (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    },
    {
      title: 'Проект',
      dataIndex: 'projectName',
      key: 'projectName',
      width: 180,
      render: (projectName: string) => {
        const project = projects.find(p => p.name === projectName);
        const color = project ? project.color : 'default';

        return (
          <Tag icon={<ProjectOutlined />} color={color} style={{ borderRadius: '10px' }}>
            {projectName}
          </Tag>
        );
      },
    },
    {
      title: 'Години',
      dataIndex: 'hours',
      key: 'hours',
      width: 120,
      render: (hours: number) => (
        <Tag color="blue" style={{ fontSize: '14px', padding: '2px 10px' }}>
          {hours} год.
        </Tag>
      ),
    },
    {
      title: 'Опис',
      dataIndex: 'description',
      key: 'description',
      render: (text: string) => (
        <Text type="secondary" style={{ fontStyle: 'italic' }}>
          {text}
        </Text>
      ),
    },
    {
      title: '',
      key: 'actions',
      width: 100,
      fixed: 'right',
      render: (_, record) => (
        <Space>
          <Tooltip title="Редагувати">
            <Button 
              type="default" 
              shape="circle"
              icon={<EditOutlined style={{ color: '#faad14' }} />} 
              onClick={() => handleEditClick(record)} 
            />
          </Tooltip>
          <Popconfirm
            title="Ви впевнені?"
            description="Ця дія незворотна"
            onConfirm={() => handleDelete(record.id)}
            okText="Так"
            cancelText="Ні"
            okButtonProps={{ danger: true }}
          >
            <Tooltip title="Видалити">
              <Button type="default" shape="circle" danger icon={<DeleteOutlined />} />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Card 
        bordered={false} 
        loading={loading && data.length === 0}
        style={{ 
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)', 
          borderRadius: '8px',
          overflow: 'hidden'
        }}
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ClockCircleOutlined style={{ fontSize: '20px', color: '#1890ff' }} />
            <span>Історія записів</span>
          </div>
        }
        extra={
          <Statistic 
            title="Всього годин" 
            value={totalHours} 
            precision={1} 
            valueStyle={{ color: totalHours > 0 ? '#3f8600' : '#cf1322', fontSize: '18px', fontWeight: 'bold' }}
            prefix={<ClockCircleOutlined />} 
            suffix="год."
            style={{ marginRight: 10 }}
          />
        }
      >
        <Table 
          dataSource={data} 
          columns={columns} 
          rowKey="id" 
          pagination={{ 
            pageSize: 5, 
            showTotal: (total) => `Всього ${total} записів`,
            position: ['bottomCenter']
          }} 
          scroll={{ x: 700 }}
          size="middle"
        />
      </Card>

      <Modal
        title={
          <Space>
            <EditOutlined style={{ color: '#1890ff' }} />
            <span>Редагувати запис</span>
          </Space>
        }
        open={isModalOpen}
        onOk={handleEditSubmit}
        onCancel={() => setIsModalOpen(false)}
        okText="Зберегти"
        cancelText="Скасувати"
        centered
      >
        <Form form={form} layout="vertical" style={{ marginTop: 20 }}>
          <Form.Item name="date" label="Дата" rules={[{ required: true }]}>
            <DatePicker style={{ width: '100%' }} format="DD.MM.YYYY" />
          </Form.Item>
          
          <Form.Item name="projectName" label="Проект" rules={[{ required: true }]}>
            <Select 
              options={projects.map(p => ({ value: p.name, label: p.name }))} 
            />
          </Form.Item>

          <Form.Item 
            name="hours" 
            label="Години" 
            rules={[{ required: true }, { type: 'number', min: 0.1, max: 24 }]}
          >
            <InputNumber style={{ width: '100%' }} step={0.5} addonAfter="год." />
          </Form.Item>

          <Form.Item name="description" label="Опис" rules={[{ required: true }]}>
            <Input.TextArea rows={3} showCount maxLength={200} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};