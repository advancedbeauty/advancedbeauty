'use client';

import { useState, useEffect, useRef, ChangeEvent } from 'react';
import Image from 'next/image';
import { PlusCircle, Loader2, Pencil, Trash, X, RefreshCw, Search, ChevronLeft, ChevronRight } from 'lucide-react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
  createService,
  updateService,
  deleteService,
  getServices,
  checkServiceExists,
} from '@/actions/service.action';
import parseDetails, { ServiceDetails } from '@/helper/servicedeatils';
import data from '@/lib/data';
import {
  uploadImageToDrive,
  deleteImageFromDrive,
} from '@/actions/driveupload.action';
import { JsonValue } from '@prisma/client/runtime/library';

// Define tags data structure
interface Tag {
  id: string;
  name: string;
}

// Sample tags data
const tagsData: Tag[] = data.ServiceTagsData;

// Define the structure of what Prisma returns
interface PrismaService {
  id: string;
  name: string;
  slug: string;
  category: string;
  description: string | null;
  price: number;
  listPrice: number;
  images: string[];
  tags: string[];
  isPublished: boolean;
  details: JsonValue;
  createdAt: Date;
  updatedAt: Date;
  orderItems?: [];
}

interface Detail {
  heading: string;
  lines: string[];
}

// Our component's service interface
interface Service {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  listPrice: number;
  images: string[];
  tags: string[];
  isPublished: boolean;
  details: ServiceDetails;
  createdAt?: Date;
  updatedAt?: Date;
  slug?: string;
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
  tags: string[]; // Now an array of selected tag names
  isPublished: boolean;
}

// Interface for API responses
interface ServiceActionResult {
  success: boolean;
  data?: PrismaService[] | PrismaService;
  error?: string;
}

interface UploadResult {
  success: boolean;
  url?: string;
  fileId?: string;
  error?: string;
}

