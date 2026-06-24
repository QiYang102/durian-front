import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute } from "@tanstack/react-router";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/Button";
import { ImageUpload } from "@/components/ui/ImageUpload";

const schema = z.object({
  file: z
    .array(z.instanceof(File))
    .min(1, "Please upload at least one file")
    .max(1, "Please upload only one file"),
});

type FormData = z.infer<typeof schema>;

function UploadFileSample() {
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: FormData) => {
    const file = data.file; // Access the uploaded file here
    console.log("File uploaded:", file);
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
    register,
  } = form;

  return (
    <>
      <div>Sandbox - Upload File</div>

      {/* Old way */}
      {/* <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="file">Upload File</label>
          <input type="file" {...register("file")} />
          {errors.file && <p>{errors.file.message}</p>}
        </div>
        <button type="submit">Submit</button>
      </form> */}
      <div className="flex flex-1 flex-col rounded-sm border border-gray-300 p-6">
        <FormProvider {...form}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-1 flex-col gap-3 "
          >
            <ImageUpload
              name="file"
              formLabel="Upload File"
              control={control}
              placeholder="Click or drag file here"
            />
            <Button type="submit">Submit</Button>
          </form>
        </FormProvider>
      </div>
    </>
  );
}

export const Route = createFileRoute("/_sandbox/sandbox/upload-file")({
  component: UploadFileSample,
});
