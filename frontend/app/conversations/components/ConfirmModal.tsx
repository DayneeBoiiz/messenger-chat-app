"use client";

import useConversation from "@/components/hooks/useConversation";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import Cookies from "js-cookie";
import Modal from "./Modal";
import { FiAlertTriangle } from "react-icons/fi";
import { Dialog } from "@headlessui/react";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";

interface ConfirmModalProps {
  isOpen?: boolean;
  onClose: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({ isOpen, onClose }) => {
  const router = useRouter();
  const { conversationId } = useConversation();
  const [isLoading, setIsLoading] = useState(false);

  const onDelete = useCallback(() => {
    setIsLoading(true);
    const sessionID = Cookies.get("sessionID");

    axios
      .delete(
        `${process.env.NEXT_PUBLIC_BACKEND_HOST}/conversations/${conversationId}/delete`,
        {
          headers: {
            Authorization: `Bearer ${sessionID}`,
          },
        }
      )
      .then(() => {
        onClose();
        router.push("/conversations");
        router.refresh();
      })
      .catch((error) => {
        toast.error("Something went wrong");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [conversationId, router, onClose]);

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <div className="sm:flex sm:items-start">
          <div className="mx-auto flex h-12 w-12 flex-shrink-0 justify-center items-center rounded-full bg-red-100 sm:mx-0 sm:w-10 sm:h-10">
            <FiAlertTriangle className="h-6 w-6 text-red-500" />
          </div>
          <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
            <Dialog.Title
              as="h3"
              className="text-base font-semibold leading-6 text-gray-900"
            >
              Delete Conversation
            </Dialog.Title>
            <div className="mt-2">
              <p className="text-sm text-gray-500">
                re you sure you want to delete this conversation? This action
                cannot be undone
              </p>
            </div>
          </div>
        </div>
        <div className="mt-5 gap-2 sm:mt-4 sm:flex sm:flex-row-reverse">
          <Button
            disabled={isLoading}
            className="bg-red-500 rounded-[5px] hover:bg-red-600"
            onClick={onDelete}
          >
            Delete
          </Button>
          <Button
            disabled={isLoading}
            className="hover:bg-neutral-200 rounded-[5px]"
            onClick={onClose}
          >
            Cancel
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default ConfirmModal;
