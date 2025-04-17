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
  createOffer,
  updateOffer,
  deleteOffer,
  getAllOffers,
} from '@/actions/offer.action';
import {
  uploadImageToDrive,
  deleteImageFromDrive,
} from '@/actions/driveupload.action';

interface Offer {
  id: string;
  image: string;
  offerCode: string;
  discountPercentage: number;
  maxAmount: number;
  isPublished: boolean;
  imageFileId: string;
  createdAt: string;
  updatedAt: string;
}

interface FormDataState {
  image: string;
  offerCode: string;
  discountPercentage: string;
  maxAmount: string;
  isPublished: boolean;
  imageFileId: string;
}

export default function OffersManager() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);
  const [formData, setFormData] = useState<FormDataState>({
    image: '',
    offerCode: '',
    discountPercentage: '',
    maxAmount: '',
    isPublished: false,
    imageFileId: '',
  });

  // Ref for file input
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  // Ref to track unsaved image file ID
  const unsavedImageFileIdRef = useRef<string>('');

  useEffect(() => {
    fetchOffers();
  }, []);

  // Cleanup unsaved image on unmount
  useEffect(() => {
    return () => {
      if (unsavedImageFileIdRef.current) {
        deleteImageFromDrive(unsavedImageFileIdRef.current);
      }
    };
  }, []);

  const fetchOffers = async () => {
    const result = await getAllOffers();
    if (result.success && result.data) {
      const offersWithStringDates: Offer[] = result.data.map(
        (offer: {
          id: string;
          image: string;
          offerCode: string;
          discountPercentage: number;
          maxAmount: number;
          isPublished: boolean;
          imageFileId?: string;
          createdAt: Date;
          updatedAt: Date;
        }) => ({
          ...offer,
          createdAt: offer.createdAt.toISOString(),
          updatedAt: offer.updatedAt.toISOString(),
          imageFileId: offer.imageFileId || '',
        }),
      );
      setOffers(offersWithStringDates);
    } else {
      toast.error(result.error);
    }
    setLoading(false);
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    const uploadToastId = toast.loading('Uploading image...');
    const uploadResult = await uploadImageToDrive(file);

    if (uploadResult.success) {
      setFormData((prev) => {
        const newData = {
          ...prev,
          image: uploadResult.url || '',
          imageFileId: uploadResult.fileId || '',
        };
        // Track unsaved file ID
        unsavedImageFileIdRef.current = uploadResult.fileId || '';
        return newData;
      });
      toast.success('Image uploaded!', { id: uploadToastId });
    } else {
      toast.error(uploadResult.error || 'Failed to upload image', {
        id: uploadToastId,
      });
    }
    setUploadingImage(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const form = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      form.append(key, value.toString());
    });

    const result = editingOffer
      ? await updateOffer(editingOffer.id, form)
      : await createOffer(form);

    if (result.success) {
      toast.success(editingOffer ? 'Offer updated' : 'Offer created');
      // Clear unsaved image ref since it's now saved
      unsavedImageFileIdRef.current = '';
      resetForm();
      fetchOffers();
    } else {
      toast.error(result.error);
    }
    setLoading(false);
  };

  const handleDelete = async (offer: Offer) => {
    setLoading(true);
    const result = await deleteOffer(offer.id);
    if (result.success) {
      if (offer.imageFileId) {
        await deleteImageFromDrive(offer.imageFileId);
      }
      toast.success('Offer deleted');
      fetchOffers();
    } else {
      toast.error(result.error);
    }
    setLoading(false);
  };

  const resetForm = () => {
    setFormData({
      image: '',
      offerCode: '',
      discountPercentage: '',
      maxAmount: '',
      isPublished: false,
      imageFileId: '',
    });
    setEditingOffer(null);
    if (imageInputRef.current) imageInputRef.current.value = '';
  };

  // Reusable file upload field
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
      <div className="w-full space-y-2">
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
            {editingOffer ? 'Edit Offer' : 'Create Offer'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <FileUploadField
              id="imageFile"
              label="Offer Image"
              fileUrl={formData.image}
              onChange={handleFileChange}
              uploading={uploadingImage}
              required={true}
              inputRef={imageInputRef}
            />

            <div className="space-y-2">
              <Label htmlFor="offerCode">Offer Code</Label>
              <Input
                id="offerCode"
                placeholder="Enter offer code"
                value={formData.offerCode}
                onChange={(e) =>
                  setFormData({ ...formData, offerCode: e.target.value })
                }
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="discountPercentage">
                  Discount Percentage (%)
                </Label>
                <Input
                  id="discountPercentage"
                  type="number"
                  placeholder="Enter discount percentage"
                  value={formData.discountPercentage}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      discountPercentage: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxAmount">Maximum Amount</Label>
                <Input
                  id="maxAmount"
                  type="number"
                  placeholder="Enter maximum amount"
                  value={formData.maxAmount}
                  onChange={(e) =>
                    setFormData({ ...formData, maxAmount: e.target.value })
                  }
                  required
                />
              </div>
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
              <Button type="submit" disabled={loading || uploadingImage}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {editingOffer ? 'Update Offer' : 'Create Offer'}
              </Button>
              {editingOffer && (
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Offers List Card */}
      <Card className="shadow-lg">
        <CardHeader className="border-b pb-4">
          <CardTitle className="text-2xl font-bold">Offers</CardTitle>
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
                    <TableHead>Offer Code</TableHead>
                    <TableHead>Discount %</TableHead>
                    <TableHead>Max Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {offers.map((offer) => (
                    <TableRow key={offer.id} className="hover:bg-gray-50">
                      <TableCell className="whitespace-nowrap">
                        <div className="relative w-16 h-16">
                          <Image
                            src={offer.image}
                            alt="Offer"
                            fill
                            className="object-cover rounded"
                          />
                        </div>
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        {offer.offerCode}
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        {offer.discountPercentage}%
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        ₹{offer.maxAmount}
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        {offer.isPublished ? 'Published' : 'Not Published'}
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setEditingOffer(offer);
                            setFormData({
                              image: offer.image,
                              offerCode: offer.offerCode,
                              discountPercentage:
                                offer.discountPercentage.toString(),
                              maxAmount: offer.maxAmount.toString(),
                              isPublished: offer.isPublished,
                              imageFileId: offer.imageFileId,
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
                              <AlertDialogTitle>Delete Offer</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this offer? This
                                action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(offer)}
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
