export interface EditableFieldProps {
  value: string | undefined;
  placeholder: string;
  textClass: string;
  containerClass: string;
  isEditing: boolean;
  editValue: string;
  inputRef: React.RefObject<HTMLInputElement | null>;
  onStartEditing: () => void;
  onChange: (v: string) => void;
  onBlur: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
}

export const EditableField = ({
  value,
  placeholder,
  textClass,
  containerClass,
  isEditing,
  editValue,
  inputRef,
  onStartEditing,
  onChange,
  onBlur,
  onKeyDown,
}: EditableFieldProps) => {
  if (isEditing) {
    return (
      <div className={containerClass}>
        <input
          ref={inputRef}
          type="text"
          aria-label={placeholder}
          value={editValue}
          onChange={e => onChange(e.target.value)}
          onBlur={onBlur}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          className={`${textClass} w-full bg-blue-50 border border-blue-300 rounded px-1 py-0.5 outline-none focus:ring-1 focus:ring-blue-500`}
        />
      </div>
    );
  }

  if (value) {
    return (
      <button
        type="button"
        className={`${containerClass} cursor-pointer hover:bg-gray-50 rounded px-1 -mx-1 transition-colors w-full text-left`}
        onClick={onStartEditing}
        title="クリックして編集"
      >
        <div className={`${textClass} truncate`} title={value}>
          {value}
        </div>
      </button>
    );
  }

  return (
    <button
      type="button"
      className={`${containerClass} cursor-pointer hover:bg-gray-50 rounded px-1 -mx-1 transition-colors w-full text-left`}
      onClick={onStartEditing}
    >
      <div className={`${textClass} text-gray-300 italic`}>{placeholder}</div>
    </button>
  );
};
