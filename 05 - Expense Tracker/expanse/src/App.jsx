import React, { useState, useEffect } from "react";
import ExpenseForm from './components/ExpanseForm.jsx'
import ExpenseList from './components/ExpanseList.jsx'
import ExpenseChart from './components/ExpanseChart.jsx'

const App = () => {
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    const savedExpenses = JSON.parse(localStorage.getItem("expenses")) || [];
    if (savedExpenses.length > 0) {
      setExpenses(savedExpenses);
    }
  }, []);

  useEffect(() => {
    if (expenses.length > 0) {
      localStorage.setItem("expenses", JSON.stringify(expenses));
    }
  }, [expenses]);

  const addExpense = (expense) => {
    setExpenses([...expenses, expense]);
  };

  const deleteExpense = (id) => {
    const updatedExpenses = expenses.filter((expense) => expense.id !== id);
    setExpenses(updatedExpenses);
    localStorage.setItem("expenses", JSON.stringify(updatedExpenses)); // Then update localStorage
  };

  return (
    <div className="min-h-screen bg-gray-100 p-5">
      <h1 className="text-2xl font-bold text-center mb-5">Expense Tracker</h1>

      <ExpenseForm addExpense={addExpense} />
      <ExpenseList expenses={expenses} deleteExpense={deleteExpense} />
      <ExpenseChart expenses={expenses} />
    </div>
  );
};

export default App;
