export async function sendPrivateFeedback(endpoint, data, {fetcher=fetch,signal}={}) {
  const url=new URL(endpoint);
  if(url.protocol!=='https:' || url.username || url.password)throw new Error('configuration');
  const response=await fetcher(url.href,{method:'POST',credentials:'omit',headers:{'Content-Type':'application/json'},body:JSON.stringify(data),signal});
  if(response.status===429)throw new Error('limited');
  if(!response.ok)throw new Error('unavailable');
  const receipt=await response.json();
  if(receipt?.accepted!==true)throw new Error('unconfirmed');
  return receipt;
}
