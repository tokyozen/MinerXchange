import React, { useState } from 'react';
import { Card, Table, Badge, Button, Steps, Upload, Form, Input, Select, Alert, Modal } from 'antd';
import { FileCheck, AlertTriangle, Upload as UploadIcon, Plus, MapPin, FileText } from 'lucide-react';
import BackButton from '../components/ui/BackButton';
import type { UploadFile } from 'antd/es/upload/interface';

// Dummy permit data
const permits = [
  {
    id: '12345',
    type: 'Artisanal',
    status: 'Approved',
    expiryDate: '2024-12-31',
    documents: ['business_reg.pdf', 'compliance_cert.pdf'],
  },
  {
    id: '67890',
    type: 'Industrial',
    status: 'Pending',
    expiryDate: '2025-03-15',
    documents: ['application.pdf'],
  },
  {
    id: '54321',
    type: 'Alluvial',
    status: 'Expired',
    expiryDate: '2023-09-10',
    documents: ['old_permit.pdf'],
  },
];

// Get permits expiring within 30 days
const getExpiringPermits = () => {
  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
  
  return permits.filter(permit => {
    const expiryDate = new Date(permit.expiryDate);
    return expiryDate <= thirtyDaysFromNow && permit.status !== 'Expired';
  });
};

export default function ComplianceDashboard() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [form] = Form.useForm();

  const columns = [
    {
      title: 'Permit ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const statusColors = {
          Approved: 'success',
          Pending: 'warning',
          Expired: 'error',
        };
        return (
          <Badge 
            status={statusColors[status as keyof typeof statusColors]} 
            text={status} 
          />
        );
      },
    },
    {
      title: 'Expiry Date',
      dataIndex: 'expiryDate',
      key: 'expiryDate',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: typeof permits[0]) => (
        <div className="space-x-2">
          <Button 
            type="link" 
            disabled={record.status === 'Expired'}
            onClick={() => console.log('View details:', record.id)}
          >
            View Details
          </Button>
          {record.status === 'Approved' && (
            <Button 
              type="primary"
              onClick={() => console.log('Renew permit:', record.id)}
            >
              Renew
            </Button>
          )}
        </div>
      ),
    },
  ];

  const handleSubmit = (values: any) => {
    console.log('Form values:', values);
    console.log('Uploaded files:', fileList);
    setIsModalVisible(false);
    setCurrentStep(0);
    form.resetFields();
    setFileList([]);
  };

  const steps = [
    {
      title: 'Basic Info',
      content: (
        <div className="space-y-4">
          <Form.Item
            name="permitType"
            label="Permit Type"
            rules={[{ required: true, message: 'Please select permit type' }]}
          >
            <Select>
              <Select.Option value="artisanal">Artisanal</Select.Option>
              <Select.Option value="industrial">Industrial</Select.Option>
              <Select.Option value="alluvial">Alluvial</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="businessName"
            label="Business Name"
            rules={[{ required: true, message: 'Please enter business name' }]}
          >
            <Input />
          </Form.Item>
        </div>
      ),
    },
    {
      title: 'Location',
      content: (
        <div className="space-y-4">
          <Form.Item
            name="location"
            label="Mining Site GPS Location"
            rules={[{ required: true, message: 'Please enter GPS coordinates' }]}
          >
            <Input placeholder="e.g., 8.4606, -13.2317" />
          </Form.Item>
          <div className="h-48 bg-gray-100 rounded-lg flex items-center justify-center">
            <div className="text-center text-gray-500">
              <MapPin className="h-8 w-8 mx-auto mb-2" />
              <p>Map preview will be shown here</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Documents',
      content: (
        <div className="space-y-4">
          <Upload
            multiple
            fileList={fileList}
            onChange={({ fileList }) => setFileList(fileList)}
            beforeUpload={() => false}
          >
            <Button icon={<UploadIcon className="h-4 w-4" />}>Upload Documents</Button>
          </Upload>
          <div className="text-sm text-gray-500">
            Please upload the following documents:
            <ul className="list-disc ml-4 mt-2">
              <li>Business Registration Certificate</li>
              <li>Environmental Impact Assessment</li>
              <li>Safety Compliance Certificate</li>
              <li>Mining Site Survey Report</li>
            </ul>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-start mb-8">
        <div>
          <BackButton className="mb-4" />
          <h1 className="text-3xl font-bold text-gray-900">Compliance & Permits</h1>
          <p className="text-gray-600 mt-2">
            Manage your mining permits and track compliance status
          </p>
        </div>
        <Button
          type="primary"
          icon={<Plus className="h-4 w-4" />}
          onClick={() => setIsModalVisible(true)}
          className="bg-indigo-600"
        >
          New Permit Application
        </Button>
      </div>

      {/* Renewal Alerts */}
      {getExpiringPermits().length > 0 && (
        <Alert
          message="Permits Requiring Attention"
          description={
            <div className="mt-2">
              {getExpiringPermits().map(permit => (
                <div key={permit.id} className="flex justify-between items-center py-2">
                  <span>
                    Permit {permit.id} ({permit.type}) expires on {permit.expiryDate}
                  </span>
                  <Button type="primary" size="small">
                    Renew Now
                  </Button>
                </div>
              ))}
            </div>
          }
          type="warning"
          showIcon
          icon={<AlertTriangle className="h-5 w-5" />}
          className="mb-8"
        />
      )}

      {/* Permit Status Dashboard */}
      <Card 
        title={
          <div className="flex items-center">
            <FileCheck className="h-5 w-5 text-gray-500 mr-2" />
            <span>Permit Status</span>
          </div>
        }
        className="mb-8 shadow-md"
      >
        <Table
          columns={columns}
          dataSource={permits}
          rowKey="id"
        />
      </Card>

      {/* Document Upload Area */}
      <Card
        title={
          <div className="flex items-center">
            <FileText className="h-5 w-5 text-gray-500 mr-2" />
            <span>Recent Documents</span>
          </div>
        }
        className="shadow-md"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {permits.map(permit => (
            <div key={permit.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium">Permit {permit.id}</h3>
                <Badge status={
                  permit.status === 'Approved' ? 'success' :
                  permit.status === 'Pending' ? 'warning' : 'error'
                } text={permit.status} />
              </div>
              <div className="space-y-2">
                {permit.documents.map((doc, index) => (
                  <div key={index} className="flex items-center text-sm text-gray-600">
                    <FileText className="h-4 w-4 mr-2" />
                    {doc}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* New Permit Application Modal */}
      <Modal
        title="New Permit Application"
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setCurrentStep(0);
          form.resetFields();
          setFileList([]);
        }}
        footer={null}
        width={720}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="mt-4"
        >
          <Steps
            current={currentStep}
            items={steps.map(item => ({ title: item.title }))}
            className="mb-8"
          />
          
          <div className="min-h-[300px]">
            {steps[currentStep].content}
          </div>

          <div className="flex justify-between mt-8">
            {currentStep > 0 && (
              <Button onClick={() => setCurrentStep(currentStep - 1)}>
                Previous
              </Button>
            )}
            <div className="ml-auto">
              {currentStep < steps.length - 1 && (
                <Button type="primary" onClick={() => setCurrentStep(currentStep + 1)}>
                  Next
                </Button>
              )}
              {currentStep === steps.length - 1 && (
                <Button type="primary" onClick={() => form.submit()}>
                  Submit Application
                </Button>
              )}
            </div>
          </div>
        </Form>
      </Modal>
    </div>
  );
}