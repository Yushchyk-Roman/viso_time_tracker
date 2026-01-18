import React, { useState, useEffect } from 'react';
import { 
  Form, InputNumber, Button, Select, DatePicker, message, Card, 
  Row, Col, Divider, Input, Space 
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import type { CreateTimeEntryRequest } from '../../types';
import { timeEntriesApi } from '../../api/timeEntriesApi';
import { projectsApi } from '../../api/projectsApi';
import type { Project } from '../../api/projectsApi';
import dayjs from 'dayjs';

interface Props {
  onSuccess: () => void;
}

export const TimeEntryForm: React.FC<Props> = ({ onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectsLoading, setProjectsLoading] = useState(false);

  const [newProjectName, setNewProjectName] = useState('');

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    setProjectsLoading(true);
    try {
      const data = await projectsApi.getAll();
      setProjects(data);
    } catch (error) {
      console.error(error);
    } finally {
      setProjectsLoading(false);
    }
  };

  const handleAddProject = async (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;

    try {
      const colors = ['magenta', 'red', 'volcano', 'orange', 'gold', 'lime', 'green', 'cyan', 'blue', 'geekblue', 'purple'];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];

      const newProject = await projectsApi.create(newProjectName, randomColor);
      
      message.success(`Проект "${newProject.name}" створено!`);
      
      setProjects([...projects, newProject]);
      form.setFieldValue('projectName', newProject.name);
      setNewProjectName('');
    } catch (error) {
      message.error('Не вдалося створити проект (можливо, така назва вже є)');
    }
  };

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const payload: CreateTimeEntryRequest = {
        date: values.date.toISOString(),
        projectName: values.projectName,
        hours: Number(values.hours),
        description: values.description,
      };

      await timeEntriesApi.create(payload);
      message.success('Запис успішно додано!');
      
      form.resetFields();
      form.setFieldsValue({ date: dayjs() });
      onSuccess();
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || 'Помилка збереження';
      message.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card 
      title="Додати новий запис" 
      bordered={false} 
      style={{ marginBottom: 24, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{ date: dayjs() }}
      >
        <Row gutter={[16, 16]}>
          <Col xs={24} md={8}>
            <Form.Item name="date" label="Дата" rules={[{ required: true }]}>
              <DatePicker style={{ width: '100%' }} format="DD.MM.YYYY" allowClear={false} />
            </Form.Item>
          </Col>

          <Col xs={24} md={8}>
            <Form.Item 
              name="projectName" 
              label="Проект" 
              rules={[{ required: true, message: 'Оберіть або створіть проект' }]}
            >
              <Select
                placeholder="Оберіть проект"
                loading={projectsLoading}
                options={projects.map(p => ({ value: p.name, label: p.name }))}
  
                popupRender={(menu) => (
                  <>
                    {menu}
                    <Divider style={{ margin: '8px 0' }} />
                    <Space style={{ padding: '0 8px 4px', width: '100%' }}>
                      <Input
                        placeholder="Новий проект..."
                        value={newProjectName}
                        onChange={(e) => setNewProjectName(e.target.value)}
                        onKeyDown={(e) => e.stopPropagation()}
                      />
                      <Button type="text" icon={<PlusOutlined />} onClick={handleAddProject}>
                        Додати
                      </Button>
                    </Space>
                  </>
                )}
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={8}>
            <Form.Item 
              name="hours" 
              label="Години" 
              rules={[{ required: true }, { type: 'number', min: 0.1, max: 24 }]}
            >
              <InputNumber style={{ width: '100%' }} step={0.5} addonAfter="год." />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item name="description" label="Опис роботи" rules={[{ required: true }]}>
          <Input.TextArea rows={2} placeholder="Що було зроблено?" showCount maxLength={500} />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block size="large">
            Зберегти
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};