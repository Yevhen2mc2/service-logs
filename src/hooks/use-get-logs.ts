import { useAppSelector } from './redux-hooks.ts';

export const useGetLogs = () => {
  const autoSave = useAppSelector((state) => state.app.autoSave);
  const logs = useAppSelector((state) => state.logs.logs);

  return {
    autoSave,
    drafts: logs.filter((log) => log.draft),
    serviceLogs: logs.filter((log) => !log.draft),
  };
};
