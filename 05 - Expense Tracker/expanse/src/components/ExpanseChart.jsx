import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, Legend, ResponsiveContainer } from "recharts";

const ExpenseChart = ({ expenses }) => {
    if (!expenses || expenses.length === 0) {
        return <p className="text-gray-500 text-center">No expenses available for chart.</p>;
    }

    // Group expenses by category and sum amounts
    const categoryData = expenses.reduce((acc, expense) => {
        const found = acc.find((item) => item.category === expense.category);
        if (found) {
            found.amount += Number(expense.amount); // Ensure values are numbers
        } else {
            acc.push({ category: expense.category, amount: Number(expense.amount) });
        }
        return acc;
    }, []);

    const COLORS = ["#FF5733", "#33FF57", "#3385FF", "#FF33F6", "#FFD700", "#00FFFF"];

    return (
        <div className="bg-white p-4 shadow-md rounded">
            <h2 className="text-lg font-semibold mb-3 text-center">Expense Chart</h2>

            <div className="flex flex-col md:flex-row justify-center items-center gap-8">
                {/* Bar Chart */}
                <div className="w-full md:w-1/2">
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={categoryData}>
                            <XAxis dataKey="category" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="amount" fill="#8884d8" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Pie Chart */}
                <div className="w-full md:w-1/2">
                    <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                            <Pie
                                data={categoryData}
                                dataKey="amount"
                                outerRadius={80}
                                label
                            >
                                {categoryData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default ExpenseChart;
