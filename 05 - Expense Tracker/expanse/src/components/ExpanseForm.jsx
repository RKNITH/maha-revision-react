import React, { useState } from "react";

const ExpenseForm = ({ addExpense }) => {
    const [title, setTitle] = useState("");
    const [amount, setAmount] = useState("");
    const [category, setCategory] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!title || !amount || !category) return;

        const now = new Date();
        const newExpense = {
            id: Date.now(),
            title,
            amount,
            category,
            date: now.toLocaleDateString(),  // Store date in localStorage
            time: now.toLocaleTimeString()   // Store time in localStorage
        };

        addExpense(newExpense);
        setTitle("");
        setAmount("");
        setCategory("");
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-4 shadow-md rounded mb-5">
            <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-2 border rounded mb-2"
            />
            <input
                type="number"
                placeholder="Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full p-2 border rounded mb-2"
            />
            <input
                type="text"
                placeholder="Category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-2 border rounded mb-2"
            />
            <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
                Add Expense
            </button>
        </form>
    );
};

export default ExpenseForm;
