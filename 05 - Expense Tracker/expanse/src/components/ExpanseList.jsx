import React from "react";

const ExpenseList = ({ expenses, deleteExpense }) => {
    return (
        <div className="bg-white p-4 shadow-md rounded mb-5">
            <h2 className="text-lg font-semibold mb-3">Expenses</h2>
            {expenses.length === 0 ? (
                <p className="text-gray-500">No expenses added yet.</p>
            ) : (
                expenses.map((expense) => (
                    <div key={expense.id} className="flex justify-between items-center p-2 border-b">
                        <div>
                            <h3 className="font-semibold">{expense.title}</h3>
                            <p className="text-gray-500">${expense.amount} - {expense.category}</p>
                            <p className="text-xs text-gray-400">Added on: {expense.date} at {expense.time}</p>
                        </div>
                        <button onClick={() => deleteExpense(expense.id)} className="text-red-500">
                            Delete
                        </button>
                    </div>
                ))
            )}
        </div>
    );
};

export default ExpenseList;
