import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAsync } from '@/hooks/useAsync';
import { adminService } from '@/services/adminService';
import { getErrorMessage } from '@/services/api';
import { formatDate } from '@/utils/helpers';
import Icon from '@/components/ui/Icon';
import Pagination from '@/components/ui/Pagination';
import { Message, Panel, Spinner, rowMotion } from '@/components/admin/AdminUI';

export default function Users() {
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState('');
  const [query, setQuery] = useState('');
  const users = useAsync(() => adminService.getUsers({ search: query, page }), [query, page]);

  return (
    <Panel
      title="Registered Users"
      action={
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setPage(0);
            setQuery(search.trim());
          }}
          className="relative w-full sm:w-auto"
        >
          <Icon name="search" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            className="input py-2 pl-9 sm:w-64"
            placeholder="Search name or email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </form>
      }
    >
      {users.loading ? (
        <Spinner />
      ) : users.error ? (
        <Message tone="error">{getErrorMessage(users.error)}</Message>
      ) : users.data.content.length === 0 ? (
        <Message>No users found.</Message>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
                <tr>
                  <th className="px-5 py-3">User</th>
                  <th className="px-5 py-3">Phone</th>
                  <th className="px-5 py-3">Role</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {users.data.content.map((u, i) => (
                  <motion.tr key={u.id} {...rowMotion(i)} className="hover:bg-gray-50">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                          {u.name.charAt(0).toUpperCase()}
                        </span>
                        <div className="min-w-0">
                          <p className="font-medium">{u.name}</p>
                          <p className="truncate text-xs text-gray-500">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3">{u.phone || '—'}</td>
                    <td className="px-5 py-3">
                      <span
                        className={`px-2 py-1 text-[11px] font-semibold uppercase ${
                          u.role === 'ROLE_ADMIN' ? 'bg-accent/15 text-accent-dark' : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {u.role === 'ROLE_ADMIN' ? 'Admin' : 'Customer'}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`text-xs font-semibold ${u.enabled ? 'text-green-700' : 'text-red-600'}`}>
                        {u.enabled ? 'Active' : 'Disabled'}
                      </span>
                    </td>
                    <td className="px-5 py-3">{formatDate(u.createdAt)}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="pb-6">
            <Pagination page={page} totalPages={users.data.totalPages} onChange={setPage} />
          </div>
        </>
      )}
    </Panel>
  );
}
