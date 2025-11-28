import { useState } from 'react';
import { X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';
import Input from '../ui/Input';
import Select from '../ui/Select';
import TextArea from '../ui/TextArea';
import FormGroup from '../ui/FormGroup';
import { useMember } from '../../hooks/useMember';

interface NewListingModalProps {
  onClose: () => void;
}

export default function NewListingModal({ onClose }: NewListingModalProps) {
  const { member, loading: memberLoading, error: memberError } = useMember();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    mineralType: '',
    quantity: '',
    unit: 'kg',
    qualityGrade: '',
    pricePerUnit: '',
    notes: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!member) {
      toast.error('Please ensure your member profile is complete');
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.from('mineral_listings').insert({
        member_id: member.id,
        mineral_type: formData.mineralType,
        quantity: parseFloat(formData.quantity),
        unit: formData.unit,
        quality_grade: formData.qualityGrade,
        price_per_unit: parseFloat(formData.pricePerUnit),
        notes: formData.notes,
      });

      if (error) throw error;

      toast.success('Listing created successfully');
      onClose();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (memberLoading) {
    return <div>Loading...</div>;
  }

  if (memberError) {
    return <div>Error: {memberError}</div>;
  }

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">New Mineral Listing</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4">
          <FormGroup>
            <Input
              label="Mineral Type"
              type="text"
              required
              value={formData.mineralType}
              onChange={(e) => setFormData({ ...formData, mineralType: e.target.value })}
              placeholder="Enter mineral type"
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Quantity"
                type="number"
                required
                min="0"
                step="0.01"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                placeholder="Enter quantity"
              />

              <Select
                label="Unit"
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                options={[
                  { value: 'kg', label: 'Kilograms (kg)' },
                  { value: 'g', label: 'Grams (g)' },
                  { value: 'ton', label: 'Tons' },
                ]}
              />
            </div>

            <Input
              label="Quality Grade"
              type="text"
              required
              value={formData.qualityGrade}
              onChange={(e) => setFormData({ ...formData, qualityGrade: e.target.value })}
              placeholder="Enter quality grade"
            />

            <Input
              label="Price per Unit"
              type="number"
              required
              min="0"
              step="0.01"
              value={formData.pricePerUnit}
              onChange={(e) => setFormData({ ...formData, pricePerUnit: e.target.value })}
              placeholder="Enter price per unit"
              icon={<span className="text-gray-500">$</span>}
            />

            <TextArea
              label="Notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Add any additional details about the listing..."
              rows={3}
            />

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Create Listing'}
              </button>
            </div>
          </FormGroup>
        </form>
      </div>
    </div>
  );
}