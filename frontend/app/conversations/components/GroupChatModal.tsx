"use client";

import { usersProps } from "@/app/users/layout";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Cookies from "js-cookie";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import Modal from "./Modal";
import Input from "@/components/Input";
import Select from "./Select";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";

interface GroupChatModalProps {
  isOpen?: boolean;
  onClose: () => void;
  users: usersProps[];
}

const GroupChatModal: React.FC<GroupChatModalProps> = ({
  isOpen,
  onClose,
  users,
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: "",
      memebers: [],
    },
  });

  const members = watch("members");

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);

    axios
      .post(
        `${process.env.NEXT_PUBLIC_BACKEND_HOST}/conversations/`,
        {
          ...data,
          isGroup: true,
        },
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("sessionID")}`,
          },
        }
      )
      .then(() => {
        router.refresh();
        onClose();
      })
      .catch((error) => {
        toast.error("Something went wrong");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-12">
            <div className="border-b border-gray-900/10 scroll-pb-12">
              <h2 className="text-base font-semibold leading-7 text-gray-700">
                Create a group chat
              </h2>
              <p className="mt-1 text-sm leading-6 text-gray-600">
                Create a chat with more that 2 people
              </p>
              <div className="mt-10 flex flex-col gap-y-8">
                <Input
                  register={register}
                  label="Name"
                  id="name"
                  disabled={isLoading}
                  required
                  errors={errors}
                />
                <Select
                  disabled={isLoading}
                  label="Members"
                  options={
                    users &&
                    users.map((user: any) => ({
                      label: user.username,
                      value: user.id,
                    }))
                  }
                  onChange={(value) => {
                    setValue("members", value, {
                      shouldValidate: true,
                    });
                  }}
                  value={members}
                />
              </div>
            </div>
          </div>
          <div className="mt-6 flex items-center justify-end gap-x-6">
            <Button
              className="bg-neutral-200 rounded-[5px] hover:bg-neutral-300"
              disabled={isLoading}
              onClick={onClose}
              type="button"
            >
              Cancel
            </Button>
            <Button
              disabled={isLoading}
              type="submit"
              className="bg-blue-400 hover:bg-blue-500 rounded-[5px]"
            >
              Create
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default GroupChatModal;
