'use client';

import { useState, useEffect, useRef, ChangeEvent } from 'react';
import Image from 'next/image';
import { PlusCircle, Loader2, Pencil, Trash } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  createHeroBanner,
  updateHeroBanner,
  deleteHeroBanner,
  getHeroBanners,
} from '@/actions/herobanner.action';
import {
  uploadImageToDrive,
  deleteImageFromDrive,
} from '@/actions/driveupload.action';

interface HeroBanner {
  id: string;
  image: string;
  mdImage: string;
  link: string;
  isPublished: boolean;
  imageFileId: string;
  mdImageFileId: string;
  createdAt: string;
  updatedAt: string;
}

interface FormDataState {
  image: string;
  mdImage: string;
  link: string;
  isPublished: boolean;
  imageFileId: string;
  mdImageFileId: string;
}

export default function HeroBannerManager() {
  const [banners, setBanners] = useState<HeroBanner[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingMdImage, setUploadingMdImage] = useState(false);
  const [editingBanner, setEditingBanner] = useState<HeroBanner | null>(null);
  const [formData, setFormData] = useState<FormDataState>({
    image: '',
    mdImage: '',
    link: '',
    isPublished: false,
    imageFileId: '',
    mdImageFileId: '',
  });

  // Refs for file inputs.
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const mdImageInputRef = useRef<HTMLInputElement | null>(null);
  // Refs to track unsaved image file IDs.
  const unsavedImageFileIdRef = useRef<string>('');
  const unsavedMdImageFileIdRef = useRef<string>('');

  useEffect(() => {
    fetchBanners();
  }, []);

  // Cleanup unsaved images on unmount.
  useEffect(() => {
    return () => {
      if (unsavedImageFileIdRef.current) {
        deleteImageFromDrive(unsavedImageFileIdRef.current);
      }
      if (unsavedMdImageFileIdRef.current) {
        deleteImageFromDrive(unsavedMdImageFileIdRef.current);
      }
    };
  }, []);

  const fetchBanners = async () => {
    const result = await getHeroBanners();
    if (result.success && result.data) {
      const bannersWithStringDates: HeroBanner[] = result.data.map(
        (banner: {
          id: string;
          image: string;
          mdImage: string;
          link: string;
          isPublished: boolean;
          imageFileId?: string;
          mdImageFileId?: string;
          createdAt: Date;
          updatedAt: Date;
        }) => ({
          ...banner,
          createdAt: banner.createdAt.toISOString(),
          updatedAt: banner.updatedAt.toISOString(),
          imageFileId: banner.imageFileId || '',
          mdImageFileId: banner.mdImageFileId || '',
        })
      );
      setBanners(bannersWithStringDates);
    } else {
      toast.error(result.error);
    }
    setLoading(false);
  };

  // Custom file upload field using a label wrapper.
  const handleFileChange = async (
    e: ChangeEvent<HTMLInputElement>,
    key: 'image' | 'mdImage',
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (key === 'image') {
      setUploadingImage(true);
    } else {
      setUploadingMdImage(true);
    }
    const uploadToastId = toast.loading('Uploading image...');
    const uploadResult = await uploadImageToDrive(file);
    if (uploadResult.success) {
      setFormData((prev) => {
        const newData = {
          ...prev,
          [key]: uploadResult.url || '',
          [`${key}FileId`]: uploadResult.fileId || '',
        };
        // Track unsaved file IDs.
        if (key === 'image') {
          unsavedImageFileIdRef.current = uploadResult.fileId || '';
        } else {
          unsavedMdImageFileIdRef.current = uploadResult.fileId || '';
        }
        return newData;
      });
      toast.success('Image uploaded!', { id: uploadToastId });
    } else {
      toast.error(uploadResult.error || 'Failed to upload image', {
        id: uploadToastId,
      });
    }
    if (key === 'image') {
      setUploadingImage(false);
    } else {
      setUploadingMdImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const form = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      form.append(key, value.toString());
    });
    const result = editingBanner
      ? await updateHeroBanner(editingBanner.id, form)
      : await createHeroBanner(form);
    if (result.success) {
      toast.success(editingBanner ? 'Banner updated' : 'Banner created');
      // Clear unsaved image refs since they're now saved.
      unsavedImageFileIdRef.current = '';
      unsavedMdImageFileIdRef.current = '';
      resetForm();
      fetchBanners();
    } else {
      toast.error(result.error);
    }
    setLoading(false);
  };

  const handleDelete = async (banner: HeroBanner) => {
    setLoading(true);
    const result = await deleteHeroBanner(banner.id);
    if (result.success) {
      if (banner.imageFileId) {
        await deleteImageFromDrive(banner.imageFileId);
      }
      if (banner.mdImageFileId) {
        await deleteImageFromDrive(banner.mdImageFileId);
      }
      toast.success('Banner deleted');
      fetchBanners();
    } else {
      toast.error(result.error);
    }
    setLoading(false);
  };

  const resetForm = () => {
    setFormData({
      image: '',
      mdImage: '',
      link: '',
      isPublished: false,
      imageFileId: '',
      mdImageFileId: '',
    });
    setEditingBanner(null);
    if (imageInputRef.current) imageInputRef.current.value = '';
    if (mdImageInputRef.current) mdImageInputRef.current.value = '';
  };

  // Reusable file upload field.
  const FileUploadField = ({
    id,
    label,
    fileUrl,
    onChange,
    uploading,
    required = false,
    inputRef,
  }: {
    id: string;
    label: string;
    fileUrl: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    uploading: boolean;
    required?: boolean;
    inputRef: React.RefObject<HTMLInputElement | null>;
  }) => {
    return (
      <div className="w-full md:w-1/2 space-y-2">
        <Label htmlFor={id}>{label}</Label>
        <label
          htmlFor={id}
          className="relative w-full h-40 border border-dashed rounded-md flex items-center justify-center cursor-pointer hover:border-gray-400 overflow-hidden"
        >
          <input
            id={id}
            type="file"
            accept="image/*"
            className="absolute inset-0 opacity-0 cursor-pointer"
            onChange={onChange}
            required={!formData.image && required}
            ref={inputRef}
          />
          {uploading ? (
            <div className="flex items-center justify-center w-full h-full">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : fileUrl ? (
            <div className="relative w-full h-full">
              <Image
                src={fileUrl}
                alt={`${label} Preview`}
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <PlusCircle className="text-gray-400" size={40} />
          )}
        </label>
        {fileUrl && (
          <div className="text-sm text-gray-500 break-all mt-1">{fileUrl}</div>
        )}
      </div>
    );
  };

  return (
    <div className="mx-auto px-4 py-8 space-y-10">
      {/* Form Card */}
      <Card className="shadow-lg">
        <CardHeader className="border-b pb-4">
          <CardTitle className="text-2xl font-bold">
            {editingBanner ? 'Edit Banner' : 'Create Banner'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col md:flex-row gap-6">
              <FileUploadField
                id="imageFile"
                label="Banner Image"
                fileUrl={formData.image}
                onChange={(e) => handleFileChange(e, 'image')}
                uploading={uploadingImage}
                required={true}
                inputRef={imageInputRef}
              />
              <FileUploadField
                id="mdImageFile"
                label="Medium Banner Image"
                fileUrl={formData.mdImage}
                onChange={(e) => handleFileChange(e, 'mdImage')}
                uploading={uploadingMdImage}
                required={false}
                inputRef={mdImageInputRef}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="link">Link</Label>
              <Input
                id="link"
                placeholder="Enter link"
                value={formData.link}
                onChange={(e) =>
                  setFormData({ ...formData, link: e.target.value })
                }
                required
              />
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
              <Button
                type="submit"
                disabled={loading || uploadingImage || uploadingMdImage}
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {editingBanner ? 'Update Banner' : 'Create Banner'}
              </Button>
              {editingBanner && (
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Banners List Card */}
      <Card className="shadow-lg">
        <CardHeader className="border-b pb-4">
          <CardTitle className="text-2xl font-bold">Hero Banners</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table className="min-w-full">
                <TableHeader className="bg-gray-100">
                  <TableRow>
                    <TableHead>Image</TableHead>
                    <TableHead>Medium Image</TableHead>
                    <TableHead>Link</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {banners.map((banner) => (
                    <TableRow key={banner.id} className="hover:bg-gray-50">
                      <TableCell className="whitespace-nowrap">
                        <div className="relative w-16 h-16">
                          <Image
                            src={banner.image}
                            alt="Banner"
                            fill
                            className="object-cover rounded"
                          />
                        </div>
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        <div className="relative w-16 h-16">
                          <Image
                            src={banner.mdImage}
                            alt="Medium Banner"
                            fill
                            className="object-cover rounded"
                          />
                        </div>
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        {banner.link}
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        {banner.isPublished ? 'Published' : 'Draft'}
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setEditingBanner(banner);
                            setFormData({
                              image: banner.image,
                              mdImage: banner.mdImage,
                              link: banner.link,
                              isPublished: banner.isPublished,
                              imageFileId: banner.imageFileId,
                              mdImageFileId: banner.mdImageFileId,
                            });
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
                              <AlertDialogTitle>Delete Banner</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this banner?
                                This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(banner)}
                              >
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
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
