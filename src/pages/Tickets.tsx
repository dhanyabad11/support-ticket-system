import React, { useState, useEffect } from "react";
import {
    collection,
    query,
    where,
    onSnapshot,
    doc,
    updateDoc,
    deleteDoc,
} from "firebase/firestore";
import { Edit2, Eye, Trash2, Plus } from "lucide-react";
import { X } from "lucide-react";
import { db } from "../firebase";
import { useAuth } from "../contexts/AuthContext";
import { Layout } from "../components/Layout";
import { TicketForm } from "../components/TicketForm";
import { Ticket } from "../types";

export const Tickets: React.FC = () => {
    const { user } = useAuth();
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [showTicketForm, setShowTicketForm] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

    useEffect(() => {
        const ticketsRef = collection(db, "tickets");
        const q =
            user?.role === "customer"
                ? query(ticketsRef, where("createdBy", "==", user.uid))
                : query(ticketsRef);

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const ticketData: Ticket[] = [];
            snapshot.forEach((doc) => {
                ticketData.push({ id: doc.id, ...doc.data() } as Ticket);
            });
            setTickets(ticketData);
        });

        return () => unsubscribe();
    }, [user]);

    const handleStatusUpdate = async (ticketId: string, newStatus: string) => {
        try {
            await updateDoc(doc(db, "tickets", ticketId), {
                status: newStatus,
            });
        } catch (error) {
            console.error("Error updating ticket status:", error);
        }
    };

    const handleAssign = async (ticketId: string) => {
        try {
            await updateDoc(doc(db, "tickets", ticketId), {
                assignedTo: user?.uid,
            });
        } catch (error) {
            console.error("Error assigning ticket:", error);
        }
    };

    const handleDelete = async (ticketId: string) => {
        if (window.confirm("Are you sure you want to delete this ticket?")) {
            try {
                await deleteDoc(doc(db, "tickets", ticketId));
            } catch (error) {
                console.error("Error deleting ticket:", error);
            }
        }
    };

    return (
        <Layout>
            <div className="bg-white rounded-lg shadow">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold text-gray-900">Support Tickets</h2>
                        {user?.role === "customer" && (
                            <button
                                onClick={() => setShowTicketForm(true)}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                            >
                                <Plus className="w-5 h-5" />
                                New Ticket
                            </button>
                        )}
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    ID
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Title
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Priority
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Created By
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Assigned To
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {tickets.map((ticket) => (
                                <tr key={ticket.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {ticket.id.slice(0, 8)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {ticket.title}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span
                                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                      ${
                          ticket.priority === "high"
                              ? "bg-red-100 text-red-800"
                              : ticket.priority === "medium"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-green-100 text-green-800"
                      }`}
                                        >
                                            {ticket.priority}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {user?.role === "agent" ? (
                                            <select
                                                value={ticket.status}
                                                onChange={(e) =>
                                                    handleStatusUpdate(ticket.id, e.target.value)
                                                }
                                                className="text-sm rounded-md border-gray-300"
                                            >
                                                <option value="open">Open</option>
                                                <option value="in-progress">In Progress</option>
                                                <option value="resolved">Resolved</option>
                                            </select>
                                        ) : (
                                            <span
                                                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                        ${
                            ticket.status === "resolved"
                                ? "bg-green-100 text-green-800"
                                : ticket.status === "in-progress"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-gray-100 text-gray-800"
                        }`}
                                            >
                                                {ticket.status}
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {ticket.createdBy}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {user?.role === "agent" && !ticket.assignedTo ? (
                                            <button
                                                onClick={() => handleAssign(ticket.id)}
                                                className="text-blue-600 hover:text-blue-900"
                                            >
                                                Assign to me
                                            </button>
                                        ) : (
                                            ticket.assignedTo || "Unassigned"
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={() => setSelectedTicket(ticket)}
                                                className="text-blue-600 hover:text-blue-900"
                                            >
                                                <Eye className="w-5 h-5" />
                                            </button>
                                            {user?.role === "agent" && (
                                                <button className="text-yellow-600 hover:text-yellow-900">
                                                    <Edit2 className="w-5 h-5" />
                                                </button>
                                            )}
                                            {user?.role === "customer" &&
                                                ticket.createdBy === user.uid && (
                                                    <button
                                                        onClick={() => handleDelete(ticket.id)}
                                                        className="text-red-600 hover:text-red-900"
                                                    >
                                                        <Trash2 className="w-5 h-5" />
                                                    </button>
                                                )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {showTicketForm && (
                <TicketForm
                    onClose={() => setShowTicketForm(false)}
                    onSuccess={() => setShowTicketForm(false)}
                />
            )}

            {selectedTicket && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white rounded-lg p-8 max-w-2xl w-full">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold">Ticket Details</h2>
                            <button
                                onClick={() => setSelectedTicket(null)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <h3 className="text-sm font-medium text-gray-500">Title</h3>
                                <p className="mt-1">{selectedTicket.title}</p>
                            </div>

                            <div>
                                <h3 className="text-sm font-medium text-gray-500">Description</h3>
                                <p className="mt-1">{selectedTicket.description}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">Priority</h3>
                                    <p className="mt-1">{selectedTicket.priority}</p>
                                </div>

                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">Status</h3>
                                    <p className="mt-1">{selectedTicket.status}</p>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-sm font-medium text-gray-500">
                                    Contact Information
                                </h3>
                                <p className="mt-1">Email: {selectedTicket.contactEmail}</p>
                                <p className="mt-1">Phone: {selectedTicket.contactPhone}</p>
                            </div>

                            {selectedTicket.attachmentUrl && (
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">
                                        Attachment
                                    </h3>
                                    <a
                                        href={selectedTicket.attachmentUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="mt-1 text-blue-600 hover:text-blue-800"
                                    >
                                        View Attachment
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </Layout>
    );
};
