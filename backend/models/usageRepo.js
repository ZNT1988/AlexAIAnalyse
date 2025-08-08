const store = new Map();
export async function incrementUsage(accountId, n){
  const u = store.get(accountId) || { month:0 };
  u.month += n; store.set(accountId, u);
}
