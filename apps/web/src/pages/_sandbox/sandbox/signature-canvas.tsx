import React, { useRef, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute } from "@tanstack/react-router";
import { FormProvider, useForm } from "react-hook-form";
import SignatureCanvas from "react-signature-canvas";
import { z } from "zod";

import { axiosClient } from "@ttm/api/axios";

import { Button } from "@/components/ui/Button";

// Define the validation schema
const formSchema = z.object({
  note: z.string(),
  text: z.string(),
});
function SandboxButton() {
  const [openModel, setOpenModal] = useState(false);
  const sigCanvas = useRef();
  const [imageURL, setImageURL] = useState(null);

  const formMethods = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      note: "",
      text: "",
    },
  });

  const create = () => {
    const URL = sigCanvas.current.getTrimmedCanvas().toDataURL("image/png");

    setImageURL(URL);
    setOpenModal(false);
  };

  function dataURLToFile(dataUrl, filename: string) {
    const arr = dataUrl.split(",");
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }

  function uploadImage(id, file) {
    const formData = new FormData();
    formData.append("file", file, file.name);

    return axiosClient
      .post(`/signatures/${id}/upload-image`, formData)
      .then((response) => {
        return response.data["reward-deal"];
      })
      .catch((error) => {
        console.error("Error uploading image:", error);
        throw error; // Rethrow the error so it can be handled where this function is called
      });
  }

  const {
    handleSubmit,
    formState: { errors },
  } = formMethods;

  const onSubmit = (data: any) => {
    const file = dataURLToFile(imageURL, "signature.png");
    console.log("file", file);
    // TODO: save new record first then only can save the image to this existing record
    // uploadImage(1, file);
  };

  return (
    <FormProvider {...formMethods}>
      <div className="pb-2">Signature Canvas</div>
      <div className="flex flex-col items-center">
        <Button className="bg-blue-400" onClick={() => setOpenModal(true)}>
          Create Signature
        </Button>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex w-full max-w-lg flex-col gap-2 p-2"
        >
          {openModel && (
            <div className="border-2 p-2">
              <SignatureCanvas
                penColor="black"
                canvasProps={{
                  className: "sigCanvas",
                  width: 500,
                  height: 200,
                }}
                ref={sigCanvas}
                className="border border-black"
              />
              <div className="flex flex-row justify-end gap-2">
                <Button onClick={create}>Confirm</Button>

                <Button
                  onClick={() => {
                    setOpenModal(false);
                    sigCanvas.current.clear();
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}

          <div className="mt-4">
            <Button type="submit" className="bg-blue-400 hover:bg-yellow-400">
              Submit
            </Button>
          </div>
        </form>

        {imageURL && (
          <>
            <img
              src={imageURL}
              alt="signature"
              className="signature border-2"
            />
          </>
        )}
      </div>
    </FormProvider>
  );
}

export const Route = createFileRoute("/_sandbox/sandbox/signature-canvas")({
  component: SandboxButton,
});
