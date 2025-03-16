'use client';

import { useState, useEffect } from 'react';
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
import { Loader2, Pencil, Trash } from 'lucide-react';
import { toast } from 'sonner';
import {
  createHeroBanner,
  updateHeroBanner,
  deleteHeroBanner,
  getHeroBanners,
} from '@/actions/herobanner.action';

interface HeroBanner {
  id: string;
  image: string;
  mdImage: string;
  link: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function HeroBannerManager() {
  const [banners, setBanners] = useState<HeroBanner[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingBanner, setEditingBanner] = useState<HeroBanner | null>(null);
  const [formData, setFormData] = useState({
    image: '',
    mdImage: '',
    link: '',
    isPublished: false,
  });

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    const result = await getHeroBanners();
    if (result.success && result.data) {
      // Convert Date objects to ISO strings
      const bannersWithStringDates = result.data.map((banner) => ({
        ...banner,
        createdAt: banner.createdAt.toISOString(),
        updatedAt: banner.updatedAt.toISOString(),
      }));
      setBanners(bannersWithStringDates);
    } else {
      toast.error(result.error);
    }
    setLoading(false);
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
      resetForm();
      fetchBanners();
    } else {
      toast.error(result.error);
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    setLoading(true);
    const result = await deleteHeroBanner(id);
    if (result.success) {
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
    });
    setEditingBanner(null);
  };

  return (
    <div className=" mx-auto px-4 py-8 space-y-10">
      {/* Form Card */}
      <Card className="shadow-lg">
        <CardHeader className="border-b pb-4">
          <CardTitle className="text-2xl font-bold">
            {editingBanner ? 'Edit Banner' : 'Create Banner'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="image">Image URL</Label>
                <Input
                  id="image"
                  placeholder="Enter image URL"
                  value={formData.image}
                  onChange={(e) =>
                    setFormData({ ...formData, image: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mdImage">Medium Image URL</Label>
                <Input
                  id="mdImage"
                  placeholder="Enter medium image URL"
                  value={formData.mdImage}
                  onChange={(e) =>
                    setFormData({ ...formData, mdImage: e.target.value })
                  }
                />
              </div>
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
              <Button type="submit" disabled={loading}>
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
                        <img
                          src={banner.image}
                          alt="Banner"
                          className="w-16 h-16 object-cover rounded"
                        />
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        <img
                          src={banner.mdImage}
                          alt="Medium Banner"
                          className="w-16 h-16 object-cover rounded"
                        />
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
                                onClick={() => handleDelete(banner.id)}
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
