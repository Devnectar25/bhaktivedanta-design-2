import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { defaultSpecialitiesState, ensureStandardTabs } from '../../../data/defaultSpecialities';
import { getSpecialitiesState, saveSpecialitiesState } from '../../../utils/api';

const AddCategory = () => {
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('edit');
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [order, setOrder] = useState('1');
  const [status, setStatus] = useState(true);

  const [state, setState] = useState(defaultSpecialitiesState);

  useEffect(() => {
    getSpecialitiesState(defaultSpecialitiesState).then(res => {
      if (res && res.specialities) {
        res.specialities.forEach(ensureStandardTabs);
      }
      setState(res);

      if (editId && res && res.categories) {
        const match = res.categories.find(c => c.id === editId);
        if (match) {
          setName(match.name || '');
          setDescription(match.description || '');
          setOrder(match.order ? match.order.toString() : '1');
          setStatus(match.status !== false);
        }
      }
    });
  }, [editId]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name) {
      alert("Category name is required.");
      return;
    }

    let updatedCats;
    if (editId) {
      updatedCats = state.categories.map(c => {
        if (c.id === editId) {
          return {
            ...c,
            name,
            description,
            order: parseInt(order) || 1,
            status
          };
        }
        return c;
      });
    } else {
      const newCat = {
        id: `c${Date.now()}`,
        name,
        description,
        order: parseInt(order) || 1,
        status
      };
      updatedCats = [...state.categories, newCat];
    }

    const newState = { ...state, categories: updatedCats };
    saveSpecialitiesState(newState).then(() => {
      navigate('/admin/specialities');
    });
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-slate-400 text-xs mb-2 font-medium font-sans">
        <span>Dashboard</span>
        <span className="material-symbols-outlined text-xs">chevron_right</span>
        <span>Specialities</span>
        <span className="material-symbols-outlined text-xs">chevron_right</span>
        <span className="text-slate-600 font-bold">{editId ? 'Edit Category' : 'Add Category'}</span>
      </nav>

      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800">{editId ? 'Edit Category Details' : 'Add New Category'}</h2>
        <p className="text-sm text-slate-500 font-medium">Configure speciality categories for navigation hierarchy.</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200/80 p-5 space-y-4 text-xs text-slate-700">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1 sm:col-span-2">
            <label className="font-bold text-slate-500 uppercase">Category Name *</label>
            <input 
              type="text" 
              className="w-full bg-white border border-slate-200 focus:border-slate-300 px-3 py-2 rounded-lg outline-none font-medium" 
              placeholder="e.g. General Specialities"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-500 uppercase">Order Preference</label>
            <input 
              type="number" 
              className="w-full bg-white border border-slate-200 focus:border-slate-300 px-3 py-2 rounded-lg outline-none font-medium" 
              placeholder="1"
              value={order}
              onChange={(e) => setOrder(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-500 uppercase">Status</label>
            <select 
              className="w-full bg-white border border-slate-200 focus:border-slate-300 px-3 py-2 rounded-lg outline-none font-medium cursor-pointer"
              value={status ? 'Active' : 'Inactive'}
              onChange={(e) => setStatus(e.target.value === 'Active')}
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>

        <div className="space-y-1">
          <label className="font-bold text-slate-500 uppercase">Short Description</label>
          <textarea 
            className="w-full bg-white border border-slate-200 focus:border-slate-300 px-3 py-2 rounded-lg outline-none font-medium" 
            placeholder="Introduce the category to help patients select..."
            rows="3"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
          <button 
            type="button" 
            onClick={() => navigate('/admin/specialities')} 
            className="px-5 py-2 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 font-semibold"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="bg-[#fea619] hover:bg-amber-500 text-slate-900 px-6 py-2 rounded-lg font-bold transition-all shadow-sm"
          >
            {editId ? 'Save Category' : 'Create Category'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCategory;
