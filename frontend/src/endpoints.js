
export async function get(dir){
  let response = await fetch(`http://localhost:3001${dir}`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }else{
    let jsonData = await response.json()
    return jsonData
  }
  }
  
export async function post(dir, body){
  const request = new Request(`http://localhost:3001${dir}`, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  let response = await fetch(request);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }else{
    return response
  }
}
