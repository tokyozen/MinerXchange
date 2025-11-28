import React, { useState } from 'react';
import { DatePicker, Select, Card, Table } from 'antd';
import { Line, Pie, Column } from '@ant-design/charts';
import BackButton from '../components/ui/BackButton';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

// Dummy data for charts
const submissionsData = Array.from({ length: 30 }, (_, i) => ({
  date: dayjs().subtract(i, 'day').format('YYYY-MM-DD'),
  submissions: Math.floor(Math.random() * 100) + 20,
})).reverse();

const mineralDistribution = [
  { type: 'Gold', value: 40 },
  { type: 'Diamond', value: 30 },
  { type: 'Iron Ore', value: 30 },
];

const complianceData = [
  { status: 'Compliant', count: 50 },
  { status: 'Non-Compliant', count: 20 },
  { status: 'Pending Review', count: 10 },
];

const transactionData = [
  { mineral: 'Gold', transactions: 500 },
  { mineral: 'Diamond', transactions: 300 },
  { mineral: 'Iron Ore', transactions: 200 },
];

const revenueData = [
  {
    key: '1',
    mineralType: 'Gold',
    commission: '10%',
    revenue: '$50,000',
  },
  {
    key: '2',
    mineralType: 'Diamond',
    commission: '15%',
    revenue: '$30,000',
  },
  {
    key: '3',
    mineralType: 'Iron Ore',
    commission: '8%',
    revenue: '$20,000',
  },
];

const revenueColumns = [
  {
    title: 'Mineral Type',
    dataIndex: 'mineralType',
    key: 'mineralType',
  },
  {
    title: 'Commission',
    dataIndex: 'commission',
    key: 'commission',
  },
  {
    title: 'Total Revenue',
    dataIndex: 'revenue',
    key: 'revenue',
  },
];

export default function AnalyticsDashboard() {
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(null);
  const [mineralType, setMineralType] = useState<string>('all');

  // Line Chart Config
  const lineConfig = {
    data: submissionsData,
    xField: 'date',
    yField: 'submissions',
    point: {
      size: 5,
      shape: 'diamond',
    },
    tooltip: {
      showMarkers: false,
    },
    state: {
      active: {
        style: {
          shadowBlur: 4,
          stroke: '#000',
          fill: 'red',
        },
      },
    },
    interactions: [
      {
        type: 'marker-active',
      },
    ],
  };

  // Pie Chart Config
  const pieConfig = {
    data: mineralDistribution,
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    label: {
      type: 'outer',
      content: '{name} {percentage}',
    },
    interactions: [
      {
        type: 'pie-legend-active',
      },
      {
        type: 'element-active',
      },
    ],
  };

  // Bar Chart Config
  const barConfig = {
    data: complianceData,
    xField: 'status',
    yField: 'count',
    label: {
      position: 'middle',
      style: {
        fill: '#FFFFFF',
        opacity: 0.6,
      },
    },
    meta: {
      status: {
        alias: 'Status',
      },
      count: {
        alias: 'Number of Miners',
      },
    },
  };

  // Transactions Bar Chart Config
  const transactionConfig = {
    data: transactionData,
    xField: 'mineral',
    yField: 'transactions',
    label: {
      position: 'middle',
      style: {
        fill: '#FFFFFF',
        opacity: 0.6,
      },
    },
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <BackButton />
      </div>

      <h1 className="text-3xl font-bold text-gray-900 mb-8">Analytics & Reporting</h1>

      {/* Filters */}
      <div className="mb-8 flex gap-4">
        <RangePicker
          className="w-64"
          onChange={(dates) => {
            if (dates) {
              setDateRange([dates[0]!, dates[1]!]);
            } else {
              setDateRange(null);
            }
          }}
        />
        <Select
          className="w-48"
          placeholder="Select Mineral Type"
          defaultValue="all"
          onChange={setMineralType}
          options={[
            { value: 'all', label: 'All Minerals' },
            { value: 'gold', label: 'Gold' },
            { value: 'diamond', label: 'Diamond' },
            { value: 'iron', label: 'Iron Ore' },
          ]}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Submissions Over Time */}
        <Card title="Mineral Submissions Over Time" className="shadow-md">
          <Line {...lineConfig} />
        </Card>

        {/* Mineral Distribution */}
        <Card title="Mineral Distribution" className="shadow-md">
          <Pie {...pieConfig} />
        </Card>

        {/* Compliance Status */}
        <Card title="Compliance Status" className="shadow-md">
          <Column {...barConfig} />
        </Card>

        {/* Transaction Volume */}
        <Card title="Transaction Volume by Mineral" className="shadow-md">
          <Column {...transactionConfig} />
        </Card>
      </div>

      {/* Revenue Table */}
      <div className="mt-8">
        <Card title="Revenue Breakdown" className="shadow-md">
          <Table
            columns={revenueColumns}
            dataSource={revenueData}
            pagination={false}
          />
        </Card>
      </div>
    </div>
  );
}