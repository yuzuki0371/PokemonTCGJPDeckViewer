export interface DeleteButtonProps {
  positionClass: string;
  onClick: () => void;
}

export const DeleteButton = ({ positionClass, onClick }: DeleteButtonProps) => (
  <button
    type="button"
    onClick={onClick}
    className={`${positionClass} bg-red-500 hover:bg-red-600 text-white rounded-full p-1 transition-colors shadow-md`}
    aria-label="削除"
    title="削除"
  >
    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  </button>
);
