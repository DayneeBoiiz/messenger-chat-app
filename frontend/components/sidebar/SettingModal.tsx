"use client";

import Modal from "@/app/conversations/components/Modal";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import Input from "../Input";
import Image from "next/image";
import { usersProps } from "@/app/users/layout";
import { Button } from "../ui/button";
import { toast } from "react-toastify";

interface SettingModalProps {
  isOpen?: boolean;
  onClose: () => void;
  currentUser: usersProps;
}

const SettingModal: React.FC<SettingModalProps> = ({
  isOpen,
  currentUser,
  onClose,
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [imageURL, setImageURL] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const sessionID = Cookies.get("sessionID");
    if (currentUser) {
      axios
        .get(
          `${process.env.NEXT_PUBLIC_BACKEND_HOST}/users/${currentUser.username}/avatar`,
          {
            responseType: "blob",
            headers: {
              Authorization: `Bearer ${sessionID}`,
            },
          }
        )
        .then((response) => {
          const url = URL.createObjectURL(response.data);
          setImageURL(url);
        })
        .catch((error) => {
          toast.error("Something went wrong");
        });
    }
  }, [currentUser, currentUser?.username]);

  const username = currentUser.username;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: username,
    },
  });

  const image = watch("image");

  const handleImageChange = (e: any) => {
    setSelectedImage(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (selectedImage) {
      const formData = new FormData();
      formData.append("image", selectedImage);

      try {
        const sessionID = Cookies.get("sessionID");
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_HOST}/avatar/upload`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${sessionID}`,
            },
          }
        );

        toast.success("Upload Success");
      } catch (error) {
        toast.error("Something went wrong");
      }
    }
  };

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);
    const sessionID = Cookies.get("sessionID");

    axios
      .post(`${process.env.NEXT_PUBLIC_BACKEND_HOST}/settings`, data, {
        headers: {
          Authorization: `Bearer ${sessionID}`,
        },
      })
      .then(() => {
        router.refresh();
        onClose();
      })
      .catch((error) => toast.error("Something went wrong"))
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-12">
            <div className="border-b border-gray-900/10 pb-12">
              <h2 className="text-base font-semibold leading-7 text-gray-700">
                Profile
              </h2>
              <p className="mt-1 text-sm eading-6 text-gray-600">
                Edit your public information
              </p>
              <div className="mt-10 flex flex-col gap-y-8">
                <Input
                  disabled={isLoading}
                  label="name"
                  id="name"
                  errors={errors}
                  required
                  register={register}
                />
                <div>
                  <label className="block text-sm font-medium leading-6 text-gray-900">
                    Photo
                  </label>
                  <div className="mt-2 flex items-center gap-x-3">
                    <Image
                      src={image || imageURL || "/default_avatar.png"}
                      width={48}
                      height={48}
                      alt="avatar"
                    />
                    <div className="flex flex-col">
                      <input
                        className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                        aria-describedby="file_input_help"
                        id="file_input"
                        type="file"
                        onChange={handleImageChange}
                      ></input>
                      <p
                        className="mt-1 text-sm text-gray-500 dark:text-gray-300"
                        id="file_input_help"
                      >
                        SVG, PNG, JPG or GIF (MAX. 800x400px).
                      </p>
                    </div>
                    <Button
                      disabled={isLoading}
                      className="bg-neutral-200 rounded-[5px] hover:bg-neutral-300"
                      type="button"
                      onClick={handleUpload}
                    >
                      Upload
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-6 flex items-center justify-end gap-x-6">
              <Button
                disabled={isLoading}
                className="bg-neutral-100 hover:bg-neutral-200 rounded-[5px]"
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
                Save
              </Button>
            </div>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default SettingModal;
