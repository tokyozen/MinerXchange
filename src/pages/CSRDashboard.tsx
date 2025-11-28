import React from 'react';
import { Card, Progress, Timeline, Carousel, Button } from 'antd';
import { MapPin, Calendar, Users, DollarSign, Camera, Plus } from 'lucide-react';
import BackButton from '../components/ui/BackButton';

// Dummy data for projects
const projects = [
  {
    id: 1,
    name: 'Building Schools',
    location: 'Sierra Leone',
    status: 'Ongoing',
    progress: 80,
    coordinates: [8.4606, -13.2317],
  },
  {
    id: 2,
    name: 'Water Wells',
    location: 'Kenya',
    status: 'Completed',
    progress: 100,
    coordinates: [-1.2921, 36.8219],
  },
  {
    id: 3,
    name: 'Health Clinics',
    location: 'Ghana',
    status: 'Ongoing',
    progress: 50,
    coordinates: [5.6037, -0.1870],
  },
];

// Dummy data for impact statistics
const impactStats = [
  { icon: <Calendar className="h-8 w-8 text-indigo-600" />, title: 'Projects Completed', value: '15' },
  { icon: <DollarSign className="h-8 w-8 text-green-600" />, title: 'Total Investment', value: '$1,000,000' },
  { icon: <Users className="h-8 w-8 text-blue-600" />, title: 'People Impacted', value: '20,000' },
];

// Dummy timeline data
const timelineItems = [
  { date: 'January 2024', event: 'Project initiated' },
  { date: 'March 2024', event: 'Phase 1 completed' },
  { date: 'July 2024', event: 'Project completed' },
];

export default function CSRDashboard() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <BackButton className="mb-4" />
          <h1 className="text-3xl font-bold text-gray-900">CSR Initiatives</h1>
          <p className="text-gray-600 mt-2">
            Track and manage CSR initiatives, including community development projects, progress updates, and proof of work uploads.
          </p>
        </div>
        <Button
          type="primary"
          icon={<Plus className="h-4 w-4" />}
          className="bg-indigo-600 hover:bg-indigo-700"
        >
          Manage Projects
        </Button>
      </div>

      {/* Project Map */}
      <Card title="Project Locations" className="mb-8 shadow-md">
        <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
          <div className="text-center text-gray-500">
            <MapPin className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p>Interactive map will be integrated here</p>
            <p className="text-sm">Showing {projects.length} project locations</p>
          </div>
        </div>
      </Card>

      {/* Impact Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {impactStats.map((stat, index) => (
          <Card key={index} className="shadow-md text-center">
            <div className="flex flex-col items-center">
              {stat.icon}
              <h3 className="text-xl font-semibold mt-4">{stat.value}</h3>
              <p className="text-gray-600">{stat.title}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Progress Tracking */}
      <Card title="Project Progress" className="mb-8 shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div key={project.id} className="bg-gray-50 p-6 rounded-lg">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-gray-900">{project.name}</h3>
                  <p className="text-sm text-gray-600">
                    <MapPin className="h-4 w-4 inline mr-1" />
                    {project.location}
                  </p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  project.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {project.status}
                </span>
              </div>
              <Progress
                percent={project.progress}
                status={project.progress === 100 ? 'success' : 'active'}
                strokeColor={project.progress === 100 ? '#10B981' : '#F59E0B'}
              />
            </div>
          ))}
        </div>
      </Card>

      {/* Project Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <Card title="Project Timeline" className="shadow-md">
          <Timeline
            items={timelineItems.map((item) => ({
              children: (
                <div>
                  <p className="font-semibold">{item.date}</p>
                  <p className="text-gray-600">{item.event}</p>
                </div>
              ),
            }))}
          />
        </Card>

        {/* Photo Gallery */}
        <Card 
          title="Project Gallery" 
          extra={
            <Button type="text" icon={<Camera className="h-4 w-4" />}>
              Upload Media
            </Button>
          }
          className="shadow-md"
        >
          <Carousel autoplay>
            {[1, 2, 3].map((index) => (
              <div key={index} className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <Camera className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p>Upload pictures/videos for progress proof</p>
                  <p className="text-sm">Placeholder {index}</p>
                </div>
              </div>
            ))}
          </Carousel>
        </Card>
      </div>
    </div>
  );
}