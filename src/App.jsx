import './App.css'

import React, { useState } from "react";
import "./styles.css";

const initialData = [
  {
    id: "electronics",
    label: "Electronics",
    originalValue: 1500,
    children: [
      { id: "phones", label: "Phones", value: 800, originalValue: 800 },
      { id: "laptops", label: "Laptops", value: 700, originalValue: 700 },
    ],
  },
  {
    id: "furniture",
    label: "Furniture",
    originalValue: 1000,
    children: [
      { id: "tables", label: "Tables", value: 300, originalValue: 300 },
      { id: "chairs", label: "Chairs", value: 700, originalValue: 700 },
    ],
  },
];

const updateParentValues = (data) => {
  return data.map((category) => {
    if (category.children) {
      const updatedChildren = category.children.map((child) => ({ ...child }));
      const updatedValue = updatedChildren.reduce((sum, child) => sum + child.value, 0);
      return {
        ...category,
        children: updatedChildren,
        value: updatedValue,
      };
    }
    return category;
  });
};

const HierarchicalTable = () => {
  const [data, setData] = useState(updateParentValues(initialData));
  const [inputs, setInputs] = useState({});

  const handleUpdateValue = (id, percent = false) => {
    setData((prevData) => {
      const updateData = (items) => {
        return items.map((item) => {
          if (item.children) {
            if (item.id === id) {
              const inputVal = parseFloat(inputs[id] || 0);
              if (!isNaN(inputVal) && inputVal > 0) {
                const totalOriginal = item.children.reduce((sum, child) => sum + child.originalValue, 0);
                const updatedChildren = item.children.map((child) => {
                  const proportion = child.originalValue / totalOriginal;
                  return { ...child, value: parseFloat((proportion * inputVal).toFixed(2)) };
                });
                setInputs((prevInputs) => ({ ...prevInputs, [id]: "" }));
                return { ...item, children: updatedChildren, value: inputVal };
              }
            }
            const updatedChildren = updateData(item.children);
            const newParentValue = updatedChildren.reduce((sum, child) => sum + child.value, 0);
            return { ...item, children: updatedChildren, value: newParentValue };
          }
          if (item.id === id) {
            const inputVal = parseFloat(inputs[id] || 0);
            const newValue = percent ? item.value + (item.value * inputVal) / 100 : inputVal;
            setInputs((prevInputs) => ({ ...prevInputs, [id]: "" }));
            return { ...item, value: newValue };
          }
          return item;
        });
      };
      return updateParentValues(updateData(prevData));
    });
  };

  return (
    <div className="table-container">
      <h2>Hierarchical Table</h2>
      <table>
        <thead>
          <tr>
            <th>Label</th>
            <th>Value</th>
            <th>Input</th>
            <th>Allocation %</th>
            <th>Allocation Val</th>
            <th>Variance %</th>
          </tr>
        </thead>
        <tbody>
          {data.map((category) => (
            <React.Fragment key={category.id}>
              <tr className="category-row">
                <td>{category.label}</td>
                <td>{category.value}</td>
                <td>
                  <input
                    type="number"
                    value={inputs[category.id] || ""}
                    onChange={(e) => setInputs({ ...inputs, [category.id]: e.target.value })}
                  />
                </td>
                <td>
                  <button onClick={() => handleUpdateValue(category.id, true)}>Apply %</button>
                </td>
                <td>
                  <button onClick={() => handleUpdateValue(category.id, false)}>Apply Val</button>
                </td>
                <td>{(((category.value - category.originalValue) / category.originalValue) * 100).toFixed(2)}%</td>
              </tr>
              {category.children.map((child) => (
                <tr key={child.id} className="child-row">
                  <td>-- {child.label}</td>
                  <td>{child.value}</td>
                  <td>
                    <input
                      type="number"
                      value={inputs[child.id] || ""}
                      onChange={(e) => setInputs({ ...inputs, [child.id]: e.target.value })}
                    />
                  </td>
                  <td>
                    <button onClick={() => handleUpdateValue(child.id, true)}>Apply %</button>
                  </td>
                  <td>
                    <button onClick={() => handleUpdateValue(child.id, false)}>Apply Val</button>
                  </td>
                  <td>{(((child.value - child.originalValue) / child.originalValue) * 100).toFixed(2)}%</td>
                </tr>
              ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default HierarchicalTable;