export default function ServiceItem() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const servicesPerPage = 10;
  const [formData, setFormData] = useState<FormDataState>({
    name: '',
    category: '',
    description: '',
    price: '',
    listPrice: '',
    images: [],
    imageFileIds: [],
    tags: [],
    isPublished: false,
  });
  const [details, setDetails] = useState<Detail[]>([
    { heading: '', lines: [''] },
  ]);

  const imageInputRef = useRef<HTMLInputElement | null>(null);

  const [nameError, setNameError] = useState<string | null>(null);
  const [isCheckingName, setIsCheckingName] = useState(false);

  useEffect(() => {
    fetchServices();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const fetchServices = async () => {
    const result = (await getServices()) as ServiceActionResult;
    if (result.success && result.data) {
      const data = Array.isArray(result.data) ? result.data : [result.data];
      const servicesData = data.map((service: PrismaService) => ({
        ...service,
        description: service.description || '',
        details: parseDetails(service.details),
      })) as Service[];
      setServices(servicesData);
    } else {
      toast.error(result.error || 'Failed to fetch services');
    }
    setLoading(false);
  };

  const checkNameExists = async (name: string) => {
    if (editingService && editingService.name === name) {
      setNameError(null);
      return false;
    }

    setIsCheckingName(true);
    try {
      const result = await checkServiceExists(name);
      if (result.exists) {
        setNameError('A service with this name already exists');
        return true;
      } else {
        setNameError(null);
        return false;
      }
    } catch (error) {
      console.error('Error checking name:', error);
      setNameError('Failed to check name availability');
      return true;
    } finally {
      setIsCheckingName(false);
    }
  };

  const handleNameChange = (name: string) => {
    setFormData({ ...formData, name });

    if (nameError) setNameError(null);

    if (name.trim().length > 2) {
      const timer = setTimeout(() => {
        checkNameExists(name);
      }, 800);

      return () => clearTimeout(timer);
    }
  };

  const handleTagSelect = (tag: string) => {
    if (!formData.tags.includes(tag)) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tag],
      }));
    }
  };

  const removeTag = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
  };

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const uploadToastId = toast.loading('Uploading image...');
    const uploadResult = (await uploadImageToDrive(file)) as UploadResult;
    if (uploadResult.success) {
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
    if (imageInputRef.current) imageInputRef.current.value = '';
  };

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const form = new FormData();

    form.append('name', formData.name);
    form.append('category', formData.category);
    form.append('description', formData.description);
    form.append('price', formData.price);
    form.append('listPrice', formData.listPrice);
    form.append('isPublished', String(formData.isPublished));
    form.append('images', formData.images.join(','));
    form.append('imageFileIds', formData.imageFileIds.join(','));
    form.append('tags', formData.tags.join(','));
    form.append('details', JSON.stringify(details));

    const result = editingService
      ? ((await updateService(editingService.id, form)) as ServiceActionResult)
      : ((await createService(form)) as ServiceActionResult);

    if (result.success) {
      toast.success(editingService ? 'Service updated' : 'Service created');
      resetForm();
      fetchServices();
    } else {
      toast.error(result.error || 'Operation failed');
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    setLoading(true);
    const result = (await deleteService(id)) as ServiceActionResult;
    if (result.success) {
      toast.success('Service deleted');
      fetchServices();
    } else {
      toast.error(result.error || 'Failed to delete service');
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
      tags: [],
      isPublished: false,
    });
    setEditingService(null);
    setDetails([{ heading: '', lines: [''] }]);
    if (imageInputRef.current) imageInputRef.current.value = '';
  };

  const ImageUploadGallery = () => {
    return (
      <div className="space-y-2">
        <Label>Service Images</Label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {formData.images.map((url, index) => (
            <div
              key={index}
              className="relative w-full h-32 border border-dashed rounded-md overflow-hidden"
            >
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

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const filteredServices = services.filter((service) => {
    if (!searchQuery) return true;

    const query = searchQuery.toLowerCase();
    return (
      service.name.toLowerCase().includes(query) ||
      service.category.toLowerCase().includes(query) ||
      service.description.toLowerCase().includes(query) ||
      service.tags.some(tag => tag.toLowerCase().includes(query))
    );
  });

  const totalPages = Math.ceil(filteredServices.length / servicesPerPage);
  const indexOfLastService = currentPage * servicesPerPage;
  const indexOfFirstService = indexOfLastService - servicesPerPage;
  const currentServices = filteredServices.slice(indexOfFirstService, indexOfLastService);

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="w-full mx-auto p-6 space-y-10">
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
                  onChange={(e) => handleNameChange(e.target.value)}
                  className={nameError ? 'border-red-500' : ''}
                  required
                />
                {isCheckingName && (
                  <p className="text-sm text-gray-500 flex items-center mt-1">
                    <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                    Checking name availability...
                  </p>
                )}
                {nameError && (
                  <p className="text-sm text-red-500 mt-1">{nameError}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) =>
                    setFormData({ ...formData, category: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {data.ServiceCategoryData.map((cat) => (
                      <SelectItem key={cat.id} value={cat.title}>
                        {cat.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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

            <ImageUploadGallery />

            <div className="space-y-2">
              <Label>Tags</Label>
              <div className="space-y-4">
                <Select onValueChange={handleTagSelect}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select tags" />
                  </SelectTrigger>
                  <SelectContent>
                    {tagsData.map((tag) => (
                      <SelectItem key={tag.id} value={tag.name}>
                        {tag.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="py-1 flex gap-1 items-center"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <X size={14} />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

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

      <Card className="shadow-lg">
        <CardHeader className="border-b pb-4">
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl font-bold">Services</CardTitle>
            <Button
              variant="outline"
              onClick={fetchServices}
              disabled={loading}
            >
              <RefreshCw
                className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`}
              />
              Refresh
            </Button>
          </div>

          <div className="mt-4 flex items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by name, category, description, or tags..."
                value={searchQuery}
                onChange={handleSearch}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <>
              <Table className="min-w-full">
                <TableHeader className="bg-gray-100">
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Tags</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentServices.length > 0 ? (
                    currentServices.map((service) => (
                      <TableRow key={service.id} className="hover:bg-gray-50">
                        <TableCell>{service.name}</TableCell>
                        <TableCell>{service.category}</TableCell>
                        <TableCell>₹{service.price}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {service.tags.map((tag) => (
                              <Badge
                                key={tag}
                                variant="outline"
                                className="text-xs"
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          {service.isPublished ? 'Published' : 'Not Published'}
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
                                description: service.description || '',
                                price: service.price.toString(),
                                listPrice: service.listPrice.toString(),
                                images: service.images,
                                imageFileIds: [],
                                tags: service.tags,
                                isPublished: service.isPublished,
                              });
                              const parsedDetails =
                                typeof service.details === 'string' &&
                                service.details
                                  ? JSON.parse(service.details) || [
                                      { heading: '', lines: [''] },
                                    ]
                                  : service.details || [
                                      { heading: '', lines: [''] },
                                    ];
                              setDetails(parsedDetails as Detail[]);
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
                                  Are you sure you want to delete this service? This
                                  action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(service.id)}
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="text-center py-10 text-gray-500"
                      >
                        No services found matching the search query
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>

              {filteredServices.length > 0 && (
                <div className="flex items-center justify-between border-t pt-4 mt-4">
                  <div className="text-sm text-gray-500">
                    Showing{' '}
                    <span className="font-medium">{indexOfFirstService + 1}</span>{' '}
                    to{' '}
                    <span className="font-medium">
                      {Math.min(indexOfLastService, filteredServices.length)}
                    </span>{' '}
                    of{' '}
                    <span className="font-medium">{filteredServices.length}</span>{' '}
                    services
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => paginate(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }

                      return (
                        <Button
                          key={pageNum}
                          variant={currentPage === pageNum ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => paginate(pageNum)}
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => paginate(currentPage + 1)}
                      disabled={currentPage === totalPages || totalPages === 0}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
