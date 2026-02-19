import { useCallback, useMemo } from "react";
import type { DeckData } from "../types";
import { aggregateDeckNames } from "../utils/deckUtils";

interface DeckNameSummaryProps {
  deckList: DeckData[];
  onDeckNameClick?: (deckName: string) => void;
}

export const DeckNameSummary = ({ deckList, onDeckNameClick }: DeckNameSummaryProps) => {
  const summaryItems = useMemo(() => aggregateDeckNames(deckList), [deckList]);

  const handleClick = useCallback(
    (deckName: string) => {
      if (deckName !== "未設定" && onDeckNameClick) {
        onDeckNameClick(deckName);
      }
    },
    [onDeckNameClick]
  );

  return (
    <div className="mb-6">
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700">デッキ名</th>
              <th className="text-right px-4 py-3 text-sm font-semibold text-gray-700 w-24">件数</th>
              <th className="text-right px-4 py-3 text-sm font-semibold text-gray-700 w-24">割合</th>
            </tr>
          </thead>
          <tbody>
            {summaryItems.map(item => (
              <tr key={item.deckName} className="border-b border-gray-100 hover:bg-gray-50">
                <td
                  className={`px-4 py-3 text-sm ${
                    item.deckName === "未設定"
                      ? "text-gray-400 italic"
                      : "text-gray-800 cursor-pointer hover:text-blue-600 hover:underline"
                  }`}
                  onClick={() => handleClick(item.deckName)}
                >
                  {item.deckName}
                </td>
                <td className="text-right px-4 py-3 text-sm text-gray-700 font-medium">{item.count}</td>
                <td className="text-right px-4 py-3 text-sm text-gray-500">{item.percentage}%</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-gray-50 border-t border-gray-200">
              <td className="px-4 py-3 text-sm font-semibold text-gray-700">合計</td>
              <td className="text-right px-4 py-3 text-sm font-semibold text-gray-700">{deckList.length}</td>
              <td className="text-right px-4 py-3 text-sm text-gray-500">100%</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};
