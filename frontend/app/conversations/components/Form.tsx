"use client";

import useConversation from "@/components/hooks/useConversation";
import axios from "axios";
import { FieldValues, useForm, SubmitHandler } from "react-hook-form";
import Cookies from "js-cookie";
import { HiPhoto, HiPaperAirplane } from "react-icons/hi2";
import MessageInput from "./MessageInput";
import { CldUploadButton } from "next-cloudinary";

const Form = () => {
  const { conversationId } = useConversation();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      message: "",
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setValue("message", "", { shouldValidate: true });
    const sessionID = Cookies.get("sessionID");
    axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_HOST}/messages`,
      {
        ...data,
        conversationId,
      },
      {
        headers: {
          Authorization: `Bearer ${sessionID}`,
        },
      }
    );
  };

  const handleUpload = (result: any) => {
    const sessionID = Cookies.get("sessionID");
    axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_HOST}/messages`,
      {
        image: result?.info?.secure_url,
        conversationId,
      },
      {
        headers: {
          Authorization: `Bearer ${sessionID}`,
        },
      }
    );
  };

  return (
    <>
      <div className="py-4 px-4 bg-white border-t flex items-center gap-2 lg:gap-4">
        <CldUploadButton
          options={{ maxFiles: 1 }}
          onUpload={handleUpload}
          uploadPreset="x9af5k9y"
        >
          <HiPhoto size={28} className="text-sky-600" />
        </CldUploadButton>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex items-center gap-2 lg:gap-4 w-full"
        >
          <MessageInput
            id="message"
            register={register}
            errors={errors}
            required
            placeholder="Write a message"
          />
          <button
            type="submit"
            className="rounded-full p-2 bg-sky-500 cursor-pointer hover:bg-sky-600 transition"
          >
            <HiPaperAirplane size={18} className="text-white" />
          </button>
        </form>
      </div>
    </>
  );
};

export default Form;
