import axios from 'axios';



export async function loginUser(email: string, password: string): Promise<any> {
  const response = await axios.post('/api/login', { email, password });
  return response.data;
}

export async function registerUser(name:string, email: string, password: string): Promise<any> {
  const response = await axios.post('/api/register', { name, email, password });
  return response.data;
}



