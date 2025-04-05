"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Lightbulb, Loader2, Upload, FileText } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { IdeaFormData, ideaApi } from "../api";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Category, categoryApi } from "../api";
import { userApi } from "../../ideas/api";

interface FilePreview {
  file: File;
  preview: string;
  type: "image" | "pdf";
}

export default function IdeaFormPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const isNew = true;

  const { data: idea, isLoading } = useQuery({
    queryKey: ["idea", params.id],
    queryFn: () => ideaApi.fetchIdea(params.id as string),
    enabled: !isNew && !!params.id,
  });

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: categoryApi.fetchCategories,
  });

  const { data: currentUser } = useQuery({
    queryKey: ["currentUser"],
    queryFn: userApi.getCurrentUser,
  });

  const [formData, setFormData] = useState<IdeaFormData>({
    title: "",
    content: "",
    isAnonymous: false,
    userId: 0,
    categoryId: 1,
    remark: "",
    files: undefined,
  });

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [filePreviews, setFilePreviews] = useState<FilePreview[]>([]);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  useEffect(() => {
    if (idea) {
      setFormData({
        title: idea.title,
        content: idea.content,
        isAnonymous: idea.isAnonymous,
        userId: idea.userId,
        categoryId: idea.categoryId,
        remark: idea.remark || "",
      });
    }
  }, [idea]);

  useEffect(() => {
    if (currentUser) {
      setFormData(prev => ({
        ...prev,
        userId: currentUser.id
      }));
    }
  }, [currentUser]);

  const mutation = useMutation({
    mutationFn: (data: IdeaFormData) => ideaApi.createIdea(data),
    onSuccess: () => {
      toast.success("Idea submitted successfully");
      queryClient.invalidateQueries({ queryKey: ["ideas"] });
      router.push("/ideas");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to submit idea");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      toast.error("User not authenticated");
      return;
    }
    
    const submissionData = {
      ...formData,
      files: selectedFiles,
    };
    mutation.mutate(submissionData);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setSelectedFiles(files);

      const newPreviews = files.map((file) => {
        const preview: FilePreview = {
          file,
          preview: file.type.startsWith("image/")
            ? URL.createObjectURL(file)
            : "",
          type: file.type.startsWith("image/") ? "image" : "pdf",
        };
        return preview;
      });

      setFilePreviews(newPreviews);
    }
  };

  useEffect(() => {
    return () => {
      filePreviews.forEach((preview) => {
        if (preview.type === "image") {
          URL.revokeObjectURL(preview.preview);
        }
      });
    };
  }, [filePreviews]);

  const renderFileUploadSection = () => (
    <div className="max-lg:space-y-2 lg:flex lg:space-x-4 justify-end">
      <label
        htmlFor="files"
        className="text-sm font-medium text-gray-900 w-36 text-right"
      >
        Attachments
      </label>
      <div className="border-2 border-dashed rounded-lg p-4 w-full max-w-[50rem]">
        <Input
          id="files"
          type="file"
          multiple
          onChange={handleFileChange}
          className="w-full"
          accept=".pdf,.jpg,.jpeg,.png"
        />
        <p className="text-sm text-gray-500 mt-2">
          Accepted formats: PDF, JPG, PNG (max 2GB each)
        </p>

        {filePreviews.length > 0 && (
          <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
            {filePreviews.map((preview, index) => (
              <div key={index} className="relative group border rounded-lg p-2">
                {preview.type === "image" ? (
                  <div className="relative aspect-square">
                    <Image
                      src={preview.preview}
                      alt={preview.file.name}
                      fill
                      className="object-cover rounded"
                    />
                  </div>
                ) : (
                  <div className="flex items-center gap-2 p-2">
                    <FileText className="h-8 w-8 text-gray-500" />
                    <span className="text-sm truncate">
                      {preview.file.name}
                    </span>
                  </div>
                )}
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => {
                    setSelectedFiles((files) =>
                      files.filter((_, i) => i !== index)
                    );
                    setFilePreviews((previews) => {
                      const newPreviews = previews.filter(
                        (_, i) => i !== index
                      );
                      if (preview.type === "image") {
                        URL.revokeObjectURL(preview.preview);
                      }
                      return newPreviews;
                    });
                  }}
                >
                  ×
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  if (!isNew && isLoading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <main className="flex-1 overflow-auto">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-primary-teal rounded-lg flex items-center justify-center">
            <Lightbulb className="h-6 w-6 text-white" />
          </div>
          <div>
            <div className="text-sm text-[#3173ED]">Submitted Ideas /</div>
            <h2 className="text-xl md:text-2xl font-semibold text-gray-900">
              Create an idea
            </h2>
          </div>
        </div>
      </div>

      <div className="text-sm text-gray-500 mb-8 font-medium">
        Add your idea details here. Click save when you're done.
      </div>

      <div className="border border-[#E4E4E7] rounded-lg shadow-sm p-4 lg:p-6 flex justify-end">
        <form onSubmit={handleSubmit} className="space-y-6 w-full">
          <div className="max-lg:space-y-2 lg:flex lg:space-x-4 justify-end">
            <label
              htmlFor="title"
              className="text-sm font-medium text-gray-900 w-36 text-right mt-2.5"
            >
              Title
            </label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  title: e.target.value,
                }))
              }
              className="w-full max-w-[50rem]"
              required
              disabled={!isNew}
            />
          </div>

          <div className="max-lg:space-y-2 lg:flex lg:space-x-4 justify-end">
            <label
              htmlFor="content"
              className="text-sm font-medium text-gray-900 w-36 text-right mt-2.5"
            >
              Idea Content
            </label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, content: e.target.value }))
              }
              className="min-h-[200px] w-full max-w-[50rem]"
              required
              disabled={!isNew}
            />
          </div>

          <div className="max-lg:space-y-2 lg:flex lg:space-x-4 justify-end">
            <label
              htmlFor="category"
              className="text-sm font-medium text-gray-900 w-36 text-right mt-2.5"
            >
              Category
            </label>
            <div className="flex-1 max-w-[50rem]">
              <Select
                value={formData.categoryId.toString()}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    categoryId: parseInt(value),
                  }))
                }
                disabled={!isNew}
              >
                <SelectTrigger id="category" className="w-full">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories?.map((category) => (
                    <SelectItem
                      key={category.id}
                      value={category.id.toString()}
                    >
                      {category.categoryName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {!categories?.length && (
              <p className="text-sm text-gray-500">
                No categories available. Please contact an administrator.
              </p>
            )}
          </div>

          {isNew && renderFileUploadSection()}

          <div className="max-lg:space-y-2 lg:flex lg:space-x-4 justify-end items-center">
            <Label
              htmlFor="isAnonymous"
              className="text-sm font-medium text-gray-900 w-36 text-right"
            >
              Post an anonymous
            </Label>
            <div className="flex-1 max-w-[50rem]">
              <Switch
                id="isAnonymous"
                checked={formData.isAnonymous}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({ ...prev, isAnonymous: !!checked }))
                }
                disabled={!isNew}
                className="mt-1"
              />
            </div>
          </div>

          {isNew && (
            <div className="flex justify-end space-x-4 items-start">
              <Checkbox
                id="terms"
                checked={agreedToTerms}
                onCheckedChange={(checked: boolean) =>
                  setAgreedToTerms(!!checked)
                }
                className="mt-1"
              />
              <Label
                htmlFor="terms"
                className="text-base font-normal text-gray-600 leading-tight w-full max-w-[50rem] mt-0.5"
              >
                By submitting your idea, you agree to abide by the
                university&apos;s guidelines for respectful and relevant
                contributions.
              </Label>
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/ideas")}
            >
              {isNew ? "Cancel" : "Back"}
            </Button>
            {isNew && (
              <Button
                type="submit"
                className="bg-primary-teal hover:bg-primary-teal/90"
                disabled={mutation.isPending || !agreedToTerms}
              >
                {mutation.isPending ? "Submitting..." : "Submit Idea"}
              </Button>
            )}
          </div>
        </form>
      </div>
    </main>
  );
}
