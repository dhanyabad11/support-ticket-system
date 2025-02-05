import React from "react";
import { useForm, Controller } from "react-hook-form";
import { X } from "lucide-react";
import { addDoc, collection } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../firebase";
import { useAuth } from "../contexts/AuthContext";

interface TicketFormProps {
    onClose: () => void;
    onSuccess: () => void;
}

export const TicketForm: React.FC<TicketFormProps> = ({ onClose, onSuccess }) => {
    const { user } = useAuth();
    const {
        register,
        control,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = async (data: any) => {
        try {
            let attachmentUrl = "";

            if (data.attachmentFile && data.attachmentFile.length > 0) {
                const file = data.attachmentFile[0];
                const storageRef = ref(storage, `attachments/${Date.now()}_${file.name}`);
                await uploadBytes(storageRef, file);
                attachmentUrl = await getDownloadURL(storageRef);
            }

            const { attachmentFile, ...ticketData } = data;

            await addDoc(collection(db, "tickets"), {
                ...ticketData,
                attachmentUrl: attachmentUrl || "",
                createdBy: user?.uid,
                createdAt: new Date(),
                status: "open",
            });

            onSuccess();
            onClose();
        } catch (error) {
            console.error("Error creating ticket:", error);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Create New Ticket</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Title</label>
                        <input
                            {...register("title", { required: "Title is required" })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                        />
                        {errors.title && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.title.message as string}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Description
                        </label>
                        <textarea
                            {...register("description", { required: "Description is required" })}
                            rows={4}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                        />
                        {errors.description && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.description.message as string}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Priority</label>
                        <select
                            {...register("priority", { required: "Priority is required" })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                        >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Category</label>
                        <select
                            {...register("category", { required: "Category is required" })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                        >
                            <option value="technical">Technical Issue</option>
                            <option value="billing">Billing</option>
                            <option value="feature">Feature Request</option>
                            <option value="other">Other</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Contact Email
                        </label>
                        <input
                            type="email"
                            {...register("contactEmail", { required: "Contact email is required" })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                        />
                        {errors.contactEmail && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.contactEmail.message as string}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Contact Phone
                        </label>
                        <input
                            type="tel"
                            {...register("contactPhone")}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Attachment
                        </label>
                        <Controller
                            name="attachmentFile"
                            control={control}
                            defaultValue={null}
                            render={({ field }) => (
                                <input
                                    type="file"
                                    onChange={(e) => field.onChange(e.target.files)}
                                    className="mt-1 block w-full p-2"
                                />
                            )}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Additional Notes
                        </label>
                        <textarea
                            {...register("additionalNotes")}
                            rows={3}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                        />
                    </div>

                    <div className="flex justify-end gap-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                            Create Ticket
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
