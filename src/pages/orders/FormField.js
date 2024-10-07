const FormField = ({ id, name, value, onChange, type = 'text', options = [] }) => (
    <div className="mb-4">
      <label htmlFor={id} className="block text-sm font-medium mb-1">{name}</label>
      {type === 'select' ? (
        <select
          id={id}
          name={id}
          value={value}
          onChange={onChange}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-opacity-50"
        >
          <option value="">Selecciona un método</option>
          {options.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
      ) : (
        <input
          type={type}
          id={id}
          name={id}
          value={value}
          onChange={onChange}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-opacity-50"
        />
      )}
    </div>
  );
export default FormField;
