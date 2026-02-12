import { memo } from "react";

interface EmptyStateProps {
  message?: string;
  icon?: React.ReactNode;
}

const EmptyStateComponent = ({
  message = "デッキコードを入力してデッキレシピを追加してください",
  icon,
}: EmptyStateProps) => {
  const defaultIcon = (
    <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1}
        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
      />
    </svg>
  );

  return (
    <div className="text-center py-12">
      <div className="text-gray-400 mb-4">{icon || defaultIcon}</div>
      <p className="text-gray-500 text-lg">{message}</p>
    </div>
  );
};

// memo化して不要な再レンダリングを防ぐ
export const EmptyState = memo(EmptyStateComponent);
