import React from 'react';
import AdminLayout from '@/components/layouts/AdminLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Link } from '@inertiajs/react';
import { Badge } from '@/components/ui/badge';

interface ConstructionService {
  id: number;
  name: string;
  unit: string;
  price: string;
  category: string;
}

interface ShowProps {
  service: ConstructionService;
}

const Show: React.FC<ShowProps> = ({ service }) => {
  return (
    <AdminLayout title="Construction Service Details">
      <div className="container mx-auto p-4 md:p-8">
        <h1 className="text-3xl font-bold mb-6">
          Construction Service Details
        </h1>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{service.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Unit</p>
                <p className="text-lg font-semibold">{service.unit}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Price</p>
                <p className="text-lg font-semibold">
                  ${parseFloat(service.price).toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Category</p>
                <Badge variant="secondary">{service.category}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Link
          href="/admin/construction_services"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Back to Services
        </Link>
      </div>
    </AdminLayout>
  );
};

export default Show;
