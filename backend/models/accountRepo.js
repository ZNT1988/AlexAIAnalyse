export async function getAccountByApiKey(key){
  // TODO: query DB; return { id, active, plan:{ quota, rateLimitPerMin }, usage:{ month } }
  return key === 'dev-key' ? { id:'dev', active:true, plan:{ quota:100000, rateLimitPerMin:120 }, usage:{ month:123 } } : null;
}
export async function setAccountActive(active){ /* update DB */ }
export async function linkStripe(customerId, subscriptionId){ /* persist link */ }
