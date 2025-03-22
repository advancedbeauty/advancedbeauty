'use client';

import { useState, useEffect, useRef, ChangeEvent } from 'react';
import Image from 'next/image';
import { PlusCircle, Loader2, Pencil, Trash } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import {
  createService,
  updateService,
  deleteService,
  getServices,
} from '@/actions/service.action';
import parseDetails, { ServiceDetails } from '@/helper/servicedeatils';
import data from '@/lib/data';
import {
  uploadImageToDrive,
  deleteImageFromDrive,
} from '@/actions/driveupload.action';

interface Service {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  listPrice: number;
  images: string[]; // Array of uploaded image URLs.
  tags: string[];
  isPublished: boolean;
  details: ServiceDetails;
}

interface Detail {
  heading: string;
  lines: string[];
}

// Updated form state now stores image arrays and file ID arrays.
interface FormDataState {
  name: string;
  category: string;
  description: string;
  price: string;
  listPrice: string;
  images: string[]; // Uploaded image URLs.
  imageFileIds: string[]; // Google Drive file IDs for each image.
  tags: string;
  isPublished: boolean;
}

export default function ServiceItem() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [formData, setFormData] = useState<FormDataState>({
    name: '',
    category: '',
    description: '',
    price: '',
    listPrice: '',
    images: [],
    imageFileIds: [],
    tags: '',
    isPublished: false,
  });
  // details state stores an array of detail sections.
  const [details, setDetails] = useState<Detail[]>([
    { heading: '', lines: [''] },
  ]);

  // Ref for the hidden file input for images.
  const imageInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    const result = await getServices();
    if (result.success && result.data) {
      const servicesData = result.data.map((service: any) => ({
        ...service,
        description: service.description || '',
        details: parseDetails(service.details),
      }));
      setServices(servicesData);
    } else {
      toast.error(result.error);
    }
    setLoading(false);
  };

  // --- Image Upload UI & Logic ---

  // When user selects a file, upload it to Google Drive.
  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const uploadToastId = toast.loading('Uploading image...');
    const uploadResult = await uploadImageToDrive(file);
    if (uploadResult.success) {
      // If there's already an image uploaded that you want to replace,
      // you can optionally delete it. Here we simply add the new image.
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, uploadResult.url || ''],
        imageFileIds: [...prev.imageFileIds, uploadResult.fileId || ''],
      }));
      toast.success('Image uploaded!', { id: uploadToastId });
    } else {
      toast.error(uploadResult.error || 'Failed to upload image', {
        id: uploadToastId,
      });
    }
    // Clear the file input so that the same file can be selected again if needed.
    if (imageInputRef.current) imageInputRef.current.value = '';
  };

  // Remove an image from the list and delete it from Drive.
  const removeImage = async (index: number) => {
    const fileId = formData.imageFileIds[index];
    if (fileId) {
      await deleteImageFromDrive(fileId);
    }
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
      imageFileIds: prev.imageFileIds.filter((_, i) => i !== index),
    }));
  };

  // --- Form Submission ---

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const form = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      // For images, join array into a comma-separated string.
      if (key === 'images') {
        form.append(key, value.join(','));
      } else if (key === 'imageFileIds') {
        form.append(key, value.join(','));
      } else {
        form.append(key, value.toString());
      }
    });
    // Append details as a JSON string.
    form.append('details', JSON.stringify(details));
    const result = editingService
      ? await updateService(editingService.id, form)
      : await createService(form);
    if (result.success) {
      toast.success(editingService ? 'Service updated' : 'Service created');
      resetForm();
      fetchServices();
    } else {
      toast.error(result.error);
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    setLoading(true);
    const result = await deleteService(id);
    if (result.success) {
      toast.success('Service deleted');
      // Optionally, you could delete associated images from Drive if your backend doesn't handle that.
      fetchServices();
    } else {
      toast.error(result.error);
    }
    setLoading(false);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: '',
      description: '',
      price: '',
      listPrice: '',
      images: [],
      imageFileIds: [],
      tags: '',
      isPublished: false,
    });
    setEditingService(null);
    setDetails([{ heading: '', lines: [''] }]);
    if (imageInputRef.current) imageInputRef.current.value = '';
  };

  // --- Reusable Image Upload Gallery Component ---

  const ImageUploadGallery = () => {
    return (
      <div className="space-y-2">
        <Label>Service Images</Label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {formData.images.map((url, index) => (
            <div key={index} className="relative w-full h-32 border border-dashed rounded-md overflow-hidden">
              <Image
                src={url}
                alt={`Service Image ${index + 1}`}
                fill
                className="object-cover"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
              >
                <Trash size={16} />
              </button>
            </div>
          ))}
          <label
            htmlFor="serviceImageUpload"
            className="relative w-full h-32 border border-dashed rounded-md flex items-center justify-center cursor-pointer hover:border-gray-400"
          >
            <input
              id="serviceImageUpload"
              type="file"
              accept="image/*"
              className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={handleImageUpload}
              ref={imageInputRef}
            />
            <PlusCircle className="text-gray-400" size={40} />
          </label>
        </div>
      </div>
    );
  };

  // --- Detail Section Handlers ---

  const addDetailSection = () => {
    setDetails([...details, { heading: '', lines: [''] }]);
  };

  const removeDetailSection = (index: number) => {
    const newDetails = [...details];
    newDetails.splice(index, 1);
    setDetails(newDetails);
  };

  const handleDetailChange = (index: number, value: string) => {
    const newDetails = [...details];
    newDetails[index].heading = value;
    setDetails(newDetails);
  };

  const addDetailLine = (sectionIndex: number) => {
    const newDetails = [...details];
    newDetails[sectionIndex].lines.push('');
    setDetails(newDetails);
  };

  const removeDetailLine = (sectionIndex: number, lineIndex: number) => {
    const newDetails = [...details];
    if (newDetails[sectionIndex].lines.length > 1) {
      newDetails[sectionIndex].lines.splice(lineIndex, 1);
      setDetails(newDetails);
    }
  };

  const handleDetailLineChange = (
    sectionIndex: number,
    lineIndex: number,
    value: string,
  ) => {
    const newDetails = [...details];
    newDetails[sectionIndex].lines[lineIndex] = value;
    setDetails(newDetails);
  };

  return (
    <div className="w-full mx-auto p-6 space-y-10">
      {/* Form Card */}
      <Card className="shadow-lg">
        <CardHeader className="border-b pb-4">
          <CardTitle className="text-2xl font-bold">
            {editingService ? 'Edit Service' : 'Create Service'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  placeholder="Enter service name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  required
                  className="input"
                >
                  <option value="" disabled>
                    Select Category
                  </option>
                  {data.ServiceCategoryData.map((cat) => (
                    <option key={cat.id} value={cat.title}>
                      {cat.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Enter service description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  type="number"
                  placeholder="Enter price"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="listPrice">List Price</Label>
                <Input
                  id="listPrice"
                  type="number"
                  placeholder="Enter list price"
                  value={formData.listPrice}
                  onChange={(e) =>
                    setFormData({ ...formData, listPrice: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            {/* Image Upload Gallery */}
            <ImageUploadGallery />

            <div className="space-y-2">
              <Label htmlFor="tags">Tags</Label>
              <Input
                id="tags"
                placeholder="Comma separated tags"
                value={formData.tags}
                onChange={(e) =>
                  setFormData({ ...formData, tags: e.target.value })
                }
              />
            </div>

            {/* Details Section */}
            <div className="border p-6 rounded-md space-y-4">
              <h3 className="text-xl font-semibold">Service Details</h3>
              {details.map((detail, sectionIndex) => (
                <div
                  key={sectionIndex}
                  className="border p-4 rounded-md space-y-4 bg-gray-50"
                >
                  <div className="space-y-2">
                    <Label htmlFor={`detail-heading-${sectionIndex}`}>
                      Heading
                    </Label>
                    <Input
                      id={`detail-heading-${sectionIndex}`}
                      placeholder="Detail Heading"
                      value={detail.heading}
                      onChange={(e) =>
                        handleDetailChange(sectionIndex, e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Lines</Label>
                    {detail.lines.map((line, lineIndex) => (
                      <div
                        key={lineIndex}
                        className="flex items-center space-x-2"
                      >
                        <Input
                          placeholder="Enter line text"
                          value={line}
                          onChange={(e) =>
                            handleDetailLineChange(
                              sectionIndex,
                              lineIndex,
                              e.target.value,
                            )
                          }
                        />
                        {detail.lines.length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              removeDetailLine(sectionIndex, lineIndex)
                            }
                          >
                            Remove
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addDetailLine(sectionIndex)}
                    >
                      Add Line
                    </Button>
                  </div>
                  <div>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => removeDetailSection(sectionIndex)}
                    >
                      Remove Section
                    </Button>
                  </div>
                </div>
              ))}
              <Button type="button" onClick={addDetailSection}>
                Add Detail Section
              </Button>
            </div>

            <div className="flex items-center space-x-3">
              <Switch
                checked={formData.isPublished}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, isPublished: checked })
                }
              />
              <Label>Published</Label>
            </div>

            <div className="flex items-center space-x-4">
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {editingService ? 'Update Service' : 'Create Service'}
              </Button>
              {editingService && (
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Services List Card */}
      <Card className="shadow-lg">
        <CardHeader className="border-b pb-4">
          <CardTitle className="text-2xl font-bold">Services</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center p-6">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : (
            <Table className="min-w-full">
              <TableHeader className="bg-gray-100">
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {services.map((service) => (
                  <TableRow key={service.id} className="hover:bg-gray-50">
                    <TableCell>{service.name}</TableCell>
                    <TableCell>{service.category}</TableCell>
                    <TableCell>₹{service.price}</TableCell>
                    <TableCell>
                      {service.isPublished ? 'Published' : 'Draft'}
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setEditingService(service);
                          setFormData({
                            name: service.name,
                            category: service.category,
                            description: service.description,
                            price: service.price.toString(),
                            listPrice: service.listPrice.toString(),
                            // Assume the first image is the primary one.
                            images: service.images,
                            imageFileIds: [], // Not pre-filled on edit.
                            tags: service.tags.join(','),
                            isPublished: service.isPublished,
                          });
                          const parsedDetails =
                            typeof service.details === 'string' &&
                            service.details
                              ? JSON.parse(service.details) || [{ heading: '', lines: [''] }]
                              : service.details || [{ heading: '', lines: [''] }];
                          setDetails(parsedDetails);
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button type="button" variant="ghost" size="icon">
                            <Trash className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Service</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this service? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(service.id)}>
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
