import React, { useState } from 'react';
import { Form, Input, InputNumber, Button, Select, DatePicker, message, Card } from 'antd';
import type { CreateTimeEntryRequest } from '../../types';
import { timeEntriesApi } from '../../api/timeEntriesApi';
import dayjs from 'dayjs';

interface Props {
  onSuccess: () => void;
}

const PROJECT_OPTIONS = [
  { value: 'Viso Internal', label: 'Viso Internal' },
  { value: 'Client A', label: 'Client A' },
  { value: 'Client B', label: 'Client B' },
  { value: 'Personal Development', label: 'Personal Development' },
];

export const TimeEntryForm: React.FC<Props> = ({ onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

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
      const errorMsg = error.response?.data?.message || 'Щось пішло не так';
      message.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="Додати новий запис" variant={'borderless'} style={{ marginBottom: 24 }}>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{ date: dayjs() }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
          
          <Form.Item
            name="date"
            label="Дата"
            rules={[{ required: true, message: 'Оберіть дату!' }]}
          >
            <DatePicker style={{ width: '100%' }} format="DD.MM.YYYY" />
          </Form.Item>

          <Form.Item
            name="projectName"
            label="Проект"
            rules={[{ required: true, message: 'Оберіть проект!' }]}
          >
            <Select options={PROJECT_OPTIONS} placeholder="Оберіть проект" />
          </Form.Item>

          <Form.Item
            name="hours"
            label="Години"
            rules={[
              { required: true, message: 'Введіть години!' },
              { type: 'number', min: 0.1, max: 24, message: 'Від 0.1 до 24 годин' }
            ]}
          >
            <InputNumber style={{ width: '100%' }} step={0.5} />
          </Form.Item>
        </div>

        <Form.Item
          name="description"
          label="Опис роботи"
          rules={[{ required: true, message: 'Опишіть, що ви робили' }]}
        >
          <Input.TextArea rows={3} placeholder="Наприклад: Розробка API для логіна..." />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Зберегти
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};