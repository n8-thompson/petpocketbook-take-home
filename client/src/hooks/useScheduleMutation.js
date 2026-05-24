import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

export const scheduleKey = (isoDate) => ['schedule', isoDate];

// Shared TanStack Query plumbing for schedule mutations.
//
// Caller supplies:
//   mutationFn(isoDate, vars)         -> Promise<{ date, appointments }>
//   applyOptimistic(current, vars)    -> next appointments array
//   successMessage(vars)              -> string for toast.success
//   errorMessage(error, vars)         -> string for toast.error
//
// The hook handles cancel-in-flight, snapshot/rollback, cache write on success,
// and toast feedback identically for every mutation.
export function useScheduleMutation({
  isoDate,
  mutationFn,
  applyOptimistic,
  successMessage,
  errorMessage,
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (vars) => mutationFn(isoDate, vars),
    onMutate: async (vars) => {
      const key = scheduleKey(isoDate);
      await queryClient.cancelQueries({ queryKey: key });
      const previous = queryClient.getQueryData(key);
      const nextAppointments = applyOptimistic(
        previous?.appointments ?? [],
        vars
      );
      queryClient.setQueryData(key, {
        date: isoDate,
        appointments: nextAppointments,
      });
      return { previous, key, vars };
    },
    onError: (err, _vars, context) => {
      if (context?.previous && context?.key) {
        queryClient.setQueryData(context.key, context.previous);
      }
      toast.error(errorMessage(err, context?.vars ?? {}));
    },
    onSuccess: (data, _vars, context) => {
      queryClient.setQueryData(scheduleKey(data.date), data);
      toast.success(successMessage(context?.vars ?? {}));
    },
  });
}
