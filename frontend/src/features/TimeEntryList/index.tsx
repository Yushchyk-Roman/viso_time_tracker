import React, { useEffect, useState, useMemo } from 'react';
import { 
  Table, Card, Typography, Tag, message, Button, Space, Popconfirm, 
  Modal, Form, DatePicker, Select, InputNumber, Input, Statistic, Tooltip, 
  Calendar, Row, Col, Badge, Empty 
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { Dayjs } from 'dayjs';
import { 
  DeleteOutlined, EditOutlined, ProjectOutlined, 
  ClockCircleOutlined, PlusOutlined, CalendarOutlined, TrophyOutlined,
  LeftOutlined, RightOutlined 
} from '@ant-design/icons';
import type { TimeEntry } from '../../types';
import { timeEntriesApi } from '../../api/timeEntriesApi';
import { projectsApi, type Project } from '../../api/projectsApi';
import dayjs from 'dayjs';
import 'dayjs/locale/uk';
import localeData from 'dayjs/plugin/localeData';

dayjs.extend(localeData);

const { Text } = Typography;

interface Props {
  refreshTrigger: number;
  onUpdate?: () => void;
}

export const TimeEntryList: React.FC<Props> = ({ refreshTrigger, onUpdate }) => {
  const [data, setData] = useState<TimeEntry[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());
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

  const currentDayEntries = useMemo(() => {
    return data.filter(entry => dayjs(entry.date).isSame(selectedDate, 'day'));
  }, [data, selectedDate]);

  const dailyTotal = currentDayEntries.reduce((sum, e) => sum + e.hours, 0);
  const grandTotal = data.reduce((sum, e) => sum + e.hours, 0);

  const dateCellRender = (value: Dayjs) => {
    const listData = data.filter(entry => dayjs(entry.date).isSame(value, 'day'));
    if (listData.length > 0) {
      const hours = listData.reduce((sum, e) => sum + e.hours, 0);
      return (
        <div style={{ textAlign: 'center' }}>
          <Badge 
            color={hours >= 8 ? 'success' : 'processing'}
            count={hours > 0 ? `${hours}г` : 0} 
            size="small"
            style={{ 
              backgroundColor: hours >= 8 ? '#52c41a' : '#1890ff', 
              boxShadow: 'none',
              fontSize: '10px',
              height: '16px',
              lineHeight: '16px',
              minWidth: '16px'
            }} 
          />
        </div>
      );
    }
    return null;
  };

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
    form.setFieldsValue({ ...record, date: dayjs(record.date) });
    setIsModalOpen(true);
  };

  const handleEditSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (!editingEntry) return;
      await timeEntriesApi.update(editingEntry.id, { ...values, date: values.date.toISOString() });
      message.success('Запис оновлено!');
      setIsModalOpen(false);
      setEditingEntry(null);
      fetchData();
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Помилка оновлення';
      message.error(msg);
    }
  };

  const columns: ColumnsType<TimeEntry> = [
    {
      title: 'Проект',
      dataIndex: 'projectName',
      key: 'projectName',
      width: 150,
      render: (projectName: string) => {
        const project = projects.find(p => p.name === projectName);
        return (
          <Tag icon={<ProjectOutlined />} color={project?.color || 'default'} style={{ borderRadius: '10px', marginRight: 0 }}>
            {projectName}
          </Tag>
        );
      },
    },
    {
      title: 'Опис',
      dataIndex: 'description',
      key: 'description',
      width: '40%',
      ellipsis: true,
      render: (text: string) => <Text type="secondary" style={{ fontStyle: 'italic' }}>{text}</Text>,
    },
    {
      title: 'Години',
      dataIndex: 'hours',
      key: 'hours',
      width: 90,
      align: 'right',
      render: (hours: number) => <Text strong>{hours} год.</Text>,
    },
    {
      title: '',
      key: 'actions',
      width: 80,
      align: 'center',
      render: (_, record) => (
        <Space size="small">
          <Button type="text" size="small" icon={<EditOutlined />} onClick={() => handleEditClick(record)} />
          <Popconfirm title="Видалити?" onConfirm={() => handleDelete(record.id)} okText="Так" cancelText="Ні">
            <Button type="text" size="small" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={9}>
          <Card 
            variant={'borderless'} 
            style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.05)', borderRadius: '8px' }}
            title={
              <Space>
                <CalendarOutlined style={{ color: '#1890ff' }} />
                <span>Огляд</span>
              </Space>
            }
            extra={
              <Tooltip title="Сума годин за весь час">
                <Tag color="geekblue" style={{ fontSize: '14px', padding: '4px 10px', margin: 0 }}>
                  <TrophyOutlined style={{ marginRight: 6 }} />
                  Всього: <b>{grandTotal} год.</b>
                </Tag>
              </Tooltip>
            }
          >
            <Calendar 
              fullscreen={false} 
              onSelect={setSelectedDate}
              value={selectedDate}
              cellRender={dateCellRender}
              headerRender={({ value, onChange }) => {
                const start = 0;
                const end = 12;
                const monthOptions = [];

                const current = value.clone();
                const localeData = value.localeData();
                const months = [];
                for (let i = 0; i < 12; i++) {
                  current.month(i);
                  months.push(localeData.monthsShort(current));
                }

                for (let i = start; i < end; i++) {
                  monthOptions.push(
                    <Select.Option key={i} value={i} className="month-item">
                      {months[i]}
                    </Select.Option>,
                  );
                }

                const year = value.year();
                const month = value.month();
                const options = [];
                for (let i = year - 15; i < year + 15; i += 1) {
                  options.push(
                    <Select.Option key={i} value={i} className="year-item">
                      {i}
                    </Select.Option>,
                  );
                }

                return (
                  <div style={{ padding: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                     <Button size="small" icon={<LeftOutlined />} onClick={() => onChange(value.clone().subtract(1, 'month'))} />

                     <Space size="small">
                        <Select
                          size="small"
                          popupMatchSelectWidth={false}
                          value={month}
                          onChange={(newMonth) => {
                            const now = value.clone().month(newMonth);
                            onChange(now);
                          }}
                        >
                          {monthOptions}
                        </Select>
                        
                        <Select
                          size="small"
                          popupMatchSelectWidth={false}
                          value={year}
                          onChange={(newYear) => {
                            const now = value.clone().year(newYear);
                            onChange(now);
                          }}
                        >
                          {options}
                        </Select>
                     </Space>

                     <Button size="small" icon={<RightOutlined />} onClick={() => onChange(value.clone().add(1, 'month'))} />
                  </div>
                );
              }}
            />
          </Card>
        </Col>

        <Col xs={24} lg={15}>
          <Card 
            variant={'borderless'} 
            style={{ 
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)', 
              borderRadius: '8px',
              minHeight: '340px'
            }}
            title={
              <Space>
                <ClockCircleOutlined style={{ color: '#1890ff' }} />
                <span>{selectedDate.format('DD MMMM YYYY')}</span>
                {selectedDate.isSame(dayjs(), 'day') && <Tag color="blue">Сьогодні</Tag>}
              </Space>
            }
            extra={
              <Statistic 
                value={dailyTotal} 
                precision={1} 
                valueStyle={{ color: dailyTotal >= 8 ? '#3f8600' : '#1890ff', fontSize: '20px', fontWeight: 'bold' }} 
                suffix="год."
              />
            }
          >
            {currentDayEntries.length > 0 ? (
              <Table 
                dataSource={currentDayEntries} 
                columns={columns} 
                rowKey="id" 
                pagination={false} 
                size="middle"
                scroll={{ x: 'max-content' }}
              />
            ) : (
              <Empty 
                image={Empty.PRESENTED_IMAGE_SIMPLE} 
                description="В цей день записів немає" 
              >
                 <Button type="dashed" icon={<PlusOutlined />} disabled>
                   Оберіть іншу дату або додайте запис через форму
                 </Button>
              </Empty>
            )}
          </Card>
        </Col>
      </Row>

      <Modal open={isModalOpen} onOk={handleEditSubmit} onCancel={() => setIsModalOpen(false)} title="Редагувати" okText="Зберегти">
        <Form form={form} layout="vertical">
          <Form.Item name="date" label="Дата"><DatePicker style={{ width: '100%' }} format="DD.MM.YYYY" /></Form.Item>
          <Form.Item name="projectName" label="Проект"><Select options={projects.map(p => ({ value: p.name, label: p.name }))} /></Form.Item>
          <Form.Item name="hours" label="Години"><InputNumber style={{ width: '100%' }} step={0.5} /></Form.Item>
          <Form.Item name="description" label="Опис"><Input.TextArea rows={3} /></Form.Item>
        </Form>
      </Modal>
    </>
  );
};